const Product = require('../models/productModels');
const fs = require('fs');
const path = require('path');


const deleteFilesOnError = (files) => {
    if (!files) return;
    const allFiles = [];
    if (files.images) allFiles.push(...files.images);
    if (files.video) allFiles.push(...files.video);
    if (files.icons) allFiles.push(...files.icons);
    if (files.swatches) allFiles.push(...files.swatches);
    if (files.pdf) allFiles.push(...files.pdf);

    Object.keys(files).forEach(key => {
        if (key.startsWith('variant_')) {
            allFiles.push(...files[key]);
        }
    });

    allFiles.forEach(file => {
        const filePath = path.resolve(file.path);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting orphaned file:', err);
        });
    });
};


const deleteFile = (filePath) => {
    if (!filePath) return;
    const fullPath = path.resolve(filePath);
    fs.unlink(fullPath, (err) => {
        if (err) console.error('Error deleting file:', err);
    });
};

// ─────────────────────────────────────────────
// GET /api/products
// ─────────────────────────────────────────────
exports.getProducts = async (req, res) => {
    try {
        const { category, color, sortBy, sortOrder } = req.query;
        const filter = {};

        if (category && category.trim() !== '') {
            filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
        }

        if (color && color.trim() !== '') {
            const colorRegex = new RegExp(color.trim(), 'i');
            filter.$or = [
                { color: { $regex: colorRegex } },
                { 'variants.color': { $regex: colorRegex } }
            ];
        }

        let sort = {};
        if (sortBy && sortBy.trim() !== '') {
            sort[sortBy.trim()] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort = { createdAt: -1 };
        }

        const products = await Product.find(filter).sort(sort);
        res.status(200).json(products);

    } catch (error) {
        console.error('Error in getProducts:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/products/:id
// ─────────────────────────────────────────────
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);

    } catch (error) {
        console.error('Error in getProductById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ─────────────────────────────────────────────
// POST /api/products
// ─────────────────────────────────────────────
exports.addProduct = async (req, res) => {
    try {
        console.log('=== addProduct ===');
        console.log('Body:', req.body);
        console.log('Files:', req.files);

        const {
            title,
            price,
            category,
            description,
            color,
            colorName,
            baseVariantName,
            iconNames,
            Flammable,
            resistant,
            QUV,
            Weatherometer,
            Abrasion,
            AntiMicrobial,
            PinkStain,
            Antiflammable,
            Cold,
            QUVResistant,
            Weath,
            Wyzenback,
            SafeAnti,
            SafePink,
            variantNames,
            variantColors,
            variantColorNames,
            variantGrain,
        } = req.body;

        const images = req.files?.images || [];
        const videoArr = req.files?.video || [];
        const icons = req.files?.icons || [];
        const swatches = req.files?.swatches || [];
        const video = videoArr.length > 0 ? videoArr[0] : null;

        const pdfArr = req.files?.pdf || [];
        const pdfFile = pdfArr.length > 0 ? pdfArr[0] : null;

        // ── Validation ──
        if (!title || !price || !category || !description) {
            deleteFilesOnError(req.files);
            return res.status(400).json({
                message: 'Please fill all required fields: title, price, category, and description.'
            });
        }

        if (images.length === 0) {
            deleteFilesOnError(req.files);
            return res.status(400).json({ message: 'Please upload at least one product image.' });
        }

        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            deleteFilesOnError(req.files);
            return res.status(400).json({ message: 'Please provide a valid price greater than 0.' });
        }

        // ── File paths ──
        const imagePaths = images.map(f => f.path);
        const videoPath = video ? video.path : null;
        const iconPaths = icons.map(f => f.path);
        const swatchPaths = swatches.map(f => f.path);
        const pdfPath = pdfFile ? pdfFile.path : null;

        // ── Parse iconNames ──
        let parsedIconNames = [];
        if (iconNames) {
            try { parsedIconNames = JSON.parse(iconNames); }
            catch { parsedIconNames = []; }
        }
        // Ensure same length as iconPaths, fill empty strings if needed
        while (parsedIconNames.length < iconPaths.length) parsedIconNames.push('');

        // ── Variants ──
        let variants = [];
        if (variantNames) {
            let parsedVariantNames;
            let parsedVariantColors = [];
            let parsedVariantColorNames = [];
            let parsedVariantGrains = [];

            try {
                parsedVariantNames = JSON.parse(variantNames);
            } catch {
                deleteFilesOnError(req.files);
                return res.status(400).json({ message: 'Invalid variantNames format.' });
            }

            if (variantColors) {
                try { parsedVariantColors = JSON.parse(variantColors); }
                catch { parsedVariantColors = []; }
            }

            if (variantColorNames) {
                try { parsedVariantColorNames = JSON.parse(variantColorNames); }
                catch { parsedVariantColorNames = []; }
            }

            if (variantGrain) {
                try { parsedVariantGrains = JSON.parse(variantGrain); }
                catch { parsedVariantGrains = []; }
            }

            for (let i = 0; i < parsedVariantNames.length; i++) {
                const variantKey = `variant_${i}`;
                const variantImages = (req.files && req.files[variantKey]) ? req.files[variantKey] : [];

                if (variantImages.length === 0) {
                    deleteFilesOnError(req.files);
                    return res.status(400).json({
                        message: `Please upload at least one image for variant: "${parsedVariantNames[i]}"`
                    });
                }

                if (variantImages.length > 30) {
                    deleteFilesOnError(req.files);
                    return res.status(400).json({
                        message: `Maximum 30 images allowed per variant. Variant: "${parsedVariantNames[i]}"`
                    });
                }

                variants.push({
                    name: parsedVariantNames[i].trim(),
                    color: parsedVariantColors[i] ? parsedVariantColors[i].trim() : '',
                    colorName: parsedVariantColorNames[i] ? parsedVariantColorNames[i].trim() : '',
                    grain: parsedVariantGrains[i] ? parsedVariantGrains[i].trim() : '',
                    images: variantImages.map(f => f.path)
                });
            }
        }

        // ── Save product ──
        const newProduct = new Product({
            sessionId: req.sessionID || '',
            title: title.trim(),
            category: category.trim(),
            description: description.trim(),
            price: priceValue,
            color: color ? color.trim() : '',
            colorName: colorName ? colorName.trim() : '',
            baseVariantName: baseVariantName ? baseVariantName.trim() : '',
            image: imagePaths,
            video: videoPath,
            pdf: pdfPath,
            icons: iconPaths,
            iconNames: parsedIconNames,
            swatches: swatchPaths,
            variants: variants,
            Flammable: Flammable || '',
            resistant: resistant || '',
            QUV: QUV || '',
            Weatherometer: Weatherometer || '',
            Abrasion: Abrasion || '',
            AntiMicrobial: AntiMicrobial || '',
            PinkStain: PinkStain || '',
            Antiflammable: Antiflammable || '',
            Cold: Cold || '',
            QUVResistant: QUVResistant || '',
            Weath: Weath || '',
            Wyzenback: Wyzenback || '',
            SafeAnti: SafeAnti || '',
            SafePink: SafePink || '',
        });

        const savedProduct = await newProduct.save();
        console.log('Product saved:', savedProduct._id);

        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct
        });

    } catch (error) {
        console.error('Error in addProduct:', error);
        deleteFilesOnError(req.files);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation Error', errors });
        }

        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ─────────────────────────────────────────────
// PUT /api/products/:id
// ─────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
    try {
        console.log('=== updateProduct ===');
        console.log('Body:', req.body);
        console.log('Files:', req.files);

        const {
            title,
            price,
            category,
            description,
            color,
            colorName,
            baseVariantName,
            imageOrder,
            iconOrder,
            iconNames,
            swatchOrder,
            variantNames,
            variantColors,
            variantColorNames,
            variantGrains,
            variantOrders,
            Flammable,
            resistant,
            QUV,
            Weatherometer,
            Abrasion,
            AntiMicrobial,
            PinkStain,
            Antiflammable,
            Cold,
            QUVResistant,
            Weath,
            Wyzenback,
            SafeAnti,
            SafePink,
        } = req.body;

        const newImageFiles = req.files?.images || [];
        const newVideoArr = req.files?.video || [];
        const newIconFiles = req.files?.icons || [];
        const newSwatchFiles = req.files?.swatches || [];
        const newVideoFile = newVideoArr.length > 0 ? newVideoArr[0] : null;

        const newPdfArr = req.files?.pdf || [];
        const newPdfFile = newPdfArr.length > 0 ? newPdfArr[0] : null;

        // ── Find product ──
        const product = await Product.findById(req.params.id);
        if (!product) {
            deleteFilesOnError(req.files);
            return res.status(404).json({ message: 'Product not found' });
        }

        // ──────────────────────────────────────
        // Handle VARIANTS
        // ──────────────────────────────────────
        let finalVariants = [];
        if (variantNames) {
            let parsedVariantNames, parsedVariantOrders;
            let parsedVariantColors = [];
            let parsedVariantColorNames = [];
            let parsedVariantGrains = [];

            try {
                parsedVariantNames = JSON.parse(variantNames);
                parsedVariantOrders = variantOrders ? JSON.parse(variantOrders) : [];
            } catch {
                deleteFilesOnError(req.files);
                return res.status(400).json({ message: 'Invalid variantNames or variantOrders format.' });
            }

            if (variantColors) {
                try { parsedVariantColors = JSON.parse(variantColors); }
                catch { parsedVariantColors = []; }
            }

            if (variantColorNames) {
                try { parsedVariantColorNames = JSON.parse(variantColorNames); }
                catch { parsedVariantColorNames = []; }
            }

            if (variantGrains) {
                try { parsedVariantGrains = JSON.parse(variantGrains); }
                catch { parsedVariantGrains = []; }
            }

            for (let i = 0; i < parsedVariantNames.length; i++) {
                const variantKey = `variant_${i}`;
                const newVariantImages = (req.files && req.files[variantKey]) ? req.files[variantKey] : [];
                const variantOrder = parsedVariantOrders[i] || [];

                let finalVariantImages = [];
                let newVarFileIndex = 0;

                if (variantOrder.length > 0) {
                    variantOrder.forEach(item => {
                        if (item.startsWith('NEW_VARIANT_')) {
                            const newFile = newVariantImages[newVarFileIndex++];
                            if (newFile) finalVariantImages.push(newFile.path);
                        } else {
                            finalVariantImages.push(item);
                        }
                    });
                } else if (newVariantImages.length > 0) {
                    finalVariantImages = newVariantImages.map(f => f.path);
                } else if (product.variants && product.variants[i]) {
                    finalVariantImages = product.variants[i].images || [];
                }

                if (finalVariantImages.length === 0) {
                    deleteFilesOnError(req.files);
                    return res.status(400).json({
                        message: `Each variant must have at least one image. Variant: "${parsedVariantNames[i]}"`
                    });
                }

                let resolvedVariantColor = '';
                if (parsedVariantColors[i] !== undefined && parsedVariantColors[i] !== null) {
                    resolvedVariantColor = parsedVariantColors[i].trim();
                } else if (product.variants && product.variants[i]) {
                    resolvedVariantColor = product.variants[i].color || '';
                }

                let resolvedVariantColorName = '';
                if (parsedVariantColorNames[i] !== undefined && parsedVariantColorNames[i] !== null) {
                    resolvedVariantColorName = parsedVariantColorNames[i].trim();
                } else if (product.variants && product.variants[i]) {
                    resolvedVariantColorName = product.variants[i].colorName || '';
                }

                let resolvedVariantGrain = '';
                if (parsedVariantGrains[i] !== undefined && parsedVariantGrains[i] !== null) {
                    resolvedVariantGrain = parsedVariantGrains[i].trim();
                } else if (product.variants && product.variants[i]) {
                    resolvedVariantGrain = product.variants[i].grain || '';
                }

                finalVariants.push({
                    name: parsedVariantNames[i].trim(),
                    color: resolvedVariantColor,
                    colorName: resolvedVariantColorName,
                    grain: resolvedVariantGrain,
                    images: finalVariantImages
                });

                if (product.variants && product.variants[i]) {
                    const originalImages = product.variants[i].images || [];
                    originalImages
                        .filter(img => !finalVariantImages.includes(img))
                        .forEach(img => deleteFile(img));
                }
            }

            if (product.variants && product.variants.length > parsedVariantNames.length) {
                for (let i = parsedVariantNames.length; i < product.variants.length; i++) {
                    (product.variants[i].images || []).forEach(img => deleteFile(img));
                }
            }
        }

        // ──────────────────────────────────────
        // Handle IMAGES
        // ──────────────────────────────────────
        let parsedImageOrder = [];
        if (imageOrder) {
            try { parsedImageOrder = JSON.parse(imageOrder); }
            catch (e) { console.error('Error parsing imageOrder:', e); }
        }

        let finalImagePaths = [];
        let newImgFileIndex = 0;

        if (parsedImageOrder.length > 0) {
            parsedImageOrder.forEach(item => {
                if (item.startsWith('NEW_FILE_')) {
                    const newFile = newImageFiles[newImgFileIndex++];
                    if (newFile) finalImagePaths.push(newFile.path);
                } else {
                    finalImagePaths.push(item);
                }
            });
        } else if (newImageFiles.length > 0) {
            finalImagePaths = newImageFiles.map(f => f.path);
        } else {
            finalImagePaths = product.image || [];
        }

        (product.image || [])
            .filter(p => !finalImagePaths.includes(p))
            .forEach(p => deleteFile(p));

        // ──────────────────────────────────────
        // Handle ICONS + iconNames
        // ──────────────────────────────────────
        let parsedIconOrder = [];
        if (iconOrder) {
            try { parsedIconOrder = JSON.parse(iconOrder); }
            catch (e) { console.error('Error parsing iconOrder:', e); }
        }

        // Parse iconNames sent from frontend (parallel to final icon order)
        let parsedIconNames = [];
        if (iconNames) {
            try { parsedIconNames = JSON.parse(iconNames); }
            catch { parsedIconNames = []; }
        }

        let finalIconPaths = [];
        let finalIconNames = [];
        let newIconFileIndex = 0;

        if (parsedIconOrder.length > 0) {
            parsedIconOrder.forEach((item, idx) => {
                if (item.startsWith('NEW_ICON_')) {
                    const newFile = newIconFiles[newIconFileIndex++];
                    if (newFile) {
                        finalIconPaths.push(newFile.path);
                        finalIconNames.push(parsedIconNames[idx] || '');
                    }
                } else {
                    finalIconPaths.push(item);
                    finalIconNames.push(parsedIconNames[idx] || '');
                }
            });
        } else if (newIconFiles.length > 0) {
            finalIconPaths = newIconFiles.map(f => f.path);
            finalIconNames = newIconFiles.map((_, idx) => parsedIconNames[idx] || '');
        } else {
            finalIconPaths = product.icons || [];
            finalIconNames = product.iconNames || [];
            // Sync lengths
            while (finalIconNames.length < finalIconPaths.length) finalIconNames.push('');
        }

        (product.icons || [])
            .filter(p => !finalIconPaths.includes(p))
            .forEach(p => deleteFile(p));

        // ──────────────────────────────────────
        // Handle SWATCHES
        // ──────────────────────────────────────
        let parsedSwatchOrder = [];
        if (swatchOrder) {
            try { parsedSwatchOrder = JSON.parse(swatchOrder); }
            catch (e) { console.error('Error parsing swatchOrder:', e); }
        }

        let finalSwatchPaths = [];
        let newSwatchFileIndex = 0;

        if (parsedSwatchOrder.length > 0) {
            parsedSwatchOrder.forEach(item => {
                if (item.startsWith('NEW_SWATCH_')) {
                    const newFile = newSwatchFiles[newSwatchFileIndex++];
                    if (newFile) finalSwatchPaths.push(newFile.path);
                } else {
                    finalSwatchPaths.push(item);
                }
            });
        } else if (newSwatchFiles.length > 0) {
            finalSwatchPaths = newSwatchFiles.map(f => f.path);
        } else {
            finalSwatchPaths = product.swatches || [];
        }

        (product.swatches || [])
            .filter(p => !finalSwatchPaths.includes(p))
            .forEach(p => deleteFile(p));

        // ──────────────────────────────────────
        // Handle VIDEO
        // ──────────────────────────────────────
        let finalVideoPath = product.video;

        if (newVideoFile) {
            if (product.video) deleteFile(product.video);
            finalVideoPath = newVideoFile.path;
        } else if (req.body.removeVideo === 'true') {
            if (product.video) deleteFile(product.video);
            finalVideoPath = null;
        }

        // ──────────────────────────────────────
        // Handle PDF
        // ──────────────────────────────────────
        let finalPdfPath = product.pdf;

        if (newPdfFile) {
            if (product.pdf) deleteFile(product.pdf);
            finalPdfPath = newPdfFile.path;
        } else if (req.body.removePdf === 'true') {
            if (product.pdf) deleteFile(product.pdf);
            finalPdfPath = null;
        }

        // ──────────────────────────────────────
        // Validate price
        // ──────────────────────────────────────
        let priceValue = product.price;
        if (price && price.toString().trim() !== '') {
            priceValue = parseFloat(price);
            if (isNaN(priceValue) || priceValue <= 0) {
                deleteFilesOnError(req.files);
                return res.status(400).json({ message: 'Please provide a valid price greater than 0.' });
            }
        }

        // ──────────────────────────────────────
        // Update product fields
        // ──────────────────────────────────────
        product.title = title && title.trim() ? title.trim() : product.title;
        product.category = category && category.trim() ? category.trim() : product.category;
        product.description = description && description.trim() ? description.trim() : product.description;
        product.price = priceValue;
        product.color = color !== undefined && color !== null ? color.trim() : product.color;
        product.colorName = colorName !== undefined && colorName !== null ? colorName.trim() : product.colorName;
        product.baseVariantName = baseVariantName !== undefined ? baseVariantName.trim() : product.baseVariantName;

        product.image = finalImagePaths;
        product.video = finalVideoPath;
        product.pdf = finalPdfPath;
        product.icons = finalIconPaths;
        product.iconNames = finalIconNames;
        product.swatches = finalSwatchPaths;

        product.variants = finalVariants.length > 0 ? finalVariants : product.variants;

        product.markModified('variants');
        product.markModified('image');
        product.markModified('icons');
        product.markModified('iconNames');
        product.markModified('swatches');

        // Original properties
        product.Flammable = Flammable ?? product.Flammable;
        product.resistant = resistant ?? product.resistant;
        product.QUV = QUV ?? product.QUV;
        product.Weatherometer = Weatherometer ?? product.Weatherometer;
        product.Abrasion = Abrasion ?? product.Abrasion;
        product.AntiMicrobial = AntiMicrobial ?? product.AntiMicrobial;
        product.PinkStain = PinkStain ?? product.PinkStain;

        // New properties
        product.Antiflammable = Antiflammable ?? product.Antiflammable;
        product.Cold = Cold ?? product.Cold;
        product.QUVResistant = QUVResistant ?? product.QUVResistant;
        product.Weath = Weath ?? product.Weath;
        product.Wyzenback = Wyzenback ?? product.Wyzenback;
        product.SafeAnti = SafeAnti ?? product.SafeAnti;
        product.SafePink = SafePink ?? product.SafePink;

        const updatedProduct = await product.save();
        console.log('Product updated:', updatedProduct._id);

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error('Error in updateProduct:', error);
        deleteFilesOnError(req.files);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation Error', errors });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ─────────────────────────────────────────────
// DELETE /api/products/:id
// ─────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        (product.image || []).forEach(p => deleteFile(p));
        (product.icons || []).forEach(p => deleteFile(p));
        (product.swatches || []).forEach(p => deleteFile(p));
        if (product.video) deleteFile(product.video);
        if (product.pdf) deleteFile(product.pdf);

        (product.variants || []).forEach(variant => {
            (variant.images || []).forEach(p => deleteFile(p));
        });

        await Product.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Error in deleteProduct:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};