const bcrypt = require('bcryptjs');
const { db, run, get, all, initDatabase } = require('./database');

// 3 Demo Sellers info
const DEMO_SELLERS = [
  {
    id: 1,
    name: 'Apex Tech Store',
    email: 'seller.apex@techstore.com',
    password: 'password123',
    role: 'seller',
    seller_name: 'Apex Tech & Audio',
    seller_bio: 'Authorized merchant specializing in audiophile headphones, high-end mechanical keyboards, and next-gen gaming consoles.',
    seller_rating: 4.9,
    seller_reviews_count: 1480
  },
  {
    id: 2,
    name: 'Nordic Living Co.',
    email: 'seller.nordic@techstore.com',
    password: 'password123',
    role: 'seller',
    seller_name: 'Nordic Living & Workspaces',
    seller_bio: 'Minimalist Scandinavian desk setups, 4K color-accurate displays, ergonomic peripherals, and studio lighting.',
    seller_rating: 4.8,
    seller_reviews_count: 940
  },
  {
    id: 3,
    name: 'Aura Wearables Ltd.',
    email: 'seller.aura@techstore.com',
    password: 'password123',
    role: 'seller',
    seller_name: 'Aura Mobile & Wearables',
    seller_bio: 'Premier distributor of flagship smartphones, biometric smartwatches, and MagSafe charging accessories.',
    seller_rating: 4.9,
    seller_reviews_count: 2150
  }
];

// Demo Buyer Customer
const DEMO_CUSTOMER = {
  name: 'Alex Mercer',
  email: 'demo@techstore.com',
  password: 'password123',
  role: 'customer'
};

