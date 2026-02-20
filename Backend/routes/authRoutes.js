const express = require('express');
const router = express.Router();
require('dotenv').config();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Validate credentials
        if (email === adminEmail && password === adminPassword) {
            res.status(200).json({
                success: true,
                message: 'Login successful'
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

module.exports = router;