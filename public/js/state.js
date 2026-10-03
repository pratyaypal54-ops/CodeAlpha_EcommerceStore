/**
 * TechStore - State Management
 * Handles Cart items, Wishlist, Coupons, and LocalStorage caching.
 */

const State = {
  user: null,
  cart: [],
  wishlist: [],
  activeCoupon: null,
  filters: {
    category: 'All',
    search: '',
    maxPrice: 200000,
    sort: 'featured',
    inStockOnly: false
  },

  init() {
    try {
      const savedCart = localStorage.getItem('techstore_cart');
      if (savedCart) this.cart = JSON.parse(savedCart);

      const savedWishlist = localStorage.getItem('techstore_wishlist');
      if (savedWishlist) this.wishlist = JSON.parse(savedWishlist);

      const savedCoupon = localStorage.getItem('techstore_coupon');
      if (savedCoupon) this.activeCoupon = JSON.parse(savedCoupon);
    } catch (e) {
      console.warn('Could not read saved cart state:', e);
    }
  },

  // Cart operations
  addToCart(product, quantity = 1) {
    const existingIndex = this.cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      const existing = this.cart[existingIndex];
      const newQty = existing.quantity + quantity;
      if (product.stock && newQty > product.stock) {
        throw new Error(`Only ${product.stock} items left in stock.`);
      }
      existing.quantity = newQty;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock || 20,
        quantity: Math.max(1, quantity)
      });
    }

    this.saveCart();
    return this.cart;
  },

  updateCartQuantity(productId, quantity) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      if (item.stock && quantity > item.stock) {
        throw new Error(`Maximum available stock is ${item.stock}`);
      }
      item.quantity = quantity;
      this.saveCart();
    }
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
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
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    let discount = 0;
    if (this.activeCoupon) {
      discount = subtotal * this.activeCoupon.discountRate;
    }

    // Free shipping on orders of ₹499 or more
    let shippingFee = 0;
    if (subtotal > 0) {
      if (subtotal >= 499 || (this.activeCoupon && this.activeCoupon.code === 'FREESHIP')) {
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
