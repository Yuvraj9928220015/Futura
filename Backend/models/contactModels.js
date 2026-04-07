const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'],
            required: [true, 'Title is required']
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },
        preferredLanguage: {
            type: String,
            enum: ['English', 'Hindi', 'Arabic', 'French', 'Spanish', ''],
            default: ''
        },
        natureOfEnquiry: {
            type: String,
            required: [true, 'Nature of enquiry is required'],
            enum: ['General Enquiry', 'Product Information', 'Custom Order', 'Support', 'Partnership']
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            default: 'India'
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true
        },
        details: {
            type: String,
            required: [true, 'Details are required'],
            trim: true
        },
        receiveUpdates: {
            type: Boolean,
            default: false
        },
        agreeToPrivacy: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['pending', 'read', 'replied'],
            default: 'pending'
        }
    },
    {
        timestamps: true  // createdAt aur updatedAt auto set hoga
    }
);

module.exports = mongoose.model('Contact', contactSchema);