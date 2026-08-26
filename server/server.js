require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { ensureAdmin } = require('./controllers/authController');

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim());
app.use(cors({ origin: (origin, callback) => !origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Origin not allowed by CORS')), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.get('/api', (req, res) => res.json({ success: true, message: 'ykSells API is running' }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'E-commerce API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);
const port = process.env.PORT || 5000;
if (require.main === module) connectDB().then(ensureAdmin).then(() => app.listen(port, () => console.log(`API listening on ${port}`))).catch((error) => { console.error(error.message); process.exit(1); });
module.exports = app;