// 32 Rich Demo Products with Variants, Stock Urgencies, Price Histories, and Pros/Cons
const seedProducts = [
  // ---------------- APEX TECH & AUDIO (Audio & Gaming) ----------------
  {
    title: 'Sony WH-1000XM4 Wireless Noise-Cancelling Headphones',
    slug: 'sony-wh1000xm4-wireless-headphones',
    category: 'Audio',
    price: 19999,
    original_price: 29990,
    short_description: 'Industry-leading noise cancellation, 30-hour battery, touch controls, and LDAC high-res audio.',
    description: 'Immerse yourself in pure music with Sony WH-1000XM4. Dual noise sensor technology captures ambient noise and passes the data to the trusted HD Noise Cancelling Processor QN1. Featuring Speak-to-Chat, multipoint Bluetooth connection, and up to 30 hours of continuous battery life.',
    image: 'images/products/sony_wh1000xm4.jpg',
    gallery: JSON.stringify([
      'images/products/sony_wh1000xm4.jpg',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 18,
    rating: 4.8,
    reviews_count: 86,
    featured: 1,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Midnight Black', hex: '#1c1c1e' },
        { name: 'Platinum Silver', hex: '#d4d4d8' },
        { name: 'Silent White', hex: '#f8fafc' }
      ],
      options: ['Standard Edition']
    }),
    price_history: JSON.stringify({
      current: 19999,
      lowest: 19499,
      highest: 29990,
      deal_score: 93,
      verdict: 'Best Time to Buy! Current price ₹19,999 is 33% below original M.R.P. and just ₹500 above the all-time historic low.',
      history: [
        { date: '90d ago', price: 24990 },
        { date: '60d ago', price: 22490 },
        { date: '30d ago', price: 20999 },
        { date: 'Current', price: 19999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Sony',
      'Model': 'WH-1000XM4',
      'Type': 'Over-Ear Wireless',
      'Battery Life': '30 Hours (Quick Charge: 10 min for 5 hours)',
      'Noise Cancellation': 'Industry-leading Active Noise Cancellation (HD QN1)',
      'Connectivity': 'Bluetooth 5.0 (LDAC, AAC, SBC) + 3.5mm Jack',
      'Warranty': '1 Year Sony Official Warranty'
    }),
    reviews: [
      {
        user_name: 'Rahul Sharma',
        rating: 5,
        comment: 'The active noise cancellation is practically magic on flights and during work calls. Audio quality is rich and punchy with LDAC.',
        pros: 'Superb ANC, extremely comfortable for 6+ hours, fast USB-C charging, multipoint device pairing.',
        cons: 'Microphone pickup in crowded outdoor streets could be clearer.'
      },
      {
        user_name: 'Emily Watson',
        rating: 4,
        comment: 'Great headphones overall. Soundstage is wide and battery truly lasts nearly 30 hours. Earcups get slightly warm during gym sessions.',
        pros: 'Incredible bass response, custom EQ in companion app, folding case included.',
        cons: 'Not water-resistant; avoid heavy sweat or rain.'
      },
      {
        user_name: 'David K.',
        rating: 5,
        comment: 'Upgraded from XM3 and the multipoint connection switching between MacBook and phone is flawless. Well worth the price.',
        pros: 'Multipoint Bluetooth switching, Speak-to-chat feature, plush ear pads.',
        cons: 'Touch controls can sometimes misfire if wearing a hoodie.'
      }
    ]
  },
  {
    title: 'Apple AirPods Pro (2nd Generation, USB-C)',
    slug: 'apple-airpods-pro-2nd-gen',
    category: 'Audio',
    price: 20999,
    original_price: 24900,
    short_description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, and MagSafe Charging Case (USB-C).',
    description: 'AirPods Pro (2nd Gen) with USB-C deliver exceptional acoustic fidelity powered by the Apple H2 chip. Experience next-level Active Noise Cancellation, Adaptive Audio that automatically tailors noise control to your environment, and Personalized Spatial Audio with dynamic head tracking.',
    image: 'images/products/apple_airpods_pro.jpg',
    gallery: JSON.stringify([
      'images/products/apple_airpods_pro.jpg',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 3, // LOW STOCK
    rating: 4.9,
    reviews_count: 112,
    featured: 1,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Glossy White', hex: '#f8fafc' }
      ],
      options: ['USB-C MagSafe Case']
    }),
    price_history: JSON.stringify({
      current: 20999,
      lowest: 19999,
      highest: 24900,
      deal_score: 88,
      verdict: 'Great Deal! At ₹20,999 with USB-C case, stock is running low (only 3 left). Ideal time to grab before price hike.',
      history: [
        { date: '90d ago', price: 24900 },
        { date: '60d ago', price: 22990 },
        { date: '30d ago', price: 21499 },
        { date: 'Current', price: 20999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Apple',
      'Chip': 'Apple H2 Headphone Chip',
      'Audio Technology': 'Active Noise Cancellation, Adaptive Audio, Transparency Mode',
      'Case': 'MagSafe Charging Case (USB-C) with Speaker and Lanyard loop',
      'Battery': 'Up to 6 hours listening (up to 30 hours with case)',
      'Resistance': 'IP54 dust, sweat, and water resistant'
    }),
    reviews: [
      {
        user_name: 'Ananya Rao',
        rating: 5,
        comment: 'Transparency mode is so natural you forget you are wearing earbuds. Seamless integration with Apple devices.',
        pros: 'Unmatched transparency mode, tiny pocketable case, USB-C convenience, crystal clear mic.',
        cons: 'Battery life per charge is around 5.5 hours, less than over-ear alternatives.'
      },
      {
        user_name: 'Mark Henderson',
        rating: 5,
        comment: 'The Adaptive Audio mode is a game changer for city walking. Automatically dials down sirens while letting conversations through.',
        pros: 'Adaptive noise cancelling, lanyard loop on case, find-my speaker in case.',
        cons: 'Glossy case scratches easily without a protective skin.'
      }
    ]
  },
  {
    title: 'Sony PlayStation 5 Slim Console (1TB SSD)',
    slug: 'sony-playstation-5-console',
    category: 'Gaming',
    price: 49990,
    original_price: 54990,
    short_description: 'Ultra-fast 1TB SSD, ray tracing, 4K gaming up to 120fps, 3D audio, and DualSense haptic feedback.',
    description: 'Experience lightning-fast loading with an ultra-high speed 1TB SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.',
    image: 'images/products/sony_ps5_console.jpg',
    gallery: JSON.stringify([
      'images/products/sony_ps5_console.jpg',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 4, // LOW STOCK
    rating: 5.0,
    reviews_count: 142,
    featured: 1,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Glacial White', hex: '#f1f5f9' },
        { name: 'Midnight Black', hex: '#0f172a' }
      ],
      options: ['Disc Edition (1TB)', 'Digital Edition (1TB)']
    }),
    price_history: JSON.stringify({
      current: 49990,
      lowest: 48990,
      highest: 54990,
      deal_score: 91,
      verdict: 'Highly Recommended! ₹5,000 flat discount off launch M.R.P. Fast selling with only 4 units remaining.',
      history: [
        { date: '90d ago', price: 54990 },
        { date: '60d ago', price: 52990 },
        { date: '30d ago', price: 50990 },
        { date: 'Current', price: 49990 }
      ]
    }),
    specs: JSON.stringify({
      'Storage': '1TB Custom Ultra-High Speed NVMe SSD',
      'Processor': 'Custom AMD Zen 2 8-core CPU up to 3.5GHz',
      'Graphics': 'AMD RDNA 2 GPU with Hardware Ray Tracing',
      'Output': '4K 120Hz, 8K, HDR, VRR HDMI 2.1',
      'Controller': 'DualSense Wireless Controller included'
    }),
    reviews: [
      {
        user_name: 'Vikram Joshi',
        rating: 5,
        comment: 'Load times in Spider-Man 2 and God of War Ragnarok are literally 2 seconds. The DualSense adaptive triggers feel incredible.',
        pros: 'Mind-blowing SSD speed, quiet fan, immersive haptic feedback, 4K 60fps performance.',
        cons: 'Console body is fairly tall; make sure your entertainment shelf has vertical room.'
      },
      {
        user_name: 'Liam S.',
        rating: 5,
        comment: 'Runs whisper quiet even in intensive ray-traced sequences. The 1TB upgrade is much needed over original PS5.',
        pros: 'Generous 1TB usable storage, stunning exclusive game library, smooth 120fps.',
        cons: 'Horizontal stand plastic clips feel basic.'
      }
    ]
  },
  {
    title: 'Bose QuietComfort Ultra Wireless Headphones',
    slug: 'bose-quietcomfort-ultra-headphones',
    category: 'Audio',
    price: 32900,
    original_price: 37900,
    short_description: 'World-class active noise cancellation, breakthrough spatialized audio, and ultra-luxurious comfort.',
    description: 'Bose QuietComfort Ultra headphones push boundaries with world-class noise cancellation quieter than ever before. Breakthrough spatial audio delivers immersive listening that makes music feel more real than ever. CustomTune technology personalizes sound to the shape of your ears.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 2, // LOW STOCK
    rating: 4.8,
    reviews_count: 48,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Black', hex: '#18181b' },
        { name: 'White Smoke', hex: '#e2e8f0' },
        { name: 'Sandstone Gold', hex: '#d6c7b2' }
      ],
      options: ['Standard Edition']
    }),
    price_history: JSON.stringify({
      current: 32900,
      lowest: 31900,
      highest: 37900,
      deal_score: 87,
      verdict: 'Solid Buy! Bose flagship model at ₹5,000 discount. Only 2 pairs in stock.',
      history: [
        { date: '90d ago', price: 37900 },
        { date: '60d ago', price: 35900 },
        { date: '30d ago', price: 33900 },
        { date: 'Current', price: 32900 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Bose',
      'Model': 'QuietComfort Ultra',
      'Battery Life': 'Up to 24 hours (up to 18 hours with Immersive Audio)',
      'Audio Mode': 'Quiet, Aware, and Immersion',
      'Connectivity': 'Bluetooth 5.3 with Snapdragon Sound'
    }),
    reviews: [
      {
        user_name: 'Daniel Chen',
        rating: 5,
        comment: 'Hands down the most comfortable over-ear headphones ever designed. You can wear these all day without any clamp fatigue.',
        pros: 'Unmatched headband comfort, class-leading low frequency noise cancellation.',
        cons: 'Immersive audio mode drains battery slightly quicker.'
      }
    ]
  },
  {
    title: 'JBL Flip 6 Waterproof Portable Bluetooth Speaker',
    slug: 'jbl-flip-6-portable-speaker',
    category: 'Audio',
    price: 9999,
    original_price: 13999,
    short_description: 'Bold JBL Original Pro Sound, IP67 waterproof & dustproof, and 12 hours of playtime.',
    description: 'The beat goes on with the JBL Flip 6 2-way speaker system, engineered to deliver loud, crystal clear, powerful sound. Its racetrack-shaped woofer delivers exceptional low frequencies and midrange, while a separate tweeter produces crisp, clear high-frequencies.',
    image: 'images/products/jbl_flip_6.jpg',
    gallery: JSON.stringify([
      'images/products/jbl_flip_6.jpg',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 14,
    rating: 4.7,
    reviews_count: 94,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Ocean Blue', hex: '#0284c7' },
        { name: 'Midnight Black', hex: '#18181b' },
        { name: 'Fiery Red', hex: '#dc2626' },
        { name: 'Squad Camo', hex: '#4d5b44' }
      ],
      options: ['Standard']
    }),
    price_history: JSON.stringify({
      current: 9999,
      lowest: 8999,
      highest: 13999,
      deal_score: 90,
      verdict: 'Best Time to Buy! Under ₹10k with solid ₹4,000 instant discount. Great for outdoor trips and parties.',
      history: [
        { date: '90d ago', price: 12999 },
        { date: '60d ago', price: 11499 },
        { date: '30d ago', price: 10499 },
        { date: 'Current', price: 9999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'JBL',
      'Output Power': '30W RMS (20W woofer + 10W tweeter)',
      'Waterproof': 'IP67 Waterproof and Dustproof',
      'Battery': '12 Hours Playtime (Type-C USB charging)'
    }),
    reviews: [
      {
        user_name: 'Karan Mehra',
        rating: 5,
        comment: 'Surprisingly heavy bass for such a compact cylinder. Took it to the beach and washed sand off under the tap without issue.',
        pros: 'Completely waterproof, punchy bass, PartyBoost link with other JBL speakers.',
        cons: 'No built-in microphone for phone calls or voice assistants.'
      }
    ]
  },
  {
    title: 'Xbox Wireless Controller (Robot White / Carbon Black)',
    slug: 'xbox-wireless-controller',
    category: 'Gaming',
    price: 4999,
    original_price: 5990,
    short_description: 'Textured grip, hybrid D-pad, button mapping, and 3.5mm audio jack for PC and Xbox.',
    description: 'Experience the modernized design of the Xbox Wireless Controller, featuring sculpted surfaces and refined geometry for enhanced comfort during gameplay. Stay on target with textured grip and a hybrid D-pad.',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 12,
    rating: 4.8,
    reviews_count: 67,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Carbon Black', hex: '#18181b' },
        { name: 'Robot White', hex: '#f8fafc' },
        { name: 'Shock Blue', hex: '#2563eb' },
        { name: 'Pulse Red', hex: '#ef4444' }
      ],
      options: ['Controller Only']
    }),
    price_history: JSON.stringify({
      current: 4999,
      lowest: 4699,
      highest: 5990,
      deal_score: 86,
      verdict: 'Good deal! Compatible with Windows 11 PC, Steam, iPad, and Xbox right out of the box.',
      history: [
        { date: '90d ago', price: 5990 },
        { date: '60d ago', price: 5490 },
        { date: '30d ago', price: 5190 },
        { date: 'Current', price: 4999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Microsoft',
      'Compatibility': 'Xbox Series X|S, Xbox One, Windows 10/11, Android, iOS',
      'Connectivity': 'Xbox Wireless and Bluetooth',
      'Battery': 'Up to 40 hours with AA batteries'
    }),
    reviews: [
      {
        user_name: 'Siddharth M.',
        rating: 5,
        comment: 'Connects instantly via Bluetooth to my gaming laptop without lag. The textured triggers feel fantastic in Forza Horizon.',
        pros: 'Ergonomic shape, clicky responsive D-pad, universal PC compatibility.',
        cons: 'Comes with disposable AA batteries rather than built-in rechargeable battery pack.'
      }
    ]
  },
  {
    title: 'Razer BlackShark V2 Pro Wireless Esports Headset',
    slug: 'razer-blackshark-v2-pro',
    category: 'Gaming',
    price: 14999,
    original_price: 19999,
    short_description: 'HyperClear Super Wideband Mic, TriForce Titanium 50mm Drivers, and ultra-low latency wireless.',
    description: 'Designed for esports pros, the Razer BlackShark V2 Pro delivers studio-quality microphone voice pickup, pin-point directional acoustic drivers, and up to 70 hours of battery life with ultra-soft memory foam ear cushions.',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 9,
    rating: 4.7,
    reviews_count: 53,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Classic Black', hex: '#09090b' },
        { name: 'Mercury White', hex: '#f4f4f5' }
      ],
      options: ['2.4GHz + Bluetooth Edition']
    }),
    price_history: JSON.stringify({
      current: 14999,
      lowest: 13999,
      highest: 19999,
      deal_score: 89,
      verdict: 'Great Esports Deal! 25% discount on top-tier competitive gaming audio with 70h battery.',
      history: [
        { date: '90d ago', price: 18999 },
        { date: '60d ago', price: 16999 },
        { date: '30d ago', price: 15499 },
        { date: 'Current', price: 14999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Razer',
      'Drivers': 'Razer TriForce Titanium 50mm',
      'Battery Life': 'Up to 70 Hours',
      'Weight': '320g lightweight design'
    }),
    reviews: [
      {
        user_name: 'Gaurav Sen',
        rating: 5,
        comment: 'The microphone is easily the clearest wireless mic on any headset I have tested. Valorant teammates thought I was on an XLR mic.',
        pros: 'Broadcast-quality mic, zero clamp pressure on glasses, 70 hour battery.',
        cons: 'Passive noise isolation only; does not have active noise cancellation.'
      }
    ]
  },
  {
    title: 'Nintendo Switch OLED Model (White / Neon Joy-Con)',
    slug: 'nintendo-switch-oled-model',
    category: 'Gaming',
    price: 31999,
    original_price: 34999,
    short_description: 'Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN dock, and 64GB storage.',
    description: 'Feast your eyes on vivid colors and crisp contrast when you play on-the-go. See the difference the vibrant screen makes, whether you are racing at top speed or squaring off against enemies.',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 0, // OUT OF STOCK DEMO!
    rating: 4.9,
    reviews_count: 89,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'OLED White', hex: '#f8fafc' },
        { name: 'Neon Red & Blue', hex: '#ef4444' }
      ],
      options: ['64GB Console']
    }),
    price_history: JSON.stringify({
      current: 31999,
      lowest: 30999,
      highest: 34999,
      deal_score: 82,
      verdict: 'Wait for Restock! Currently sold out due to high holiday demand. Next shipment expected within 5-7 days.',
      history: [
        { date: '90d ago', price: 34999 },
        { date: '60d ago', price: 33499 },
        { date: '30d ago', price: 32499 },
        { date: 'Current', price: 31999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Nintendo',
      'Display': '7.0-inch OLED Touchscreen (1280x720)',
      'Storage': '64GB Internal (microSD expandable up to 2TB)',
      'Battery Life': '4.5 to 9 Hours depending on game'
    }),
    reviews: [
      {
        user_name: 'Arjun Das',
        rating: 5,
        comment: 'The OLED screen makes Legend of Zelda: Tears of the Kingdom look breathtaking. The blacks are truly pitch black.',
        pros: 'Stunning OLED contrast, sturdy full-width kickstand, enhanced audio speakers.',
        cons: 'Internal processing chip is the same as the original Switch.'
      }
    ]
  },
  {
    title: 'Marshall Stanmore III Bluetooth Home Speaker',
    slug: 'marshall-stanmore-iii-speaker',
    category: 'Audio',
    price: 33999,
    original_price: 37999,
    short_description: 'Legendary room-filling sound, brass tactile knobs, and iconic vintage rock-and-roll styling.',
    description: 'Stanmore III has an even wider soundstage than its predecessor, delivering home-filling Marshall signature sound. Outward-angled tweeters and updated waveguides deliver a consistently solid sound that is so wide it chases you around the room.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 5, // LOW STOCK
    rating: 4.8,
    reviews_count: 41,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Vintage Black', hex: '#1c1917' },
        { name: 'Cream White', hex: '#fef3c7' },
        { name: 'Deep Brown', hex: '#78350f' }
      ],
      options: ['AC Powered Home Unit']
    }),
    price_history: JSON.stringify({
      current: 33999,
      lowest: 32999,
      highest: 37999,
      deal_score: 85,
      verdict: 'Good Time to Buy! Beautiful centerpiece speaker with ₹4,000 discount. Only 5 units in stock.',
      history: [
        { date: '90d ago', price: 37999 },
        { date: '60d ago', price: 35999 },
        { date: '30d ago', price: 34499 },
        { date: 'Current', price: 33999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Marshall',
      'Power Amplifiers': 'One 50 Watt Class D amplifier for woofer + Two 15 Watt Class D amplifiers for tweeters',
      'Frequency Range': '45–20,000 Hz',
      'Inputs': 'Bluetooth 5.2, 3.5mm Aux, RCA inputs'
    }),
    reviews: [
      {
        user_name: 'Rohan Roy',
        rating: 5,
        comment: 'Looks gorgeous on the bookshelf and the bass dials actually do what they are supposed to. Pure warmth and presence.',
        pros: 'Iconic vintage aesthetics, physical brass bass/treble knobs, RCA input for turntables.',
        cons: 'AC powered only; not a portable battery speaker.'
      }
    ]
  },
  {
    title: 'Sennheiser Momentum 4 Wireless ANC Headphones',
    slug: 'sennheiser-momentum-4-wireless',
    category: 'Audio',
    price: 24990,
    original_price: 34990,
    short_description: 'Unmatched 60-hour battery life, audiophile-inspired 42mm transducer system, and adaptive noise cancellation.',
    description: 'Get immersed in audiophile-grade detail with Sennheiser Momentum 4 Wireless. Featuring an incredible 60-hour continuous battery life, sound personalization, and hybrid adaptive ANC that keeps you locked into your music.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 8,
    rating: 4.8,
    reviews_count: 57,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Matte Black', hex: '#18181b' },
        { name: 'White & Copper', hex: '#f8fafc' },
        { name: 'Denim Edition', hex: '#3b82f6' }
      ],
      options: ['Standard']
    }),
    price_history: JSON.stringify({
      current: 24990,
      lowest: 23990,
      highest: 34990,
      deal_score: 94,
      verdict: 'Best Time to Buy! Massive ₹10,000 drop from launch price. Best battery life on the market.',
      history: [
        { date: '90d ago', price: 31990 },
        { date: '60d ago', price: 28990 },
        { date: '30d ago', price: 26490 },
        { date: 'Current', price: 24990 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Sennheiser',
      'Battery Life': 'Up to 60 Hours with Bluetooth and ANC active',
      'Drivers': '42mm dynamic transducers',
      'Audio Codecs': 'aptX, aptX adaptive, AAC, SBC'
    }),
    reviews: [
      {
        user_name: 'Tanvi Shah',
        rating: 5,
        comment: '60 hours of battery is not an exaggeration. I literally charge these once every two to three weeks. Sound clarity is crisp and neutral.',
        pros: 'Battery life outclasses every competitor, aptX Adaptive support, very comfortable headband.',
        cons: 'Does not fold into a compact ball like Sony XM4 (folds flat only).'
      }
    ]
  },

  // ---------------- NORDIC LIVING & WORKSPACES (Monitors, Desks, Peripherals) ----------------
  {
    title: 'Keychron K2 Wireless Mechanical Keyboard (RGB Backlit)',
    slug: 'keychron-k2-wireless-keyboard',
    category: 'Peripherals',
    price: 7499,
    original_price: 9999,
    short_description: 'Compact 75% layout, Gateron Red linear switches, vibrant RGB lighting, and dual Mac/Windows support.',
    description: 'The Keychron K2 is a 75% layout wireless mechanical keyboard that retains all essential multimedia and function keys. Connects with up to 3 devices via Bluetooth 5.1 and switches easily among them. Features smooth linear Gateron G Pro Red switches and striking RGB backlighting.',
    image: 'images/products/keychron_k2.jpg',
    gallery: JSON.stringify([
      'images/products/keychron_k2.jpg',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 15,
    rating: 4.8,
    reviews_count: 73,
    featured: 1,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Space Gray (Aluminium Frame)', hex: '#4b5563' },
        { name: 'Retro White & Charcoal', hex: '#e5e7eb' }
      ],
      options: ['Gateron Red (Smooth Linear)', 'Gateron Brown (Tactile Quiet)', 'Gateron Blue (Clicky)']
    }),
    price_history: JSON.stringify({
      current: 7499,
      lowest: 6999,
      highest: 9999,
      deal_score: 90,
      verdict: 'Best Time to Buy! ₹2,500 savings on the most popular Mac/PC mechanical keyboard. Steady supply.',
      history: [
        { date: '90d ago', price: 9499 },
        { date: '60d ago', price: 8499 },
        { date: '30d ago', price: 7999 },
        { date: 'Current', price: 7499 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Keychron',
      'Layout': '75% Compact (84 Keys)',
      'Switches': 'Gateron G Pro Hot-Swappable Switches',
      'Connectivity': 'Bluetooth 5.1 & Type-C Wired Cable',
      'Battery': '4000mAh (Up to 240 hours without backlight)'
    }),
    reviews: [
      {
        user_name: 'Nikhil Verma',
        rating: 5,
        comment: 'Best mechanical keyboard for Mac users. Comes with dedicated Mac command & option keycaps. The typing sound is so satisfying.',
        pros: 'Seamless Bluetooth device switching, 4000mAh giant battery, includes Windows & Mac keycaps.',
        cons: 'Body is somewhat tall; pairs best with a wooden wrist rest.'
      },
      {
        user_name: 'Chloe Bennett',
        rating: 5,
        comment: 'Got the Gateron Brown switches and they are silent enough for office video calls while providing great tactile feedback.',
        pros: 'Hot-swappable switch board, solid aluminium rails, compact desk footprint.',
        cons: 'RGB presets cannot be reprogrammed via software on standard K2.'
      }
    ]
  },
  {
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    slug: 'logitech-mx-master-3s-mouse',
    category: 'Peripherals',
    price: 8995,
    original_price: 10995,
    short_description: 'Quiet Click technology, 8000 DPI track-on-glass sensor, and MagSpeed electromagnetic scrolling.',
    description: 'Logitech MX Master 3S is an icon remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 22,
    rating: 4.9,
    reviews_count: 128,
    featured: 1,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Graphite Black', hex: '#1f2937' },
        { name: 'Pale Gray', hex: '#f3f4f6' }
      ],
      options: ['Logi Bolt + Bluetooth']
    }),
    price_history: JSON.stringify({
      current: 8995,
      lowest: 8495,
      highest: 10995,
      deal_score: 92,
      verdict: 'Best Time to Buy! Near historical lowest price. The gold standard ergonomic mouse for productivity.',
      history: [
        { date: '90d ago', price: 10495 },
        { date: '60d ago', price: 9795 },
        { date: '30d ago', price: 9295 },
        { date: 'Current', price: 8995 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Logitech',
      'Sensor': 'Darkfield 8000 DPI (Tracks on glass)',
      'Scroll Wheel': 'MagSpeed Electromagnetic (1000 lines/sec)',
      'Battery': 'Rechargeable Li-Po (500 mAh) up to 70 days per charge'
    }),
    reviews: [
      {
        user_name: 'Pooja Nair',
        rating: 5,
        comment: 'The MagSpeed scroll wheel lets you zip through 1,000 Excel rows in a second. The silent click switch is a huge upgrade.',
        pros: 'Virtually silent clicks, works on clear glass desks, horizontal thumb wheel.',
        cons: 'Right-handed ergonomic shape only; not suitable for left-handers.'
      }
    ]
  },
  {
    title: 'Apple Studio Display 27" 5K Retina (Tilt-Adjustable)',
    slug: 'apple-studio-display-27',
    category: 'Monitors',
    price: 149900,
    original_price: 159900,
    short_description: '27-inch 5K Retina display, 12MP Ultra Wide camera with Center Stage, and studio-quality 6-speaker system.',
    description: 'A sight to be behold. A sound to be heard. 14.7 million pixels of sheer brilliance, 600 nits of brightness, P3 wide color, and True Tone. Powered by the Apple A13 Bionic chip for Center Stage and Spatial Audio.',
    image: 'images/products/apple_studio_display.jpg',
    gallery: JSON.stringify([
      'images/products/apple_studio_display.jpg',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 5, // LOW STOCK
    rating: 4.9,
    reviews_count: 38,
    featured: 1,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Silver Aluminium', hex: '#e2e8f0' }
      ],
      options: ['Standard Glass (Glossy)', 'Nano-Texture Glass (Anti-Reflective)']
    }),
    price_history: JSON.stringify({
      current: 149900,
      lowest: 145000,
      highest: 159900,
      deal_score: 84,
      verdict: 'Rare Discount! Apple Studio Display rarely drops below ₹150k. Excellent purchase for creative workstations.',
      history: [
        { date: '90d ago', price: 159900 },
        { date: '60d ago', price: 154900 },
        { date: '30d ago', price: 151900 },
        { date: 'Current', price: 149900 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Apple',
      'Panel': '27-inch 5K Retina (5120 x 2880 at 218 ppi)',
      'Brightness': '600 nits, P3 Wide Color, 1 Billion colors',
      'Ports': 'One Thunderbolt 3 (96W Host Charging) + Three USB-C 10Gbps ports',
      'Audio & Mic': 'Six-speaker sound system with force-cancelling woofers'
    }),
    reviews: [
      {
        user_name: 'Kavita Menon',
        rating: 5,
        comment: 'Text sharpness on macOS is unmatched at 218 PPI. The built-in speakers sound as good as dedicated desktop bookshelf speakers.',
        pros: 'Pin-sharp 5K text scaling, 96W single-cable Mac charging, phenomenal built-in speakers.',
        cons: 'Stand height is fixed on base model (tilt only).'
      }
    ]
  },
  {
    title: 'BenQ ScreenBar Halo LED Monitor Light Bar',
    slug: 'benq-screenbar-halo-light',
    category: 'Accessories',
    price: 15990,
    original_price: 18990,
    short_description: 'Wireless controller, front and back dual bias lighting, auto-dimming, and zero screen glare.',
    description: 'BenQ ScreenBar Halo is the ultimate monitor light bar engineered to reduce eye strain. Features an optical asymmetric design that illuminates only your desk surface with zero reflection on the monitor screen, plus back ambient illumination.',
    image: 'images/products/benq_screenbar.jpg',
    gallery: JSON.stringify([
      'images/products/benq_screenbar.jpg',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 7,
    rating: 4.8,
    reviews_count: 45,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Metallic Gray', hex: '#64748b' }
      ],
      options: ['Wireless Dial Edition']
    }),
    price_history: JSON.stringify({
      current: 15990,
      lowest: 14990,
      highest: 18990,
      deal_score: 87,
      verdict: 'Recommended Buy! Eliminates late-night desk eye fatigue. Premium wireless rotating control puck included.',
      history: [
        { date: '90d ago', price: 18990 },
        { date: '60d ago', price: 17490 },
        { date: '30d ago', price: 16490 },
        { date: 'Current', price: 15990 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'BenQ',
      'Illumination': 'Asymmetric optical design (500 Lux at 45cm)',
      'Color Temperature': '2700K to 6500K adjustable',
      'Controller': 'Precision 2.4GHz wireless control puck'
    }),
    reviews: [
      {
        user_name: 'Devansh Roy',
        rating: 5,
        comment: 'Completely cured my dry eye issues during late night coding sprints. The wireless rotary knob feels like high-end audio gear.',
        pros: 'Zero glare on glossy screens, rear bias light reduces contrast fatigue, wireless controller.',
        cons: 'Price is on the higher end for desk lamps, but optical quality justifies it.'
      }
    ]
  },
  {
    title: 'Grovemade Walnut Ergonomic Desk Shelf & Stand',
    slug: 'grovemade-walnut-desk-shelf',
    category: 'Accessories',
    price: 18999,
    original_price: 22999,
    short_description: 'Handcrafted solid American walnut and 5052 aluminium desk riser for dual monitors and organizers.',
    description: 'Elevate your workspace aesthetics and ergonomics. The Grovemade Desk Shelf creates an intentional two-tier workspace for your display, keyboard storage, audio gear, and notepads. Handcrafted with rich natural American walnut veneer and hand-rubbed oil finish.',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 6,
    rating: 4.9,
    reviews_count: 29,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'American Walnut', hex: '#5c4033' },
        { name: 'Eastern Hard Rock Maple', hex: '#d2b48c' },
        { name: 'Matte Black Ash', hex: '#1f2937' }
      ],
      options: ['Medium (36")', 'Large (46")']
    }),
    price_history: JSON.stringify({
      current: 18999,
      lowest: 17999,
      highest: 22999,
      deal_score: 85,
      verdict: 'Artisan Quality! Authentic Scandinavian craftsmanship with ₹4,000 instant markdown.',
      history: [
        { date: '90d ago', price: 22999 },
        { date: '60d ago', price: 20999 },
        { date: '30d ago', price: 19499 },
        { date: 'Current', price: 18999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Grovemade',
      'Material': 'Solid American Walnut, 5052 Aluminium, Natural Cork feet',
      'Weight Capacity': 'Supports up to 50 kg (Dual 27" or Single 49" ultrawide)'
    }),
    reviews: [
      {
        user_name: 'Samrat B.',
        rating: 5,
        comment: 'Transforms a cluttered work desk into a bespoke Pinterest workspace. The walnut grain is gorgeous and silky smooth.',
        pros: 'Sturdy solid wood construction, fits full-size mechanical keyboard underneath, protects desk with cork feet.',
        cons: 'Heavy piece; assemble carefully.'
      }
    ]
  },
  {
    title: 'LG UltraGear 34" Curved WQHD 160Hz Gaming Monitor',
    slug: 'lg-ultragear-34-curved-monitor',
    category: 'Monitors',
    price: 36990,
    original_price: 45000,
    short_description: '34-inch 21:9 UltraWide curved display, 160Hz, 1ms MBR, HDR10, and AMD FreeSync Premium.',
    description: 'Immerse yourself in cinematic wide-angle gaming and productivity. The 21:9 curved aspect ratio gives you 33% more screen space compared to standard 16:9 displays, with 160Hz refresh rate and crisp 3440 x 1440 WQHD resolution.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 8,
    rating: 4.7,
    reviews_count: 64,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Matte Stealth Black', hex: '#18181b' }
      ],
      options: ['34" Curved WQHD (160Hz)']
    }),
    price_history: JSON.stringify({
      current: 36990,
      lowest: 35990,
      highest: 45000,
      deal_score: 91,
      verdict: 'Best Time to Buy! Top-rated ultrawide display at ₹8,000 off. Great for multi-window productivity and racing games.',
      history: [
        { date: '90d ago', price: 43990 },
        { date: '60d ago', price: 39990 },
        { date: '30d ago', price: 37990 },
        { date: 'Current', price: 36990 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'LG',
      'Resolution': '3440 x 1440 (WQHD UltraWide 21:9)',
      'Refresh Rate': '160Hz Overclocked',
      'Curvature': '1800R Immersive Curve',
      'Ports': '2x HDMI 2.0, 1x DisplayPort 1.4, Headphone out'
    }),
    reviews: [
      {
        user_name: 'Tarun Saxena',
        rating: 5,
        comment: 'Replaced two 24-inch monitors with this single ultrawide and my workflow is so much cleaner. 160Hz gaming is buttery smooth.',
        pros: 'Massive screen real estate, vibrant contrast, smooth 160Hz refresh rate.',
        cons: 'Does not have USB-C laptop power delivery.'
      }
    ]
  },
  {
    title: 'Samsung 55" Crystal 4K UHD Smart TV (PurColor, HDR10+)',
    slug: 'samsung-55-crystal-4k-tv',
    category: 'TVs',
    price: 43990,
    original_price: 64900,
    short_description: 'Crystal Processor 4K, PurColor true-to-life tones, OTS Lite sound, and slim bezel design.',
    description: 'Transform your living room into an authentic cinema. The Crystal Processor 4K upscales your favorite content into 4K resolution, while PurColor expresses a huge spectrum of colors for optimal picture performance.',
    image: 'images/products/samsung_55_smart_tv.jpg',
    gallery: JSON.stringify([
      'images/products/samsung_55_smart_tv.jpg',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 11,
    rating: 4.7,
    reviews_count: 82,
    featured: 1,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Titan Gray Slim Bezel', hex: '#475569' }
      ],
      options: ['55" Screen', '65" Screen (+₹15,000)']
    }),
    price_history: JSON.stringify({
      current: 43990,
      lowest: 42990,
      highest: 64900,
      deal_score: 95,
      verdict: 'Best Time to Buy! 32% discount off retail price. Excellent family 4K smart television value.',
      history: [
        { date: '90d ago', price: 54900 },
        { date: '60d ago', price: 49900 },
        { date: '30d ago', price: 45990 },
        { date: 'Current', price: 43990 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Samsung',
      'Screen Size': '55 inches (138 cm)',
      'Resolution': '3840 x 2160 (4K UHD) with HDR10+',
      'Audio': '20W 2CH Speakers with Object Tracking Sound (OTS Lite)',
      'OS': 'Samsung Tizen OS with Voice Assistants and Netflix/Prime apps'
    }),
    reviews: [
      {
        user_name: 'Meera Krishnan',
        rating: 5,
        comment: 'Picture quality is super bright and vibrant even in daylight living rooms. Tizen OS is responsive and streaming apps launch instantly.',
        pros: 'Vibrant 4K upscaling, very slim borders, easy remote with shortcuts.',
        cons: 'Internal speakers are decent for news, but recommend an external soundbar for movies.'
      }
    ]
  },
  {
    title: 'CalDigit TS4 Thunderbolt 4 18-Port Workstation Dock',
    slug: 'caldigit-ts4-thunderbolt-4-dock',
    category: 'Peripherals',
    price: 36999,
    original_price: 42999,
    short_description: 'Massive 18 ports of connectivity, 98W laptop charging, 2.5GbE Ethernet, and dual 6K display support.',
    description: 'The CalDigit Thunderbolt Station 4 is the pinnacle of docking stations. Featuring an unprecedented 18 ports of connectivity including 3x Thunderbolt 4 ports, 5x USB-A, 3x USB-C, DisplayPort 1.4, SD 4.0 card reader, and 2.5 Gigabit Ethernet.',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 0, // OUT OF STOCK DEMO!
    rating: 4.9,
    reviews_count: 31,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Space Gray Aluminium', hex: '#4b5563' }
      ],
      options: ['18-Port Model']
    }),
    price_history: JSON.stringify({
      current: 36999,
      lowest: 35999,
      highest: 42999,
      deal_score: 83,
      verdict: 'Wait for Restock! Currently out of stock worldwide. High demand dock among video editors and engineers.',
      history: [
        { date: '90d ago', price: 42999 },
        { date: '60d ago', price: 39999 },
        { date: '30d ago', price: 37999 },
        { date: 'Current', price: 36999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'CalDigit',
      'Host Connection': 'Thunderbolt 4 / USB4 (98W Host Power Delivery)',
      'Total Ports': '18 ports (Thunderbolt 4, USB-C, USB-A, 2.5GbE, DP 1.4, SD/microSD, Audio)'
    }),
    reviews: [
      {
        user_name: 'Aditya Sen',
        rating: 5,
        comment: 'One single cable to my MacBook Pro drives two 4K screens, charges at full 98W, and handles Gigabit internet. Solid metal heatsink.',
        pros: 'Unmatched 18 ports, robust aluminium thermal design, 2.5GbE ethernet.',
        cons: 'Power brick is quite hefty; keep it behind the desk.'
      }
    ]
  },
  {
    title: 'Logitech C920 HD Pro 1080p Webcam with Dual Mics',
    slug: 'logitech-c920-hd-pro-webcam',
    category: 'Peripherals',
    price: 5499,
    original_price: 7995,
    short_description: 'Full HD 1080p video calling, stereo audio with dual mics, automatic light correction, and privacy shutter.',
    description: 'Polished Full HD 1080p video calls. The C920 HD Pro Webcam delivers remarkably crisp, clear, and detailed images in vibrant colors. HD autofocus and light correction adjust to dim conditions.',
    image: 'images/products/logitech_c920.jpg',
    gallery: JSON.stringify([
      'images/products/logitech_c920.jpg',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 16,
    rating: 4.7,
    reviews_count: 88,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Graphite Black', hex: '#111827' }
      ],
      options: ['Standard with Privacy Shutter']
    }),
    price_history: JSON.stringify({
      current: 5499,
      lowest: 4999,
      highest: 7995,
      deal_score: 89,
      verdict: 'Best Time to Buy! 31% discount. The most reliable zoom & work-from-home webcam ever created.',
      history: [
        { date: '90d ago', price: 7499 },
        { date: '60d ago', price: 6299 },
        { date: '30d ago', price: 5899 },
        { date: 'Current', price: 5499 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Logitech',
      'Max Resolution': '1080p / 30fps - 720p / 30fps',
      'Focus Type': 'Autofocus glass lens',
      'Microphone': 'Built-in dual stereo omni-directional mics'
    }),
    reviews: [
      {
        user_name: 'Suresh Kumar',
        rating: 5,
        comment: 'Plug and play on Windows and Mac without installing bloatware. The glass lens is miles ahead of cheap laptop webcams.',
        pros: 'Crisp glass lens, automatic low-light boost, sturdy monitor clamp.',
        cons: 'Does not support 60fps at 1080p (capped at 30fps).'
      }
    ]
  },
  {
    title: 'Case Logic 15.6" Laptop Professional Backpack',
    slug: 'caselogic-laptop-backpack',
    category: 'Accessories',
    price: 3499,
    original_price: 5499,
    short_description: 'Padded laptop sleeve up to 15.6", dedicated 10.5" tablet pocket, weather-resistant base, and luggage strap.',
    description: 'A contemporary everyday backpack with protective laptop and tablet storage, organization for cords and everyday gear, and a comfortable breathable back panel for daily city commutes.',
    image: 'images/products/caselogic_backpack.jpg',
    gallery: JSON.stringify([
      'images/products/caselogic_backpack.jpg',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 19,
    rating: 4.7,
    reviews_count: 51,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Obsidian Black', hex: '#18181b' },
        { name: 'Heather Charcoal', hex: '#4b5563' },
        { name: 'Deep Olive', hex: '#3f4f3c' }
      ],
      options: ['24L Capacity']
    }),
    price_history: JSON.stringify({
      current: 3499,
      lowest: 3199,
      highest: 5499,
      deal_score: 91,
      verdict: 'Best Time to Buy! 36% discount on high-durability laptop travel gear. Plenty in stock.',
      history: [
        { date: '90d ago', price: 4999 },
        { date: '60d ago', price: 4299 },
        { date: '30d ago', price: 3799 },
        { date: 'Current', price: 3499 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Case Logic',
      'Capacity': '24 Liters',
      'Laptop Compartment': 'Fits up to 15.6" MacBook / PC + 10.5" iPad',
      'Material': 'Durable water-repellent 1200D polyester'
    }),
    reviews: [
      {
        user_name: 'Deepak V.',
        rating: 5,
        comment: 'Zippers glide smoothly and the laptop padding protects my 16-inch laptop snugly. Luggage strap is handy for airport travel.',
        pros: 'Thick padding, water-resistant bottom panel, ergonomic padded shoulder straps.',
        cons: 'Side water bottle pocket is snug on wider 1-liter flasks.'
      }
    ]
  },

  // ---------------- AURA MOBILE & WEARABLES (Smartphones, Smartwatches, Charging) ----------------
  {
    title: 'Apple iPhone 15 Pro (Titanium / Super Retina XDR)',
    slug: 'apple-iphone-15-pro',
    category: 'Smartphones',
    price: 127990,
    original_price: 134900,
    short_description: 'Aerospace-grade titanium design, A17 Pro chip, customizable Action button, and 48MP Pro camera system.',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most versatile iPhone camera system yet. Experience next-generation portraits with Focus and Depth Control.',
    image: 'images/products/apple_iphone_15_pro.jpg',
    gallery: JSON.stringify([
      'images/products/apple_iphone_15_pro.jpg',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 15,
    rating: 4.9,
    reviews_count: 164,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Natural Titanium', hex: '#9ca3af' },
        { name: 'Blue Titanium', hex: '#2c3e50' },
        { name: 'White Titanium', hex: '#f8fafc' },
        { name: 'Black Titanium', hex: '#18181b' }
      ],
      options: ['128GB', '256GB (+₹10,000)', '512GB (+₹30,000)']
    }),
    price_history: JSON.stringify({
      current: 127990,
      lowest: 124990,
      highest: 134900,
      deal_score: 90,
      verdict: 'Best Time to Buy! Under ₹1.28L for the flagship titanium model with instant bank cashback compatibility.',
      history: [
        { date: '90d ago', price: 134900 },
        { date: '60d ago', price: 131900 },
        { date: '30d ago', price: 129490 },
        { date: 'Current', price: 127990 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Apple',
      'Processor': 'A17 Pro chip (6-core CPU, 6-core GPU, Hardware Ray Tracing)',
      'Display': '6.1-inch Super Retina XDR with ProMotion 120Hz & Always-On',
      'Camera': '48MP Main + 12MP Ultra-Wide + 12MP 3x Telephoto',
      'Connector': 'USB-C with USB 3 speeds (up to 10Gb/s)'
    }),
    reviews: [
      {
        user_name: 'Vivek Singhania',
        rating: 5,
        comment: 'The titanium frame feels noticeably lighter in the hand than the 14 Pro stainless steel. The 3x camera takes magazine-level portraits.',
        pros: 'Much lighter titanium weight, 120Hz ProMotion is super fluid, USB-C convenience.',
        cons: 'Battery will easily last one day, but power users might need a top-up by 9 PM.'
      },
      {
        user_name: 'Maya P.',
        rating: 5,
        comment: 'Action button mapped to camera flashlight is my favorite feature. A17 Pro runs console-level games smoothly.',
        pros: 'Console-grade gaming, 48MP RAW photography, customizable Action button.',
        cons: 'Device gets warm during heavy gaming or 4K ProRes recording.'
      }
    ]
  },
  {
    title: 'Apple Watch Series 9 GPS (45mm & 41mm Always-On Retina)',
    slug: 'apple-watch-series-9',
    category: 'Wearables',
    price: 41900,
    original_price: 44900,
    short_description: 'Brighter Always-On Retina display, powerful S9 SiP chip, Double Tap gesture, and health sensors.',
    description: 'Smarter, brighter, and mightier. Apple Watch Series 9 helps you stay active, healthy, safe, and connected. Powered by the S9 SiP chip for a super-bright 2000-nit display and magical new Double Tap gesture to interact without touching the screen.',
    image: 'images/products/apple_watch_s9.jpg',
    gallery: JSON.stringify([
      'images/products/apple_watch_s9.jpg',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 20,
    rating: 4.8,
    reviews_count: 85,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Midnight', hex: '#0f172a' },
        { name: 'Starlight', hex: '#fef3c7' },
        { name: 'Silver', hex: '#e2e8f0' },
        { name: '(PRODUCT)RED', hex: '#dc2626' }
      ],
      options: ['41mm Case', '45mm Case (+₹3,000)']
    }),
    price_history: JSON.stringify({
      current: 41900,
      lowest: 39900,
      highest: 44900,
      deal_score: 87,
      verdict: 'Good Deal! ₹3,000 off M.R.P. Features Apple Double Tap gesture and on-device Siri.',
      history: [
        { date: '90d ago', price: 44900 },
        { date: '60d ago', price: 43400 },
        { date: '30d ago', price: 42400 },
        { date: 'Current', price: 41900 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Apple',
      'Case Size': '45mm & 41mm Aluminium Case options',
      'Display': 'Always-On Retina OLED (up to 2000 nits)',
      'Chip': 'S9 SiP with 64-bit dual-core processor',
      'Sensors': 'Blood Oxygen, ECG, Temperature sensing, Heart Rate, Fall Detection',
      'Water Resistance': '50m Water Resistant (Swimproof)'
    }),
    reviews: [
      {
        user_name: 'Karthik Raja',
        rating: 5,
        comment: 'Double tap gesture is surprisingly handy when carrying groceries or driving. Display is readable under harsh midday sun.',
        pros: 'Ultra-bright 2000-nit screen, instant Double Tap gesture, accurate heart rate tracking.',
        cons: 'Must be charged daily (approx 18 to 24 hour battery).'
      }
    ]
  },
  {
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium / Galaxy AI)',
    slug: 'samsung-galaxy-s24-ultra',
    category: 'Smartphones',
    price: 129999,
    original_price: 139999,
    short_description: 'Titanium exterior, built-in S Pen, Circle to Search with Galaxy AI, and 200MP Quad Telephoto camera.',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity, and possibility. Featuring a durable titanium frame and 200MP camera system.',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 8,
    rating: 4.9,
    reviews_count: 92,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Titanium Gray', hex: '#6b7280' },
        { name: 'Titanium Black', hex: '#111827' },
        { name: 'Titanium Violet', hex: '#581c87' },
        { name: 'Titanium Yellow', hex: '#ca8a04' }
      ],
      options: ['256GB / 12GB RAM', '512GB / 12GB RAM (+₹15,000)']
    }),
    price_history: JSON.stringify({
      current: 129999,
      lowest: 126999,
      highest: 139999,
      deal_score: 91,
      verdict: 'Best Time to Buy! ₹10,000 instant price reduction with complimentary 7 years of Android OS upgrades.',
      history: [
        { date: '90d ago', price: 139999 },
        { date: '60d ago', price: 134999 },
        { date: '30d ago', price: 131999 },
        { date: 'Current', price: 129999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Samsung',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      'Display': '6.8" Dynamic AMOLED 2X, 120Hz, 2600 nits, Flat Corning Gorilla Armor',
      'S Pen': 'Built-in S Pen with latency under 2.8ms',
      'Battery': '5000 mAh with 45W Fast Charging'
    }),
    reviews: [
      {
        user_name: 'Rajnish Kapoor',
        rating: 5,
        comment: 'Gorilla Armor anti-reflective glass makes a massive difference in outdoor reflection. Zoom quality up to 30x is crystal clear.',
        pros: 'Anti-reflective display, flat screen with built-in S Pen, 7 years of OS updates.',
        cons: 'Large phone footprint; requires two hands for most operations.'
      }
    ]
  },
  {
    title: 'Google Pixel 8 Pro (Tensor G3, Best-in-Class AI Camera)',
    slug: 'google-pixel-8-pro',
    category: 'Smartphones',
    price: 93999,
    original_price: 106999,
    short_description: 'Super Actua 120Hz display, Google Tensor G3, Magic Editor, Best Take, and 7 years of software updates.',
    description: 'Pixel 8 Pro is the all-pro phone engineered by Google; it is super fast, personal, and helpful. Features the most advanced Pixel camera system yet and innovative Google AI photo editing like Best Take and Audio Magic Eraser.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 2, // LOW STOCK
    rating: 4.8,
    reviews_count: 63,
    featured: 0,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Bay Blue', hex: '#60a5fa' },
        { name: 'Obsidian Black', hex: '#18181b' },
        { name: 'Porcelain White', hex: '#f8fafc' }
      ],
      options: ['128GB', '256GB (+₹8,000)']
    }),
    price_history: JSON.stringify({
      current: 93999,
      lowest: 89999,
      highest: 106999,
      deal_score: 92,
      verdict: 'Best Time to Buy! ₹13,000 total price cut. Only 2 units remaining in stock.',
      history: [
        { date: '90d ago', price: 106999 },
        { date: '60d ago', price: 99999 },
        { date: '30d ago', price: 95499 },
        { date: 'Current', price: 93999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Google',
      'Processor': 'Google Tensor G3 with Titan M2 security coprocessor',
      'Display': '6.7-inch Super Actua OLED (1-120Hz, up to 2400 nits)',
      'Camera': '50MP Octa PD + 48MP Quad PD Ultrawide + 48MP 5x Telephoto'
    }),
    reviews: [
      {
        user_name: 'Shreya Bhatt',
        rating: 5,
        comment: 'Point and shoot photography is simply unbeatable. Magic Editor can remove photobombers with one tap.',
        pros: 'Best camera processing on Android, pure clean Google UI, gorgeous Bay Blue finish.',
        cons: 'Charging speed tops out around 30W.'
      }
    ]
  },
  {
    title: 'Apple iPad Pro 11" with M2 Liquid Retina Display',
    slug: 'apple-ipad-pro-11-liquid-retina',
    category: 'Tablets',
    price: 81900,
    original_price: 89900,
    short_description: '11-inch Liquid Retina display with ProMotion 120Hz, Apple M2 chip, and magnetic Apple Pencil support.',
    description: 'Astonishing performance, incredibly advanced displays, superfast wireless connectivity, and next-level Apple Pencil capabilities. Powered by the Apple M2 chip with 8-core CPU and 10-core GPU.',
    image: 'images/products/apple_ipad_pro.jpg',
    gallery: JSON.stringify([
      'images/products/apple_ipad_pro.jpg',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 12,
    rating: 4.9,
    reviews_count: 51,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Space Gray', hex: '#4b5563' },
        { name: 'Silver', hex: '#e2e8f0' }
      ],
      options: ['128GB Wi-Fi', '256GB Wi-Fi (+₹10,000)', 'Wi-Fi + Cellular (+₹15,000)']
    }),
    price_history: JSON.stringify({
      current: 81900,
      lowest: 79900,
      highest: 89900,
      deal_score: 88,
      verdict: 'Great Deal! ₹8,000 discount on Apple flagship M2 tablet with ProMotion 120Hz display.',
      history: [
        { date: '90d ago', price: 89900 },
        { date: '60d ago', price: 86900 },
        { date: '30d ago', price: 83900 },
        { date: 'Current', price: 81900 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Apple',
      'Display': '11-inch Liquid Retina with ProMotion (120Hz) & True Tone',
      'Processor': 'Apple M2 Chip with 8-Core CPU & 10-Core GPU',
      'Pen Support': 'Apple Pencil (2nd Gen) with magnetic charging & hover',
      'Connector': 'Thunderbolt / USB 4'
    }),
    reviews: [
      {
        user_name: 'Anil Ganguly',
        rating: 5,
        comment: 'For digital art and illustration in Procreate, this is unmatched. The 120Hz screen makes the pencil feel like real ink on paper.',
        pros: 'Blazing fast M2 chip, 120Hz ProMotion screen, desktop-class Thunderbolt port.',
        cons: 'Magic Keyboard and Apple Pencil must be purchased separately.'
      }
    ]
  },
  {
    title: 'Anker 3-in-1 MagSafe Wireless Charging Cube',
    slug: 'anker-magsafe-charging-stand',
    category: 'Accessories',
    price: 11999,
    original_price: 14999,
    short_description: 'Official 15W Made for MagSafe charging for iPhone, Apple Watch, and AirPods in a compact travel cube.',
    description: 'Charge your entire Apple ecosystem simultaneously. Officially certified 15W Made for MagSafe high-speed wireless charging that folds down into a pocketable compact cube for travel.',
    image: 'images/products/anker_magsafe_stand.jpg',
    gallery: JSON.stringify([
      'images/products/anker_magsafe_stand.jpg',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 5, // LOW STOCK
    rating: 4.8,
    reviews_count: 57,
    featured: 0,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Glacier White', hex: '#f8fafc' },
        { name: 'Space Gray', hex: '#374151' }
      ],
      options: ['Includes 30W USB-C GaN Charger']
    }),
    price_history: JSON.stringify({
      current: 11999,
      lowest: 10999,
      highest: 14999,
      deal_score: 87,
      verdict: 'Good Deal! Premium official 15W MagSafe station at ₹3,000 off. Low stock (5 units left).',
      history: [
        { date: '90d ago', price: 14999 },
        { date: '60d ago', price: 13499 },
        { date: '30d ago', price: 12499 },
        { date: 'Current', price: 11999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Anker',
      'Charging Speed': '15W Fast MagSafe for iPhone, 5W for Apple Watch, 5W for AirPods',
      'Design': 'Folds into a 2.5-inch compact travel cube',
      'Weight': '410g weighted metal base'
    }),
    reviews: [
      {
        user_name: 'Harish R.',
        rating: 5,
        comment: 'The heavy weighted base means you can lift your phone off with one hand without the stand lifting off the table. Best nightstand accessory.',
        pros: 'Official Apple certified 15W MagSafe, weighted metal base, folds flat for hotel travel.',
        cons: 'Price is premium, but includes the wall brick and braided cable.'
      }
    ]
  },
  {
    title: 'Anker 737 Power Bank (PowerCore 24K, 140W Two-Way Fast Charge)',
    slug: 'anker-737-power-bank',
    category: 'Accessories',
    price: 11499,
    original_price: 14999,
    short_description: 'Ultra-powerful 140W two-way fast charging, smart digital display, and 24,000mAh battery for laptops & phones.',
    description: 'Equipped with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the power bank itself at 140W or deliver maximum 140W output to laptops and phones. Features an informative smart digital display.',
    image: 'images/products/anker_737_powerbank.jpg',
    gallery: JSON.stringify([
      'images/products/anker_737_powerbank.jpg',
      'https://images.unsplash.com/photo-1609592426508-410a6d59ce6b?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 14,
    rating: 4.9,
    reviews_count: 78,
    featured: 0,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Matte Black & Metallic', hex: '#1c1c1e' }
      ],
      options: ['24,000mAh (140W)']
    }),
    price_history: JSON.stringify({
      current: 11499,
      lowest: 10499,
      highest: 14999,
      deal_score: 91,
      verdict: 'Best Time to Buy! 23% savings on the most advanced laptop power bank on the market.',
      history: [
        { date: '90d ago', price: 14999 },
        { date: '60d ago', price: 13299 },
        { date: '30d ago', price: 11999 },
        { date: 'Current', price: 11499 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Anker',
      'Capacity': '24,000 mAh',
      'Max Output': '140W Single Port (Charges MacBook Pro 16" to 50% in 40 mins)',
      'Display': 'Color TFT Smart Display showing output wattage and battery health'
    }),
    reviews: [
      {
        user_name: 'Pranav K.',
        rating: 5,
        comment: 'Can charge my MacBook Pro at full 140W speed while on flights. The digital display showing real-time wattages is addicting to watch.',
        pros: 'True 140W laptop charging, smart LCD display, recharges in just 52 minutes.',
        cons: 'Chunky 630g weight, but expected for 24K capacity.'
      }
    ]
  },
  {
    title: 'Xiaomi Smart Band 8 Active Fitness Tracker',
    slug: 'xiaomi-smart-band-5',
    category: 'Wearables',
    price: 2499,
    original_price: 3999,
    short_description: '1.47" TFT vibrant display, 50+ workout modes, 14-day battery life, and 5ATM water resistance.',
    description: 'Track your health and daily activity with precision. Featuring continuous heart rate monitoring, scientific sleep tracking, SpO2 measurement, and over 14 days of battery life on a single magnetic charge.',
    image: 'images/products/xiaomi_smartband5.jpg',
    gallery: JSON.stringify([
      'images/products/xiaomi_smartband5.jpg',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 25,
    rating: 4.6,
    reviews_count: 145,
    featured: 0,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Obsidian Black', hex: '#18181b' },
        { name: 'Ivory Cream', hex: '#fef3c7' },
        { name: 'Pink Glow', hex: '#f472b6' }
      ],
      options: ['Standard']
    }),
    price_history: JSON.stringify({
      current: 2499,
      lowest: 2199,
      highest: 3999,
      deal_score: 93,
      verdict: 'Best Time to Buy! Under ₹2,500. Incredible battery life (14 days) and lightweight workout companion.',
      history: [
        { date: '90d ago', price: 3499 },
        { date: '60d ago', price: 2999 },
        { date: '30d ago', price: 2699 },
        { date: 'Current', price: 2499 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Xiaomi',
      'Display': '1.47-inch TFT color screen',
      'Water Resistance': '5ATM Swimproof (up to 50 meters)',
      'Battery Life': 'Up to 14 days normal usage',
      'Weight': 'Ultra-lightweight 14.9g (without strap)'
    }),
    reviews: [
      {
        user_name: 'Manish T.',
        rating: 5,
        comment: 'For ₹2,499 this is unbeatable. Battery lasts two full weeks and sleep tracking matches my smartwatch.',
        pros: 'Crazy 14-day battery, very lightweight for sleeping, accurate step counting.',
        cons: 'No built-in standalone GPS (uses phone GPS).'
      }
    ]
  },
  {
    title: 'Garmin Fenix 7 Solar Multisport GPS Smartwatch',
    slug: 'garmin-fenix-7-solar-watch',
    category: 'Wearables',
    price: 67990,
    original_price: 79990,
    short_description: 'Power Glass solar charging lens, rugged military grade testing, built-in LED flashlight, and topo maps.',
    description: 'Conquer every outdoor challenge with the Garmin Fenix 7 Solar. Featuring a Power Glass solar charging lens that uses sunlight to extend battery life up to 22 days. Built-in LED flashlight, multi-band GNSS GPS, and preloaded TopoActive maps.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 3, // LOW STOCK
    rating: 4.9,
    reviews_count: 42,
    featured: 0,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Slate Gray with Black Band', hex: '#374151' },
        { name: 'Mineral Blue Titanium', hex: '#1e3a5f' }
      ],
      options: ['47mm Solar Edition']
    }),
    price_history: JSON.stringify({
      current: 67990,
      lowest: 64990,
      highest: 79990,
      deal_score: 89,
      verdict: 'Recommended for Athletes! ₹12,000 markdown. Solar extended battery lasts 3 weeks on outdoor treks.',
      history: [
        { date: '90d ago', price: 79990 },
        { date: '60d ago', price: 74990 },
        { date: '30d ago', price: 70990 },
        { date: 'Current', price: 67990 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Garmin',
      'Battery Life': 'Up to 22 days with solar charging (57 hours in GPS mode)',
      'Water Rating': '10 ATM (100 meters)',
      'Flashlight': 'Built-in multi-LED variable intensity flashlight'
    }),
    reviews: [
      {
        user_name: 'Major Vikram S.',
        rating: 5,
        comment: 'Survives extreme mountain treks, sub-zero cold, and the solar glass genuinely extends battery for days. The flashlight is surprisingly useful.',
        pros: 'Practically indestructible titanium bezel, 3-week battery, standalone offline topographic maps.',
        cons: 'MIP display is tuned for outdoor sun, not as punchy as OLED indoors.'
      }
    ]
  },
  {
    title: 'OnePlus 12 5G (Snapdragon 8 Gen 3, 100W SuperVOOC)',
    slug: 'oneplus-12-5g-smartphone',
    category: 'Smartphones',
    price: 64999,
    original_price: 69999,
    short_description: '2K 120Hz ProXDR display, 4th Gen Hasselblad camera, 5400 mAh battery, and 100W wired + 50W wireless charge.',
    description: 'The pinnacle of OnePlus performance. Powered by Qualcomm Snapdragon 8 Gen 3 with up to 16GB LPDDR5X RAM and dual Cryo-velocity VC cooling. The 4th Gen Hasselblad camera captures hyper-realistic colors.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 10,
    rating: 4.8,
    reviews_count: 59,
    featured: 0,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Flowy Emerald', hex: '#065f46' },
        { name: 'Silky Black', hex: '#18181b' }
      ],
      options: ['12GB RAM / 256GB Storage', '16GB RAM / 512GB Storage (+₹5,000)']
    }),
    price_history: JSON.stringify({
      current: 64999,
      lowest: 62999,
      highest: 69999,
      deal_score: 90,
      verdict: 'Best Time to Buy! Top flagship specs (Snapdragon 8 Gen 3 & 100W charger in box) under ₹65k.',
      history: [
        { date: '90d ago', price: 69999 },
        { date: '60d ago', price: 67499 },
        { date: '30d ago', price: 65999 },
        { date: 'Current', price: 64999 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'OnePlus',
      'Processor': 'Snapdragon 8 Gen 3 (4nm)',
      'Display': '6.82" 2K 120Hz LTPO ProXDR (up to 4500 nits peak)',
      'Charging': '100W SuperVOOC (0 to 100% in 26 minutes) + 50W AIRVOOC',
      'Battery': '5400 mAh Dual-Cell Battery'
    }),
    reviews: [
      {
        user_name: 'Adil Khan',
        rating: 5,
        comment: 'Recharges from empty to 100% in under 26 minutes with the included charger. Screen brightness in sunlight is astonishing.',
        pros: 'Insane 100W charging speed, massive 5400 mAh battery, includes charger in the box.',
        cons: 'Curved edge screen can occasionally register palm touches without a case.'
      }
    ]
  },
  // ---------------- AFFORDABLE ACCESSORIES & AUDIO GEAR ----------------
  {
    title: 'boAt BassHeads 100 Wired In-Ear Earphones with Mic',
    slug: 'boat-bassheads-100-wired-earphones',
    category: 'Audio',
    price: 399,
    original_price: 999,
    short_description: 'Hawk-inspired aerodynamic earbuds with 10mm dynamic drivers, super extra bass, and HD mic.',
    description: 'boAt BassHeads 100 in-ear wired earphones feature 10mm dynamic drivers tuned for super extra punchy bass. Comes with an integrated inline HD microphone for crystal-clear calls, a 1.2-meter tangle-resistant cable, and gold-plated 3.5mm angled connector.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 45,
    rating: 4.6,
    reviews_count: 340,
    featured: 1,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Furious Red', hex: '#ef4444' },
        { name: 'Black Panther', hex: '#111827' },
        { name: 'Taffy Pink', hex: '#ec4899' }
      ],
      options: ['Standard 3.5mm Jack']
    }),
    price_history: JSON.stringify({
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
    }),
    specs: JSON.stringify({
      'Brand': 'boAt',
      'Driver Size': '10mm Dynamic Drivers',
      'Connector': '3.5mm Gold-Plated L-Shaped Jack',
      'Microphone': 'In-line HD Microphone',
      'Cable Length': '1.2m Tangle-Resistant',
      'Warranty': '1 Year boAt Domestic Warranty'
    }),
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
    title: 'Zebronics Zeb-Bro In-Ear Wired Earphones with Mic',
    slug: 'zebronics-zeb-bro-wired-earphones',
    category: 'Audio',
    price: 199,
    original_price: 399,
    short_description: 'Ultra-budget lightweight earphones with 10mm drivers, built-in mic, and snug-fit silicone tips.',
    description: 'Zebronics Zeb-Bro delivers clear acoustics and balanced audio for online classes, video calls, podcasts, and daily listening. Weighs only 14 grams with an inline mic and one-button answer/reject switch.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 60,
    rating: 4.4,
    reviews_count: 215,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Classic Black', hex: '#18181b' },
        { name: 'Cobalt Blue', hex: '#2563eb' }
      ],
      options: ['Standard 3.5mm']
    }),
    price_history: JSON.stringify({
      current: 199,
      lowest: 179,
      highest: 399,
      deal_score: 92,
      verdict: 'Super Cheap Daily Driver! Perfect backup earphone under ₹200.',
      history: [
        { date: '90d ago', price: 299 },
        { date: 'Current', price: 199 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Zebronics',
      'Jack': '3.5mm Audio Connector',
      'Impedance': '16 Ohms',
      'Frequency Response': '20Hz - 20kHz',
      'Weight': '14g Ultra-Light'
    }),
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
    title: 'Portronics Konnect CL 20W Type-C to Lightning Fast Charging Cable (1.2m)',
    slug: 'portronics-konnect-cl-typec-lightning-cable',
    category: 'Accessories',
    price: 249,
    original_price: 699,
    short_description: '20W PD fast-charging Type-C to Lightning cable with high-tensile nylon braiding.',
    description: 'Portronics Konnect CL supports 20W Power Delivery to charge your iPhone up to 50% in just 30 minutes. Engineered with high-strength braided nylon tested to withstand 10,000+ bends and corrosion-resistant gold-plated contact pins for 480Mbps data synchronization.',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 50,
    rating: 4.7,
    reviews_count: 180,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Space Grey', hex: '#4b5563' },
        { name: 'Midnight Black', hex: '#111827' }
      ],
      options: ['1.2m Length']
    }),
    price_history: JSON.stringify({
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
    }),
    specs: JSON.stringify({
      'Brand': 'Portronics',
      'Connector Type': 'USB-C to 8-Pin Lightning',
      'Max Output': '20W Power Delivery (PD)',
      'Data Speed': '480 Mbps',
      'Cable Material': 'Reinforced Braided Nylon',
      'Bend Lifespan': '10,000+ Bends'
    }),
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
    title: 'Ambrane 65W Type-C to Type-C Ultra-Fast Braided Cable (1.5m)',
    slug: 'ambrane-65w-typec-to-typec-cable',
    category: 'Accessories',
    price: 299,
    original_price: 799,
    short_description: '65W USB-PD fast charging cable with smart E-Marker chip for smartphones, tablets & laptops.',
    description: 'Ambrane 65W Power Delivery cable features an intelligent E-Marker chipset that automatically identifies connected devices to regulate current and prevent overcharging. Compatible with MacBooks, iPad Air/Pro, Samsung Galaxy, and OnePlus smartphones.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 40,
    rating: 4.8,
    reviews_count: 145,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Stealth Black', hex: '#18181b' },
        { name: 'Navy Blue', hex: '#1e3a8a' }
      ],
      options: ['1.5m Length']
    }),
    price_history: JSON.stringify({
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
    }),
    specs: JSON.stringify({
      'Brand': 'Ambrane',
      'Max Power': '65W (20V/3.25A) Fast Charge',
      'Chipset': 'E-Marker Intelligent IC',
      'Interface': 'Type-C to Type-C',
      'Length': '1.5 Meters',
      'Core': 'Oxygen-Free Pure Copper'
    }),
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
    title: 'Mi 20W Type-C Fast Charger Power Adapter (USB-PD 3.0)',
    slug: 'mi-20w-typec-fast-charger-adapter',
    category: 'Accessories',
    price: 449,
    original_price: 899,
    short_description: 'Compact 20W USB-C wall charger with 8-layer circuit protection and universal PD protocol.',
    description: 'Xiaomi 20W Type-C wall adapter provides high-speed Power Delivery charging in an ultra-compact form factor. Built with flame-retardant PC material and 8-layer multi-point safety protection against power surges, short circuits, and overheating.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 35,
    rating: 4.7,
    reviews_count: 205,
    featured: 1,
    seller_id: 3,
    seller_name: 'Aura Mobile & Wearables',
    seller_rating: 4.9,
    seller_reviews_count: 2150,
    variants: JSON.stringify({
      colors: [
        { name: 'Pure White', hex: '#ffffff' },
        { name: 'Matte Black', hex: '#1c1c1e' }
      ],
      options: ['20W Single Port']
    }),
    price_history: JSON.stringify({
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
    }),
    specs: JSON.stringify({
      'Brand': 'Xiaomi (Mi)',
      'Input': '100-240V ~ 50/60Hz 0.5A',
      'Output': '5V/3A, 9V/2.22A, 12V/1.67A (20W Max)',
      'Port': 'Type-C USB-PD',
      'Dimensions': '30 x 30 x 38 mm',
      'Safety': 'BIS Certified 8-Layer Protection'
    }),
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
    title: 'UGREEN USB-C to 3.5mm Headphone Jack DAC Adapter (Hi-Res Audio)',
    slug: 'ugreen-usbc-to-35mm-dac-adapter',
    category: 'Accessories',
    price: 349,
    original_price: 699,
    short_description: 'Lossless 24-bit/96kHz DAC audio adapter for USB-C phones, tablets & laptops.',
    description: 'UGREEN USB-C to 3.5mm headphone adapter incorporates a high-grade digital-to-analog converter (DAC) that produces 24-bit/96kHz lossless studio acoustic fidelity. Aluminum alloy casing with kevlar braided strain relief prevents signal interference and supports microphone calls and volume control.',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 30,
    rating: 4.8,
    reviews_count: 120,
    featured: 0,
    seller_id: 1,
    seller_name: 'Apex Tech & Audio',
    seller_rating: 4.9,
    seller_reviews_count: 1480,
    variants: JSON.stringify({
      colors: [
        { name: 'Space Gray Aluminum', hex: '#4b5563' }
      ],
      options: ['Hi-Res DAC Edition']
    }),
    price_history: JSON.stringify({
      current: 349,
      lowest: 329,
      highest: 699,
      deal_score: 94,
      verdict: 'Audiophile Must-Have! Zero background hiss or static.',
      history: [
        { date: '90d ago', price: 499 },
        { date: 'Current', price: 349 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'UGREEN',
      'DAC Chip': '24-bit / 96kHz Lossless Sampling Rate',
      'Housing': 'Anodized Aluminum Alloy',
      'Cord': 'Kevlar Braided Wire',
      'Mic Support': 'Yes (TRRS 4-Pole Support)'
    }),
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
    title: 'Satechi Aluminum USB 3.0 to Type-C OTG Mini Adapter',
    slug: 'satechi-aluminum-usb-to-typec-otg-adapter',
    category: 'Accessories',
    price: 149,
    original_price: 399,
    short_description: '5Gbps SuperSpeed plug-and-play USB to Type-C OTG converter in brushed aluminum.',
    description: 'Convert any legacy USB-A port to USB Type-C or connect flash drives, keyboards, and mice directly to smartphones and laptops. Supports ultra-fast 5Gbps SuperSpeed data transfer and simultaneous charging.',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80'
    ]),
    stock: 40,
    rating: 4.6,
    reviews_count: 95,
    featured: 0,
    seller_id: 2,
    seller_name: 'Nordic Living & Workspaces',
    seller_rating: 4.8,
    seller_reviews_count: 940,
    variants: JSON.stringify({
      colors: [
        { name: 'Space Gray', hex: '#4b5563' },
        { name: 'Matte Silver', hex: '#d1d5db' }
      ],
      options: ['Single Adapter']
    }),
    price_history: JSON.stringify({
      current: 149,
      lowest: 129,
      highest: 399,
      deal_score: 95,
      verdict: 'Super Cheap Must-Have! Essential pocket adapter for just ₹149.',
      history: [
        { date: '90d ago', price: 299 },
        { date: 'Current', price: 149 }
      ]
    }),
    specs: JSON.stringify({
      'Brand': 'Satechi',
      'Transfer Rate': 'USB 3.0 SuperSpeed up to 5 Gbps',
      'Enclosure': 'Sandblasted Aluminum Alloy',
      'Plug and Play': 'Driver-Free Installation',
      'Form Factor': 'Ultra-Compact Coin Size'
    }),
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

