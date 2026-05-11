const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productControllres');

// ─────────────────────────────────────────────
// CONSTANTS — ek jagah badlo, sab jagah update
// ─────────────────────────────────────────────
const MAX_VARIANTS = 100;
const MAX_IMAGES_PER_VARIANT = 30;
const MAX_PRODUCT_IMAGES = 20;
const MAX_ICONS = 5;
const MAX_SWATCHES = 30;

const MAX_TOTAL_FILES =
    MAX_PRODUCT_IMAGES +
    1 +
    MAX_ICONS +
    MAX_SWATCHES +
    1 +
    MAX_VARIANTS * MAX_IMAGES_PER_VARIANT;

// ─────────────────────────────────────────────
// Ensure uploads folder exists
// ─────────────────────────────────────────────
const uploadPath = './uploads';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// ─────────────────────────────────────────────
// Multer storage config
// ─────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// ─────────────────────────────────────────────
// File filter — image / video / pdf validation
// ─────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif|webp|svg/;
    const videoTypes = /mp4|mov|avi|wmv|mkv|flv|webm/;

    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    const mimetype = file.mimetype;

    // PDF field — only application/pdf allowed
    if (file.fieldname === 'pdf') {
        const isValidPdf = extname === 'pdf' && mimetype === 'application/pdf';
        if (isValidPdf) return cb(null, true);
        return cb(new Error('Only PDF files are allowed for the pdf field'));
    }

    // Image fields
    if (
        file.fieldname === 'images' ||
        file.fieldname === 'icons' ||
        file.fieldname === 'swatches' ||
        file.fieldname.startsWith('variant_')
    ) {
        const isValidImage = imageTypes.test(extname) && mimetype.startsWith('image/');
        if (isValidImage) return cb(null, true);
        return cb(new Error(`${file.fieldname} must be image format`));
    }

    // Video field
    if (file.fieldname === 'video') {
        const isValidVideo = videoTypes.test(extname) && mimetype.startsWith('video/');
        if (isValidVideo) return cb(null, true);
        return cb(new Error('Invalid video format'));
    }

    cb(new Error('Invalid file type'));
};

// ─────────────────────────────────────────────
// Multer instance
// ─────────────────────────────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: MAX_TOTAL_FILES
    }
});

// ─────────────────────────────────────────────
// Upload middleware
// ─────────────────────────────────────────────
const handleUpload = (req, res, next) => {
    const uploadFields = [
        { name: 'images', maxCount: MAX_PRODUCT_IMAGES },
        { name: 'video', maxCount: 1 },
        { name: 'icons', maxCount: MAX_ICONS },
        { name: 'swatches', maxCount: MAX_SWATCHES },
        { name: 'pdf', maxCount: 1 },
    ];

    for (let i = 0; i < MAX_VARIANTS; i++) {
        uploadFields.push({ name: `variant_${i}`, maxCount: MAX_IMAGES_PER_VARIANT });
    }

    const uploadHandler = upload.fields(uploadFields);

    uploadHandler(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                message: `Upload error: ${err.message}`,
                code: err.code
            });
        }
        if (err) {
            return res.status(400).json({ message: err.message || 'Upload error' });
        }
        next();
    });
};

const compressImagesMiddleware = async (req, res, next) => {
    try {
        if (!req.files) return next();

        const processFiles = async (filesArray) => {
            for (let file of filesArray) {
                const inputPath = file.path;

                // Skip videos and PDFs
                if (file.mimetype.startsWith('video/')) continue;
                if (file.mimetype === 'application/pdf') continue;

                const outputFileName = `compressed-${Date.now()}-${file.filename}.webp`;
                const outputPath = path.join('uploads', outputFileName);

                await sharp(inputPath)
                    .resize(800)
                    .webp({ quality: 70 })
                    .toFile(outputPath);

                // Delete original
                fs.unlinkSync(inputPath);

                // Update file metadata
                file.path = outputPath;
                file.filename = outputFileName;
            }
        };

        for (let key in req.files) {
            await processFiles(req.files[key]);
        }

        next();
    } catch (err) {
        console.error('Compression error:', err);
        next(err);
    }
};

// ─────────────────────────────────────────────
// Debug middleware (remove in production)
// ─────────────────────────────────────────────
const debugMiddleware = (req, res, next) => {
    console.log('=== DEBUG ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('============');
    next();
};

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', debugMiddleware, handleUpload, compressImagesMiddleware, addProduct);
router.put('/:id', debugMiddleware, handleUpload, compressImagesMiddleware, updateProduct);

router.delete('/:id', deleteProduct);

// ─────────────────────────────────────────────
// Global error handler
// ─────────────────────────────────────────────
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
        message: 'Internal server error',
        error: error.message
    });
});

module.exports = router;