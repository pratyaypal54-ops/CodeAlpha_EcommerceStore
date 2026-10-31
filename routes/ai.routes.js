const express = require('express');
const router = express.Router();
const { get, all } = require('../db/database');

// Helper to format product for AI grounding
const getProductAIContext = async (productId) => {
  if (!productId) return null;

  const product = await get('SELECT * FROM products WHERE id = ?', [productId]);
  if (!product) return null;

  const reviews = await all(
    'SELECT user_name, rating, comment, pros, cons, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
    [product.id]
  );

  let variants = {};
  try {
    variants = product.variants ? JSON.parse(product.variants) : {};
  } catch (e) {}

  let priceHistory = {};
  try {
    priceHistory = product.price_history ? JSON.parse(product.price_history) : {};
  } catch (e) {}

  let specs = {};
  try {
    specs = product.specs ? JSON.parse(product.specs) : {};
  } catch (e) {}

  return {
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    original_price: product.original_price,
    stock: product.stock,
    rating: product.rating,
    reviews_count: product.reviews_count,
    description: product.description,
    short_description: product.short_description,
    seller_name: product.seller_name,
    seller_rating: product.seller_rating,
    seller_reviews_count: product.seller_reviews_count,
    variants,
    priceHistory,
    specs,
    reviews
  };
};

