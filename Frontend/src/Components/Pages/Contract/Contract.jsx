import React, { useState, useEffect, useRef } from 'react';
import './Contract.css';

function Contract() {
    const [activeCard, setActiveCard] = useState(null);
    const [statsInView, setStatsInView] = useState(false);
    const statsRef = useRef(null);

    const productRanges = [
        {
            id: 1,
            title: "Apollo",
            description: "Premium synthetic leather with advanced coating technology for luxury automotive interiors. Features exceptional durability and comfort.",
            image: "/acbf4.jpg"
        },
        {
            id: 2,
            title: "Marine Revolution",
            description: "Marine-grade fabrics designed for extreme weather conditions. Water-resistant and UV-protected for lasting performance.",
            image: "/Mayur-1.jpg"
        },
        {
            id: 3,
            title: "Americana",
            description: "Classic American styling with modern performance. Perfect blend of traditional aesthetics and contemporary functionality.",
            image: "/Mayur-2.jpg"
        },
        {
            id: 4,
            title: "Polaris",
            description: "High-performance fabrics engineered for extreme conditions. Superior grip, breathability, and weather resistance.",
            image: "/Mayur-4.jpg"
        }
    ];

    // Stats data
    const stats = [
        { number: 25, suffix: '+', label: 'Years Experience' },
        { number: 100, suffix: '+', label: 'Fabric Varieties' },
        { number: 50, suffix: '+', label: 'Countries Served' },
        { number: 1000000, suffix: '+', label: 'Happy Customers', isLarge: true }
    ];

    // Intersection Observer for stats animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !statsInView) {
                        setStatsInView(true);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, [statsInView]);

    // Counter component for animated numbers
    const AnimatedCounter = ({ target, suffix, isLarge, duration = 2000 }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!statsInView) return;

            let startTime;
            let animationFrame;

            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const percentage = Math.min(progress / duration, 1);

                // Easing function for smooth animation
                const easeOutQuad = 1 - Math.pow(1 - percentage, 3);
                const current = Math.floor(easeOutQuad * target);

                setCount(current);

                if (percentage < 1) {
                    animationFrame = requestAnimationFrame(animate);
                }
            };

            animationFrame = requestAnimationFrame(animate);

            return () => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        }, [statsInView, target, duration]);

        // Format large numbers
        const formatNumber = (num) => {
            if (isLarge && num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(0) + 'K';
            }
            return num;
        };

        return (
            <span>
                {isLarge ? formatNumber(count) : count}
                {suffix}
            </span>
        );
    };

    return (
        <>
            <div className="Contract">
                {/* Hero Banner */}
                <div className="About">
                    <div className="About-Banner">
                        <video
                            src="/13263261_1440_2560_50fps.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="About-Banner-video"
                        />
                        <div className="About-Banner-overlay">
                            <div className="hero-content">
                                <h1 className="About-title">Contract Furnishing </h1>
                                <p className="About-des">Performance You Feel. Durability You Trust</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Collections */}
                <div className="Product-Ranges-Section">
                    <div className="Section-Header"></div>
                    <div className="container-fluid">
                        <div className="featured-grid">
                            <div className="featured-item">
                                <div className="Contract-Box image-box">
                                    <img src="/airport-1.png" alt="Luxury seating fabric" />
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box content-box">
                                    <div className="Contract-main-Box">
                                        <h3 className="Contract-title">Segment Overview</h3>
                                        <p className="Contract-des">
                                            The furnishing industry is one of the largest consumers of artificial leather, where textures, colors, and overall look & feel play a crucial role. This segment demands materials that combine aesthetic appeal with dependable performance
                                        </p>
                                        <div className="feature-list">
                                            <div className="feature-item">✓ Advanced coating technology</div>
                                            <div className="feature-item">✓ Superior durability</div>
                                            <div className="feature-item">✓ Luxury comfort</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box content-box">
                                    <div className="Contract-main-Box">
                                        <h3 className="Contract-title">Futura Materials for the Contract Furnishing Segment</h3>
                                        <p className="Contract-des">
                                            Our portfolio includes a wide range of surfaces suitable for diverse furnishing applications such as Residential, Office, Hospitality, Outdoor, and Healthcare. Each material is developed with a strong focus on high performance, along with essential properties such as resistance to abrasion, cleanability, and anti-flammability
                                        </p>
                                        <div className="feature-list">
                                            <div className="Contract-des">The collections within this segment bring together varied textures, colors, and surface finishes tailored specifically for contract furnishing needs. Designed to balance appearance and functionality, these materials offer reliable performance while meeting the visual expectations of modern furnishing spaces</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box image-box">
                                    <img src="/hotelpoolsides.png" alt="Performance fabric" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Ranges */}
                <div className="Overview">
                    <div className="Section-Header">
                        <h2 className="About-Section-Heading">Product Ranges</h2>
                        <p className="section-subtitle">Explore our complete collection</p>
                    </div>
                    <div className="container-fluid">
                        <div className="products-grid">
                            {productRanges.map((product) => (
                                <div key={product.id} className="col-item">
                                    <div
                                        className={`Overview-Box ${activeCard === product.id ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveCard(product.id)}
                                        onMouseLeave={() => setActiveCard(null)}
                                    >
                                        <div className="Overview-Box-image">
                                            <img src={product.image} alt={product.title} />
                                        </div>
                                        <div className="Overview-Box-content">
                                            <h3 className="Overview-Box-content-title">{product.title}</h3>
                                            <p className="Overview-Box-content-des">{product.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Animated Stats Section */}
                <div className="stats-section" ref={statsRef}>
                    <div className="container-fluid">
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <div className="stat-number">
                                        <AnimatedCounter
                                            target={stat.number}
                                            suffix={stat.suffix}
                                            isLarge={stat.isLarge}
                                        />
                                    </div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contract;