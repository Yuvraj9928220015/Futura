const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        emailAddress: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
            default: '',
        },
        message: {
            type: String,
            trim: true,
            maxlength: [1000, 'Message cannot exceed 1000 characters'],
            default: '',
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Popup', popupSchema);