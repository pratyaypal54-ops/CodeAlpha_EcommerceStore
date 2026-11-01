/**
 * TechStore - State Management
 * Handles Cart items, Variants, Wishlist, Coupons, User/Seller role, and LocalStorage caching.
 */

const State = {
  user: null,
  token: null,
  cart: [],
  wishlist: [],
  activeCoupon: null,
  geminiApiKey: '',
  selectedProductForAI: null,
  filters: {
    category: 'All',
    sellerId: null,
    search: '',
    maxPrice: 200000,
    sort: 'featured',
    inStockOnly: false
  },

  init() {
    try {
      const savedUser = localStorage.getItem('techstore_user');
      if (savedUser) this.user = JSON.parse(savedUser);

      const savedToken = localStorage.getItem('techstore_token');
      if (savedToken) this.token = savedToken;

      const savedCart = localStorage.getItem('techstore_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          this.cart = parsedCart.map(item => ({
            ...item,
            cartItemId: item.cartItemId || `${item.id}__${item.selectedVariant || 'Default'}`
          }));
        }
      }

      const savedWishlist = localStorage.getItem('techstore_wishlist');
      if (savedWishlist) this.wishlist = JSON.parse(savedWishlist);

      const savedCoupon = localStorage.getItem('techstore_coupon');
      if (savedCoupon) this.activeCoupon = JSON.parse(savedCoupon);

      const savedGeminiKey = localStorage.getItem('techstore_gemini_key');
      if (savedGeminiKey) this.geminiApiKey = savedGeminiKey;
    } catch (e) {
      console.warn('Could not read saved state:', e);
    }
  },

  // Auth & Seller state
  setUser(user, token) {
    this.user = user;
    if (token) this.token = token;
    localStorage.setItem('techstore_user', JSON.stringify(user));
    if (token) localStorage.setItem('techstore_token', token);
    window.dispatchEvent(new CustomEvent('techstore:auth_changed', { detail: { user } }));
  },

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('techstore_user');
    localStorage.removeItem('techstore_token');
    window.dispatchEvent(new CustomEvent('techstore:auth_changed', { detail: { user: null } }));
  },

  isLoggedIn() {
    return Boolean(this.user && (this.token || this.user.email));
  },

  isSeller() {
    return Boolean(this.user && this.user.role === 'seller');
  },

  setGeminiKey(key) {
    this.geminiApiKey = (key || '').trim();
    if (this.geminiApiKey) {
      localStorage.setItem('techstore_gemini_key', this.geminiApiKey);
    } else {
      localStorage.removeItem('techstore_gemini_key');
    }
  },

  // Cart operations with Variant support
  addToCart(product, quantity = 1, selectedVariant = null) {
    const variantKey = selectedVariant || 'Default';
    const cartItemId = `${product.id}__${variantKey}`;

    const existingIndex = this.cart.findIndex(item => 
      item.cartItemId === cartItemId || 
      (String(item.id) === String(product.id) && (item.selectedVariant || 'Default') === variantKey)
    );

    if (existingIndex > -1) {
      const existing = this.cart[existingIndex];
      const newQty = existing.quantity + quantity;
      if (product.stock !== undefined && newQty > product.stock) {
        throw new Error(product.stock === 0 ? `Sorry, "${product.title}" is out of stock.` : `Only ${product.stock} items left in stock.`);
      }
      existing.quantity = newQty;
      existing.cartItemId = cartItemId; // ensure cartItemId is set
    } else {
      if (product.stock === 0) {
        throw new Error(`"${product.title}" is currently out of stock.`);
      }
      this.cart.push({
        cartItemId,
        id: product.id,
        title: product.title,
        price: Number(product.price),
        image: product.image,
        category: product.category,
        stock: product.stock !== undefined ? product.stock : 20,
        selectedVariant: selectedVariant || null,
        seller_name: product.seller ? product.seller.name : (product.seller_name || 'Apex Tech & Audio'),
        quantity: Math.max(1, quantity)
      });
    }

    this.saveCart();
    return this.cart;
  },

  updateCartQuantity(cartItemIdOrProductId, quantity) {
    const target = String(cartItemIdOrProductId);
    const item = this.cart.find(i => 
      (i.cartItemId && String(i.cartItemId) === target) || 
      String(i.id) === target
    );
    if (!item) return;

    if (quantity <= 0) {
      this.removeFromCart(cartItemIdOrProductId);
    } else {
      if (item.stock !== undefined && quantity > item.stock) {
        throw new Error(`Maximum available stock is ${item.stock}`);
      }
      item.quantity = Number(quantity);
      this.saveCart();
    }
  },

  removeFromCart(cartItemIdOrProductId) {
    const target = String(cartItemIdOrProductId);
    this.cart = this.cart.filter(item => {
      // 1. Exact match on cartItemId (e.g. "5__Default")
      if (item.cartItemId && String(item.cartItemId) === target) return false;
      // 2. Exact match on product id if target doesn't contain variant separator
      if (String(item.id) === target) return false;
      // 3. Fallback match if item has no cartItemId
      if (!item.cartItemId && String(item.id) === target.split('__')[0]) return false;
      return true;
    });
    this.saveCart();
  },

  clearCart() {
    this.cart = [];
    this.activeCoupon = null;
    localStorage.removeItem('techstore_coupon');
    this.saveCart();
  },

  saveCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(this.cart));
    window.dispatchEvent(new CustomEvent('techstore:cart_updated'));
  },

  getCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const count = this.cart.reduce((sum, item) => sum + Number(item.quantity), 0);

    let discount = 0;
    if (this.activeCoupon) {
      discount = subtotal * (this.activeCoupon.discountRate || 0);
    }

    // Free shipping on orders of ₹499 or more
    let shippingFee = 0;
    if (subtotal > 0) {
      if (subtotal >= 499 || (this.activeCoupon && (this.activeCoupon.code === 'FREESHIP' || this.activeCoupon.freeShipping))) {
        shippingFee = 0;
      } else {
        shippingFee = 49.00;
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = subtotal > 0 ? Number((taxableAmount * 0.18).toFixed(2)) : 0;
    const total = Number((taxableAmount + tax + shippingFee).toFixed(2));

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      shippingFee: Number(shippingFee.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: total,
      itemCount: count
    };
  },

  applyCoupon(rawCode) {
    if (!rawCode) return { success: false, message: 'Please enter a coupon code.' };
    const code = rawCode.trim().toUpperCase();

    if (code === 'TECH15' || code === 'SAVE15' || code === 'WELCOME15') {
      this.activeCoupon = { code: 'TECH15', discountRate: 0.15, label: '15% Off (TECH15)' };
    } else if (code === 'SAVE10' || code === 'WELCOME10') {
      this.activeCoupon = { code: 'SAVE10', discountRate: 0.10, label: '10% Off' };
    } else if (code === 'FREESHIP') {
      this.activeCoupon = { code, discountRate: 0.0, freeShipping: true, label: 'Free Shipping' };
    } else {
      return { success: false, message: 'Coupon code not found. Try TECH15 or WELCOME10.' };
    }

    localStorage.setItem('techstore_coupon', JSON.stringify(this.activeCoupon));
    this.saveCart();
    return { success: true, message: `Coupon applied successfully!`, coupon: this.activeCoupon };
  },

  toggleWishlist(productId) {
    const id = Number(productId);
    const index = this.wishlist.indexOf(id);
    let added = false;

    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push(id);
      added = true;
    }

    localStorage.setItem('techstore_wishlist', JSON.stringify(this.wishlist));
    window.dispatchEvent(new CustomEvent('techstore:wishlist_updated', { detail: { productId: id, added } }));
    return added;
  },

  isWishlisted(productId) {
    return this.wishlist.includes(Number(productId));
  }
};

State.init();
window.State = State;
