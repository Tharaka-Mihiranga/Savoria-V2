import { DISHES } from './data.js';
import { 
  state, 
  addToCart, 
  updateQty, 
  removeFromCart, 
  clearCart, 
  toggleFavorite, 
  saveUser, 
  saveOrders, 
  getCartTotals 
} from './state.js';
import { 
  renderNavbar, 
  renderHomeView, 
  renderMenuView, 
  renderAboutView, 
  renderServicesView, 
  renderContactView, 
  renderAuthView, 
  renderDishModal, 
  renderCartDrawer, 
  renderCheckoutModal, 
  renderFooter 
} from './views.js';

let latestReceipt = null;

export function render() {
  const app = document.getElementById('app');
  if (!app) return;

  let mainContent = '';
  switch (state.tab) {
    case 'home':
      mainContent = renderHomeView();
      break;
    case 'menu':
      mainContent = renderMenuView();
      break;
    case 'about':
      mainContent = renderAboutView();
      break;
    case 'services':
      mainContent = renderServicesView();
      break;
    case 'contact':
      mainContent = renderContactView();
      break;
    case 'auth':
      mainContent = renderAuthView();
      break;
    default:
      mainContent = renderHomeView();
  }

  app.innerHTML = `
    <div class="min-h-screen flex flex-col justify-between bg-[#FAF8F5] text-[#2C2724]">
      ${renderNavbar()}
      <main class="flex-1">
        ${mainContent}
      </main>
      ${renderFooter()}
    </div>
    ${renderDishModal()}
    ${renderCartDrawer()}
    ${renderCheckoutModal(latestReceipt)}
  `;

  bindEvents();
}

