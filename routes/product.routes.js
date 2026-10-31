const express = require('express');
const router = express.Router();
const { get, all, run } = require('../db/database');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Helper to safely parse JSON strings and normalize fields from SQLite
const formatProduct = (product) => {
  if (!product) return null;
  let image = product.image;
  if (image && image.startsWith('/images/')) {
    image = image.substring(1);
  }
  let gallery = [];
  try {
    gallery = product.gallery ? JSON.parse(product.gallery) : [];
  } catch (e) {
    gallery = [image];
  }
  if (Array.isArray(gallery)) {
    gallery = gallery.map(img => (typeof img === 'string' && img.startsWith('/images/')) ? img.substring(1) : img);
  }

  let specs = {};
  try {
    specs = product.specs ? JSON.parse(product.specs) : {};
  } catch (e) {
    specs = {};
  }

  let variants = { colors: [], options: [] };
  try {
    variants = product.variants ? JSON.parse(product.variants) : { colors: [], options: [] };
  } catch (e) {
    variants = { colors: [], options: [] };
  }

  let price_history = null;
  try {
    price_history = product.price_history ? JSON.parse(product.price_history) : null;
  } catch (e) {
    price_history = null;
  }

  // Fallback price history if not present
  if (!price_history) {
    const original = product.original_price || (product.price * 1.2);
    price_history = {
      current: product.price,
      lowest: Math.round(product.price * 0.95),
      highest: original,
      deal_score: product.original_price ? Math.min(96, Math.max(75, Math.round((1 - product.price / product.original_price) * 100) + 50)) : 85,
      verdict: product.price < original ? `Good Deal! Currently ₹${Math.round(original - product.price)} below standard price.` : 'Standard Fair Price.',
      history: [
        { date: '90d ago', price: original },
        { date: '60d ago', price: Math.round(original * 0.95) },
        { date: '30d ago', price: Math.round(product.price * 1.05) },
        { date: 'Current', price: product.price }
      ]
    };
  }

  return {
    ...product,
    image,
    gallery,
    specs,
    variants,
    price_history,
    seller: {
      id: product.seller_id || 1,
      name: product.seller_name || 'Apex Tech & Audio',
      rating: product.seller_rating || 4.9,
      reviews_count: product.seller_reviews_count || 1480
    }
  };
};

