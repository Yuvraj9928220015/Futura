import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const ORIGINAL = [
    { id: 1, name: "Americana", description: "The Unique 4 Way Stretch Of This Vinyl Makes It Perfect For Contouring...", tag: "AVAILABLE IN MORE COLORS", img: "/Americana-1.png", slug: "americana" },
    { id: 2, name: "Apollo", description: "Americana Is A High End, Bespoke, Soft And Dynamic Product For Marine, Contract...", tag: "AVAILABLE IN MORE COLORS", img: "/Apollo-image-1.png", slug: "apollo" },
    { id: 3, name: "Sauve", description: "Auto Rev Synthetic Leather Is Resistant To Weather, Abrasions, UV Radiations...", tag: "AVAILABLE IN MORE COLORS", img: "/Suave-New-image-1.png", slug: "suave" },
    { id: 4, name: "Xtreme", description: "Americana Is A High End, Bespoke, Soft And Dynamic Product For Marine, Contract...", tag: "AVAILABLE IN MORE COLORS", img: "/Futura-New-48.png", slug: "xtreme" },
    { id: 5, name: "Offroad", description: "Auto Rev Synthetic Leather Is Resistant To Weather, Abrasions, UV Radiations...", tag: "AVAILABLE IN MORE COLORS", img: "/OffRoad-image-1.png", slug: "offroad" },
    { id: 7, name: "Marine Revolution", description: "Auto Rev Synthetic Leather Is Resistant To Weather, Abrasions, UV Radiations...", tag: "AVAILABLE IN MORE COLORS", img: "/Futura-New-49.jpeg", slug: "marine-revolution" },
    { id: 6, name: "Poseiden", description: "Premium Marine Grade Material With Superior Durability And UV Protection...", tag: "AVAILABLE IN MORE COLORS", img: "/Futura-New-6.png", slug: "poseiden" },
    { id: 8, name: "Runabout", description: "Specially Engineered For High-Performance Marine Environments And Harsh Weather...", tag: "AVAILABLE IN MORE COLORS", img: "/Futura-New-7.png", slug: "runabout" },
    { id: 9, name: "Fuerte", description: "Premium Marine Grade Material With Superior Durability And UV Protection ...", tag: "AVAILABLE IN MORE COLORS", img: "/Futura-New-47.jpeg", slug: "fuerte" },
    { id: 10, name: "Matrix", description: "The Unique 4 Way Stretch Of This Vinyl Makes It Perfect For Contouring...", tag: "AVAILABLE IN MORE COLORS", img: "/Matrix-image-2.png", slug: "matrix" },
    { id: 11, name: "Auto Revolution", description: "Auto Rev Synthetic Leather Is Resistant To Weather, Abrasions, UV Radiations...", tag: "AVAILABLE IN MORE COLORS", img: "/Futura-New-46.jpeg", slug: "auto-revolution" },
];

const TOTAL = ORIGINAL.length;
const CLONE_COUNT = 4;
const GAP_PX = 18;
const AUTOPLAY_MS = 3000;

const EXTENDED = [
    ...ORIGINAL.slice(-CLONE_COUNT),
    ...ORIGINAL,
    ...ORIGINAL.slice(0, CLONE_COUNT),
];

const REAL_START = CLONE_COUNT;
const REAL_END = CLONE_COUNT + TOTAL - 1;

function getVC() {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
}

function activeDot(idx) {
    return ((idx - CLONE_COUNT) % TOTAL + TOTAL) % TOTAL;
}