function bindEvents() {
  // Navigation tabs
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      state.tab = btn.getAttribute('data-nav');
      state.mobileMenuOpen = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      render();
    };
  });

  // Mobile menu toggle
  const mobBtn = document.getElementById('mobile-toggle-btn');
  if (mobBtn) {
    mobBtn.onclick = () => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      render();
    };
  }

  // Cart open / close
  const openCartBtn = document.getElementById('open-cart-btn');
  if (openCartBtn) {
    openCartBtn.onclick = () => {
      state.cartOpen = true;
      render();
    };
  }
  const closeCartBtn = document.getElementById('close-cart-btn');
  if (closeCartBtn) {
    closeCartBtn.onclick = () => {
      state.cartOpen = false;
      render();
    };
  }
  const cartBackdrop = document.getElementById('cart-backdrop');
  if (cartBackdrop) {
    cartBackdrop.onclick = (e) => {
      if (e.target === cartBackdrop) {
        state.cartOpen = false;
        render();
      }
    };
  }

  // Delivery vs Pickup in cart
  const cartDelBtn = document.getElementById('cart-del-btn');
  const cartPickBtn = document.getElementById('cart-pick-btn');
  if (cartDelBtn && cartPickBtn) {
    cartDelBtn.onclick = () => {
      state.deliveryType = 'delivery';
      render();
    };
    cartPickBtn.onclick = () => {
      state.deliveryType = 'pickup';
      render();
    };
  }

  // Cart items actions
  document.querySelectorAll('[data-cartdel]').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-cartdel'), 10);
      removeFromCart(idx);
      render();
    };
  });
  document.querySelectorAll('[data-cartplus]').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-cartplus'), 10);
      updateQty(idx, 1);
      render();
    };
  });
  document.querySelectorAll('[data-cartminus]').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-cartminus'), 10);
      updateQty(idx, -1);
      render();
    };
  });

  // Promo code in cart
  const promoBtn = document.getElementById('promo-btn');
  if (promoBtn) {
    promoBtn.onclick = () => {
      const input = document.getElementById('promo-input');
      const val = input ? input.value.trim().toUpperCase() : '';
      if (val === 'SAVORIA10') {
        state.appliedPromo = { code: 'SAVORIA10', pct: 10 };
        showToast('Promo code SAVORIA10 applied (10% off)!');
        render();
      } else {
        showToast('Tip: Use code SAVORIA10 for 10% off.');
      }
    };
  }

  // Checkout trigger
  const toCheckoutBtn = document.getElementById('to-checkout-btn');
  if (toCheckoutBtn) {
    toCheckoutBtn.onclick = () => {
      state.cartOpen = false;
      state.checkoutOpen = true;
      latestReceipt = null;
      render();
    };
  }

  // Checkout modal controls
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  if (closeCheckoutBtn) {
    closeCheckoutBtn.onclick = () => {
      state.checkoutOpen = false;
      latestReceipt = null;
      render();
    };
  }
  const checkoutBackdrop = document.getElementById('checkout-backdrop');
  if (checkoutBackdrop) {
    checkoutBackdrop.onclick = (e) => {
      if (e.target === checkoutBackdrop) {
        state.checkoutOpen = false;
        latestReceipt = null;
        render();
      }
    };
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.onsubmit = (e) => {
      e.preventDefault();
      const { total } = getCartTotals();
      const newOrder = {
        id: 'SAV-' + Math.floor(10000 + Math.random() * 90000),
        date: 'Just now',
        items: [...state.cart],
        total,
        status: 'Preparing at Hearth'
      };
      state.orders.unshift(newOrder);
      saveOrders();
      clearCart();
      latestReceipt = newOrder;
      showToast('Order confirmed and sent to kitchen hearth!');
      render();
    };
  }

  const dismissReceiptBtn = document.getElementById('dismiss-receipt-btn');
  if (dismissReceiptBtn) {
    dismissReceiptBtn.onclick = () => {
      state.checkoutOpen = false;
      latestReceipt = null;
      render();
    };
  }

  // Quick Add from cards
  document.querySelectorAll('[data-quickadd]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-quickadd');
      const dish = DISHES.find(d => d.id === id);
      if (dish) {
        addToCart(dish, 1);
        showToast(`Added 1x ${dish.name} to order!`);
        render();
      }
    };
  });

  // Favorite toggle
  document.querySelectorAll('[data-fav]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-fav');
      toggleFavorite(id);
      showToast(state.favorites.includes(id) ? 'Saved to delicacies' : 'Removed from delicacies');
      render();
    };
  });

  // Open Dish Detail modal
  document.querySelectorAll('[data-detail]').forEach(btn => {
    btn.onclick = () => {
      state.selectedDishId = btn.getAttribute('data-detail');
      render();
    };
  });

  // Close modal
  const closeModalBtn = document.getElementById('close-modal-btn');
  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      state.selectedDishId = null;
      render();
    };
  }
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.onclick = (e) => {
      if (e.target === modalBackdrop) {
        state.selectedDishId = null;
        render();
      }
    };
  }

  // Add from modal
  const modalAddBtn = document.getElementById('modal-add-btn');
  if (modalAddBtn) {
    modalAddBtn.onclick = () => {
      const id = modalAddBtn.getAttribute('data-dishid');
      const dish = DISHES.find(d => d.id === id);
      if (dish) {
        addToCart(dish, 1);
        state.selectedDishId = null;
        showToast(`Added ${dish.name} to cart!`);
        render();
      }
    };
  }

  // Menu Search
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) {
    searchInput.oninput = (e) => {
      state.searchQuery = e.target.value;
      render();
      const newInput = document.getElementById('menu-search-input');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
    };
  }

  // Menu Sorting
  const sortSelect = document.getElementById('menu-sort-select');
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      state.sortBy = e.target.value;
      render();
    };
  }

  // Menu Categories
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.onclick = () => {
      state.category = btn.getAttribute('data-cat');
      render();
    };
  });

  // Menu Diets
  document.querySelectorAll('[data-diet]').forEach(btn => {
    btn.onclick = () => {
      state.dietary = btn.getAttribute('data-diet');
      render();
    };
  });

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('c-name')?.value || 'Guest';
      showToast(`Thank you, ${name}! Your inquiry has been sent to our Head Concierge.`);
      contactForm.reset();
    };
  }

  // Auth form & Demo VIP login
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email')?.value || 'guest@domain.com';
      const name = document.getElementById('auth-name')?.value || email.split('@')[0];
      state.user = { name, email };
      saveUser();
      showToast(`Welcome back, ${name}!`);
      render();
    };
  }

  const demoVipBtn = document.getElementById('demo-vip-btn');
  if (demoVipBtn) {
    demoVipBtn.onclick = () => {
      state.user = { name: 'Eleanor Vance', email: 'eleanor@epicurean.com' };
      saveUser();
      showToast('Signed in as VIP Patron Eleanor Vance');
      render();
    };
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      state.user = null;
      saveUser();
      showToast('Signed out of member account.');
      render();
    };
  }
}

function showToast(msg) {
  let box = document.getElementById('toast-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast-box';
    box.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(box);
  }

  const t = document.createElement('div');
  t.className = 'pointer-events-auto bg-[#1C1A17] text-white px-4 py-2.5 rounded-xl shadow-lg border border-stone-800 text-xs font-medium animate-fade-in flex items-center gap-2';
  t.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>${msg}</span>`;
  box.appendChild(t);

  setTimeout(() => {
    t.remove();
  }, 3200);
}

// Initial boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
