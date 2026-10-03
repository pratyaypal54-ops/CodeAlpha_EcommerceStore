const express = require('express');
const router = express.Router();
const { get, all, run } = require('../db/database');

// Helper to safely parse JSON strings and normalize image paths from SQLite
const formatProduct = (product) => {
  if (!product) return null;
  let image = product.image;
  if (image && image.startsWith('/images/')) {
    image = image.substring(1);
  }
  let gallery = product.gallery ? JSON.parse(product.gallery) : [];
  if (Array.isArray(gallery)) {
    gallery = gallery.map(img => (typeof img === 'string' && img.startsWith('/images/')) ? img.substring(1) : img);
  }
  return {
    ...product,
    image,
    gallery,
    specs: product.specs ? JSON.parse(product.specs) : {}
  };
};

// 1. GET /api/products/categories - Distinct categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await all(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY category ASC
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
    const products = await all('SELECT * FROM products WHERE featured = 1 LIMIT 4');
    return res.status(200).json({
      success: true,
      products: products.map(formatProduct)
    });
  } catch (error) {
    console.error('Fetch Featured Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch featured products.' });
  }
});

// 3. GET /api/products - Main product catalog with filters, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Category filter
    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    // Search filter
    if (search && search.trim() !== '') {
      sql += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
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

// 4. GET /api/products/:id - Single product details + reviews
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

    // Fetch customer reviews for this product
    const reviews = await all(
      'SELECT id, user_name, rating, comment, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
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

// 5. POST /api/products/:id/reviews - Submit a review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;

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

    // Insert review
    await run(
      'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
      [product.id, userName.trim(), ratingNum, comment.trim()]
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
