/**
 * TechStore - Frontend Application Logic
 * Integrates Modern Gemini AI Assistant, Seller Portal & Marketplace,
 * Product Variant Pickers, Low-Stock Urgency Indicators, and Verified Checkout.
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
  // Fallback Product Images
  // --------------------------------------------------------------------------
  window.PRODUCT_FALLBACK_IMAGES = {
    1: 'images/products/sony_wh1000xm4.jpg',
    2: 'images/products/apple_airpods_pro.jpg',
    3: 'images/products/apple_watch_s9.jpg',
    4: 'images/products/keychron_k2.jpg',
    5: 'images/products/sony_ps5_console.jpg',
    6: 'images/products/apple_iphone_15_pro.jpg',
    7: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    31: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    32: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    33: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    34: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    35: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    36: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80',
    37: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80'
  };

  window.CATEGORY_FALLBACK_IMAGES = {
    'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'Peripherals': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1609592426508-410a6d59ce6b?auto=format&fit=crop&w=800&q=80',
    'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'Phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'Monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'TVs': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    'Gaming': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'
  };

  window.getProductFallbackImage = function(id, category) {
    if (id && window.PRODUCT_FALLBACK_IMAGES[id]) return window.PRODUCT_FALLBACK_IMAGES[id];
    if (category && window.CATEGORY_FALLBACK_IMAGES[category]) return window.CATEGORY_FALLBACK_IMAGES[category];
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  };

  window.formatProductImageUrl = function(url) {
    if (!url) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    if (url.startsWith('/images/')) return url.substring(1);
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
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  };
  window.showToast = showToast;

  // --------------------------------------------------------------------------
  // 2. Theme Switcher
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const initTheme = () => {
    const saved = localStorage.getItem('techstore_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    if (themeToggleBtn) themeToggleBtn.textContent = saved === 'dark' ? '☀️' : '🌙';
  };
  initTheme();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('techstore_theme', next);
      themeToggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  // --------------------------------------------------------------------------
  // 3. User Authentication & Seller Navigation
  // --------------------------------------------------------------------------
  const authNavWrapper = document.getElementById('auth-nav-wrapper');
  const authModal = document.getElementById('auth-modal');
  const userOrdersModal = document.getElementById('user-orders-modal');
  const navSellerBtn = document.getElementById('nav-seller-btn');

  const checkCurrentUser = async () => {
    if (State.token || State.user) {
      try {
        const res = await api.auth.getMe();
        State.user = res.user;
      } catch (err) {
        // Fallback to local stored user
        const local = JSON.parse(localStorage.getItem('techstore_user') || 'null');
        if (local) State.user = local;
      }
    }
    renderNavUser();
  };

  const renderNavUser = () => {
    if (!authNavWrapper) return;

    if (State.user && State.user.email) {
      const isSeller = State.user.role === 'seller';
      const displayName = isSeller ? (State.user.seller_name || State.user.name) : State.user.name.split(' ')[0];

      authNavWrapper.innerHTML = `
        <div class="user-menu-pill" id="user-menu-btn" title="View Account & Orders">
          <div class="user-avatar-circle" style="${isSeller ? 'background: linear-gradient(135deg, #10b981, #06b6d4);' : ''}">
            ${isSeller ? '🏪' : displayName.charAt(0).toUpperCase()}
          </div>
          <span class="user-name-text">${displayName}</span>
          ${isSeller ? `<span style="font-size: 0.68rem; background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 2px 6px; border-radius: 9999px; font-weight: 700;">Seller</span>` : ''}
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

    // Toggle seller button status
    if (navSellerBtn) {
      if (State.isSeller()) {
        navSellerBtn.innerHTML = `<span>🏪 My Seller Hub</span>`;
        navSellerBtn.style.borderColor = 'var(--accent-cyan)';
        navSellerBtn.style.color = 'var(--accent-cyan)';
      } else {
        navSellerBtn.innerHTML = `<span>🏪 Become a Seller</span>`;
        navSellerBtn.style.borderColor = 'var(--border-subtle)';
        navSellerBtn.style.color = 'var(--text-secondary)';
      }
    }
  };

  const openAuthModal = () => {
    if (authModal) authModal.classList.add('open');
  };
  const closeAuthModal = () => {
    if (authModal) authModal.classList.remove('open');
  };
  window.openAuthModal = openAuthModal;

  // Sign In / Register Tab Toggle
  const loginTabBtn = document.getElementById('tab-login-btn');
  const registerTabBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const regIsSeller = document.getElementById('reg-is-seller');
  const sellerExtraFields = document.getElementById('seller-extra-fields');

  if (loginTabBtn && registerTabBtn) {
    loginTabBtn.addEventListener('click', () => {
      loginTabBtn.classList.add('active');
      registerTabBtn.classList.remove('active');
      if (loginForm) loginForm.style.display = 'block';
      if (registerForm) registerForm.style.display = 'none';
    });

    registerTabBtn.addEventListener('click', () => {
      registerTabBtn.classList.add('active');
      loginTabBtn.classList.remove('active');
      if (registerForm) registerForm.style.display = 'block';
      if (loginForm) loginForm.style.display = 'none';
    });
  }

  if (regIsSeller && sellerExtraFields) {
    regIsSeller.addEventListener('change', () => {
      sellerExtraFields.style.display = regIsSeller.checked ? 'block' : 'none';
    });
  }

  // Fast Demo Logins
  const demoBuyerBtn = document.getElementById('demo-buyer-btn');
  const demoSeller1Btn = document.getElementById('demo-seller1-btn');
  const demoSeller2Btn = document.getElementById('demo-seller2-btn');
  const demoSeller3Btn = document.getElementById('demo-seller3-btn');

  const performQuickLogin = async (email, password = 'password123') => {
    try {
      const res = await api.auth.login({ email, password });
      State.setUser(res.user, res.token);
      renderNavUser();
      closeAuthModal();
      showToast(res.message || `Logged in as ${res.user.name}!`, 'success');
      loadProducts();
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  if (demoBuyerBtn) demoBuyerBtn.addEventListener('click', () => performQuickLogin('demo@techstore.com'));
  if (demoSeller1Btn) demoSeller1Btn.addEventListener('click', () => performQuickLogin('seller.apex@techstore.com'));
  if (demoSeller2Btn) demoSeller2Btn.addEventListener('click', () => performQuickLogin('seller.nordic@techstore.com'));
  if (demoSeller3Btn) demoSeller3Btn.addEventListener('click', () => performQuickLogin('seller.aura@techstore.com'));

  // Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const res = await api.auth.login({ email, password });
        State.setUser(res.user, res.token);
        renderNavUser();
        closeAuthModal();
        showToast(res.message || 'Welcome back!', 'success');
        loadProducts();
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
      const isSeller = regIsSeller ? regIsSeller.checked : false;
      const sellerName = document.getElementById('reg-seller-name')?.value;
      const sellerBio = document.getElementById('reg-seller-bio')?.value;

      try {
        const res = await api.auth.register({
          name,
          email,
          password,
          role: isSeller ? 'seller' : 'customer',
          sellerName: isSeller ? sellerName : null,
          sellerBio: isSeller ? sellerBio : null
        });

        State.setUser(res.user, res.token);
        renderNavUser();
        closeAuthModal();
        showToast(res.message || 'Your account is ready! Welcome!', 'success');
        if (isSeller) {
          openSellerModal();
        }
      } catch (err) {
        showToast(err.message || 'Could not create account.', 'error');
      }
    });
  }

  // Logout Handler
  const handleLogout = () => {
    State.logout();
    renderNavUser();
    if (userOrdersModal) userOrdersModal.classList.remove('open');
    showToast('You have been signed out.', 'info');
  };

  // Past Orders & Account Modal
  const openUserOrdersModal = async () => {
    if (!userOrdersModal) return;
    userOrdersModal.classList.add('open');

    const userInfoWrap = document.getElementById('user-modal-profile-info');
    const ordersListWrap = document.getElementById('user-modal-orders-list');

    if (userInfoWrap && State.user) {
      const isSeller = State.user.role === 'seller';
      userInfoWrap.innerHTML = `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="user-avatar-circle" style="width: 48px; height: 48px; font-size: 1.3rem; ${isSeller ? 'background: linear-gradient(135deg, #10b981, #06b6d4);' : ''}">
                ${isSeller ? '🏪' : State.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style="font-size: 1.15rem; margin-bottom: 2px;">
                  ${State.user.name} ${isSeller ? `(${State.user.seller_name || 'Merchant'})` : ''}
                </h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${State.user.email}</p>
                <span class="badge ${isSeller ? 'badge-success' : 'badge-cyan'}" style="margin-top: 4px;">
                  ${isSeller ? '★ Verified Merchant Seller' : 'Verified Customer Account'}
                </span>
              </div>
            </div>
            
            <div style="display: flex; gap: 8px;">
              ${!isSeller ? `
                <button class="btn btn-primary btn-sm" id="upgrade-to-seller-btn">
                  🚀 Become a Seller
                </button>
              ` : `
                <button class="btn btn-primary btn-sm" id="open-hub-from-profile-btn">
                  🏪 Open Seller Hub
                </button>
              `}
              <button class="btn btn-outline btn-sm" id="logout-btn">Log Out</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('logout-btn').addEventListener('click', handleLogout);

      const upgradeBtn = document.getElementById('upgrade-to-seller-btn');
      if (upgradeBtn) {
        upgradeBtn.addEventListener('click', async () => {
          userOrdersModal.classList.remove('open');
          const storeName = prompt('Enter your Store / Brand Name for selling on TechStore:', `${State.user.name}'s Tech Store`);
          if (storeName && storeName.trim()) {
            try {
              const res = await api.auth.becomeSeller({ sellerName: storeName.trim() });
              State.setUser(res.user, State.token);
              renderNavUser();
              showToast(res.message || 'You are now a registered seller!', 'success');
              openSellerModal();
            } catch (err) {
              showToast('Could not register seller account.', 'error');
            }
          }
        });
      }

      const openHubBtn = document.getElementById('open-hub-from-profile-btn');
      if (openHubBtn) {
        openHubBtn.addEventListener('click', () => {
          userOrdersModal.classList.remove('open');
          openSellerModal();
        });
      }
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
              <h4>No orders placed yet</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">Your placed orders will show up here with tracking.</p>
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
                  ${items.map(it => `<div>• ${it.quantity}x ${it.title} ${it.selected_variant ? `<span style="font-size: 0.76rem; color: var(--text-muted);">(${it.selected_variant})</span>` : ''}</div>`).join('')}
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
  // 4. Seller Hub Dashboard Modal Logic
  // --------------------------------------------------------------------------
  const sellerPortalModal = document.getElementById('seller-portal-modal');
  const sellerTabListingsBtn = document.getElementById('seller-tab-listings-btn');
  const sellerTabCreateBtn = document.getElementById('seller-tab-create-btn');
  const sellerPaneListings = document.getElementById('seller-pane-listings');
  const sellerPaneCreate = document.getElementById('seller-pane-create');
  const createProductForm = document.getElementById('create-product-form');

  const openSellerModal = async () => {
    if (!State.isLoggedIn()) {
      showToast('Please sign in or create an account to access the Seller Hub.', 'info');
      openAuthModal();
      return;
    }

    if (!State.isSeller()) {
      const wantSell = confirm('You currently have a Buyer account. Would you like to upgrade to a Seller account right now?');
      if (wantSell) {
        const storeName = prompt('Enter your Store / Brand Name:', `${State.user.name}'s Tech Store`);
        if (storeName) {
          await api.auth.becomeSeller({ sellerName: storeName.trim() });
          State.user.role = 'seller';
          State.user.seller_name = storeName;
          renderNavUser();
          showToast(`Welcome Merchant ${storeName}!`, 'success');
        } else {
          return;
        }
      } else {
        return;
      }
    }

    if (sellerPortalModal) {
      sellerPortalModal.classList.add('open');
      document.getElementById('seller-portal-heading').textContent = State.user.seller_name || `${State.user.name}'s Merchant Hub`;
      loadSellerListings();
    }
  };

  if (navSellerBtn) {
    navSellerBtn.addEventListener('click', openSellerModal);
  }

  if (sellerTabListingsBtn && sellerTabCreateBtn) {
    sellerTabListingsBtn.addEventListener('click', () => {
      sellerTabListingsBtn.classList.add('active');
      sellerTabCreateBtn.classList.remove('active');
      sellerPaneListings.style.display = 'block';
      sellerPaneCreate.style.display = 'none';
      loadSellerListings();
    });

    sellerTabCreateBtn.addEventListener('click', () => {
      sellerTabCreateBtn.classList.add('active');
      sellerTabListingsBtn.classList.remove('active');
      sellerPaneCreate.style.display = 'block';
      sellerPaneListings.style.display = 'none';
    });
  }

  // Load and render seller's listed items
  const loadSellerListings = async () => {
    const tableWrap = document.getElementById('seller-listings-table-wrap');
    if (!tableWrap) return;

    tableWrap.innerHTML = `<div style="text-align: center; padding: 30px;">Loading your products...</div>`;

    try {
      const res = await api.products.getSellerListings();
      const products = res.products || [];

      // Update stat counters
      document.getElementById('seller-stat-products').textContent = products.length;
      const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
      document.getElementById('seller-stat-stock').textContent = totalStock;
      document.getElementById('seller-stat-rating').textContent = (State.user.seller_rating || 5.0) + ' ★';

      if (products.length === 0) {
        tableWrap.innerHTML = `
          <div class="catalog-empty" style="padding: 30px;">
            <div class="catalog-empty-icon">🏪</div>
            <h4>No active product listings</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">Click "List New Product for Sale" to publish your first item on the store!</p>
            <button class="btn btn-primary btn-sm" style="margin-top: 12px;" onclick="document.getElementById('seller-tab-create-btn').click();">
              List a Product
            </button>
          </div>
        `;
        return;
      }

      tableWrap.innerHTML = `
        <table class="seller-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Live Stock</th>
              <th>Rating</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${window.formatProductImageUrl(p.image)}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;" onerror="this.src=window.getProductFallbackImage(${p.id}, '${p.category}')" />
                    <div>
                      <div style="font-weight: 700; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                      <div style="font-size: 0.74rem; color: var(--text-muted);">${p.slug}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-cyan" style="font-size: 0.75rem;">${p.category}</span></td>
                <td><strong>${formatCurrency(p.price)}</strong></td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <button class="stock-counter-btn" onclick="window.updateStockFromHub(${p.id}, ${Math.max(0, p.stock - 1)})">-</button>
                    <span style="font-weight: 700; min-width: 24px; text-align: center; color: ${p.stock <= 5 ? (p.stock === 0 ? 'var(--danger)' : '#f59e0b') : 'var(--success)'};">${p.stock}</span>
                    <button class="stock-counter-btn" onclick="window.updateStockFromHub(${p.id}, ${p.stock + 1})">+</button>
                  </div>
                </td>
                <td>★ ${p.rating || 5.0}</td>
                <td style="text-align: right;">
                  <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3); padding: 4px 8px; font-size: 0.78rem;" onclick="window.deleteProductListing(${p.id})">
                    Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      tableWrap.innerHTML = `<div style="color: var(--danger); padding: 20px; text-align: center;">Failed to load seller listings.</div>`;
    }
  };

  window.updateStockFromHub = async (id, newStock) => {
    try {
      await api.products.updateStock(id, newStock);
      showToast(`Stock updated to ${newStock}!`, 'success');
      loadSellerListings();
      loadProducts();
    } catch (err) {
      showToast('Could not update stock.', 'error');
    }
  };

  window.deleteProductListing = async (id) => {
    if (!confirm('Are you sure you want to remove this listing from the marketplace?')) return;
    try {
      await api.products.deleteListing(id);
      showToast('Product unlisted from marketplace.', 'info');
      loadSellerListings();
      loadProducts();
    } catch (err) {
      showToast('Could not delete listing.', 'error');
    }
  };

  // Image Preset buttons
  document.querySelectorAll('.preset-img-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      const input = document.getElementById('new-prod-image');
      if (input) input.value = url;
    });
  });

  // Submit New Listing
  if (createProductForm) {
    createProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('new-prod-title').value.trim();
      const category = document.getElementById('new-prod-category').value;
      const price = document.getElementById('new-prod-price').value;
      const originalPrice = document.getElementById('new-prod-original-price').value;
      const stock = document.getElementById('new-prod-stock').value;
      const image = document.getElementById('new-prod-image').value.trim();
      const rawColors = document.getElementById('new-prod-colors').value.trim();
      const rawOptions = document.getElementById('new-prod-options').value.trim();
      const shortDesc = document.getElementById('new-prod-short-desc').value.trim();
      const desc = document.getElementById('new-prod-desc').value.trim();

      // Format variants
      const colors = rawColors ? rawColors.split(',').map(c => {
        const name = c.trim();
        let hex = '#3b82f6';
        if (name.toLowerCase().includes('black')) hex = '#18181b';
        else if (name.toLowerCase().includes('white')) hex = '#f8fafc';
        else if (name.toLowerCase().includes('silver') || name.toLowerCase().includes('gray')) hex = '#9ca3af';
        else if (name.toLowerCase().includes('blue')) hex = '#2563eb';
        else if (name.toLowerCase().includes('red')) hex = '#ef4444';
        else if (name.toLowerCase().includes('green')) hex = '#10b981';
        return { name, hex };
      }) : [{ name: 'Default', hex: '#06b6d4' }];

      const options = rawOptions ? rawOptions.split(',').map(o => o.trim()) : ['Standard'];

      const variants = { colors, options };

      try {
        const res = await api.products.createListing({
          title,
          category,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          stock: Number(stock),
          image: image || null,
          variants,
          shortDescription: shortDesc,
          description: desc
        });

        showToast(res.message || 'Product published to store successfully!', 'success');
        createProductForm.reset();
        document.getElementById('seller-tab-listings-btn').click();
        loadProducts();
      } catch (err) {
        showToast(err.message || 'Could not list product.', 'error');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Product Catalog & Filtering (Sellers, Stock Urgency, Categories)
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
  const lowStockCheckbox = document.getElementById('low-stock-checkbox');
  const sellerFilterSelect = document.getElementById('seller-filter-select');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');

  let currentProducts = [];

  const loadProducts = async () => {
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div class="catalog-empty" style="grid-column: 1 / -1;">
          <div class="catalog-empty-icon" style="animation: spin 1s infinite linear;">⚡</div>
          <h4>Loading marketplace catalog...</h4>
        </div>
      `;
    }

    try {
      const res = await api.products.getAll({
        category: State.filters.category,
        sellerId: State.filters.sellerId,
        search: State.filters.search,
        maxPrice: State.filters.maxPrice,
        sort: State.filters.sort,
        inStockOnly: State.filters.inStockOnly
      });

      let products = res.products || [];

      if (lowStockCheckbox && lowStockCheckbox.checked) {
        products = products.filter(p => p.stock > 0 && p.stock <= 5);
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
      resultsCountEl.innerHTML = `Showing <span>${products.length}</span> marketplace products`;
    }

    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="catalog-empty" style="grid-column: 1 / -1;">
          <div class="catalog-empty-icon">🔍</div>
          <h3>No products match your search</h3>
          <p style="color: var(--text-muted); margin-top: 8px;">Try clearing filters or checking for typos.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" id="reset-empty-btn">Reset All Filters</button>
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

      const sellerName = prod.seller?.name || prod.seller_name || 'Apex Tech & Audio';
      const sellerRating = prod.seller?.rating || prod.seller_rating || 4.9;

      // Stock badge
      let stockBadgeHtml = '';
      if (prod.stock === 0) {
        stockBadgeHtml = `<span class="stock-badge stock-badge-out">⚠️ Out of Stock</span>`;
      } else if (prod.stock <= 5) {
        stockBadgeHtml = `<span class="stock-badge stock-badge-low">⚡ Only ${prod.stock} left!</span>`;
      } else {
        stockBadgeHtml = `<span class="stock-badge stock-badge-in">✓ In Stock</span>`;
      }

      // Color preview dots
      const colors = prod.variants?.colors || [];
      const colorDotsHtml = colors.length > 0 ? `
        <div style="display: flex; gap: 4px; margin-top: 6px;">
          ${colors.slice(0, 4).map(c => `<span style="width: 10px; height: 10px; border-radius: 50%; background: ${c.hex}; border: 1px solid rgba(255,255,255,0.2);" title="${c.name}"></span>`).join('')}
          ${colors.length > 4 ? `<span style="font-size: 0.7rem; color: var(--text-muted);">+${colors.length - 4}</span>` : ''}
        </div>
      ` : '';

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
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="product-category">${prod.category}</span>
              ${stockBadgeHtml}
            </div>

            <h4 class="product-title" onclick="window.openProductModal(${prod.id})">${prod.title}</h4>
            
            <!-- Seller Chip -->
            <div class="seller-chip" onclick="event.stopPropagation(); window.filterBySeller(${prod.seller_id || prod.seller?.id || 1});" title="Filter products from this seller">
              <span>Sold by <strong>${sellerName}</strong></span>
              <span class="seller-rating-pill">★ ${sellerRating}</span>
            </div>

            <!-- Color Swatches Preview -->
            ${colorDotsHtml}

            <div class="product-rating" style="margin-top: 8px;">
              <span class="rating-stars">★ ${prod.rating ? prod.rating.toFixed(1) : '4.8'}</span>
              <span class="rating-count">(${prod.reviews_count || 12} reviews)</span>
            </div>

            <div class="product-footer" style="margin-top: 10px;">
              <div class="product-pricing">
                <span class="product-price">${formatCurrency(prod.price)}</span>
                ${prod.original_price ? `<span class="product-original-price">${formatCurrency(prod.original_price)}</span>` : ''}
              </div>

              <div style="display: flex; gap: 6px;">
                <button class="btn btn-outline btn-sm" title="Ask AI about this product" onclick="event.stopPropagation(); window.openAIAssistantForProduct(${prod.id});" style="padding: 4px 8px; border-color: rgba(6, 182, 212, 0.4); color: var(--accent-cyan);">
                  ✨ AI
                </button>
                <button class="btn btn-primary btn-sm add-to-cart-btn" 
                        ${prod.stock === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                        onclick="window.handleAddToCart(${prod.id})">
                  ${prod.stock === 0 ? 'Out of Stock' : '🛒 Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  window.filterBySeller = (sellerId) => {
    if (sellerFilterSelect) {
      sellerFilterSelect.value = String(sellerId);
      State.filters.sellerId = sellerId;
      loadProducts();
      showToast('Filtered products by selected merchant.', 'info');
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset Filters
  const resetFilters = () => {
    State.filters.category = 'All';
    State.filters.sellerId = null;
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
    if (lowStockCheckbox) lowStockCheckbox.checked = false;
    if (sellerFilterSelect) sellerFilterSelect.value = '';

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

  if (lowStockCheckbox) {
    lowStockCheckbox.addEventListener('change', loadProducts);
  }

  if (sellerFilterSelect) {
    sellerFilterSelect.addEventListener('change', (e) => {
      State.filters.sellerId = e.target.value ? Number(e.target.value) : null;
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
  // 6. Product Details Modal (Variants, Stock Urgency, AI Review & Price Insights)
  // --------------------------------------------------------------------------
  const productModal = document.getElementById('product-modal');
  const productModalBody = document.getElementById('product-modal-body');

  let activeModalSelectedColor = null;
  let activeModalSelectedOption = null;

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
      const variants = prod.variants || { colors: [], options: [] };
      const colors = variants.colors || [];
      const options = variants.options || [];

      activeModalSelectedColor = colors.length > 0 ? colors[0].name : null;
      activeModalSelectedOption = options.length > 0 ? options[0] : null;

      // Stock indicator
      let stockAlertHtml = '';
      if (prod.stock === 0) {
        stockAlertHtml = `<span class="stock-badge stock-badge-out" style="font-size: 0.85rem;">⚠️ Out of Stock</span>`;
      } else if (prod.stock <= 5) {
        stockAlertHtml = `<span class="stock-badge stock-badge-low" style="font-size: 0.85rem;">⚡ Only ${prod.stock} left in stock - order soon!</span>`;
      } else {
        stockAlertHtml = `<span class="stock-badge stock-badge-in" style="font-size: 0.85rem;">✓ In Stock (${prod.stock} available)</span>`;
      }

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
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="product-category">${prod.category}</span>
              ${stockAlertHtml}
            </div>

            <h2 style="font-size: 1.4rem; margin-bottom: 8px;">${prod.title}</h2>
            
            <!-- Seller Verified Card -->
            <div class="seller-profile-card">
              <div>
                <div style="font-size: 0.74rem; color: var(--text-muted); text-transform: uppercase;">Sold & Dispatched by</div>
                <strong style="color: var(--accent-cyan); font-size: 0.95rem;">${prod.seller?.name || prod.seller_name || 'Apex Tech & Audio'}</strong>
                <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                  ★ <strong>${prod.seller?.rating || prod.seller_rating || 4.9}</strong> (${(prod.seller?.reviews_count || 1480).toLocaleString()} merchant ratings) • Verified Merchant
                </div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="window.filterBySeller(${prod.seller_id || 1}); document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));">
                View Store
              </button>
            </div>

            <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
              <span style="font-size: 1.7rem; font-weight: 800; color: var(--accent-cyan);">${formatCurrency(prod.price)}</span>
              ${prod.original_price ? `<span style="font-size: 1rem; color: var(--text-muted); text-decoration: line-through;">${formatCurrency(prod.original_price)}</span>` : ''}
            </div>

            <!-- Color Variants Selection -->
            ${colors.length > 0 ? `
              <div class="variants-wrapper">
                <div class="variant-label">Color: <span id="selected-color-label" style="color: var(--accent-cyan); font-weight: 600;">${colors[0].name}</span></div>
                <div class="color-swatches-grid">
                  ${colors.map((c, idx) => `
                    <button class="color-swatch-btn ${idx === 0 ? 'selected' : ''}" 
                            style="background-color: ${c.hex};" 
                            title="${c.name}" 
                            data-color="${c.name}"
                            onclick="window.selectModalColor('${c.name}', this)">
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Size / Options Selection -->
            ${options.length > 0 && options[0] !== 'Standard' ? `
              <div class="variants-wrapper">
                <div class="variant-label">Configuration: <span id="selected-option-label" style="color: var(--accent-cyan); font-weight: 600;">${options[0]}</span></div>
                <div class="spec-pills-grid">
                  ${options.map((opt, idx) => `
                    <button class="spec-pill-btn ${idx === 0 ? 'selected' : ''}" 
                            data-option="${opt}"
                            onclick="window.selectModalOption('${opt}', this)">
                      ${opt}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <p style="color: var(--text-secondary); font-size: 0.95rem; margin: 16px 0; line-height: 1.6;">
              ${prod.description}
            </p>

            <!-- Quantity & Actions -->
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px; flex-wrap: wrap;">
              <div class="quantity-control">
                <button class="qty-btn" onclick="window.changeModalQty(-1)">-</button>
                <input type="text" class="qty-input" id="modal-qty-input" value="1" readonly />
                <button class="qty-btn" onclick="window.changeModalQty(1, ${prod.stock})">+</button>
              </div>

              <button class="btn btn-primary" ${prod.stock === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} onclick="window.addModalProductToCart(${prod.id})">
                ${prod.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button class="btn btn-secondary" ${prod.stock === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} onclick="window.buyNowDirect(${prod.id})">
                ⚡ Buy Now
              </button>
              <button class="btn btn-outline" onclick="window.openAIAssistantForProduct(${prod.id})" style="border-color: rgba(6, 182, 212, 0.4); color: var(--accent-cyan);">
                ✨ Ask Gemini AI
              </button>
            </div>

            <!-- AI Intelligence Insights Box -->
            <div class="ai-product-box">
              <div class="ai-product-box-header">
                <span class="ai-box-badge">✨ AI Shopping Intelligence</span>
                <span style="font-size: 0.74rem; color: var(--text-muted);">Powered by Gemini</span>
              </div>

              <div class="ai-product-tabs">
                <button class="ai-tab-btn active" id="modal-ai-tab-reviews" onclick="window.showModalAITab('reviews', ${prod.id})">
                  📝 Reviews (Pros & Cons)
                </button>
                <button class="ai-tab-btn" id="modal-ai-tab-price" onclick="window.showModalAITab('price', ${prod.id})">
                  📈 Price History & Deal Timing
                </button>
              </div>

              <div class="ai-tab-content" id="modal-ai-tab-content">
                <div style="display: flex; align-items: center; justify-content: center; padding: 20px;">
                  <span>Analyzing reviews & pricing with AI...</span>
                </div>
              </div>
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

            <!-- Customer Reviews Section with Pros & Cons -->
            <div style="margin-top: 32px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
              <h4 style="font-size: 1.05rem; margin-bottom: 14px;">Customer Reviews (${prod.reviews ? prod.reviews.length : 0})</h4>
              
              <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                ${prod.reviews && prod.reviews.length > 0 ? prod.reviews.map(r => `
                  <div style="background: var(--bg-tertiary); padding: 14px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                      <span style="font-weight: 700;">${r.user_name}</span>
                      <span style="color: #f59e0b;">${'★'.repeat(r.rating)}</span>
                    </div>
                    <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 8px;">${r.comment}</p>
                    ${r.pros ? `<div><span class="pro-chip">✓ Pros: ${r.pros}</span></div>` : ''}
                    ${r.cons ? `<div style="margin-top: 4px;"><span class="con-chip">⚠ Cons: ${r.cons}</span></div>` : ''}
                  </div>
                `).join('') : '<p style="color: var(--text-muted); font-size: 0.85rem;">No reviews yet. Be the first to leave one!</p>'}
              </div>

              <!-- Write Review Form -->
              <div style="background: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
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
                <textarea id="review-comment-input" class="form-control" placeholder="Share your experience with this item..." rows="2" style="width: 100%; margin-bottom: 8px;"></textarea>
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                  <input type="text" id="review-pros-input" placeholder="Pros (what you loved)" class="form-control" style="flex: 1; font-size: 0.85rem;" />
                  <input type="text" id="review-cons-input" placeholder="Cons (what could be better)" class="form-control" style="flex: 1; font-size: 0.85rem;" />
                </div>
                <button class="btn btn-outline btn-sm" onclick="window.submitReview(${prod.id})">Submit Review</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Automatically trigger initial AI review summary in modal
      window.showModalAITab('reviews', prod.id);
    } catch (err) {
      productModalBody.innerHTML = `<div style="color: var(--danger); text-align: center; padding: 40px;">Could not load product details.</div>`;
    }
  };

  window.selectModalColor = (colorName, btnEl) => {
    activeModalSelectedColor = colorName;
    document.getElementById('selected-color-label').textContent = colorName;
    document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('selected'));
    if (btnEl) btnEl.classList.add('selected');
  };

  window.selectModalOption = (optionName, btnEl) => {
    activeModalSelectedOption = optionName;
    document.getElementById('selected-option-label').textContent = optionName;
    document.querySelectorAll('.spec-pill-btn').forEach(b => b.classList.remove('selected'));
    if (btnEl) btnEl.classList.add('selected');
  };

  window.showModalAITab = async (tab, productId) => {
    const revBtn = document.getElementById('modal-ai-tab-reviews');
    const priceBtn = document.getElementById('modal-ai-tab-price');
    const content = document.getElementById('modal-ai-tab-content');

    if (revBtn && priceBtn) {
      revBtn.classList.toggle('active', tab === 'reviews');
      priceBtn.classList.toggle('active', tab === 'price');
    }

    if (!content) return;
    content.innerHTML = `<div style="text-align: center; padding: 14px; color: var(--text-muted);">✨ Consulting AI Assistant...</div>`;

    if (tab === 'reviews') {
      try {
        const res = await api.ai.summarizeReviews(productId);
        content.innerHTML = renderMarkdown(res.summary);
      } catch (e) {
        content.innerHTML = `<p>Reviews summary currently unavailable.</p>`;
      }
    } else {
      try {
        const res = await api.ai.getPriceAdvice(productId);
        content.innerHTML = renderMarkdown(res.advice);
      } catch (e) {
        content.innerHTML = `<p>Price history advice currently unavailable.</p>`;
      }
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
    const prod = currentProducts.find(p => p.id === id || p.id === Number(id));
    if (prod) {
      const variantParts = [];
      if (activeModalSelectedColor) variantParts.push(`Color: ${activeModalSelectedColor}`);
      if (activeModalSelectedOption && activeModalSelectedOption !== 'Standard') variantParts.push(`Edition: ${activeModalSelectedOption}`);
      const selectedVariant = variantParts.length > 0 ? variantParts.join(', ') : null;

      try {
        State.addToCart(prod, qty, selectedVariant);
        showToast(`Added ${qty}x ${prod.title} ${selectedVariant ? `(${selectedVariant})` : ''} to cart!`, 'success');
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
    const pros = document.getElementById('review-pros-input')?.value;
    const cons = document.getElementById('review-cons-input')?.value;

    if (!name || !comment) {
      return showToast('Please enter your name and a review comment.', 'error');
    }

    try {
      await api.products.addReview(id, { userName: name, rating, comment, pros, cons });
      showToast('Thank you for your verified review!', 'success');
      window.openProductModal(id);
      loadProducts();
    } catch (err) {
      showToast('Could not submit review.', 'error');
    }
  };

  // --------------------------------------------------------------------------
  // 7. Cart Drawer Operations
  // --------------------------------------------------------------------------
  const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartItemsContainer = document.getElementById('cart-items-container') || document.getElementById('cart-items-list');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartClearAllBtn = document.getElementById('cart-clear-all-btn');
  const cartCountBadge = document.getElementById('cart-count-badge');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const checkoutTriggerBtn = document.getElementById('checkout-trigger-btn');
  const shippingProgressText = document.getElementById('shipping-progress-text');
  const shippingProgressFill = document.getElementById('shipping-progress-fill');

  const openCartDrawer = () => {
    renderCartUI();
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.add('open');
  };
  const closeCartDrawer = () => {
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.remove('open');
  };

  window.openCartDrawer = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) closeCartDrawer();
    });
  }

  // Clear all cart items
  if (cartClearAllBtn) {
    cartClearAllBtn.addEventListener('click', () => {
      if (!State.cart || State.cart.length === 0) return;
      if (confirm('Are you sure you want to remove all items from your cart?')) {
        State.clearCart();
        showToast('Cart has been cleared.', 'info');
      }
    });
  }

  // Close cart on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawerBackdrop && cartDrawerBackdrop.classList.contains('open')) {
      closeCartDrawer();
    }
  });

  // Handle #cart URL hash
  if (window.location.hash === '#cart') {
    openCartDrawer();
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#cart') {
      openCartDrawer();
    }
  });

  window.handleAddToCart = (id) => {
    const prod = currentProducts.find(p => p.id === id || p.id === Number(id));
    if (!prod) return;
    try {
      State.addToCart(prod, 1);
      showToast(`Added ${prod.title} to your cart!`, 'success');
      openCartDrawer();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  window.handleWishlistToggle = (id) => {
    const added = State.toggleWishlist(id);
    showToast(added ? 'Saved to your wishlist!' : 'Removed from wishlist.', 'info');
    document.querySelectorAll(`.wishlist-btn[data-id="${id}"]`).forEach(btn => {
      btn.classList.toggle('active', added);
      btn.textContent = added ? '♥' : '♡';
    });
  };

  window.handleRemoveFromCart = (cartItemIdOrProductId) => {
    State.removeFromCart(cartItemIdOrProductId);
    showToast('Item removed from cart.', 'info');
  };

  const renderCartUI = () => {
    const totals = State.getCartTotals();

    // Nav Badge & Drawer Header Badge
    if (cartCountBadge) {
      if (totals.itemCount > 0) {
        cartCountBadge.textContent = totals.itemCount;
        cartCountBadge.style.display = 'flex';
      } else {
        cartCountBadge.style.display = 'none';
      }
    }
    if (cartDrawerCount) {
      if (totals.itemCount > 0) {
        cartDrawerCount.textContent = `${totals.itemCount} item${totals.itemCount > 1 ? 's' : ''}`;
        cartDrawerCount.style.display = 'inline-block';
      } else {
        cartDrawerCount.style.display = 'none';
      }
    }

    // Free Delivery Progress Tracker (Threshold: ₹499)
    const FREE_SHIPPING_THRESHOLD = 499;
    if (shippingProgressText && shippingProgressFill) {
      const hasFreeShippingCoupon = Boolean(State.activeCoupon && (State.activeCoupon.freeShipping || State.activeCoupon.code === 'FREESHIP'));

      if (totals.subtotal <= 0) {
        shippingProgressText.innerHTML = `Add <strong>₹499.00</strong> more to get <strong>Free Delivery</strong>!`;
        shippingProgressFill.style.width = '0%';
        shippingProgressFill.style.background = 'var(--accent-gradient)';
      } else if (totals.subtotal >= FREE_SHIPPING_THRESHOLD || hasFreeShippingCoupon) {
        shippingProgressText.innerHTML = `🎉 <strong>Congratulations!</strong> You have unlocked <strong>FREE Delivery</strong>!`;
        shippingProgressFill.style.width = '100%';
        shippingProgressFill.style.background = 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)';
      } else {
        const remaining = Number((FREE_SHIPPING_THRESHOLD - totals.subtotal).toFixed(2));
        const percent = Math.min(100, Math.max(0, Math.round((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)));
        shippingProgressText.innerHTML = `Add <strong>${formatCurrency(remaining)}</strong> more to get <strong>Free Delivery</strong>!`;
        shippingProgressFill.style.width = `${percent}%`;
        shippingProgressFill.style.background = 'var(--accent-gradient)';
      }
    }

    // Cart Items Rendering
    if (cartItemsContainer) {
      if (State.cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="cart-empty-state">
            <div class="cart-empty-icon">🛒</div>
            <h4>Your cart is empty</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">Browse our marketplace catalog and add gadgets & accessories!</p>
          </div>
        `;
      } else {
        cartItemsContainer.innerHTML = State.cart.map(item => {
          const rawItemId = item.cartItemId || String(item.id);
          const safeItemId = String(rawItemId).replace(/"/g, '&quot;');
          return `
          <div class="cart-item" data-cart-item-id="${safeItemId}">
            <div class="cart-item-image">
              <img src="${window.formatProductImageUrl(item.image)}" alt="${item.title}" onerror="this.src=window.getProductFallbackImage(${item.id}, '${item.category}')" />
            </div>
            <div class="cart-item-info">
              <div>
                <div class="cart-item-title">${item.title}</div>
                ${item.selectedVariant ? `<div style="font-size: 0.76rem; color: var(--accent-cyan); margin-top: 2px;">${item.selectedVariant}</div>` : ''}
                <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">Merchant: ${item.seller_name || 'Apex Tech & Audio'}</div>
              </div>
              <div class="cart-item-price">${formatCurrency(item.price)}</div>
              <div class="cart-item-actions">
                <div class="quantity-control" style="transform: scale(0.85); transform-origin: left;">
                  <button type="button" class="qty-btn" data-action="decrease-qty" data-id="${safeItemId}" aria-label="Decrease quantity">-</button>
                  <input type="text" class="qty-input" value="${item.quantity}" readonly />
                  <button type="button" class="qty-btn" data-action="increase-qty" data-id="${safeItemId}" aria-label="Increase quantity">+</button>
                </div>
                <button type="button" class="cart-remove-btn" data-action="remove-item" data-id="${safeItemId}" title="Remove this item">
                  🗑️ Remove
                </button>
              </div>
            </div>
          </div>
        `;
        }).join('');
      }
    }

    // Summary Totals
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const taxEl = document.getElementById('cart-tax-val');
    const shippingEl = document.getElementById('cart-shipping-val');
    const grandTotalEl = document.getElementById('cart-grand-total-val');
    const discountRow = document.getElementById('cart-discount-row');
    const discountVal = document.getElementById('cart-discount-val');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (taxEl) taxEl.textContent = formatCurrency(totals.tax);
    if (shippingEl) {
      if (totals.shippingFee === 0 && totals.subtotal > 0) {
        shippingEl.innerHTML = `<span style="color: var(--success); font-weight: 700;">FREE</span>`;
      } else {
        shippingEl.textContent = totals.subtotal === 0 ? '₹0.00' : formatCurrency(totals.shippingFee);
      }
    }
    if (grandTotalEl) grandTotalEl.textContent = formatCurrency(totals.total);

    if (discountRow && discountVal) {
      if (totals.discount > 0) {
        discountRow.style.display = 'flex';
        discountVal.textContent = `-${formatCurrency(totals.discount)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
  };

  // Event delegation on cart container for +/- qty and remove
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (!id) return;

      if (action === 'remove-item') {
        State.removeFromCart(id);
        showToast('Item removed from cart.', 'info');
      } else if (action === 'decrease-qty') {
        const item = State.cart.find(i => (i.cartItemId && String(i.cartItemId) === id) || String(i.id) === id);
        if (item) {
          State.updateCartQuantity(id, item.quantity - 1);
        }
      } else if (action === 'increase-qty') {
        const item = State.cart.find(i => (i.cartItemId && String(i.cartItemId) === id) || String(i.id) === id);
        if (item) {
          try {
            State.updateCartQuantity(id, item.quantity + 1);
          } catch (err) {
            showToast(err.message, 'error');
          }
        }
      }
    });
  }

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
  // 8. Multi-Step Checkout Modal (Strict Authentication & Essential Delivery Details)
  // --------------------------------------------------------------------------
  const checkoutModal = document.getElementById('checkout-modal');

  const openCheckoutModal = () => {
    if (State.cart.length === 0) {
      return showToast('Your cart is empty. Add items first!', 'error');
    }

    // MANDATORY ACCOUNT CHECK
    if (!State.isLoggedIn()) {
      showToast('Please sign in or create an account before placing an order.', 'info');
      openAuthModal();
      return;
    }

    if (checkoutModal) {
      checkoutModal.classList.add('open');
      setCheckoutStep(1);
      prefillCheckoutForm();
    }
  };
  window.openCheckoutModal = openCheckoutModal;

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
      const phoneInput = document.getElementById('checkout-phone');
      if (nameInput && !nameInput.value) nameInput.value = State.user.name;
      if (emailInput && !emailInput.value) emailInput.value = State.user.email;
      if (phoneInput && !phoneInput.value) phoneInput.value = '+91 98765 43210';
    }
  };

  // Step 1 -> Step 2 validation (Delivery Details)
  const toStep2Btn = document.getElementById('to-step-2-btn');
  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', () => {
      const name = document.getElementById('checkout-name').value.trim();
      const email = document.getElementById('checkout-email').value.trim();
      const phone = document.getElementById('checkout-phone').value.trim();
      const address = document.getElementById('checkout-address').value.trim();
      const city = document.getElementById('checkout-city').value.trim();
      const zip = document.getElementById('checkout-zip').value.trim();

      if (!name || !email || !phone || !address || !city || !zip) {
        return showToast('Please fill in all essential delivery details: Name, Email, Phone, Street, City, and PIN code.', 'error');
      }

      setCheckoutStep(2);
    });
  }

  // Step 2 -> Step 3
  const toStep3Btn = document.getElementById('to-step-3-btn');
  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', () => setCheckoutStep(3));
  }

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

  // Review screen
  const renderCheckoutReview = () => {
    const reviewItemsWrap = document.getElementById('checkout-review-items');
    const reviewTotalsWrap = document.getElementById('checkout-review-totals');
    const totals = State.getCartTotals();

    if (reviewItemsWrap) {
      reviewItemsWrap.innerHTML = State.cart.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.9rem;">
          <div>
            <strong>${item.title}</strong>
            ${item.selectedVariant ? `<div style="font-size: 0.78rem; color: var(--accent-cyan);">${item.selectedVariant}</div>` : ''}
            <span style="color: var(--text-muted); font-size: 0.8rem;">x${item.quantity} • Merchant: ${item.seller_name || 'Apex Tech'}</span>
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
          quantity: item.quantity,
          selectedVariant: item.selectedVariant || null
        })),
        discountCode: State.activeCoupon ? State.activeCoupon.code : null
      };

      try {
        const res = await api.orders.create(payload);
        closeCheckoutModal();
        State.clearCart();

        openOrderConfirmationModal(res.order);
        showToast('Your order has been confirmed!', 'success');
        loadProducts();
      } catch (err) {
        showToast(err.message || 'Could not process order.', 'error');
      } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = `<span>Place Order</span>`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Order Confirmation Modal
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
  // 10. Order Tracking System
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

  // --------------------------------------------------------------------------
  // 11. Modern Gemini AI Assistant Drawer & Dialog
  // --------------------------------------------------------------------------
  const floatingAiTrigger = document.getElementById('floating-ai-trigger');
  const navAiBtn = document.getElementById('nav-ai-btn');
  const aiDrawerBackdrop = document.getElementById('ai-drawer-backdrop');
  const aiDrawerCloseBtn = document.getElementById('ai-drawer-close-btn');
  const aiMessagesContainer = document.getElementById('ai-messages-container');
  const aiUserInput = document.getElementById('ai-user-input');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiQuickChips = document.getElementById('ai-quick-chips');
  const aiContextBanner = document.getElementById('ai-context-banner');
  const aiContextProductName = document.getElementById('ai-context-product-name');
  const aiContextClearBtn = document.getElementById('ai-context-clear-btn');
  const openGeminiSettingsBtn = document.getElementById('open-gemini-settings-btn');
  const geminiKeyModal = document.getElementById('gemini-key-modal');
  const geminiKeyInput = document.getElementById('gemini-key-input');
  const saveGeminiKeyBtn = document.getElementById('save-gemini-key-btn');
  const clearGeminiKeyBtn = document.getElementById('clear-gemini-key-btn');

  let activeAIProductId = null;
  let aiConversationHistory = [];

  const toggleAIDrawer = (open) => {
    if (!aiDrawerBackdrop) return;
    if (open) {
      aiDrawerBackdrop.classList.add('open');
      if (aiUserInput) aiUserInput.focus();
    } else {
      aiDrawerBackdrop.classList.remove('open');
    }
  };

  if (floatingAiTrigger) floatingAiTrigger.addEventListener('click', () => toggleAIDrawer(true));
  if (navAiBtn) navAiBtn.addEventListener('click', () => toggleAIDrawer(true));
  if (aiDrawerCloseBtn) aiDrawerCloseBtn.addEventListener('click', () => toggleAIDrawer(false));
  if (aiDrawerBackdrop) {
    aiDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === aiDrawerBackdrop) toggleAIDrawer(false);
    });
  }

  // Set product context in AI Assistant
  window.openAIAssistantForProduct = (productId) => {
    activeAIProductId = productId;
    const prod = currentProducts.find(p => p.id === productId);

    if (prod && aiContextBanner && aiContextProductName) {
      aiContextProductName.textContent = `${prod.title} (${formatCurrency(prod.price)})`;
      aiContextBanner.style.display = 'flex';
    }

    toggleAIDrawer(true);

    // Append context greeting
    if (prod) {
      appendAIMessage(`### 🛍️ Grounded to: ${prod.title}\nI have loaded the customer reviews, 90-day price trends, variants, and seller info for this item. What would you like to know?`, 'bot');
    }
  };

  if (aiContextClearBtn) {
    aiContextClearBtn.addEventListener('click', () => {
      activeAIProductId = null;
      if (aiContextBanner) aiContextBanner.style.display = 'none';
      appendAIMessage('Product context cleared. You can now ask me any general question about tech, shipping, or selling on TechStore!', 'bot');
    });
  }

  // Render simple markdown to HTML
  const renderMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/~~(.*?)~~/gim, '<del>$1</del>')
      .replace(/`(.*?)`/gim, '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px;">$1</code>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '<br/><br/>')
      .replace(/\n/gim, '<br/>');

    // Wrap list items in <ul>
    html = html.replace(/(<li>.*?<\/li>)/gim, '<ul>$1</ul>');
    return html;
  };

  const appendAIMessage = (content, sender = 'bot') => {
    if (!aiMessagesContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ${sender}`;

    msgDiv.innerHTML = `
      <div class="ai-msg-avatar">${sender === 'bot' ? '✨' : '👤'}</div>
      <div class="ai-msg-content">${renderMarkdown(content)}</div>
    `;

    aiMessagesContainer.appendChild(msgDiv);
    aiMessagesContainer.scrollTop = aiMessagesContainer.scrollHeight;

    aiConversationHistory.push({
      role: sender === 'bot' ? 'model' : 'user',
      text: content
    });
  };

  // Send query to AI backend
  const handleAISend = async (userQuery, intent = null) => {
    const q = userQuery || aiUserInput.value.trim();
    if (!q) return;

    appendAIMessage(q, 'user');
    if (aiUserInput) aiUserInput.value = '';

    // Typing bubble
    const typingBubble = document.createElement('div');
    typingBubble.className = 'ai-msg bot';
    typingBubble.id = 'ai-typing-indicator';
    typingBubble.innerHTML = `
      <div class="ai-msg-avatar">✨</div>
      <div class="ai-msg-content" style="color: var(--text-muted); font-style: italic;">
        Thinking & analyzing marketplace data...
      </div>
    `;
    aiMessagesContainer.appendChild(typingBubble);
    aiMessagesContainer.scrollTop = aiMessagesContainer.scrollHeight;

    try {
      const res = await api.ai.chat(q, activeAIProductId, intent, aiConversationHistory);
      typingBubble.remove();
      appendAIMessage(res.reply || 'I found no details for that query.', 'bot');
    } catch (err) {
      typingBubble.remove();
      appendAIMessage('I am sorry, I had trouble answering that right now. Please try again!', 'bot');
    }
  };

  if (aiSendBtn) {
    aiSendBtn.addEventListener('click', () => handleAISend());
  }
  if (aiUserInput) {
    aiUserInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAISend();
    });
  }

  // Quick Action Chips in AI Assistant
  if (aiQuickChips) {
    aiQuickChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.ai-chip-btn');
      if (!chip) return;
      const action = chip.dataset.action;

      if (action === 'review-summary') {
        if (!activeAIProductId && currentProducts.length > 0) {
          activeAIProductId = currentProducts[0].id;
          if (aiContextBanner && aiContextProductName) {
            aiContextProductName.textContent = currentProducts[0].title;
            aiContextBanner.style.display = 'flex';
          }
        }
        handleAISend('Summarize customer reviews for this product: What is good (Pros) and what is bad (Cons)?', 'reviews');
      } else if (action === 'best-time') {
        if (!activeAIProductId && currentProducts.length > 0) {
          activeAIProductId = currentProducts[0].id;
          if (aiContextBanner && aiContextProductName) {
            aiContextProductName.textContent = currentProducts[0].title;
            aiContextBanner.style.display = 'flex';
          }
        }
        handleAISend('Is it the best time to buy right now? Give me a full overview of its price history and deal verdict.', 'price');
      } else if (action === 'become-seller') {
        handleAISend('How can I become a seller on TechStore and list my products for sale?');
      } else if (action === 'track-help') {
        handleAISend('How do I track my order and how long does delivery take?');
      }
    });
  }

  // Gemini Settings Modal
  if (openGeminiSettingsBtn && geminiKeyModal) {
    openGeminiSettingsBtn.addEventListener('click', () => {
      geminiKeyModal.classList.add('open');
      if (geminiKeyInput) geminiKeyInput.value = State.geminiApiKey || '';
    });
  }

  if (saveGeminiKeyBtn && geminiKeyInput) {
    saveGeminiKeyBtn.addEventListener('click', () => {
      const key = geminiKeyInput.value.trim();
      State.setGeminiKey(key);
      if (geminiKeyModal) geminiKeyModal.classList.remove('open');
      showToast(key ? 'Google Gemini API key saved! Connected to cloud LLM.' : 'Reset to local AI engine.', 'success');
      appendAIMessage(key ? '✅ **Connected to Google Gemini Cloud!** Your assistant is now enhanced with real-time generative capabilities.' : 'ℹ️ Using TechStore Local AI Engine.', 'bot');
    });
  }

  if (clearGeminiKeyBtn) {
    clearGeminiKeyBtn.addEventListener('click', () => {
      State.setGeminiKey('');
      if (geminiKeyInput) geminiKeyInput.value = '';
      if (geminiKeyModal) geminiKeyModal.classList.remove('open');
      showToast('Switched to TechStore on-device AI engine.', 'info');
    });
  }

  // General Modal Closers
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
  // 12. Boot Application
  // --------------------------------------------------------------------------
  await checkCurrentUser();
  await loadProducts();
});
