const bcrypt = require('bcryptjs');
const { db, run, get, all, initDatabase } = require('./database');

// Realistic, human-written products catalog
const seedProducts = [
  {
    title: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    category: 'Audio',
    price: 129.99,
    original_price: 159.99,
    short_description: 'Comfortable over-ear headphones with deep bass and 40-hour battery life.',
    description: 'Enjoy your favorite music, podcasts, and work calls without distractions. These over-ear headphones feature active noise cancellation to block out background chatter, soft memory-foam ear cups for all-day comfort, and up to 40 hours of playtime on a single charge. Connects easily with phones, laptops, and tablets via Bluetooth 5.2.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 18,
    rating: 4.8,
    reviews_count: 52,
    featured: 1,
    specs: JSON.stringify({
      'Type': 'Over-Ear Wireless',
      'Battery Life': 'Up to 40 Hours',
      'Charging Time': '1.5 Hours (USB-C)',
      'Noise Cancellation': 'Active Noise Cancellation (ANC)',
      'Connectivity': 'Bluetooth 5.2 + 3.5mm Audio Cable',
      'Warranty': '1 Year Replacement'
    })
  },
  {
    title: 'Daily Fitness Smartwatch with Heart Rate Tracker',
    slug: 'daily-fitness-smartwatch',
    category: 'Wearables',
    price: 89.99,
    original_price: 119.99,
    short_description: 'Tracks steps, workouts, sleep, and heart rate with a 7-day battery.',
    description: 'A clean and practical smartwatch designed for everyday fitness. Track your daily steps, distance, heart rate, and sleep quality. It displays incoming calls and text message alerts, and its water-resistant build means you do not have to worry about sweat or light rain. The battery lasts about a week under normal use.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 24,
    rating: 4.7,
    reviews_count: 43,
    featured: 1,
    specs: JSON.stringify({
      'Screen': '1.4-inch Color Touchscreen',
      'Battery Life': 'Up to 7 Days',
      'Water Resistance': 'IP68 (Water & Dust Resistant)',
      'Sensors': 'Heart Rate, Sleep Tracker, Pedometer',
      'Compatibility': 'iPhone and Android Phones',
      'Weight': '38g'
    })
  },
  {
    title: 'Compact Wireless Earbuds with Charging Case',
    slug: 'compact-wireless-earbuds',
    category: 'Audio',
    price: 49.99,
    original_price: 69.99,
    short_description: 'Pocket-sized earbuds with clear call quality and quick Bluetooth pairing.',
    description: 'Great for the gym, commute, or daily office meetings. These earbuds fit securely in your ears and deliver balanced, clear sound. The pocket-sized charging case provides up to 24 hours of total listening time, and the built-in microphone keeps your voice clear on phone calls.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 30,
    rating: 4.6,
    reviews_count: 38,
    featured: 0,
    specs: JSON.stringify({
      'Playtime': '6 Hours per charge (24 Hours with case)',
      'Charging Port': 'USB-C Fast Charging',
      'Water Resistance': 'IPX5 Sweat Resistant',
      'Bluetooth': 'v5.3',
      'Microphone': 'Built-in dual microphones'
    })
  },
  {
    title: 'Mechanical Gaming & Office Keyboard (RGB Backlit)',
    slug: 'mechanical-rgb-keyboard',
    category: 'Peripherals',
    price: 79.99,
    original_price: 99.99,
    short_description: 'Smooth linear red switches, adjustable RGB lighting, and solid build.',
    description: 'Whether you are coding, typing long essays, or playing games, this mechanical keyboard offers a comfortable and responsive typing experience. Features quiet red switches, durable keycaps that will not fade, and customizable RGB backlighting so you can type comfortably at night.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 15,
    rating: 4.8,
    reviews_count: 61,
    featured: 1,
    specs: JSON.stringify({
      'Switch Type': 'Quiet Red Mechanical Switches',
      'Layout': 'Compact Tenkeyless (TKL)',
      'Lighting': 'Full RGB with 12 lighting modes',
      'Cable': 'Detachable 1.8m Braided USB-C Cable',
      'Compatibility': 'Windows, Mac, Linux'
    })
  },
  {
    title: 'Ergonomic Wireless Mouse with Silent Clicks',
    slug: 'ergonomic-wireless-mouse',
    category: 'Peripherals',
    price: 34.99,
    original_price: 44.99,
    short_description: 'Comfortable hand grip, quiet click buttons, and adjustable cursor speed.',
    description: 'Designed to fit naturally in your hand and reduce wrist strain during long work days. Features quiet clicking buttons so you do not disturb coworkers, plus an adjustable DPI button to change cursor speed on the fly. Works instantly with a small USB receiver.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 22,
    rating: 4.6,
    reviews_count: 29,
    featured: 0,
    specs: JSON.stringify({
      'Sensor': 'Optical Sensor (800 / 1200 / 1600 DPI)',
      'Buttons': '6 Buttons (Silent Left/Right clicks)',
      'Connection': '2.4GHz Wireless USB Nano Receiver',
      'Battery': '1x AA Battery (up to 12 months life)',
      'Weight': '85g'
    })
  },
  {
    title: '1080p Full HD Webcam with Microphone',
    slug: '1080p-full-hd-webcam',
    category: 'Peripherals',
    price: 45.99,
    original_price: 59.99,
    short_description: 'Crisp video and clear audio for Zoom, Teams, and online classes.',
    description: 'Upgrade your video calls with clear 1080p high definition. This webcam automatically adjusts to your room lighting so your picture looks bright and natural. Includes a built-in microphone with background noise reduction and a sliding privacy cover for peace of mind.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 14,
    rating: 4.5,
    reviews_count: 27,
    featured: 0,
    specs: JSON.stringify({
      'Video Resolution': '1080p Full HD @ 30fps',
      'Microphone': 'Built-in noise reducing microphone',
      'Mounting': 'Universal monitor clip and tripod mount',
      'Privacy': 'Built-in sliding privacy shutter',
      'Plug and Play': 'USB 2.0 (No driver needed)'
    })
  },
  {
    title: '3-in-1 Fast Wireless Charging Station',
    slug: '3in1-wireless-charging-station',
    category: 'Accessories',
    price: 39.99,
    original_price: 49.99,
    short_description: 'Charges phone, watch, and wireless earbuds on a single neat stand.',
    description: 'Clean up your desk or nightstand. This stand charges your smartphone, smartwatch, and wireless earbuds all at once using one wall plug. Includes built-in safety features to protect your devices from overcharging and overheating.',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 35,
    rating: 4.7,
    reviews_count: 49,
    featured: 1,
    specs: JSON.stringify({
      'Charging Output': '15W Phone + 5W Watch + 5W Earbuds',
      'Input': 'USB-C (Fast charging adapter included)',
      'Safety': 'Over-charge and temperature protection',
      'Compatibility': 'Qi-enabled phones and earbuds'
    })
  },
  {
    title: 'Waterproof Portable Bluetooth Speaker',
    slug: 'waterproof-portable-bluetooth-speaker',
    category: 'Audio',
    price: 49.99,
    original_price: 64.99,
    short_description: 'Rich sound with deep bass, IPX7 waterproof, and 18-hour battery.',
    description: 'Take your tunes anywhere. This compact speaker delivers loud, room-filling sound with strong bass. It is fully waterproof, so you can safely use it by the pool, at the beach, or in the shower. A tough exterior protects it from accidental drops.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 19,
    rating: 4.8,
    reviews_count: 45,
    featured: 0,
    specs: JSON.stringify({
      'Battery Playtime': 'Up to 18 Hours',
      'Waterproof Rating': 'IPX7 (Safe in water up to 1 meter)',
      'Wireless Range': '60 feet Bluetooth 5.0',
      'Audio Output': '20W stereo sound'
    })
  },
  {
    title: '20,000mAh Fast-Charging Power Bank',
    slug: '20000mah-fast-charging-power-bank',
    category: 'Accessories',
    price: 42.99,
    original_price: 54.99,
    short_description: 'Charges your phone up to 4 times with dual fast USB output ports.',
    description: 'Never run out of phone battery when traveling, commuting, or outdoors. This reliable 20,000mAh power bank can charge an iPhone or Android phone up to 4 times. Features dual USB output ports so you and a friend can charge simultaneously.',
    image: 'https://images.unsplash.com/photo-1609592807664-8454746513f3?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1609592807664-8454746513f3?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 28,
    rating: 4.7,
    reviews_count: 36,
    featured: 1,
    specs: JSON.stringify({
      'Capacity': '20,000mAh (Airline approved)',
      'Ports': '1x USB-C (Input/Output), 2x USB-A (Output)',
      'Fast Charge': '18W Quick Charge 3.0',
      'Weight': '390g'
    })
  },
  {
    title: 'LED Desk Monitor Light Bar',
    slug: 'led-desk-monitor-light-bar',
    category: 'Smart Home',
    price: 35.99,
    original_price: 45.99,
    short_description: 'Clips on top of monitor to illuminate your desk without screen glare.',
    description: 'Save desk space and protect your eyes during late-night work or study sessions. This light bar clips securely on top of your monitor and casts light downward onto your keyboard and papers without reflecting on the screen. Easily change between warm and cool lighting with touch controls.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 20,
    rating: 4.6,
    reviews_count: 31,
    featured: 0,
    specs: JSON.stringify({
      'Mounting': 'Clips directly to monitor (Fits screens 0.5cm - 3cm thick)',
      'Color Temperature': '3000K (Warm) to 6000K (Cool White)',
      'Power Source': 'USB-C cable (Plugs into PC or wall adapter)',
      'Controls': 'Touch sensor for brightness and color'
    })
  },
  {
    title: 'Water-Resistant Everyday Laptop Backpack',
    slug: 'water-resistant-laptop-backpack',
    category: 'Accessories',
    price: 54.99,
    original_price: 69.99,
    short_description: 'Fits laptops up to 15.6 inches with multiple organizer pockets.',
    description: 'A durable and comfortable backpack for college students, office workers, and travelers. Includes a dedicated padded laptop compartment, water bottle side pockets, and durable water-resistant fabric that protects your gear on rainy days.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 16,
    rating: 4.8,
    reviews_count: 42,
    featured: 0,
    specs: JSON.stringify({
      'Fits Laptop Size': 'Up to 15.6-inch laptop',
      'Material': 'Water-resistant Oxford fabric',
      'Pockets': 'Main compartment, front organizer pocket, 2 side bottle pockets',
      'Weight': '650g'
    })
  },
  {
    title: 'Lightweight Fitness Tracker Band',
    slug: 'lightweight-fitness-tracker-band',
    category: 'Wearables',
    price: 29.99,
    original_price: 39.99,
    short_description: 'Simple daily step counter, sleep tracker, and calorie monitor.',
    description: 'A simple, no-fuss fitness band that is comfortable enough to wear day and night. It counts your steps, calculates calories burned, tracks your sleep cycles, and vibrates when you get a phone call. The battery lasts up to two weeks on a single charge.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 32,
    rating: 4.5,
    reviews_count: 35,
    featured: 0,
    specs: JSON.stringify({
      'Battery Life': 'Up to 14 Days',
      'Functions': 'Step counter, Sleep tracking, Call alerts, Heart rate',
      'Waterproof': 'Waterproof for handwashing and rain',
      'Weight': '22g'
    })
  }
];

