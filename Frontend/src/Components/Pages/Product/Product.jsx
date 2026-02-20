import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, X } from 'lucide-react';
import { GoPlus } from 'react-icons/go';
import { FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import "./Product.css";

const API_URL = "http://localhost:8000/api/products";

// Category hierarchy mapping
const CATEGORY_HIERARCHY = {
    'After Market Automotive': [
        'MARINE REVOLUTION',
        'AUTO REVOLUTION',
        'POLARIS',
        'RUNABOUT',
        'XTREME',
        'Promo Revolution'
    ],
    'Marine': [
        'APOLLO',
        'AMERICANA',
        'MATRIX',
        'RUNABOUT',
        'XTREME'
    ],
    'Contract Furnishing': [
        'APOLLO',
        'AMERICANA',
        'MATRIX',
        'POLARIS'
    ],
    'Trucking': [
        'AUTO REVOLUTION',
        'MARINE REVOLUTION'
    ],
    'HealthCare': [
        'APOLLO',
        'AMERICANA',
        'MATRIX'
    ],
    'Offroading': []
};

// Default filter options
const DEFAULT_FILTERS = {
    color: [
        { value: 'beige', label: 'Beige', count: 0 },
        { value: 'black', label: 'Black', count: 0 },
        { value: 'blue', label: 'Blue', count: 0 },
        { value: 'brown', label: 'Brown', count: 0 },
        { value: 'grey', label: 'Grey', count: 0 },
        { value: 'green', label: 'Green', count: 0 },
        { value: 'orange', label: 'Orange', count: 0 },
        { value: 'pink', label: 'Pink', count: 0 },
        { value: 'purple', label: 'Purple', count: 0 },
        { value: 'red', label: 'Red', count: 0 },
        { value: 'silver', label: 'Silver', count: 0 },
        { value: 'white', label: 'White', count: 0 }
    ],
    performance: [
        { value: 'high-performance', label: 'High Performance', count: 0 },
        { value: 'medium-performance', label: 'Medium Performance', count: 0 },
        { value: 'standard', label: 'Standard', count: 0 },
        { value: 'premium', label: 'Premium', count: 0 },
        { value: 'eco-friendly', label: 'Eco-Friendly', count: 0 }
    ],
    features: [
        { value: 'waterproof', label: 'Waterproof', count: 0 },
        { value: 'durable', label: 'Durable', count: 0 },
        { value: 'lightweight', label: 'Lightweight', count: 0 },
        { value: 'scratch-resistant', label: 'Scratch Resistant', count: 0 },
        { value: 'easy-to-clean', label: 'Easy to Clean', count: 0 },
        { value: 'uv-resistant', label: 'UV Resistant', count: 0 }
    ]
};

const TruncatedText = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    if (text.length <= maxLength) {
        return <p>{text}</p>;
    }

    const displayedText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

    return (
        <p>
            {displayedText}
            <span
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    color: '#007bff',
                    cursor: 'pointer',
                    marginLeft: '5px',
                    fontWeight: 'bold'
                }}
            >
                {isExpanded ? ' Read less' : ' Read more'}
            </span>
        </p>
    );
};

