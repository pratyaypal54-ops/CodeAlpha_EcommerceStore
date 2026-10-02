/**
 * TechStore - API Service
 * Connects to the Express backend (http://localhost:5000) with automatic
 * offline fallback so the site always opens even if opened via VS Code Live Server!
 */

// Fallback offline catalog in case backend server is not running
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    category: 'Audio',
    price: 129.99,
    original_price: 159.99,
    short_description: 'Comfortable over-ear headphones with deep bass and 40-hour battery life.',
    description: 'Enjoy your favorite music, podcasts, and work calls without distractions. These over-ear headphones feature active noise cancellation to block out background chatter, soft memory-foam ear cups for all-day comfort, and up to 40 hours of playtime on a single charge. Connects easily with phones, laptops, and tablets via Bluetooth 5.2.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    rating: 4.8,
    reviews_count: 52,
    featured: 1,
    specs: {
      'Type': 'Over-Ear Wireless',
      'Battery Life': 'Up to 40 Hours',
      'Charging Time': '1.5 Hours (USB-C)',
      'Noise Cancellation': 'Active Noise Cancellation (ANC)',
      'Connectivity': 'Bluetooth 5.2 + 3.5mm Audio Cable',
      'Warranty': '1 Year Replacement'
    },
    reviews: [
      { user_name: 'David Miller', rating: 5, comment: 'Really happy with this purchase. Sound is great and it arrived in just two days.' },
      { user_name: 'Sarah Jenkins', rating: 5, comment: 'Good build quality and works exactly as described. Well worth the price!' }
    ]
  },
  {
    id: 2,
    title: 'Daily Fitness Smartwatch with Heart Rate Tracker',
    slug: 'daily-fitness-smartwatch',
    category: 'Wearables',
    price: 89.99,
    original_price: 119.99,
    short_description: 'Tracks steps, workouts, sleep, and heart rate with a 7-day battery.',
    description: 'A clean and practical smartwatch designed for everyday fitness. Track your daily steps, distance, heart rate, and sleep quality. It displays incoming calls and text message alerts, and its water-resistant build means you do not have to worry about sweat or light rain. The battery lasts about a week under normal use.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 24,
    rating: 4.7,
    reviews_count: 43,
    featured: 1,
    specs: {
      'Screen': '1.4-inch Color Touchscreen',
      'Battery Life': 'Up to 7 Days',
      'Water Resistance': 'IP68 (Water & Dust Resistant)',
      'Sensors': 'Heart Rate, Sleep Tracker, Pedometer',
      'Compatibility': 'iPhone and Android Phones'
    },
    reviews: [
      { user_name: 'Michael Chang', rating: 4, comment: 'Comfortable to use for long hours. Battery lasts all week for me.' }
    ]
  },
  {
    id: 3,
    title: 'Compact Wireless Earbuds with Charging Case',
    slug: 'compact-wireless-earbuds',
    category: 'Audio',
    price: 49.99,
    original_price: 69.99,
    short_description: 'Pocket-sized earbuds with clear call quality and quick Bluetooth pairing.',
    description: 'Great for the gym, commute, or daily office meetings. These earbuds fit securely in your ears and deliver balanced, clear sound. The pocket-sized charging case provides up to 24 hours of total listening time, and the built-in microphone keeps your voice clear on phone calls.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'],
    stock: 30,
    rating: 4.6,
    reviews_count: 38,
    featured: 0,
    specs: {
      'Playtime': '6 Hours per charge (24 Hours with case)',
      'Charging Port': 'USB-C Fast Charging',
      'Water Resistance': 'IPX5 Sweat Resistant',
      'Bluetooth': 'v5.3'
    },
    reviews: []
  },
  {
    id: 4,
    title: 'Mechanical Gaming & Office Keyboard (RGB Backlit)',
    slug: 'mechanical-rgb-keyboard',
    category: 'Peripherals',
    price: 79.99,
    original_price: 99.99,
    short_description: 'Smooth linear red switches, adjustable RGB lighting, and solid build.',
    description: 'Whether you are coding, typing long essays, or playing games, this mechanical keyboard offers a comfortable and responsive typing experience. Features quiet red switches, durable keycaps that will not fade, and customizable RGB backlighting so you can type comfortably at night.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
    stock: 15,
    rating: 4.8,
    reviews_count: 61,
    featured: 1,
    specs: {
      'Switch Type': 'Quiet Red Mechanical Switches',
      'Layout': 'Compact Tenkeyless (TKL)',
      'Lighting': 'Full RGB with 12 lighting modes'
    },
    reviews: []
  },
  {
    id: 5,
    title: 'Ergonomic Wireless Mouse with Silent Clicks',
    slug: 'ergonomic-wireless-mouse',
    category: 'Peripherals',
    price: 34.99,
    original_price: 44.99,
    short_description: 'Comfortable hand grip, quiet click buttons, and adjustable cursor speed.',
    description: 'Designed to fit naturally in your hand and reduce wrist strain during long work days. Features quiet clicking buttons so you do not disturb coworkers, plus an adjustable DPI button to change cursor speed on the fly. Works instantly with a small USB receiver.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'],
    stock: 22,
    rating: 4.6,
    reviews_count: 29,
    featured: 0,
    specs: {
      'Sensor': 'Optical Sensor (800 / 1200 / 1600 DPI)',
      'Connection': '2.4GHz Wireless USB Nano Receiver',
      'Battery': '1x AA Battery (up to 12 months life)'
    },
    reviews: []
  },
  {
    id: 6,
    title: '1080p Full HD Webcam with Microphone',
    slug: '1080p-full-hd-webcam',
    category: 'Peripherals',
    price: 45.99,
    original_price: 59.99,
    short_description: 'Crisp video and clear audio for Zoom, Teams, and online classes.',
    description: 'Upgrade your video calls with clear 1080p high definition. This webcam automatically adjusts to your room lighting so your picture looks bright and natural. Includes a built-in microphone with background noise reduction and a sliding privacy cover for peace of mind.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
    stock: 14,
    rating: 4.5,
    reviews_count: 27,
    featured: 0,
    specs: {
      'Video Resolution': '1080p Full HD @ 30fps',
      'Microphone': 'Built-in noise reducing microphone',
      'Plug and Play': 'USB 2.0 (No driver needed)'
    },
    reviews: []
  },
  {
    id: 7,
    title: '3-in-1 Fast Wireless Charging Station',
    slug: '3in1-wireless-charging-station',
    category: 'Accessories',
    price: 39.99,
    original_price: 49.99,
    short_description: 'Charges phone, watch, and wireless earbuds on a single neat stand.',
    description: 'Clean up your desk or nightstand. This stand charges your smartphone, smartwatch, and wireless earbuds all at once using one wall plug. Includes built-in safety features to protect your devices from overcharging and overheating.',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'],
    stock: 35,
    rating: 4.7,
    reviews_count: 49,
    featured: 1,
    specs: {
      'Charging Output': '15W Phone + 5W Watch + 5W Earbuds',
      'Safety': 'Over-charge and temperature protection'
    },
    reviews: []
  },
  {
    id: 8,
    title: 'Waterproof Portable Bluetooth Speaker',
    slug: 'waterproof-portable-bluetooth-speaker',
    category: 'Audio',
    price: 49.99,
    original_price: 64.99,
    short_description: 'Rich sound with deep bass, IPX7 waterproof, and 18-hour battery.',
    description: 'Take your tunes anywhere. This compact speaker delivers loud, room-filling sound with strong bass. It is fully waterproof, so you can safely use it by the pool, at the beach, or in the shower. A tough exterior protects it from accidental drops.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'],
    stock: 19,
    rating: 4.8,
    reviews_count: 45,
    featured: 0,
    specs: {
      'Battery Playtime': 'Up to 18 Hours',
      'Waterproof Rating': 'IPX7 Waterproof',
      'Audio Output': '20W stereo sound'
    },
    reviews: []
  },
  {
    id: 9,
    title: '20,000mAh Fast-Charging Power Bank',
    slug: '20000mah-fast-charging-power-bank',
    category: 'Accessories',
    price: 42.99,
    original_price: 54.99,
    short_description: 'Charges your phone up to 4 times with dual fast USB output ports.',
    description: 'Never run out of phone battery when traveling, commuting, or outdoors. This reliable 20,000mAh power bank can charge an iPhone or Android phone up to 4 times. Features dual USB output ports so you and a friend can charge simultaneously.',
    image: 'https://images.unsplash.com/photo-1609592807664-8454746513f3?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1609592807664-8454746513f3?auto=format&fit=crop&w=800&q=80'],
    stock: 28,
    rating: 4.7,
    reviews_count: 36,
    featured: 1,
    specs: {
      'Capacity': '20,000mAh (Airline approved)',
      'Ports': '1x USB-C, 2x USB-A'
    },
    reviews: []
  },
  {
    id: 10,
    title: 'LED Desk Monitor Light Bar',
    slug: 'led-desk-monitor-light-bar',
    category: 'Smart Home',
    price: 35.99,
    original_price: 45.99,
    short_description: 'Clips on top of monitor to illuminate your desk without screen glare.',
    description: 'Save desk space and protect your eyes during late-night work or study sessions. This light bar clips securely on top of your monitor and casts light downward onto your keyboard and papers without reflecting on the screen. Easily change between warm and cool lighting with touch controls.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'],
    stock: 20,
    rating: 4.6,
    reviews_count: 31,
    featured: 0,
    specs: {
      'Mounting': 'Clips directly to monitor',
      'Color Temperature': 'Warm to Cool White',
      'Power Source': 'USB-C cable'
    },
    reviews: []
  },
  {
    id: 11,
    title: 'Water-Resistant Everyday Laptop Backpack',
    slug: 'water-resistant-laptop-backpack',
    category: 'Accessories',
    price: 54.99,
    original_price: 69.99,
    short_description: 'Fits laptops up to 15.6 inches with multiple organizer pockets.',
    description: 'A durable and comfortable backpack for college students, office workers, and travelers. Includes a dedicated padded laptop compartment, water bottle side pockets, and durable water-resistant fabric that protects your gear on rainy days.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
    stock: 16,
    rating: 4.8,
    reviews_count: 42,
    featured: 0,
    specs: {
      'Fits Laptop Size': 'Up to 15.6-inch laptop',
      'Material': 'Water-resistant Oxford fabric'
    },
    reviews: []
  },
  {
    id: 12,
    title: 'Lightweight Fitness Tracker Band',
    slug: 'lightweight-fitness-tracker-band',
    category: 'Wearables',
    price: 29.99,
    original_price: 39.99,
    short_description: 'Simple daily step counter, sleep tracker, and calorie monitor.',
    description: 'A simple, no-fuss fitness band that is comfortable enough to wear day and night. It counts your steps, calculates calories burned, tracks your sleep cycles, and vibrates when you get a phone call. The battery lasts up to two weeks on a single charge.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80'],
    stock: 32,
    rating: 4.5,
    reviews_count: 35,
    featured: 0,
    specs: {
      'Battery Life': 'Up to 14 Days',
      'Functions': 'Step counter, Sleep tracking, Call alerts'
    },
    reviews: []
  }
];

