const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productControllres');

const uploadPath = './uploads';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }   
});

const fileFilter = (req, file, cb) => {
    console.log('File being processed:', file);

    const imageTypes = /jpeg|jpg|png|gif|webp|svg/;
    const videoTypes = /mp4|mov|avi|wmv|mkv|flv|webm/;

    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    const mimetype = file.mimetype;

    console.log('File extension:', extname);
    console.log('File mimetype:', mimetype);

    if (file.fieldname === 'images' || file.fieldname === 'icons' || 
        file.fieldname === 'swatches' || file.fieldname.startsWith('variant_')) {
        const isValidImage = imageTypes.test(extname) && mimetype.startsWith('image/');

        if (isValidImage) {
            console.log(`Valid ${file.fieldname} file accepted`);
            return cb(null, true);
        } else {
            console.log(`Invalid ${file.fieldname} file rejected`);
            return cb(new Error(`${file.fieldname} must be jpeg, jpg, png, gif, webp, or svg format`));
        }
    }

    // Check if it's a video field
    if (file.fieldname === 'video') {
        const isValidVideo = videoTypes.test(extname) && mimetype.startsWith('video/');

        if (isValidVideo) {
            console.log('Valid video file accepted');
            return cb(null, true);
        } else {
            console.log('Invalid video file rejected');
            return cb(new Error('Videos must be mp4, mov, avi, wmv, mkv, flv, or webm format'));
        }
    }

    console.log('Unknown file field or invalid file type');
    cb(new Error('Invalid file type or field name'));
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 120
    }
});

const handleUpload = (req, res, next) => {
    console.log('Upload middleware called');

    const uploadFields = [
        { name: 'images', maxCount: 20 },
        { name: 'video', maxCount: 1 },
        { name: 'icons', maxCount: 5 },
        { name: 'swatches', maxCount: 30 }
    ];

    // FIXED: Changed from 10 to 20 to support up to 20 variants
    for (let i = 0; i < 30; i++) {
        uploadFields.push({ name: `variant_${i}`, maxCount: 30 });
    }

    const uploadHandler = upload.fields(uploadFields);

    uploadHandler(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);

            if (err instanceof multer.MulterError) {
                let message = 'Upload Error';

                switch (err.code) {
                    case 'LIMIT_FILE_SIZE':
                        message = 'File too large. Maximum size is 100MB per file.';
                        break;
                    case 'LIMIT_FILE_COUNT':
                        message = 'Too many files uploaded.';
                        break;
                    case 'LIMIT_FIELD_COUNT':
                        message = 'Too many fields in the request.';
                        break;
                    case 'LIMIT_UNEXPECTED_FILE':
                        message = `Unexpected file field: ${err.field}. Please ensure you're not exceeding the variant limit.`;
                        break;
                    default:
                        message = `Upload Error: ${err.message}`;
                }

                return res.status(400).json({
                    message: message,
                    error: err.code
                });
            }

            return res.status(400).json({
                message: err.message || 'File upload error'
            });
        }

        console.log('Files uploaded successfully:', req.files);
        next();
    });
};

// Debug middleware
const debugMiddleware = (req, res, next) => {
    console.log('=== Request Debug Info ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('========================');
    next();
};

// Routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', debugMiddleware, handleUpload, addProduct);
router.put('/:id', debugMiddleware, handleUpload, updateProduct);
router.delete('/:id', deleteProduct);

// Error handling middleware
router.use((error, req, res, next) => {
    console.error('Router error:', error);
    res.status(500).json({
        message: 'Internal server error',
        error: error.message
    });
});

module.exports = router;