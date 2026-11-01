/**
 * TechStore - API Service
 * Connects to the Express backend (http://localhost:5000) with automatic
 * offline fallback and rich client-side AI/Seller capabilities.
 */

// Offline Demo Sellers
const FALLBACK_SELLERS = [
  {
    id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    seller_bio: 'Authorized merchant specializing in audiophile headphones and next-gen gaming consoles.'
  },
  {
    id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    seller_bio: 'Scandinavian-inspired desk setups, 4K color-accurate displays, and studio lighting.'
  },
  {
    id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    seller_bio: 'Premier distributor of flagship smartphones, smartwatches, and MagSafe accessories.'
  }
];

// Offline Fallback Products Catalog with authentic data
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'Sony WH-1000XM4 Wireless Noise-Cancelling Headphones',
    slug: 'sony-wh1000xm4-wireless-headphones',
    category: 'Audio',
    price: 19999,
    original_price: 29990,
    short_description: 'Industry-leading noise cancellation, 30-hour battery, touch controls, and LDAC high-res audio.',
    description: 'Immerse yourself in pure music with Sony WH-1000XM4. Dual noise sensor technology captures ambient noise and passes the data to the trusted HD Noise Cancelling Processor QN1. Featuring Speak-to-Chat, multipoint Bluetooth connection, and up to 30 hours of continuous battery life.',
    image: 'images/products/sony_wh1000xm4.jpg',
    stock: 18,
    rating: 4.8,
    reviews_count: 86,
    featured: 1,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: {
      colors: [
        { name: 'Midnight Black', hex: '#1c1c1e' },
        { name: 'Platinum Silver', hex: '#d4d4d8' },
        { name: 'Silent White', hex: '#f8fafc' }
      ],
      options: ['Standard Edition']
    },
    price_history: {
      current: 19999,
      lowest: 19499,
      highest: 29990,
      deal_score: 93,
      verdict: 'Best Time to Buy! Current price ₹19,999 is 33% below original M.R.P. and within ₹500 of the all-time historic low.',
      history: [
        { date: '90d ago', price: 24990 },
        { date: '60d ago', price: 22490 },
        { date: '30d ago', price: 20999 },
        { date: 'Current', price: 19999 }
      ]
    },
    reviews: [
      {
        user_name: 'Rahul Sharma',
        rating: 5,
        comment: 'The active noise cancellation is practically magic on flights and during work calls.',
        pros: 'Superb ANC, extremely comfortable for 6+ hours, fast USB-C charging.',
        cons: 'Microphone pickup in crowded outdoor streets could be clearer.'
      },
      {
        user_name: 'Emily Watson',
        rating: 4,
        comment: 'Great headphones overall. Soundstage is wide and battery truly lasts nearly 30 hours.',
        pros: 'Incredible bass response, custom EQ in companion app, folding case included.',
        cons: 'Not water-resistant; avoid heavy sweat or rain.'
      }
    ]
  },
  {
    id: 2,
    title: 'Apple AirPods Pro (2nd Generation, USB-C)',
    slug: 'apple-airpods-pro-2nd-gen',
    category: 'Audio',
    price: 20999,
    original_price: 24900,
    short_description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, and MagSafe Charging Case (USB-C).',
    description: 'AirPods Pro (2nd Gen) with USB-C deliver exceptional acoustic fidelity powered by the Apple H2 chip.',
    image: 'images/products/apple_airpods_pro.jpg',
    stock: 3, // LOW STOCK
    rating: 4.9,
    reviews_count: 112,
    featured: 1,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: {
      colors: [{ name: 'Glossy White', hex: '#f8fafc' }],
      options: ['USB-C MagSafe Case']
    },
    price_history: {
      current: 20999,
      lowest: 19999,
      highest: 24900,
      deal_score: 88,
      verdict: 'Great Deal! Only 3 left in stock. Ideal time to grab before price hike.',
      history: [
        { date: '90d ago', price: 24900 },
        { date: '60d ago', price: 22990 },
        { date: 'Current', price: 20999 }
      ]
    },
    reviews: [
      {
        user_name: 'Ananya Rao',
        rating: 5,
        comment: 'Transparency mode is so natural you forget you are wearing earbuds.',
        pros: 'Unmatched transparency mode, tiny pocketable case, USB-C convenience.',
        cons: 'Battery per charge is 5.5 hours, less than over-ear models.'
      }
    ]
  },
  {
    id: 3,
    title: 'Apple Watch Series 9 GPS (45mm & 41mm Always-On Retina)',
    slug: 'apple-watch-series-9',
    category: 'Wearables',
    price: 41900,
    original_price: 44900,
    short_description: 'Brighter Always-On Retina display, powerful S9 SiP chip, Double Tap gesture, and health sensors.',
    description: 'Smarter, brighter, and mightier. Apple Watch Series 9 helps you stay active, healthy, safe, and connected.',
    image: 'images/products/apple_watch_s9.jpg',
    stock: 20,
    rating: 4.8,
    reviews_count: 85,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: {
      colors: [
        { name: 'Midnight', hex: '#0f172a' },
        { name: 'Starlight', hex: '#fef3c7' },
        { name: 'Silver', hex: '#e2e8f0' }
      ],
      options: ['41mm Case', '45mm Case']
    },
    price_history: {
      current: 41900,
      lowest: 39900,
      highest: 44900,
      deal_score: 87,
      verdict: 'Good Deal! ₹3,000 off M.R.P. Features Apple Double Tap gesture.',
      history: [
        { date: '90d ago', price: 44900 },
        { date: '30d ago', price: 42400 },
        { date: 'Current', price: 41900 }
      ]
    },
    reviews: [
      {
        user_name: 'Karthik Raja',
        rating: 5,
        comment: 'Double tap gesture is surprisingly handy when carrying groceries.',
        pros: 'Ultra-bright 2000-nit screen, accurate heart rate tracking.',
        cons: 'Must be charged daily.'
      }
    ]
  },
  {
    id: 4,
    title: 'Keychron K2 Wireless Mechanical Keyboard (RGB Backlit)',
    slug: 'keychron-k2-wireless-keyboard',
    category: 'Peripherals',
    price: 7499,
    original_price: 9999,
    short_description: 'Compact 75% layout, Gateron Red linear switches, vibrant RGB lighting, and dual Mac/Windows support.',
    description: 'The Keychron K2 is a 75% layout wireless mechanical keyboard that retains all essential multimedia and function keys.',
    image: 'images/products/keychron_k2.jpg',
    stock: 15,
    rating: 4.8,
    reviews_count: 73,
    featured: 1,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: {
      colors: [
        { name: 'Space Gray', hex: '#4b5563' },
        { name: 'Retro White', hex: '#e5e7eb' }
      ],
      options: ['Gateron Red (Smooth)', 'Gateron Brown (Tactile)']
    },
    price_history: {
      current: 7499,
      lowest: 6999,
      highest: 9999,
      deal_score: 90,
      verdict: 'Best Time to Buy! ₹2,500 savings on the most popular mechanical keyboard.',
      history: [
        { date: '90d ago', price: 9499 },
        { date: 'Current', price: 7499 }
      ]
    },
    reviews: [
      {
        user_name: 'Nikhil Verma',
        rating: 5,
        comment: 'Best mechanical keyboard for Mac users.',
        pros: 'Seamless Bluetooth switching, 4000mAh battery.',
        cons: 'Keyboard body is somewhat tall without a wrist rest.'
      }
    ]
  },
  {
    id: 5,
    title: 'Sony PlayStation 5 Slim Console (1TB SSD)',
    slug: 'sony-playstation-5-console',
    category: 'Gaming',
    price: 49990,
    original_price: 54990,
    short_description: 'Ultra-fast 1TB SSD, ray tracing, 4K gaming up to 120fps, 3D audio, and DualSense haptic feedback.',
    description: 'Experience lightning-fast loading with an ultra-high speed 1TB SSD.',
    image: 'images/products/sony_ps5_console.jpg',
    stock: 4, // LOW STOCK
    rating: 5.0,
    reviews_count: 142,
    featured: 1,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: {
      colors: [{ name: 'Glacial White', hex: '#f1f5f9' }],
      options: ['Disc Edition (1TB)']
    },
    price_history: {
      current: 49990,
      lowest: 48990,
      highest: 54990,
      deal_score: 91,
      verdict: 'Highly Recommended! ₹5,000 discount. Only 4 units left.',
      history: [
        { date: '90d ago', price: 54990 },
        { date: 'Current', price: 49990 }
      ]
    },
    reviews: [
      {
        user_name: 'Vikram Joshi',
        rating: 5,
        comment: 'Load times are practically instantaneous.',
        pros: 'Super fast SSD, whisper quiet fan, haptic triggers.',
        cons: 'Tall console form factor.'
      }
    ]
  },
  {
    id: 6,
    title: 'Apple iPhone 15 Pro (Titanium / Super Retina XDR)',
    slug: 'apple-iphone-15-pro',
    category: 'Smartphones',
    price: 127990,
    original_price: 134900,
    short_description: 'Aerospace-grade titanium design, A17 Pro chip, customizable Action button, and 48MP Pro camera system.',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip.',
    image: 'images/products/apple_iphone_15_pro.jpg',
    stock: 15,
    rating: 4.9,
    reviews_count: 164,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: {
      colors: [
        { name: 'Natural Titanium', hex: '#9ca3af' },
        { name: 'Blue Titanium', hex: '#2c3e50' },
        { name: 'Black Titanium', hex: '#18181b' }
      ],
      options: ['128GB', '256GB', '512GB']
    },
    price_history: {
      current: 127990,
      lowest: 124990,
      highest: 134900,
      deal_score: 90,
      verdict: 'Best Time to Buy! Flagship titanium model at ₹7,000 discount.',
      history: [
        { date: '90d ago', price: 134900 },
        { date: 'Current', price: 127990 }
      ]
    },
    reviews: [
      {
        user_name: 'Vivek Singhania',
        rating: 5,
        comment: 'Noticeably lighter than iPhone 14 Pro.',
        pros: 'Lightweight titanium, USB-C, 120Hz ProMotion.',
        cons: 'Camera bump is prominent.'
      }
    ]
  },
  {
    id: 7,
    title: 'CalDigit TS4 Thunderbolt 4 18-Port Workstation Dock',
    slug: 'caldigit-ts4-thunderbolt-4-dock',
    category: 'Peripherals',
    price: 36999,
    original_price: 42999,
    short_description: 'Massive 18 ports of connectivity, 98W laptop charging, 2.5GbE Ethernet, and dual 6K display support.',
    description: 'The pinnacle of docking stations with 18 ports.',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    stock: 0, // OUT OF STOCK
    rating: 4.9,
    reviews_count: 31,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: {
      colors: [{ name: 'Space Gray', hex: '#4b5563' }],
      options: ['18-Port Unit']
    },
    price_history: {
      current: 36999,
      lowest: 35999,
      highest: 42999,
      deal_score: 83,
      verdict: 'Wait for Restock! Currently sold out.',
      history: [
        { date: '90d ago', price: 42999 },
        { date: 'Current', price: 36999 }
      ]
    },
    reviews: [
      {
        user_name: 'Aditya Sen',
        rating: 5,
        comment: 'One cable drives dual 4K screens and 98W power.',
        pros: '18 ports, solid metal casing.',
        cons: 'Currently out of stock.'
      }
    ]
  },
  {
    id: 31,
    title: 'boAt BassHeads 100 Wired In-Ear Earphones with Mic',
    slug: 'boat-bassheads-100-wired-earphones',
    category: 'Audio',
    price: 399,
    original_price: 999,
    short_description: 'Hawk-inspired aerodynamic earbuds with 10mm dynamic drivers, super extra bass, and HD mic.',
    description: 'boAt BassHeads 100 in-ear wired earphones feature 10mm dynamic drivers tuned for super extra punchy bass. Comes with an integrated inline HD microphone for crystal-clear calls, a 1.2-meter tangle-resistant cable, and gold-plated 3.5mm angled connector.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    stock: 45,
    rating: 4.6,
    reviews_count: 340,
    featured: 1,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: {
      colors: [
        { name: 'Furious Red', hex: '#ef4444' },
        { name: 'Black Panther', hex: '#111827' },
        { name: 'Taffy Pink', hex: '#ec4899' }
      ],
      options: ['Standard 3.5mm Jack']
    },
    price_history: {
      current: 399,
      lowest: 349,
      highest: 999,
      deal_score: 95,
      verdict: 'Phenomenal Budget Pick! 60% below standard price.',
      history: [
        { date: '90d ago', price: 699 },
        { date: '60d ago', price: 499 },
        { date: '30d ago', price: 449 },
        { date: 'Current', price: 399 }
      ]
    },
    reviews: [
      {
        user_name: 'Kunal Verma',
        rating: 5,
        comment: 'For ₹399 this is genuinely unbeatable! The bass punch is surprisingly deep and call audio is crisp.',
        pros: 'Thumping bass, comfortable ear tips, angled durable 3.5mm jack.',
        cons: 'Wire can tangle if tossed in a pocket without a tie.'
      }
    ]
  },
  {
    id: 32,
    title: 'Zebronics Zeb-Bro In-Ear Wired Earphones with Mic',
    slug: 'zebronics-zeb-bro-wired-earphones',
    category: 'Audio',
    price: 199,
    original_price: 399,
    short_description: 'Ultra-budget lightweight earphones with 10mm drivers, built-in mic, and snug-fit silicone tips.',
    description: 'Zebronics Zeb-Bro delivers clear acoustics and balanced audio for online classes, video calls, podcasts, and daily listening. Weighs only 14 grams with an inline mic and one-button answer/reject switch.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    stock: 60,
    rating: 4.4,
    reviews_count: 215,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: {
      colors: [
        { name: 'Classic Black', hex: '#18181b' },
        { name: 'Cobalt Blue', hex: '#2563eb' }
      ],
      options: ['Standard 3.5mm']
    },
    price_history: {
      current: 199,
      lowest: 179,
      highest: 399,
      deal_score: 92,
      verdict: 'Super Cheap Daily Driver! Perfect backup earphone under ₹200.',
      history: [
        { date: '90d ago', price: 299 },
        { date: 'Current', price: 199 }
      ]
    },
    reviews: [
      {
        user_name: 'Rohan Deshmukh',
        rating: 4,
        comment: 'Great cheap pair of wired earphones to keep in laptop backpack. Mic works fine on Zoom calls.',
        pros: 'Crazy cheap at ₹199, very lightweight, decent vocals.',
        cons: 'Plastic construction is basic.'
      }
    ]
  },
  {
    id: 33,
    title: 'Portronics Konnect CL 20W Type-C to Lightning Fast Charging Cable (1.2m)',
    slug: 'portronics-konnect-cl-typec-lightning-cable',
    category: 'Accessories',
    price: 249,
    original_price: 699,
    short_description: '20W PD fast-charging Type-C to Lightning cable with high-tensile nylon braiding.',
    description: 'Portronics Konnect CL supports 20W Power Delivery to charge your iPhone up to 50% in just 30 minutes. Engineered with high-strength braided nylon tested to withstand 10,000+ bends and corrosion-resistant gold-plated contact pins for 480Mbps data synchronization.',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    rating: 4.7,
    reviews_count: 180,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: {
      colors: [
        { name: 'Space Grey', hex: '#4b5563' },
        { name: 'Midnight Black', hex: '#111827' }
      ],
      options: ['1.2m Length']
    },
    price_history: {
      current: 249,
      lowest: 229,
      highest: 699,
      deal_score: 96,
      verdict: 'Heavy Discount! 64% off M.R.P. for premium braided charging cable.',
      history: [
        { date: '90d ago', price: 499 },
        { date: '60d ago', price: 349 },
        { date: 'Current', price: 249 }
      ]
    },
    reviews: [
      {
        user_name: 'Sneha Patel',
        rating: 5,
        comment: 'Charges my iPhone 14 rapidly with 20W brick. The braided wire feels substantially more durable than the original white Apple cable.',
        pros: 'Fast charging works reliably, strong strain relief, tangle-free.',
        cons: 'None so far.'
      }
    ]
  },
  {
    id: 34,
    title: 'Ambrane 65W Type-C to Type-C Ultra-Fast Braided Cable (1.5m)',
    slug: 'ambrane-65w-typec-to-typec-cable',
    category: 'Accessories',
    price: 299,
    original_price: 799,
    short_description: '65W USB-PD fast charging cable with smart E-Marker chip for smartphones, tablets & laptops.',
    description: 'Ambrane 65W Power Delivery cable features an intelligent E-Marker chipset that automatically identifies connected devices to regulate current and prevent overcharging. Compatible with MacBooks, iPad Air/Pro, Samsung Galaxy, and OnePlus smartphones.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    stock: 40,
    rating: 4.8,
    reviews_count: 145,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: {
      colors: [
        { name: 'Stealth Black', hex: '#18181b' },
        { name: 'Navy Blue', hex: '#1e3a8a' }
      ],
      options: ['1.5m Length']
    },
    price_history: {
      current: 299,
      lowest: 279,
      highest: 799,
      deal_score: 95,
      verdict: 'High-Value Pick! Charges both phones and laptops for under ₹300.',
      history: [
        { date: '90d ago', price: 599 },
        { date: '60d ago', price: 399 },
        { date: 'Current', price: 299 }
      ]
    },
    reviews: [
      {
        user_name: 'Deepak Rao',
        rating: 5,
        comment: 'Pumps full 65W into my Dell XPS and Pixel 8 without heating up. Excellent quality.',
        pros: '65W laptop charging, generous 1.5m length, metal ends.',
        cons: 'Does not support 4K display output.'
      }
    ]
  },
  {
    id: 35,
    title: 'Mi 20W Type-C Fast Charger Power Adapter (USB-PD 3.0)',
    slug: 'mi-20w-typec-fast-charger-adapter',
    category: 'Accessories',
    price: 449,
    original_price: 899,
    short_description: 'Compact 20W USB-C wall charger with 8-layer circuit protection and universal PD protocol.',
    description: 'Xiaomi 20W Type-C wall adapter provides high-speed Power Delivery charging in an ultra-compact form factor. Built with flame-retardant PC material and 8-layer multi-point safety protection against power surges, short circuits, and overheating.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    stock: 35,
    rating: 4.7,
    reviews_count: 205,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: {
      colors: [
        { name: 'Pure White', hex: '#ffffff' },
        { name: 'Matte Black', hex: '#1c1c1e' }
      ],
      options: ['20W Single Port']
    },
    price_history: {
      current: 449,
      lowest: 429,
      highest: 899,
      deal_score: 93,
      verdict: 'Essential Accessory! 50% below standard price.',
      history: [
        { date: '90d ago', price: 699 },
        { date: '60d ago', price: 549 },
        { date: 'Current', price: 449 }
      ]
    },
    reviews: [
      {
        user_name: 'Pooja Iyer',
        rating: 5,
        comment: 'Tiny adapter that easily fits into small pockets. Rapid charges my iPhone and Galaxy S23.',
        pros: 'Extremely compact, stays cool while charging, genuine 20W PD.',
        cons: 'Cable is sold separately.'
      }
    ]
  },
  {
    id: 36,
    title: 'UGREEN USB-C to 3.5mm Headphone Jack DAC Adapter (Hi-Res Audio)',
    slug: 'ugreen-usbc-to-35mm-dac-adapter',
    category: 'Accessories',
    price: 349,
    original_price: 699,
    short_description: 'Lossless 24-bit/96kHz DAC audio adapter for USB-C phones, tablets & laptops.',
    description: 'UGREEN USB-C to 3.5mm headphone adapter incorporates a high-grade digital-to-analog converter (DAC) that produces 24-bit/96kHz lossless studio acoustic fidelity. Aluminum alloy casing with kevlar braided strain relief prevents signal interference and supports microphone calls and volume control.',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80',
    stock: 30,
    rating: 4.8,
    reviews_count: 120,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: {
      colors: [
        { name: 'Space Gray Aluminum', hex: '#4b5563' }
      ],
      options: ['Hi-Res DAC Edition']
    },
    price_history: {
      current: 349,
      lowest: 329,
      highest: 699,
      deal_score: 94,
      verdict: 'Audiophile Must-Have! Zero background hiss or static.',
      history: [
        { date: '90d ago', price: 499 },
        { date: 'Current', price: 349 }
      ]
    },
    reviews: [
      {
        user_name: 'Arjun Mehta',
        rating: 5,
        comment: 'Works flawlessly on iPad Air and Galaxy phone. Completely silent background with zero electronic hiss.',
        pros: 'Clean audio output, mic and buttons work, sturdy metal build.',
        cons: 'Slightly warm after 3 hours of continuous playback.'
      }
    ]
  },
  {
    id: 37,
    title: 'Satechi Aluminum USB 3.0 to Type-C OTG Mini Adapter',
    slug: 'satechi-aluminum-usb-to-typec-otg-adapter',
    category: 'Accessories',
    price: 149,
    original_price: 399,
    short_description: '5Gbps SuperSpeed plug-and-play USB to Type-C OTG converter in brushed aluminum.',
    description: 'Convert any legacy USB-A port to USB Type-C or connect flash drives, keyboards, and mice directly to smartphones and laptops. Supports ultra-fast 5Gbps SuperSpeed data transfer and simultaneous charging.',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80',
    stock: 40,
    rating: 4.6,
    reviews_count: 95,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: {
      colors: [
        { name: 'Space Gray', hex: '#4b5563' },
        { name: 'Matte Silver', hex: '#d1d5db' }
      ],
      options: ['Single Adapter']
    },
    price_history: {
      current: 149,
      lowest: 129,
      highest: 399,
      deal_score: 95,
      verdict: 'Super Cheap Must-Have! Essential pocket adapter for just ₹149.',
      history: [
        { date: '90d ago', price: 299 },
        { date: 'Current', price: 149 }
      ]
    },
    reviews: [
      {
        user_name: 'Vivek Nair',
        rating: 5,
        comment: 'Tiny, well-made adapter that fits side-by-side with other ports on my laptop without blocking them.',
        pros: 'Brushed metal finish, solid grip, fast file transfers.',
        cons: 'Can be easy to misplace due to tiny size.'
      }
    ]
  }
];

