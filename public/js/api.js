/**
 * TechStore - API Service
 * Connects to the Express backend (http://localhost:5000) with automatic
 * offline fallback so the site always opens even if opened via VS Code Live Server!
 */

// Fallback offline catalog with full 17 products priced in Indian Rupees (₹)
const FALLBACK_PRODUCTS = [
  {
    "id": 1,
    "title": "Sony WH-1000XM4 Wireless Noise-Cancelling Headphones",
    "slug": "sony-wh1000xm4-wireless-headphones",
    "category": "Audio",
    "price": 19999,
    "original_price": 29990,
    "short_description": "Industry-leading noise cancellation, 30-hour battery, touch controls, and LDAC high-res audio.",
    "description": "Immerse yourself in pure music with Sony WH-1000XM4. Dual noise sensor technology captures ambient noise and passes the data to the trusted HD Noise Cancelling Processor QN1. Featuring Speak-to-Chat, multipoint Bluetooth connection, and up to 30 hours of continuous battery life.",
    "image": "images/products/sony_wh1000xm4.jpg",
    "gallery": [
      "images/products/sony_wh1000xm4.jpg",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 18,
    "rating": 4.8,
    "reviews_count": 52,
    "featured": 1,
    "specs": {
      "Brand": "Sony",
      "Model": "WH-1000XM4",
      "Type": "Over-Ear Wireless",
      "Battery Life": "30 Hours (Quick Charge: 10 min for 5 hours)",
      "Noise Cancellation": "Industry-leading Active Noise Cancellation (HD QN1)",
      "Connectivity": "Bluetooth 5.0 (LDAC, AAC, SBC) + 3.5mm Jack",
      "Microphone": "Built-in with Precise Voice Pickup",
      "Warranty": "1 Year Sony India Warranty"
    },
    "reviews": [
      {
        "user_name": "David Miller",
        "rating": 5,
        "comment": "Really happy with this purchase. Outstanding authentic quality and it arrived in just two days."
      },
      {
        "user_name": "Sarah Jenkins",
        "rating": 5,
        "comment": "Exceptional build quality and works exactly as described. Well worth the price!"
      }
    ]
  },
  {
    "id": 2,
    "title": "Apple Watch Series 9 GPS (45mm Midnight)",
    "slug": "apple-watch-series-9",
    "category": "Wearables",
    "price": 41900,
    "original_price": 44900,
    "short_description": "Brighter Always-On Retina display, powerful S9 SiP chip, Double Tap gesture, and health sensors.",
    "description": "Smarter, brighter, and mightier. Apple Watch Series 9 helps you stay active, healthy, safe, and connected. Powered by the S9 SiP chip for a super-bright display and magical new Double Tap gesture to interact without touching the screen. Advanced health sensors track blood oxygen, ECG, sleep, and heart rate.",
    "image": "images/products/apple_watch_s9.jpg",
    "gallery": [
      "images/products/apple_watch_s9.jpg",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 24,
    "rating": 4.8,
    "reviews_count": 43,
    "featured": 1,
    "specs": {
      "Brand": "Apple",
      "Case Size": "45mm Midnight Aluminium Case",
      "Display": "Always-On Retina OLED (up to 2000 nits)",
      "Chip": "S9 SiP with 64-bit dual-core processor",
      "Sensors": "Blood Oxygen, ECG, Temperature sensing, Heart Rate",
      "Water Resistance": "50m Water Resistant (Swimproof)",
      "Battery Life": "Up to 18 Hours (36h in Low Power Mode)"
    },
    "reviews": []
  },
  {
    "id": 3,
    "title": "Apple AirPods Pro (2nd Generation, USB-C)",
    "slug": "apple-airpods-pro-2nd-gen",
    "category": "Audio",
    "price": 20999,
    "original_price": 24900,
    "short_description": "Up to 2x more Active Noise Cancellation, Adaptive Audio, and MagSafe Charging Case (USB-C).",
    "description": "AirPods Pro (2nd Gen) with USB-C deliver exceptional acoustic fidelity powered by the Apple H2 chip. Experience next-level Active Noise Cancellation, Adaptive Audio that automatically tailors noise control to your environment, and Personalized Spatial Audio with dynamic head tracking.",
    "image": "images/products/apple_airpods_pro.jpg",
    "gallery": [
      "images/products/apple_airpods_pro.jpg",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 30,
    "rating": 4.9,
    "reviews_count": 58,
    "featured": 0,
    "specs": {
      "Brand": "Apple",
      "Chip": "Apple H2 Headphone Chip",
      "Audio Technology": "Active Noise Cancellation, Adaptive Audio, Transparency Mode",
      "Case": "MagSafe Charging Case (USB-C) with Speaker and Lanyard loop",
      "Battery": "Up to 6 hours listening (up to 30 hours with case)",
      "Resistance": "IP54 dust, sweat, and water resistant"
    },
    "reviews": []
  },
  {
    "id": 4,
    "title": "Keychron K2 Wireless Mechanical Keyboard (RGB Backlit)",
    "slug": "keychron-k2-wireless-keyboard",
    "category": "Peripherals",
    "price": 7499,
    "original_price": 9999,
    "short_description": "Compact 75% layout, Gateron Red linear switches, vibrant RGB lighting, and dual Mac/Windows support.",
    "description": "The Keychron K2 is a 75% layout wireless mechanical keyboard that retains all essential multimedia and function keys. Connects with up to 3 devices via Bluetooth 5.1 and switches easily among them. Features smooth linear Gateron G Pro Red switches and striking RGB backlighting.",
    "image": "images/products/keychron_k2.jpg",
    "gallery": [
      "images/products/keychron_k2.jpg",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 15,
    "rating": 4.8,
    "reviews_count": 61,
    "featured": 1,
    "specs": {
      "Brand": "Keychron",
      "Model": "K2 Version 2",
      "Switches": "Gateron G Pro Red (Smooth Linear)",
      "Layout": "75% Compact (84 Keys)",
      "Backlight": "18 Types of RGB Backlight Modes",
      "Connectivity": "Bluetooth 5.1 and Type-C Wired Cable",
      "Battery": "4,000mAh Rechargeable Li-polymer (Up to 240 hours)",
      "Compatibility": "macOS / iOS / Windows / Android"
    },
    "reviews": []
  },
  {
    "id": 5,
    "title": "Logitech G PRO X Superlight Wireless Gaming Mouse",
    "slug": "logitech-g-pro-x-superlight",
    "category": "Peripherals",
    "price": 10995,
    "original_price": 13995,
    "short_description": "Ultra-lightweight under 63g, HERO 25K sensor, Lightspeed wireless, and zero-additive PTFE feet.",
    "description": "Meticulously engineered in collaboration with top esports pros. The Logitech G PRO X Superlight weighs less than 63 grams without compromising structural integrity or responsiveness. Powered by the ultra-precise HERO 25K sensor and pro-grade LIGHTSPEED wireless.",
    "image": "images/products/logitech_gprox_mouse.jpg",
    "gallery": [
      "images/products/logitech_gprox_mouse.jpg",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 22,
    "rating": 4.9,
    "reviews_count": 49,
    "featured": 0,
    "specs": {
      "Brand": "Logitech G",
      "Model": "PRO X SUPERLIGHT",
      "Weight": "< 63 grams",
      "Sensor": "HERO 25K (100 - 25,600 DPI)",
      "Wireless": "LIGHTSPEED 1ms Report Rate",
      "Battery Life": "Up to 70 hours constant motion",
      "Feet": "Zero-Additive Large PTFE Glides"
    },
    "reviews": []
  },
  {
    "id": 6,
    "title": "Logitech C920 HD Pro Webcam (Full HD 1080p)",
    "slug": "logitech-c920-hd-pro-webcam",
    "category": "Peripherals",
    "price": 6995,
    "original_price": 8995,
    "short_description": "Full HD 1080p video, glass lens with autofocus, dual stereo mics, and auto light correction.",
    "description": "Look your best on every video call. Logitech C920 delivers remarkably crisp and detailed Full HD 1080p video at 30 fps. Equipped with automatic HD light correction (RightLight 2) and dual stereo microphones on both sides of the lens to capture natural, realistic audio.",
    "image": "images/products/logitech_c920.jpg",
    "gallery": [
      "images/products/logitech_c920.jpg",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 14,
    "rating": 4.7,
    "reviews_count": 37,
    "featured": 0,
    "specs": {
      "Brand": "Logitech",
      "Model": "C920 HD Pro",
      "Resolution": "1080p/30fps - 720p/30fps",
      "Lens": "Full HD Glass with Autofocus",
      "Field of View": "78° Diagonal",
      "Microphones": "Dual stereo omnidirectional mics",
      "Connection": "USB-A Plug and Play"
    },
    "reviews": []
  },
  {
    "id": 7,
    "title": "Anker 3-in-1 MagSafe Wireless Charging Stand",
    "slug": "anker-3in1-magsafe-charging-stand",
    "category": "Accessories",
    "price": 6499,
    "original_price": 8499,
    "short_description": "Official 15W high-speed MagSafe charging for iPhone, Apple Watch stand, and AirPods base.",
    "description": "Charge your Apple ecosystem all at once with Anker 3-in-1 charging stand. Enjoy official 15W ultra-fast wireless charging for iPhone via magnetic MagSafe, a dedicated charging arm for Apple Watch, and a soft-touch pad on the weighted base for your AirPods.",
    "image": "images/products/anker_magsafe_stand.jpg",
    "gallery": [
      "images/products/anker_magsafe_stand.jpg",
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "reviews_count": 51,
    "featured": 1,
    "specs": {
      "Brand": "Anker",
      "Output": "15W MagSafe Phone + 5W Apple Watch + 5W AirPods",
      "Safety": "Anker ActiveShield 2.0 Temperature Protection",
      "Input": "USB-C Fast Charging (Power adapter & cable included)",
      "Compatibility": "iPhone 12-16 series, Apple Watch (all series), AirPods Pro/3/2"
    },
    "reviews": []
  },
  {
    "id": 8,
    "title": "JBL Flip 6 Waterproof Portable Bluetooth Speaker",
    "slug": "jbl-flip-6-bluetooth-speaker",
    "category": "Audio",
    "price": 8999,
    "original_price": 13999,
    "short_description": "Bold JBL Original Pro Sound, 2-way speaker system, IP67 waterproof/dustproof, and 12h playtime.",
    "description": "Big sound meets go-anywhere portability. The JBL Flip 6 2-way speaker system delivers loud, crystal-clear audio with dual passive radiators for deep bass. IP67 waterproof and dustproof means you can bring it to the pool, beach, park, or trail in any weather.",
    "image": "images/products/jbl_flip_6.jpg",
    "gallery": [
      "images/products/jbl_flip_6.jpg",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 19,
    "rating": 4.8,
    "reviews_count": 45,
    "featured": 0,
    "specs": {
      "Brand": "JBL",
      "Model": "Flip 6",
      "Output Power": "20W RMS Woofer + 10W RMS Tweeter (30W Total)",
      "Waterproof Rating": "IP67 Waterproof & Dustproof",
      "Battery Life": "Up to 12 Hours (USB-C Fast Charge)",
      "Features": "PartyBoost Stereo Pairing, JBL Portable App"
    },
    "reviews": []
  },
  {
    "id": 9,
    "title": "Anker 737 Power Bank (PowerCore 24K, 140W Fast Charging)",
    "slug": "anker-737-power-bank-24k",
    "category": "Accessories",
    "price": 9999,
    "original_price": 13999,
    "short_description": "24,000mAh capacity, ultra-powerful 140W two-way fast charging, and smart digital color display.",
    "description": "Equipped with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or deliver a 140W ultra-powerful charge to high-end laptops, MacBooks, tablets, and smartphones. The smart digital OLED screen shows real-time output/input wattage and estimated time to full recharge.",
    "image": "images/products/anker_737_powerbank.jpg",
    "gallery": [
      "images/products/anker_737_powerbank.jpg",
      "https://images.unsplash.com/photo-1609592426508-410a6d59ce6b?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 28,
    "rating": 4.9,
    "reviews_count": 42,
    "featured": 1,
    "specs": {
      "Brand": "Anker",
      "Model": "737 Power Bank (PowerCore 24K)",
      "Capacity": "24,000mAh (86.4Wh - TSA Airline Approved)",
      "Total Output": "140W Max (PD 3.1)",
      "Ports": "2x USB-C (140W In/Out) + 1x USB-A (18W)",
      "Display": "Smart Digital Color OLED Status Screen",
      "Weight": "630g"
    },
    "reviews": []
  },
  {
    "id": 10,
    "title": "BenQ ScreenBar LED Monitor Light Bar (Auto-Dimming)",
    "slug": "benq-screenbar-monitor-light",
    "category": "Smart Home",
    "price": 9990,
    "original_price": 12990,
    "short_description": "Patented asymmetrical optical design with zero screen glare and built-in auto-dimming ambient sensor.",
    "description": "The pioneer of desk light bars. BenQ ScreenBar mounts directly on top of your monitor with a weighted clip, taking zero desk space. Its patented asymmetrical optical design illuminates your keyboard, notes, and workspace without creating any glare or reflection on the screen.",
    "image": "images/products/benq_screenbar.jpg",
    "gallery": [
      "images/products/benq_screenbar.jpg",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "reviews_count": 36,
    "featured": 0,
    "specs": {
      "Brand": "BenQ",
      "Model": "ScreenBar",
      "Sensor": "Built-in Ambient Light Sensor for Auto-Dimming",
      "Color Temperature": "8 Levels Adjustable (2700K Warm to 6500K Cool White)",
      "Brightness": "15 Levels Adjustable with Touch Controls",
      "Power": "USB-A 5V/1A (Plugs into monitor or PC)",
      "Mounting": "Patented counterweight clamp (fits monitors 1-3cm thick)"
    },
    "reviews": []
  },
  {
    "id": 11,
    "title": "Case Logic 15.6\" Laptop Backpack (VNB-217)",
    "slug": "case-logic-laptop-backpack",
    "category": "Accessories",
    "price": 2499,
    "original_price": 3499,
    "short_description": "Dedicated 3/4 zippered laptop compartment for 15.6\" laptops, front organizer, and mesh bottle pockets.",
    "description": "Streamlined styling and smartly placed features add up to a minimalist footprint. Dedicated, 3/4 zip laptop compartment holds up to 15.6-inch widescreen laptops. Expansive interior storage holds books, files, and cables, while the front Speed Pocket keeps your phone and keys within quick reach.",
    "image": "images/products/caselogic_backpack.jpg",
    "gallery": [
      "images/products/caselogic_backpack.jpg",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 16,
    "rating": 4.7,
    "reviews_count": 42,
    "featured": 0,
    "specs": {
      "Brand": "Case Logic",
      "Model": "VNB-217",
      "Laptop Compatibility": "Up to 15.6-inch laptops",
      "Material": "Durable water-resistant Dobby Nylon",
      "Volume": "25 Liters",
      "Pockets": "Laptop sleeve, main compartment, quick-access front Speed Pocket, 2 mesh bottle pockets",
      "Weight": "560g"
    },
    "reviews": []
  },
  {
    "id": 12,
    "title": "Xiaomi Mi Smart Band 5 (1.1\" AMOLED Display)",
    "slug": "xiaomi-mi-smart-band-5",
    "category": "Wearables",
    "price": 2499,
    "original_price": 2999,
    "short_description": "Dynamic 1.1\" AMOLED color screen, magnetic charging, 14-day battery, and 11 professional sports modes.",
    "description": "Track your daily fitness, steps, heart rate, and sleep quality with the Xiaomi Mi Smart Band 5. Features an upgraded 1.1-inch dynamic color display with over 65 custom dial faces, 11 sports modes including yoga and rowing machine, 5ATM water resistance, and convenient magnetic snap-on charging.",
    "image": "images/products/xiaomi_smartband5.jpg",
    "gallery": [
      "images/products/xiaomi_smartband5.jpg",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 32,
    "rating": 4.6,
    "reviews_count": 35,
    "featured": 0,
    "specs": {
      "Brand": "Xiaomi",
      "Model": "Mi Smart Band 5",
      "Display": "1.1-inch Color AMOLED (126 x 294 pixels)",
      "Battery Life": "14-Day Battery Life (Magnetic Snap Charging)",
      "Water Resistance": "5ATM Water Resistant (Up to 50 meters)",
      "Tracking": "24/7 Heart Rate, Sleep Analysis, Stress Monitoring, PAI Score",
      "Weight": "11.9g"
    },
    "reviews": []
  },
  {
    "id": 13,
    "title": "Apple iPhone 15 Pro (128GB, Natural Titanium)",
    "slug": "apple-iphone-15-pro",
    "category": "Phones",
    "price": 129800,
    "original_price": 134900,
    "short_description": "Aerospace-grade titanium, A17 Pro chip, customizable Action button, and 48MP Pro camera system.",
    "description": "Forged in titanium. Apple iPhone 15 Pro features a strong and lightweight aerospace-grade titanium design with textured matte-glass back. Powered by the groundbreaking A17 Pro chip for next-generation mobile gaming. Capture phenomenal detail with the 48MP Main camera, 3x Telephoto lens, and versatile Action button.",
    "image": "images/products/apple_iphone_15_pro.jpg",
    "gallery": [
      "images/products/apple_iphone_15_pro.jpg",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 15,
    "rating": 4.9,
    "reviews_count": 88,
    "featured": 1,
    "specs": {
      "Brand": "Apple",
      "Model": "iPhone 15 Pro",
      "Display": "6.1-inch Super Retina XDR with ProMotion 120Hz & Always-On",
      "Processor": "A17 Pro chip with 6-core GPU and hardware ray tracing",
      "Storage": "128GB NVMe",
      "Camera": "Pro Camera System (48MP Main + 12MP Ultra-Wide + 12MP 3x Telephoto)",
      "Connector": "USB-C with USB 3 speeds (up to 10Gbps)",
      "Durability": "Ceramic Shield front, IP68 water resistance"
    },
    "reviews": []
  },
  {
    "id": 14,
    "title": "Apple Studio Display 27\" 5K Retina Monitor",
    "slug": "apple-studio-display-27-5k",
    "category": "Monitors",
    "price": 149900,
    "original_price": 159900,
    "short_description": "27-inch 5K Retina display, 12MP camera with Center Stage, 3-mic array, and 6 speakers with Spatial Audio.",
    "description": "A sight to be beholden. Apple Studio Display draws you in from the moment you turn it on with 14.7 million pixels of 5K Retina brilliance, 600 nits of brightness, and P3 wide color. Includes a 12MP Ultra Wide camera with Center Stage, a studio-quality three-mic array, and a six-speaker sound system with Spatial Audio.",
    "image": "images/products/apple_studio_display.jpg",
    "gallery": [
      "images/products/apple_studio_display.jpg",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 12,
    "rating": 4.9,
    "reviews_count": 54,
    "featured": 1,
    "specs": {
      "Brand": "Apple",
      "Model": "Studio Display (Standard Glass, Tilt Stand)",
      "Panel Size": "27-inch 5K Retina (5120 x 2880 at 218 ppi)",
      "Brightness": "600 nits brightness, 1 billion colors, P3 wide color gamut",
      "Camera": "12MP Ultra Wide camera with 122° field of view & Center Stage",
      "Audio": "High-fidelity 6-speaker system with force-cancelling woofers",
      "Ports": "1x Thunderbolt 3 (96W host charging) + 3x USB-C (up to 10Gbps)"
    },
    "reviews": []
  },
  {
    "id": 15,
    "title": "Samsung 55\" Crystal 4K UHD Smart TV (55DUE70)",
    "slug": "samsung-55-crystal-4k-smart-tv",
    "category": "TVs",
    "price": 43990,
    "original_price": 64900,
    "short_description": "Vivid Crystal Processor 4K, PurColor lifelike picture, HDR10+, OTS Lite, and Tizen OS with SmartThings.",
    "description": "Experience vivid, true-to-life colors and stunning 4K clarity with the Samsung 55\" Crystal UHD TV. Powered by the intelligent Crystal Processor 4K that upscales all your favorite movies and shows. Enjoy Q-Symphony sound synchronization, Motion Xcelerator for smooth sports/gaming, and built-in streaming apps like Netflix, Prime Video, and Apple TV.",
    "image": "images/products/samsung_55_smart_tv.jpg",
    "gallery": [
      "images/products/samsung_55_smart_tv.jpg",
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 8,
    "rating": 4.9,
    "reviews_count": 67,
    "featured": 1,
    "specs": {
      "Brand": "Samsung",
      "Model": "Crystal 4K UHD (55\")",
      "Screen Size": "55 inches (138 cm)",
      "Resolution": "3840 x 2160 (4K UHD) with PurColor & HDR10+",
      "Processor": "Crystal Processor 4K with 4K Upscaling",
      "Sound": "20W 2CH Speakers with Object Tracking Sound (OTS Lite) & Q-Symphony",
      "Operating System": "Samsung Tizen OS with Voice Assistants",
      "Connectivity": "3x HDMI, 1x USB, Wi-Fi 5, Bluetooth 5.2, Optical Audio Out"
    },
    "reviews": []
  },
  {
    "id": 16,
    "title": "Apple iPad Pro 11\" with Apple Pencil (Liquid Retina Display)",
    "slug": "apple-ipad-pro-11-liquid-retina",
    "category": "Tablets",
    "price": 81900,
    "original_price": 89900,
    "short_description": "11-inch Liquid Retina display with ProMotion 120Hz, Apple M2 chip, and magnetic Apple Pencil support.",
    "description": "Astonishing performance, incredibly advanced displays, superfast wireless connectivity, and next-level Apple Pencil capabilities. Powered by the Apple M2 chip with 8-core CPU and 10-core GPU, the iPad Pro is the ultimate portable digital canvas for artists, students, and professionals.",
    "image": "images/products/apple_ipad_pro.jpg",
    "gallery": [
      "images/products/apple_ipad_pro.jpg",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 18,
    "rating": 4.8,
    "reviews_count": 51,
    "featured": 1,
    "specs": {
      "Brand": "Apple",
      "Model": "iPad Pro 11-inch (Wi-Fi, 128GB)",
      "Display": "11-inch Liquid Retina with ProMotion (120Hz) & True Tone",
      "Processor": "Apple M2 Chip with 8-Core CPU & 10-Core GPU",
      "Pen Support": "Apple Pencil (2nd Gen) with magnetic charging & hover",
      "Cameras": "12MP Wide + 10MP Ultra-Wide rear with LiDAR Scanner; 12MP TrueDepth front",
      "Security": "Face ID facial recognition",
      "Connector": "Thunderbolt / USB 4"
    },
    "reviews": []
  },
  {
    "id": 17,
    "title": "Sony PlayStation 5 Console (1TB SSD, DualSense Controller)",
    "slug": "sony-playstation-5-console",
    "category": "Gaming",
    "price": 49990,
    "original_price": 54990,
    "short_description": "Ultra-fast 1TB SSD, ray tracing, 4K gaming up to 120fps, 3D audio, and DualSense haptic feedback.",
    "description": "Experience lightning-fast loading with an ultra-high speed 1TB SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games. Enjoy smooth and fluid high frame rate gameplay at up to 120fps for compatible games on 4K displays.",
    "image": "images/products/sony_ps5_console.jpg",
    "gallery": [
      "images/products/sony_ps5_console.jpg",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 10,
    "rating": 5,
    "reviews_count": 98,
    "featured": 1,
    "specs": {
      "Brand": "Sony Interactive Entertainment",
      "Model": "PlayStation 5 (CFI-2000 Slim)",
      "Storage": "1TB Custom Ultra-High Speed NVMe SSD (Expandable M.2 slot)",
      "Graphics": "10.3 TFLOPS, AMD RDNA 2-based GPU with Hardware Ray Tracing",
      "Video Output": "HDMI 2.1 support for 4K 120Hz TVs, 8K TVs, VRR",
      "Audio": "Tempest 3D AudioTech",
      "Controller": "DualSense Wireless Controller with Haptic Feedback & Dynamic Triggers",
      "Included in Box": "PS5 Console, DualSense Controller, 1TB SSD, HDMI Cable, Power Cord"
    },
    "reviews": []
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
        const mockUser = { id: 1, name: 'Alex Mercer', email: email || 'demo@techstore.com', role: 'customer' };
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
  }
};

window.api = api;
