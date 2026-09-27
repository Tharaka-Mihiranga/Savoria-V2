import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../restaurant.db');

export const db = new DatabaseSync(dbPath);

// Enable WAL mode for performance
db.exec('PRAGMA journal_mode = WAL;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      calories INTEGER DEFAULT 0,
      prep_time TEXT,
      tags TEXT, -- JSON array
      macros TEXT, -- JSON object
      ingredients TEXT, -- JSON array
      allergens TEXT, -- JSON array
      is_featured INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      tier TEXT DEFAULT 'Epicurean Guild Member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      delivery_type TEXT DEFAULT 'delivery',
      address TEXT,
      notes TEXT,
      payment_method TEXT DEFAULT 'card',
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      delivery_fee REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Preparing at Hearth',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      dish_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      side TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      topic TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      dish_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, dish_id)
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM dishes').get() as { count: number };
  if (countRow && countRow.count > 0) return;

  const initialDishes = [
    {
      id: 'dish-1',
      name: 'Pan-Seared Hokkaido Scallops',
      category: 'starters',
      price: 24,
      desc: 'Golden caramelized diver scallops atop saffron velouté, dehydrated Serrano crisps, and pea tendrils.',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80',
      rating: 4.9,
      reviews: 142,
      calories: 380,
      prepTime: '15 mins',
      tags: ["Chef's Choice", 'Gluten-Free'],
      macros: { protein: '28g', carbs: '9g', fats: '18g' },
      ingredients: ['Diver Scallops', 'Kashmiri Saffron', 'Shallot Reduction', 'Normandy Butter', 'Serrano Crisp'],
      allergens: ['Shellfish', 'Dairy'],
      isFeatured: 1
    },
    {
      id: 'dish-2',
      name: 'Apulian Burrata & Roasted Figs',
      category: 'starters',
      price: 19,
      desc: 'Creamy burrata heart, honey-roasted mission figs, toasted pine nuts, and 25-year Modena balsamic.',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviews: 98,
      calories: 460,
      prepTime: '12 mins',
      tags: ['Vegetarian', 'Organic'],
      macros: { protein: '18g', carbs: '24g', fats: '32g' },
      ingredients: ['Apulian Burrata', 'Mission Figs', 'Toasted Pine Nuts', 'Wild Basil', 'Aged Balsamic'],
      allergens: ['Dairy', 'Tree Nuts'],
      isFeatured: 0
    },
    {
      id: 'dish-3',
      name: 'Prime Angus Filet Mignon',
      category: 'mains',
      price: 48,
      desc: 'Center-cut 28-day aged beef filet over Robuchon butter potato purée, charred broccolini, and black truffle demi-glace.',
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=700&q=80',
      rating: 5.0,
      reviews: 230,
      calories: 680,
      prepTime: '25 mins',
      tags: ["Chef's Choice", 'Gluten-Free'],
      macros: { protein: '52g', carbs: '22g', fats: '38g' },
      ingredients: ['Aged Beef Filet', 'Yukon Potatoes', 'Winter Truffle', 'Charred Broccolini', 'Bone Reduction'],
      allergens: ['Dairy'],
      isFeatured: 1
    },
    {
      id: 'dish-4',
      name: 'Wild Chilean Sea Bass en Papillote',
      category: 'mains',
      price: 44,
      desc: 'Oven-steamed in parchment with lemongrass, shaved fennel, shiitake mushrooms, and dashi citrus infusion.',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80',
      rating: 4.9,
      reviews: 114,
      calories: 520,
      prepTime: '22 mins',
      tags: ['Gluten-Free', 'Organic'],
      macros: { protein: '42g', carbs: '12g', fats: '24g' },
      ingredients: ['Chilean Sea Bass', 'Lemongrass', 'Fennel Bulb', 'Shiitake Caps', 'Dashi Broth'],
      allergens: ['Fish'],
      isFeatured: 1
    },
    {
      id: 'dish-5',
      name: 'Truffled Buffalo Ricotta Ravioli',
      category: 'pasta',
      price: 32,
      desc: 'Handmade semolina pasta pillows stuffed with buffalo ricotta, tossed in brown sage butter and shaved Norcia truffles.',
      image: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=700&q=80',
      rating: 4.9,
      reviews: 184,
      calories: 590,
      prepTime: '18 mins',
      tags: ['Vegetarian', "Chef's Choice"],
      macros: { protein: '22g', carbs: '64g', fats: '28g' },
      ingredients: ['Egg Semolina', 'Buffalo Ricotta', 'Norcia Black Truffle', 'Parmigiano-Reggiano', 'Sage Butter'],
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      isFeatured: 1
    },
    {
      id: 'dish-6',
      name: 'Wild Chanterelle Carnaroli Risotto',
      category: 'pasta',
      price: 29,
      desc: 'Aged Carnaroli rice slow-cooked with roasted mushrooms, saffron threads, mascarpone, and crispy trumpet chips.',
      image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviews: 89,
      calories: 540,
      prepTime: '20 mins',
      tags: ['Vegetarian', 'Gluten-Free', 'Organic'],
      macros: { protein: '14g', carbs: '68g', fats: '22g' },
      ingredients: ['Carnaroli Rice', 'Chanterelles', 'Saffron', 'Mascarpone', 'White Truffle Oil'],
      allergens: ['Dairy'],
      isFeatured: 0
    },
    {
      id: 'dish-7',
      name: '72% Valrhona Molten Lava Cake',
      category: 'desserts',
      price: 16,
      desc: 'Warm single-origin Guanaja chocolate core paired with Madagascar bourbon vanilla bean gelato and 24k gold leaf.',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
      rating: 5.0,
      reviews: 310,
      calories: 490,
      prepTime: '14 mins',
      tags: ['Vegetarian', "Chef's Choice"],
      macros: { protein: '9g', carbs: '54g', fats: '30g' },
      ingredients: ['Valrhona 72% Chocolate', 'Bourbon Vanilla Pods', 'Heavy Cream', 'Pasture Eggs', 'Raspberry Coulis'],
      allergens: ['Dairy', 'Eggs', 'Gluten'],
      isFeatured: 1
    },
    {
      id: 'dish-8',
      name: 'Tahitian Vanilla Bean Crème Brûlée',
      category: 'desserts',
      price: 14,
      desc: 'Velvety baked custard under a hand-torched caramelized sugar crackle, garnished with organic valley blackberries.',
      image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=700&q=80',
      rating: 4.8,
      reviews: 165,
      calories: 420,
      prepTime: '10 mins',
      tags: ['Vegetarian', 'Gluten-Free'],
      macros: { protein: '7g', carbs: '38g', fats: '26g' },
      ingredients: ['Tahitian Vanilla Beans', 'Organic Cream', 'Egg Yolks', 'Turbinado Sugar', 'Blackberries'],
      allergens: ['Dairy', 'Eggs'],
      isFeatured: 0
    },
    {
      id: 'dish-9',
      name: 'Smoked Rosemary & Fig Elixir',
      category: 'beverages',
      price: 13,
      desc: 'Roasted black mission fig cordial, clarified crisp cider, Meyer lemon, tonic, and a smoking torched rosemary spear.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=700&q=80',
      rating: 4.9,
      reviews: 77,
      calories: 110,
      prepTime: '5 mins',
      tags: ['Vegan', 'Gluten-Free', 'Organic'],
      macros: { protein: '1g', carbs: '26g', fats: '0g' },
      ingredients: ['Fig Cordial', 'Clarified Apple Cider', 'Smoked Rosemary', 'Meyer Lemon', 'Botanical Tonic'],
      allergens: [],
      isFeatured: 0
    },
    {
      id: 'dish-10',
      name: 'Sicilian Blood Orange & Hibiscus Spritz',
      category: 'beverages',
      price: 12,
      desc: 'Fresh pressed Moro blood oranges, Egyptian wild hibiscus tea, elderflower syrup, and effervescent sparkling water.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80',
      rating: 4.7,
      reviews: 92,
      calories: 95,
      prepTime: '5 mins',
      tags: ['Vegan', 'Gluten-Free'],
      macros: { protein: '0g', carbs: '22g', fats: '0g' },
      ingredients: ['Blood Orange Juice', 'Hibiscus Petals', 'Elderflower Extract', 'Sparkling Soda', 'Fresh Mint'],
      allergens: [],
      isFeatured: 0
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO dishes (id, name, category, price, description, image, rating, reviews_count, calories, prep_time, tags, macros, ingredients, allergens, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const d of initialDishes) {
    stmt.run(
      d.id,
      d.name,
      d.category,
      d.price,
      d.desc,
      d.image,
      d.rating,
      d.reviews,
      d.calories,
      d.prepTime,
      JSON.stringify(d.tags),
      JSON.stringify(d.macros),
      JSON.stringify(d.ingredients),
      JSON.stringify(d.allergens),
      d.isFeatured
    );
  }

  // Seed sample user
  db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, tier)
    VALUES ('usr-1', 'Eleanor Vance', 'eleanor@epicurean.com', 'VIP Gold Patron')
  `).run();

  // Seed initial order
  const orderId = 'SAV-84920';
  db.prepare(`
    INSERT OR IGNORE INTO orders (id, customer_name, customer_email, customer_phone, delivery_type, address, notes, subtotal, discount, delivery_fee, tax, total, status)
    VALUES (?, 'Eleanor Vance', 'eleanor@epicurean.com', '+1 (555) 234-7890', 'delivery', '428 Heritage Blvd, Colombo', 'Please ring gate code 428', 74.0, 0, 0, 6.5, 80.5, 'Delivered')
  `).run(orderId);

  db.prepare(`
    INSERT OR IGNORE INTO order_items (order_id, dish_id, name, price, quantity, side)
    VALUES (?, 'dish-3', 'Prime Angus Filet Mignon', 48, 1, 'Truffle Pomme Frites')
  `).run(orderId);

  db.prepare(`
    INSERT OR IGNORE INTO order_items (order_id, dish_id, name, price, quantity, side)
    VALUES (?, 'dish-9', 'Smoked Rosemary & Fig Elixir', 13, 2, 'Standard Botanical')
  `).run(orderId);
}