export default function Categories() {
    const navigate = useNavigate();
 
    const wrapperRef = useRef(null);
    const autoplayRef = useRef(null);
    const isJumping = useRef(false);

    const [index, setIndex] = useState(REAL_START);
    const [animated, setAnimated] = useState(true);
    const [cardWidth, setCardWidth] = useState(0);
    const [visibleCount, setVisibleCount] = useState(getVC);

    const handleCardClick = useCallback((slug) => {
        navigate(`/product?category=${slug}`);
    }, [navigate]);

    const measure = useCallback(() => {
        if (!wrapperRef.current) return;
        const vc = getVC();
        setVisibleCount(vc);
        const w = wrapperRef.current.offsetWidth;
        setCardWidth((w - GAP_PX * (vc - 1)) / vc);
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [measure]);

    const trackOffset = -(index * (cardWidth + GAP_PX));

    const handleTransitionEnd = useCallback(() => {
        if (isJumping.current) return;
        if (index > REAL_END) {
            isJumping.current = true;
            setAnimated(false);
            setIndex(REAL_START + (index - REAL_END - 1));
        } else if (index < REAL_START) {
            isJumping.current = true;
            setAnimated(false);
            setIndex(REAL_END - (REAL_START - 1 - index));
        }
    }, [index]);

    useEffect(() => {
        if (!animated) {
            const id = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimated(true);
                    isJumping.current = false;
                });
            });
            return () => cancelAnimationFrame(id);
        }
    }, [animated]);

    const stopAuto = useCallback(() => clearInterval(autoplayRef.current), []);
    const startAuto = useCallback(() => {
        stopAuto();
        autoplayRef.current = setInterval(
            () => setIndex((prev) => prev + 1),
            AUTOPLAY_MS
        );
    }, [stopAuto]);

    useEffect(() => {
        startAuto();
        return stopAuto;
    }, [startAuto, stopAuto]);

    const handlePrev = () => {
        stopAuto();
        setAnimated(true);
        setIndex((prev) => prev - 1);
        startAuto();
    };

    const handleNext = () => {
        stopAuto();
        setAnimated(true);
        setIndex((prev) => prev + 1);
        startAuto();
    };

    const handleDot = (dotIdx) => {
        stopAuto();
        setAnimated(true);
        setIndex(REAL_START + dotIdx);
        startAuto();
    };

    const dot = activeDot(index);
    const trackWidth = EXTENDED.length * cardWidth + (EXTENDED.length - 1) * GAP_PX;

    return (
       <>
        <section className="cat-section">

            <div className="cat-section-container">

                <div className="cat-header">
                    <div className="cat-header-left">
                        <p className="cat-subtitle">Our Product Categories</p>
                        <h2 className="cat-title">Make Your Dream True</h2>
                    </div>
                    <div className="cat-nav-buttons">
                        <button className="cat-nav-btn" onClick={handlePrev} aria-label="Previous">&#8249;</button>
                        <button className="cat-nav-btn" onClick={handleNext} aria-label="Next">&#8250;</button>
                    </div>
                </div>

                {/* Slider */}
                <div className="cat-slider-wrapper" ref={wrapperRef}>
                    <div
                        className="cat-slider-track"
                        onTransitionEnd={handleTransitionEnd}
                        style={{
                            width: `${trackWidth}px`,
                            transform: `translateX(${trackOffset}px)`,
                            transition: animated ? "transform 0.55s cubic-bezier(0.4,0,0.2,1)" : "none",
                        }}
                    >
                        {EXTENDED.map((product, i) => (
                            <div
                                key={`${product.id}-${i}`}
                                className="cat-card"
                                style={{ width: `${cardWidth}px`, flexShrink: 0, cursor: "pointer" }}
                                onClick={() => handleCardClick(product.slug)}
                                title={`View ${product.name} products`}
                            >
                                <img src={product.img} alt={product.name} className="cat-card-img" />
                                <div className="cat-card-overlay" />
                                <div className="cat-card-content">
                                    <h3 className="cat-card-name">{product.name}</h3>
                                    <p className="cat-card-desc">{product.description}</p>
                                    <span className="cat-card-explore-btn">Explore →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Reach Section ── */}
            <div className="reach-section">
                <div className="reach-inner">

                    <div className="reach-images">
                        <img src="/Futura-New-14.jpeg" alt="Fabric 1" className="reach-img reach-img--1" />
                        <img src="/Futura-New-13.jpeg" alt="Fabric 2" className="reach-img reach-img--2" />
                        <img src="/Futura-New-16.jpeg" alt="Fabric 3" className="reach-img reach-img--3" />
                        <img src="/Futura-New-15.jpeg" alt="Fabric 4" className="reach-img reach-img--4" />
                    </div>

                    <div className="reach-text">
                        <div className="reach-title">Reach Out Today And Let's Chat</div>
                        <div className="reach-desc">
                            Discover premium coated fabrics designed for performance and longevity.
                            Speak with our experts to discuss your specific requirements.
                        </div>
                        <div className="reach-btn-wrap">
                            <button><a href="/about">Get Started</a></button>
                        </div>
                    </div>

                </div>
            </div>

        </section>
       </>
    );
}