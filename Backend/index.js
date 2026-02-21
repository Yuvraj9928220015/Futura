const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Read from .env ONLY - No fallback
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 8000;

// Validate that MONGO_URL exists
if (!MONGO_URL) {
    console.error('❌ ERROR: MONGO_URL not found in .env file!');
    console.error('Please add MONGO_URL in your .env file');
    process.exit(1);
}

// Show which database is being used
const dbType = MONGO_URL.includes('mongodb+srv') ? '☁️  MongoDB Atlas (Live)' : '💻 Local MongoDB';
console.log('Database Type:', dbType);
console.log('MongoDB URL:', MONGO_URL.substring(0, 40) + '...');

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📦 API available at http://localhost:${PORT}/api/products`);
            console.log(`🔐 Auth API available at http://localhost:${PORT}/api/auth`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});