const seedDatabase = async () => {
  await initDatabase();

  console.log('🌱 Checking database and seeding marketplace...');

  // 1. Seed Demo Customer & 3 Demo Sellers
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  for (const seller of DEMO_SELLERS) {
    const existing = await get('SELECT id FROM users WHERE email = ?', [seller.email]);
    if (!existing) {
      await run(
        `INSERT INTO users (name, email, password, role, seller_name, seller_bio, seller_rating, seller_reviews_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          seller.name,
          seller.email,
          hashedPassword,
          seller.role,
          seller.seller_name,
          seller.seller_bio,
          seller.seller_rating,
          seller.seller_reviews_count
        ]
      );
      console.log(`🏪 Created demo seller: ${seller.seller_name} (${seller.email})`);
    } else {
      await run(
        `UPDATE users SET seller_name = ?, seller_bio = ?, seller_rating = ?, seller_reviews_count = ?, role = 'seller'
         WHERE id = ?`,
        [seller.seller_name, seller.seller_bio, seller.seller_rating, seller.seller_reviews_count, existing.id]
      );
    }
  }

  // Seed Demo Customer
  let demoUserId;
  const existingCustomer = await get('SELECT id FROM users WHERE email = ?', [DEMO_CUSTOMER.email]);
  if (!existingCustomer) {
    const userResult = await run(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [DEMO_CUSTOMER.name, DEMO_CUSTOMER.email, hashedPassword, DEMO_CUSTOMER.role]
    );
    demoUserId = userResult.id;
    console.log(`👤 Created demo user: ${DEMO_CUSTOMER.email} / password123`);
  } else {
    demoUserId = existingCustomer.id;
  }

  // 2. Clear old products to refresh catalog
  await run('DELETE FROM products');
  await run('DELETE FROM reviews');
  await run('DELETE FROM order_items');
  await run('DELETE FROM orders');
  try {
    await run("DELETE FROM sqlite_sequence WHERE name IN ('products', 'reviews', 'order_items', 'orders')");
  } catch (e) {}

  console.log(`📦 Seeding ${seedProducts.length} authentic brand-name marketplace products with variants, stock urgency, price history & AI pros/cons...`);
  
  for (const prod of seedProducts) {
    const prodResult = await run(
      `INSERT INTO products (
        title, slug, category, price, original_price, short_description, description,
        image, gallery, stock, rating, reviews_count, featured, specs,
        seller_id, seller_name, seller_rating, seller_reviews_count, variants, price_history
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        prod.specs,
        prod.seller_id,
        prod.seller_name,
        prod.seller_rating,
        prod.seller_reviews_count,
        prod.variants,
        prod.price_history
      ]
    );

    // Insert reviews with pros and cons
    if (prod.reviews && prod.reviews.length > 0) {
      for (const rev of prod.reviews) {
        await run(
          `INSERT INTO reviews (product_id, user_name, rating, comment, pros, cons) VALUES (?, ?, ?, ?, ?, ?)`,
          [prodResult.id, rev.user_name, rev.rating, rev.comment, rev.pros || '', rev.cons || '']
        );
      }
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
      'demo@techstore.com',
      '+91 98765 43210',
      JSON.stringify({
        address: '42 MG Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560038',
        country: 'India'
      }),
      'credit_card',
      19999,
      0,
      3599.82,
      0.00,
      23598.82,
      'Shipped'
    ]
  );

  await run(
    `INSERT INTO order_items (order_id, product_id, title, price, quantity, image, selected_variant, subtotal)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderRes.id,
      1,
      'Sony WH-1000XM4 Wireless Noise-Cancelling Headphones',
      19999,
      1,
      'images/products/sony_wh1000xm4.jpg',
      'Color: Midnight Black',
      19999
    ]
  );

  console.log(`✅ Seeded ${seedProducts.length} marketplace products and reviews successfully.`);
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

module.exports = { seedDatabase, seedProducts, DEMO_SELLERS };