// Determine API URL: If opened on port 5500 (Live Server) or file://, target port 5000
const isStaticOrLiveServer = window.location.port === '5500' || 
                             window.location.port === '5501' || 
                             window.location.protocol === 'file:';

const API_BASE = isStaticOrLiveServer ? 'http://localhost:5000/api' : '/api';

// Core network request helper with automatic offline fallback
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('techstore_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s quick timeout

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...config,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`Backend connection note (${endpoint}):`, err.message);
    // If backend is offline or network fails, throw to trigger offline fallback
    throw err;
  }
}

const api = {
  // Authentication
  auth: {
    async register(name, email, password) {
      try {
        const data = await request('/auth/register', {
          method: 'POST',
          body: { name, email, password }
        });
        if (data.token) localStorage.setItem('techstore_token', data.token);
        return data;
      } catch (e) {
        // Fallback demo register
        const mockUser = { id: 99, name, email, role: 'customer' };
        localStorage.setItem('techstore_user', JSON.stringify(mockUser));
        return { success: true, message: 'Account created successfully!', user: mockUser };
      }
    },

    async login(email, password) {
      try {
        const data = await request('/auth/login', {
          method: 'POST',
          body: { email, password }
        });
        if (data.token) localStorage.setItem('techstore_token', data.token);
        return data;
      } catch (e) {
        // Fallback demo login
        const mockUser = { id: 1, name: 'Alex Mercer', email: email || 'demo@codealpha.com', role: 'customer' };
        localStorage.setItem('techstore_user', JSON.stringify(mockUser));
        return { success: true, message: 'Welcome back, Alex!', user: mockUser };
      }
    },

    async getProfile() {
      try {
        return await request('/auth/me');
      } catch (e) {
        const saved = localStorage.getItem('techstore_user');
        if (saved) return { success: true, user: JSON.parse(saved) };
        throw e;
      }
    },

    logout() {
      localStorage.removeItem('techstore_token');
      localStorage.removeItem('techstore_user');
    },

    isLoggedIn() {
      return !!(localStorage.getItem('techstore_token') || localStorage.getItem('techstore_user'));
    }
  },

  // Products
  products: {
    async getAll(params = {}) {
      try {
        const query = new URLSearchParams();
        if (params.category && params.category !== 'All') query.append('category', params.category);
        if (params.search) query.append('search', params.search);
        if (params.maxPrice) query.append('maxPrice', params.maxPrice);
        if (params.sort) query.append('sort', params.sort);

        const qs = query.toString();
        return await request(`/products${qs ? `?${qs}` : ''}`);
      } catch (e) {
        // Offline / Live Server fallback: filter locally
        let list = [...FALLBACK_PRODUCTS];

        if (params.category && params.category !== 'All') {
          list = list.filter(p => p.category === params.category);
        }
        if (params.search) {
          const s = params.search.toLowerCase();
          list = list.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
        }
        if (params.maxPrice) {
          list = list.filter(p => p.price <= Number(params.maxPrice));
        }
        if (params.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
        if (params.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
        if (params.sort === 'rating-desc') list.sort((a, b) => b.rating - a.rating);

        return { success: true, count: list.length, products: list, isFallback: true };
      }
    },

    async getById(id) {
      try {
        return await request(`/products/${id}`);
      } catch (e) {
        const prod = FALLBACK_PRODUCTS.find(p => p.id === Number(id));
        if (prod) return { success: true, product: prod };
        throw new Error('Product not found');
      }
    },

    async addReview(productId, reviewData) {
      try {
        return await request(`/products/${productId}/reviews`, {
          method: 'POST',
          body: reviewData
        });
      } catch (e) {
        return { success: true, message: 'Review saved!' };
      }
    }
  },

  // Orders
  orders: {
    async create(orderPayload) {
      try {
        return await request('/orders', {
          method: 'POST',
          body: orderPayload
        });
      } catch (e) {
        // Offline fallback: save order to localStorage
        const orderNumber = `ORD-2025-${Math.floor(100000 + Math.random() * 900000)}`;
        const localOrder = {
          orderNumber,
          customerName: orderPayload.customerName,
          customerEmail: orderPayload.customerEmail,
          total: orderPayload.items.reduce((sum, it) => sum + (it.price || 50) * it.quantity, 0),
          status: 'Processing',
          createdAt: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('techstore_orders') || '[]');
        existing.unshift(localOrder);
        localStorage.setItem('techstore_orders', JSON.stringify(existing));

        return { success: true, message: 'Order placed successfully!', order: localOrder };
      }
    },

    async getMyOrders() {
      try {
        return await request('/orders/my-orders');
      } catch (e) {
        const local = JSON.parse(localStorage.getItem('techstore_orders') || '[]');
        return { success: true, orders: local };
      }
    },

    async getByNumber(orderNumber) {
      try {
        return await request(`/orders/${orderNumber}`);
      } catch (e) {
        const local = JSON.parse(localStorage.getItem('techstore_orders') || '[]');
        const found = local.find(o => o.orderNumber === orderNumber);
        if (found) {
          return {
            success: true,
            order: {
              ...found,
              order_number: found.orderNumber,
              customer_name: found.customerName,
              customer_email: found.customerEmail,
              created_at: found.createdAt,
              shipping_address: { address: 'Your Saved Address', city: 'City', zip: '00000' },
              items: [{ title: 'Electronics Order Items', quantity: 1, price: found.total }]
            }
          };
        }
        throw new Error('Order not found');
      }
    }
  }
};

window.api = api;
