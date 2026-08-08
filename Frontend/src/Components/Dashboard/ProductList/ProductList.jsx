import { useState, useEffect } from "react";
import "./ProductList.css";

const API_URL = "https://api.futuratextiles.in/api/products";
const LOGIN_API_URL = "https://api.futuratextiles.in/api/auth/login";
const BASE_URL = "https://api.futuratextiles.in";

const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === '') return '';
    const clean = String(imagePath).trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    if (clean.startsWith('/uploads/')) return `${BASE_URL}${clean}`;
    if (clean.startsWith('uploads/')) return `${BASE_URL}/${clean}`;
    return `${BASE_URL}/uploads/${clean}`;
};

const getPdfUrl = (pdfPath) => {
    if (!pdfPath || pdfPath === '') return '';
    const clean = String(pdfPath).trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    if (clean.startsWith('/uploads/')) return `${BASE_URL}${clean}`;
    if (clean.startsWith('uploads/')) return `${BASE_URL}/${clean}`;
    return `${BASE_URL}/uploads/${clean}`;
};

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
    const [colorFilter, setColorFilter] = useState('');

    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedVariants, setSelectedVariants] = useState({});

    const emptyFormData = {
        title: '',
        description: '',
        category: '',
        price: '',
        color: '',
        colorName: '',
        Flammable: '',
        resistant: '',
        QUV: '',
        Weatherometer: '',
        Abrasion: '',
        AntiMicrobial: '',
        PinkStain: '',
        Antiflammable: '',
        Cold: '',
        QUVResistant: '',
        Weath: '',
        Wyzenback: '',
        SafeAnti: '',
        SafeTouch: '',
        SafePink: '',
        TurtleLife: '',
    };

    // ─── New Product State ───
    const [newProductFormData, setNewProductFormData] = useState({ ...emptyFormData });
    const [newProductImages, setNewProductImages] = useState([]);
    const [newProductImagePreviews, setNewProductImagePreviews] = useState([]);
    const [newProductVideo, setNewProductVideo] = useState(null);
    const [newProductVideoPreview, setNewProductVideoPreview] = useState(null);
    const [newProductIcons, setNewProductIcons] = useState([]);
    const [newProductIconPreviews, setNewProductIconPreviews] = useState([]);
    const [newProductIconNames, setNewProductIconNames] = useState([]);   // NEW
    const [newProductSwatches, setNewProductSwatches] = useState([]);
    const [newProductSwatchPreviews, setNewProductSwatchPreviews] = useState([]);
    const [newProductVariants, setNewProductVariants] = useState([]);
    const [newProductPdf, setNewProductPdf] = useState(null);
    const [newProductPdfName, setNewProductPdfName] = useState('');
    const [newProductBaseVariantName, setNewProductBaseVariantName] = useState('');

    // ─── Edit Product State ───
    const [editProductFormData, setEditProductFormData] = useState({ ...emptyFormData });
    const [editProductImages, setEditProductImages] = useState([]);
    const [editProductImagePreviews, setEditProductImagePreviews] = useState([]);
    const [editProductVideo, setEditProductVideo] = useState(null);
    const [editProductVideoPreview, setEditProductVideoPreview] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [existingVideo, setExistingVideo] = useState(null);
    const [removeExistingVideo, setRemoveExistingVideo] = useState(false);
    const [editProductIcons, setEditProductIcons] = useState([]);
    const [editProductIconPreviews, setEditProductIconPreviews] = useState([]);
    const [editProductIconNames, setEditProductIconNames] = useState([]);  // NEW
    const [existingIcons, setExistingIcons] = useState([]);
    const [existingIconNames, setExistingIconNames] = useState([]);        // NEW
    const [editProductSwatches, setEditProductSwatches] = useState([]);
    const [editProductSwatchPreviews, setEditProductSwatchPreviews] = useState([]);
    const [existingSwatches, setExistingSwatches] = useState([]);
    const [editProductVariants, setEditProductVariants] = useState([]);
    const [existingPdf, setExistingPdf] = useState(null);
    const [editProductPdf, setEditProductPdf] = useState(null);
    const [editProductPdfName, setEditProductPdfName] = useState('');
    const [removeExistingPdf, setRemoveExistingPdf] = useState(false);
    const [editProductBaseVariantName, setEditProductBaseVariantName] = useState('');

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Invalid credentials');
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

    const fetchProducts = async (color = '') => {
        try {
            setLoading(true);
            let url = API_URL;
            const params = new URLSearchParams();
            if (color) params.append('color', color);
            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch products');
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

    const handleColorFilterApply = () => {
        fetchProducts(colorFilter.trim());
    };

    const handleColorFilterClear = () => {
        setColorFilter('');
        fetchProducts('');
    };

    // ─────────────────────────────────────────────
    // NEW PRODUCT HANDLERS
    // ─────────────────────────────────────────────
    const handleNewProductInputChange = (e) => {
        const { name, value } = e.target;
        setNewProductFormData(prev => ({ ...prev, [name]: value }));
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
        setNewProductImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
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
        const currentCount = newProductIcons.filter(i => i !== null).length;
        if (currentCount + files.length > 5) {
            setError(`You can only upload ${5 - currentCount} more icons (max 5 total)`);
            e.target.value = '';
            return;
        }
        setNewProductIcons(prev => [...prev, ...files]);
        setNewProductIconPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        setNewProductIconNames(prev => [...prev, ...files.map(() => '')]);  // NEW: blank names
        e.target.value = '';
        setError(null);
    };

    const handleNewProductIconNameChange = (index, value) => {
        setNewProductIconNames(prev => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
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
        setNewProductSwatchPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
        setError(null);
    };

    const handleNewProductPdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                e.target.value = '';
                return;
            }
            setNewProductPdf(file);
            setNewProductPdfName(file.name);
            e.target.value = '';
            setError(null);
        }
    };

    const handleRemoveNewPdf = () => {
        setNewProductPdf(null);
        setNewProductPdfName('');
    };

    const handleRemoveNewImage = (index) => {
        setNewProductImages(prev => { const u = [...prev]; u[index] = null; return u; });
        setNewProductImagePreviews(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceNewImage = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductImages(prev => { const u = [...prev]; u[index] = file; return u; });
            setNewProductImagePreviews(prev => { const u = [...prev]; u[index] = URL.createObjectURL(file); return u; });
            e.target.value = '';
        }
    };

    const handleRemoveNewSwatch = (index) => {
        setNewProductSwatches(prev => { const u = [...prev]; u[index] = null; return u; });
        setNewProductSwatchPreviews(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceNewSwatch = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductSwatches(prev => { const u = [...prev]; u[index] = file; return u; });
            setNewProductSwatchPreviews(prev => { const u = [...prev]; u[index] = URL.createObjectURL(file); return u; });
            e.target.value = '';
        }
    };

    const handleRemoveNewIcon = (index) => {
        setNewProductIcons(prev => { const u = [...prev]; u[index] = null; return u; });
        setNewProductIconPreviews(prev => { const u = [...prev]; u[index] = null; return u; });
        setNewProductIconNames(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceNewIcon = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductIcons(prev => { const u = [...prev]; u[index] = file; return u; });
            setNewProductIconPreviews(prev => { const u = [...prev]; u[index] = URL.createObjectURL(file); return u; });
            e.target.value = '';
        }
    };

    const handleRemoveNewVideo = () => {
        setNewProductVideo(null);
        setNewProductVideoPreview(null);
    };

    // ─── Variants — New Product ───
    const handleAddVariant = () => {
        setNewProductVariants(prev => [...prev, { name: '', color: '', colorName: '', grain: '', images: [], previews: [] }]);
    };

    const handleRemoveVariant = (variantIndex) => {
        setNewProductVariants(prev => prev.filter((_, i) => i !== variantIndex));
    };

    const handleVariantNameChange = (variantIndex, value) => {
        setNewProductVariants(prev => { const u = [...prev]; u[variantIndex].name = value; return u; });
    };

    const handleVariantColorChange = (variantIndex, value) => {
        setNewProductVariants(prev => { const u = [...prev]; u[variantIndex].color = value; return u; });
    };

    const handleVariantColorNameChange = (variantIndex, value) => {
        setNewProductVariants(prev => { const u = [...prev]; u[variantIndex].colorName = value; return u; });
    };

    const handleVariantGrainChange = (variantIndex, value) => {
        setNewProductVariants(prev => { const u = [...prev]; u[variantIndex].grain = value; return u; });
    };

    const handleVariantImagesChange = (variantIndex, e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setNewProductVariants(prev => {
            const u = [...prev];
            u[variantIndex].images = [...u[variantIndex].images, ...files];
            u[variantIndex].previews = [...u[variantIndex].previews, ...files.map(f => URL.createObjectURL(f))];
            return u;
        });
        e.target.value = '';
        setError(null);
    };

    const handleRemoveVariantImage = (variantIndex, imageIndex) => {
        setNewProductVariants(prev => {
            const u = [...prev];
            u[variantIndex].images[imageIndex] = null;
            u[variantIndex].previews[imageIndex] = null;
            return u;
        });
    };

    const handleReplaceVariantImage = (variantIndex, imageIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductVariants(prev => {
                const u = [...prev];
                u[variantIndex].images[imageIndex] = file;
                u[variantIndex].previews[imageIndex] = URL.createObjectURL(file);
                return u;
            });
            e.target.value = '';
        }
    };

    const handleNewProductSubmit = async (e) => {
        e.preventDefault();

        const productTitle = newProductFormData.title.trim();
        const baseVariantLabel = newProductBaseVariantName.trim() || productTitle;

        if (!productTitle || !newProductFormData.price || !newProductFormData.category || !newProductFormData.description) {
            setError('Please fill all required fields');
            return;
        }

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
            formDataToSend.append('title', productTitle);
            formDataToSend.append('description', newProductFormData.description);
            formDataToSend.append('category', newProductFormData.category);
            formDataToSend.append('price', newProductFormData.price);
            formDataToSend.append('color', newProductFormData.color);
            formDataToSend.append('colorName', newProductFormData.colorName);
            formDataToSend.append('baseVariantName', baseVariantLabel);

            // Original properties
            if (newProductFormData.Flammable) formDataToSend.append('Flammable', newProductFormData.Flammable);
            if (newProductFormData.resistant) formDataToSend.append('resistant', newProductFormData.resistant);
            if (newProductFormData.QUV) formDataToSend.append('QUV', newProductFormData.QUV);
            if (newProductFormData.Weatherometer) formDataToSend.append('Weatherometer', newProductFormData.Weatherometer);
            if (newProductFormData.Abrasion) formDataToSend.append('Abrasion', newProductFormData.Abrasion);
            if (newProductFormData.AntiMicrobial) formDataToSend.append('AntiMicrobial', newProductFormData.AntiMicrobial);
            if (newProductFormData.PinkStain) formDataToSend.append('PinkStain', newProductFormData.PinkStain);
            if (newProductFormData.TurtleLife) formDataToSend.append('TurtleLife', newProductFormData.TurtleLife);

            // New properties
            if (newProductFormData.Antiflammable) formDataToSend.append('Antiflammable', newProductFormData.Antiflammable);
            if (newProductFormData.Cold) formDataToSend.append('Cold', newProductFormData.Cold);
            if (newProductFormData.QUVResistant) formDataToSend.append('QUVResistant', newProductFormData.QUVResistant);
            if (newProductFormData.Weath) formDataToSend.append('Weath', newProductFormData.Weath);
            if (newProductFormData.Wyzenback) formDataToSend.append('Wyzenback', newProductFormData.Wyzenback);
            if (newProductFormData.SafeAnti) formDataToSend.append('SafeAnti', newProductFormData.SafeAnti);
            if (newProductFormData.SafeTouch) formDataToSend.append('SafeTouch', newProductFormData.SafeTouch);
            if (newProductFormData.SafePink) formDataToSend.append('SafePink', newProductFormData.SafePink);

            validImages.forEach(image => formDataToSend.append('images', image));
            if (newProductVideo) formDataToSend.append('video', newProductVideo);
            if (newProductPdf) formDataToSend.append('pdf', newProductPdf);

            // Icons + iconNames
            const validIcons = newProductIcons.map((icon, idx) => ({ icon, name: newProductIconNames[idx] || '' })).filter(item => item.icon !== null);
            validIcons.forEach(item => formDataToSend.append('icons', item.icon));
            formDataToSend.append('iconNames', JSON.stringify(validIcons.map(item => item.name)));

            const validSwatches = newProductSwatches.filter(s => s !== null);
            validSwatches.forEach(swatch => formDataToSend.append('swatches', swatch));

            if (newProductVariants.length > 0) {
                formDataToSend.append('variantNames', JSON.stringify(newProductVariants.map(v => v.name)));
                formDataToSend.append('variantColors', JSON.stringify(newProductVariants.map(v => v.color || '')));
                formDataToSend.append('variantColorNames', JSON.stringify(newProductVariants.map(v => v.colorName || '')));
                formDataToSend.append('variantGrain', JSON.stringify(newProductVariants.map(v => v.grain || '')));

                newProductVariants.forEach((variant, index) => {
                    variant.images.filter(img => img !== null).forEach(image => {
                        formDataToSend.append(`variant_${index}`, image);
                    });
                });
            }

            const response = await fetch(API_URL, { method: 'POST', body: formDataToSend });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create product');
            }

            setSuccessMessage('Product created successfully!');
            setNewProductFormData({ ...emptyFormData });
            setNewProductImages([]);
            setNewProductImagePreviews([]);
            setNewProductVideo(null);
            setNewProductVideoPreview(null);
            setNewProductIcons([]);
            setNewProductIconPreviews([]);
            setNewProductIconNames([]);
            setNewProductSwatches([]);
            setNewProductSwatchPreviews([]);
            setNewProductVariants([]);
            setNewProductPdf(null);
            setNewProductPdfName('');
            setNewProductBaseVariantName('');
            setShowAddProductModal(false);
            fetchProducts(colorFilter);
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────
    // EDIT PRODUCT HANDLERS
    // ─────────────────────────────────────────────
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditProductFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            color: product.color || '',
            colorName: product.colorName || '',
            grain: product.grain || '',
            Flammable: product.Flammable || '',
            resistant: product.resistant || '',
            QUV: product.QUV || '',
            Weatherometer: product.Weatherometer || '',
            Abrasion: product.Abrasion || '',
            AntiMicrobial: product.AntiMicrobial || '',
            PinkStain: product.PinkStain || '',
            Antiflammable: product.Antiflammable || '',
            Cold: product.Cold || '',
            QUVResistant: product.QUVResistant || '',
            Weath: product.Weath || '',
            Wyzenback: product.Wyzenback || '',
            SafeAnti: product.SafeAnti || '',
            SafeTouch: product.SafeTouch || '',
            SafePink: product.SafePink || '',
            TurtleLife: product.TurtleLife || '',
        });
        setExistingImages(product.image || []);
        setExistingVideo(product.video || null);
        setExistingIcons(product.icons || []);
        setExistingIconNames((product.iconNames || []).map(n => n || ''));   // NEW
        setExistingSwatches(product.swatches || []);

        setExistingPdf(product.pdf || null);
        setEditProductPdf(null);
        setEditProductPdfName('');
        setRemoveExistingPdf(false);

        setEditProductBaseVariantName(product.baseVariantName || product.title);

        const existingVariants = (product.variants || []).map(v => ({
            name: v.name,
            color: v.color || '',
            colorName: v.colorName || '',
            grain: v.grain || '',
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
        setEditProductIconNames([]);
        setEditProductSwatches([]);
        setEditProductSwatchPreviews([]);
        setRemoveExistingVideo(false);
        setShowEditProductModal(true);
    };

    const handleEditProductInputChange = (e) => {
        const { name, value } = e.target;
        setEditProductFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        const existingCount = existingImages.filter(img => img !== null).length;
        const newCount = editProductImages.filter(img => img !== null).length;
        if (existingCount + newCount + files.length > 30) {
            setError(`Maximum 30 images. You can add ${30 - existingCount - newCount} more.`);
            e.target.value = '';
            return;
        }
        setEditProductImages(prev => [...prev, ...files]);
        setEditProductImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
        setError(null);
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
        const existingCount = existingIcons.filter(i => i !== null).length;
        const newCount = editProductIcons.filter(i => i !== null).length;
        if (existingCount + newCount + files.length > 5) {
            setError(`Maximum 5 icons. You can add ${5 - existingCount - newCount} more.`);
            e.target.value = '';
            return;
        }
        setEditProductIcons(prev => [...prev, ...files]);
        setEditProductIconPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        setEditProductIconNames(prev => [...prev, ...files.map(() => '')]);  // NEW
        e.target.value = '';
        setError(null);
    };

    const handleExistingIconNameChange = (index, value) => {
        setExistingIconNames(prev => { const u = [...prev]; u[index] = value; return u; });
    };

    const handleEditNewIconNameChange = (index, value) => {
        setEditProductIconNames(prev => { const u = [...prev]; u[index] = value; return u; });
    };

    const handleEditProductSwatchChange = (e) => {
        const files = Array.from(e.target.files);
        const existingCount = existingSwatches.filter(s => s !== null).length;
        const newCount = editProductSwatches.filter(s => s !== null).length;
        if (existingCount + newCount + files.length > 30) {
            setError(`Maximum 30 swatches. You can add ${30 - existingCount - newCount} more.`);
            e.target.value = '';
            return;
        }
        setEditProductSwatches(prev => [...prev, ...files]);
        setEditProductSwatchPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
        setError(null);
    };

    const handleEditProductPdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                e.target.value = '';
                return;
            }
            setEditProductPdf(file);
            setEditProductPdfName(file.name);
            setRemoveExistingPdf(false);
            e.target.value = '';
            setError(null);
        }
    };

    const handleRemoveExistingPdf = () => {
        setExistingPdf(null);
        setRemoveExistingPdf(true);
        setEditProductPdf(null);
        setEditProductPdfName('');
    };

    const handleRemoveEditNewPdf = () => {
        setEditProductPdf(null);
        setEditProductPdfName('');
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
        setExistingImages(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceExistingImageInPlace = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setExistingImages(prev => { const u = [...prev]; u[index] = url; return u; });
            setEditProductImages(prev => [...prev, file]);
            setEditProductImagePreviews(prev => [...prev, url]);
            e.target.value = '';
        }
    };

    const handleRemoveEditNewImage = (index) => {
        setEditProductImages(prev => { const u = [...prev]; u[index] = null; return u; });
        setEditProductImagePreviews(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceEditNewImage = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductImages(prev => { const u = [...prev]; u[index] = file; return u; });
            setEditProductImagePreviews(prev => { const u = [...prev]; u[index] = URL.createObjectURL(file); return u; });
            e.target.value = '';
        }
    };

    const handleRemoveExistingIcon = (index) => {
        setExistingIcons(prev => { const u = [...prev]; u[index] = null; return u; });
        setExistingIconNames(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceExistingIconInPlace = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setExistingIcons(prev => { const u = [...prev]; u[index] = url; return u; });
            setEditProductIcons(prev => [...prev, file]);
            setEditProductIconPreviews(prev => [...prev, url]);
            setEditProductIconNames(prev => [...prev, '']);
            e.target.value = '';
        }
    };

    const handleRemoveEditNewIcon = (index) => {
        setEditProductIcons(prev => { const u = [...prev]; u[index] = null; return u; });
        setEditProductIconPreviews(prev => { const u = [...prev]; u[index] = null; return u; });
        setEditProductIconNames(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceEditNewIcon = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductIcons(prev => { const u = [...prev]; u[index] = file; return u; });
            setEditProductIconPreviews(prev => { const u = [...prev]; u[index] = URL.createObjectURL(file); return u; });
            e.target.value = '';
        }
    };

    const handleRemoveExistingSwatch = (index) => {
        setExistingSwatches(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceExistingSwatchInPlace = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setExistingSwatches(prev => { const u = [...prev]; u[index] = url; return u; });
            setEditProductSwatches(prev => [...prev, file]);
            setEditProductSwatchPreviews(prev => [...prev, url]);
            e.target.value = '';
        }
    };

    const handleRemoveEditNewSwatch = (index) => {
        setEditProductSwatches(prev => { const u = [...prev]; u[index] = null; return u; });
        setEditProductSwatchPreviews(prev => { const u = [...prev]; u[index] = null; return u; });
    };

    const handleReplaceEditNewSwatch = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductSwatches(prev => { const u = [...prev]; u[index] = file; return u; });
            setEditProductSwatchPreviews(prev => { const u = [...prev]; u[index] = URL.createObjectURL(file); return u; });
            e.target.value = '';
        }
    };

    // ─── Variants — Edit Product ───
    const handleAddEditVariant = () => {
        setEditProductVariants(prev => [...prev, { name: '', color: '', colorName: '', grain: '', existingImages: [], newImages: [], newPreviews: [] }]);
    };

    const handleRemoveEditVariant = (variantIndex) => {
        setEditProductVariants(prev => prev.filter((_, i) => i !== variantIndex));
    };

    const handleEditVariantNameChange = (variantIndex, value) => {
        setEditProductVariants(prev => { const u = [...prev]; u[variantIndex].name = value; return u; });
    };

    const handleEditVariantColorChange = (variantIndex, value) => {
        setEditProductVariants(prev => { const u = [...prev]; u[variantIndex].color = value; return u; });
    };

    const handleEditVariantColorNameChange = (variantIndex, value) => {
        setEditProductVariants(prev => { const u = [...prev]; u[variantIndex].colorName = value; return u; });
    };

    const handleEditVariantGrainChange = (variantIndex, value) => {
        setEditProductVariants(prev => { const u = [...prev]; u[variantIndex].grain = value; return u; });
    };

    const handleEditVariantImagesChange = (variantIndex, e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setEditProductVariants(prev => {
            const u = [...prev];
            u[variantIndex].newImages = [...u[variantIndex].newImages, ...files];
            u[variantIndex].newPreviews = [...u[variantIndex].newPreviews, ...files.map(f => URL.createObjectURL(f))];
            return u;
        });
        e.target.value = '';
        setError(null);
    };

    const handleReplaceEditVariantExistingImageInPlace = (variantIndex, imageIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setEditProductVariants(prev => {
                const u = [...prev];
                u[variantIndex].existingImages[imageIndex] = url;
                u[variantIndex].newImages = [...u[variantIndex].newImages, file];
                u[variantIndex].newPreviews = [...u[variantIndex].newPreviews, url];
                return u;
            });
            e.target.value = '';
        }
    };

    const handleRemoveEditVariantExistingImage = (variantIndex, imageIndex) => {
        setEditProductVariants(prev => {
            const u = [...prev];
            u[variantIndex].existingImages[imageIndex] = null;
            return u;
        });
    };

    const handleRemoveEditVariantNewImage = (variantIndex, imageIndex) => {
        setEditProductVariants(prev => {
            const u = [...prev];
            u[variantIndex].newImages[imageIndex] = null;
            u[variantIndex].newPreviews[imageIndex] = null;
            return u;
        });
    };

    const handleReplaceEditVariantNewImage = (variantIndex, imageIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProductVariants(prev => {
                const u = [...prev];
                u[variantIndex].newImages[imageIndex] = file;
                u[variantIndex].newPreviews[imageIndex] = URL.createObjectURL(file);
                return u;
            });
            e.target.value = '';
        }
    };

    const handleEditProductSubmit = async (e) => {
        e.preventDefault();

        const productTitle = editProductFormData.title.trim();
        const baseVariantLabel = editProductBaseVariantName.trim() || productTitle;

        if (!productTitle || !editProductFormData.price || !editProductFormData.category || !editProductFormData.description) {
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
            formDataToSend.append('title', productTitle);
            formDataToSend.append('description', editProductFormData.description);
            formDataToSend.append('category', editProductFormData.category);
            formDataToSend.append('price', editProductFormData.price);
            formDataToSend.append('color', editProductFormData.color);
            formDataToSend.append('colorName', editProductFormData.colorName);
            formDataToSend.append('baseVariantName', baseVariantLabel);

            // Original properties
            formDataToSend.append('Flammable', editProductFormData.Flammable);
            formDataToSend.append('resistant', editProductFormData.resistant);
            formDataToSend.append('QUV', editProductFormData.QUV);
            formDataToSend.append('Weatherometer', editProductFormData.Weatherometer);
            formDataToSend.append('Abrasion', editProductFormData.Abrasion);
            formDataToSend.append('AntiMicrobial', editProductFormData.AntiMicrobial);
            formDataToSend.append('PinkStain', editProductFormData.PinkStain);

            // New properties
            formDataToSend.append('Antiflammable', editProductFormData.Antiflammable);
            formDataToSend.append('Cold', editProductFormData.Cold);
            formDataToSend.append('QUVResistant', editProductFormData.QUVResistant);
            formDataToSend.append('Weath', editProductFormData.Weath);
            formDataToSend.append('Wyzenback', editProductFormData.Wyzenback);
            formDataToSend.append('SafeAnti', editProductFormData.SafeAnti);
            formDataToSend.append('SafeTouch', editProductFormData.SafeTouch);
            formDataToSend.append('SafePink', editProductFormData.SafePink);
            formDataToSend.append('TurtleLife', editProductFormData.TurtleLife);

            // Images order
            const imageOrder = [];
            validExistingImages.forEach(img => imageOrder.push(img));
            validNewImages.forEach((_, index) => imageOrder.push(`NEW_FILE_${index}`));
            formDataToSend.append('imageOrder', JSON.stringify(imageOrder));
            validNewImages.forEach(image => formDataToSend.append('images', image));

            // Icons + iconNames
            const validExistingIcons = existingIcons
                .map((icon, idx) => ({ icon, name: existingIconNames[idx] || '' }))
                .filter(item => item.icon !== null);
            const validNewIcons = editProductIcons
                .map((icon, idx) => ({ icon, name: editProductIconNames[idx] || '' }))
                .filter(item => item.icon !== null);

            const iconOrder = [];
            const allIconNames = [];
            validExistingIcons.forEach(item => { iconOrder.push(item.icon); allIconNames.push(item.name); });
            validNewIcons.forEach((item, index) => { iconOrder.push(`NEW_ICON_${index}`); allIconNames.push(item.name); });
            formDataToSend.append('iconOrder', JSON.stringify(iconOrder));
            formDataToSend.append('iconNames', JSON.stringify(allIconNames));
            validNewIcons.forEach(item => formDataToSend.append('icons', item.icon));

            // Swatches
            const validExistingSwatches = existingSwatches.filter(s => s !== null);
            const validNewSwatches = editProductSwatches.filter(s => s !== null);
            const swatchOrder = [];
            validExistingSwatches.forEach(swatch => swatchOrder.push(swatch));
            validNewSwatches.forEach((_, index) => swatchOrder.push(`NEW_SWATCH_${index}`));
            formDataToSend.append('swatchOrder', JSON.stringify(swatchOrder));
            validNewSwatches.forEach(swatch => formDataToSend.append('swatches', swatch));

            if (editProductVideo) {
                formDataToSend.append('video', editProductVideo);
            } else if (removeExistingVideo) {
                formDataToSend.append('removeVideo', 'true');
            }

            if (editProductPdf) {
                formDataToSend.append('pdf', editProductPdf);
            } else if (removeExistingPdf) {
                formDataToSend.append('removePdf', 'true');
            }

            if (editProductVariants.length > 0) {
                formDataToSend.append('variantNames', JSON.stringify(editProductVariants.map(v => v.name)));
                formDataToSend.append('variantColors', JSON.stringify(editProductVariants.map(v => v.color || '')));
                formDataToSend.append('variantColorNames', JSON.stringify(editProductVariants.map(v => v.colorName || '')));
                formDataToSend.append('variantGrains', JSON.stringify(editProductVariants.map(v => v.grain || '')));

                const variantOrders = editProductVariants.map(variant => {
                    const order = [];
                    variant.existingImages.filter(img => img !== null).forEach(img => order.push(img));
                    variant.newImages.filter(img => img !== null).forEach((_, index) => order.push(`NEW_VARIANT_${index}`));
                    return order;
                });
                formDataToSend.append('variantOrders', JSON.stringify(variantOrders));

                editProductVariants.forEach((variant, index) => {
                    variant.newImages.filter(img => img !== null).forEach(image => {
                        formDataToSend.append(`variant_${index}`, image);
                    });
                });
            }

            const response = await fetch(`${API_URL}/${editingProduct._id}`, { method: 'PUT', body: formDataToSend });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            setSuccessMessage('Product updated successfully!');
            setShowEditProductModal(false);
            setEditingProduct(null);
            fetchProducts(colorFilter);
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/${productId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete product');
            setSuccessMessage('Product deleted successfully!');
            fetchProducts(colorFilter);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
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
        setSelectedVariants(prev => ({ ...prev, [productId]: variantIndex }));
    };

    // ── Shared Properties Form Section (reused in Add + Edit) ──
    const renderPropertiesSection = (formData, onChange) => (
        <div className="form-section">
            <h3>Product Properties (Optional)</h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>Group 1 — Original</p>
            <div className="form-row">
                <div className="form-group">
                    <label>Flammable</label>
                    <input type="text" name="Flammable" value={formData.Flammable} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Resistant</label>
                    <input type="text" name="resistant" value={formData.resistant} onChange={onChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>QUV</label>
                    <input type="text" name="QUV" value={formData.QUV} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Weatherometer</label>
                    <input type="text" name="Weatherometer" value={formData.Weatherometer} onChange={onChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Abrasion</label>
                    <input type="text" name="Abrasion" value={formData.Abrasion} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Anti-Microbial</label>
                    <input type="text" name="AntiMicrobial" value={formData.AntiMicrobial} onChange={onChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Pink Stain</label>
                    <input type="text" name="PinkStain" value={formData.PinkStain} onChange={onChange} />
                </div>
            </div>

            <p style={{ fontSize: '12px', color: '#888', margin: '16px 0 12px' }}>Group 2 — Extended</p>
            <div className="form-row">
                <div className="form-group">
                    <label>Anti-Flammable</label>
                    <input type="text" name="Antiflammable" value={formData.Antiflammable} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Cold</label>
                    <input type="text" name="Cold" value={formData.Cold} onChange={onChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>QUV Resistant</label>
                    <input type="text" name="QUVResistant" value={formData.QUVResistant} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Weath</label>
                    <input type="text" name="Weath" value={formData.Weath} onChange={onChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Wyzenback</label>
                    <input type="text" name="Wyzenback" value={formData.Wyzenback} onChange={onChange} />
                </div>
                 <div className="form-group">
                    <label>Turtle Life</label>
                    <input type="text" name="TurtleLife" value={formData.TurtleLife} onChange={onChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Safe Pink</label>
                    <input type="text" name="SafePink" value={formData.SafePink} onChange={onChange} />
                </div>
                 <div className="form-group">
                    <label>Safe Anti</label>
                    <input type="text" name="SafeAnti" value={formData.SafeAnti} onChange={onChange} />
                </div>
            </div>
              <div className="form-row">
                 <div className="form-group">
                    <label>Safe Touch</label>
                    <input type="text" name="SafeTouch" value={formData.SafeTouch} onChange={onChange} />
                </div>
            </div>
        </div>
    );

    // ====================== RENDER ======================

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
                                    <i className="fas fa-envelope"></i> Email Address
                                </label>
                                <input type="email" id="login-email" value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="Enter your email" required disabled={loginLoading} />
                            </div>
                            <div className="login-form-group">
                                <label htmlFor="login-password">
                                    <i className="fas fa-key"></i> Password
                                </label>
                                <input type="password" id="login-password" value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="Enter your password" required disabled={loginLoading} />
                            </div>
                            <button onClick={handleLogin} className="login-btn" disabled={loginLoading}>
                                {loginLoading ? (
                                    <><i className="fas fa-spinner fa-spin"></i> Logging in...</>
                                ) : (
                                    <><i className="fas fa-sign-in-alt"></i> Login</>
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
                        <div className="alert alert-success">{successMessage}</div>
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
                        <p className="no-products-found">
                            No products found.{searchTerm && " Adjust your search or "}
                            {colorFilter && ` No products with color "${colorFilter}". `}
                            Click "Add Product" to create your first product!
                        </p>
                    )}

                    {!loading && filteredProducts.length > 0 && (
                        <div className="products-cards">
                            {filteredProducts.map(product => {
                                const selectedVariantIndex = selectedVariants[product._id];
                                const activeVariant = (selectedVariantIndex !== undefined && selectedVariantIndex !== null && product.variants && product.variants[selectedVariantIndex])
                                    ? product.variants[selectedVariantIndex]
                                    : null;
                                const displayImages = activeVariant ? activeVariant.images : product.image;

                                return (
                                    <div key={product._id} className="product-card">
                                        <div className="product-card-image">
                                            {displayImages && displayImages.length > 0 && (
                                                <img src={getImageUrl(displayImages[0])} alt={product.title} />
                                            )}
                                        </div>

                                        {product.variants && product.variants.length > 0 && (
                                            <div className="product-variants-section">
                                                <h4 className="variants-title">Available Variants:</h4>
                                                <div className="variants-grid">
                                                    <button
                                                        className={`variant-btn ${selectedVariantIndex === null || selectedVariantIndex === undefined ? 'active' : ''}`}
                                                        onClick={(e) => { e.preventDefault(); handleVariantSelect(product._id, null); }}
                                                    >
                                                        {product.color && (
                                                            <span className="variant-color-dot" style={{ backgroundColor: product.color }} />
                                                        )}
                                                        {product.baseVariantName || product.title}
                                                    </button>

                                                    {product.variants.map((variant, index) => (
                                                        <button key={index}
                                                            className={`variant-btn ${selectedVariantIndex === index ? 'active' : ''}`}
                                                            onClick={(e) => { e.preventDefault(); handleVariantSelect(product._id, index); }}
                                                            title={variant.color ? `Color: ${variant.color}` : variant.name}
                                                        >
                                                            {variant.color && (
                                                                <span className="variant-color-dot" style={{ backgroundColor: variant.color }} />
                                                            )}
                                                            {variant.name}
                                                        </button>
                                                    ))}
                                                </div>

                                                {activeVariant && (activeVariant.color || activeVariant.colorName || activeVariant.grain) && (
                                                    <div className="variant-meta-display">
                                                        {activeVariant.color && (
                                                            <div className="variant-color-display">
                                                                <i className="fas fa-circle" style={{ color: activeVariant.color, marginRight: '6px' }}></i>
                                                                Variant Color: <strong>{activeVariant.color}</strong>
                                                            </div>
                                                        )}
                                                        {activeVariant.colorName && (
                                                            <div className="variant-colorname-display">
                                                                <i className="fas fa-tag" style={{ marginRight: '6px' }}></i>
                                                                Color Name: <strong>{activeVariant.colorName}</strong>
                                                            </div>
                                                        )}
                                                        {activeVariant.grain && (
                                                            <div className="variant-grain-display">
                                                                <i className="fas fa-layer-group" style={{ marginRight: '6px' }}></i>
                                                                Variant Grain: <strong>{activeVariant.grain}</strong>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {product.icons && product.icons.length > 0 && (
                                            <div className="product-icons-section">
                                                {product.icons.map((icon, index) => (
                                                    <div key={index} className="product-icon-item">
                                                        <img src={getImageUrl(icon)} alt={product.iconNames?.[index] || `Icon ${index + 1}`} />
                                                        {product.iconNames?.[index] && (
                                                            <span className="product-icon-name">{product.iconNames[index]}</span>
                                                        )}
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

                                            {product.color && (
                                                <div className="product-color-section">
                                                    <span className="color-label">
                                                        <i className="fas fa-circle" style={{ color: product.color, marginRight: '6px' }}></i>
                                                        Color: <strong>{product.color}</strong>
                                                        {product.colorName && (
                                                            <span style={{ marginLeft: '8px', color: '#666' }}>({product.colorName})</span>
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {product.pdf && (
                                                <div className="product-pdf-section">
                                                    <a href={getPdfUrl(product.pdf)} target="_blank" rel="noopener noreferrer" className="pdf-download-btn">
                                                        <i className="fas fa-file-pdf"></i> View / Download PDF
                                                    </a>
                                                </div>
                                            )}TurtleLife

                                            <div className="product-specifications">
                                                {product.Flammable && <p className="spec-item"><strong>Flammable:</strong> {product.Flammable}</p>}
                                                {product.resistant && <p className="spec-item"><strong>Resistant:</strong> {product.resistant}</p>}
                                                {product.QUV && <p className="spec-item"><strong>QUV:</strong> {product.QUV}</p>}
                                                {product.Weatherometer && <p className="spec-item"><strong>Weatherometer:</strong> {product.Weatherometer}</p>}
                                                {product.Abrasion && <p className="spec-item"><strong>Abrasion:</strong> {product.Abrasion}</p>}
                                                {product.AntiMicrobial && <p className="spec-item"><strong>Anti-Microbial:</strong> {product.AntiMicrobial}</p>}
                                                {product.PinkStain && <p className="spec-item"><strong>Pink Stain:</strong> {product.PinkStain}</p>}
                                                {product.Antiflammable && <p className="spec-item"><strong>Anti-Flammable:</strong> {product.Antiflammable}</p>}
                                                {product.Cold && <p className="spec-item"><strong>Cold:</strong> {product.Cold}</p>}
                                                {product.QUVResistant && <p className="spec-item"><strong>QUV Resistant:</strong> {product.QUVResistant}</p>}
                                                {product.Weath && <p className="spec-item"><strong>Weath:</strong> {product.Weath}</p>}
                                                {product.Wyzenback && <p className="spec-item"><strong>Wyzenback:</strong> {product.Wyzenback}</p>}
                                                {product.SafeAnti && <p className="spec-item"><strong>Safe Anti:</strong> {product.SafeAnti}</p>}
                                                {product.SafeTouch && <p className="spec-item"><strong>Safe Touch:</strong> {product.SafeTouch}</p>}
                                                {product.SafePink && <p className="spec-item"><strong>Safe Pink:</strong> {product.SafePink}</p>}
                                                {product.TurtleLife && <p className="spec-item"><strong>Turtle Life:</strong> {product.TurtleLife}</p>}
                                            </div>

                                            <div className="product-card-actions">
                                                <button className="card-action-btn edit-btn" onClick={() => handleEditClick(product)} disabled={loading}>
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="card-action-btn delete-btn" disabled={loading}>
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

                {/* =========== ADD PRODUCT MODAL =========== */}
                {showAddProductModal && (
                    <div className="modal-overlay" onClick={() => setShowAddProductModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Product</h2>
                                <button className="modal-close-btn" onClick={() => setShowAddProductModal(false)}>&times;</button>
                            </div>

                            <div className="add-product-form">
                                <div className="form-group">
                                    <label htmlFor="new-product-title">Product Title *</label>
                                    <input type="text" id="new-product-title" name="title"
                                        value={newProductFormData.title}
                                        onChange={handleNewProductInputChange}
                                        placeholder="e.g. AMERICANA, FUERTE"
                                        required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="new-product-description">Product Description *</label>
                                    <textarea id="new-product-description" name="description"
                                        value={newProductFormData.description} onChange={handleNewProductInputChange} rows="4" required />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="new-product-price">Price *</label>
                                        <input type="number" id="new-product-price" name="price"
                                            value={newProductFormData.price} onChange={handleNewProductInputChange}
                                            step="0.01" min="0" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="new-product-category">Category *</label>
                                        <input type="text" id="new-product-category" name="category"
                                            value={newProductFormData.category} onChange={handleNewProductInputChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="new-product-color">
                                            <i className="fas fa-palette"></i> Product Color (Optional)
                                        </label>
                                        <input type="text" id="new-product-color" name="color"
                                            value={newProductFormData.color} onChange={handleNewProductInputChange}
                                            placeholder="e.g. Red, #FF5733" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="new-product-colorName">
                                            <i className="fas fa-tag"></i> Color Name (Optional)
                                        </label>
                                        <input type="text" id="new-product-colorName" name="colorName"
                                            value={newProductFormData.colorName} onChange={handleNewProductInputChange}
                                            placeholder="e.g. Midnight Blue, Scarlet Red" />
                                    </div>
                                </div>

                                {renderPropertiesSection(newProductFormData, handleNewProductInputChange)}

                                {/* Default Variant Button Name */}
                                <div className="variant-item" style={{ marginBottom: '16px' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600' }}>
                                            Default Variant Button Name
                                            <span style={{ fontWeight: '400', color: '#888', fontSize: '13px', marginLeft: '6px' }}>
                                                (Variant buttons mein pehle button ka naam — Product Title se alag)
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newProductBaseVariantName}
                                            onChange={(e) => setNewProductBaseVariantName(e.target.value)}
                                            placeholder={`Default: "${newProductFormData.title || 'Product Title'}" (leave empty to use product title)`}
                                        />
                                    </div>
                                </div>

                                {/* Product Images */}
                                <div className="form-group image-upload-group">
                                    <label>Product Images * (Max 30)</label>
                                    <div className="image-input-grid">
                                        {newProductImagePreviews.map((preview, index) => (
                                            preview !== null ? (
                                                <div key={index} className="image-preview-box">
                                                    <img src={preview} alt={`Preview ${index}`} />
                                                    <div className="image-overlay-actions">
                                                        <label htmlFor={`replace-new-image-${index}`} className="replace-btn" title="Replace">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </label>
                                                        <button type="button" className="remove-image-btn" onClick={() => handleRemoveNewImage(index)}>×</button>
                                                    </div>
                                                    <input type="file" id={`replace-new-image-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceNewImage(index, e)} style={{ display: 'none' }} />
                                                </div>
                                            ) : (
                                                <label key={index} htmlFor={`add-at-${index}`} className="image-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i><span>Add Here</span>
                                                    <input type="file" id={`add-at-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceNewImage(index, e)} style={{ display: 'none' }} />
                                                </label>
                                            )
                                        ))}
                                        {newProductImages.filter(img => img !== null).length < 30 && (
                                            <label htmlFor="new-product-images" className="image-upload-placeholder">
                                                <i className="fas fa-plus"></i><span>Add New</span>
                                            </label>
                                        )}
                                        <input type="file" id="new-product-images" accept="image/*"
                                            onChange={handleNewProductImageChange} multiple style={{ display: 'none' }} />
                                    </div>
                                    <p className="uploaded-image-count">{newProductImages.filter(img => img !== null).length} image(s) uploaded</p>
                                </div>

                                {/* Icons with Names */}
                                <div className="form-group icon-upload-group">
                                    <label>Product Icons (Optional, Max 5) — with display names</label>
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
                                                    <input type="file" id={`replace-new-icon-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceNewIcon(index, e)} style={{ display: 'none' }} />
                                                    {/* Icon name input */}
                                                    <input
                                                        type="text"
                                                        className="icon-name-input"
                                                        placeholder="Icon name..."
                                                        value={newProductIconNames[index] || ''}
                                                        onChange={(e) => handleNewProductIconNameChange(index, e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <label key={index} htmlFor={`add-icon-at-${index}`} className="icon-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i><span>Add</span>
                                                    <input type="file" id={`add-icon-at-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceNewIcon(index, e)} style={{ display: 'none' }} />
                                                </label>
                                            )
                                        ))}
                                        {newProductIcons.filter(i => i !== null).length < 5 && (
                                            <label htmlFor="new-product-icons" className="icon-upload-placeholder">
                                                <i className="fas fa-plus"></i><span>Add New</span>
                                            </label>
                                        )}
                                        <input type="file" id="new-product-icons" accept="image/*"
                                            onChange={handleNewProductIconChange} multiple style={{ display: 'none' }} />
                                    </div>
                                    <p className="uploaded-icon-count">{newProductIcons.filter(i => i !== null).length} icon(s) uploaded</p>
                                </div>

                                {/* PDF Upload */}
                                <div className="form-group pdf-upload-group">
                                    <label>
                                        <i className="fas fa-file-pdf"></i> Product PDF (Optional — 1 file only)
                                    </label>
                                    {newProductPdf ? (
                                        <div className="pdf-preview-box">
                                            <i className="fas fa-file-pdf pdf-icon-large"></i>
                                            <span className="pdf-filename">{newProductPdfName}</span>
                                            <button type="button" className="remove-pdf-btn" onClick={handleRemoveNewPdf}>
                                                <i className="fas fa-times"></i> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="new-product-pdf" className="pdf-upload-placeholder">
                                            <i className="fas fa-upload"></i>
                                            <span>Click to select a PDF file</span>
                                            <input type="file" id="new-product-pdf" accept="application/pdf"
                                                onChange={handleNewProductPdfChange} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                </div>

                                {/* ─── VARIANTS — ADD PRODUCT ─── */}
                                <div className="form-group variants-section">
                                    <div className="variants-header">
                                        <label>Product Variants (Optional)</label>
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
                                                <input type="text" value={variant.name}
                                                    onChange={(e) => handleVariantNameChange(variantIndex, e.target.value)}
                                                    placeholder="e.g., Navy Blue, Size L" required />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label><i className="fas fa-palette"></i> Variant Color (Optional)</label>
                                                    <div className="variant-color-input-row">
                                                        <input type="text" value={variant.color}
                                                            onChange={(e) => handleVariantColorChange(variantIndex, e.target.value)}
                                                            placeholder="e.g. Red, #FF5733" />
                                                        {variant.color && (
                                                            <span className="variant-color-preview-swatch"
                                                                style={{ backgroundColor: variant.color }} title={variant.color} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label><i className="fas fa-tag"></i> Color Name (Optional)</label>
                                                    <input type="text" value={variant.colorName}
                                                        onChange={(e) => handleVariantColorNameChange(variantIndex, e.target.value)}
                                                        placeholder="e.g. Midnight Blue, Scarlet" />
                                                </div>
                                                <div className="form-group">
                                                    <label><i className="fas fa-layer-group"></i> Variant Grain (Optional)</label>
                                                    <input type="text" value={variant.grain}
                                                        onChange={(e) => handleVariantGrainChange(variantIndex, e.target.value)}
                                                        placeholder="e.g. Smooth, Textured, Matte" />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Variant Images *</label>
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
                                                                <input type="file" id={`replace-variant-${variantIndex}-${imgIndex}`} accept="image/*"
                                                                    onChange={(e) => handleReplaceVariantImage(variantIndex, imgIndex, e)} style={{ display: 'none' }} />
                                                            </div>
                                                        ) : (
                                                            <label key={imgIndex} htmlFor={`add-variant-at-${variantIndex}-${imgIndex}`} className="variant-image-upload-placeholder empty-slot">
                                                                <i className="fas fa-upload"></i><span>Add</span>
                                                                <input type="file" id={`add-variant-at-${variantIndex}-${imgIndex}`} accept="image/*"
                                                                    onChange={(e) => handleReplaceVariantImage(variantIndex, imgIndex, e)} style={{ display: 'none' }} />
                                                            </label>
                                                        )
                                                    ))}
                                                    <label htmlFor={`variant-images-${variantIndex}`} className="variant-image-upload-placeholder">
                                                        <i className="fas fa-plus"></i><span>Add New</span>
                                                    </label>
                                                    <input type="file" id={`variant-images-${variantIndex}`} accept="image/*"
                                                        onChange={(e) => handleVariantImagesChange(variantIndex, e)} multiple style={{ display: 'none' }} />
                                                </div>
                                                <p className="uploaded-count">{variant.images.filter(img => img !== null).length} image(s)</p>
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

                {/* =========== EDIT PRODUCT MODAL =========== */}
                {showEditProductModal && (
                    <div className="modal-overlay" onClick={() => setShowEditProductModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Product</h2>
                                <button className="modal-close-btn" onClick={() => setShowEditProductModal(false)}>&times;</button>
                            </div>

                            <div className="edit-product-form">
                                <div className="form-group">
                                    <label htmlFor="edit-product-title">Product Title *</label>
                                    <input type="text" id="edit-product-title" name="title"
                                        value={editProductFormData.title}
                                        onChange={handleEditProductInputChange}
                                        required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-product-description">Product Description *</label>
                                    <textarea id="edit-product-description" name="description"
                                        value={editProductFormData.description} onChange={handleEditProductInputChange} rows="4" required />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="edit-product-price">Price *</label>
                                        <input type="number" id="edit-product-price" name="price"
                                            value={editProductFormData.price} onChange={handleEditProductInputChange}
                                            step="0.01" min="0" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="edit-product-category">Category *</label>
                                        <input type="text" id="edit-product-category" name="category"
                                            value={editProductFormData.category} onChange={handleEditProductInputChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="edit-product-color">
                                            <i className="fas fa-palette"></i> Product Color (Optional)
                                        </label>
                                        <input type="text" id="edit-product-color" name="color"
                                            value={editProductFormData.color} onChange={handleEditProductInputChange}
                                            placeholder="e.g. Red, Navy Blue, #FF5733" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="edit-product-colorName">
                                            <i className="fas fa-tag"></i> Color Name (Optional)
                                        </label>
                                        <input type="text" id="edit-product-colorName" name="colorName"
                                            value={editProductFormData.colorName} onChange={handleEditProductInputChange}
                                            placeholder="e.g. Midnight Blue, Scarlet Red" />
                                    </div>
                                </div>

                                {renderPropertiesSection(editProductFormData, handleEditProductInputChange)}

                                {/* Default Variant Button Name */}
                                <div className="variant-item" style={{ marginBottom: '16px' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600' }}>
                                            Default Variant Button Name
                                            <span style={{ fontWeight: '400', color: '#888', fontSize: '13px', marginLeft: '6px' }}>
                                                (Variant buttons mein pehle button ka naam — Product Title se alag)
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editProductBaseVariantName}
                                            onChange={(e) => setEditProductBaseVariantName(e.target.value)}
                                            placeholder={`Default: "${editProductFormData.title}" (leave empty to use product title)`}
                                        />
                                    </div>
                                </div>

                                {/* Images Edit */}
                                <div className="form-group image-upload-group">
                                    <label>Product Images * - Remove & Replace at position</label>
                                    <div className="image-input-grid">
                                        {existingImages.map((img, index) => (
                                            img !== null ? (
                                                <div key={`existing-${index}`} className="image-preview-box existing">
                                                    <img src={getImageUrl(img)} alt={`Existing ${index}`} />
                                                    <div className="image-overlay-actions">
                                                        <label htmlFor={`replace-existing-image-${index}`} className="replace-btn" title="Replace">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </label>
                                                        <button type="button" className="remove-image-btn" onClick={() => handleRemoveExistingImage(index)}>×</button>
                                                    </div>
                                                    <input type="file" id={`replace-existing-image-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceExistingImageInPlace(index, e)} style={{ display: 'none' }} />
                                                </div>
                                            ) : (
                                                <label key={`existing-${index}`} htmlFor={`add-existing-at-${index}`} className="image-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i><span>Add</span>
                                                    <input type="file" id={`add-existing-at-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceExistingImageInPlace(index, e)} style={{ display: 'none' }} />
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
                                                    <input type="file" id={`replace-edit-new-image-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceEditNewImage(index, e)} style={{ display: 'none' }} />
                                                </div>
                                            ) : (
                                                <label key={`new-${index}`} htmlFor={`add-edit-new-at-${index}`} className="image-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i><span>Add</span>
                                                    <input type="file" id={`add-edit-new-at-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceEditNewImage(index, e)} style={{ display: 'none' }} />
                                                </label>
                                            )
                                        ))}
                                        {(existingImages.filter(img => img !== null).length + editProductImages.filter(img => img !== null).length) < 30 && (
                                            <label htmlFor="edit-product-images" className="image-upload-placeholder">
                                                <i className="fas fa-plus"></i><span>Add New</span>
                                            </label>
                                        )}
                                        <input type="file" id="edit-product-images" accept="image/*"
                                            onChange={handleEditProductImageChange} multiple style={{ display: 'none' }} />
                                    </div>
                                    <p className="image-count-info">
                                        Total: {existingImages.filter(img => img !== null).length + editProductImages.filter(img => img !== null).length} / 30 images
                                    </p>
                                </div>

                                {/* Icons Edit — with name inputs */}
                                <div className="form-group icon-upload-group">
                                    <label>Product Icons (Optional, Max 5) — with display names</label>
                                    <div className="icon-input-grid">
                                        {existingIcons.map((icon, index) => (
                                            icon !== null ? (
                                                <div key={`existing-icon-${index}`} className="icon-preview-box existing">
                                                    <img src={getImageUrl(icon)} alt={`Existing Icon ${index}`} />
                                                    <div className="icon-overlay-actions">
                                                        <label htmlFor={`replace-existing-icon-${index}`} className="replace-btn" title="Replace">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </label>
                                                        <button type="button" className="remove-icon-btn" onClick={() => handleRemoveExistingIcon(index)}>×</button>
                                                    </div>
                                                    <input type="file" id={`replace-existing-icon-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceExistingIconInPlace(index, e)} style={{ display: 'none' }} />
                                                    {/* Existing icon name input */}
                                                    <input
                                                        type="text"
                                                        className="icon-name-input"
                                                        placeholder="Icon name..."
                                                        value={existingIconNames[index] || ''}
                                                        onChange={(e) => handleExistingIconNameChange(index, e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <label key={`existing-icon-${index}`} htmlFor={`add-existing-icon-at-${index}`} className="icon-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i><span>Add</span>
                                                    <input type="file" id={`add-existing-icon-at-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceExistingIconInPlace(index, e)} style={{ display: 'none' }} />
                                                </label>
                                            )
                                        ))}
                                        {editProductIconPreviews.map((preview, index) => (
                                            preview !== null ? (
                                                <div key={`new-icon-${index}`} className="icon-preview-box new">
                                                    <img src={preview} alt={`New Icon ${index}`} />
                                                    <div className="icon-overlay-actions">
                                                        <label htmlFor={`replace-edit-new-icon-${index}`} className="replace-btn" title="Replace">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </label>
                                                        <button type="button" className="remove-icon-btn" onClick={() => handleRemoveEditNewIcon(index)}>×</button>
                                                    </div>
                                                    <input type="file" id={`replace-edit-new-icon-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceEditNewIcon(index, e)} style={{ display: 'none' }} />
                                                    {/* New icon name input */}
                                                    <input
                                                        type="text"
                                                        className="icon-name-input"
                                                        placeholder="Icon name..."
                                                        value={editProductIconNames[index] || ''}
                                                        onChange={(e) => handleEditNewIconNameChange(index, e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <label key={`new-icon-${index}`} htmlFor={`add-edit-new-icon-at-${index}`} className="icon-upload-placeholder empty-slot">
                                                    <i className="fas fa-upload"></i><span>Add</span>
                                                    <input type="file" id={`add-edit-new-icon-at-${index}`} accept="image/*"
                                                        onChange={(e) => handleReplaceEditNewIcon(index, e)} style={{ display: 'none' }} />
                                                </label>
                                            )
                                        ))}
                                        {(existingIcons.filter(i => i !== null).length + editProductIcons.filter(i => i !== null).length) < 5 && (
                                            <label htmlFor="edit-product-icons" className="icon-upload-placeholder">
                                                <i className="fas fa-plus"></i><span>Add New</span>
                                            </label>
                                        )}
                                        <input type="file" id="edit-product-icons" accept="image/*"
                                            onChange={handleEditProductIconChange} multiple style={{ display: 'none' }} />
                                    </div>
                                    <p className="icon-count-info">
                                        Total: {existingIcons.filter(i => i !== null).length + editProductIcons.filter(i => i !== null).length} / 5 icons
                                    </p>
                                </div>

                                {/* PDF Upload — Edit Product */}
                                <div className="form-group pdf-upload-group">
                                    <label>
                                        <i className="fas fa-file-pdf"></i> Product PDF (Optional — 1 file only)
                                    </label>

                                    {existingPdf && !editProductPdf && (
                                        <div className="pdf-preview-box existing-pdf">
                                            <i className="fas fa-file-pdf pdf-icon-large"></i>
                                            <a href={getPdfUrl(existingPdf)} target="_blank" rel="noopener noreferrer" className="pdf-existing-link">
                                                View Current PDF
                                            </a>
                                            <button type="button" className="remove-pdf-btn" onClick={handleRemoveExistingPdf}>
                                                <i className="fas fa-times"></i> Remove
                                            </button>
                                        </div>
                                    )}

                                    {editProductPdf && (
                                        <div className="pdf-preview-box new-pdf">
                                            <i className="fas fa-file-pdf pdf-icon-large"></i>
                                            <span className="pdf-filename">{editProductPdfName}</span>
                                            <button type="button" className="remove-pdf-btn" onClick={handleRemoveEditNewPdf}>
                                                <i className="fas fa-times"></i> Remove
                                            </button>
                                        </div>
                                    )}

                                    {!editProductPdf && (
                                        <label htmlFor="edit-product-pdf" className="pdf-upload-placeholder" style={{ marginTop: existingPdf ? '8px' : '0' }}>
                                            <i className="fas fa-upload"></i>
                                            <span>{existingPdf ? 'Replace PDF' : 'Click to select a PDF file'}</span>
                                            <input type="file" id="edit-product-pdf" accept="application/pdf"
                                                onChange={handleEditProductPdfChange} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                </div>

                                {/* ─── VARIANTS — EDIT PRODUCT ─── */}
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
                                                <input type="text" value={variant.name}
                                                    onChange={(e) => handleEditVariantNameChange(variantIndex, e.target.value)}
                                                    placeholder="e.g., Navy Blue, Size L" required />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group variant-color-field">
                                                    <label><i className="fas fa-palette"></i> Variant Color (Optional)</label>
                                                    <div className="variant-color-input-row">
                                                        <input type="text" value={variant.color}
                                                            onChange={(e) => handleEditVariantColorChange(variantIndex, e.target.value)}
                                                            placeholder="e.g. Red, #FF5733" />
                                                        {variant.color && (
                                                            <span className="variant-color-preview-swatch"
                                                                style={{ backgroundColor: variant.color }} title={variant.color} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label><i className="fas fa-tag"></i> Color Name (Optional)</label>
                                                    <input type="text" value={variant.colorName}
                                                        onChange={(e) => handleEditVariantColorNameChange(variantIndex, e.target.value)}
                                                        placeholder="e.g. Midnight Blue, Scarlet" />
                                                </div>
                                                <div className="form-group variant-grain-field">
                                                    <label><i className="fas fa-layer-group"></i> Variant Grain (Optional)</label>
                                                    <input type="text" value={variant.grain}
                                                        onChange={(e) => handleEditVariantGrainChange(variantIndex, e.target.value)}
                                                        placeholder="e.g. Smooth, Textured, Matte" />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Variant Images *</label>
                                                <div className="variant-images-grid">
                                                    {variant.existingImages.map((img, imgIndex) => (
                                                        img !== null ? (
                                                            <div key={`existing-variant-${imgIndex}`} className="variant-image-preview existing">
                                                                <img src={getImageUrl(img)} alt={`Existing ${imgIndex}`} />
                                                                <div className="variant-overlay-actions">
                                                                    <label htmlFor={`replace-edit-variant-existing-${variantIndex}-${imgIndex}`} className="replace-btn" title="Replace">
                                                                        <i className="fas fa-sync-alt"></i>
                                                                    </label>
                                                                    <button type="button" className="remove-variant-image-btn" onClick={() => handleRemoveEditVariantExistingImage(variantIndex, imgIndex)}>×</button>
                                                                </div>
                                                                <input type="file" id={`replace-edit-variant-existing-${variantIndex}-${imgIndex}`} accept="image/*"
                                                                    onChange={(e) => handleReplaceEditVariantExistingImageInPlace(variantIndex, imgIndex, e)} style={{ display: 'none' }} />
                                                            </div>
                                                        ) : (
                                                            <label key={`existing-variant-${imgIndex}`} htmlFor={`add-edit-variant-existing-at-${variantIndex}-${imgIndex}`} className="variant-image-upload-placeholder empty-slot">
                                                                <i className="fas fa-upload"></i><span>Add</span>
                                                                <input type="file" id={`add-edit-variant-existing-at-${variantIndex}-${imgIndex}`} accept="image/*"
                                                                    onChange={(e) => handleReplaceEditVariantExistingImageInPlace(variantIndex, imgIndex, e)} style={{ display: 'none' }} />
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
                                                                <input type="file" id={`replace-edit-variant-new-${variantIndex}-${imgIndex}`} accept="image/*"
                                                                    onChange={(e) => handleReplaceEditVariantNewImage(variantIndex, imgIndex, e)} style={{ display: 'none' }} />
                                                            </div>
                                                        ) : (
                                                            <label key={`new-variant-${imgIndex}`} htmlFor={`add-edit-variant-new-at-${variantIndex}-${imgIndex}`} className="variant-image-upload-placeholder empty-slot">
                                                                <i className="fas fa-upload"></i><span>Add</span>
                                                                <input type="file" id={`add-edit-variant-new-at-${variantIndex}-${imgIndex}`} accept="image/*"
                                                                    onChange={(e) => handleReplaceEditVariantNewImage(variantIndex, imgIndex, e)} style={{ display: 'none' }} />
                                                            </label>
                                                        )
                                                    ))}
                                                    <label htmlFor={`edit-variant-images-${variantIndex}`} className="variant-image-upload-placeholder">
                                                        <i className="fas fa-plus"></i><span>Add New</span>
                                                    </label>
                                                    <input type="file" id={`edit-variant-images-${variantIndex}`} accept="image/*"
                                                        onChange={(e) => handleEditVariantImagesChange(variantIndex, e)} multiple style={{ display: 'none' }} />
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