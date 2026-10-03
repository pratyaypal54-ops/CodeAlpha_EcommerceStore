/**
 * TechStore - Frontend Application Logic
 * Manages products, shopping cart, checkout flow, user accounts, and order tracking.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Currency Formatter (Indian Rupee ₹)
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: num % 1 === 0 ? 0 : 2
    });
  };
  window.formatCurrency = formatCurrency;

  // --------------------------------------------------------------------------
  // Distinct Fallback Images & Relative Path Formatter
  // Ensures every product has its own unique, authentic, high-res photo
  // and loads properly whether on file://, VS Code Live Server, or Express
  // --------------------------------------------------------------------------
  window.PRODUCT_FALLBACK_IMAGES = {
    1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', // Sony WH-1000XM4 Headphones
    2: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', // Apple Watch Series 9
    3: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', // Apple AirPods Pro
    4: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', // Keychron K2 Keyboard
    5: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', // Logitech G PRO X Mouse
    6: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80', // Logitech C920 Webcam
    7: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80', // Anker 3-in-1 MagSafe Stand
    8: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', // JBL Flip 6 Speaker
    9: 'https://images.unsplash.com/photo-1609592426508-410a6d59ce6b?auto=format&fit=crop&w=800&q=80', // Anker 737 Power Bank
    10: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80', // BenQ ScreenBar
    11: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', // Case Logic Backpack
    12: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80', // Xiaomi Smart Band 5
    13: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // Apple iPhone 15 Pro
    14: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', // Apple Studio Display 27"
    15: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80', // Samsung 55" Smart TV
    16: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', // Apple iPad Pro 11"
    17: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', // Sony PS5 Console
  };

  window.CATEGORY_FALLBACK_IMAGES = {
    'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'Peripherals': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1609592426508-410a6d59ce6b?auto=format&fit=crop&w=800&q=80',
    'Smart Home': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    'Phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'Monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'Displays': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'TVs': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    'Gaming': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'
  };

  window.getProductFallbackImage = function(id, category) {
    if (id && window.PRODUCT_FALLBACK_IMAGES[id]) {
      return window.PRODUCT_FALLBACK_IMAGES[id];
    }
    if (category && window.CATEGORY_FALLBACK_IMAGES[category]) {
      return window.CATEGORY_FALLBACK_IMAGES[category];
    }
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  };

  window.formatProductImageUrl = function(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    // Clean leading slash so the browser resolves relative to current page
    if (url.startsWith('/images/')) {
      return url.substring(1);
    }
    return url;
  };

  // --------------------------------------------------------------------------
  // 1. Toast Notifications
  // --------------------------------------------------------------------------
  const showToast = (message, type = 'info') => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
      <span style="font-size: 1.2rem;">${icon}</span>
      <div style="flex: 1; font-size: 0.9rem; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  };
  window.showToast = showToast;

  // --------------------------------------------------------------------------
  // 2. Light / Dark Theme Switcher
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const initTheme = () => {
    const savedTheme = localStorage.getItem('techstore_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  };

  const updateThemeIcon = (theme) => {
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
      themeToggleBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('techstore_theme', next);
      updateThemeIcon(next);
      showToast(`Switched to ${next} theme`, 'info');
    });
  }
  initTheme();

  // --------------------------------------------------------------------------
  // 3. User Authentication & Profile
  // --------------------------------------------------------------------------
  const authNavWrapper = document.getElementById('auth-nav-wrapper');
  const authModal = document.getElementById('auth-modal');
  const userOrdersModal = document.getElementById('user-orders-modal');

  const checkCurrentUser = async () => {
    if (api.auth.isLoggedIn()) {
      try {
        const res = await api.auth.getProfile();
        State.user = res.user;
        renderNavUser();
      } catch (err) {
        api.auth.logout();
        State.user = null;
        renderNavUser();
      }
    } else {
      State.user = null;
      renderNavUser();
    }
  };

  const renderNavUser = () => {
    if (!authNavWrapper) return;

    if (State.user) {
      authNavWrapper.innerHTML = `
        <div class="user-menu-pill" id="user-menu-btn" title="View Account & Orders">
          <div class="user-avatar-circle">${State.user.name.charAt(0).toUpperCase()}</div>
          <span class="user-name-text">${State.user.name.split(' ')[0]}</span>
        </div>
      `;
      document.getElementById('user-menu-btn').addEventListener('click', openUserOrdersModal);
    } else {
      authNavWrapper.innerHTML = `
        <button class="btn btn-secondary btn-sm" id="open-auth-btn">
          <span>Sign In</span>
        </button>
      `;
      document.getElementById('open-auth-btn').addEventListener('click', openAuthModal);
    }
  };

  const openAuthModal = () => {
    if (authModal) authModal.classList.add('open');
  };
  const closeAuthModal = () => {
    if (authModal) authModal.classList.remove('open');
  };

  // Sign In / Register Tab Toggle
  const loginTabBtn = document.getElementById('tab-login-btn');
  const registerTabBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginTabBtn && registerTabBtn) {
    loginTabBtn.addEventListener('click', () => {
      loginTabBtn.classList.add('active');
      registerTabBtn.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
    });

    registerTabBtn.addEventListener('click', () => {
      registerTabBtn.classList.add('active');
      loginTabBtn.classList.remove('active');
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
    });
  }

  // Quick Demo Auto-fill
  const demoFillBtn = document.getElementById('demo-fill-btn');
  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', () => {
      document.getElementById('login-email').value = 'demo@techstore.com';
      document.getElementById('login-password').value = 'password123';
      showToast('Demo login details filled in!', 'info');
    });
  }

  // Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const res = await api.auth.login(email, password);
        State.user = res.user;
        renderNavUser();
        closeAuthModal();
        showToast(res.message || 'Welcome back!', 'success');
      } catch (err) {
        showToast(err.message || 'Login failed', 'error');
      }
    });
  }

  // Register Submit
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm-password').value;

      if (password !== confirm) {
        return showToast('Passwords do not match.', 'error');
      }

      try {
        const res = await api.auth.register(name, email, password);
        State.user = res.user;
        renderNavUser();
        closeAuthModal();
        showToast('Your account is ready! Welcome!', 'success');
      } catch (err) {
        showToast(err.message || 'Could not create account.', 'error');
      }
    });
  }

  // Logout Handler
  const handleLogout = () => {
    api.auth.logout();
    State.user = null;
    renderNavUser();
    if (userOrdersModal) userOrdersModal.classList.remove('open');
    showToast('You have been signed out.', 'info');
  };

  // Past Orders Modal
  const openUserOrdersModal = async () => {
    if (!userOrdersModal) return;
    userOrdersModal.classList.add('open');

    const userInfoWrap = document.getElementById('user-modal-profile-info');
    const ordersListWrap = document.getElementById('user-modal-orders-list');

    if (userInfoWrap && State.user) {
      userInfoWrap.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div class="user-avatar-circle" style="width: 48px; height: 48px; font-size: 1.2rem;">
              ${State.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style="font-size: 1.1rem;">${State.user.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted);">${State.user.email}</p>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="logout-btn">Log Out</button>
        </div>
      `;
      document.getElementById('logout-btn').addEventListener('click', handleLogout);
    }

    if (ordersListWrap) {
      ordersListWrap.innerHTML = `<div style="text-align: center; padding: 30px;">Loading your orders...</div>`;
      try {
        const res = await api.orders.getMyOrders();
        const orders = res.orders || [];

        if (orders.length === 0) {
          ordersListWrap.innerHTML = `
            <div class="catalog-empty" style="padding: 30px;">
              <div class="catalog-empty-icon">📦</div>
              <h4>No orders yet</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">Your placed orders will show up here.</p>
            </div>
          `;
        } else {
          ordersListWrap.innerHTML = orders.map(order => {
            const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent';
            const orderNum = order.order_number || order.orderNumber;
            const items = order.items || [];

            return `
              <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                  <div>
                    <span style="font-weight: 700; color: var(--accent-cyan);">${orderNum}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 10px;">${dateStr}</span>
                  </div>
                  <span class="badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-cyan'}">
                    ${order.status || 'Processing'}
                  </span>
                </div>
                <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px;">
                  ${items.map(it => `<div>• ${it.quantity}x ${it.title}</div>`).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
                  <span style="font-weight: 700; font-size: 1.05rem;">Total: ${formatCurrency(order.total)}</span>
                  <button class="btn btn-outline btn-sm track-order-btn" data-order="${orderNum}">Track Status</button>
                </div>
              </div>
            `;
          }).join('');

          ordersListWrap.querySelectorAll('.track-order-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              userOrdersModal.classList.remove('open');
              trackOrder(btn.dataset.order);
            });
          });
        }
      } catch (err) {
        ordersListWrap.innerHTML = `<div style="color: var(--danger); text-align: center; padding: 20px;">Could not load past orders.</div>`;
      }
    }
  };

  // --------------------------------------------------------------------------
  // 4. Product Catalog & Filtering
  // --------------------------------------------------------------------------
  const productsGrid = document.getElementById('products-grid');
  const resultsCountEl = document.getElementById('results-count');
  const categoryPillsWrap = document.getElementById('category-pills-wrap');
  const priceSlider = document.getElementById('price-slider');
  const priceDisplay = document.getElementById('price-display');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const inStockCheckbox = document.getElementById('in-stock-checkbox');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');

  let currentProducts = [];

  const loadProducts = async () => {
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div class="catalog-empty" style="grid-column: 1 / -1;">
          <div class="catalog-empty-icon" style="animation: spin 1s infinite linear;">⚡</div>
          <h4>Loading products...</h4>
        </div>
      `;
    }

    try {
      const res = await api.products.getAll({
        category: State.filters.category,
        search: State.filters.search,
        maxPrice: State.filters.maxPrice,
        sort: State.filters.sort
      });

      let products = res.products || [];

      if (State.filters.inStockOnly) {
        products = products.filter(p => p.stock > 0);
      }

      currentProducts = products;
      renderProducts(products);
    } catch (err) {
      if (productsGrid) {
        productsGrid.innerHTML = `
          <div class="catalog-empty" style="grid-column: 1 / -1;">
            <div class="catalog-empty-icon">⚠️</div>
            <h4>Unable to load products</h4>
            <p style="color: var(--text-muted); margin-top: 8px;">Please check your connection and refresh.</p>
          </div>
        `;
      }
    }
  };
  window.loadProducts = loadProducts;

  const renderProducts = (products) => {
    if (!productsGrid) return;

    if (resultsCountEl) {
      resultsCountEl.innerHTML = `Showing <span>${products.length}</span> products`;
    }

    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="catalog-empty">
          <div class="catalog-empty-icon">🔍</div>
          <h3>No products match your search</h3>
          <p style="color: var(--text-muted); margin-top: 8px;">Try clearing filters or checking for typos.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" id="reset-empty-btn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-empty-btn');
      if (resetBtn) resetBtn.addEventListener('click', resetFilters);
      return;
    }

    productsGrid.innerHTML = products.map(prod => {
      const isWish = State.isWishlisted(prod.id);
      const discountPercent = prod.original_price 
        ? Math.round(((prod.original_price - prod.price) / prod.original_price) * 100) 
        : null;

      return `
        <div class="product-card" data-id="${prod.id}">
          <div class="product-image-container" onclick="window.openProductModal(${prod.id})">
            <img src="${window.formatProductImageUrl(prod.image)}" alt="${prod.title}" loading="lazy" onerror="this.onerror=null; this.src=window.getProductFallbackImage(${prod.id}, '${prod.category}');" />
            
            <div class="product-badges-wrap">
              ${discountPercent ? `<span class="badge badge-danger">-${discountPercent}%</span>` : ''}
              ${prod.featured ? `<span class="badge badge-cyan">Featured</span>` : ''}
            </div>

            <button class="wishlist-btn ${isWish ? 'active' : ''}" 
                    data-id="${prod.id}" 
                    onclick="event.stopPropagation(); window.handleWishlistToggle(${prod.id})">
              ${isWish ? '♥' : '♡'}
            </button>

            <div class="product-quick-view-overlay">
              <span class="btn btn-secondary btn-sm">Quick View</span>
            </div>
          </div>

          <div class="product-details">
            <span class="product-category">${prod.category}</span>
            <h4 class="product-title" onclick="window.openProductModal(${prod.id})">${prod.title}</h4>
            
            <div class="product-rating">
              <span class="rating-stars">★ ${prod.rating ? prod.rating.toFixed(1) : '4.8'}</span>
              <span class="rating-count">(${prod.reviews_count || 12})</span>
              <span style="margin-left: auto; font-size: 0.75rem; color: ${prod.stock < 5 ? 'var(--danger)' : 'var(--success)'}; font-weight: 600;">
                ${prod.stock < 5 ? `Only ${prod.stock} left` : 'In Stock'}
              </span>
            </div>

            <div class="product-footer">
              <div class="product-pricing">
                <span class="product-price">${formatCurrency(prod.price)}</span>
                ${prod.original_price ? `<span class="product-original-price">${formatCurrency(prod.original_price)}</span>` : ''}
              </div>

              <button class="btn btn-primary btn-sm add-to-cart-btn" 
                      onclick="window.handleAddToCart(${prod.id})">
                🛒 Add
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  // Reset Filters
  const resetFilters = () => {
    State.filters.category = 'All';
    State.filters.search = '';
    State.filters.maxPrice = 200000;
    State.filters.sort = 'featured';
    State.filters.inStockOnly = false;

    if (priceSlider) priceSlider.value = 200000;
    if (priceDisplay) priceDisplay.textContent = '₹2,00,000';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    if (sortSelect) sortSelect.value = 'featured';
    if (inStockCheckbox) inStockCheckbox.checked = false;

    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === 'All');
    });

    loadProducts();
  };

  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', resetFilters);

  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      priceDisplay.textContent = formatCurrency(val);
      State.filters.maxPrice = Number(val);
    });
    priceSlider.addEventListener('change', loadProducts);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      State.filters.sort = e.target.value;
      loadProducts();
    });
  }

  if (inStockCheckbox) {
    inStockCheckbox.addEventListener('change', (e) => {
      State.filters.inStockOnly = e.target.checked;
      loadProducts();
    });
  }

  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchClearBtn) searchClearBtn.style.display = val ? 'block' : 'none';
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        State.filters.search = val;
        loadProducts();
      }, 300);
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchClearBtn.style.display = 'none';
      State.filters.search = '';
      loadProducts();
    });
  }

  if (categoryPillsWrap) {
    categoryPillsWrap.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (!pill) return;

      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      State.filters.category = pill.dataset.category;
      loadProducts();
    });
  }

  // --------------------------------------------------------------------------
  // 5. Product Details Modal
  // --------------------------------------------------------------------------
  const productModal = document.getElementById('product-modal');
  const productModalBody = document.getElementById('product-modal-body');

  window.openProductModal = async (id) => {
    if (!productModal || !productModalBody) return;
    productModal.classList.add('open');
    productModalBody.innerHTML = `<div style="text-align: center; padding: 40px;">Loading product details...</div>`;

    try {
      const res = await api.products.getById(id);
      const prod = res.product;

      const rawGallery = prod.gallery && prod.gallery.length > 0 ? prod.gallery : [prod.image];
      const gallery = rawGallery.map(img => window.formatProductImageUrl(img));
      const specs = prod.specs || {};

      productModalBody.innerHTML = `
        <div class="product-modal-grid">
          <div>
            <div class="product-gallery-preview">
              <img id="main-gallery-img" src="${gallery[0]}" alt="${prod.title}" onerror="this.onerror=null; this.src=window.getProductFallbackImage(${prod.id}, '${prod.category}');" />
            </div>
            <div class="product-thumbnails-row">
              ${gallery.map((img, idx) => `
                <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="window.switchGalleryThumb('${img}', this)">
                  <img src="${img}" alt="Thumbnail" onerror="this.onerror=null; this.src=window.getProductFallbackImage(${prod.id}, '${prod.category}');" />
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <span class="product-category">${prod.category}</span>
            <h2 style="font-size: 1.4rem; margin-bottom: 8px;">${prod.title}</h2>
            
            <div class="product-rating" style="margin-bottom: 16px;">
              <span class="rating-stars">★ ${prod.rating ? prod.rating.toFixed(1) : '4.8'}</span>
              <span class="rating-count">(${prod.reviews_count || 12} reviews)</span>
              <span style="margin-left: 12px; color: ${prod.stock < 5 ? 'var(--danger)' : 'var(--success)'}; font-weight: 700; font-size: 0.85rem;">
                ● ${prod.stock} Units In Stock
              </span>
            </div>

            <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
              <span style="font-size: 1.7rem; font-weight: 800; color: var(--accent-cyan);">${formatCurrency(prod.price)}</span>
              ${prod.original_price ? `<span style="font-size: 1rem; color: var(--text-muted); text-decoration: line-through;">${formatCurrency(prod.original_price)}</span>` : ''}
            </div>

            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.6;">
              ${prod.description}
            </p>

            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
              <div class="quantity-control">
                <button class="qty-btn" onclick="window.changeModalQty(-1)">-</button>
                <input type="text" class="qty-input" id="modal-qty-input" value="1" readonly />
                <button class="qty-btn" onclick="window.changeModalQty(1, ${prod.stock})">+</button>
              </div>

              <button class="btn btn-primary" onclick="window.addModalProductToCart(${prod.id})">
                Add to Cart
              </button>
              <button class="btn btn-secondary" onclick="window.buyNowDirect(${prod.id})">
                ⚡ Buy Now
              </button>
            </div>

            <h4 style="font-size: 0.95rem; margin-bottom: 10px;">Specifications</h4>
            <table class="specs-table">
              <tbody>
                ${Object.entries(specs).map(([key, val]) => `
                  <tr>
                    <td>${key}</td>
                    <td>${val}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Customer Reviews -->
            <div style="margin-top: 32px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
              <h4 style="font-size: 1.05rem; margin-bottom: 14px;">Customer Reviews (${prod.reviews ? prod.reviews.length : 0})</h4>
              
              <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                ${prod.reviews && prod.reviews.length > 0 ? prod.reviews.map(r => `
                  <div style="background: var(--bg-tertiary); padding: 12px 16px; border-radius: var(--radius-md);">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                      <span style="font-weight: 700;">${r.user_name}</span>
                      <span style="color: #f59e0b;">${'★'.repeat(r.rating)}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">${r.comment}</p>
                  </div>
                `).join('') : '<p style="color: var(--text-muted); font-size: 0.85rem;">No reviews yet. Be the first to leave one!</p>'}
              </div>

              <div style="background: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md);">
                <h5 style="margin-bottom: 10px;">Write a Review</h5>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                  <input type="text" id="review-name-input" placeholder="Your Name" class="form-control" style="flex: 1;" value="${State.user ? State.user.name : ''}" />
                  <select id="review-rating-select" class="form-control" style="width: 110px;">
                    <option value="5">5 ★★★★★</option>
                    <option value="4">4 ★★★★☆</option>
                    <option value="3">3 ★★★☆☆</option>
                    <option value="2">2 ★★☆☆☆</option>
                    <option value="1">1 ★☆☆☆☆</option>
                  </select>
                </div>
                <textarea id="review-comment-input" class="form-control" placeholder="Share your experience with this item..." rows="2" style="width: 100%; margin-bottom: 10px;"></textarea>
                <button class="btn btn-outline btn-sm" onclick="window.submitReview(${prod.id})">Submit Review</button>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      productModalBody.innerHTML = `<div style="color: var(--danger); text-align: center; padding: 40px;">Could not load product details.</div>`;
    }
  };

  window.switchGalleryThumb = (imgUrl, thumbEl) => {
    const mainImg = document.getElementById('main-gallery-img');
    if (mainImg) mainImg.src = window.formatProductImageUrl(imgUrl);
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
  };

  window.changeModalQty = (delta, maxStock = 99) => {
    const input = document.getElementById('modal-qty-input');
    if (!input) return;
    let val = parseInt(input.value, 10) + delta;
    if (val < 1) val = 1;
    if (val > maxStock) val = maxStock;
    input.value = val;
  };

  window.addModalProductToCart = (id) => {
    const qty = parseInt(document.getElementById('modal-qty-input').value, 10) || 1;
    const prod = currentProducts.find(p => p.id === id);
    if (prod) {
      try {
        State.addToCart(prod, qty);
        showToast(`Added ${qty}x ${prod.title} to your cart!`, 'success');
        if (productModal) productModal.classList.remove('open');
        openCartDrawer();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  };

  window.buyNowDirect = (id) => {
    window.addModalProductToCart(id);
    closeCartDrawer();
    openCheckoutModal();
  };

  window.submitReview = async (id) => {
    const name = document.getElementById('review-name-input').value;
    const rating = document.getElementById('review-rating-select').value;
    const comment = document.getElementById('review-comment-input').value;

    if (!name || !comment) {
      return showToast('Please enter your name and a comment.', 'error');
    }

    try {
      await api.products.addReview(id, { userName: name, rating, comment });
      showToast('Thank you for your review!', 'success');
      window.openProductModal(id);
      loadProducts();
    } catch (err) {
      showToast('Could not submit review.', 'error');
    }
  };

  // --------------------------------------------------------------------------
  // 6. Cart Drawer & Global Cart Interactions
  // --------------------------------------------------------------------------
  const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartCountBadge = document.getElementById('cart-count-badge');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const checkoutTriggerBtn = document.getElementById('checkout-trigger-btn');

  const openCartDrawer = () => {
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.add('open');
  };
  const closeCartDrawer = () => {
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.remove('open');
  };

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);

  window.handleAddToCart = (id) => {
    const prod = currentProducts.find(p => p.id === id);
    if (prod) {
      try {
        State.addToCart(prod, 1);
        showToast(`Added "${prod.title}" to cart!`, 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  window.handleWishlistToggle = (id) => {
    const added = State.toggleWishlist(id);
    showToast(added ? 'Saved to wishlist!' : 'Removed from wishlist', 'info');
    renderProducts(currentProducts);
  };

  const renderCartUI = () => {
    const totals = State.getCartTotals();

    // Badge
    if (cartCountBadge) {
      cartCountBadge.textContent = totals.itemCount;
      cartCountBadge.style.display = totals.itemCount > 0 ? 'flex' : 'none';
    }

    // Shipping Progress
    const shippingProgressWrap = document.getElementById('shipping-progress-banner');
    if (shippingProgressWrap) {
      if (totals.subtotal === 0) {
        shippingProgressWrap.style.display = 'none';
      } else {
        shippingProgressWrap.style.display = 'block';
        const freeGoal = 499.00;
        const remaining = Math.max(0, freeGoal - totals.subtotal);
        const percent = Math.min(100, (totals.subtotal / freeGoal) * 100);

        const progFill = document.getElementById('shipping-progress-fill');
        const progText = document.getElementById('shipping-progress-text');

        if (progFill) progFill.style.width = `${percent}%`;
        if (progText) {
          if (remaining === 0 || (State.activeCoupon && State.activeCoupon.code === 'FREESHIP')) {
            progText.innerHTML = `🎉 <strong>Congratulations!</strong> You get <strong>Free Shipping</strong>!`;
          } else {
            progText.innerHTML = `Add <strong>${formatCurrency(remaining)}</strong> more to unlock <strong>Free Shipping</strong>!`;
          }
        }
      }
    }

    // Items Container
    if (!cartItemsContainer) return;

    if (State.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="catalog-empty" style="padding: 40px 10px;">
          <div class="catalog-empty-icon">🛒</div>
          <h4>Your Cart is Empty</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">Browse our store and add items to your cart!</p>
          <button class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="document.getElementById('cart-close-btn').click()">
            Start Shopping
          </button>
        </div>
      `;
      if (checkoutTriggerBtn) checkoutTriggerBtn.disabled = true;
    } else {
      if (checkoutTriggerBtn) checkoutTriggerBtn.disabled = false;
      cartItemsContainer.innerHTML = State.cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${window.formatProductImageUrl(item.image)}" alt="${item.title}" onerror="this.onerror=null; this.src=window.getProductFallbackImage(${item.id}, '${item.category}');" />
          </div>
          <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
            <div class="cart-item-actions">
              <div class="quantity-control" style="transform: scale(0.85); transform-origin: left;">
                <button class="qty-btn" onclick="State.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="text" class="qty-input" value="${item.quantity}" readonly />
                <button class="qty-btn" onclick="State.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
              </div>
              <button class="cart-remove-btn" onclick="State.removeFromCart(${item.id})">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Totals
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const discountRow = document.getElementById('cart-discount-row');
    const discountEl = document.getElementById('cart-discount-val');
    const taxEl = document.getElementById('cart-tax-val');
    const shippingEl = document.getElementById('cart-shipping-val');
    const grandTotalEl = document.getElementById('cart-grand-total-val');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (taxEl) taxEl.textContent = formatCurrency(totals.tax);
    if (shippingEl) shippingEl.textContent = totals.shippingFee === 0 ? 'FREE' : formatCurrency(totals.shippingFee);
    if (grandTotalEl) grandTotalEl.textContent = formatCurrency(totals.total);

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-${formatCurrency(totals.discount)} (${State.activeCoupon.label})`;
      } else {
        discountRow.style.display = 'none';
      }
    }
  };

  // Apply Coupon
  const couponApplyBtn = document.getElementById('coupon-apply-btn');
  const couponInput = document.getElementById('coupon-input');
  if (couponApplyBtn && couponInput) {
    couponApplyBtn.addEventListener('click', () => {
      const code = couponInput.value;
      const res = State.applyCoupon(code);
      if (res.success) {
        showToast(res.message, 'success');
        couponInput.value = '';
      } else {
        showToast(res.message, 'error');
      }
    });
  }

  window.addEventListener('techstore:cart_updated', renderCartUI);
  renderCartUI();

  // --------------------------------------------------------------------------
  // 7. Multi-Step Checkout Modal
  // --------------------------------------------------------------------------
  const checkoutModal = document.getElementById('checkout-modal');
  const openCheckoutModal = () => {
    if (State.cart.length === 0) {
      return showToast('Your cart is empty. Add items first!', 'error');
    }
    if (checkoutModal) {
      checkoutModal.classList.add('open');
      setCheckoutStep(1);
      prefillCheckoutForm();
    }
  };
  const closeCheckoutModal = () => {
    if (checkoutModal) checkoutModal.classList.remove('open');
  };

  if (checkoutTriggerBtn) {
    checkoutTriggerBtn.addEventListener('click', () => {
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  const setCheckoutStep = (step) => {
    document.querySelectorAll('.checkout-step-pane').forEach((pane, idx) => {
      pane.style.display = (idx + 1 === step) ? 'block' : 'none';
    });

    document.querySelectorAll('.step-indicator').forEach((ind, idx) => {
      const num = idx + 1;
      ind.classList.remove('active', 'completed');
      if (num === step) ind.classList.add('active');
      else if (num < step) ind.classList.add('completed');
    });

    if (step === 3) {
      renderCheckoutReview();
    }
  };

  const prefillCheckoutForm = () => {
    if (State.user) {
      const nameInput = document.getElementById('checkout-name');
      const emailInput = document.getElementById('checkout-email');
      if (nameInput && !nameInput.value) nameInput.value = State.user.name;
      if (emailInput && !emailInput.value) emailInput.value = State.user.email;
    }
  };

  // Step 1 -> Step 2
  const toStep2Btn = document.getElementById('to-step-2-btn');
  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', () => {
      const name = document.getElementById('checkout-name').value.trim();
      const email = document.getElementById('checkout-email').value.trim();
      const address = document.getElementById('checkout-address').value.trim();
      const city = document.getElementById('checkout-city').value.trim();
      const zip = document.getElementById('checkout-zip').value.trim();

      if (!name || !email || !address || !city || !zip) {
        return showToast('Please fill in your name, email, street address, city, and ZIP code.', 'error');
      }

      setCheckoutStep(2);
    });
  }

  // Step 2 -> Step 3
  const toStep3Btn = document.getElementById('to-step-3-btn');
  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', () => setCheckoutStep(3));
  }

  // Back buttons
  const backToStep1Btn = document.getElementById('back-to-step-1-btn');
  if (backToStep1Btn) backToStep1Btn.addEventListener('click', () => setCheckoutStep(1));

  const backToStep2Btn = document.getElementById('back-to-step-2-btn');
  if (backToStep2Btn) backToStep2Btn.addEventListener('click', () => setCheckoutStep(2));

  // Payment Selection
  let selectedPaymentMethod = 'credit_card';
  document.querySelectorAll('.payment-method-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPaymentMethod = card.dataset.method;

      const cardFields = document.getElementById('card-fields-group');
      if (cardFields) {
        cardFields.style.display = selectedPaymentMethod === 'credit_card' ? 'block' : 'none';
      }
    });
  });

  // Card Live Preview
  const cardNumInput = document.getElementById('card-number-input');
  const cardHolderInput = document.getElementById('card-holder-input');
  const cardExpiryInput = document.getElementById('card-expiry-input');

  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      val = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = val;
      const preview = document.getElementById('card-number-preview');
      if (preview) preview.textContent = val || '•••• •••• •••• ••••';
    });
  }

  if (cardHolderInput) {
    cardHolderInput.addEventListener('input', (e) => {
      const preview = document.getElementById('card-holder-preview');
      if (preview) preview.textContent = e.target.value.toUpperCase() || 'YOUR NAME';
    });
  }

  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
      e.target.value = val;
      const preview = document.getElementById('card-expiry-preview');
      if (preview) preview.textContent = val || 'MM/YY';
    });
  }

  const renderCheckoutReview = () => {
    const reviewItemsWrap = document.getElementById('checkout-review-items');
    const reviewTotalsWrap = document.getElementById('checkout-review-totals');
    const totals = State.getCartTotals();

    if (reviewItemsWrap) {
      reviewItemsWrap.innerHTML = State.cart.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.9rem;">
          <div>
            <strong>${item.title}</strong>
            <span style="color: var(--text-muted); margin-left: 8px;">x${item.quantity}</span>
          </div>
          <span style="font-weight: 700;">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join('');
    }

    if (reviewTotalsWrap) {
      reviewTotalsWrap.innerHTML = `
        <div class="cart-totals-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(totals.subtotal)}</span>
        </div>
        ${totals.discount > 0 ? `
          <div class="cart-totals-row" style="color: var(--success);">
            <span>Discount (${State.activeCoupon.code}):</span>
            <span>-${formatCurrency(totals.discount)}</span>
          </div>
        ` : ''}
        <div class="cart-totals-row">
          <span>Estimated GST (18%):</span>
          <span>${formatCurrency(totals.tax)}</span>
        </div>
        <div class="cart-totals-row">
          <span>Shipping:</span>
          <span>${totals.shippingFee === 0 ? 'FREE' : formatCurrency(totals.shippingFee)}</span>
        </div>
        <div class="cart-totals-row grand-total">
          <span>Total:</span>
          <span style="color: var(--accent-cyan);">${formatCurrency(totals.total)}</span>
        </div>
      `;
    }
  };

  // Place Order Action
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', async () => {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `<span>Placing Your Order...</span>`;

      const payload = {
        customerName: document.getElementById('checkout-name').value.trim(),
        customerEmail: document.getElementById('checkout-email').value.trim(),
        customerPhone: document.getElementById('checkout-phone').value.trim(),
        shippingAddress: {
          address: document.getElementById('checkout-address').value.trim(),
          city: document.getElementById('checkout-city').value.trim(),
          state: document.getElementById('checkout-state').value.trim(),
          zip: document.getElementById('checkout-zip').value.trim(),
          country: document.getElementById('checkout-country').value.trim()
        },
        paymentMethod: selectedPaymentMethod,
        items: State.cart.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        discountCode: State.activeCoupon ? State.activeCoupon.code : null
      };

      try {
        const res = await api.orders.create(payload);
        closeCheckoutModal();
        State.clearCart();

        openOrderConfirmationModal(res.order);
        showToast('Your order has been placed!', 'success');
      } catch (err) {
        showToast(err.message || 'Could not process order.', 'error');
      } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = `<span>Place Order</span>`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. Order Confirmation Modal
  // --------------------------------------------------------------------------
  const orderConfirmationModal = document.getElementById('order-confirmation-modal');
  const openOrderConfirmationModal = (order) => {
    if (!orderConfirmationModal) return;
    orderConfirmationModal.classList.add('open');

    const numEl = document.getElementById('confirm-order-number');
    const emailEl = document.getElementById('confirm-order-email');
    const totalEl = document.getElementById('confirm-order-total');
    const printBtn = document.getElementById('print-receipt-btn');

    if (numEl) numEl.textContent = order.orderNumber || order.order_number;
    if (emailEl) emailEl.textContent = order.customerEmail || order.customer_email;
    if (totalEl) totalEl.textContent = formatCurrency(order.total);

    if (printBtn) {
      printBtn.onclick = () => window.print();
    }
  };

  // --------------------------------------------------------------------------
  // 9. Order Tracking System
  // --------------------------------------------------------------------------
  const trackingModal = document.getElementById('tracking-modal');
  const trackingInput = document.getElementById('tracking-search-input');
  const trackingSubmitBtn = document.getElementById('tracking-search-btn');
  const trackingResultWrap = document.getElementById('tracking-result-wrap');

  const trackOrder = async (orderNumber) => {
    if (!trackingModal) return;
    trackingModal.classList.add('open');
    if (trackingInput) trackingInput.value = orderNumber;

    if (trackingResultWrap) {
      trackingResultWrap.innerHTML = `<div style="text-align: center; padding: 30px;">Finding order ${orderNumber}...</div>`;
    }

    try {
      const res = await api.orders.getByNumber(orderNumber);
      const order = res.order;

      const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
      const currentIdx = steps.indexOf(order.status || 'Processing');

      trackingResultWrap.innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div>
              <h3 style="font-size: 1.15rem; color: var(--accent-cyan);">${order.order_number || order.orderNumber}</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Placed on ${new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
            <span class="badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-cyan'}">${order.status || 'Processing'}</span>
          </div>

          <div class="tracking-timeline">
            ${steps.map((step, idx) => `
              <div class="timeline-step ${idx === currentIdx ? 'active' : ''} ${idx < currentIdx ? 'completed' : ''}">
                <div class="timeline-dot">${idx < currentIdx ? '✓' : idx + 1}</div>
                <span class="step-label">${step}</span>
              </div>
            `).join('')}
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 16px; font-size: 0.88rem;">
            <div style="margin-bottom: 8px;"><strong>Customer:</strong> ${order.customer_name || order.customerName}</div>
            <div style="margin-bottom: 8px;"><strong>Delivery to:</strong> ${order.shipping_address ? (order.shipping_address.address || 'Standard Address') : 'Saved address'}</div>
            <div><strong>Items:</strong> ${(order.items || []).map(it => `${it.quantity}x ${it.title}`).join(', ')}</div>
          </div>
        </div>
      `;
    } catch (err) {
      if (trackingResultWrap) {
        trackingResultWrap.innerHTML = `
          <div style="text-align: center; padding: 30px; color: var(--danger);">
            Order not found. Please double-check the order number (e.g., ORD-2025-10492).
          </div>
        `;
      }
    }
  };

  if (trackingSubmitBtn && trackingInput) {
    trackingSubmitBtn.addEventListener('click', () => {
      const num = trackingInput.value.trim();
      if (num) trackOrder(num);
    });
  }

  // Modal Closers
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
  });

  const navTrackBtn = document.getElementById('nav-track-btn');
  if (navTrackBtn && trackingModal) {
    navTrackBtn.addEventListener('click', () => {
      trackingModal.classList.add('open');
    });
  }

  // --------------------------------------------------------------------------
  // 10. Boot Application
  // --------------------------------------------------------------------------
  await checkCurrentUser();
  await loadProducts();
});
