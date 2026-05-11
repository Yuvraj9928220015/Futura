const Contact = require('../models/contactModels');

// POST - New enquiry submit karna
const submitEnquiry = async (req, res) => {
    try {
        const {
            title,
            firstName,
            lastName,
            email,
            phone,
            preferredLanguage,
            natureOfEnquiry,
            country,
            subject,
            details,
            receiveUpdates,
            agreeToPrivacy
        } = req.body;

        // Basic validation
        if (!title || !firstName || !lastName || !email || !phone || !natureOfEnquiry || !subject || !details) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        const newContact = await Contact.create({
            title,
            firstName,
            lastName,
            email,
            phone,
            preferredLanguage,
            natureOfEnquiry,
            country,
            subject,
            details,
            receiveUpdates: receiveUpdates || false,
            agreeToPrivacy: agreeToPrivacy || false
        });

        res.status(201).json({
            success: true,
            message: 'Your enquiry has been submitted successfully. We will get back to you soon.',
            data: newContact
        });

    } catch (error) {
        console.error('❌ Contact submit error:', error.message);

        // Mongoose validation error
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

// GET - Saari enquiries fetch karna (Admin ke liye)
const getAllEnquiries = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [enquiries, total] = await Promise.all([
            Contact.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Contact.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: enquiries
        });

    } catch (error) {
        console.error('❌ Get enquiries error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

// PATCH - Enquiry ka status update karna (Admin ke liye)
const updateEnquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Use: pending, read, or replied'
            });
        }

        const updated = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            data: updated
        });

    } catch (error) {
        console.error('❌ Update status error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

// DELETE - Enquiry delete karna (Admin ke liye)
const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Contact.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Enquiry deleted successfully'
        });

    } catch (error) {
        console.error('❌ Delete enquiry error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

module.exports = {
    submitEnquiry,
    getAllEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
};