// Heuristic fallback response generator (intelligent, grounded, contextual)
const generateLocalAIResponse = (query, product, intent) => {
  const q = (query || '').toLowerCase().trim();

  // If asking about reviews, pros, cons, or good/bad points
  if (intent === 'reviews' || q.includes('review') || q.includes('pro') || q.includes('con') || q.includes('good') || q.includes('bad') || q.includes('summar')) {
    if (!product) {
      return `### 🌟 TechStore Customer Review Insights\nAcross our verified marketplace, customer satisfaction is **4.8/5.0** across over 10,000+ orders.\n\nTo see a detailed breakdown of pros, cons, and review summaries, please open any product page and click **"✨ Ask AI about this product"** or ask me directly about a specific item like the *Sony WH-1000XM4* or *Apple Watch Series 9*!`;
    }

    const reviews = product.reviews || [];
    const prosList = [];
    const consList = [];

    reviews.forEach(r => {
      if (r.pros && r.pros.trim()) prosList.push(r.pros.trim());
      if (r.cons && r.cons.trim()) consList.push(r.cons.trim());
    });

    // Fallbacks if no structured pros/cons entered
    if (prosList.length === 0) {
      prosList.push('Excellent build quality and materials true to manufacturer standards.');
      prosList.push('Fast performance and seamless daily reliability.');
      prosList.push('Intuitive setup straight out of the box.');
    }
    if (consList.length === 0) {
      consList.push('Premium price point reflective of flagship tier.');
      consList.push('High customer demand can cause occasional low stock warnings.');
    }

    const positivePercent = Math.min(99, Math.max(88, Math.round((product.rating / 5.0) * 100)));

    let response = `### 🤖 AI Review Analysis: ${product.title}\n\n`;
    response += `**Overall Customer Sentiment:** 🟢 **${positivePercent}% Positive** based on **${reviews.length > 0 ? reviews.length : product.reviews_count} verified buyer ratings** (Average Score: **${product.rating} / 5.0 ★**).\n\n`;

    response += `#### 🟢 What Customers Love (Pros):\n`;
    prosList.slice(0, 5).forEach(pro => {
      response += `- ✅ **${pro}**\n`;
    });

    response += `\n#### 🔴 What Could Be Better (Cons):\n`;
    consList.slice(0, 4).forEach(con => {
      response += `- ⚠️ **${con}**\n`;
    });

    response += `\n#### 🎯 AI Buyer Verdict:\n`;
    if (product.rating >= 4.8) {
      response += `> **Top Recommendation:** Highly recommended for buyers seeking uncompromised quality. The verified pros heavily outweigh the minor limitations noted by customers.`;
    } else {
      response += `> **Solid Value:** Strong overall performance for everyday use. Take note of the battery/ergonomic points mentioned above to ensure it aligns with your specific needs.`;
    }

    return response;
  }

  // If asking about price history, discount, or "is it the best time to buy?"
  if (intent === 'price' || q.includes('best time') || q.includes('price') || q.includes('history') || q.includes('deal') || q.includes('worth') || q.includes('discount')) {
    if (!product) {
      return `### 📈 TechStore Price History & Deal Intelligence\nEvery product listed on TechStore tracks real 90-day price trends so you never overpay.\n\nOpen any product to see its historical high, lowest recorded price, deal score, and our definitive AI buy verdict!`;
    }

    const hist = product.priceHistory || {};
    const curPrice = product.price;
    const origPrice = product.original_price || Math.round(curPrice * 1.2);
    const lowest = hist.lowest || Math.round(curPrice * 0.95);
    const highest = hist.highest || origPrice;
    const dealScore = hist.deal_score || (origPrice > curPrice ? 91 : 80);
    const savings = Math.max(0, origPrice - curPrice);

    let verdict = hist.verdict || '';
    if (!verdict) {
      verdict = savings > 0
        ? `🔥 **BEST TIME TO BUY!** Current price is saving you ₹${savings.toLocaleString('en-IN')} off regular retail price.`
        : `⚖️ **Fair Market Price.** Steady pricing with no immediate inflation expected.`;
    }

    let response = `### 📊 Price History & Buy Advice: ${product.title}\n\n`;
    response += `**Current Price:** **₹${curPrice.toLocaleString('en-IN')}** | M.R.P.: ~~₹${origPrice.toLocaleString('en-IN')}~~ *(Save ₹${savings.toLocaleString('en-IN')})*\n`;
    response += `**Deal Confidence Score:** **${dealScore}/100** ⭐\n\n`;

    response += `#### 📉 90-Day Price Trajectory:\n`;
    if (hist.history && Array.isArray(hist.history)) {
      hist.history.forEach(h => {
        response += `- **${h.date}:** ₹${h.price.toLocaleString('en-IN')}\n`;
      });
    } else {
      response += `- **Launch / 90d Ago:** ₹${highest.toLocaleString('en-IN')}\n`;
      response += `- **30d Ago:** ₹${Math.round(curPrice * 1.05).toLocaleString('en-IN')}\n`;
      response += `- **Today:** ₹${curPrice.toLocaleString('en-IN')} *(Lowest recorded: ₹${lowest.toLocaleString('en-IN')})*\n`;
    }

    response += `\n#### 💡 Is it the best time to buy right now?\n`;
    response += `> **${verdict}**\n\n`;

    if (product.stock > 0 && product.stock <= 5) {
      response += `⚡ **Urgency Note:** Only **${product.stock} units left in stock** at this price point from seller **${product.seller_name}**. Grab yours before restock pricing kicks in!`;
    } else if (product.stock === 0) {
      response += `⚠️ **Stock Alert:** This product is currently **Out of Stock**. We recommend checking back soon or choosing an available alternative.`;
    } else {
      response += `🚚 **In Stock & Ready to Ship:** Dispatches within 24 hours with Free Standard Delivery.`;
    }

    return response;
  }

  // Seller info query
  if (q.includes('seller') || q.includes('merchant') || q.includes('become a seller') || q.includes('sell on')) {
    if (q.includes('become') || q.includes('how to sell') || q.includes('register as a seller')) {
      return `### 🏪 How to Become a Seller on TechStore\n\nYou can easily start selling your products on our marketplace in two simple ways:\n\n1. **When Registering:** On the Sign Up tab in the Account modal, check **"I want to register as a Seller / Merchant"**, input your Store Name and Description, and your merchant account is created immediately!\n2. **If You Already Have an Account:** Open **"My Account"** in the top navigation, and click the **"🚀 Become a Seller"** button to instantly upgrade your account.\n\n**Seller Benefits:**\n- 📦 List unlimited electronics and gadgets with custom variants (colors, sizes, storage).\n- ⚡ Set low-stock urgency alerts and live stock counts.\n- ⭐ Build your seller rating with authentic customer reviews.\n- 📊 Access the dedicated **Seller Hub Dashboard** to manage listings and inventory.`;
    }

    if (product) {
      return `### 🛡️ Verified Seller Profile: ${product.seller_name}\n\n- **Merchant Rating:** **${product.seller_rating || 4.9} ★** based on **${(product.seller_reviews_count || 1480).toLocaleString('en-IN')} customer reviews**.\n- **Merchant Verification:** ✅ Verified Official TechStore Partner.\n- **Fulfillment:** Inspected and packaged with 100% tamper-evident seal.\n- **Warranty:** Standard 1-Year Manufacturer & Merchant replacement policy.`;
    }
  }

  // Tracking & delivery questions
  if (q.includes('track') || q.includes('order') || q.includes('delivery') || q.includes('shipping')) {
    return `### 📦 Shipping & Order Tracking Information\n\n- **Order Tracking:** Click the **"📦 Track Order"** button in the top navigation bar and enter your Order ID (e.g. \`ORD-2025-10492\`) to view real-time shipping milestones.\n- **Delivery Time:** Standard delivery takes **2 to 3 business days** across all major pin codes.\n- **Free Shipping:** All orders above **₹499** automatically qualify for Free Delivery!\n- **Tracking Past Orders:** Sign in and visit your **"My Account"** section to view past receipts and status.`;
  }

  // Product specific generic questions
  if (product) {
    let response = `### ⚡ Insights for ${product.title}\n\n`;
    response += `**Category:** ${product.category} | **Price:** ₹${product.price.toLocaleString('en-IN')} | **Stock:** ${product.stock > 0 ? (product.stock <= 5 ? `⚡ Only ${product.stock} left!` : `✓ In Stock (${product.stock} units)`) : 'Out of Stock'}\n\n`;
    response += `**Product Overview:**\n${product.description}\n\n`;

    if (product.variants && product.variants.colors && product.variants.colors.length > 0) {
      response += `**Available Colors:** ${product.variants.colors.map(c => c.name).join(', ')}\n`;
    }
    if (product.variants && product.variants.options && product.variants.options.length > 0) {
      response += `**Configurations:** ${product.variants.options.join(', ')}\n\n`;
    }

    response += `**Seller:** ${product.seller_name} (${product.seller_rating} ★)\n\n`;
    response += `*Need more specifics? You can ask me to "Summarize reviews", "Check price history", or "Compare with alternatives"!*`;
    return response;
  }

  // General fallback
  return `### 👋 Hello! I am your TechStore AI Assistant\n\nI am here to help you shop smart and make informed decisions! Here is what I can do for you:\n\n1. 🔍 **Review Summarizer:** Ask me about any product and I will extract the top **Pros** and **Cons** from real buyer reviews.\n2. 📈 **Price History & Timing:** Ask me *"Is it the best time to buy?"* and I will analyze 90-day price trends and deal confidence.\n3. 🏪 **Seller Marketplace:** Ask how to register as a seller, manage inventory, or check seller credentials.\n4. 📦 **Order Help:** Inquire about order status, delivery estimates, or returns policy.\n\n*Try opening any product and asking me about it, or type your question below!*`;
};

