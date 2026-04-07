const express = require('express');
const router = express.Router();
const {
    submitEnquiry,
    getAllEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
} = require('../controllers/contactControllres');

// Public route - User contact form submit karta hai
router.post('/submit', submitEnquiry);

// Admin routes - Enquiries manage karne ke liye
router.get('/all', getAllEnquiries);                     // GET /api/contact/all
router.patch('/status/:id', updateEnquiryStatus);       // PATCH /api/contact/status/:id
router.delete('/:id', deleteEnquiry);                   // DELETE /api/contact/:id

module.exports = router;