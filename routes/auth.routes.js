const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get, all } = require('../db/database');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

// Helper to sign JWT tokens (valid for 7 days)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      seller_name: user.seller_name || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 1. POST /api/auth/register - Register a new user (Customer or Seller)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'customer', sellerName, sellerBio } = req.body;

    // Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Check if email already registered
    const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role === 'seller' ? 'seller' : 'customer';
    const storeName = userRole === 'seller' ? (sellerName?.trim() || `${name.trim()}'s Store`) : null;
    const storeBio = userRole === 'seller' ? (sellerBio?.trim() || 'Verified Independent Merchant on TechStore') : null;

    // Insert user into SQLite database
    const result = await run(
      `INSERT INTO users (name, email, password, role, seller_name, seller_bio, seller_rating, seller_reviews_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), email.toLowerCase().trim(), hashedPassword, userRole, storeName, storeBio, 5.0, 0]
    );

    const newUser = {
      id: result.id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: userRole,
      seller_name: storeName,
      seller_bio: storeBio,
      seller_rating: 5.0,
      seller_reviews_count: 0
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: userRole === 'seller' ? 'Seller account created successfully!' : 'Account created successfully!',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
});

// 2. POST /api/auth/login - User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    // Find user
    const user = await get(
      `SELECT id, name, email, password, role, seller_name, seller_bio, seller_rating, seller_reviews_count, created_at
       FROM users WHERE email = ?`,
      [email.toLowerCase().trim()]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Welcome back, ' + user.name + '!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        seller_name: user.seller_name,
        seller_bio: user.seller_bio,
        seller_rating: user.seller_rating || 5.0,
        seller_reviews_count: user.seller_reviews_count || 0,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
});

// 3. GET /api/auth/me - Current User Profile & stats
router.get('/me', authenticate, async (req, res) => {
  try {
    // Fetch fresh user record
    const user = await get(
      `SELECT id, name, email, role, seller_name, seller_bio, seller_rating, seller_reviews_count, created_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Fetch total orders count
    const orderStats = await get(
      'SELECT COUNT(*) as order_count FROM orders WHERE user_id = ?',
      [req.user.id]
    );

    // Fetch total products listed if seller
    let sellerProductsCount = 0;
    if (user.role === 'seller') {
      const prodStats = await get(
        'SELECT COUNT(*) as prod_count FROM products WHERE seller_id = ?',
        [user.id]
      );
      sellerProductsCount = prodStats ? prodStats.prod_count : 0;
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        total_orders: orderStats ? orderStats.order_count : 0,
        seller_products_count: sellerProductsCount
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.'
    });
  }
});

// 4. POST /api/auth/become-seller - Upgrade current customer to a Seller
router.post('/become-seller', authenticate, async (req, res) => {
  try {
    const { sellerName, sellerBio } = req.body;
    const userId = req.user.id;

    const user = await get('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const storeName = (sellerName && sellerName.trim()) || `${user.name}'s Store`;
    const storeBio = (sellerBio && sellerBio.trim()) || 'Verified Independent Merchant on TechStore';

    await run(
      `UPDATE users SET role = 'seller', seller_name = ?, seller_bio = ?, seller_rating = 5.0, seller_reviews_count = 0
       WHERE id = ?`,
      [storeName, storeBio, userId]
    );

    const updated = await get(
      `SELECT id, name, email, role, seller_name, seller_bio, seller_rating, seller_reviews_count, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    const token = generateToken(updated);

    return res.status(200).json({
      success: true,
      message: `Congratulations! You are now registered as a seller for "${storeName}".`,
      token,
      user: updated
    });
  } catch (error) {
    console.error('Become Seller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upgrade account to seller.'
    });
  }
});

// 5. GET /api/auth/sellers - Fetch all active sellers on the marketplace
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await all(
      `SELECT u.id, u.name, u.email, u.seller_name, u.seller_bio, u.seller_rating, u.seller_reviews_count,
              COUNT(p.id) as total_products
       FROM users u
       LEFT JOIN products p ON u.id = p.seller_id
       WHERE u.role = 'seller'
       GROUP BY u.id
       ORDER BY u.seller_rating DESC`
    );

    return res.status(200).json({
      success: true,
      sellers
    });
  } catch (error) {
    console.error('Fetch Sellers Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch sellers.' });
  }
});

// 6. PUT /api/auth/profile - Update Profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, sellerName, sellerBio, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (name) {
      await run('UPDATE users SET name = ? WHERE id = ?', [name.trim(), userId]);
    }

    if (sellerName) {
      await run('UPDATE users SET seller_name = ? WHERE id = ?', [sellerName.trim(), userId]);
    }

    if (sellerBio !== undefined) {
      await run('UPDATE users SET seller_bio = ? WHERE id = ?', [sellerBio.trim(), userId]);
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password.'
        });
      }

      const user = await get('SELECT password FROM users WHERE id = ?', [userId]);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      await run('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);
    }

    const updated = await get(
      `SELECT id, name, email, role, seller_name, seller_bio, seller_rating, seller_reviews_count, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updated
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.'
    });
  }
});

module.exports = router;
