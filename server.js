const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database('sneakershop.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    availability TEXT NOT NULL,
    status TEXT NOT NULL,
    release_date TEXT,
    views INTEGER DEFAULT 0,
    wishlist_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shoe_stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shoe_id INTEGER NOT NULL,
    store_name TEXT NOT NULL,
    store_url TEXT NOT NULL,
    FOREIGN KEY (shoe_id) REFERENCES shoes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    shoe_id INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shoe_id) REFERENCES shoes(id) ON DELETE CASCADE,
    UNIQUE(user_id, shoe_id)
  );

  CREATE TABLE IF NOT EXISTS email_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    shoe_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shoe_id) REFERENCES shoes(id) ON DELETE CASCADE,
    UNIQUE(email, shoe_id)
  );
`);

// Seed initial shoe data if table is empty
const shoeCount = db.prepare('SELECT COUNT(*) as count FROM shoes').get();
if (shoeCount.count === 0) {
  console.log('Seeding initial shoe data...');
  
  const insertShoe = db.prepare(`
    INSERT INTO shoes (name, price, image, availability, status, release_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const insertStore = db.prepare(`
    INSERT INTO shoe_stores (shoe_id, store_name, store_url)
    VALUES (?, ?, ?)
  `);
  
  const shoesData = [
    {
      name: "Nike Air Force 1 '07",
      price: 115,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&q=80",
      availability: "Available Now",
      status: "available",
      release_date: null,
      stores: [
        { name: "Nike.com", url: "https://www.nike.com/t/air-force-1-07-mens-shoes-jBrhbr/CW2288-111" },
        { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20air%20force%201" },
        { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+air+force+1" }
      ]
    },
    {
      name: "Nike Dunk Low Retro",
      price: 115,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=300&fit=crop&q=80",
      availability: "Available Now",
      status: "available",
      release_date: null,
      stores: [
        { name: "Nike.com", url: "https://www.nike.com/t/dunk-low-retro-mens-shoes-76r2z0/DD1391-100" },
        { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20dunk%20low" },
        { name: "Champs Sports", url: "https://www.champssports.com/search?query=nike%20dunk%20low" }
      ]
    },
    {
      name: "Nike Blazer Mid '77 Vintage",
      price: 100,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&q=80",
      availability: "Available Now",
      status: "available",
      release_date: null,
      stores: [
        { name: "Nike.com", url: "https://www.nike.com/t/blazer-mid-77-vintage-mens-shoes-nw30B2/BQ6806-100" },
        { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20blazer%20mid%2077" },
        { name: "GOAT", url: "https://www.goat.com/search?query=nike%20blazer%20mid%2077" }
      ]
    },
    {
      name: "Nike Court Vision Low",
      price: 75,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&q=80",
      availability: "Available Now",
      status: "available",
      release_date: null,
      stores: [
        { name: "Nike.com", url: "https://www.nike.com/w/mens-court-vision-shoes-1r9y6zy7ok" },
        { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20court%20vision" },
        { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+court+vision+low" }
      ]
    },
    {
      name: "Nike Air Jordan 1 Retro High OG",
      price: 180,
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop&q=80",
      availability: "Coming Soon",
      status: "coming-soon",
      release_date: "December 15, 2025",
      stores: [
        { name: "Nike.com", url: "https://www.nike.com/w/jordan-1-shoes-3glsmz6ymx6znik1" },
        { name: "Foot Locker", url: "https://www.footlocker.com/release-dates" },
        { name: "GOAT", url: "https://www.goat.com/search?query=air%20jordan%201%20high" }
      ]
    },
    {
      name: "Nike SB Dunk Low Pro",
      price: 130,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop&q=80",
      availability: "Coming Soon",
      status: "coming-soon",
      release_date: "December 20, 2025",
      stores: [
        { name: "Nike.com", url: "https://www.nike.com/w/sb-dunk-shoes-1hzfznik1zy7ok" },
        { name: "Skate Shops", url: "https://www.tactics.com/nike-sb" },
        { name: "GOAT", url: "https://www.goat.com/search?query=nike%20sb%20dunk%20low" }
      ]
    },
    {
      name: "Nike Cortez Leather",
      price: 90,
      image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=300&fit=crop&q=80",
      availability: "Rare & Affordable",
      status: "rare",
      release_date: null,
      stores: [
        { name: "Nike.com", url: "https://www.nike.com/w/cortez-shoes-1i6l5zy7ok" },
        { name: "GOAT", url: "https://www.goat.com/search?query=nike%20cortez%20leather" },
        { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+cortez+leather" }
      ]
    },
    {
      name: "Nike Air Pegasus 83",
      price: 95,
      image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=300&fit=crop&q=80",
      availability: "Rare & Affordable",
      status: "rare",
      release_date: null,
      stores: [
        { name: "Nike.com", url: "https://www.nike.com/w/air-pegasus-shoes-1r9y6zy7ok" },
        { name: "GOAT", url: "https://www.goat.com/search?query=air%20pegasus%2083" },
        { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+air+pegasus+83" }
      ]
    }
  ];
  
  for (const shoe of shoesData) {
    const result = insertShoe.run(
      shoe.name,
      shoe.price,
      shoe.image,
      shoe.availability,
      shoe.status,
      shoe.release_date
    );
    
    const shoeId = result.lastInsertRowid;
    for (const store of shoe.stores) {
      insertStore.run(shoeId, store.name, store.url);
    }
  }
  
  console.log('✅ Initial shoe data seeded successfully!');
}

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all routes
app.use(limiter);

// Session middleware
app.use(session({
  secret: 'sneaker-shop-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper function to get shoes with stores
function getShoesWithStores(shoes) {
  return shoes.map(shoe => {
    const stores = db.prepare('SELECT store_name as name, store_url as url FROM shoe_stores WHERE shoe_id = ?').all(shoe.id);
    return {
      ...shoe,
      releaseDate: shoe.release_date,
      stores
    };
  });
}

// API Routes

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  try {
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);
    
    req.session.userId = result.lastInsertRowid;
    res.json({ success: true, message: 'Registration successful', user: { email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  try {
    const user = db.prepare('SELECT id, email, password FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.userId = user.id;
      res.json({ success: true, message: 'Login successful', user: { email: user.email } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
  if (req.session.userId) {
    try {
      const user = db.prepare('SELECT email FROM users WHERE id = ?').get(req.session.userId);
      if (user) {
        res.json({ authenticated: true, user: { email: user.email } });
      } else {
        res.json({ authenticated: false });
      }
    } catch (error) {
      console.error('Auth status error:', error);
      res.json({ authenticated: false });
    }
  } else {
    res.json({ authenticated: false });
  }
});

// Get all shoes
// Get all shoes
app.get('/api/shoes', (req, res) => {
  try {
    const { status, sort } = req.query;
    
    let query = `
      SELECT id, name, price, image, availability, status, release_date, views, wishlist_count
      FROM shoes 
      WHERE status != 'unavailable' AND status != 'sold-out'
    `;
    
    const params = [];
    
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    // Add sorting
    if (sort === 'popular') {
      query += ` ORDER BY wishlist_count DESC, views DESC`;
    } else if (sort === 'newest') {
      query += ` ORDER BY created_at DESC`;
    } else if (sort === 'price-low') {
      query += ` ORDER BY price ASC`;
    } else if (sort === 'price-high') {
      query += ` ORDER BY price DESC`;
    } else {
      query += ` ORDER BY id ASC`;
    }
    
    const shoes = db.prepare(query).all(...params);
    const shoesWithStores = getShoesWithStores(shoes);
    
    res.json(shoesWithStores);
  } catch (error) {
    console.error('Error loading shoes:', error);
    res.status(500).json({ error: 'Failed to load shoes' });
  }
});

// Get single shoe (and increment view count)
app.get('/api/shoes/:id', (req, res) => {
  try {
    const shoeId = parseInt(req.params.id);
    
    // Increment view count
    db.prepare('UPDATE shoes SET views = views + 1 WHERE id = ?').run(shoeId);
    
    const shoe = db.prepare(`
      SELECT id, name, price, image, availability, status, release_date, views, wishlist_count
      FROM shoes WHERE id = ?
    `).get(shoeId);
    
    if (shoe) {
      const shoesWithStores = getShoesWithStores([shoe]);
      res.json(shoesWithStores[0]);
    } else {
      res.status(404).json({ error: 'Shoe not found' });
    }
  } catch (error) {
    console.error('Error loading shoe:', error);
    res.status(500).json({ error: 'Failed to load shoe' });
  }
});

// Get wishlist
app.get('/api/wishlist', requireAuth, (req, res) => {
  try {
    const wishlistItems = db.prepare(`
      SELECT s.id, s.name, s.price, s.image, s.availability, s.status, s.release_date, s.views, s.wishlist_count
      FROM wishlist w
      JOIN shoes s ON w.shoe_id = s.id
      WHERE w.user_id = ? AND s.status != 'unavailable' AND s.status != 'sold-out'
      ORDER BY w.added_at DESC
    `).all(req.session.userId);
    
    const shoesWithStores = getShoesWithStores(wishlistItems);
    res.json(shoesWithStores);
  } catch (error) {
    console.error('Error loading wishlist:', error);
    res.status(500).json({ error: 'Failed to load wishlist' });
  }
});

// Add to wishlist
app.post('/api/wishlist/:id', requireAuth, (req, res) => {
  const shoeId = parseInt(req.params.id);
  
  try {
    // Check if shoe exists
    const shoe = db.prepare('SELECT id FROM shoes WHERE id = ?').get(shoeId);
    
    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }
    
    // Add to wishlist (INSERT OR IGNORE prevents duplicates)
    const result = db.prepare('INSERT OR IGNORE INTO wishlist (user_id, shoe_id) VALUES (?, ?)').run(req.session.userId, shoeId);
    
    // Update wishlist count if a new row was inserted
    if (result.changes > 0) {
      db.prepare('UPDATE shoes SET wishlist_count = wishlist_count + 1 WHERE id = ?').run(shoeId);
    }
    
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
app.delete('/api/wishlist/:id', requireAuth, (req, res) => {
  const shoeId = parseInt(req.params.id);
  
  try {
    const result = db.prepare('DELETE FROM wishlist WHERE user_id = ? AND shoe_id = ?').run(req.session.userId, shoeId);
    
    // Update wishlist count if a row was deleted
    if (result.changes > 0) {
      db.prepare('UPDATE shoes SET wishlist_count = wishlist_count - 1 WHERE id = ?').run(shoeId);
    }
    
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// Subscribe to email notifications
// Subscribe to email notifications
app.post('/api/subscribe', (req, res) => {
  const { email, shoeId } = req.body;
  
  if (!email || !shoeId) {
    return res.status(400).json({ error: 'Email and shoe ID required' });
  }
  
  try {
    const shoe = db.prepare('SELECT id, name, status, release_date FROM shoes WHERE id = ?').get(parseInt(shoeId));
    
    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }
    
    if (shoe.status !== 'coming-soon') {
      return res.status(400).json({ error: 'Can only subscribe to upcoming releases' });
    }
    
    db.prepare('INSERT OR IGNORE INTO email_subscriptions (email, shoe_id) VALUES (?, ?)').run(email, parseInt(shoeId));
    
    // Note: To send actual emails, configure nodemailer with SMTP settings:
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.example.com',
    //   port: 587,
    //   secure: false,
    //   auth: { user: 'your-email@example.com', pass: 'your-password' }
    // });
    // await transporter.sendMail({
    //   from: 'notifications@sneakershop.com',
    //   to: email,
    //   subject: `${shoe.name} Release Notification`,
    //   text: `${shoe.name} will be released on ${shoe.release_date}!`
    // });
    
    // For now, we just log the subscription
    console.log(`Email subscription: ${email} subscribed to shoe ID ${shoeId} (${shoe.name})`);
    
    res.json({ 
      success: true, 
      message: `You'll be notified at ${email} when ${shoe.name} is released!` 
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nike Sneaker Shop running on http://localhost:${PORT}`);
});