const sampleReviews = [
  {
    user_name: 'David Miller',
    rating: 5,
    comment: 'Really happy with this purchase. Sound is great and it arrived in just two days.'
  },
  {
    user_name: 'Sarah Jenkins',
    rating: 5,
    comment: 'Good build quality and works exactly as described. Well worth the price!'
  },
  {
    user_name: 'Michael Chang',
    rating: 4,
    comment: 'Comfortable to use for long hours. Battery lasts all week for me.'
  },
  {
    user_name: 'Emily Watson',
    rating: 5,
    comment: 'Super easy to set up right out of the box. Would definitely recommend to friends.'
  }
];

const seedDatabase = async () => {
  await initDatabase();

  console.log('🌱 Checking database...');

  // 1. Seed Demo User
  const existingUser = await get('SELECT * FROM users WHERE email = ?', ['demo@codealpha.com']);
  let demoUserId;
  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const userResult = await run(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      ['Alex Mercer', 'demo@codealpha.com', hashedPassword, 'customer']
    );
    demoUserId = userResult.id;
    console.log('👤 Created demo user: demo@codealpha.com / password123');
  } else {
    demoUserId = existingUser.id;
  }

  // 2. Clear old products to refresh with human wording if needed
  await run('DELETE FROM products');
  await run('DELETE FROM reviews');
  await run('DELETE FROM order_items');
  await run('DELETE FROM orders');

  console.log('📦 Seeding updated human product catalog...');
  for (const prod of seedProducts) {
    const prodResult = await run(
      `INSERT INTO products (title, slug, category, price, original_price, short_description, description, image, gallery, stock, rating, reviews_count, featured, specs)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prod.title,
        prod.slug,
        prod.category,
        prod.price,
        prod.original_price,
        prod.short_description,
        prod.description,
        prod.image,
        prod.gallery,
        prod.stock,
        prod.rating,
        prod.reviews_count,
        prod.featured,
        prod.specs
      ]
    );

    // Add 2 reviews per product
    for (let i = 0; i < 2; i++) {
      const review = sampleReviews[(prodResult.id + i) % sampleReviews.length];
      await run(
        `INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)`,
        [prodResult.id, review.user_name, review.rating, review.comment]
      );
    }
  }

  // 3. Seed an initial sample order for the demo user
  const sampleOrderNumber = 'ORD-2025-10492';
  const orderRes = await run(
    `INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, payment_method, subtotal, discount, tax, shipping_fee, total, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sampleOrderNumber,
      demoUserId,
      'Alex Mercer',
      'demo@codealpha.com',
      '+1 (555) 349-8291',
      JSON.stringify({
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zip: '97477',
        country: 'United States'
      }),
      'credit_card',
      129.99,
      0,
      10.40,
      0.00,
      140.39,
      'Shipped'
    ]
  );

  await run(
    `INSERT INTO order_items (order_id, product_id, title, price, quantity, image, subtotal)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      orderRes.id,
      1,
      'Wireless Noise-Cancelling Headphones',
      129.99,
      1,
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      129.99
    ]
  );

  console.log(`✅ Seeded ${seedProducts.length} human-friendly products.`);
  console.log('✨ Database seeding complete.');
};

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedDatabase, seedProducts };
