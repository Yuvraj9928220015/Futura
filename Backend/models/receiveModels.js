const mongoose = require('mongoose');

const receiveSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    emailAddress: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
}, { timestamps: true });

const Receive = mongoose.model('Receive', receiveSchema);

module.exports = Receive;