import { RESTAURANT } from './data.js';

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
  tab: 'home', // 'home' | 'menu' | 'about' | 'services' | 'contact' | 'auth'
  selectedDishId: null,
  cartOpen: false,
  checkoutOpen: false,
  mobileMenuOpen: false,

  // Menu filters
  category: 'all',
  dietary: 'all',
  searchQuery: '',
  sortBy: 'recommended',

  // Stored state
  cart: load(CART_KEY, []),
  deliveryType: 'delivery', // 'delivery' | 'pickup'
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

export function toggleFavorite(id) {
  const idx = state.favorites.indexOf(id);
  if (idx > -1) {
    state.favorites.splice(idx, 1);
  } else {
    state.favorites.push(id);
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
