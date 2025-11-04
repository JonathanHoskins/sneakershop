const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all routes
app.use(limiter);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage for wishlist and email subscriptions
const wishlist = new Set();
const emailSubscriptions = new Map(); // Map of email -> Set of shoe IDs

// Sample Nike shoe data
const shoes = [
  // Available Now
  {
    id: 1,
    name: "Nike Air Max 90",
    price: 130,
    image: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Air+Max+90",
    availability: "Available Now",
    status: "available",
    stores: ["Nike.com", "Foot Locker", "Finish Line"]
  },
  {
    id: 2,
    name: "Nike Dunk Low Retro",
    price: 110,
    image: "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Dunk+Low",
    availability: "Available Now",
    status: "available",
    stores: ["Nike.com", "Foot Locker"]
  },
  {
    id: 3,
    name: "Nike Air Force 1 '07",
    price: 100,
    image: "https://via.placeholder.com/300x200/95E1D3/FFFFFF?text=Air+Force+1",
    availability: "Available Now",
    status: "available",
    stores: ["Nike.com", "Foot Locker", "Finish Line", "Champs Sports"]
  },
  // Coming Soon
  {
    id: 4,
    name: "Nike Air Jordan 1 High",
    price: 170,
    image: "https://via.placeholder.com/300x200/F38181/FFFFFF?text=Jordan+1+High",
    availability: "Coming Soon",
    status: "coming-soon",
    releaseDate: "December 15, 2025",
    stores: ["Nike.com", "SNKRS App"]
  },
  {
    id: 5,
    name: "Nike SB Dunk Low Pro",
    price: 120,
    image: "https://via.placeholder.com/300x200/AA96DA/FFFFFF?text=SB+Dunk+Low",
    availability: "Coming Soon",
    status: "coming-soon",
    releaseDate: "December 20, 2025",
    stores: ["Nike.com", "Skate Shops"]
  },
  {
    id: 6,
    name: "Nike Air Max 97",
    price: 175,
    image: "https://via.placeholder.com/300x200/FCBAD3/FFFFFF?text=Air+Max+97",
    availability: "Coming Soon",
    status: "coming-soon",
    releaseDate: "January 5, 2026",
    stores: ["Nike.com", "Foot Locker"]
  },
  // Rare & Affordable
  {
    id: 7,
    name: "Nike Blazer Mid '77 Vintage",
    price: 100,
    image: "https://via.placeholder.com/300x200/A8D8EA/FFFFFF?text=Blazer+Mid",
    availability: "Rare & Affordable",
    status: "rare",
    stores: ["StockX", "GOAT", "Grailed"]
  },
  {
    id: 8,
    name: "Nike Cortez Leather",
    price: 90,
    image: "https://via.placeholder.com/300x200/FFAAA5/FFFFFF?text=Cortez",
    availability: "Rare & Affordable",
    status: "rare",
    stores: ["StockX", "eBay"]
  },
  {
    id: 9,
    name: "Nike Air Pegasus 83",
    price: 95,
    image: "https://via.placeholder.com/300x200/FF8B94/FFFFFF?text=Pegasus+83",
    availability: "Rare & Affordable",
    status: "rare",
    stores: ["GOAT", "Grailed", "eBay"]
  }
];

// API Routes

// Get all shoes
app.get('/api/shoes', (req, res) => {
  const { status } = req.query;
  let filteredShoes = shoes;
  
  if (status) {
    filteredShoes = shoes.filter(shoe => shoe.status === status);
  }
  
  res.json(filteredShoes);
});

// Get single shoe
app.get('/api/shoes/:id', (req, res) => {
  const shoe = shoes.find(s => s.id === parseInt(req.params.id));
  if (shoe) {
    res.json(shoe);
  } else {
    res.status(404).json({ error: 'Shoe not found' });
  }
});

// Get wishlist
app.get('/api/wishlist', (req, res) => {
  const wishlistShoes = shoes.filter(shoe => wishlist.has(shoe.id));
  res.json(wishlistShoes);
});

// Add to wishlist
app.post('/api/wishlist/:id', (req, res) => {
  const shoeId = parseInt(req.params.id);
  const shoe = shoes.find(s => s.id === shoeId);
  
  if (shoe) {
    wishlist.add(shoeId);
    res.json({ success: true, message: 'Added to wishlist' });
  } else {
    res.status(404).json({ error: 'Shoe not found' });
  }
});

// Remove from wishlist
app.delete('/api/wishlist/:id', (req, res) => {
  const shoeId = parseInt(req.params.id);
  wishlist.delete(shoeId);
  res.json({ success: true, message: 'Removed from wishlist' });
});

// Subscribe to email notifications
app.post('/api/subscribe', (req, res) => {
  const { email, shoeId } = req.body;
  
  if (!email || !shoeId) {
    return res.status(400).json({ error: 'Email and shoe ID required' });
  }
  
  // Server-side email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  const shoe = shoes.find(s => s.id === parseInt(shoeId));
  if (!shoe) {
    return res.status(404).json({ error: 'Shoe not found' });
  }
  
  if (shoe.status !== 'coming-soon') {
    return res.status(400).json({ error: 'Can only subscribe to upcoming releases' });
  }
  
  if (!emailSubscriptions.has(email)) {
    emailSubscriptions.set(email, new Set());
  }
  
  emailSubscriptions.get(email).add(parseInt(shoeId));
  
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
  //   text: `${shoe.name} will be released on ${shoe.releaseDate}!`
  // });
  
  // For now, we just log the subscription
  console.log(`Email subscription: ${email} subscribed to shoe ID ${shoeId} (${shoe.name})`);
  
  res.json({ 
    success: true, 
    message: `You'll be notified at ${email} when ${shoe.name} is released!` 
  });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nike Sneaker Shop running on http://localhost:${PORT}`);
});
