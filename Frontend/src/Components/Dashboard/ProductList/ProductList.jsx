import { useState, useEffect } from "react";
import "./ProductList.css";

const API_URL = "http://localhost:8000/api/products";
const LOGIN_API_URL = "http://localhost:8000/api/auth/login";

const Navbar = ({ onAddProductClick, onLogout }) => {
    return (
        <div className="navbar-container">
            <div className="navbar-controls">
                <button className="add-product-btn" onClick={onAddProductClick}>
                    <i className="fas fa-plus"></i>
                    <span className="btn-text">Add Product</span>
                </button>
                <button className="logout-btn" onClick={onLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span className="btn-text">Logout</span>
                </button>
            </div>
        </div>
    );
};

function ProductList() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    const [selectedVariants, setSelectedVariants] = useState({});

    const [newProductFormData, setNewProductFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        Flammable: '',
        resistant: '',
        QUV: '',
        Weatherometer: '',
        Abrasion: '',
        AntiMicrobial: '',
        PinkStain: '',
    });
    const [newProductImages, setNewProductImages] = useState([]);
    const [newProductImagePreviews, setNewProductImagePreviews] = useState([]);
    const [newProductVideo, setNewProductVideo] = useState(null);
    const [newProductVideoPreview, setNewProductVideoPreview] = useState(null);
    const [newProductIcons, setNewProductIcons] = useState([]);
    const [newProductIconPreviews, setNewProductIconPreviews] = useState([]);
    const [newProductSwatches, setNewProductSwatches] = useState([]);
    const [newProductSwatchPreviews, setNewProductSwatchPreviews] = useState([]);
    const [newProductVariants, setNewProductVariants] = useState([]);

    const [editProductFormData, setEditProductFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        Flammable: '',
        resistant: '',
        QUV: '',
        Weatherometer: '',
        Abrasion: '',
        AntiMicrobial: '',
        PinkStain: '',
    });
    const [editProductImages, setEditProductImages] = useState([]);
    const [editProductImagePreviews, setEditProductImagePreviews] = useState([]);
    const [editProductVideo, setEditProductVideo] = useState(null);
    const [editProductVideoPreview, setEditProductVideoPreview] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [existingVideo, setExistingVideo] = useState(null);
    const [removeExistingVideo, setRemoveExistingVideo] = useState(false);
    const [editProductIcons, setEditProductIcons] = useState([]);
    const [editProductIconPreviews, setEditProductIconPreviews] = useState([]);
    const [existingIcons, setExistingIcons] = useState([]);
    const [editProductSwatches, setEditProductSwatches] = useState([]);
    const [editProductSwatchPreviews, setEditProductSwatchPreviews] = useState([]);
    const [existingSwatches, setExistingSwatches] = useState([]);
    const [editProductVariants, setEditProductVariants] = useState([]);

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isAuthenticated');
        if (isLoggedIn === 'true') {
            setIsAuthenticated(true);
            fetchProducts();
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }

            sessionStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            fetchProducts();

        } catch (err) {
            setLoginError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        setLoginEmail('');
        setLoginPassword('');
        setProducts([]);
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            const formattedData = data.map(product => ({
                ...product,
                price: product.price || 0,
            }));
            setProducts(formattedData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewProductInputChange = (e) => {
        const { name, value } = e.target;
        setNewProductFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        const currentCount = newProductImages.filter(img => img !== null).length;

        if (currentCount + files.length > 30) {
            setError(`You can only upload ${30 - currentCount} more images (max 30 total)`);
            e.target.value = '';
            return;
        }

        setNewProductImages(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewProductImagePreviews(prev => [...prev, ...newPreviews]);
        e.target.value = '';
        setError(null);
    };

    const handleNewProductVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductVideo(file);
            setNewProductVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleNewProductIconChange = (e) => {
        const files = Array.from(e.target.files);
        const currentCount = newProductIcons.filter(icon => icon !== null).length;

        if (currentCount + files.length > 5) {
            setError(`You can only upload ${5 - currentCount} more icons (max 5 total)`);
            e.target.value = '';
            return;
        }

        setNewProductIcons(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewProductIconPreviews(prev => [...prev, ...newPreviews]);
        e.target.value = '';
        setError(null);
    };

    const handleNewProductSwatchChange = (e) => {
        const files = Array.from(e.target.files);
        const currentCount = newProductSwatches.filter(s => s !== null).length;

        if (currentCount + files.length > 30) {
            setError(`You can only upload ${30 - currentCount} more swatches (max 30 total)`);
            e.target.value = '';
            return;
        }

        setNewProductSwatches(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewProductSwatchPreviews(prev => [...prev, ...newPreviews]);
        e.target.value = '';
        setError(null);
    };

    // FIXED: Remove image but keep position (set to null instead of filtering)
    const handleRemoveNewImage = (index) => {
        setNewProductImages(prev => {
            const updated = [...prev];
            updated[index] = null; // Keep position, just set to null
            return updated;
        });
        setNewProductImagePreviews(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    // NEW: Replace image at specific position
    const handleReplaceNewImage = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductImages(prev => {
                const updated = [...prev];
                updated[index] = file;
                return updated;
            });
            setNewProductImagePreviews(prev => {
                const updated = [...prev];
                updated[index] = URL.createObjectURL(file);
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleRemoveNewSwatch = (index) => {
        setNewProductSwatches(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
        setNewProductSwatchPreviews(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    const handleReplaceNewSwatch = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductSwatches(prev => {
                const updated = [...prev];
                updated[index] = file;
                return updated;
            });
            setNewProductSwatchPreviews(prev => {
                const updated = [...prev];
                updated[index] = URL.createObjectURL(file);
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleRemoveNewIcon = (index) => {
        setNewProductIcons(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
        setNewProductIconPreviews(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    const handleReplaceNewIcon = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductIcons(prev => {
                const updated = [...prev];
                updated[index] = file;
                return updated;
            });
            setNewProductIconPreviews(prev => {
                const updated = [...prev];
                updated[index] = URL.createObjectURL(file);
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleRemoveNewVideo = () => {
        setNewProductVideo(null);
        setNewProductVideoPreview(null);
    };

    const handleAddVariant = () => {
        setNewProductVariants(prev => [...prev, { name: '', images: [], previews: [] }]);
    };

    const handleRemoveVariant = (variantIndex) => {
        setNewProductVariants(prev => prev.filter((_, i) => i !== variantIndex));
    };

    const handleVariantNameChange = (variantIndex, value) => {
        setNewProductVariants(prev => {
            const updated = [...prev];
            updated[variantIndex].name = value;
            return updated;
        });
    };

    const handleVariantImagesChange = (variantIndex, e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        setNewProductVariants(prev => {
            const updated = [...prev];
            updated[variantIndex].images = [...updated[variantIndex].images, ...files];
            const newPreviews = files.map(file => URL.createObjectURL(file));
            updated[variantIndex].previews = [...updated[variantIndex].previews, ...newPreviews];
            return updated;
        });

        e.target.value = '';
        setError(null);
    };

    // FIXED: Remove variant image but keep position
    const handleRemoveVariantImage = (variantIndex, imageIndex) => {
        setNewProductVariants(prev => {
            const updated = [...prev];
            updated[variantIndex].images[imageIndex] = null;
            updated[variantIndex].previews[imageIndex] = null;
            return updated;
        });
    };

    // NEW: Replace variant image at specific position
    const handleReplaceVariantImage = (variantIndex, imageIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductVariants(prev => {
                const updated = [...prev];
                updated[variantIndex].images[imageIndex] = file;
                updated[variantIndex].previews[imageIndex] = URL.createObjectURL(file);
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleNewProductSubmit = async (e) => {
        e.preventDefault();

        if (!newProductFormData.title || !newProductFormData.price || !newProductFormData.category || !newProductFormData.description) {
            setError('Please fill all required fields');
            return;
        }

        // Filter out null images before validation
        const validImages = newProductImages.filter(img => img !== null);
        if (validImages.length === 0) {
            setError('Please select at least one image');
            return;
        }

        for (let i = 0; i < newProductVariants.length; i++) {
            if (!newProductVariants[i].name || newProductVariants[i].name.trim() === '') {
                setError(`Please enter a name for variant ${i + 1}`);
                return;
            }
            const validVariantImages = newProductVariants[i].images.filter(img => img !== null);
            if (validVariantImages.length === 0) {
                setError(`Please upload at least one image for variant: ${newProductVariants[i].name}`);
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);

            const formDataToSend = new FormData();

            formDataToSend.append('title', newProductFormData.title);
            formDataToSend.append('description', newProductFormData.description);
            formDataToSend.append('category', newProductFormData.category);
            formDataToSend.append('price', newProductFormData.price);

            if (newProductFormData.Flammable) formDataToSend.append('Flammable', newProductFormData.Flammable);
            if (newProductFormData.resistant) formDataToSend.append('resistant', newProductFormData.resistant);
            if (newProductFormData.QUV) formDataToSend.append('QUV', newProductFormData.QUV);
            if (newProductFormData.Weatherometer) formDataToSend.append('Weatherometer', newProductFormData.Weatherometer);
            if (newProductFormData.Abrasion) formDataToSend.append('Abrasion', newProductFormData.Abrasion);
            if (newProductFormData.AntiMicrobial) formDataToSend.append('AntiMicrobial', newProductFormData.AntiMicrobial);
            if (newProductFormData.PinkStain) formDataToSend.append('PinkStain', newProductFormData.PinkStain);

            // Only append non-null images
            validImages.forEach(image => {
                formDataToSend.append('images', image);
            });

            if (newProductVideo) {
                formDataToSend.append('video', newProductVideo);
            }

            const validIcons = newProductIcons.filter(icon => icon !== null);
            if (validIcons.length > 0) {
                validIcons.forEach(icon => {
                    formDataToSend.append('icons', icon);
                });
            }

            const validSwatches = newProductSwatches.filter(s => s !== null);
            if (validSwatches.length > 0) {
                validSwatches.forEach(swatch => {
                    formDataToSend.append('swatches', swatch);
                });
            }

            if (newProductVariants.length > 0) {
                const variantNames = newProductVariants.map(v => v.name);
                formDataToSend.append('variantNames', JSON.stringify(variantNames));

                newProductVariants.forEach((variant, index) => {
                    const validVariantImages = variant.images.filter(img => img !== null);
                    validVariantImages.forEach(image => {
                        formDataToSend.append(`variant_${index}`, image);
                    });
                });
            }

            console.log('=== FormData Contents ===');
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create product');
            }

            const data = await response.json();
            console.log('Product created:', data);

            setSuccessMessage('Product created successfully!');

            setNewProductFormData({
                title: '',
                description: '',
                category: '',
                price: '',
                Flammable: '',
                resistant: '',
                QUV: '',
                Weatherometer: '',
                Abrasion: '',
                AntiMicrobial: '',
                PinkStain: '',
            });
            setNewProductImages([]);
            setNewProductImagePreviews([]);
            setNewProductVideo(null);
            setNewProductVideoPreview(null);
            setNewProductIcons([]);
            setNewProductIconPreviews([]);
            setNewProductSwatches([]);
            setNewProductSwatchPreviews([]);
            setNewProductVariants([]);

            setShowAddProductModal(false);
            fetchProducts();

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err) {
            setError(err.message);
            console.error('Error creating product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditProductFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            Flammable: product.Flammable || '',
            resistant: product.resistant || '',
            QUV: product.QUV || '',
            Weatherometer: product.Weatherometer || '',
            Abrasion: product.Abrasion || '',
            AntiMicrobial: product.AntiMicrobial || '',
            PinkStain: product.PinkStain || '',
        });
        setExistingImages(product.image || []);
        setExistingVideo(product.video || null);
        setExistingIcons(product.icons || []);
        setExistingSwatches(product.swatches || []);

        const existingVariants = (product.variants || []).map(v => ({
            name: v.name,
            existingImages: v.images || [],
            newImages: [],
            newPreviews: []
        }));
        setEditProductVariants(existingVariants);

        setEditProductImages([]);
        setEditProductImagePreviews([]);
        setEditProductVideo(null);
        setEditProductVideoPreview(null);
        setEditProductIcons([]);
        setEditProductIconPreviews([]);
        setEditProductSwatches([]);
        setEditProductSwatchPreviews([]);
        setRemoveExistingVideo(false);
        setShowEditProductModal(true);
    };

    const handleEditProductInputChange = (e) => {
        const { name, value } = e.target;
        setEditProductFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        const existingCount = existingImages.filter(img => img !== null).length;
        const newCount = editProductImages.filter(img => img !== null).length;
        const totalImages = existingCount + newCount + files.length;

        if (totalImages > 30) {
            setError(`Maximum 30 images allowed. You can add ${30 - existingCount - newCount} more.`);
            e.target.value = '';
            return;
        }

        setEditProductImages(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setEditProductImagePreviews(prev => [...prev, ...newPreviews]);

        e.target.value = '';
        setError(null);
    };

    const handleReplaceExistingImage = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setExistingImages(prev => {
                const updated = [...prev];
                updated[index] = null; // Mark as removed
                return updated;
            });

            setEditProductImages(prev => [...prev, file]);
            setEditProductImagePreviews(prev => [...prev, URL.createObjectURL(file)]);

            e.target.value = '';
        }
    };

    const handleEditProductVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductVideo(file);
            setEditProductVideoPreview(URL.createObjectURL(file));
            setRemoveExistingVideo(false);
        }
    };

    const handleEditProductIconChange = (e) => {
        const files = Array.from(e.target.files);
        const existingCount = existingIcons.filter(icon => icon !== null).length;
        const newCount = editProductIcons.filter(icon => icon !== null).length;
        const totalIcons = existingCount + newCount + files.length;

        if (totalIcons > 5) {
            setError(`Maximum 5 icons allowed. You can add ${5 - existingCount - newCount} more.`);
            e.target.value = '';
            return;
        }

        setEditProductIcons(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setEditProductIconPreviews(prev => [...prev, ...newPreviews]);

        e.target.value = '';
        setError(null);
    };

    const handleReplaceExistingIcon = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setExistingIcons(prev => {
                const updated = [...prev];
                updated[index] = null;
                return updated;
            });

            setEditProductIcons(prev => [...prev, file]);
            setEditProductIconPreviews(prev => [...prev, URL.createObjectURL(file)]);

            e.target.value = '';
        }
    };

    const handleEditProductSwatchChange = (e) => {
        const files = Array.from(e.target.files);
        const existingCount = existingSwatches.filter(s => s !== null).length;
        const newCount = editProductSwatches.filter(s => s !== null).length;
        const totalSwatches = existingCount + newCount + files.length;

        if (totalSwatches > 30) {
            setError(`Maximum 30 swatch images allowed. You can add ${30 - existingCount - newCount} more.`);
            e.target.value = '';
            return;
        }

        setEditProductSwatches(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setEditProductSwatchPreviews(prev => [...prev, ...newPreviews]);

        e.target.value = '';
        setError(null);
    };

    const handleReplaceExistingSwatch = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setExistingSwatches(prev => {
                const updated = [...prev];
                updated[index] = null;
                return updated;
            });

            setEditProductSwatches(prev => [...prev, file]);
            setEditProductSwatchPreviews(prev => [...prev, URL.createObjectURL(file)]);

            e.target.value = '';
        }
    };

    const handleRemoveExistingVideo = () => {
        setExistingVideo(null);
        setRemoveExistingVideo(true);
        setEditProductVideo(null);
        setEditProductVideoPreview(null);
    };

    const handleRemoveEditNewVideo = () => {
        setEditProductVideo(null);
        setEditProductVideoPreview(null);
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    const handleReplaceExistingImageInPlace = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);

            setExistingImages(prev => {
                const updated = [...prev];
                updated[index] = newImageUrl;
                return updated;
            });

            setEditProductImages(prev => [...prev, file]);
            setEditProductImagePreviews(prev => [...prev, newImageUrl]);

            e.target.value = '';
        }
    };

    const handleRemoveEditNewImage = (index) => {
        setEditProductImages(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
        setEditProductImagePreviews(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    const handleReplaceEditNewImage = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductImages(prev => {
                const updated = [...prev];
                updated[index] = file;
                return updated;
            });
            setEditProductImagePreviews(prev => {
                const updated = [...prev];
                updated[index] = URL.createObjectURL(file);
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleRemoveExistingIcon = (index) => {
        setExistingIcons(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    const handleRemoveEditNewIcon = (index) => {
        setEditProductIcons(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
        setEditProductIconPreviews(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    const handleReplaceEditNewIcon = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductIcons(prev => {
                const updated = [...prev];
                updated[index] = file;
                return updated;
            });
            setEditProductIconPreviews(prev => {
                const updated = [...prev];
                updated[index] = URL.createObjectURL(file);
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleRemoveExistingSwatch = (index) => {
        setExistingSwatches(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    const handleRemoveEditNewSwatch = (index) => {
        setEditProductSwatches(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
        setEditProductSwatchPreviews(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    const handleReplaceEditNewSwatch = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductSwatches(prev => {
                const updated = [...prev];
                updated[index] = file;
                return updated;
            });
            setEditProductSwatchPreviews(prev => {
                const updated = [...prev];
                updated[index] = URL.createObjectURL(file);
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleAddEditVariant = () => {
        setEditProductVariants(prev => [...prev, { name: '', existingImages: [], newImages: [], newPreviews: [] }]);
    };

    const handleRemoveEditVariant = (variantIndex) => {
        setEditProductVariants(prev => prev.filter((_, i) => i !== variantIndex));
    };

    const handleEditVariantNameChange = (variantIndex, value) => {
        setEditProductVariants(prev => {
            const updated = [...prev];
            updated[variantIndex].name = value;
            return updated;
        });
    };

    const handleEditVariantImagesChange = (variantIndex, e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        setEditProductVariants(prev => {
            const updated = [...prev];
            updated[variantIndex].newImages = [...updated[variantIndex].newImages, ...files];
            const newPreviews = files.map(file => URL.createObjectURL(file));
            updated[variantIndex].newPreviews = [...updated[variantIndex].newPreviews, ...newPreviews];
            return updated;
        });

        e.target.value = '';
        setError(null);
    };

    const handleReplaceEditVariantExistingImage = (variantIndex, imageIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductVariants(prev => {
                const updated = [...prev];
                updated[variantIndex].existingImages[imageIndex] = null;
                updated[variantIndex].newImages = [...updated[variantIndex].newImages, file];
                updated[variantIndex].newPreviews = [...updated[variantIndex].newPreviews, URL.createObjectURL(file)];
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleRemoveEditVariantExistingImage = (variantIndex, imageIndex) => {
        setEditProductVariants(prev => {
            const updated = [...prev];
            updated[variantIndex].existingImages[imageIndex] = null;
            return updated;
        });
    };

    const handleReplaceEditVariantExistingImageInPlace = (variantIndex, imageIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);

            setEditProductVariants(prev => {
                const updated = [...prev];
                updated[variantIndex].existingImages[imageIndex] = newImageUrl;
                updated[variantIndex].newImages = [...updated[variantIndex].newImages, file];
                updated[variantIndex].newPreviews = [...updated[variantIndex].newPreviews, newImageUrl];
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleRemoveEditVariantNewImage = (variantIndex, imageIndex) => {
        setEditProductVariants(prev => {
            const updated = [...prev];
            updated[variantIndex].newImages[imageIndex] = null;
            updated[variantIndex].newPreviews[imageIndex] = null;
            return updated;
        });
    };

    const handleReplaceEditVariantNewImage = (variantIndex, imageIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductVariants(prev => {
                const updated = [...prev];
                updated[variantIndex].newImages[imageIndex] = file;
                updated[variantIndex].newPreviews[imageIndex] = URL.createObjectURL(file);
                return updated;
            });
            e.target.value = '';
        }
    };

    const handleEditProductSubmit = async (e) => {
        e.preventDefault();

        if (!editProductFormData.title || !editProductFormData.price || !editProductFormData.category || !editProductFormData.description) {
            setError('Please fill all required fields');
            return;
        }

        const validExistingImages = existingImages.filter(img => img !== null);
        const validNewImages = editProductImages.filter(img => img !== null);
        if (validExistingImages.length === 0 && validNewImages.length === 0) {
            setError('Please keep or add at least one image');
            return;
        }

        for (let i = 0; i < editProductVariants.length; i++) {
            const variant = editProductVariants[i];
            if (!variant.name || variant.name.trim() === '') {
                setError(`Please enter a name for variant ${i + 1}`);
                return;
            }
            const validExisting = variant.existingImages.filter(img => img !== null).length;
            const validNew = variant.newImages.filter(img => img !== null).length;
            if (validExisting + validNew === 0) {
                setError(`Please upload at least one image for variant: ${variant.name}`);
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);

            const formDataToSend = new FormData();
            formDataToSend.append('title', editProductFormData.title);
            formDataToSend.append('description', editProductFormData.description);
            formDataToSend.append('category', editProductFormData.category);
            formDataToSend.append('price', editProductFormData.price);
            formDataToSend.append('Flammable', editProductFormData.Flammable);
            formDataToSend.append('resistant', editProductFormData.resistant);
            formDataToSend.append('QUV', editProductFormData.QUV);
            formDataToSend.append('Weatherometer', editProductFormData.Weatherometer);
            formDataToSend.append('Abrasion', editProductFormData.Abrasion);
            formDataToSend.append('AntiMicrobial', editProductFormData.AntiMicrobial);
            formDataToSend.append('PinkStain', editProductFormData.PinkStain);

            const imageOrder = [];
            validExistingImages.forEach(img => {
                imageOrder.push(img);
            });
            validNewImages.forEach((_, index) => {
                imageOrder.push(`NEW_FILE_${index}`);
            });
            formDataToSend.append('imageOrder', JSON.stringify(imageOrder));

            validNewImages.forEach(image => {
                formDataToSend.append('images', image);
            });

            const validExistingIcons = existingIcons.filter(icon => icon !== null);
            const validNewIcons = editProductIcons.filter(icon => icon !== null);
            const iconOrder = [];
            validExistingIcons.forEach(icon => {
                iconOrder.push(icon);
            });
            validNewIcons.forEach((_, index) => {
                iconOrder.push(`NEW_ICON_${index}`);
            });
            formDataToSend.append('iconOrder', JSON.stringify(iconOrder));

            validNewIcons.forEach(icon => {
                formDataToSend.append('icons', icon);
            });

            const validExistingSwatches = existingSwatches.filter(s => s !== null);
            const validNewSwatches = editProductSwatches.filter(s => s !== null);
            const swatchOrder = [];
            validExistingSwatches.forEach(swatch => {
                swatchOrder.push(swatch);
            });
            validNewSwatches.forEach((_, index) => {
                swatchOrder.push(`NEW_SWATCH_${index}`);
            });
            formDataToSend.append('swatchOrder', JSON.stringify(swatchOrder));

            validNewSwatches.forEach(swatch => {
                formDataToSend.append('swatches', swatch);
            });

            if (editProductVideo) {
                formDataToSend.append('video', editProductVideo);
            } else if (removeExistingVideo) {
                formDataToSend.append('removeVideo', 'true');
            }

            if (editProductVariants.length > 0) {
                const variantNames = editProductVariants.map(v => v.name);
                formDataToSend.append('variantNames', JSON.stringify(variantNames));

                const variantOrders = editProductVariants.map(variant => {
                    const order = [];
                    const validExisting = variant.existingImages.filter(img => img !== null);
                    validExisting.forEach(img => {
                        order.push(img);
                    });
                    const validNew = variant.newImages.filter(img => img !== null);
                    validNew.forEach((_, index) => {
                        order.push(`NEW_VARIANT_${index}`);
                    });
                    return order;
                });
                formDataToSend.append('variantOrders', JSON.stringify(variantOrders));

                editProductVariants.forEach((variant, index) => {
                    const validNew = variant.newImages.filter(img => img !== null);
                    validNew.forEach(image => {
                        formDataToSend.append(`variant_${index}`, image);
                    });
                });
            }

            const response = await fetch(`${API_URL}/${editingProduct._id}`, {
                method: 'PUT',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            const data = await response.json();
            console.log('Product updated:', data);

            setSuccessMessage('Product updated successfully!');

            setShowEditProductModal(false);
            setEditingProduct(null);
            fetchProducts();

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err) {
            setError(err.message);
            console.error('Error updating product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setSuccessMessage('Product deleted successfully!');
            fetchProducts();

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err) {
            setError(err.message);
            console.error('Error deleting product:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleVariantSelect = (productId, variantIndex) => {
        setSelectedVariants(prev => {
            if (prev[productId] === variantIndex) {
                return prev;
            }
            return {
                ...prev,
                [productId]: variantIndex
            };
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-header">
                            <i className="fas fa-lock"></i>
                            <h2>Admin Login</h2>
                            <p>Please login to access the product management system</p>
                        </div>
                        <div className="login-form">
                            {loginError && (
                                <div className="login-alert login-alert-error">
                                    <i className="fas fa-exclamation-circle"></i>
                                    {loginError}
                                </div>
                            )}
                            <div className="login-form-group">
                                <label htmlFor="login-email">
                                    <i className="fas fa-envelope"></i>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="login-email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loginLoading}
                                />
                            </div>
                            <div className="login-form-group">
                                <label htmlFor="login-password">
                                    <i className="fas fa-key"></i>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="login-password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    disabled={loginLoading}
                                />
                            </div>
                            <button onClick={handleLogin} className="login-btn" disabled={loginLoading}>
                                {loginLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt"></i>
                                        Login
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="ProductList-page">
                <div className="page-header">
                    <Navbar
                        onAddProductClick={() => setShowAddProductModal(true)}
                        onLogout={handleLogout}
                    />

                    {successMessage && (
                        <div className="alert alert-success">
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error">
                            {error}
                            <button onClick={() => setError(null)} className="close-btn">×</button>
                        </div>
                    )}
                </div>

                <div className="products-content">
                    {loading && <p className="loading-indicator">Loading products...</p>}

                    {!loading && filteredProducts.length === 0 && (
                        <p className="no-products-found">No products found. {searchTerm && "Adjust your search or "}Click "Add Product" to create your first product!</p>
                    )}

                    {!loading && filteredProducts.length > 0 && (
                        <div className="products-cards">
                            {filteredProducts.map(product => {
                                const selectedVariantIndex = selectedVariants[product._id];
                                const displayImages = (selectedVariantIndex !== undefined && selectedVariantIndex !== null && product.variants && product.variants[selectedVariantIndex])
                                    ? product.variants[selectedVariantIndex].images
                                    : product.image;

                                return (
                                    <div key={product._id} className="product-card">
                                        <div className="product-card-image">
                                            {displayImages && displayImages.length > 0 && (
                                                <img
                                                    src={`http://localhost:8000/${displayImages[0]}`}
                                                    alt={product.title}
                                                />
                                            )}
                                        </div>

                                        {product.variants && product.variants.length > 0 && (
                                            <div className="product-variants-section">
                                                <h4 className="variants-title">Available Variants:</h4>
                                                <div className="variants-grid">
                                                    {product.variants.map((variant, index) => (
                                                        <button
                                                            key={index}
                                                            className={`variant-btn ${selectedVariantIndex === index ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleVariantSelect(product._id, index);
                                                            }}
                                                        >
                                                            {variant.name}
                                                        </button>
                                                    ))}
                                                    <button
                                                        className={`variant-btn ${selectedVariantIndex === null || selectedVariantIndex === undefined ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleVariantSelect(product._id, null);
                                                        }}
                                                    >
                                                        Default
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {product.icons && product.icons.length > 0 && (
                                            <div className="product-icons-section">
                                                {product.icons.map((icon, index) => (
                                                    <div key={index} className="product-icon-item">
                                                        <img
                                                            src={`http://localhost:8000/${icon}`}
                                                            alt={`Icon ${index + 1}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="product-card-content">
                                            <h3 className="product-card-title">{product.title}</h3>
                                            <p className="product-card-description">{product.description}</p>
                                            <div className="product-card-meta">
                                                <span className="category-badge">{product.category}</span>
                                                <span className="product-card-price">${product.price.toFixed(2)}</span>
                                            </div>
                                            <div className="product-specifications">
                                                {product.Flammable && <p className="spec-item"><strong>Flammable:</strong> {product.Flammable}</p>}
                                                {product.resistant && <p className="spec-item"><strong>Resistant:</strong> {product.resistant}</p>}
                                                {product.QUV && <p className="spec-item"><strong>QUV:</strong> {product.QUV}</p>}
                                                {product.Weatherometer && <p className="spec-item"><strong>Weatherometer:</strong> {product.Weatherometer}</p>}
                                                {product.Abrasion && <p className="spec-item"><strong>Abrasion:</strong> {product.Abrasion}</p>}
                                                {product.AntiMicrobial && <p className="spec-item"><strong>Anti-Microbial:</strong> {product.AntiMicrobial}</p>}
                                                {product.PinkStain && <p className="spec-item"><strong>Pink Stain:</strong> {product.PinkStain}</p>}
                                            </div>
                                            <div className="product-card-actions">
                                                <button
                                                    className="card-action-btn edit-btn"
                                                    onClick={() => handleEditClick(product)}
                                                    disabled={loading}
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="card-action-btn delete-btn"
                                                    disabled={loading}
                                                >
                                                    <i className="fas fa-trash-alt"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Add Product Modal */}
                {showAddProductModal && (
                    <div className="modal-overlay" onClick={() => setShowAddProductModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Product</h2>
                                <button className="modal-close-btn" onClick={() => setShowAddProductModal(false)}>
                                    &times;
                                </button>
                            </div>

                            <div className="add-product-form">
                                <div className="form-group">
                                    <label htmlFor="new-product-title">Product Title *</label>
                                    <input
                                        type="text"
                                        id="new-product-title"
                                        name="title"
                                        value={newProductFormData.title}
                                        onChange={handleNewProductInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="new-product-description">Product Description *</label>
                                    <textarea
                                        id="new-product-description"
                                        name="description"
                                        value={newProductFormData.description}
                                        onChange={handleNewProductInputChange}
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="new-product-price">Price *</label>
                                        <input
                                            type="number"
                                            id="new-product-price"
                                            name="price"
                                            value={newProductFormData.price}
                                            onChange={handleNewProductInputChange}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="new-product-category">Category *</label>
                                        <input
                                            type="text"
                                            id="new-product-category"
                                            name="category"
                                            value={newProductFormData.category}
                                            onChange={handleNewProductInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Product Properties (Optional)</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="new-product-flammable">Flammable</label>
                                            <input
                                                type="text"
                                                id="new-product-flammable"
                                                name="Flammable"
                                                value={newProductFormData.Flammable}
                                                onChange={handleNewProductInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="new-product-resistant">Resistant</label>
                                            <input
                                                type="text"
                                                id="new-product-resistant"
                                                name="resistant"
                                                value={newProductFormData.resistant}
                                                onChange={handleNewProductInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="new-product-quv">QUV</label>
                                            <input
                                                type="text"
                                                id="new-product-quv"
                                                name="QUV"
                                                value={newProductFormData.QUV}
                                                onChange={handleNewProductInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="new-product-weatherometer">Weatherometer</label>
                                            <input
                                                type="text"
                                                id="new-product-weatherometer"
                                                name="Weatherometer"
                                                value={newProductFormData.Weatherometer}
                                                onChange={handleNewProductInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="new-product-abrasion">Abrasion</label>
                                            <input
                                                type="text"
                                                id="new-product-abrasion"
                                                name="Abrasion"
                                                value={newProductFormData.Abrasion}
                                                onChange={handleNewProductInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="new-product-antimicrobial">Anti-Microbial</label>
                                            <input
                                                type="text"
                                                id="new-product-antimicrobial"
                                                name="AntiMicrobial"
                                                value={newProductFormData.AntiMicrobial}
                                                onChange={handleNewProductInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="new-product-pinkstain">Pink Stain</label>
                                            <input
                                                type="text"
                                                id="new-product-pinkstain"
                                                name="PinkStain"
                                                value={newProductFormData.PinkStain}
                                                onChange={handleNewProductInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group image-upload-group">
                                    <label>Product Images * (Max 30) - Remove & Replace at specific position</label>
                                    <div className="image-input-grid">
                                        {newProductImagePreviews.map((preview, index) => (
                                            preview !== null ? (
                                                <div key={index} className="image-preview-box">
                                                    <img src={preview} alt={`Preview ${index}`} />
                                                    <div className="image-overlay-actions">
                                                        <label htmlFor={`replace-new-image-${index}`} className="replace-btn" title="Replace this image">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </label>
                                                        <button type="button" className="remove-image-btn" onClick={() => handleRemoveNewImage(index)} title="Remove this image">×</button>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id={`replace-new-image-${index}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleReplaceNewImage(index, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </div>
                                            ) : (
                                                <label key={index} htmlFor={`add-at-${index}`} className="image-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i>
                                                    <span>Add Here</span>
                                                    <input
                                                        type="file"
                                                        id={`add-at-${index}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleReplaceNewImage(index, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )
                                        ))}
                                        {newProductImages.filter(img => img !== null).length < 30 && (
                                            <label htmlFor="new-product-images" className="image-upload-placeholder">
                                                <i className="fas fa-plus"></i>
                                                <span>Add New</span>
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="new-product-images"
                                            accept="image/*"
                                            onChange={handleNewProductImageChange}
                                            multiple
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <p className="uploaded-image-count">{newProductImages.filter(img => img !== null).length} image(s) uploaded</p>
                                </div>

                                <div className="form-group icon-upload-group">
                                    <label>Product Icons (Optional, Max 5)</label>
                                    <div className="icon-input-grid">
                                        {newProductIconPreviews.map((preview, index) => (
                                            preview !== null ? (
                                                <div key={index} className="icon-preview-box">
                                                    <img src={preview} alt={`Icon ${index}`} />
                                                    <div className="icon-overlay-actions">
                                                        <label htmlFor={`replace-new-icon-${index}`} className="replace-btn" title="Replace">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </label>
                                                        <button type="button" className="remove-icon-btn" onClick={() => handleRemoveNewIcon(index)}>×</button>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id={`replace-new-icon-${index}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleReplaceNewIcon(index, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </div>
                                            ) : (
                                                <label key={index} htmlFor={`add-icon-at-${index}`} className="icon-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i>
                                                    <span>Add</span>
                                                    <input
                                                        type="file"
                                                        id={`add-icon-at-${index}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleReplaceNewIcon(index, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )
                                        ))}
                                        {newProductIcons.filter(icon => icon !== null).length < 5 && (
                                            <label htmlFor="new-product-icons" className="icon-upload-placeholder">
                                                <i className="fas fa-plus"></i>
                                                <span>Add New</span>
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="new-product-icons"
                                            accept="image/*"
                                            onChange={handleNewProductIconChange}
                                            multiple
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <p className="uploaded-icon-count">{newProductIcons.filter(i => i !== null).length} icon(s) uploaded</p>
                                </div>

                                <div className="form-group variants-section">
                                    <div className="variants-header">
                                        <label>Product Variants (Optional - Unlimited)</label>
                                        <button type="button" className="add-variant-btn" onClick={handleAddVariant}>
                                            <i className="fas fa-plus"></i> Add Variant
                                        </button>
                                    </div>

                                    {newProductVariants.map((variant, variantIndex) => (
                                        <div key={variantIndex} className="variant-item">
                                            <div className="variant-header">
                                                <h4>Variant {variantIndex + 1}</h4>
                                                <button type="button" className="remove-variant-btn" onClick={() => handleRemoveVariant(variantIndex)}>
                                                    <i className="fas fa-trash"></i> Remove
                                                </button>
                                            </div>

                                            <div className="form-group">
                                                <label>Variant Name *</label>
                                                <input
                                                    type="text"
                                                    value={variant.name}
                                                    onChange={(e) => handleVariantNameChange(variantIndex, e.target.value)}
                                                    placeholder="e.g., Navy Blue, Size L"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Variant Images * - Click empty slots to add images</label>
                                                <div className="variant-images-grid">
                                                    {variant.previews.map((preview, imgIndex) => (
                                                        preview !== null ? (
                                                            <div key={imgIndex} className="variant-image-preview">
                                                                <img src={preview} alt={`Variant ${imgIndex}`} />
                                                                <div className="variant-overlay-actions">
                                                                    <label htmlFor={`replace-variant-${variantIndex}-${imgIndex}`} className="replace-btn" title="Replace">
                                                                        <i className="fas fa-sync-alt"></i>
                                                                    </label>
                                                                    <button type="button" className="remove-variant-image-btn" onClick={() => handleRemoveVariantImage(variantIndex, imgIndex)}>×</button>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    id={`replace-variant-${variantIndex}-${imgIndex}`}
                                                                    accept="image/*"
                                                                    onChange={(e) => handleReplaceVariantImage(variantIndex, imgIndex, e)}
                                                                    style={{ display: 'none' }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <label key={imgIndex} htmlFor={`add-variant-at-${variantIndex}-${imgIndex}`} className="variant-image-upload-placeholder empty-slot">
                                                                <i className="fas fa-upload"></i>
                                                                <span>Add</span>
                                                                <input
                                                                    type="file"
                                                                    id={`add-variant-at-${variantIndex}-${imgIndex}`}
                                                                    accept="image/*"
                                                                    onChange={(e) => handleReplaceVariantImage(variantIndex, imgIndex, e)}
                                                                    style={{ display: 'none' }}
                                                                />
                                                            </label>
                                                        )
                                                    ))}
                                                    <label htmlFor={`variant-images-${variantIndex}`} className="variant-image-upload-placeholder">
                                                        <i className="fas fa-plus"></i>
                                                        <span>Add New</span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id={`variant-images-${variantIndex}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleVariantImagesChange(variantIndex, e)}
                                                        multiple
                                                        style={{ display: 'none' }}
                                                    />
                                                </div>
                                                <p className="uploaded-count">{variant.images.filter(img => img !== null).length} image(s) uploaded</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={handleNewProductSubmit} className="submit-product-btn" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Product Modal - Similar changes applied */}
                {showEditProductModal && (
                    <div className="modal-overlay" onClick={() => setShowEditProductModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Product</h2>
                                <button className="modal-close-btn" onClick={() => setShowEditProductModal(false)}>
                                    &times;
                                </button>
                            </div>

                            <div className="edit-product-form">
                                <div className="form-group">
                                    <label htmlFor="edit-product-title">Product Title *</label>
                                    <input
                                        type="text"
                                        id="edit-product-title"
                                        name="title"
                                        value={editProductFormData.title}
                                        onChange={handleEditProductInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-product-description">Product Description *</label>
                                    <textarea
                                        id="edit-product-description"
                                        name="description"
                                        value={editProductFormData.description}
                                        onChange={handleEditProductInputChange}
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="edit-product-price">Price *</label>
                                        <input
                                            type="number"
                                            id="edit-product-price"
                                            name="price"
                                            value={editProductFormData.price}
                                            onChange={handleEditProductInputChange}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="edit-product-category">Category *</label>
                                        <input
                                            type="text"
                                            id="edit-product-category"
                                            name="category"
                                            value={editProductFormData.category}
                                            onChange={handleEditProductInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Product Properties (Optional)</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="edit-product-flammable">Flammable</label>
                                            <input
                                                type="text"
                                                id="edit-product-flammable"
                                                name="Flammable"
                                                value={editProductFormData.Flammable}
                                                onChange={handleEditProductInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-product-resistant">Resistant</label>
                                            <input
                                                type="text"
                                                id="edit-product-resistant"
                                                name="resistant"
                                                value={editProductFormData.resistant}
                                                onChange={handleEditProductInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="edit-product-quv">QUV</label>
                                            <input
                                                type="text"
                                                id="edit-product-quv"
                                                name="QUV"
                                                value={editProductFormData.QUV}
                                                onChange={handleEditProductInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-product-weatherometer">Weatherometer</label>
                                            <input
                                                type="text"
                                                id="edit-product-weatherometer"
                                                name="Weatherometer"
                                                value={editProductFormData.Weatherometer}
                                                onChange={handleEditProductInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="edit-product-abrasion">Abrasion</label>
                                            <input
                                                type="text"
                                                id="edit-product-abrasion"
                                                name="Abrasion"
                                                value={editProductFormData.Abrasion}
                                                onChange={handleEditProductInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-product-antimicrobial">Anti-Microbial</label>
                                            <input
                                                type="text"
                                                id="edit-product-antimicrobial"
                                                name="AntiMicrobial"
                                                value={editProductFormData.AntiMicrobial}
                                                onChange={handleEditProductInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="edit-product-pinkstain">Pink Stain</label>
                                            <input
                                                type="text"
                                                id="edit-product-pinkstain"
                                                name="PinkStain"
                                                value={editProductFormData.PinkStain}
                                                onChange={handleEditProductInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group image-upload-group">
                                    <label>Product Images * - Remove & Replace at position</label>
                                    <div className="image-input-grid">
                                        {existingImages.map((img, index) => (
                                            img !== null ? (
                                                <div key={`existing-${index}`} className="image-preview-box existing">
                                                    <img src={`http://localhost:8000/${img}`} alt={`Existing ${index}`} />
                                                    <div className="image-overlay-actions">
                                                        <label htmlFor={`replace-existing-image-${index}`} className="replace-btn" title="Replace">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </label>
                                                        <button type="button" className="remove-image-btn" onClick={() => handleRemoveExistingImage(index)}>×</button>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id={`replace-existing-image-${index}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleReplaceExistingImageInPlace(index, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </div>
                                            ) : (
                                                <label key={`existing-${index}`} htmlFor={`add-existing-at-${index}`} className="image-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i>
                                                    <span>Add</span>
                                                    <input
                                                        type="file"
                                                        id={`add-existing-at-${index}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleReplaceExistingImageInPlace(index, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )
                                        ))}
                                        {editProductImagePreviews.map((preview, index) => (
                                            preview !== null ? (
                                                <div key={`new-${index}`} className="image-preview-box new">
                                                    <img src={preview} alt={`New ${index}`} />
                                                    <div className="image-overlay-actions">
                                                        <label htmlFor={`replace-edit-new-image-${index}`} className="replace-btn" title="Replace">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </label>
                                                        <button type="button" className="remove-image-btn" onClick={() => handleRemoveEditNewImage(index)}>×</button>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id={`replace-edit-new-image-${index}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleReplaceEditNewImage(index, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </div>
                                            ) : (
                                                <label key={`new-${index}`} htmlFor={`add-edit-new-at-${index}`} className="image-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i>
                                                    <span>Add</span>
                                                    <input
                                                        type="file"
                                                        id={`add-edit-new-at-${index}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleReplaceEditNewImage(index, e)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )
                                        ))}
                                        {(existingImages.filter(img => img !== null).length + editProductImages.filter(img => img !== null).length) < 30 && (
                                            <label htmlFor="edit-product-images" className="image-upload-placeholder">
                                                <i className="fas fa-plus"></i>
                                                <span>Add New</span>
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="edit-product-images"
                                            accept="image/*"
                                            onChange={handleEditProductImageChange}
                                            multiple
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <p className="image-count-info">
                                        Total: {existingImages.filter(img => img !== null).length + editProductImages.filter(img => img !== null).length} / 30 images
                                    </p>
                                </div>

                                <div className="form-group variants-section">
                                    <div className="variants-header">
                                        <label>Product Variants (Optional)</label>
                                        <button type="button" className="add-variant-btn" onClick={handleAddEditVariant}>
                                            <i className="fas fa-plus"></i> Add Variant
                                        </button>
                                    </div>

                                    {editProductVariants.map((variant, variantIndex) => (
                                        <div key={variantIndex} className="variant-item">
                                            <div className="variant-header">
                                                <h4>Variant {variantIndex + 1}</h4>
                                                <button type="button" className="remove-variant-btn" onClick={() => handleRemoveEditVariant(variantIndex)}>
                                                    <i className="fas fa-trash"></i> Remove
                                                </button>
                                            </div>

                                            <div className="form-group">
                                                <label>Variant Name *</label>
                                                <input
                                                    type="text"
                                                    value={variant.name}
                                                    onChange={(e) => handleEditVariantNameChange(variantIndex, e.target.value)}
                                                    placeholder="e.g., Navy Blue, Size L"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Variant Images * - Click slots to replace</label>
                                                <div className="variant-images-grid">
                                                    {variant.existingImages.map((img, imgIndex) => (
                                                        img !== null ? (
                                                            <div key={`existing-variant-${imgIndex}`} className="variant-image-preview existing">
                                                                <img src={`http://localhost:8000/${img}`} alt={`Existing ${imgIndex}`} />
                                                                <div className="variant-overlay-actions">
                                                                    <label htmlFor={`replace-edit-variant-existing-${variantIndex}-${imgIndex}`} className="replace-btn" title="Replace">
                                                                        <i className="fas fa-sync-alt"></i>
                                                                    </label>
                                                                    <button type="button" className="remove-variant-image-btn" onClick={() => handleRemoveEditVariantExistingImage(variantIndex, imgIndex)}>×</button>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    id={`replace-edit-variant-existing-${variantIndex}-${imgIndex}`}
                                                                    accept="image/*"
                                                                    onChange={(e) => handleReplaceEditVariantExistingImageInPlace(variantIndex, imgIndex, e)}
                                                                    style={{ display: 'none' }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <label key={`existing-variant-${imgIndex}`} htmlFor={`add-edit-variant-existing-at-${variantIndex}-${imgIndex}`} className="variant-image-upload-placeholder empty-slot">
                                                                <i className="fas fa-upload"></i>
                                                                <span>Add</span>
                                                                <input
                                                                    type="file"
                                                                    id={`add-edit-variant-existing-at-${variantIndex}-${imgIndex}`}
                                                                    accept="image/*"
                                                                    onChange={(e) => handleReplaceEditVariantExistingImageInPlace(variantIndex, imgIndex, e)}
                                                                    style={{ display: 'none' }}
                                                                />
                                                            </label>
                                                        )
                                                    ))}
                                                    {variant.newPreviews.map((preview, imgIndex) => (
                                                        preview !== null ? (
                                                            <div key={`new-variant-${imgIndex}`} className="variant-image-preview new">
                                                                <img src={preview} alt={`New ${imgIndex}`} />
                                                                <div className="variant-overlay-actions">
                                                                    <label htmlFor={`replace-edit-variant-new-${variantIndex}-${imgIndex}`} className="replace-btn" title="Replace">
                                                                        <i className="fas fa-sync-alt"></i>
                                                                    </label>
                                                                    <button type="button" className="remove-variant-image-btn" onClick={() => handleRemoveEditVariantNewImage(variantIndex, imgIndex)}>×</button>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    id={`replace-edit-variant-new-${variantIndex}-${imgIndex}`}
                                                                    accept="image/*"
                                                                    onChange={(e) => handleReplaceEditVariantNewImage(variantIndex, imgIndex, e)}
                                                                    style={{ display: 'none' }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <label key={`new-variant-${imgIndex}`} htmlFor={`add-edit-variant-new-at-${variantIndex}-${imgIndex}`} className="variant-image-upload-placeholder empty-slot">
                                                                <i className="fas fa-upload"></i>
                                                                <span>Add</span>
                                                                <input
                                                                    type="file"
                                                                    id={`add-edit-variant-new-at-${variantIndex}-${imgIndex}`}
                                                                    accept="image/*"
                                                                    onChange={(e) => handleReplaceEditVariantNewImage(variantIndex, imgIndex, e)}
                                                                    style={{ display: 'none' }}
                                                                />
                                                            </label>
                                                        )
                                                    ))}
                                                    <label htmlFor={`edit-variant-images-${variantIndex}`} className="variant-image-upload-placeholder">
                                                        <i className="fas fa-plus"></i>
                                                        <span>Add New</span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id={`edit-variant-images-${variantIndex}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleEditVariantImagesChange(variantIndex, e)}
                                                        multiple
                                                        style={{ display: 'none' }}
                                                    />
                                                </div>
                                                <p className="variant-image-count-info">
                                                    Total: {variant.existingImages.filter(img => img !== null).length + variant.newImages.filter(img => img !== null).length} images
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={handleEditProductSubmit} className="submit-product-btn" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProductList;