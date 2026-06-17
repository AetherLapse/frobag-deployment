const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const cartRoutes = require('./routes/cart.route');
const contactRoutes = require('./routes/contact.route');
const orderRoutes = require('./routes/order.route');
const dashboardRoutes = require('./routes/dashboard.route');
const wishlistRoutes = require('./routes/wishlist.route');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/api/test', (req, res) => res.send('Frobag API is working 🚀'));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Serve React frontend
app.use(express.static(path.join(__dirname, '../build')));

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

module.exports = app;