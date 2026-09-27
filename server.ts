import express from 'express';
import { db, initDatabase } from './src/db.ts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite Schema & Seeds
initDatabase();

// --- REST API ENDPOINTS ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Node.js + SQLite', timestamp: new Date().toISOString() });
});

// GET /api/dishes
app.get('/api/dishes', (req, res) => {
  try {
    const { category, search, dietary } = req.query;
    let query = 'SELECT * FROM dishes WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && typeof search === 'string' && search.trim()) {
      query += ' AND (name LIKE ? OR description LIKE ? OR ingredients LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const rows = db.prepare(query).all(...params) as any[];

    // Parse JSON columns
    const dishes = rows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      price: r.price,
      desc: r.description,
      image: r.image,
      rating: r.rating,
      reviews: r.reviews_count,
      calories: r.calories,
      prepTime: r.prep_time,
      tags: JSON.parse(r.tags || '[]'),
      macros: JSON.parse(r.macros || '{}'),
      ingredients: JSON.parse(r.ingredients || '[]'),
      allergens: JSON.parse(r.allergens || '[]'),
      isFeatured: Boolean(r.is_featured)
    }));

    if (dietary && dietary !== 'all') {
      const filtered = dishes.filter(d => d.tags.includes(dietary as string));
      return res.json(filtered);
    }

    res.json(dishes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dishes/:id
app.get('/api/dishes/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM dishes WHERE id = ?').get(req.params.id) as any;
    if (!row) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      desc: row.description,
      image: row.image,
      rating: row.rating,
      reviews: row.reviews_count,
      calories: row.calories,
      prepTime: row.prep_time,
      tags: JSON.parse(row.tags || '[]'),
      macros: JSON.parse(row.macros || '{}'),
      ingredients: JSON.parse(row.ingredients || '[]'),
      allergens: JSON.parse(row.allergens || '[]'),
      isFeatured: Boolean(row.is_featured)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  try {
    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      delivery_type, 
      address, 
      notes, 
      items, 
      subtotal, 
      discount, 
      delivery_fee, 
      tax, 
      total 
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    const orderId = 'SAV-' + Math.floor(10000 + Math.random() * 90000);

    db.exec('BEGIN TRANSACTION;');

    db.prepare(`
      INSERT INTO orders (id, customer_name, customer_email, customer_phone, delivery_type, address, notes, subtotal, discount, delivery_fee, tax, total, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Preparing at Hearth')
    `).run(
      orderId,
      customer_name || 'Guest Connoisseur',
      customer_email || 'guest@savoria.com',
      customer_phone || '',
      delivery_type || 'delivery',
      address || '',
      notes || '',
      subtotal || 0,
      discount || 0,
      delivery_fee || 0,
      tax || 0,
      total || 0
    );

    const itemStmt = db.prepare(`
      INSERT INTO order_items (order_id, dish_id, name, price, quantity, side)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const it of items) {
      itemStmt.run(orderId, it.id || 'dish-custom', it.name, it.price, it.quantity, it.side || null);
    }

    db.exec('COMMIT;');

    res.status(201).json({
      id: orderId,
      status: 'Preparing at Hearth',
      total,
      date: 'Just now',
      items
    });
  } catch (err: any) {
    db.exec('ROLLBACK;');
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  try {
    const { email } = req.query;
    let query = 'SELECT * FROM orders';
    const params: any[] = [];

    if (email) {
      query += ' WHERE customer_email = ?';
      params.push(email);
    }
    query += ' ORDER BY created_at DESC LIMIT 50';

    const orders = db.prepare(query).all(...params) as any[];

    const results = orders.map(o => {
      const items = db.prepare('SELECT dish_id as id, name, price, quantity, side FROM order_items WHERE order_id = ?').all(o.id);
      return {
        id: o.id,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        date: o.created_at,
        status: o.status,
        deliveryType: o.delivery_type,
        address: o.address,
        total: o.total,
        items
      };
    });

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inquiries
app.post('/api/inquiries', (req, res) => {
  try {
    const { name, email, phone, topic, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const info = db.prepare(`
      INSERT INTO inquiries (name, email, phone, topic, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, phone || '', topic || 'General Dining', message);

    res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inquiries
app.get('/api/inquiries', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 50').all();
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      const userId = 'usr-' + Date.now();
      db.prepare(`
        INSERT INTO users (id, name, email, tier)
        VALUES (?, ?, ?, 'Epicurean Guild Member')
      `).run(userId, name || email.split('@')[0], email);
      user = { id: userId, name: name || email.split('@')[0], email, tier: 'Epicurean Guild Member' };
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET & POST & DELETE /api/favorites
app.get('/api/favorites/:email', (req, res) => {
  try {
    const rows = db.prepare('SELECT dish_id FROM favorites WHERE user_email = ?').all(req.params.email) as any[];
    res.json(rows.map(r => r.dish_id));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/favorites', (req, res) => {
  try {
    const { user_email, dish_id } = req.body;
    if (!user_email || !dish_id) return res.status(400).json({ error: 'user_email and dish_id are required' });

    db.prepare('INSERT OR IGNORE INTO favorites (user_email, dish_id) VALUES (?, ?)').run(user_email, dish_id);
    res.json({ success: true, saved: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/favorites', (req, res) => {
  try {
    const { user_email, dish_id } = req.body;
    db.prepare('DELETE FROM favorites WHERE user_email = ? AND dish_id = ?').run(user_email, dish_id);
    res.json({ success: true, saved: false });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- VITE MIDDLEWARE INTEGRATION (FULL-STACK) ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    // Mount Vite dev middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Savoria Server] Running on http://0.0.0.0:${PORT} with Node.js + SQLite`);
  });
}

startServer();
