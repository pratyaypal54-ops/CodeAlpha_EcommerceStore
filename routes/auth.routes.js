const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get, all } = require('../db/database');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

// Helper to sign JWT tokens (valid for 7 days)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 1. POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    // Insert user into SQLite database
    const result = await run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, 'customer']
    );

    const newUser = {
      id: result.id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'customer'
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
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
      'SELECT id, name, email, password, role, created_at FROM users WHERE email = ?',
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
    // Fetch total orders count
    const orderStats = await get(
      'SELECT COUNT(*) as order_count FROM orders WHERE user_id = ?',
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      user: {
        ...req.user,
        total_orders: orderStats ? orderStats.order_count : 0
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

// 4. PUT /api/auth/profile - Update Profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (name) {
      await run('UPDATE users SET name = ? WHERE id = ?', [name.trim(), userId]);
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
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
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
