import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineFileDownload, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

import "./ProductDetail.css"

const API_URL = "http://82.25.91.73:8000/api/products";

const ProductDetail = () => {
    const { id } = useParams();
    const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);

    const [currentVariantSlide, setCurrentVariantSlide] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_URL}/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch product');
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
        brand: "Suggested Applications:",
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
            image: `http://localhost:8000/${img}`
        }))
        : [
            {
                id: 3,
                type: "pattern",
                title: "Pattern Close-up",
                image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop"
            },
            {
                id: 4,
                type: "application",
                title: "Hospitality Setting",
                image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop"
            },
            {
                id: 5,
                type: "samples",
                title: "Color Variations",
                image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=300&fit=crop"
            },
            {
                id: 6,
                type: "room",
                title: "Modern Interior",
                image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop"
            },
            {
                id: 7,
                type: "detail",
                title: "Material Quality",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
            },
            {
                id: 8,
                type: "collection",
                title: "Full Collection",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
            }
        ];

    const productSwatches = product?.swatches || [];
    const selectedSwatch = selectedSwatchIndex !== null ? productSwatches[selectedSwatchIndex] : null;

    const itemsPerSlide = 4;
    const totalSlides = galleryImages.length;

    const variantsPerSlide = 5;
    const totalVariants = product?.variants ? product.variants.length + 1 : 1;
    const totalVariantSlides = Math.ceil(totalVariants / variantsPerSlide);

    const handleSwatchSelect = (index) => {
        setSelectedSwatchIndex(index);
    };

    const handleVariantSelect = (index) => {
        setSelectedVariantIndex(index);
        setSelectedImageIndex(0);
        setSelectedSwatchIndex(null);
    };

    // Reset to default (no variant)
    const handleDefaultSelect = () => {
        setSelectedVariantIndex(null);
        setSelectedImageIndex(0);
        setSelectedSwatchIndex(null);
    };

    const nextSlide = () => {
        if (currentSlide < totalSlides - itemsPerSlide) {
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide((prev) => prev - 1);
        }
    };

    // NEW: Variant slider controls
    const nextVariantSlide = () => {
        if (currentVariantSlide < totalVariantSlides - 1) {
            setCurrentVariantSlide((prev) => prev + 1);
        }
    };

    const prevVariantSlide = () => {
        if (currentVariantSlide > 0) {
            setCurrentVariantSlide((prev) => prev - 1);
        }
    };

    const getMainImage = () => {
        if (currentImages && currentImages.length > 0) {
            return `http://localhost:8000/${currentImages[selectedImageIndex]}`;
        }
        return null;
    };

    const getBottomSampleImages = () => {
        if (currentImages && currentImages.length > 0) {
            const lastFour = currentImages.slice(-4);
            return lastFour.map(img => `http://localhost:8000/${img}`);
        }

        return [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop"
        ];
    };

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index + 2);
    };

    if (loading) {
        return (
            <div className="product-detail">
                <div className="container-fluid">
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        fontSize: '1.2rem',
                        color: '#666'
                    }}>
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
                    <div style={{
                        background: '#fee',
                        color: '#c33',
                        padding: '1rem',
                        borderRadius: '8px',
                        margin: '1rem 0',
                        textAlign: 'center'
                    }}>
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
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        fontSize: '1.2rem',
                        color: '#666'
                    }}>
                        Product not found
                    </div>
                </div>
            </div>
        );
    }

    const bottomSampleImages = getBottomSampleImages();

    // NEW: Get all variant items (default + variants)
    const getAllVariantItems = () => {
        const items = [];

        items.push({
            type: 'default',
            index: null,
            name: 'Default',
            images: product.image,
            imageCount: product.image?.length || 0
        });

        if (product.variants) {
            product.variants.forEach((variant, index) => {
                items.push({
                    type: 'variant',
                    index: index,
                    name: variant.name,
                    images: variant.images,
                    imageCount: variant.images?.length || 0
                });
            });
        }

        return items;
    };

    const allVariantItems = getAllVariantItems();

    return (
        <>
            <div className="product-detail">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-7 col-md-6 col-12">
                            <div className="product-detail-image-box">
                                <div className="product-detail-main-image">
                                    {(selectedSwatchIndex !== null && selectedSwatch) ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img
                                                src={`http://localhost:8000/${selectedSwatch}`}
                                                alt={`Swatch ${selectedSwatchIndex + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                                onError={(e) => {
                                                    console.error('Failed to load swatch image');
                                                    e.target.src = getMainImage();
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '15px',
                                                right: '15px',
                                                backgroundColor: '#ff6b35',
                                                color: 'white',
                                                padding: '8px 15px',
                                                borderRadius: '20px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 8px #00000033'
                                            }}>
                                                Swatch {selectedSwatchIndex + 1}
                                            </div>
                                        </div>
                                    ) : getMainImage() ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img
                                                src={getMainImage()}
                                                alt={product.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            {selectedVariantIndex !== null && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '15px',
                                                    left: '15px',
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    padding: '8px 15px',
                                                    borderRadius: '20px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 2px 8px #00000033'
                                                }}>
                                                    {product.variants[selectedVariantIndex].name}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{
                                            backgroundColor: '#f0f0f0',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '8px'
                                        }}></div>
                                    )}
                                </div>

                                 {/* Image Gallery Slider Section */}
                            <div className="product-detail-gallery-slider">
                                <div className="gallery-slider-header">
                                    <div className="slider-controls">
                                        <button
                                            className="slider-arrow prev-arrow"
                                            onClick={prevSlide}
                                            disabled={currentSlide === 0}
                                        >
                                            <MdChevronLeft />
                                        </button>
                                        {/* <span className="slide-indicator">
                                            {currentSlide + 1} / {Math.max(1, totalSlides - itemsPerSlide + 1)}
                                        </span> */}
                                           <div className="gallery-slider-container">
                                    <div
                                        className="gallery-slides"
                                        style={{ transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)` }}
                                    >
                                        {galleryImages.map((image, index) => (
                                            <div key={image.id} className="gallery-slide">
                                                <div
                                                    className="gallery-item"
                                                    onClick={() => handleThumbnailClick(index)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <img
                                                        src={image.image}
                                                        alt={image.title}
                                                        className="gallery-img"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                        <button
                                            className="slider-arrow next-arrow"
                                            onClick={nextSlide}
                                            disabled={currentSlide >= totalSlides - itemsPerSlide}
                                        >
                                            <MdChevronRight />
                                        </button>
                                    </div>
                                </div>

                                {/* <div className="gallery-slider-container">
                                    <div
                                        className="gallery-slides"
                                        style={{ transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)` }}
                                    >
                                        {galleryImages.map((image, index) => (
                                            <div key={image.id} className="gallery-slide">
                                                <div
                                                    className="gallery-item"
                                                    onClick={() => handleThumbnailClick(index)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <img
                                                        src={image.image}
                                                        alt={image.title}
                                                        className="gallery-img"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                            </div>

                                {/* Thumbnail with Swatch Overlay */}
                                <div className="product-detail-thumbnail-row">
                                    <div
                                        className="product-detail-thumbnail"
                                        style={{
                                            backgroundColor: getMainImage() ? 'transparent' : '#f0f0f0',
                                            position: 'relative'
                                        }}
                                    >
                                        {getMainImage() && currentImages && currentImages.length > 1 ? (
                                            <>
                                                <img
                                                    src={`http://localhost:8000/${currentImages[1]}`}
                                                    alt="Second Image"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "6px"
                                                    }}
                                                />
                                                {selectedSwatch && productSwatches.length > 0 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        borderRadius: '6px',
                                                        pointerEvents: 'none',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <img
                                                            src={`http://localhost:8000/${selectedSwatch}`}
                                                            alt="Swatch Overlay Thumbnail"
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                opacity: 0.7,
                                                                mixBlendMode: 'multiply'
                                                            }}
                                                            onError={(e) => {
                                                                console.error('Thumbnail overlay failed');
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '8px',
                                                    right: '8px',
                                                    backgroundColor: '#ffffffe6',
                                                    color: '#333',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    zIndex: 1
                                                }}>
                                                    {selectedImageIndex + 1}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Image Gallery Slider Section */}
                            {/* <div className="product-detail-gallery-slider">
                                <div className="gallery-slider-header">
                                    <div className="slider-controls">
                                        <button
                                            className="slider-arrow prev-arrow"
                                            onClick={prevSlide}
                                            disabled={currentSlide === 0}
                                        >
                                            <MdChevronLeft />
                                        </button>
                                        <span className="slide-indicator">
                                            {currentSlide + 1} / {Math.max(1, totalSlides - itemsPerSlide + 1)}
                                        </span>
                                        <button
                                            className="slider-arrow next-arrow"
                                            onClick={nextSlide}
                                            disabled={currentSlide >= totalSlides - itemsPerSlide}
                                        >
                                            <MdChevronRight />
                                        </button>
                                    </div>
                                </div>

                                <div className="gallery-slider-container">
                                    <div
                                        className="gallery-slides"
                                        style={{ transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)` }}
                                    >
                                        {galleryImages.map((image, index) => (
                                            <div key={image.id} className="gallery-slide">
                                                <div
                                                    className="gallery-item"
                                                    onClick={() => handleThumbnailClick(index)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <img
                                                        src={image.image}
                                                        alt={image.title}
                                                        className="gallery-img"
                                                    />
                                                    <div>
                                                        {index + 3}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div> */}

                            {/* Bottom Sample Images */}
                            <div id="colClass-thumbnail-box" className="row">
                                {bottomSampleImages.map((img, index) => {
                                    const colClass = (index === 0 || index === 3) ? "col-7" : "col-5";
                                    return (
                                        <div key={index} className={colClass}>
                                            <div className="product-detail-thumbnail-box" style={{ position: 'relative' }}>
                                                <img
                                                    src={img}
                                                    alt={`Sample ${index + 2}`}
                                                    className="sample-img"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Side Info Section */}
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="product-detail-info-box">
                                <div className="product-detail-header">
                                    <h1 className="product-title">
                                        {product.title || productData.name}
                                        {selectedVariantIndex !== null && (
                                            <span style={{
                                                marginLeft: '10px',
                                                fontSize: '0.8rem',
                                                color: '#4CAF50',
                                                backgroundColor: '#e8f5e9',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontWeight: 'normal'
                                            }}>
                                                {product.variants[selectedVariantIndex].name}
                                            </span>
                                        )}
                                    </h1>
                                </div>

                                <div className="product-detail-select-use">
                                    <strong>Material/Fabric: </strong> {productData.selectUse}
                                </div>

                                <div className="product-detail-brand">
                                    <span className="brand-name">{productData.brand}</span>
                                </div>

                                <div className="product-detail-features">
                                    {productData.features.map((feature, index) => (
                                        <span key={index} className="feature-tag">
                                            • {feature}
                                        </span>
                                    ))}
                                </div>

                                <div className="product-detail-downloads">
                                    <div className="download-links">
                                        <span className="download-link"><MdOutlineFileDownload />Download Catalogue </span>
                                    </div>
                                </div>

                                {/* SWATCH SECTION */}
                                <div className="product-detail-color-section">
                                    {/* NEW: VARIANT SELECTION SECTION WITH SLIDER */}
                                    {product?.variants && product.variants.length > 0 && (
                                        <div className="variant-slider-section">
                                            <div className="variant-header">
                                                <h3 style={{
                                                    fontSize: '1.3rem',
                                                    fontWeight: 'bold',
                                                    marginBottom: '15px',
                                                    color: '#333',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}>
                                                    <span style={{
                                                        backgroundColor: '#ff6b35',
                                                        color: 'white',
                                                        padding: '5px 12px',
                                                        borderRadius: '8px',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {totalVariants}
                                                    </span>
                                                    Available Variants
                                                </h3>

                                                {totalVariantSlides > 1 && (
                                                    <div className="variant-slider-controls">
                                                        <button
                                                            className="variant-arrow prev-arrow"
                                                            onClick={prevVariantSlide}
                                                            disabled={currentVariantSlide === 0}
                                                        >
                                                            <MdChevronLeft />
                                                        </button>
                                                        <span className="variant-slide-indicator">
                                                            {currentVariantSlide + 1} / {totalVariantSlides}
                                                        </span>
                                                        <button
                                                            className="variant-arrow next-arrow"
                                                            onClick={nextVariantSlide}
                                                            disabled={currentVariantSlide >= totalVariantSlides - 1}
                                                        >
                                                            <MdChevronRight />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="variant-slider-container">
                                                <div
                                                    className="variant-slides"
                                                    style={{
                                                        transform: `translateX(-${currentVariantSlide * 100}%)`,
                                                        transition: 'transform 0.5s ease'
                                                    }}
                                                >
                                                    {allVariantItems.map((item, globalIndex) => (
                                                        <div key={globalIndex} className="variant-slide-item">
                                                            <div
                                                                onClick={() => item.type === 'default' ? handleDefaultSelect() : handleVariantSelect(item.index)}
                                                                className="variant-card"
                                                            >
                                                                {item.images && item.images.length > 1 ? (
                                                                    <img
                                                                        src={`http://localhost:8000/${item.images[1]}`}
                                                                        alt={item.name}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '8px',
                                                                            marginBottom: '8px'
                                                                        }}
                                                                        onError={(e) => {
                                                                            if (item.images && item.images.length > 0) {
                                                                                e.target.src = `http://localhost:8000/${item.images[0]}`;
                                                                            } else {
                                                                                e.target.style.display = 'none';
                                                                            }
                                                                        }}
                                                                    />
                                                                ) : item.images && item.images.length > 0 ? (
                                                                    <img
                                                                        src={`http://localhost:8000/${item.images[0]}`}
                                                                        alt={item.name}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '8px',
                                                                            marginBottom: '8px'
                                                                        }}
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div style={{
                                                                        width: '100%',
                                                                        height: '100px',
                                                                        borderRadius: '8px',
                                                                        backgroundColor: '#e0e0e0',
                                                                        marginBottom: '8px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: '2rem',
                                                                        color: '#666'
                                                                    }}>
                                                                        {item.type === 'default' ? '🏠' : '📦'}
                                                                    </div>
                                                                )}
                                                                <div style={{
                                                                    fontWeight: ((item.type === 'default' && selectedVariantIndex === null) ||
                                                                        (item.type === 'variant' && selectedVariantIndex === item.index))
                                                                        ? 'bold' : 'normal',
                                                                    fontSize: '0.9rem',
                                                                    color: '#333',
                                                                    textAlign: 'center',
                                                                    wordBreak: 'break-word'
                                                                }}>
                                                                    {item.name}
                                                                </div>
                                                                <div style={{
                                                                    fontSize: '0.75rem',
                                                                    color: '#666',
                                                                    textAlign: 'center',
                                                                    marginTop: '4px'
                                                                }}>
                                                                    {item.imageCount} images
                                                                </div>
                                                                {((item.type === 'default' && selectedVariantIndex === null) ||
                                                                    (item.type === 'variant' && selectedVariantIndex === item.index)) && (
                                                                        <div style={{
                                                                            position: 'absolute',
                                                                            top: '8px',
                                                                            right: '8px',
                                                                            backgroundColor: '#4CAF50',
                                                                            color: 'white',
                                                                            borderRadius: '50%',
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontWeight: 'bold',
                                                                            fontSize: '14px'
                                                                        }}>
                                                                            ✓
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {selectedVariantIndex !== null && (
                                                <div style={{
                                                    backgroundColor: '#fff',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e0e0e0',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginTop: '15px'
                                                }}>
                                                    <div>
                                                        <strong style={{ color: '#4CAF50' }}>Currently Viewing:</strong>
                                                        <span style={{ marginLeft: '8px', fontSize: '1rem' }}>
                                                            {product.variants[selectedVariantIndex].name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={handleDefaultSelect}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#ff6b35',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        Reset to Default
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="color-header">
                                        <h3>Available Swatches: {productSwatches.length}</h3>
                                        <div className="color-controls">
                                            <label className="multiple-swatches">
                                                <input type="checkbox" />
                                                Select Multiple Swatches
                                            </label>
                                            <span className="selected-count">{selectedSwatchIndex !== null ? '1 Selected' : '0 Selected'}</span>
                                            <button className="clear-btn" onClick={() => setSelectedSwatchIndex(null)}>Clear</button>
                                        </div>
                                    </div>

                                    <button className="order-sample-btn">ORDER SAMPLE</button>
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
                                    <div>
                                        <span
                                            className="readmore"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setExpanded(!expanded);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="readmore-content">
                                                <p>Key Characteristics</p>
                                                <div className="readmore-icon">
                                                    {expanded ? (
                                                        <MdOutlineKeyboardArrowUp />
                                                    ) : (
                                                        <MdOutlineKeyboardArrowDown />
                                                    )}
                                                </div>
                                            </div>
                                        </span>

                                        {expanded && (
                                            <div className="extra-text">
                                                {product.Flammable && (
                                                    <>
                                                        <div className="turtle-life-content">
                                                            <img src="/flamesafe1.png" alt="" />
                                                            <div className="ophelia-title">FLAMMABLE</div>
                                                        </div>
                                                        <div className="Anti-Flamesafe"><img src="/5.png" alt="" /> <b>Anti flammable:</b> CAL 117-2013, FMVSS302, IMO FTP, BIFMA CLASS A, NFPA 260</div>
                                                        <div className="ophelia-description">
                                                            {product.Flammable}
                                                        </div>
                                                    </>
                                                )}

                                                <div className="turtle-life-content">
                                                    <img src="/turtle-life.png" alt="" />
                                                    <div className="ophelia-title">TURTLE LIFE</div>
                                                </div>

                                                {product.resistant && (
                                                    <div className="Characteristics-content">
                                                        <div className="Pink-Stain"><img src="/5.png" alt="" /> <b>Cold crack resistant:</b>-60 degrees F</div>
                                                        <div className="ophelia-description">
                                                            {product.resistant}
                                                        </div>
                                                    </div>
                                                )}

                                                {product.QUV && (
                                                    <div className="Characteristics-content">
                                                        <div className="Pink-Stain"><img src="/4.png" alt="" /> <b>QUV resistant:</b> {product.QUV}</div>
                                                        <div className="ophelia-description">
                                                            {product.QUV}
                                                        </div>
                                                    </div>
                                                )}

                                                {product.Weatherometer && (
                                                    <div className="Characteristics-content">
                                                        <div className="Pink-Stain"><img src="/6.png" alt="" /> <b>Weatherometer:</b> 1000 Hrs</div>
                                                        <div className="ophelia-description">
                                                            {product.Weatherometer}
                                                        </div>
                                                    </div>
                                                )}

                                                {product.Abrasion && (
                                                    <div className="Characteristics-content">
                                                        <div className="Pink-Stain"><img src="/3.png" alt="" /> <b>Abrasion:</b> Wyzenback 8 Cotton Duck 50,000 cycles</div>
                                                        <div className="ophelia-description">
                                                            {product.Abrasion}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="turtle-life-content">
                                                    <img src="/safe-touch-black.png" alt="" />
                                                    <div className="ophelia-title">SAFE TOUCH</div>
                                                </div>

                                                <h6 className="TURTLE-LIFE-Hending">A microbial safe product</h6>

                                                {product.AntiMicrobial && (
                                                    <div className="Characteristics-content">
                                                        <div className="Pink-Stain"><img src="/2.png" alt="" /> <b>Anti microbial:</b> AATCC-147</div>
                                                        <div className="ophelia-description">
                                                            {product.AntiMicrobial}
                                                        </div>
                                                    </div>
                                                )}

                                                {product.PinkStain && (
                                                    <div className="Characteristics-content">
                                                        <div className="Pink-Stain"><img src="/7.png" alt="" /> <b>Pink Stain:</b> ASTM 1428</div>
                                                        <div className="ophelia-description">
                                                            {product.PinkStain}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                            <div className="cleaned">
                                                <div className="icon-placeholder"><img src="/flamesafe1.png" alt="" /></div>
                                                <div>FLAMESAFE</div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                            <div className="cleaned">
                                                <div className="icon-placeholder"><img src="/turtle-life.png" alt="" /></div>
                                                <div>TURTLE LIFE</div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                            <div className="cleaned">
                                                <div className="icon-placeholder"><img src="/safe-touch-black.png" alt="" /></div>
                                                <div>SAFE TOUCH </div>
                                            </div>
                                        </div>
                                    </div>
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