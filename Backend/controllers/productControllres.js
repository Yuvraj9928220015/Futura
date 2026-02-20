const Product = require('../models/productModels');
const fs = require('fs');
const path = require('path');

// Helper function to delete files on error
const deleteFilesOnError = (files) => {
    if (!files) return;
    const allFiles = [];
    if (files.images) allFiles.push(...files.images);
    if (files.video) allFiles.push(...files.video);
    if (files.icons) allFiles.push(...files.icons);
    if (files.swatches) allFiles.push(...files.swatches);
    
    // Add variant images
    Object.keys(files).forEach(key => {
        if (key.startsWith('variant_')) {
            allFiles.push(...files[key]);
        }
    });
    
    if (allFiles.length > 0) {
        allFiles.forEach(file => {
            const filePath = path.resolve(file.path);
            fs.unlink(filePath, (err) => {
                if (err) console.log('Error deleting orphaned file:', err);
            });
        });
    }
};

// Helper function to safely delete file
const deleteFile = (filePath) => {
    if (filePath) {
        const fullPath = path.resolve(filePath);
        fs.unlink(fullPath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
};

// Get all products with optional filters
exports.getProducts = async (req, res) => {
    try {
        const { category, sortBy, sortOrder } = req.query;
        const filter = {};

        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        let sort = {};
        if (sortBy) {
            const order = sortOrder === 'desc' ? -1 : 1;
            sort[sortBy] = order;
        } else {
            sort = { createdAt: -1 };
        }

        const products = await Product.find(filter).sort(sort);

        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getProducts:", error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error in getProductById:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Add new product
exports.addProduct = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const { title, price, category, description, Flammable, resistant, QUV, Weatherometer, Abrasion, AntiMicrobial, PinkStain, variantNames } = req.body;
        const images = req.files?.images || [];
        const video = req.files?.video && req.files.video.length > 0 ? req.files.video[0] : null;
        const icons = req.files?.icons || [];
        const swatches = req.files?.swatches || [];

        // Validation
        if (!title || !price || !category || !description) {
            deleteFilesOnError(req.files);
            return res.status(400).json({
                message: 'Please fill all required fields: title, price, category, and description.'
            });
        }

        // Validate price value
        const priceValue = parseFloat(price);

        if (isNaN(priceValue) || priceValue <= 0) {
            deleteFilesOnError(req.files);
            return res.status(400).json({
                message: 'Please provide a valid price.'
            });
        }

        const imagePaths = images.map(file => file.path);
        const videoPath = video ? video.path : null;
        const iconPaths = icons.map(file => file.path);
        const swatchPaths = swatches.map(file => file.path);

        // Process variants
        let variants = [];
        if (variantNames) {
            const parsedVariantNames = JSON.parse(variantNames);
            
            for (let i = 0; i < parsedVariantNames.length; i++) {
                const variantKey = `variant_${i}`;
                const variantImages = req.files[variantKey] || [];
                
                if (variantImages.length === 0) {
                    deleteFilesOnError(req.files);
                    return res.status(400).json({
                        message: `Please upload at least one image for variant: ${parsedVariantNames[i]}`
                    });
                }

                if (variantImages.length > 30) {
                    deleteFilesOnError(req.files);
                    return res.status(400).json({
                        message: `Maximum 10 images allowed per variant. Variant: ${parsedVariantNames[i]}`
                    });
                }

                variants.push({
                    name: parsedVariantNames[i],
                    images: variantImages.map(file => file.path)
                });
            }
        }

        const newProduct = new Product({
            sessionId: req.sessionID,
            title: title.trim(),
            category: category.trim(),
            description: description.trim(),
            price: priceValue,
            image: imagePaths,
            video: videoPath,
            icons: iconPaths,
            swatches: swatchPaths,
            variants: variants,
            Flammable: Flammable || "",
            resistant: resistant || "",
            QUV: QUV || "",
            Weatherometer: Weatherometer || "",
            Abrasion: Abrasion || "",
            AntiMicrobial: AntiMicrobial || "",
            PinkStain: PinkStain || "",
        });

        const savedProduct = await newProduct.save();
        console.log('Product saved successfully:', savedProduct);

        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct
        });

    } catch (error) {
        console.error("Error in addProduct:", error);
        deleteFilesOnError(req.files);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation Error',
                errors
            });
        }

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        console.log('=== Backend Update Product Debug ===');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const { title, price, category, description, imageOrder, iconOrder, swatchOrder, variantNames, variantOrders, Flammable, resistant, QUV, Weatherometer, Abrasion, AntiMicrobial, PinkStain } = req.body;
        const newImageFiles = req.files?.images || [];
        const newVideoFile = req.files?.video && req.files.video.length > 0 ? req.files.video[0] : null;
        const newIconFiles = req.files?.icons || [];
        const newSwatchFiles = req.files?.swatches || [];

        const product = await Product.findById(req.params.id);

        if (!product) {
            deleteFilesOnError(req.files);
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        // Handle variants update
        let finalVariants = [];
        if (variantNames) {
            const parsedVariantNames = JSON.parse(variantNames);
            const parsedVariantOrders = variantOrders ? JSON.parse(variantOrders) : [];
            
            for (let i = 0; i < parsedVariantNames.length; i++) {
                const variantKey = `variant_${i}`;
                const newVariantImages = req.files[variantKey] || [];
                const variantOrder = parsedVariantOrders[i] || [];
                
                let finalVariantImages = [];
                let newFileIndex = 0;

                if (variantOrder.length > 0) {
                    variantOrder.forEach(item => {
                        if (item.startsWith('NEW_VARIANT_')) {
                            const newFile = newVariantImages[newFileIndex++];
                            if (newFile) {
                                finalVariantImages.push(newFile.path);
                            }
                        } else {
                            finalVariantImages.push(item);
                        }
                    });
                } else if (newVariantImages.length > 0) {
                    finalVariantImages = newVariantImages.map(file => file.path);
                } else if (product.variants && product.variants[i]) {
                    finalVariantImages = product.variants[i].images || [];
                }

                if (finalVariantImages.length === 0) {
                    deleteFilesOnError(req.files);
                    return res.status(400).json({
                        message: `Each variant must have at least one image. Variant: ${parsedVariantNames[i]}`
                    });
                }

                finalVariants.push({
                    name: parsedVariantNames[i],
                    images: finalVariantImages
                });

                // Delete removed variant images
                if (product.variants && product.variants[i]) {
                    const originalImages = product.variants[i].images || [];
                    const imagesToDelete = originalImages.filter(img => !finalVariantImages.includes(img));
                    imagesToDelete.forEach(img => deleteFile(img));
                }
            }

            // Delete images from removed variants
            if (product.variants && product.variants.length > parsedVariantNames.length) {
                for (let i = parsedVariantNames.length; i < product.variants.length; i++) {
                    if (product.variants[i].images) {
                        product.variants[i].images.forEach(img => deleteFile(img));
                    }
                }
            }
        }

        // Parse imageOrder
        let parsedImageOrder = [];
        if (imageOrder) {
            try {
                parsedImageOrder = JSON.parse(imageOrder);
            } catch (error) {
                console.error('Error parsing imageOrder:', error);
            }
        }

        // Parse iconOrder
        let parsedIconOrder = [];
        if (iconOrder) {
            try {
                parsedIconOrder = JSON.parse(iconOrder);
            } catch (error) {
                console.error('Error parsing iconOrder:', error);
            }
        }

        // Parse swatchOrder
        let parsedSwatchOrder = [];
        if (swatchOrder) {
            try {
                parsedSwatchOrder = JSON.parse(swatchOrder);
            } catch (error) {
                console.error('Error parsing swatchOrder:', error);
            }
        }

        // Handle image updates
        let finalImagePaths = [];
        let newFileIndex = 0;

        if (parsedImageOrder.length > 0) {
            parsedImageOrder.forEach(item => {
                if (item.startsWith('NEW_FILE_')) {
                    const newFile = newImageFiles[newFileIndex++];
                    if (newFile) {
                        finalImagePaths.push(newFile.path);
                    }
                } else {
                    finalImagePaths.push(item);
                }
            });
        } else if (newImageFiles.length > 0) {
            finalImagePaths = newImageFiles.map(file => file.path);
        } else {
            finalImagePaths = product.image || [];
        }

        const originalImages = product.image || [];
        const imagesToDelete = originalImages.filter(imgPath => !finalImagePaths.includes(imgPath));
        imagesToDelete.forEach(imgPath => deleteFile(imgPath));

        // Handle icon updates
        let finalIconPaths = [];
        let newIconIndex = 0;

        if (parsedIconOrder.length > 0) {
            parsedIconOrder.forEach(item => {
                if (item.startsWith('NEW_ICON_')) {
                    const newIcon = newIconFiles[newIconIndex++];
                    if (newIcon) {
                        finalIconPaths.push(newIcon.path);
                    }
                } else {
                    finalIconPaths.push(item);
                }
            });
        } else if (newIconFiles.length > 0) {
            finalIconPaths = newIconFiles.map(file => file.path);
        } else {
            finalIconPaths = product.icons || [];
        }

        const originalIcons = product.icons || [];
        const iconsToDelete = originalIcons.filter(iconPath => !finalIconPaths.includes(iconPath));
        iconsToDelete.forEach(iconPath => deleteFile(iconPath));

        // Handle swatch updates
        let finalSwatchPaths = [];
        let newSwatchIndex = 0;

        if (parsedSwatchOrder.length > 0) {
            parsedSwatchOrder.forEach(item => {
                if (item.startsWith('NEW_SWATCH_')) {
                    const newSwatch = newSwatchFiles[newSwatchIndex++];
                    if (newSwatch) {
                        finalSwatchPaths.push(newSwatch.path);
                    }
                } else {
                    finalSwatchPaths.push(item);
                }
            });
        } else if (newSwatchFiles.length > 0) {
            finalSwatchPaths = newSwatchFiles.map(file => file.path);
        } else {
            finalSwatchPaths = product.swatches || [];
        }

        const originalSwatches = product.swatches || [];
        const swatchesToDelete = originalSwatches.filter(swatchPath => !finalSwatchPaths.includes(swatchPath));
        swatchesToDelete.forEach(swatchPath => deleteFile(swatchPath));

        // Handle video updates
        let finalVideoPath = product.video;
        const oldVideoPath = product.video;

        if (newVideoFile) {
            finalVideoPath = newVideoFile.path;
            if (oldVideoPath) {
                deleteFile(oldVideoPath);
            }
        } else if (req.body.removeVideo === 'true') {
            finalVideoPath = null;
            if (oldVideoPath) {
                deleteFile(oldVideoPath);
            }
        }

        let priceValue = product.price;

        if (price && price !== '') {
            priceValue = parseFloat(price);
            if (isNaN(priceValue) || priceValue <= 0) {
                deleteFilesOnError(req.files);
                return res.status(400).json({
                    message: 'Please provide a valid price.'
                });
            }
        }

        product.title = title && title.trim() !== '' ? title.trim() : product.title;
        product.price = priceValue;
        product.category = category && category.trim() !== '' ? category.trim() : product.category;
        product.description = description && description.trim() !== '' ? description.trim() : product.description;
        product.image = finalImagePaths;
        product.video = finalVideoPath;
        product.icons = finalIconPaths;
        product.swatches = finalSwatchPaths;
        product.variants = finalVariants.length > 0 ? finalVariants : product.variants;
        product.Flammable = Flammable ?? product.Flammable;
        product.resistant = resistant ?? product.resistant;
        product.QUV = QUV ?? product.QUV;
        product.Weatherometer = Weatherometer ?? product.Weatherometer;
        product.Abrasion = Abrasion ?? product.Abrasion;
        product.AntiMicrobial = AntiMicrobial ?? product.AntiMicrobial;
        product.PinkStain = PinkStain ?? product.PinkStain;

        const updatedProduct = await product.save();
        console.log('Product updated successfully:', updatedProduct);

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error in updateProduct:", error);
        deleteFilesOnError(req.files);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation Error',
                errors
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        // Delete associated files
        if (product.image && product.image.length > 0) {
            product.image.forEach(imgPath => {
                deleteFile(imgPath);
            });
        }

        if (product.video) {
            deleteFile(product.video);
        }

        if (product.icons && product.icons.length > 0) {
            product.icons.forEach(iconPath => {
                deleteFile(iconPath);
            });
        }

        if (product.swatches && product.swatches.length > 0) {
            product.swatches.forEach(swatchPath => {
                deleteFile(swatchPath);
            });
        }

        // Delete variant images
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                if (variant.images && variant.images.length > 0) {
                    variant.images.forEach(imgPath => {
                        deleteFile(imgPath);
                    });
                }
            });
        }

        await Product.deleteOne({ _id: req.params.id });

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error("Error in deleteProduct:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};