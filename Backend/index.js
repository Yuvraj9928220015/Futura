const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log("ADMIN EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN PASSWORD:", process.env.ADMIN_PASSWORD);

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 8000;

if (!MONGO_URL) {
    console.error('❌ ERROR: MONGO_URL not found in .env file!');
    process.exit(1);
}

const dbType = MONGO_URL.includes('mongodb+srv') ? '☁️  MongoDB Atlas (Live)' : '💻 Local MongoDB';
console.log('Database Type:', dbType);
console.log('MongoDB URL:', MONGO_URL.substring(0, 40) + '...');

// ✅ FIXED: Sirf cors() — app.options bilkul nahi, wahi crash karta tha
app.use(cors({
    origin: [
        'https://futuratextiles.in',
        'https://www.futuratextiles.in',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:4173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: false
}));

// Body parsers
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
    res.json({
        message: '✅ Futura Textiles API is running!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Global error:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});

// MongoDB connect
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
            console.log(`🔐 Auth API:     http://localhost:${PORT}/api/auth`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    });