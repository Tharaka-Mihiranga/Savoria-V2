import { RESTAURANT, DISHES } from './data.js';

const CART_KEY = 'savoria_cart';
const USER_KEY = 'savoria_user';
const ORDERS_KEY = 'savoria_orders';
const FAVS_KEY = 'savoria_favs';

function load(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

export const state = {
  tab: 'home',
  selectedDishId: null,
  cartOpen: false,
  checkoutOpen: false,
  mobileMenuOpen: false,

  category: 'all',
  dietary: 'all',
  searchQuery: '',
  sortBy: 'recommended',

  dishes: [...DISHES],

  cart: load(CART_KEY, []),
  deliveryType: 'delivery',
  appliedPromo: null,
  user: load(USER_KEY, null),
  favorites: load(FAVS_KEY, ['dish-1', 'dish-3', 'dish-7']),
  orders: load(ORDERS_KEY, [
    {
      id: 'SAV-84920',
      date: 'Yesterday, 8:10 PM',
      items: [
        { name: 'Prime Angus Filet Mignon', quantity: 1, price: 48 },
        { name: 'Smoked Rosemary & Fig Elixir', quantity: 2, price: 13 }
      ],
      total: 80.50,
      status: 'Delivered'
    }
  ])
};

export function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (e) {}
}

export function saveUser() {
  try { localStorage.setItem(USER_KEY, JSON.stringify(state.user)); } catch (e) {}
}

export function saveOrders() {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders)); } catch (e) {}
}

export function saveFavorites() {
  try { localStorage.setItem(FAVS_KEY, JSON.stringify(state.favorites)); } catch (e) {}
}

export function addToCart(dish, quantity = 1, side = null) {
  const existing = state.cart.find(i => i.id === dish.id && i.side === side);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity,
      side
    });
  }
  saveCart();
}

export function updateQty(index, delta) {
  if (index >= 0 && index < state.cart.length) {
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
  }
}

export function removeFromCart(index) {
  if (index >= 0 && index < state.cart.length) {
    state.cart.splice(index, 1);
    saveCart();
  }
}

export function clearCart() {
  state.cart = [];
  state.appliedPromo = null;
  saveCart();
}

export async function toggleFavorite(id) {
  const idx = state.favorites.indexOf(id);
  if (idx > -1) {
    state.favorites.splice(idx, 1);
    if (state.user?.email) {
      try {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: state.user.email, dish_id: id })
        });
      } catch (e) {}
    }
  } else {
    state.favorites.push(id);
    if (state.user?.email) {
      try {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: state.user.email, dish_id: id })
        });
      } catch (e) {}
    }
  }
  saveFavorites();
}

export function getCartTotals() {
  const subtotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = state.appliedPromo ? (subtotal * state.appliedPromo.pct) / 100 : 0;
  const netSubtotal = Math.max(0, subtotal - discount);
  const deliveryFee = state.deliveryType === 'pickup' || netSubtotal >= RESTAURANT.delivery.freeOver || netSubtotal === 0 ? 0 : RESTAURANT.delivery.fee;
  const tax = netSubtotal * 0.085;
  const total = netSubtotal > 0 ? netSubtotal + deliveryFee + tax : 0;
  const count = state.cart.reduce((c, i) => c + i.quantity, 0);
  return { subtotal, discount, deliveryFee, tax, total, count };
}

// --- REST API BACKEND CONNECTORS ---
export async function syncDishesFromAPI() {
  try {
    const res = await fetch('/api/dishes');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        state.dishes = data;
      }
    }
  } catch (e) {
    // Graceful offline fallback
  }
}

export async function submitOrderToAPI(orderPayload) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return null;
}

export async function submitInquiryToAPI(inquiryPayload) {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryPayload)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function loginUserAPI(email, name) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    if (res.ok) {
      const user = await res.json();
      state.user = user;
      saveUser();
      // Fetch user's orders & favorites from SQLite
      fetchUserOrdersAPI(email);
      fetchUserFavoritesAPI(email);
      return user;
    }
  } catch (e) {}
  state.user = { email, name };
  saveUser();
  return state.user;
}

export async function fetchUserOrdersAPI(email) {
  try {
    const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        state.orders = list;
        saveOrders();
      }
    }
  } catch (e) {}
}

export async function fetchUserFavoritesAPI(email) {
  try {
    const res = await fetch(`/api/favorites/${encodeURIComponent(email)}`);
    if (res.ok) {
      const favs = await res.json();
      if (Array.isArray(favs)) {
        state.favorites = favs;
        saveFavorites();
      }
    }
  } catch (e) {}
}