const API_BASE_URL = window.location.origin.includes('localhost:5000') || window.location.origin.includes('127.0.0.1:5000')
  ? `${window.location.origin}/api`
  : 'http://localhost:5000/api';

// Core HTTP Request Wrapper
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('techstore_token');
  const geminiKey = localStorage.getItem('techstore_gemini_key');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(geminiKey ? { 'x-gemini-key': geminiKey } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

const api = {
  // Authentication & Seller Management
  auth: {
    async register(userData) {
      try {
        return await request('/auth/register', {
          method: 'POST',
          body: userData
        });
      } catch (e) {
        // Offline demo account creation
        const isSeller = userData.role === 'seller';
        const dummyUser = {
          id: Math.floor(100 + Math.random() * 900),
          name: userData.name,
          email: userData.email,
          role: isSeller ? 'seller' : 'customer',
          seller_name: isSeller ? (userData.sellerName || `${userData.name}'s Store`) : null,
          seller_bio: isSeller ? (userData.sellerBio || 'Verified Merchant') : null,
          seller_rating: 5.0,
          seller_reviews_count: 0
        };
        const dummyToken = 'offline_token_' + Date.now();
        return {
          success: true,
          message: isSeller ? 'Seller account created (Offline mode)!' : 'Account created (Offline mode)!',
          token: dummyToken,
          user: dummyUser
        };
      }
    },

    async login(credentials) {
      try {
        return await request('/auth/login', {
          method: 'POST',
          body: credentials
        });
      } catch (e) {
        // Offline demo accounts
        const email = (credentials.email || '').toLowerCase().trim();
        let user;
        if (email === 'demo@techstore.com') {
          user = {
            id: 10,
            name: 'Alex Mercer',
            email: 'demo@techstore.com',
            role: 'customer'
          };
        } else if (email === 'seller.apex@techstore.com') {
          user = {
            id: 1,
            name: 'Apex Tech Store',
            email: 'seller.apex@techstore.com',
            role: 'seller',
            seller_name: 'Apex Tech & Audio',
            seller_bio: 'Official Certified Merchant for enthusiast audio and gaming.',
            seller_rating: 4.9,
            seller_reviews_count: 1480
          };
        } else if (email === 'seller.nordic@techstore.com') {
          user = {
            id: 2,
            name: 'Nordic Living Co.',
            email: 'seller.nordic@techstore.com',
            role: 'seller',
            seller_name: 'Nordic Living & Workspaces',
            seller_bio: 'Minimalist Scandinavian desk setups and 4K displays.',
            seller_rating: 4.8,
            seller_reviews_count: 940
          };
        } else if (email === 'seller.aura@techstore.com') {
          user = {
            id: 3,
            name: 'Aura Wearables Ltd.',
            email: 'seller.aura@techstore.com',
            role: 'seller',
            seller_name: 'Aura Mobile & Wearables',
            seller_bio: 'Authorized dealer for flagship smartphones & smartwatches.',
            seller_rating: 4.9,
            seller_reviews_count: 2150
          };
        } else {
          user = {
            id: 99,
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'customer'
          };
        }

        return {
          success: true,
          message: 'Welcome back, ' + user.name + '!',
          token: 'offline_token_' + Date.now(),
          user
        };
      }
    },

    async getMe() {
      try {
        return await request('/auth/me');
      } catch (e) {
        const local = JSON.parse(localStorage.getItem('techstore_user') || 'null');
        if (local) return { success: true, user: local };
        throw new Error('Not authenticated');
      }
    },

    async becomeSeller(sellerData) {
      try {
        return await request('/auth/become-seller', {
          method: 'POST',
          body: sellerData
        });
      } catch (e) {
        const local = JSON.parse(localStorage.getItem('techstore_user') || '{}');
        local.role = 'seller';
        local.seller_name = sellerData.sellerName || `${local.name}'s Store`;
        local.seller_bio = sellerData.sellerBio || 'Verified Independent Merchant on TechStore';
        local.seller_rating = 5.0;
        local.seller_reviews_count = 0;
        localStorage.setItem('techstore_user', JSON.stringify(local));
        return {
          success: true,
          message: `Congratulations! You are now a verified seller.`,
          user: local
        };
      }
    },

    async getSellers() {
      try {
        return await request('/auth/sellers');
      } catch (e) {
        return { success: true, sellers: FALLBACK_SELLERS };
      }
    }
  },

  // Product Catalog & Seller Listings
  products: {
    async getAll(params = {}) {
      try {
        const query = new URLSearchParams();
        if (params.category && params.category !== 'All') query.append('category', params.category);
        if (params.search) query.append('search', params.search);
        if (params.sort) query.append('sort', params.sort);
        if (params.minPrice) query.append('minPrice', params.minPrice);
        if (params.maxPrice) query.append('maxPrice', params.maxPrice);
        if (params.sellerId) query.append('sellerId', params.sellerId);
        if (params.inStockOnly) query.append('inStockOnly', 'true');

        const qs = query.toString();
        return await request(`/products${qs ? '?' + qs : ''}`);
      } catch (e) {
        // Filter offline products
        let list = [...FALLBACK_PRODUCTS];
        if (params.category && params.category !== 'All') {
          list = list.filter(p => p.category === params.category);
        }
        if (params.sellerId) {
          list = list.filter(p => p.seller_id === Number(params.sellerId));
        }
        if (params.inStockOnly) {
          list = list.filter(p => p.stock > 0);
        }
        if (params.search) {
          const s = params.search.toLowerCase();
          list = list.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
        }
        return { success: true, count: list.length, products: list, isFallback: true };
      }
    },

    async getById(id) {
      try {
        return await request(`/products/${id}`);
      } catch (e) {
        const prod = FALLBACK_PRODUCTS.find(p => p.id === Number(id) || p.slug === id);
        if (prod) return { success: true, product: prod };
        throw new Error('Product not found');
      }
    },

    async getFeatured() {
      try {
        return await request('/products/featured');
      } catch (e) {
        return { success: true, products: FALLBACK_PRODUCTS.filter(p => p.featured) };
      }
    },

    async getCategories() {
      try {
        return await request('/products/categories');
      } catch (e) {
        const map = {};
        FALLBACK_PRODUCTS.forEach(p => {
          map[p.category] = (map[p.category] || 0) + 1;
        });
        const categories = Object.keys(map).map(category => ({ category, count: map[category] }));
        return { success: true, categories };
      }
    },

    async createListing(productData) {
      try {
        return await request('/products', {
          method: 'POST',
          body: productData
        });
      } catch (e) {
        const newId = Date.now();
        const dummyProd = {
          id: newId,
          ...productData,
          slug: productData.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + newId,
          stock: Number(productData.stock) || 10,
          price: Number(productData.price),
          rating: 5.0,
          reviews_count: 1,
          seller_name: State.user?.seller_name || 'My Store',
          seller_rating: 5.0
        };
        FALLBACK_PRODUCTS.unshift(dummyProd);
        return { success: true, message: 'Product listed successfully!', product: dummyProd };
      }
    },

    async getSellerListings() {
      try {
        return await request('/products/seller/my-listings');
      } catch (e) {
        const currentUserId = State.user?.id || 1;
        const myProducts = FALLBACK_PRODUCTS.filter(p => p.seller_id === currentUserId);
        return { success: true, products: myProducts };
      }
    },

    async updateStock(id, stock) {
      try {
        return await request(`/products/${id}/stock`, {
          method: 'PUT',
          body: { stock }
        });
      } catch (e) {
        const p = FALLBACK_PRODUCTS.find(x => x.id === Number(id));
        if (p) p.stock = Number(stock);
        return { success: true, stock: Number(stock) };
      }
    },

    async deleteListing(id) {
      try {
        return await request(`/products/${id}`, {
          method: 'DELETE'
        });
      } catch (e) {
        const idx = FALLBACK_PRODUCTS.findIndex(x => x.id === Number(id));
        if (idx > -1) FALLBACK_PRODUCTS.splice(idx, 1);
        return { success: true, message: 'Listing removed.' };
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
        const orderNumber = `ORD-2025-${Math.floor(100000 + Math.random() * 900000)}`;
        const subtotal = orderPayload.items.reduce((sum, it) => sum + (it.price || 999) * it.quantity, 0);
        let discount = 0;
        if (orderPayload.discountCode && (orderPayload.discountCode.toUpperCase() === 'TECH15' || orderPayload.discountCode.toUpperCase() === 'SAVE15')) {
          discount = subtotal * 0.15;
        }
        const shippingFee = subtotal >= 499 ? 0 : 49;
        const tax = (subtotal - discount) * 0.18;
        const total = subtotal - discount + tax + shippingFee;

        const localOrder = {
          orderNumber,
          customerName: orderPayload.customerName,
          customerEmail: orderPayload.customerEmail,
          total: total,
          subtotal: subtotal,
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
  },

  // AI Assistant (Gemini & Heuristic Engine)
  ai: {
    async chat(query, productId = null, intent = null, history = []) {
      try {
        return await request('/ai/chat', {
          method: 'POST',
          body: { query, productId, intent, history }
        });
      } catch (e) {
        // Client-side fallback if server is unreachable
        let reply = `### 🤖 TechStore AI Assistant\nI am currently operating in offline mode. You can view product specs, reviews, and variants directly on the product cards.`;
        return { success: true, reply, source: 'offline_fallback' };
      }
    },

    async summarizeReviews(productId) {
      try {
        return await request('/ai/summarize-reviews', {
          method: 'POST',
          body: { productId }
        });
      } catch (e) {
        return {
          success: true,
          summary: `### 🤖 AI Review Summary\nCustomers love the exceptional design and fast performance. Minor remarks noted that battery and form factor are best suited for everyday desktop or commuting use.`
        };
      }
    },

    async getPriceAdvice(productId) {
      try {
        return await request('/ai/price-advisor', {
          method: 'POST',
          body: { productId }
        });
      } catch (e) {
        return {
          success: true,
          advice: `### 📈 AI Price Advisor\nCurrent price represents great value compared to original release pricing. Great time to buy!`
        };
      }
    }
  }
};

window.api = api;
