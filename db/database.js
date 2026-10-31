const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure data directory exists
const dbDir = path.resolve(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH 
  ? path.resolve(__dirname, '..', process.env.DB_PATH) 
  : path.join(dbDir, 'ecommerce.db');

// Connect to SQLite Database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`📦 Connected to SQLite database at: ${dbPath}`);
  }
});

// Promisified helper methods for clean async/await syntax
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize Database Tables
const initDatabase = async () => {
  try {
    // 1. Users Table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        seller_name TEXT,
        seller_bio TEXT,
        seller_rating REAL DEFAULT 5.0,
        seller_reviews_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Products Table
    await run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        original_price REAL,
        description TEXT NOT NULL,
        short_description TEXT,
        image TEXT NOT NULL,
        gallery TEXT,
        stock INTEGER NOT NULL DEFAULT 10,
        rating REAL DEFAULT 4.5,
        reviews_count INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        specs TEXT,
        seller_id INTEGER DEFAULT 1,
        seller_name TEXT DEFAULT 'Apex Tech & Audio',
        seller_rating REAL DEFAULT 4.9,
        seller_reviews_count INTEGER DEFAULT 1480,
        variants TEXT,
        price_history TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Orders Table
    await run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        shipping_address TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        subtotal REAL NOT NULL,
        discount REAL DEFAULT 0,
        tax REAL NOT NULL,
        shipping_fee REAL NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'Processing',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 4. Order Items Table
    await run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        image TEXT,
        selected_variant TEXT,
        subtotal REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // 5. Reviews Table
    await run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        pros TEXT,
        cons TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Safe column migrations for existing databases
    const safeAddColumn = async (table, columnDef) => {
      try {
        await run(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
      } catch (err) {
        // Column already exists or table locked - safe to ignore
      }
    };

    await safeAddColumn('users', 'seller_name TEXT');
    await safeAddColumn('users', 'seller_bio TEXT');
    await safeAddColumn('users', 'seller_rating REAL DEFAULT 5.0');
    await safeAddColumn('users', 'seller_reviews_count INTEGER DEFAULT 0');

    await safeAddColumn('products', 'seller_id INTEGER DEFAULT 1');
    await safeAddColumn('products', "seller_name TEXT DEFAULT 'Apex Tech & Audio'");
    await safeAddColumn('products', 'seller_rating REAL DEFAULT 4.9');
    await safeAddColumn('products', 'seller_reviews_count INTEGER DEFAULT 1480');
    await safeAddColumn('products', 'variants TEXT');
    await safeAddColumn('products', 'price_history TEXT');

    await safeAddColumn('order_items', 'selected_variant TEXT');

    await safeAddColumn('reviews', 'pros TEXT');
    await safeAddColumn('reviews', 'cons TEXT');

    console.log('✅ SQLite Schema initialized with Marketplace & AI columns successfully.');
  } catch (error) {
    console.error('❌ Error initializing database schema:', error);
  }
};

module.exports = {
  db,
  run,
  get,
  all,
  initDatabase
};
