require('dotenv').config();
const express = require('express');

const { getDb } = require('./db');
const { seedOrders } = require('./seed');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');

seedOrders(getDb());

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`ecommerce-api running on http://localhost:${PORT}`);
});

//test flow