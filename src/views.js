import { RESTAURANT, CHEF, DISHES, TESTIMONIALS } from './data.js';
import { state, getCartTotals } from './state.js';
import { icon } from './icons.js';

export function renderNavbar() {
  const { count } = getCartTotals();
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'Chef & Story' },
    { id: 'services', label: 'Fast Delivery' },
    { id: 'contact', label: 'Contact & Hours' }
  ];

  return `
    <header class="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
      <!-- Top banner -->
      <div class="bg-[#1C1A17] text-stone-300 text-xs py-1.5 px-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Artisanal Hearth Open • Fast Delivery in 30-45 Mins</span>
          </div>
          <div class="hidden sm:flex items-center gap-4 text-stone-400">
            <span>${RESTAURANT.phone}</span>
            <span>•</span>
            <span>${RESTAURANT.address}</span>
          </div>
        </div>
      </div>

      <!-- Main nav -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <button data-nav="home" class="flex items-center gap-3 text-left focus:outline-none group">
            <div class="w-11 h-11 rounded-full bg-[#2C2724] text-amber-200 flex items-center justify-center font-serif text-2xl font-bold shadow-md group-hover:bg-amber-900 transition-colors">
              S
            </div>
            <div>
              <span class="font-serif text-2xl font-bold tracking-tight text-[#2C2724] block leading-none">${RESTAURANT.name}</span>
              <span class="text-[10px] uppercase tracking-widest text-amber-800 font-semibold">Artisanal Bistro</span>
            </div>
          </button>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1 lg:space-x-2">
            ${tabs.map(t => `
              <button 
                data-nav="${t.id}"
                class="px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  state.tab === t.id 
                    ? 'text-amber-950 bg-amber-100/70 font-semibold' 
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }"
              >
                ${t.label}
              </button>
            `).join('')}
          </nav>

          <!-- Right actions -->
          <div class="flex items-center gap-2 sm:gap-3">
            <button 
              data-nav="auth"
              class="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
            >
              ${icon('user', 'w-4 h-4 text-stone-600')}
              <span class="hidden sm:inline">${state.user ? state.user.name.split(' ')[0] : 'Sign In'}</span>
            </button>

            <button 
              id="open-cart-btn"
              class="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2C2724] text-white hover:bg-amber-900 transition-colors shadow-sm"
            >
              ${icon('shopping-bag', 'w-4 h-4 text-amber-300')}
              <span class="text-xs font-semibold hidden sm:inline">Order Cart</span>
              ${count > 0 ? `
                <span class="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-amber-500 text-stone-950 ml-0.5">
                  ${count}
                </span>
              ` : ''}
            </button>

            <button id="mobile-toggle-btn" class="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg">
              ${icon('menu', 'w-6 h-6')}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile dropdown -->
      ${state.mobileMenuOpen ? `
        <div class="md:hidden bg-[#FAF8F5] border-t border-stone-200 px-4 py-3 space-y-1">
          ${tabs.map(t => `
            <button data-nav="${t.id}" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${state.tab === t.id ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-700'}">
              ${t.label}
            </button>
          `).join('')}
        </div>
      ` : ''}
    </header>
  `;
}

