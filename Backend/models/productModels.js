const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Variant name is required'],
        trim: true
    },
    color: {
        type: String,
        default: "",
        trim: true
    },
    colorName: {
        type: String,
        default: "",
        trim: true
    },
    grain: {
        type: String,
        default: "",
        trim: true
    },
    images: {
        type: [String],
        required: [true, 'At least one variant image is required'],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Each variant must have at least one image'
        }
    }
});

const productSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    color: {
        type: String,
        default: "",
        trim: true
    },
    colorName: {
        type: String,
        default: "",
        trim: true
    },
    grain: {
        type: String,
        default: "",
        trim: true
    },
    image: {
        type: [String],
        default: []
    },
    video: {
        type: String,
        default: null
    },
    pdf: {
        type: String,
        default: null
    },
    icons: {
        type: [String],
        default: []
    },
    // ── NEW: icon display names (parallel array to icons) ──
    iconNames: {
        type: [String],
        default: []
    },
    swatches: {
        type: [String],
        default: []
    },
    variants: {
        type: [variantSchema],
        default: []
    },
    baseVariantName: {
        type: String,
        default: ""
    },
    // ── Properties — original set ──
    Flammable: {
        type: String,
        default: ""
    },
    resistant: {
        type: String,
        default: ""
    },
    QUV: {
        type: String,
        default: ""
    },
    Weatherometer: {
        type: String,
        default: ""
    },
    Abrasion: {
        type: String,
        default: ""
    },
    AntiMicrobial: {
        type: String,
        default: ""
    },
    PinkStain: {
        type: String,
        default: ""
    },
    // ── Properties — new set ──
    Antiflammable: {
        type: String,
        default: ""
    },
    Cold: {
        type: String,
        default: ""
    },
    QUVResistant: {
        type: String,
        default: ""
    },
    Weath: {
        type: String,
        default: ""
    },
    Wyzenback: {
        type: String,
        default: ""
    },
    SafeAnti: {
        type: String,
        default: ""
    },
    SafePink: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;