const Product = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        parentCategory: null,
        category: [],
        color: [],
        performance: [],
        features: []
    });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        color: false,
        performance: false,
        features: false
    });

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dynamicFilterOptions, setDynamicFilterOptions] = useState({
        category: [],
        color: DEFAULT_FILTERS.color,
        performance: DEFAULT_FILTERS.performance,
        features: DEFAULT_FILTERS.features
    });

    const slides = [
        {
            id: 1,
            image: "/Product-Banner-1.png",
            title: "Americana",
            subtitle: "Explore the ocean in style",
            description: "Discover the ultimate luxury with our premium yacht collection",
            category: "americana"
        },
        {
            id: 2,
            image: "/Product-Banner-2.png",
            title: "Apollo",
            subtitle: "4 WAY STRETCH 360",
            description: "Experience sustainable architecture in harmony with nature",
            category: "apollo"
        },
        {
            id: 3,
            image: "/Product-Banner-3.png",
            title: " Automotive",
            subtitle: "Contemporary living spaces",
            description: "Innovative design meets functional living",
            category: "automotive"
        },
        {
            id: 4,
            image: "/Runabout.png",
            title: "Runabout",
            subtitle: "Nature's paradise",
            description: "Experience breathtaking mountain landscapes",
            category: "nature"
        },
        {
            id: 5,
            image: "/XTREME.png",
            title: "Xtreme",
            subtitle: "City living redefined",
            description: "Modern urban spaces for contemporary lifestyle",
            category: "architecture"
        }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setAllProducts(data);
            generateDynamicData(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateDynamicData = (products) => {
        const newDynamicOptions = {
            category: new Map(),
            color: new Map(DEFAULT_FILTERS.color.map(c => [c.value, { ...c, count: 0 }])),
            performance: new Map(DEFAULT_FILTERS.performance.map(p => [p.value, { ...p, count: 0 }])),
            features: new Map(DEFAULT_FILTERS.features.map(f => [f.value, { ...f, count: 0 }])),
        };

        products.forEach(product => {
            // Category
            const category = product.category || 'Uncategorized';
            const categoryValue = category.toLowerCase().replace(/\s+/g, '-');
            newDynamicOptions.category.set(categoryValue, {
                value: categoryValue,
                label: category,
                count: (newDynamicOptions.category.get(categoryValue)?.count || 0) + 1
            });

            // Color
            if (product.color) {
                let colorsToProcess = [];
                if (Array.isArray(product.color)) {
                    colorsToProcess = product.color;
                } else if (typeof product.color === 'string') {
                    colorsToProcess = product.color.split(',').map(c => c.trim());
                }

                colorsToProcess.forEach(color => {
                    if (color) {
                        const colorValue = color.toLowerCase().replace(/\s+/g, '-');
                        const existing = newDynamicOptions.color.get(colorValue);
                        if (existing) {
                            existing.count++;
                        } else {
                            newDynamicOptions.color.set(colorValue, {
                                value: colorValue,
                                label: color,
                                count: 1
                            });
                        }
                    }
                });
            }

            // Performance
            if (product.performance) {
                const performance = product.performance;
                const performanceValue = performance.toLowerCase().replace(/\s+/g, '-');
                const existing = newDynamicOptions.performance.get(performanceValue);
                if (existing) {
                    existing.count++;
                } else {
                    newDynamicOptions.performance.set(performanceValue, {
                        value: performanceValue,
                        label: performance,
                        count: 1
                    });
                }
            }

            // Features
            if (product.features) {
                const featuresArray = Array.isArray(product.features) ? product.features : [product.features];
                featuresArray.forEach(feature => {
                    const featureValue = feature.toLowerCase().replace(/\s+/g, '-');
                    const existing = newDynamicOptions.features.get(featureValue);
                    if (existing) {
                        existing.count++;
                    } else {
                        newDynamicOptions.features.set(featureValue, {
                            value: featureValue,
                            label: feature,
                            count: 1
                        });
                    }
                });
            }
        });

        setDynamicFilterOptions({
            category: Array.from(newDynamicOptions.category.values()).sort((a, b) => a.label.localeCompare(b.label)),
            color: Array.from(newDynamicOptions.color.values()).sort((a, b) => a.label.localeCompare(b.label)),
            performance: Array.from(newDynamicOptions.performance.values()).sort((a, b) => a.label.localeCompare(b.label)),
            features: Array.from(newDynamicOptions.features.values()).sort((a, b) => a.label.localeCompare(b.label))
        });
    };


    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setIsTransitioning(false);
        }, 150);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            setIsTransitioning(false);
        }, 150);
    };

    const getPrevIndex = () => (currentSlide - 1 + slides.length) % slides.length;
    const getNextIndex = () => (currentSlide + 1) % slides.length;

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleParentCategoryClick = (parentCategory) => {
        if (selectedFilters.parentCategory === parentCategory) {
            setSelectedFilters(prev => ({
                ...prev,
                parentCategory: null,
                category: []
            }));
        } else {
            setSelectedFilters(prev => ({
                ...prev,
                parentCategory: parentCategory,
                category: []
            }));
        }
    };

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => {
            if (filterType === 'category') {
                const currentValues = prev.category;
                const newValues = currentValues.includes(value)
                    ? currentValues.filter(v => v !== value)
                    : [...currentValues, value];
                return {
                    ...prev,
                    category: newValues
                };
            }

            const currentValues = prev[filterType];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return {
                ...prev,
                [filterType]: newValues
            };
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            parentCategory: null,
            category: [],
            color: [],
            performance: [],
            features: []
        });
        setSearchTerm('');
    };

    const filteredProjects = allProducts.filter(product => {
        const matchesSearch = !searchTerm ||
            (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const productCategory = (product.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-');
        const productCategoryOriginal = product.category || 'Uncategorized';

        let matchesCategory = true;

        if (selectedFilters.parentCategory) {
            const allowedCategories = CATEGORY_HIERARCHY[selectedFilters.parentCategory] || [];
            const allowedCategoriesNormalized = allowedCategories.map(cat =>
                cat.toLowerCase().replace(/\s+/g, '-')
            );

            if (selectedFilters.category.length > 0) {
                matchesCategory = selectedFilters.category.includes(productCategory);
            } else {
                matchesCategory = allowedCategoriesNormalized.includes(productCategory) ||
                    allowedCategories.includes(productCategoryOriginal);
            }
        } else if (selectedFilters.category.length > 0) {
            matchesCategory = selectedFilters.category.includes(productCategory);
        }

        const productColors = Array.isArray(product.color)
            ? product.color.map(c => c.toLowerCase().replace(/\s+/g, '-'))
            : (product.color ? product.color.split(',').map(c => c.trim().toLowerCase().replace(/\s+/g, '-')) : []);
        const matchesColor = selectedFilters.color.length === 0 ||
            selectedFilters.color.some(selectedColor => productColors.includes(selectedColor));

        const productPerformance = (product.performance || '').toLowerCase().replace(/\s+/g, '-');
        const matchesPerformance = selectedFilters.performance.length === 0 ||
            selectedFilters.performance.includes(productPerformance);

        const productFeatures = Array.isArray(product.features)
            ? product.features.map(f => f.toLowerCase().replace(/\s+/g, '-'))
            : (product.features ? [product.features.toLowerCase().replace(/\s+/g, '-')] : []);

        const matchesFeatures = selectedFilters.features.length === 0 ||
            selectedFilters.features.some(selectedFeature => productFeatures.includes(selectedFeature));

        return matchesSearch && matchesCategory && matchesColor && matchesPerformance && matchesFeatures;
    });

    const toggleMobileFilter = () => {
        setIsMobileFilterOpen(!isMobileFilterOpen);
    };

    useEffect(() => {
        const autoPlay = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);

        return () => clearInterval(autoPlay);
    }, [isTransitioning]);

    const getActiveFiltersCount = () => {
        let count = selectedFilters.category.length +
            selectedFilters.color.length +
            selectedFilters.performance.length +
            selectedFilters.features.length;

        if (selectedFilters.parentCategory) {
            count += 1;
        }

        return count;
    };

    const getSwatchColor = (colorName) => {
        const colorLower = colorName.toLowerCase().trim();

        const colorMap = {
            'beige': '#F5F5DC',
            'black': '#000000',
            'blue': '#0066CC',
            'brown': '#8B4513',
            'cool neutrals': 'linear-gradient(135deg, #B8B8B8 0%, #D3D3D3 100%)',
            'green': '#2E8B57',
            'grey': '#808080',
            'metallic': 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)',
            'multi color': 'linear-gradient(135deg, #FF0000 0%, #FF7F00 14%, #FFFF00 28%, #00FF00 42%, #0000FF 57%, #4B0082 71%, #9400D3 85%, #FF0000 100%)',
            'orange': '#FF8C00',
            'pink': '#FF69B4',
            'purple': '#9370DB',
            'red': '#DC143C',
            'silver': '#C0C0C0',
            'teal': '#008B8B',
            'warm neutrals': 'linear-gradient(135deg, #D2B48C 0%, #F5DEB3 100%)',
            'white': '#FFFFFF',
            'yellow': '#FFD700'
        };

        return colorMap[colorLower] || '#CCCCCC';
    };

    const getSubcategoryCount = (parentCategory, subcategory) => {
        const subcategoryNormalized = subcategory.toLowerCase().replace(/\s+/g, '-');
        return allProducts.filter(product => {
            const productCategory = (product.category || '').toLowerCase().replace(/\s+/g, '-');
            const productCategoryOriginal = product.category || '';
            return productCategory === subcategoryNormalized || productCategoryOriginal === subcategory;
        }).length;
    };

    return (
        <>
            <div className="product-wrapper">
                {/* Three Panel Slider */}
                <div className="threePanelSlider">
                    <div className="sliderContainer">
                        <div
                            className={`panel leftPanel ${isTransitioning ? 'transitioning' : ''}`}
                            onClick={prevSlide}
                        >
                            <div className="panelImage">
                                <img
                                    src={slides[getPrevIndex()].image}
                                    alt={slides[getPrevIndex()].title}
                                    className="image"
                                />
                            </div>
                        </div>

                        <div className={`panel centerPanel ${isTransitioning ? 'transitioning' : ''}`}>
                            <div className="panelImage">
                                <Link to={slides[currentSlide].link}>
                                    <img
                                        src={slides[currentSlide].image}
                                        alt={slides[currentSlide].title}
                                        className="image"
                                    />
                                </Link>
                                <div className="contentOverlay">
                                    <div className="slideContent">
                                        <div className="slideTitle">
                                            <Link to={slides[currentSlide].link} className="slide-title-link">
                                                {slides[currentSlide].title}
                                            </Link>
                                        </div>
                                        <p className="slideSubtitle">{slides[currentSlide].subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`panel rightPanel ${isTransitioning ? 'transitioning' : ''}`}
                            onClick={nextSlide}
                        >
                            <div className="panelImage">
                                <img
                                    src={slides[getNextIndex()].image}
                                    alt={slides[getNextIndex()].title}
                                    className="image"
                                />
                                <div className="panelOverlay"></div>
                            </div>
                        </div>

                        <button
                            className="navBtn prevBtn"
                            onClick={prevSlide}
                            disabled={isTransitioning}
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <button
                            className="navBtn nextBtn"
                            onClick={nextSlide}
                            disabled={isTransitioning}
                            aria-label="Next slide"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Products Section */}
                <div className="Product-Container">
                    <div className="Product-Container-title">Our Collections</div>

                    {error && (
                        <div className="error-message" style={{
                            background: '#fee',
                            color: '#c33',
                            padding: '1rem',
                            borderRadius: '8px',
                            margin: '1rem 0',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        className="mobile-filter-toggle"
                        onClick={toggleMobileFilter}
                    >
                        <Filter size={20} />
                        Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                    </button>

                    <div className="products-layout">
                        <div className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
                            <div className="mobile-filter-header">
                                <h3>Filters</h3>
                                <button
                                    className="close-mobile-filter"
                                    onClick={toggleMobileFilter}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search Section */}
                            <div className="filter-section">
                                <h4>Search</h4>
                                <div className="search-input-wrapper">
                                    <Search className="search-icon" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>

                            {getActiveFiltersCount() > 0 && (
                                <div className="filter-section">
                                    <button className="clear-all-btn" onClick={clearAllFilters}>
                                        Clear All Filters ({getActiveFiltersCount()})
                                    </button>
                                </div>
                            )}

                            {/* Parent Category Filter Section */}
                            <div className="filter-section">
                                <div
                                    className="filter-header"
                                    onClick={() => toggleSection('category')}
                                >
                                    <h4>Industrial Segments</h4>
                                    {expandedSections.category ?
                                        <FiMinus size={20} /> :
                                        <GoPlus size={20} />
                                    }
                                </div>

                                <div className={`filter-dropdown ${expandedSections.category ? 'expanded' : ''}`}>
                                    <div className="filter-options">
                                        {Object.keys(CATEGORY_HIERARCHY).map((parentCategory) => {
                                            const subcategories = CATEGORY_HIERARCHY[parentCategory];
                                            const isActive = selectedFilters.parentCategory === parentCategory;

                                            return (
                                                <div key={parentCategory} className="parent-category-wrapper">
                                                    <div
                                                        className={`parent-category-item ${isActive ? 'active' : ''}`}
                                                        onClick={() => handleParentCategoryClick(parentCategory)}
                                                    >
                                                        <span className="parent-category-label">{parentCategory}</span>
                                                        <ChevronRight
                                                            size={18}
                                                            className={`parent-category-arrow ${isActive ? 'rotated' : ''}`}
                                                        />
                                                    </div>

                                                    {isActive && subcategories.length > 0 && (
                                                        <div className="sub-category-options">
                                                            {subcategories.map((subcategory) => {
                                                                const subcategoryValue = subcategory.toLowerCase().replace(/\s+/g, '-');
                                                                const count = getSubcategoryCount(parentCategory, subcategory);

                                                                return (
                                                                    <label key={subcategoryValue} className="filter-checkbox subcategory-checkbox">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={subcategoryValue}
                                                                            checked={selectedFilters.category.includes(subcategoryValue)}
                                                                            onChange={() => handleFilterChange('category', subcategoryValue)}
                                                                        />
                                                                        <span className="Product-checkmark"></span>
                                                                        <span className="filter-label">
                                                                            {subcategory} ({count})
                                                                        </span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Color Filter Section */}
                            <div className="filter-section">
                                <div
                                    className="filter-header"
                                    onClick={() => toggleSection('color')}
                                >
                                    <h4>Color</h4>
                                    {expandedSections.color ?
                                        <FiMinus size={20} /> :
                                        <GoPlus size={20} />
                                    }
                                </div>

                                <div className={`filter-dropdown ${expandedSections.color ? 'expanded' : ''}`}>
                                    <div className="filter-options">
                                        {dynamicFilterOptions.color.map((option) => {
                                            const count = option.count;
                                            const swatchBg = getSwatchColor(option.label);
                                            const hasGradient = swatchBg.includes('gradient');

                                            return (
                                                <label key={option.value} className="filter-checkbox color-filter-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        value={option.value}
                                                        checked={selectedFilters.color.includes(option.value)}
                                                        onChange={() => handleFilterChange('color', option.value)}
                                                    />
                                                    <span className="Product-checkmark"></span>
                                                    <span
                                                        className="Product-color-swatch"
                                                        style={{
                                                            background: swatchBg,
                                                            border: option.label.toLowerCase() === 'white' ? '1px solid #ccc' :
                                                                hasGradient ? 'none' : '1px solid #0000001a'
                                                        }}
                                                    ></span>
                                                    <span className="filter-label">{option.label} ({count})</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Filter Section */}
                            <div className="filter-section">
                                <div
                                    className="filter-header"
                                    onClick={() => toggleSection('performance')}
                                >
                                    <h4>Performance</h4>
                                    {expandedSections.performance ?
                                        <FiMinus size={20} /> :
                                        <GoPlus size={20} />
                                    }
                                </div>

                                <div className={`filter-dropdown ${expandedSections.performance ? 'expanded' : ''}`}>
                                    <div className="filter-options">
                                        {dynamicFilterOptions.performance.map((option) => {
                                            const count = option.count;
                                            return (
                                                <label key={option.value} className="filter-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        value={option.value}
                                                        checked={selectedFilters.performance.includes(option.value)}
                                                        onChange={() => handleFilterChange('performance', option.value)}
                                                    />
                                                    <span className="Product-checkmark"></span>
                                                    <span className="filter-label">{option.label} ({count})</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Features Filter Section */}
                            <div className="filter-section">
                                <div
                                    className="filter-header"
                                    onClick={() => toggleSection('features')}
                                >
                                    <h4>Features</h4>
                                    {expandedSections.features ?
                                        <FiMinus size={20} /> :
                                        <GoPlus size={20} />
                                    }
                                </div>

                                <div className={`filter-dropdown ${expandedSections.features ? 'expanded' : ''}`}>
                                    <div className="filter-options">
                                        {dynamicFilterOptions.features.map((option) => {
                                            const count = option.count;
                                            return (
                                                <label key={option.value} className="filter-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        value={option.value}
                                                        checked={selectedFilters.features.includes(option.value)}
                                                        onChange={() => handleFilterChange('features', option.value)}
                                                    />
                                                    <span className="Product-checkmark"></span>
                                                    <span className="filter-label">{option.label} ({count})</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Results Count */}
                            <div className="filter-section">
                                <div className="results-count">
                                    Showing {filteredProjects.length} of {allProducts.length} products
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filter Overlay */}
                        {isMobileFilterOpen && (
                            <div
                                className="mobile-filter-overlay"
                                onClick={toggleMobileFilter}
                            ></div>
                        )}

                        <div className="products-content">
                            {loading ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    fontSize: '1.2rem',
                                    color: '#666'
                                }}>
                                    Loading products...
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="no-projects">
                                    <p>No products found matching your criteria.</p>
                                    <button className="clear-filters-btn" onClick={clearAllFilters}>
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="projects-grid-new">
                                    {filteredProjects.map((product) => (
                                        <div key={product._id} className="Projects-Box-new">
                                            <div className="project-image-wrapper">
                                                <Link to={`/ProductDetail/${product._id}`} className="project-image-link">
                                                    <img
                                                        src={product.image && product.image.length > 0
                                                            ? `http://localhost:8000/${product.image[0]}`
                                                            : "https://via.placeholder.com/400x300?text=No+Image"}
                                                        alt={product.title || 'Product'}
                                                        className="project-image"
                                                    />
                                                    <div className="project-overlay"></div>
                                                </Link>
                                            </div>
                                            <div className="project-content">
                                                <div className="Projects-Box-main-heading">
                                                    <Link to={`/ProductDetail/${product._id}`} className="project-title-link">
                                                        {product.title || 'Untitled Product'}
                                                    </Link>

                                                    {/* UPDATED: Display product icons instead of SVG */}
                                                    <div className="Projects-Box-svg">
                                                        {product.icons && product.icons.length > 0 ? (
                                                            <div className="product-icons-display">
                                                                {product.icons.map((icon, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={`http://localhost:8000/${icon}`}
                                                                        alt={`Icon ${index + 1}`}
                                                                        className="products-icon-item"
                                                                        style={{
                                                                            width: '60px',
                                                                            height: '80px',
                                                                            objectFit: 'contain',
                                                                            marginLeft: '5px'
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <img src="/iconPvc-6.svg" alt="Default icon" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="Projects-Box-main-des">
                                                    <TruncatedText
                                                        text={product.description || 'No description available'}
                                                        maxLength={100}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product; 