export function renderHomeView() {
  const dishes = state.dishes && state.dishes.length ? state.dishes : DISHES;
  const featured = dishes.filter(d => d.isFeatured);

  return `
    <div class="space-y-16 sm:space-y-24 pb-16 animate-fade-in">
      
      <!-- HERO -->
      <section class="relative min-h-[80vh] flex items-center justify-center bg-[#1A1816] text-stone-100 overflow-hidden px-4">
        <div class="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&q=80" 
            alt="Bistro Ambience" 
            class="w-full h-full object-cover opacity-25 scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-[#1A1816]/75 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-4xl mx-auto text-center py-16 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            Est. ${RESTAURANT.founded} • Colombo Sanctuary
          </div>
          <h1 class="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Where Classical Heritage Meets <span class="italic text-amber-200 font-normal">Modern Cuisine</span>
          </h1>
          <p class="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Curated by ${CHEF.name}. Savor hyper-seasonal produce, wood-fired precision, and temperature-controlled rapid home delivery.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button data-nav="menu" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-lg flex items-center justify-center gap-2">
              <span>Explore Complete Menu</span>
              ${icon('arrow-right', 'w-4 h-4')}
            </button>
            <button data-nav="services" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase border border-white/20 backdrop-blur-md transition-colors flex items-center justify-center gap-2">
              ${icon('truck', 'w-4 h-4 text-amber-300')}
              <span>Fast Delivery Info</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ACCOLADES STRIP -->
      <section class="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div class="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="p-2 border-r border-stone-100 last:border-0">
            <div class="font-serif text-3xl font-bold text-amber-900">22</div>
            <div class="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Years Mastery</div>
          </div>
          <div class="p-2 border-r border-stone-100 last:border-0">
            <div class="font-serif text-3xl font-bold text-amber-900">4.9★</div>
            <div class="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Guest Score</div>
          </div>
          <div class="p-2 border-r border-stone-100 last:border-0">
            <div class="font-serif text-3xl font-bold text-amber-900">15</div>
            <div class="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Acre Bio-Farm</div>
          </div>
          <div class="p-2">
            <div class="font-serif text-3xl font-bold text-amber-900">30-45m</div>
            <div class="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1">Fast Delivery</div>
          </div>
        </div>
      </section>

      <!-- SIGNATURE PLATES -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-amber-800">Epicurean Selections</span>
            <h2 class="font-serif text-3xl font-bold text-[#2C2724] mt-1">Chef Silva's Signature Creations</h2>
          </div>
          <button data-nav="menu" class="text-sm font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1.5">
            <span>View All 10 Delicacies</span>
            ${icon('arrow-right', 'w-4 h-4')}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${featured.map(d => renderDishCard(d)).join('')}
        </div>
      </section>

      <!-- CHEF SPOTLIGHT -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-[#24201D] text-stone-100 rounded-3xl overflow-hidden border border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-5 h-80 lg:h-full">
            <img src="${CHEF.image}" alt="${CHEF.name}" class="w-full h-full object-cover object-top" />
          </div>
          <div class="lg:col-span-7 p-8 sm:p-12 space-y-4">
            <span class="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">Hearth Artisan</span>
            <h2 class="font-serif text-3xl font-bold text-white">${CHEF.name}</h2>
            <div class="text-xs text-stone-400 font-medium">${CHEF.title} • ${CHEF.experience}</div>
            <blockquote class="border-l-2 border-amber-500 pl-4 py-1 italic font-serif text-amber-100/90 text-sm sm:text-base">
              "${CHEF.quote}"
            </blockquote>
            <p class="text-xs sm:text-sm text-stone-300 leading-relaxed">${CHEF.bio}</p>
            <div class="pt-2">
              <button data-nav="about" class="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold tracking-wider uppercase transition-colors">
                Discover Story & Farmstead
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- REVIEWS -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-800">Critical Acclaim</span>
          <h2 class="font-serif text-3xl font-bold text-[#2C2724] mt-1">Connoisseur Testimonials</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${TESTIMONIALS.map(t => `
            <div class="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex text-amber-500 gap-0.5">
                  ${Array(5).fill(icon('star', 'w-4 h-4')).join('')}
                </div>
                <p class="font-serif italic text-stone-700 text-xs sm:text-sm leading-relaxed">"${t.quote}"</p>
              </div>
              <div class="pt-3 border-t border-stone-100 text-xs">
                <strong class="block text-stone-900 font-bold">${t.author}</strong>
                <span class="text-amber-800">${t.outlet}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

    </div>
  `;
}

export function renderMenuView() {
  const allDishes = state.dishes && state.dishes.length ? state.dishes : DISHES;
  let list = allDishes.filter(d => {
    if (state.category !== 'all' && d.category !== state.category) return false;
    if (state.dietary !== 'all' && !d.tags.includes(state.dietary)) return false;
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      const match = d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || d.ingredients.some(i => i.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  if (state.sortBy === 'price-low') list.sort((a,b) => a.price - b.price);
  else if (state.sortBy === 'price-high') list.sort((a,b) => b.price - a.price);
  else if (state.sortBy === 'rating') list.sort((a,b) => b.rating - a.rating);

  const categories = [
    { id: 'all', label: 'All Dishes' },
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Mains & Hearth' },
    { id: 'pasta', label: 'Handmade Pasta' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'beverages', label: 'Elixirs & Beverages' }
  ];

  const diets = ['all', "Chef's Choice", 'Vegetarian', 'Vegan', 'Gluten-Free', 'Organic'];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <h1 class="font-serif text-4xl font-bold text-[#2C2724]">Artisanal Menu</h1>
        <p class="text-stone-600 text-sm">Hyper-seasonal, made to order, and sealed in heated thermal delivery packaging.</p>
      </div>

      <!-- Controls -->
      <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div class="relative w-full md:w-80">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              ${icon('search', 'w-4 h-4')}
            </span>
            <input 
              id="menu-search-input" 
              type="text" 
              placeholder="Search dishes or ingredients..." 
              value="${state.searchQuery}"
              class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800 bg-stone-50/50"
            />
          </div>

          <div class="flex items-center gap-2 w-full md:w-auto justify-end">
            <label class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Sort:</label>
            <select id="menu-sort-select" class="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium bg-white focus:outline-none">
              <option value="recommended" ${state.sortBy === 'recommended' ? 'selected' : ''}>Chef's Recommendation</option>
              <option value="price-low" ${state.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-high" ${state.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Highest Rated (4.9+)</option>
            </select>
          </div>
        </div>

        <!-- Categories -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 border-t border-stone-100 pt-3">
          ${categories.map(c => `
            <button 
              data-cat="${c.id}"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0 transition-all ${
                state.category === c.id ? 'bg-[#2C2724] text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }"
            >
              ${c.label}
            </button>
          `).join('')}
        </div>

        <!-- Dietary filters -->
        <div class="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-100/60 text-xs">
          <span class="text-stone-400 font-bold uppercase tracking-widest text-[10px] mr-1">Diet:</span>
          ${diets.map(d => `
            <button 
              data-diet="${d}"
              class="px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                state.dietary === d ? 'bg-amber-800 text-white' : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100'
              }"
            >
              ${d === 'all' ? 'All' : d}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Dish Grid -->
      ${list.length === 0 ? `
        <div class="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-sm">
          No delicacies match "${state.searchQuery}". Try selecting another category or resetting filters.
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${list.map(d => renderDishCard(d)).join('')}
        </div>
      `}
    </div>
  `;
}

function renderDishCard(dish) {
  const isFav = state.favorites.includes(dish.id);
  return `
    <div class="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
      <div>
        <div class="relative h-56 overflow-hidden bg-stone-100">
          <img src="${dish.image}" alt="${dish.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            ${dish.tags.map(t => `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-amber-200 backdrop-blur-xs">${t}</span>`).join('')}
          </div>
          <button 
            data-fav="${dish.id}"
            class="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 transition-colors shadow-xs"
            title="Favorite"
          >
            ${isFav ? icon('heart-filled', 'w-4 h-4 text-rose-600') : icon('heart', 'w-4 h-4')}
          </button>
          <div class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-medium">
            ${dish.prepTime}
          </div>
        </div>

        <div class="p-5 space-y-2">
          <div class="flex justify-between items-start gap-2">
            <h3 class="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">${dish.name}</h3>
            <span class="font-serif text-lg font-bold text-amber-900 shrink-0">$${dish.price}</span>
          </div>
          <p class="text-xs text-stone-600 line-clamp-2 leading-relaxed">${dish.desc}</p>
          <div class="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <span class="flex items-center gap-1 text-amber-700 font-semibold">
              ${icon('star', 'w-3.5 h-3.5 text-amber-500')} ${dish.rating} (${dish.reviews})
            </span>
            <span>${dish.calories} kcal</span>
          </div>
        </div>
      </div>

      <div class="p-5 pt-0 grid grid-cols-2 gap-2">
        <button 
          data-detail="${dish.id}" 
          class="py-2.5 px-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors text-center"
        >
          Dish Specs
        </button>
        <button 
          data-quickadd="${dish.id}"
          class="py-2.5 px-3 rounded-xl bg-[#2C2724] hover:bg-amber-900 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          ${icon('plus', 'w-3.5 h-3.5 text-amber-300')}
          <span>Order</span>
        </button>
      </div>
    </div>
  `;
}

