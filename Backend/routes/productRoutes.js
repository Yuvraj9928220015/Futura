const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // 🔥 added

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productControllres');

// ensure uploads folder
const uploadPath = './uploads';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// file filter
const fileFilter = (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif|webp|svg/;
    const videoTypes = /mp4|mov|avi|wmv|mkv|flv|webm/;

    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    const mimetype = file.mimetype;

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

    if (file.fieldname === 'video') {
        const isValidVideo = videoTypes.test(extname) && mimetype.startsWith('video/');
        if (isValidVideo) return cb(null, true);
        return cb(new Error('Invalid video format'));
    }

    cb(new Error('Invalid file type'));
};

// multer config
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 120
    }
});

// upload middleware
const handleUpload = (req, res, next) => {
    const uploadFields = [
        { name: 'images', maxCount: 20 },
        { name: 'video', maxCount: 1 },
        { name: 'icons', maxCount: 5 },
        { name: 'swatches', maxCount: 30 }
    ];

    for (let i = 0; i < 30; i++) {
        uploadFields.push({ name: `variant_${i}`, maxCount: 30 });
    }

    const uploadHandler = upload.fields(uploadFields);

    uploadHandler(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message || 'Upload error'
            });
        }
        next();
    });
};



// 🔥🔥🔥 IMAGE COMPRESSION MIDDLEWARE
const compressImagesMiddleware = async (req, res, next) => {
    try {
        if (!req.files) return next();

        const processFiles = async (filesArray) => {
            for (let file of filesArray) {
                const inputPath = file.path;

                // skip videos
                if (file.mimetype.startsWith("video/")) continue;

                const outputFileName = `compressed-${Date.now()}-${file.filename}.webp`;
                const outputPath = path.join("uploads", outputFileName);

                await sharp(inputPath)
                    .resize(800)
                    .webp({ quality: 70 })
                    .toFile(outputPath);

                // delete original
                fs.unlinkSync(inputPath);

                // replace file info
                file.path = outputPath;
                file.filename = outputFileName;
            }
        };

        for (let key in req.files) {
            await processFiles(req.files[key]);
        }

        next();
    } catch (err) {
        console.error("Compression error:", err);
        next(err);
    }
};


// debug middleware
const debugMiddleware = (req, res, next) => {
    console.log('=== DEBUG ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('============');
    next();
};


// ROUTES
router.get('/', getProducts);
router.get('/:id', getProductById);

// 🔥 compression added here
router.post('/', debugMiddleware, handleUpload, compressImagesMiddleware, addProduct);
router.put('/:id', debugMiddleware, handleUpload, compressImagesMiddleware, updateProduct);

router.delete('/:id', deleteProduct);


// error handler
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
        message: 'Internal server error',
        error: error.message
    });
});

module.exports = router;