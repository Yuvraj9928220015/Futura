import React, { useState, useEffect, useRef, useCallback } from "react";
import { PiPlus, PiMinus } from "react-icons/pi";
import { useParams } from "react-router-dom";
import { MdOutlineFileDownload, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

import "./ProductDetail.css"

const API_URL = import.meta.env.VITE_API_URL || 'https://api.futuratextiles.in/api/products';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.futuratextiles.in';

const getImageUrl = (imagePath) => {
    if (!imagePath) return "/no-image.png";
    const cleanedPath = imagePath.replace(/\\/g, '/');
    if (cleanedPath.startsWith('http')) {
        return cleanedPath;
    }
    return `${BASE_URL}/${cleanedPath}`;
};

const ITEMS_PER_VIEW = 5;

const ProductDetail = () => {
    const { id } = useParams();
    const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);

    const [flammableOpen, setFlammableOpen] = useState(false);
    const [turtleLifeOpen, setTurtleLifeOpen] = useState(false);
    const [safeTouchOpen, setSafeTouchOpen] = useState(false);

    const [selectedGrainFilter, setSelectedGrainFilter] = useState('all');

    // Global "See All" state — expands all grain rows at once
    const [showAllGrains, setShowAllGrains] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const productData = {
        name: product?.title || "Ophelia",
        code: "",
        brand: product?.title || "Ophelia",
        features: ["Marine", "Contract", "Healthcare"],
        selectUse: " 100% Polyester",
    };

    const getCurrentImages = () => {
        if (selectedVariantIndex !== null && product?.variants && product.variants[selectedVariantIndex]) {
            return product.variants[selectedVariantIndex].images;
        }
        return product?.image || [];
    };

    const currentImages = getCurrentImages();

    const galleryImages = currentImages && currentImages.length > 6
        ? currentImages.slice(2, -4).map((img, index) => ({
            id: index + 3,
            type: "product",
            title: `${product.title} - View ${index + 3}`,
            image: getImageUrl(img)
        }))
        : [
            { id: 3, type: "pattern", title: "Pattern Close-up", image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop" },
            { id: 4, type: "application", title: "Hospitality Setting", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },
            { id: 5, type: "samples", title: "Color Variations", image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=300&fit=crop" },
            { id: 6, type: "room", title: "Modern Interior", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop" },
            { id: 7, type: "detail", title: "Material Quality", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
            { id: 8, type: "collection", title: "Full Collection", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" }
        ];

    const productSwatches = product?.swatches || [];
    const selectedSwatch = selectedSwatchIndex !== null ? productSwatches[selectedSwatchIndex] : null;

    const itemsPerSlide = 4;
    const totalSlides = galleryImages.length;

    const handleSwatchSelect = (index) => { setSelectedSwatchIndex(index); };

    const handleVariantSelect = useCallback((index) => {
        setSelectedVariantIndex(index);
        setSelectedImageIndex(0);
        setSelectedSwatchIndex(null);
    }, []);

    const handleDefaultSelect = useCallback(() => {
        setSelectedVariantIndex(null);
        setSelectedImageIndex(0);
        setSelectedSwatchIndex(null);
    }, []);

    const nextSlide = () => { if (currentSlide < totalSlides - itemsPerSlide) setCurrentSlide((prev) => prev + 1); };
    const prevSlide = () => { if (currentSlide > 0) setCurrentSlide((prev) => prev - 1); };

    const getMainImage = () => {
        if (currentImages && currentImages.length > 0) {
            return getImageUrl(currentImages[selectedImageIndex]);
        }
        return null;
    };

    const getBottomSampleImages = () => {
        if (currentImages && currentImages.length > 0) {
            return currentImages.slice(-4).map(img => getImageUrl(img));
        }
        return [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop"
        ];
    };

    const handleThumbnailClick = (index) => { setSelectedImageIndex(index + 2); };

    // ── Build grain-grouped data ──
    const buildGrainGroups = () => {
        if (!product) return {};

        const defaultItem = {
            type: 'default',
            index: null,
            name: product?.title || product?.code || 'Default',
            images: product.image,
            grain: '__default__',
        };

        const groups = {};

        if (product.variants) {
            product.variants.forEach((variant, index) => {
                const grain = (variant.grain && variant.grain.trim()) ? variant.grain.trim() : '__ungrouped__';
                if (!groups[grain]) groups[grain] = [];
                groups[grain].push({
                    type: 'variant',
                    index,
                    name: variant.name,
                    images: variant.images,
                    grain,
                    color: variant.color || '',
                });
            });
        }

        return { defaultItem, groups };
    };

    const { defaultItem, groups: grainGroups } = buildGrainGroups();

    const allGrainKeys = grainGroups ? Object.keys(grainGroups) : [];

    const getGrainLabel = (grainKey, grainIndex) => {
        if (grainKey === '__ungrouped__') return 'Other Variants';
        return `${grainKey}`;
    };

    const getAllVariantsForGrain = (grainKey) => {
        return grainGroups[grainKey] || [];
    };

    const filteredGrainKeys = selectedGrainFilter === 'all'
        ? allGrainKeys
        : allGrainKeys.filter(k => k === selectedGrainFilter);

    const hasVariants = product?.variants && product.variants.length > 0;

    if (loading) {
        return (
            <div className="product-detail">
                <div className="container-fluid">
                    <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
                        Loading product details...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-detail">
                <div className="container-fluid">
                    <div style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '8px', margin: '1rem 0', textAlign: 'center' }}>
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail">
                <div className="container-fluid">
                    <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
                        Product not found
                    </div>
                </div>
            </div>
        );
    }

    const bottomSampleImages = getBottomSampleImages();

    const toggleHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        padding: '10px 0',
        userSelect: 'none',
    };

    const sectionIconStyle = {
        objectFit: 'contain',
        flexShrink: 0,
    };

    const toggleIconStyle = (isOpen) => ({
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        flexShrink: 0,
        transition: 'background-color 0.3s ease',
    });

    // ── VariantCard ──
    const VariantCard = ({ item, isSelected, onClick }) => (
        <div
            onClick={onClick}
            style={{ cursor: 'pointer', flexShrink: 0, textAlign: 'center', width: '100px' }}
        >
            <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: isSelected ? '2.5px solid #333' : '2.5px solid transparent',
                boxShadow: isSelected ? '0 0 0 3px #e0e0e0' : 'none',
                transition: 'border 0.2s, box-shadow 0.2s',
                backgroundColor: '#f0f0f0',
            }}>
                {item.images && item.images.length > 1 ? (
                    <img
                        src={getImageUrl(item.images[1])}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            if (item.images && item.images.length > 0) {
                                e.target.src = getImageUrl(item.images[0]);
                            } else {
                                e.target.style.display = 'none';
                            }
                        }}
                    />
                ) : item.images && item.images.length > 0 ? (
                    <img
                        src={getImageUrl(item.images[0])}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%', backgroundColor: '#e0e0e0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', color: '#999'
                    }}>
                        📦
                    </div>
                )}
            </div>

            <div style={{
                fontSize: '0.7rem',
                color: '#333',
                textAlign: 'center',
                marginTop: '5px',
                wordBreak: 'break-word',
                fontWeight: isSelected ? '600' : '400',
                lineHeight: '1.2',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
                {item.name}
            </div>

            {isSelected && (
                <div style={{
                    height: '2px',
                    backgroundColor: '#2196f3',
                    borderRadius: '2px',
                    marginTop: '4px',
                    width: '60%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }} />
            )}
        </div>
    );

    // ── GrainRow ──
    const GrainRow = ({ grainKey, grainIndex, variants, includeDefault, showAllGrains, grainLabel }) => {
        const [sliderOffset, setSliderOffset] = useState(0);
        const [showExtra, setShowExtra] = useState(false);
        const [collapsed, setCollapsed] = useState(false);

        // Sync with global "See All"
        useEffect(() => {
            setShowExtra(showAllGrains);
        }, [showAllGrains]);

        const allRowItems = includeDefault && defaultItem
            ? [defaultItem, ...variants]
            : variants;

        const totalItems = allRowItems.length;
        const hasMore = totalItems > ITEMS_PER_VIEW;
        const extraItems = allRowItems.slice(ITEMS_PER_VIEW);

        const visibleSlider = allRowItems.slice(sliderOffset, sliderOffset + ITEMS_PER_VIEW);
        const canGoLeft = sliderOffset > 0;
        const canGoRight = sliderOffset + ITEMS_PER_VIEW < totalItems;

        const shiftLeft = () => { if (canGoLeft) setSliderOffset(prev => prev - 1); };
        const shiftRight = () => { if (canGoRight) setSliderOffset(prev => prev + 1); };

        const renderCard = (item) => {
            const isSelected = item.type === 'default'
                ? selectedVariantIndex === null
                : selectedVariantIndex === item.index;
            return (
                <VariantCard
                    key={item.type === 'default' ? 'default' : `variant-${item.index}`}
                    item={item}
                    isSelected={isSelected}
                    onClick={() => {
                        if (item.type === 'default') handleDefaultSelect();
                        else handleVariantSelect(item.index);
                    }}
                />
            );
        };

        return (
            <div className="grain-row-wrapper">
                {/* ── Grain content (collapsible) ── */}
                {!collapsed && (
                    <>
                        <div className="grain-slider-row">

                            <button
                                type="button"
                                onClick={shiftLeft}
                                disabled={!canGoLeft}
                                className={`grain-arrow-btn ${!canGoLeft ? 'disabled' : ''}`}
                            >
                                <MdChevronLeft />
                            </button>

                            <div className="grain-cards-viewport">
                                <div className="grain-cards-container">
                                    {visibleSlider.map(renderCard)}
                                </div>
                            </div>

                            {/* Right arrow — always on right */}
                            <button
                                type="button"
                                onClick={shiftRight}
                                disabled={!canGoRight}
                                className={`grain-arrow-btn ${!canGoRight ? 'disabled' : ''}`}
                            >
                                <MdChevronRight />
                            </button>

                            {/* Per-grain expand pill — icon only, after right arrow */}
                            {hasMore && (
                                <button
                                    type="button"
                                    onClick={() => setShowExtra(prev => !prev)}
                                    className={`grain-see-all-pill ${showExtra ? 'active' : ''}`}
                                >
                                    {showExtra
                                        ? <MdOutlineKeyboardArrowUp size={16} />
                                        : <MdOutlineKeyboardArrowDown size={16} />
                                    }
                                </button>
                            )}
                        </div>

                        {/* Extra items revealed by "See All" */}
                        {showExtra && extraItems.length > 0 && (
                            <div className="grain-extra-items">
                                {extraItems.map(renderCard)}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="product-detail">
                {/* ── Two-panel independent-scroll layout ── */}
                <div className="product-detail-panels">

                    {/* ════ LEFT PANEL ════ */}
                    <div className="pd-left-panel">
                        <div className="product-detail-image-box">
                            <div className="product-detail-main-image">
                                {(selectedSwatchIndex !== null && selectedSwatch) ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <img
                                            src={getImageUrl(selectedSwatch)}
                                            alt={`Swatch ${selectedSwatchIndex + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                            onError={(e) => { e.target.src = getMainImage(); }}
                                        />
                                        <div style={{
                                            position: 'absolute', top: '15px', right: '15px',
                                            backgroundColor: '#ff6b35', color: 'white',
                                            padding: '8px 15px', borderRadius: '20px',
                                            fontSize: '14px', fontWeight: 'bold',
                                            boxShadow: '0 2px 8px #00000033'
                                        }}>
                                            Swatch {selectedSwatchIndex + 1}
                                        </div>
                                    </div>
                                ) : getMainImage() ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <img src={getMainImage()} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    </div>
                                ) : (
                                    <div style={{ backgroundColor: '#f0f0f0', width: '100%', height: '100%', borderRadius: '8px' }}></div>
                                )}
                            </div>

                            <div className="product-detail-gallery-slider">
                                <div className="gallery-slider-header">
                                    <div className="slider-controls">
                                        <button className="slider-arrow prev-arrow" onClick={prevSlide} disabled={currentSlide === 0}><MdChevronLeft /></button>
                                        <div className="gallery-slider-container">
                                            <div className="gallery-slides" style={{ transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)` }}>
                                                {galleryImages.map((image, index) => (
                                                    <div key={image.id} className="gallery-slide">
                                                        <div className="gallery-item" onClick={() => handleThumbnailClick(index)} style={{ cursor: 'pointer' }}>
                                                            <img src={image.image} alt={image.title} className="gallery-img" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="slider-arrow next-arrow" onClick={nextSlide} disabled={currentSlide >= totalSlides - itemsPerSlide}><MdChevronRight /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="product-detail-thumbnail-row">
                                <div className="product-detail-thumbnail" style={{ backgroundColor: getMainImage() ? 'transparent' : '#f0f0f0', position: 'relative' }}>
                                    {getMainImage() && currentImages && currentImages.length > 1 ? (
                                        <>
                                            <img src={getImageUrl(currentImages[1])} alt="Second Image" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} />
                                            {selectedSwatch && productSwatches.length > 0 && (
                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '6px', pointerEvents: 'none', overflow: 'hidden' }}>
                                                    <img src={getImageUrl(selectedSwatch)} alt="Swatch Overlay Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, mixBlendMode: 'multiply' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: '#ffffffe6', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', zIndex: 1 }}>
                                                {selectedImageIndex + 1}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div id="colClass-thumbnail-box" className="row">
                            {bottomSampleImages.map((img, index) => {
                                const colClass = (index === 0 || index === 3) ? "col-7" : "col-5";
                                return (
                                    <div key={index} className={colClass}>
                                        <div className="product-detail-thumbnail-box" style={{ position: 'relative' }}>
                                            <img src={img} alt={`Sample ${index + 2}`} className="sample-img" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ════ RIGHT PANEL ════ */}
                    <div className="pd-right-panel">
                        <div className="product-detail-info-box">

                            {/* Brand / Title */}
                            <div className="product-detail-brand">
                                <span className="brand-name">{productData.brand}</span>
                            </div>

                            <div className="Applications">Applications</div>

                            {/* Feature tags */}
                            <div className="product-detail-features">
                                {productData.features.map((feature, index) => (
                                    <span key={index} className="feature-tag">• {feature}</span>
                                ))}
                            </div>

                            {/* Material/Fabric + Global "See All" button */}
                            <div className="product-detail-select-use">
                                <div className="material-fabric-row">
                                    <span>
                                        <strong>Material/Fabric : </strong>
                                        {productData.selectUse}
                                    </span>
                                    {hasVariants && (
                                        <button
                                            type="button"
                                            className={`global-see-all-btn ${showAllGrains ? 'active' : ''}`}
                                            onClick={() => setShowAllGrains(prev => !prev)}
                                        >
                                            {showAllGrains ? 'Show Less' : 'See All'}
                                            {showAllGrains
                                                ? <MdOutlineKeyboardArrowUp size={15} style={{ marginLeft: '4px' }} />
                                                : <MdOutlineKeyboardArrowDown size={15} style={{ marginLeft: '4px' }} />
                                            }
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* GRAIN-GROUPED VARIANT SECTION */}
                            <div className="product-detail-color-section">
                                {hasVariants && (
                                    <div className="variant-slider-section">
                                        {filteredGrainKeys.map((grainKey, idx) => {
                                            const isFirstGrain = allGrainKeys.indexOf(grainKey) === 0;
                                            const label = grainKey === '__ungrouped__'
                                                ? 'Other Variants'
                                                : grainKey;
                                            return (
                                                <GrainRow
                                                    key={grainKey}
                                                    grainKey={grainKey}
                                                    grainIndex={allGrainKeys.indexOf(grainKey)}
                                                    variants={getAllVariantsForGrain(grainKey)}
                                                    includeDefault={isFirstGrain && !!defaultItem}
                                                    showAllGrains={showAllGrains}
                                                    grainLabel={label}
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="product-detail-downloads">
                                    <div className="download-links">
                                        <span className="download-link">
                                            <MdOutlineFileDownload />Download Catalogue
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div className="specifications-box">
                                <div className="specifications">
                                    <div className="About-Product-title">About {product.title || productData.name}</div>
                                    <div className="Specifications">View Specifications</div>
                                </div>
                                <div className="ophelia-des">
                                    {product.description || "Ophelia offers a cost-effective option within our Carnegie Siltech Plus line. Crafted from 100% silicone, its unique resin system allows for a reduced price without compromising on quality. With a luxurious leather look and a soft, supple hand, Ophelia is also graffiti-resistant and meets the stringent standards of IMO Part 8. As part of our value-performance Carnegie Elements brand, it seamlessly combines performance and style."}
                                </div>
                                <div className="readmore-container">
                                    <span
                                        className="readmore"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(!expanded); }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="readmore-content">
                                            <p>Key Characteristics</p>
                                            <div className="readmore-icon">
                                                {expanded ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
                                            </div>
                                        </div>
                                    </span>

                                    {expanded && (
                                        <div className="Prodduct-extra-text">

                                            {/* FLAMMABLE SECTION */}
                                            {product.Flammable && (
                                                <div style={{ borderBottom: '1px solid #eee', marginBottom: '8px' }}>
                                                    <div style={toggleHeaderStyle} onClick={() => setFlammableOpen(!flammableOpen)}>
                                                        <div className="turtle-life-content" style={{ margin: 0, padding: 0 }}>
                                                            <img src="/Futura-New-42.png" alt="" style={sectionIconStyle} />
                                                            <div className="ophelia-title" style={{ margin: 0, padding: 0 }}>FLAMMABLE</div>
                                                        </div>
                                                        <div style={toggleIconStyle(flammableOpen)}>
                                                            {flammableOpen ? <PiMinus /> : <PiPlus />}
                                                        </div>
                                                    </div>
                                                    {flammableOpen && (
                                                        <div className="Anti-Flamesafe-container" style={{ paddingBottom: '12px' }}>
                                                            <div className="Anti-Flamesafe">
                                                                <img src="/Untitled-2.png" alt="" /> <b>Anti flammable : </b> CAL 117-2013, FMVSS302, IMO FTP, BIFMA CLASS A, NFPA 260
                                                            </div>
                                                            <div className="ophelia-description">{product.Flammable}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* TURTLE LIFE SECTION */}
                                            <div className="Anti-Flamesafe" style={{ borderBottom: '1px solid #eee', marginBottom: '8px' }}>
                                                <div style={toggleHeaderStyle} onClick={() => setTurtleLifeOpen(!turtleLifeOpen)}>
                                                    <div className="turtle-life-content" style={{ margin: 0, padding: 0 }}>
                                                        <img src="/Futura-New-43.png" alt="" style={sectionIconStyle} />
                                                        <div className="ophelia-title" style={{ margin: 0, padding: 0 }}>TURTLE LIFE</div>
                                                    </div>
                                                    <div style={toggleIconStyle(turtleLifeOpen)}>
                                                        {turtleLifeOpen ? <PiMinus /> : <PiPlus />}
                                                    </div>
                                                </div>
                                                {turtleLifeOpen && (
                                                    <div className="Turtle-Life-container" style={{ paddingBottom: '12px' }}>
                                                        <div className="ophelia-description">
                                                            Americana passes the requirements of the cold-crack laboratory and is an excellent outdoor upholstery option.
                                                        </div>
                                                        <div>
                                                            {product.resistant && (
                                                                <div className="Characteristics-content">
                                                                    <div className="Pink-Stain"><img src="/5.png" alt="" /> <b>Cold crack resistant : </b> -60 degrees F</div>
                                                                    <div className="ophelia-description">{product.resistant}</div>
                                                                </div>
                                                            )}
                                                            {product.QUV && (
                                                                <div className="Characteristics-content">
                                                                    <div id="Pink-Stain-container" className="Pink-Stain"><img src="/4.png" alt="" /> <div className="Pink-Stain-container-content"><b>QUV resistant : </b> {product.QUV}</div></div>
                                                                    <div className="ophelia-description">{product.QUV}</div>
                                                                </div>
                                                            )}
                                                            {product.Weatherometer && (
                                                                <div className="Characteristics-content">
                                                                    <div className="Pink-Stain"><img src="/6.png" alt="" /> <b>Weatherometer : </b> 1000 Hrs</div>
                                                                    <div className="ophelia-description">{product.Weatherometer}</div>
                                                                </div>
                                                            )}
                                                            {product.Abrasion && (
                                                                <div className="Characteristics-content">
                                                                    <div className="Pink-Stain"><img src="/3.png" alt="" /> <b>Abrasion : </b> Wyzenback 8 Cotton Duck 50,000 cycles</div>
                                                                    <div className="ophelia-description">{product.Abrasion}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* SAFE TOUCH SECTION */}
                                            <div style={{ borderBottom: '1px solid #eee', marginBottom: '8px' }}>
                                                <div style={toggleHeaderStyle} onClick={() => setSafeTouchOpen(!safeTouchOpen)}>
                                                    <div className="turtle-life-content" style={{ margin: 0, padding: 0 }}>
                                                        <img src="/Futura-New-44.png" alt="" style={sectionIconStyle} />
                                                        <div className="ophelia-title" style={{ margin: 0, padding: 0 }}>SAFE TOUCH</div>
                                                    </div>
                                                    <div style={toggleIconStyle(safeTouchOpen)}>
                                                        {safeTouchOpen ? <PiMinus /> : <PiPlus />}
                                                    </div>
                                                </div>
                                                {safeTouchOpen && (
                                                    <div className="Turtle-Life-container" style={{ paddingBottom: '12px' }}>
                                                        <div className="ophelia-description">A microbial safe product</div>
                                                        {product.AntiMicrobial && (
                                                            <div className="Characteristics-content">
                                                                <div className="Pink-Stain"><img src="/2.png" alt="" /> <b>Anti microbial : </b> AATCC-147</div>
                                                                <div className="ophelia-description">{product.AntiMicrobial}</div>
                                                            </div>
                                                        )}
                                                        {product.PinkStain && (
                                                            <div className="Characteristics-content">
                                                                <div className="Pink-Stain"><img src="/7.png" alt="" /> <b>Pink Stain : </b> ASTM 1428</div>
                                                                <div className="ophelia-description">{product.PinkStain}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;