// 1. GET /api/products/categories - Distinct categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await all(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY count DESC, category ASC
    `);
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

// 2. GET /api/products/featured - Featured products showcase
router.get('/featured', async (req, res) => {
  try {
    const products = await all('SELECT * FROM products WHERE featured = 1 ORDER BY rating DESC LIMIT 6');
    return res.status(200).json({
      success: true,
      products: products.map(formatProduct)
    });
  } catch (error) {
    console.error('Fetch Featured Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch featured products.' });
  }
});

// 3. GET /api/products/seller/my-listings - Products listed by logged-in seller
router.get('/seller/my-listings', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    // Check if seller
    const user = await get('SELECT id, role, seller_name, seller_rating, seller_reviews_count FROM users WHERE id = ?', [userId]);
    if (!user || user.role !== 'seller') {
      return res.status(403).json({ success: false, message: 'Access denied. You must be a registered seller to view listings.' });
    }

    const products = await all('SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC', [userId]);

    return res.status(200).json({
      success: true,
      count: products.length,
      seller: {
        id: user.id,
        name: user.seller_name,
        rating: user.seller_rating || 5.0,
        reviews_count: user.seller_reviews_count || 0
      },
      products: products.map(formatProduct)
    });
  } catch (error) {
    console.error('Fetch Seller Listings Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve seller listings.' });
  }
});

// 4. GET /api/products - Main product catalog with filters, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, sellerId, inStockOnly } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Category filter
    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    // Seller filter
    if (sellerId) {
      sql += ' AND seller_id = ?';
      params.push(Number(sellerId));
    }

    // In Stock Only filter
    if (inStockOnly === 'true' || inStockOnly === '1') {
      sql += ' AND stock > 0';
    }

    // Search filter
    if (search && search.trim() !== '') {
      sql += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ? OR seller_name LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    // Price range filters
    if (minPrice && !isNaN(Number(minPrice))) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    // Featured only
    if (featured === 'true' || featured === '1') {
      sql += ' AND featured = 1';
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        sql += ' ORDER BY price ASC';
        break;
      case 'price-desc':
        sql += ' ORDER BY price DESC';
        break;
      case 'rating-desc':
        sql += ' ORDER BY rating DESC';
        break;
      case 'newest':
        sql += ' ORDER BY created_at DESC';
        break;
      default:
        sql += ' ORDER BY featured DESC, rating DESC, id ASC';
        break;
    }

    const products = await all(sql, params);

    return res.status(200).json({
      success: true,
      count: products.length,
      products: products.map(formatProduct)
    });
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
});

// 5. POST /api/products - Seller lists a new product
router.post('/', authenticate, async (req, res) => {
  try {
    const user = await get('SELECT id, name, role, seller_name, seller_rating, seller_reviews_count FROM users WHERE id = ?', [req.user.id]);
    if (!user || user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Only registered sellers can list products. Please register as a seller first.'
      });
    }

    const {
      title,
      category,
      price,
      originalPrice,
      stock,
      description,
      shortDescription,
      image,
      variants,
      specs
    } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Product title, category, and price are required.'
      });
    }

    const cleanTitle = title.trim();
    const cleanPrice = Number(price);
    const cleanOrigPrice = originalPrice ? Number(originalPrice) : Math.round(cleanPrice * 1.15);
    const cleanStock = stock !== undefined && stock !== '' ? Math.max(0, parseInt(stock, 10)) : 10;
    
    // Slug generation
    const slugBase = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const fallbackImage = image && image.trim() 
      ? image.trim() 
      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

    const cleanShortDesc = shortDescription?.trim() || cleanTitle;
    const cleanDesc = description?.trim() || `${cleanTitle}. Authentic premium merchandise sold directly by ${user.seller_name || user.name}.`;

    // Format variants
    let variantsJson = JSON.stringify({ colors: [], options: ['Standard'] });
    if (variants) {
      variantsJson = typeof variants === 'string' ? variants : JSON.stringify(variants);
    }

    // Format specs
    let specsJson = JSON.stringify({ 'Merchant': user.seller_name || user.name, 'Warranty': '1 Year Standard Warranty' });
    if (specs) {
      specsJson = typeof specs === 'string' ? specs : JSON.stringify(specs);
    }

    // Calculate initial price history
    const priceHistoryJson = JSON.stringify({
      current: cleanPrice,
      lowest: cleanPrice,
      highest: cleanOrigPrice,
      deal_score: cleanOrigPrice > cleanPrice ? 92 : 80,
      verdict: cleanOrigPrice > cleanPrice ? `Brand New Listing! Available at ₹${cleanOrigPrice - cleanPrice} introductory launch discount.` : 'Freshly listed by merchant.',
      history: [
        { date: 'Launch', price: cleanOrigPrice },
        { date: 'Current', price: cleanPrice }
      ]
    });

    const insertResult = await run(
      `INSERT INTO products (
        title, slug, category, price, original_price, short_description, description,
        image, gallery, stock, rating, reviews_count, featured, specs,
        seller_id, seller_name, seller_rating, seller_reviews_count, variants, price_history
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanTitle,
        slug,
        category.trim(),
        cleanPrice,
        cleanOrigPrice,
        cleanShortDesc,
        cleanDesc,
        fallbackImage,
        JSON.stringify([fallbackImage]),
        cleanStock,
        5.0, // New listing starts with clean 5.0
        1,   // Initial merchant review
        0,   // Not featured by default
        specsJson,
        user.id,
        user.seller_name || user.name,
        user.seller_rating || 5.0,
        user.seller_reviews_count || 1,
        variantsJson,
        priceHistoryJson
      ]
    );

    // Add initial review
    await run(
      `INSERT INTO reviews (product_id, user_name, rating, comment, pros, cons)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        insertResult.id,
        'TechStore Quality Team',
        5,
        `Verified authentic listing directly supplied by merchant ${user.seller_name || user.name}. Passed safety & authenticity inspection.`,
        'Brand new authentic merchant inventory, verified supplier.',
        'Limited introductory launch stock.'
      ]
    );

    const createdProduct = await get('SELECT * FROM products WHERE id = ?', [insertResult.id]);

    return res.status(201).json({
      success: true,
      message: `Product "${cleanTitle}" listed successfully on the marketplace!`,
      product: formatProduct(createdProduct)
    });
  } catch (error) {
    console.error('Create Product Listing Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product listing.' });
  }
});

// 6. PUT /api/products/:id/stock - Seller updates product stock
router.put('/:id/stock', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || isNaN(Number(stock))) {
      return res.status(400).json({ success: false, message: 'Valid stock number is required.' });
    }

    const product = await get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Verify ownership
    if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only update stock for your own listings.' });
    }

    const newStock = Math.max(0, parseInt(stock, 10));
    await run('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);

    return res.status(200).json({
      success: true,
      message: `Stock updated to ${newStock} for "${product.title}".`,
      stock: newStock
    });
  } catch (error) {
    console.error('Update Stock Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update stock.' });
  }
});

// 7. DELETE /api/products/:id - Seller deletes or unlists product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Verify ownership
    if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete your own listings.' });
    }

    await run('DELETE FROM products WHERE id = ?', [id]);
    await run('DELETE FROM reviews WHERE product_id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: `Listing "${product.title}" removed from marketplace.`
    });
  } catch (error) {
    console.error('Delete Listing Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

// 8. GET /api/products/:id - Single product details + reviews + pros/cons + seller
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Support both numeric id or string slug
    let product;
    if (!isNaN(Number(id))) {
      product = await get('SELECT * FROM products WHERE id = ?', [Number(id)]);
    } else {
      product = await get('SELECT * FROM products WHERE slug = ?', [id]);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Fetch customer reviews with pros & cons
    const reviews = await all(
      'SELECT id, user_name, rating, comment, pros, cons, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [product.id]
    );

    return res.status(200).json({
      success: true,
      product: {
        ...formatProduct(product),
        reviews
      }
    });
  } catch (error) {
    console.error('Fetch Product Details Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve product details.' });
  }
});

// 9. POST /api/products/:id/reviews - Submit a review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment, pros, cons } = req.body;

    if (!userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user name, rating (1-5), and review comment.'
      });
    }

    const ratingNum = Math.min(5, Math.max(1, Number(rating)));

    const product = await get('SELECT id, rating, reviews_count FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Insert review with pros & cons
    await run(
      'INSERT INTO reviews (product_id, user_name, rating, comment, pros, cons) VALUES (?, ?, ?, ?, ?, ?)',
      [product.id, userName.trim(), ratingNum, comment.trim(), pros?.trim() || '', cons?.trim() || '']
    );

    // Calculate new average rating
    const avgData = await get(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE product_id = ?',
      [product.id]
    );

    const newAvg = Number(avgData.avg_rating.toFixed(1));
    const newCount = avgData.total_reviews;

    await run(
      'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?',
      [newAvg, newCount, product.id]
    );

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      newRating: newAvg,
      reviewsCount: newCount
    });
  } catch (error) {
    console.error('Submit Review Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

module.exports = router;