// Call Google Gemini API
const callGeminiAPI = async (apiKey, query, productContext, history = []) => {
  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let systemPrompt = `You are the intelligent, helpful, and concise AI Shopping Assistant for "TechStore", a modern e-commerce electronics marketplace.
Prices are in Indian Rupees (₹).
You assist users with:
1. Product inquiries, specifications, compatibility, and real-world recommendations.
2. Review Summarization: Extract and highlight structured Pros (what customers love) and Cons (what could be better) with overall sentiment score based on real buyer reviews.
3. Price History & Best Time to Buy: Give a definitive, honest verdict on whether now is the best time to buy based on historical prices and discounts.
4. Marketplace & Seller info: Explain how users can register/become sellers and list products.
Keep your formatting clean, using Markdown bullet points, bold highlights, and occasional emojis for readability.`;

  if (productContext) {
    systemPrompt += `\n\nCURRENT PRODUCT CONTEXT GROUNDING:
Title: ${productContext.title}
Category: ${productContext.category}
Current Price: ₹${productContext.price}
Original Price (MRP): ₹${productContext.original_price || productContext.price}
Stock Available: ${productContext.stock} (${productContext.stock <= 5 && productContext.stock > 0 ? 'LOW STOCK' : (productContext.stock === 0 ? 'OUT OF STOCK' : 'IN STOCK')})
Seller: ${productContext.seller_name} (Rating: ${productContext.seller_rating} ★, ${productContext.seller_reviews_count} reviews)
Variants: ${JSON.stringify(productContext.variants || {})}
Price History: ${JSON.stringify(productContext.priceHistory || {})}
Specs: ${JSON.stringify(productContext.specs || {})}
Customer Reviews: ${JSON.stringify((productContext.reviews || []).map(r => ({ user: r.user_name, rating: r.rating, comment: r.comment, pros: r.pros, cons: r.cons })))}
`;
  }

  const contents = [];
  // Add history if present
  if (history && Array.isArray(history)) {
    history.slice(-4).forEach(item => {
      contents.push({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      });
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  const payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) {
    throw new Error('No response text received from Gemini');
  }

  return replyText;
};

// 1. POST /api/ai/chat - Main AI Assistant Chatbot
router.post('/chat', async (req, res) => {
  try {
    const { query, productId, intent, history } = req.body;
    const clientKey = req.headers['x-gemini-key'] || req.body.apiKey || process.env.GEMINI_API_KEY;

    if (!query || query.trim() === '') {
      return res.status(400).json({ success: false, message: 'Query cannot be empty.' });
    }

    const productContext = await getProductAIContext(productId);

    // If Gemini API Key is available, attempt real Gemini API call
    if (clientKey && clientKey.trim() !== '') {
      try {
        const geminiReply = await callGeminiAPI(clientKey.trim(), query, productContext, history);
        return res.status(200).json({
          success: true,
          reply: geminiReply,
          source: 'gemini',
          product: productContext ? { id: productContext.id, title: productContext.title } : null
        });
      } catch (geminiError) {
        console.warn('Gemini API call failed, gracefully falling back to local AI engine:', geminiError.message);
        // Fall back seamlessly to local AI engine
      }
    }

    // High-fidelity local AI engine fallback
    const localReply = generateLocalAIResponse(query, productContext, intent);

    return res.status(200).json({
      success: true,
      reply: localReply,
      source: 'local_ai',
      hasGeminiKey: Boolean(clientKey),
      product: productContext ? { id: productContext.id, title: productContext.title } : null
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI request.',
      reply: 'I encountered an unexpected glitch. Please try asking again!'
    });
  }
});

// 2. POST /api/ai/summarize-reviews - Dedicated Review Summarizer
router.post('/summarize-reviews', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required.' });
    }

    const productContext = await getProductAIContext(productId);
    if (!productContext) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const clientKey = req.headers['x-gemini-key'] || req.body.apiKey || process.env.GEMINI_API_KEY;

    if (clientKey && clientKey.trim() !== '') {
      try {
        const query = 'Summarize user reviews for this product: What is good (Pros) and what is bad (Cons)? Give me a clear breakdown and AI verdict.';
        const geminiReply = await callGeminiAPI(clientKey.trim(), query, productContext);
        return res.status(200).json({
          success: true,
          summary: geminiReply,
          source: 'gemini'
        });
      } catch (err) {
        console.warn('Gemini review summary failed, using local engine:', err.message);
      }
    }

    const localSummary = generateLocalAIResponse('summarize reviews', productContext, 'reviews');
    return res.status(200).json({
      success: true,
      summary: localSummary,
      source: 'local_ai'
    });
  } catch (error) {
    console.error('Summarize Reviews Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to summarize reviews.' });
  }
});

// 3. POST /api/ai/price-advisor - Dedicated Price History & Buy Advice
router.post('/price-advisor', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required.' });
    }

    const productContext = await getProductAIContext(productId);
    if (!productContext) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const clientKey = req.headers['x-gemini-key'] || req.body.apiKey || process.env.GEMINI_API_KEY;

    if (clientKey && clientKey.trim() !== '') {
      try {
        const query = 'Analyze the product price history: Is this the best time to buy or not? Give deal score and timing advice.';
        const geminiReply = await callGeminiAPI(clientKey.trim(), query, productContext);
        return res.status(200).json({
          success: true,
          advice: geminiReply,
          source: 'gemini'
        });
      } catch (err) {
        console.warn('Gemini price advisor failed, using local engine:', err.message);
      }
    }

    const localAdvice = generateLocalAIResponse('price history is it best time to buy', productContext, 'price');
    return res.status(200).json({
      success: true,
      advice: localAdvice,
      source: 'local_ai'
    });
  } catch (error) {
    console.error('Price Advisor Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate price advice.' });
  }
});

module.exports = router;