export function renderDishModal() {
  if (!state.selectedDishId) return '';
  const dishes = state.dishes && state.dishes.length ? state.dishes : DISHES;
  const d = dishes.find(item => item.id === state.selectedDishId);
  if (!d) return '';

  return `
    <div id="modal-backdrop" class="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-scale-in">
        <button id="close-modal-btn" class="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors">
          ${icon('x', 'w-5 h-5')}
        </button>

        <div class="h-64 sm:h-72 overflow-hidden bg-stone-100 relative">
          <img src="${d.image}" alt="${d.name}" class="w-full h-full object-cover" />
          <div class="absolute bottom-3 left-4 flex gap-2">
            ${d.tags.map(t => `<span class="px-3 py-1 rounded-full text-xs font-bold bg-black/80 text-amber-200">${t}</span>`).join('')}
          </div>
        </div>

        <div class="p-6 sm:p-8 space-y-5">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="font-serif text-2xl font-bold text-stone-900">${d.name}</h2>
              <div class="flex items-center gap-2 text-xs text-stone-500 mt-1">
                <span class="text-amber-800 font-semibold">${d.category.toUpperCase()}</span>
                <span>•</span>
                <span class="flex items-center gap-1 text-amber-700">${icon('star', 'w-3.5 h-3.5 text-amber-500')} ${d.rating} (${d.reviews} reviews)</span>
              </div>
            </div>
            <div class="font-serif text-3xl font-bold text-amber-900">$${d.price}</div>
          </div>

          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${d.desc}</p>

          <!-- Macro breakdown -->
          <div class="bg-stone-50 rounded-xl p-3 border border-stone-200 grid grid-cols-4 gap-2 text-center text-xs">
            <div><span class="text-stone-400 block text-[10px]">ENERGY</span><span class="font-bold text-stone-900">${d.calories} kcal</span></div>
            <div><span class="text-stone-400 block text-[10px]">PROTEIN</span><span class="font-bold text-stone-900">${d.macros.protein}</span></div>
            <div><span class="text-stone-400 block text-[10px]">CARBS</span><span class="font-bold text-stone-900">${d.macros.carbs}</span></div>
            <div><span class="text-stone-400 block text-[10px]">FATS</span><span class="font-bold text-stone-900">${d.macros.fats}</span></div>
          </div>

          <!-- Ingredients & Allergens -->
          <div class="space-y-1.5 text-xs">
            <div><strong class="text-stone-800">Harvested Ingredients:</strong> <span class="text-stone-600">${d.ingredients.join(', ')}</span></div>
            <div><strong class="text-stone-800">Allergen Notice:</strong> <span class="text-stone-600">${d.allergens.length ? d.allergens.join(', ') : 'None detected'}</span></div>
          </div>

          <div class="pt-3 border-t border-stone-200 flex gap-3">
            <button 
              id="modal-add-btn" 
              data-dishid="${d.id}"
              class="w-full py-3.5 px-6 rounded-xl bg-[#2C2724] hover:bg-amber-900 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2"
            >
              ${icon('shopping-bag', 'w-4 h-4 text-amber-300')}
              <span>Add to Order Cart • $${d.price}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderAboutView() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 animate-fade-in">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="text-xs font-bold uppercase tracking-widest text-amber-800">Hearth & Heritage</span>
        <h1 class="font-serif text-4xl font-bold text-[#2C2724]">Our Story & The Kitchen Guild</h1>
        <p class="text-stone-600 text-sm">Founded in ${RESTAURANT.founded} on regenerative farming, French precision, and Sri Lankan organic provenance.</p>
      </div>

      <!-- Chef Feature -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-5 rounded-2xl overflow-hidden shadow-lg aspect-3/4">
          <img src="${CHEF.image}" alt="${CHEF.name}" class="w-full h-full object-cover object-top" />
        </div>
        <div class="lg:col-span-7 space-y-4">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-800">Master of the Hearth</span>
          <h2 class="font-serif text-3xl font-bold text-[#2C2724]">${CHEF.name}</h2>
          <p class="text-xs text-stone-500">${CHEF.experience} • ${CHEF.origin}</p>
          <blockquote class="border-l-4 border-amber-800 pl-4 py-2 italic font-serif text-stone-800 text-sm bg-stone-50 rounded-r-xl">
            "${CHEF.quote}"
          </blockquote>
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${CHEF.bio}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            ${CHEF.accolades.map(a => `
              <div class="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 text-amber-950 text-xs font-medium border border-amber-200/60">
                ${icon('award', 'w-4 h-4 text-amber-700 shrink-0')}
                <span>${a}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="space-y-6">
        <div class="text-center">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-800">Evolution</span>
          <h3 class="font-serif text-2xl font-bold text-stone-900 mt-1">12-Year Milestones</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${CHEF.milestones.map(m => `
            <div class="bg-white rounded-2xl p-6 border border-stone-200 space-y-2">
              <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-serif font-bold text-xs inline-block">${m.year}</span>
              <h4 class="font-serif text-base font-bold text-stone-900">${m.title}</h4>
              <p class="text-xs text-stone-600 leading-relaxed">${m.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function renderServicesView() {
  const d = RESTAURANT.delivery;
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="text-xs font-bold uppercase tracking-widest text-amber-800">Express Dining</span>
        <h1 class="font-serif text-4xl font-bold text-[#2C2724]">Fast Delivery & Private Experiences</h1>
        <p class="text-stone-600 text-sm">Fine dining delivered to your doorstep in insulated thermal vessels.</p>
      </div>

      <!-- Delivery workflow -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-6">
          <div>
            <h2 class="font-serif text-2xl font-bold text-stone-900">Rapid Delivery Guarantees</h2>
            <p class="text-xs text-stone-500">Cooked to order upon receipt and dispatched with single-stop drivers.</p>
          </div>
          <button data-nav="menu" class="px-6 py-2.5 rounded-xl bg-amber-800 text-white text-xs font-semibold uppercase tracking-wider">
            Order Now
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div class="p-4 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
            <span class="w-8 h-8 rounded-lg bg-[#2C2724] text-amber-300 font-bold flex items-center justify-center text-xs">1</span>
            <h4 class="font-serif font-bold text-sm text-stone-900">Live Fire Prep</h4>
            <p class="text-xs text-stone-600">Freshly fired upon order ticket printing.</p>
          </div>
          <div class="p-4 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
            <span class="w-8 h-8 rounded-lg bg-[#2C2724] text-amber-300 font-bold flex items-center justify-center text-xs">2</span>
            <h4 class="font-serif font-bold text-sm text-stone-900">Thermal Seal</h4>
            <p class="text-xs text-stone-600">Insulated eco-boxes preserve steam & crispness.</p>
          </div>
          <div class="p-4 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
            <span class="w-8 h-8 rounded-lg bg-[#2C2724] text-amber-300 font-bold flex items-center justify-center text-xs">3</span>
            <h4 class="font-serif font-bold text-sm text-stone-900">30-45m Courier</h4>
            <p class="text-xs text-stone-600">Direct courier straight to your door.</p>
          </div>
          <div class="p-4 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
            <span class="w-8 h-8 rounded-lg bg-[#2C2724] text-amber-300 font-bold flex items-center justify-center text-xs">4</span>
            <h4 class="font-serif font-bold text-sm text-stone-900">Plating Guide</h4>
            <p class="text-xs text-stone-600">Printed card with Chef Silva's plating tips.</p>
          </div>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div class="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 text-xs space-y-2">
            <h3 class="font-serif text-base font-bold text-amber-950 flex items-center gap-2">
              ${icon('truck', 'w-4 h-4 text-amber-800')}
              Delivery Terms
            </h3>
            <div class="flex justify-between border-b border-amber-200/60 pb-1.5"><span>Minimum Order:</span><strong>$${d.minimum}.00</strong></div>
            <div class="flex justify-between border-b border-amber-200/60 pb-1.5"><span>Standard Delivery Fee:</span><strong>$${d.fee.toFixed(2)}</strong></div>
            <div class="flex justify-between border-b border-amber-200/60 pb-1.5"><span>Complimentary Free Delivery:</span><strong class="text-emerald-800">Orders over $${d.freeOver}.00</strong></div>
            <div class="flex justify-between"><span>Speed:</span><strong>${d.time}</strong></div>
          </div>

          <div class="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs space-y-2">
            <h3 class="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              ${icon('map-pin', 'w-4 h-4 text-amber-800')}
              Coverage Neighborhoods
            </h3>
            <div class="grid grid-cols-2 gap-2 pt-1">
              ${d.zones.map(z => `<div class="bg-white p-2 rounded-lg border border-stone-200 flex items-center gap-1.5">${icon('check', 'w-3.5 h-3.5 text-emerald-600')}<span>${z}</span></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderContactView() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="text-xs font-bold uppercase tracking-widest text-amber-800">Concierge Desk</span>
        <h1 class="font-serif text-4xl font-bold text-[#2C2724]">Contact & Operating Hours</h1>
        <p class="text-stone-600 text-sm">We welcome dining reservations, private banquet requests, and sommelier inquiries.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Form -->
        <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <h2 class="font-serif text-xl font-bold text-stone-900">Send an Inquiry</h2>
          <form id="contact-form" class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-stone-700 uppercase block mb-1">Your Full Name *</label>
              <input id="c-name" type="text" required placeholder="Eleanor Vance" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-stone-700 uppercase block mb-1">Email *</label>
                <input id="c-email" type="email" required placeholder="eleanor@domain.com" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
              </div>
              <div>
                <label class="font-bold text-stone-700 uppercase block mb-1">Phone</label>
                <input id="c-phone" type="tel" placeholder="+1 (555) 000-0000" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
              </div>
            </div>
            <div>
              <label class="font-bold text-stone-700 uppercase block mb-1">Inquiry Topic</label>
              <select id="c-topic" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white">
                <option value="General Dining">General Dining & Reservations</option>
                <option value="Private Banquet">Private Chef & Banquet Catering</option>
                <option value="Sommelier Cellar">Sommelier Cellar Experience</option>
              </select>
            </div>
            <div>
              <label class="font-bold text-stone-700 uppercase block mb-1">Message *</label>
              <textarea id="c-msg" rows="3" required placeholder="How may we curate your dining experience?" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"></textarea>
            </div>
            <button type="submit" class="w-full py-3 rounded-xl bg-[#2C2724] hover:bg-amber-900 text-white font-semibold uppercase tracking-wider transition-colors">
              Transmit Message to Concierge
            </button>
          </form>
        </div>

        <!-- Hours & Info -->
        <div class="lg:col-span-5 space-y-5">
          <div class="bg-white rounded-3xl p-6 border border-stone-200 text-xs space-y-3">
            <h3 class="font-serif text-lg font-bold text-stone-900">Direct Concierge</h3>
            <div class="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
              ${icon('map-pin', 'w-4 h-4 text-amber-800 shrink-0 mt-0.5')}
              <div><strong>Bistro Sanctuary:</strong> ${RESTAURANT.address} (Valet Parking Available)</div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
              ${icon('phone', 'w-4 h-4 text-amber-800 shrink-0')}
              <div><strong>Desk:</strong> ${RESTAURANT.reservationPhone}</div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
              ${icon('mail', 'w-4 h-4 text-amber-800 shrink-0')}
              <div><strong>Inquiries:</strong> ${RESTAURANT.email}</div>
            </div>
          </div>

          <div class="bg-[#24201D] text-stone-100 rounded-3xl p-6 border border-stone-800 text-xs space-y-3">
            <h3 class="font-serif text-base font-bold text-amber-200">Dining Room Hours</h3>
            ${RESTAURANT.hours.map(h => `
              <div class="border-b border-stone-800 pb-2">
                <span class="font-semibold text-stone-200 block">${h.days}</span>
                <span class="text-stone-400">Lunch: ${h.lunch} | Dinner: ${h.dinner}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderAuthView() {
  if (state.user) {
    const dishes = state.dishes && state.dishes.length ? state.dishes : DISHES;
    const favs = dishes.filter(d => state.favorites.includes(d.id));
    return `
      <div class="max-w-5xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-[#2C2724] text-amber-300 font-serif text-xl font-bold flex items-center justify-center">
              ${state.user.name[0]}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-serif text-2xl font-bold text-stone-900">${state.user.name}</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase">Epicurean Guild Member</span>
              </div>
              <p class="text-xs text-stone-500">${state.user.email}</p>
            </div>
          </div>
          <button id="logout-btn" class="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold uppercase hover:bg-stone-50">
            Sign Out
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <h3 class="font-serif text-lg font-bold text-stone-900">Recent Orders (${state.orders.length})</h3>
            ${state.orders.map(o => `
              <div class="bg-white rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
                <div class="flex justify-between font-bold text-stone-900">
                  <span>${o.id} • ${o.date}</span>
                  <span class="text-emerald-700">${o.status}</span>
                </div>
                ${o.items.map(i => `<div class="flex justify-between text-stone-600"><span>${i.quantity}x ${i.name}</span><span>$${(i.price * i.quantity).toFixed(2)}</span></div>`).join('')}
                <div class="pt-2 border-t border-stone-100 flex justify-between font-bold text-amber-900">
                  <span>Total</span>
                  <span>$${o.total.toFixed(2)}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="space-y-3">
            <h3 class="font-serif text-lg font-bold text-stone-900">Saved Delicacies (${favs.length})</h3>
            ${favs.map(f => `
              <div class="bg-white rounded-2xl p-3 border border-stone-200 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <img src="${f.image}" alt="${f.name}" class="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <strong class="font-serif block text-stone-900">${f.name}</strong>
                    <span class="text-amber-900 font-bold">$${f.price}</span>
                  </div>
                </div>
                <button data-quickadd="${f.id}" class="px-3 py-1.5 rounded-lg bg-[#2C2724] text-white text-xs font-semibold hover:bg-amber-900">
                  Order
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="max-w-md mx-auto px-4 py-14 animate-fade-in">
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div class="text-center space-y-1">
          <div class="w-12 h-12 rounded-full bg-[#2C2724] text-amber-300 font-serif text-xl font-bold flex items-center justify-center mx-auto mb-2">S</div>
          <h1 class="font-serif text-2xl font-bold text-stone-900">Member Sign In</h1>
          <p class="text-xs text-stone-500">Sign in to track orders, saved dishes, and exclusive privileges.</p>
        </div>

        <form id="auth-form" class="space-y-3 text-xs">
          <div>
            <label class="font-bold text-stone-700 uppercase block mb-1">Your Name</label>
            <input id="auth-name" type="text" placeholder="e.g. Eleanor Vance" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
          </div>
          <div>
            <label class="font-bold text-stone-700 uppercase block mb-1">Email Address *</label>
            <input id="auth-email" type="email" required placeholder="eleanor@domain.com" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-[#2C2724] hover:bg-amber-900 text-white font-semibold uppercase tracking-wider transition-colors mt-2">
            Continue to Account
          </button>
        </form>

        <div class="pt-2 border-t border-stone-100 text-center">
          <span class="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">Instant Demo Sign In</span>
          <button id="demo-vip-btn" class="w-full py-2 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center gap-2">
            <span>VIP Patron: Eleanor Vance</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderCartDrawer() {
  if (!state.cartOpen) return '';
  const { subtotal, discount, deliveryFee, tax, total, count } = getCartTotals();

  return `
    <div id="cart-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div class="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-stone-200">
        <div class="p-5 border-b border-stone-200 flex justify-between items-center bg-white">
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-50 text-amber-900">${icon('shopping-bag', 'w-4 h-4')}</span>
            <h3 class="font-serif text-lg font-bold text-stone-900">Your Order (${count})</h3>
          </div>
          <button id="close-cart-btn" class="p-2 text-stone-400 hover:text-stone-700">${icon('x', 'w-5 h-5')}</button>
        </div>

        <div class="px-5 py-2.5 bg-stone-100 border-b border-stone-200 flex gap-2 text-xs">
          <button id="cart-del-btn" class="flex-1 py-1.5 rounded-lg font-semibold ${state.deliveryType === 'delivery' ? 'bg-[#2C2724] text-white' : 'text-stone-600'}">
            Delivery (30-45m)
          </button>
          <button id="cart-pick-btn" class="flex-1 py-1.5 rounded-lg font-semibold ${state.deliveryType === 'pickup' ? 'bg-[#2C2724] text-white' : 'text-stone-600'}">
            Bistro Takeout
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-3">
          ${state.cart.length === 0 ? `
            <div class="text-center py-16 text-stone-400 text-xs space-y-2">
              <div class="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center mx-auto text-stone-500">${icon('shopping-bag', 'w-6 h-6')}</div>
              <p class="font-serif font-bold text-stone-700 text-sm">Your Order is Empty</p>
              <p>Explore Chef Silva's menu to add dishes.</p>
            </div>
          ` : `
            ${state.cart.map((item, idx) => `
              <div class="bg-white rounded-2xl p-3 border border-stone-200 flex gap-3 items-center">
                <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <h4 class="font-serif text-xs font-bold text-stone-900 truncate">${item.name}</h4>
                    <button data-cartdel="${idx}" class="text-stone-400 hover:text-rose-600">${icon('trash', 'w-3.5 h-3.5')}</button>
                  </div>
                  <div class="flex justify-between items-center pt-2 text-xs">
                    <span class="font-serif font-bold text-amber-900">$${(item.price * item.quantity).toFixed(2)}</span>
                    <div class="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button data-cartminus="${idx}" class="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded">-</button>
                      <span class="w-6 text-center font-bold text-stone-900">${item.quantity}</span>
                      <button data-cartplus="${idx}" class="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded">+</button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          `}
        </div>

        ${state.cart.length > 0 ? `
          <div class="p-5 bg-white border-t border-stone-200 space-y-3">
            <div class="flex gap-2">
              <input id="promo-input" type="text" placeholder="Promo code (SAVORIA10)" value="${state.appliedPromo ? state.appliedPromo.code : ''}" class="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-300" />
              <button id="promo-btn" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-xs font-semibold rounded-xl">${state.appliedPromo ? 'Applied' : 'Apply'}</button>
            </div>

            <div class="space-y-1 text-xs text-stone-600 border-t border-stone-100 pt-2">
              <div class="flex justify-between"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
              ${discount > 0 ? `<div class="flex justify-between text-emerald-700"><span>Promo Discount (10%):</span><span>-$${discount.toFixed(2)}</span></div>` : ''}
              <div class="flex justify-between"><span>Tax (8.5%):</span><span>$${tax.toFixed(2)}</span></div>
              <div class="flex justify-between"><span>Delivery:</span><span>${deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span></div>
              <div class="flex justify-between font-serif text-sm font-bold text-stone-900 pt-1 border-t border-stone-100">
                <span>Total:</span><span class="text-amber-900">$${total.toFixed(2)}</span>
              </div>
            </div>

            <button id="to-checkout-btn" class="w-full py-3.5 rounded-xl bg-[#2C2724] hover:bg-amber-900 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2">
              <span>Checkout Order</span>
              ${icon('arrow-right', 'w-4 h-4 text-amber-300')}
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function renderCheckoutModal(receipt) {
  if (!state.checkoutOpen) return '';
  const { total, count } = getCartTotals();

  return `
    <div id="checkout-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
        ${receipt ? `
          <div class="text-center space-y-3 py-2">
            <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">${icon('check', 'w-7 h-7')}</div>
            <h3 class="font-serif text-2xl font-bold text-stone-900">Order Placed & Dispatched</h3>
            <p class="text-xs text-stone-500 font-mono">Receipt Code: ${receipt.id}</p>
            <div class="bg-stone-50 rounded-xl p-4 text-left text-xs space-y-1.5 border border-stone-200">
              <div class="font-bold text-stone-800 pb-1 border-b border-stone-200">Order Summary:</div>
              ${receipt.items.map(i => `<div class="flex justify-between text-stone-600"><span>${i.quantity}x ${i.name}</span><span>$${(i.price * i.quantity).toFixed(2)}</span></div>`).join('')}
              <div class="flex justify-between font-bold text-amber-900 pt-1.5 border-t border-stone-200">
                <span>Total Paid:</span><span>$${receipt.total.toFixed(2)}</span>
              </div>
            </div>
            <button id="dismiss-receipt-btn" class="w-full py-3 bg-[#2C2724] text-white rounded-xl text-xs font-semibold uppercase">Back to Bistro</button>
          </div>
        ` : `
          <div class="flex justify-between items-center border-b border-stone-100 pb-3">
            <div>
              <h3 class="font-serif text-xl font-bold text-stone-900">Authorize Order</h3>
              <p class="text-xs text-stone-500">${state.deliveryType === 'delivery' ? 'Fast Delivery' : 'Takeout'} • ${count} items</p>
            </div>
            <button id="close-checkout-btn" class="p-1 text-stone-400 hover:text-stone-700">${icon('x', 'w-5 h-5')}</button>
          </div>

          <form id="checkout-form" class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-stone-700 uppercase block mb-1">Recipient Name *</label>
              <input id="co-name" type="text" required value="${state.user ? state.user.name : ''}" placeholder="Eleanor Vance" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-stone-700 uppercase block mb-1">Phone *</label>
                <input id="co-phone" type="tel" required placeholder="+1 (555) 000-0000" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
              </div>
              <div>
                <label class="font-bold text-stone-700 uppercase block mb-1">Email *</label>
                <input id="co-email" type="email" required value="${state.user ? state.user.email : ''}" placeholder="eleanor@domain.com" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
              </div>
            </div>

            ${state.deliveryType === 'delivery' ? `
              <div>
                <label class="font-bold text-stone-700 uppercase block mb-1">Delivery Address *</label>
                <input id="co-addr" type="text" required placeholder="428 Heritage Blvd, Suite 4B, Colombo" class="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50" />
              </div>
            ` : `
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                Pick up at 428 Heritage Boulevard host stand in heated presentation bags.
              </div>
            `}

            <button type="submit" class="w-full py-3.5 rounded-xl bg-[#2C2724] hover:bg-amber-900 text-white font-semibold uppercase tracking-wider transition-colors shadow-lg mt-2">
              Confirm & Pay $${total.toFixed(2)}
            </button>
          </form>
        `}
      </div>
    </div>
  `;
}

export function renderFooter() {
  return `
    <footer class="bg-[#1C1A17] text-stone-300 pt-14 pb-10 border-t border-stone-800 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-serif font-bold text-lg">S</div>
              <span class="font-serif text-xl font-bold text-white">${RESTAURANT.name}</span>
            </div>
            <p class="text-stone-400 leading-relaxed">${RESTAURANT.tagline}. Hyper-seasonal French craftsmanship in the heart of Colombo.</p>
          </div>

          <div>
            <h4 class="font-serif text-stone-100 font-bold mb-3 uppercase tracking-wider text-[11px]">Pages</h4>
            <ul class="space-y-1.5 text-stone-400">
              <li><button data-nav="home" class="hover:text-amber-300">Home Experience</button></li>
              <li><button data-nav="menu" class="hover:text-amber-300">Artisanal Menu</button></li>
              <li><button data-nav="about" class="hover:text-amber-300">Chef Silva & Story</button></li>
              <li><button data-nav="services" class="hover:text-amber-300">Fast Delivery</button></li>
              <li><button data-nav="contact" class="hover:text-amber-300">Concierge Inquiries</button></li>
            </ul>
          </div>

          <div>
            <h4 class="font-serif text-stone-100 font-bold mb-3 uppercase tracking-wider text-[11px]">Hours</h4>
            <div class="space-y-1 text-stone-400">
              <div>Mon - Thu: 11:30 AM - 10:00 PM</div>
              <div>Fri - Sat: 11:30 AM - 11:30 PM</div>
              <div>Sun: 10:30 AM - 9:30 PM</div>
            </div>
          </div>

          <div>
            <h4 class="font-serif text-stone-100 font-bold mb-3 uppercase tracking-wider text-[11px]">Contact</h4>
            <div class="space-y-1 text-stone-400">
              <div>${RESTAURANT.address}</div>
              <div>${RESTAURANT.phone}</div>
              <div>${RESTAURANT.email}</div>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-stone-800 text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© ${new Date().getFullYear()} ${RESTAURANT.name} Bistro. Minimalist & High-Performance.</span>
          <span>Zero-Waste Kitchen • Bio-Farmstead Harvest</span>
        </div>
      </div>
    </footer>
  `;
}
