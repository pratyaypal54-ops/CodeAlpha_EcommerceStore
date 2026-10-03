# TechStore — Modern E-Commerce Store

A full-stack, clean, and modern electronics and gadgets e-commerce web application with realistic product catalog, multi-category browsing, real-time cart, and checkout.

---

## 🌟 Features

- **Product Listings & Catalog:**
  - Real-time search by product title and description
  - Multi-category filtering (Phones, Monitors, TVs, Tablets, Consoles, Audio, Wearables, Peripherals, Accessories)
  - Price range slider (₹1,000 - ₹100,000)
  - Sorting options (Featured, Price: Low to High, Price: High to Low, Customer Rating, Newest)
  - In-stock availability toggle
- **Product Details:**
  - Detailed product overview with specifications table
  - Multiple image gallery with thumbnail preview
  - Verified customer ratings and customer review submission
  - Direct "Buy Now" and "Add to Cart" with quantity controls
- **Shopping Cart:**
  - Slide-out responsive cart drawer
  - Quantity adjustments (`+` / `-`) and instant item removal
  - Free shipping progress bar (Free shipping on orders over ₹499)
  - Discount coupon support (use `TECH15` for 15% off)
  - Automatic subtotal, GST (18%), shipping, and total calculation
- **Order Processing & Checkout:**
  - Multi-step checkout (1. Shipping Address, 2. Payment Method, 3. Review)
  - Payment simulation (Credit/Debit Card with live card preview, PayPal/UPI, Cash on Delivery)
  - Order confirmation screen with printable receipt
  - Live order tracking timeline (Pending → Processing → Shipped → Delivered)
  - Order search tool by order number (e.g., `ORD-2025-10492`)
- **User Authentication & Accounts:**
  - User registration & login with password hashing (`bcryptjs`) and JWT authentication (`jsonwebtoken`)
  - One-click demo login button for quick reviewer evaluation
  - User dashboard with order history and tracking links
- **Database Persistence:**
  - SQLite database storing products, users, orders, order items, and reviews
  - Auto-initializes and auto-seeds on first run so it works out of the box with zero setup

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, Vanilla CSS3 (Custom design system, glassmorphism, responsive layout, Dark/Light mode toggle), JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Security:** Bcrypt.js (Password Hashing), JSON Web Tokens (JWT)

---

## 🚀 How to Run Locally

### Option 1: Double-Click (Easiest for Windows)
Simply double-click `start.bat` or `run.bat` in the project root. It will start the server and open your browser automatically.

### Option 2: Using the Terminal
1. Open terminal inside the project folder:
   ```bash
   cd "TechStore"
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser at:
   ```
   http://localhost:5000
   ```

> **Note on VS Code Live Server:** If you prefer opening the frontend via VS Code "Go Live" (port 5500), the app has built-in dual-mode support that automatically connects to your local Express server, and also provides instant offline sample data if the server is not started yet.

---

## 👤 Demo Login Credentials

For quick evaluation and testing:
- **Email:** `demo@techstore.com`
- **Password:** `password123`

*(You can also click the "Auto-Fill" button inside the Sign In modal to populate these credentials instantly).*

---

## 📦 Database Schema Overview

- **users:** `id`, `name`, `email`, `password`, `role`, `created_at`
- **products:** `id`, `title`, `slug`, `category`, `price`, `original_price`, `description`, `short_description`, `image`, `gallery`, `stock`, `rating`, `reviews_count`, `featured`, `specs`
- **orders:** `id`, `order_number`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `payment_method`, `subtotal`, `discount`, `tax`, `shipping_fee`, `total`, `status`, `created_at`
- **order_items:** `id`, `order_id`, `product_id`, `title`, `price`, `quantity`, `image`, `subtotal`
- **reviews:** `id`, `product_id`, `user_name`, `rating`, `comment`, `created_at`

---

## 👨‍💻 Author

**Pratyay Pal**  
Full-Stack Developer  
Email: pratyaypal54@gmail.com
