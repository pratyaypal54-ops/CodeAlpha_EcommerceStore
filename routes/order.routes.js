const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db/database');
const { authenticate, optionalAuth } = require('../middleware/auth');

// 1. POST /api/orders - Place a new order
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod = 'credit_card',
      items,
      discountCode
    } = req.body;

    // Validation
    if (!customerName || !customerEmail || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order details or cart items.'
      });
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zip) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete shipping address (street, city, postal code).'
      });
    }

    // Verify each product and fetch authoritative prices directly from DB
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await get('SELECT id, title, price, stock, image FROM products WHERE id = ?', [item.productId]);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} was not found.`
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Only ${product.stock} available.`
        });
      }

      const itemTotal = Number((product.price * qty).toFixed(2));
      subtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        title: product.title,
        price: product.price,
        quantity: qty,
        image: product.image,
        subtotal: itemTotal
      });
    }

    subtotal = Number(subtotal.toFixed(2));

    // Calculate Discounts
    let discount = 0;
    if (discountCode) {
      const code = discountCode.toUpperCase().trim();
      if (code === 'CODEALPHA15' || code === 'ALPHA15') {
        discount = Number((subtotal * 0.15).toFixed(2));
      } else if (code === 'ALPHA10' || code === 'WELCOME10') {
        discount = Number((subtotal * 0.10).toFixed(2));
      }
    }

    // Calculate Shipping (Free shipping over $50 or with FREESHIP code)
    let shippingFee = subtotal >= 50 || (discountCode && discountCode.toUpperCase().trim() === 'FREESHIP') ? 0 : 9.99;
    
    // Calculate Tax (8% estimated)
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * 0.08).toFixed(2));

    // Calculate Total
    const total = Number((taxableAmount + tax + shippingFee).toFixed(2));

    // Generate Unique Order Number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-2025-${randomSuffix}`;

    // Get user id if user is logged in
    const userId = req.user ? req.user.id : null;

    // Insert Order Record
    const orderResult = await run(
      `INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, payment_method, subtotal, discount, tax, shipping_fee, total, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        userId,
        customerName.trim(),
        customerEmail.toLowerCase().trim(),
        customerPhone || '',
        JSON.stringify(shippingAddress),
        paymentMethod,
        subtotal,
        discount,
        tax,
        shippingFee,
        total,
        'Processing'
      ]
    );

    const orderId = orderResult.id;

    // Insert Order Items and Update Product Stocks
    for (const item of validatedItems) {
      await run(
        `INSERT INTO order_items (order_id, product_id, title, price, quantity, image, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.title, item.price, item.quantity, item.image, item.subtotal]
      );

      // Decrement stock
      await run(
        'UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        id: orderId,
        orderNumber,
        customerName,
        customerEmail,
        shippingAddress,
        paymentMethod,
        subtotal,
        discount,
        tax,
        shippingFee,
        total,
        status: 'Processing',
        items: validatedItems,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process order.'
    });
  }
});

// 2. GET /api/orders/my-orders - Logged-in user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await all(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Fetch items for each order
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        return {
          ...order,
          shipping_address: JSON.parse(order.shipping_address || '{}'),
          items
        };
      })
    );

    return res.status(200).json({
      success: true,
      orders: populatedOrders
    });
  } catch (error) {
    console.error('Fetch My Orders Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders.'
    });
  }
});

// 3. GET /api/orders/:orderNumber - Track / View single order
router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await get('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    const items = await all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    return res.status(200).json({
      success: true,
      order: {
        ...order,
        shipping_address: JSON.parse(order.shipping_address || '{}'),
        items
      }
    });
  } catch (error) {
    console.error('Fetch Order Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details.'
    });
  }
});

// 4. PUT /api/orders/:orderNumber/status - Status simulator for demo & tracking
router.put('/:orderNumber/status', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await get('SELECT id FROM orders WHERE order_number = ?', [orderNumber]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    await run('UPDATE orders SET status = ? WHERE order_number = ?', [status, orderNumber]);

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${status}".`,
      orderNumber,
      status
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status.'
    });
  }
});

module.exports = router;
