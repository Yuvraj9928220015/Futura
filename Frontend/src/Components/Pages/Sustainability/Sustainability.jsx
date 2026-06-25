import React, { useState, useEffect, useRef } from 'react';
import './Sustainability.css';

/* ============================================================
   SUSTAINABILITY BOX SLIDER DATA
   ============================================================ */
const slides = [
    {
        id: '01',
        tag: 'Sustainable Products',
        brand: 'Pavo Esse Eco',
        material: 'PVC‑Based Sustainable Material',
        subtitle: 'Pavo Esse Eco represents our innovation in responsible PVC solutions',
        image: '/Sustainability-5.png',
        highlights: [
            'Optimized PVC formulation with lower environmental impact',
            'Long life cycle, reducing replacement and material waste',
            'Designed to support circular‑economy principles',
            'Suitable for applications demanding durability and consistency',
        ],
    },
    {
        id: '02',
        tag: 'Sustainable Products',
        brand: 'Unico Esse Eco',
        material: 'PU‑Based Sustainable Material',
        subtitle: 'Unico Esse Eco is our step toward cleaner, more conscious polyurethane solutions',
        image: '/Sustainability-6.png',
        highlights: [
            'Sustainable PU formulation focused on reduced carbon footprint',
            'Lightweight yet high‑performance material',
            'Supports eco‑conscious manufacturing processes',
            'Ideal for brands prioritizing sustainability without design compromise',
        ],
    },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function Sustainability() {

    /* ---- State ---- */
    const [current, setCurrent] = useState(0);
    const [panelOpen, setPanelOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [designPopupOpen, setDesignPopupOpen] = useState(false);
    const isHovering = useRef(false);

    const corporateRef = useRef(null);
    const designSectionRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollToSection = (ref) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    /* ---- Navigate ---- */
    const goTo = (idx) => {
        if (idx === current) return;
        setPanelOpen(false);
        isHovering.current = false;
        setCurrent(idx);
    };

    const getRelPos = (idx) => {
        const n = slides.length;
        let d = ((idx - current) % n + n) % n;
        if (d > Math.floor(n / 2)) d -= n;
        return d;
    };

    /* ---- Render ---- */
    return (
        <>
            <div className="sustainability">

                {/* ===== BELIEVE / BANNER SECTION ===== */}
                <div className="sustainability-banner">
                    <div className="Believe">
                        <div id='Believe-container' className="container-fluid">
                            <div className="Believe-Section">
                                <div className="Believe-Section-1">
                                    <div className="Believe-main-Section-1">
                                        <img src="/sustainability-new-image.jpeg" alt="Sustainability" />
                                        <div className='Believe-main-Section-logo'>
                                            <img src="/Futura-new-logo.png" alt="Futura Logo" />
                                        </div>
                                        <div className='Believe-main-Section-content'>
                                            <img src="/Sustainability-text-1.png" alt="Sustainability Text" />
                                        </div>
                                    </div>
                                    <div className="Believe-main-Section-2">
                                        <img src="/0001.png" alt="Sustainability Stats" />
                                    </div>
                                </div>
                                <div className="Believe-Section-2">
                                    <div className="Believe-main-Section-3">

                                        {/* ===== NAVIGATION LIST ===== */}
                                        <div className="Believe-main-Section-list">
                                            <ul>
                                                <li
                                                    className="nav-li"
                                                    onClick={() => scrollToSection(corporateRef)}
                                                    title="Go to Corporate Social Responsibility"
                                                >
                                                    CSR
                                                </li>
                                                <li
                                                    className="nav-li"
                                                    onClick={() => scrollToSection(designSectionRef)}
                                                    title="Go to Sustainable Product"
                                                >
                                                    Sustainable Product
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="Believe-main-Section-title">
                                            Building responsibly today,{' '}
                                            <br className="br-hide" /> for a better tomorrow.
                                        </div>
                                        <div className="Believe-main-Section-Subtitle">
                                            At Mayur, sustainability is not a trend — it is a long‑term
                                            commitment embedded into our products, processes, and
                                            people‑first initiatives.
                                        </div>
                                        <div className="Believe-main-Section-btn">
                                            <button className="download-btn">
                                                <span className="download-btn-text">
                                                    Sustainability Report
                                                </span>
                                                <span className="download-btn-icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M12 3v13" />
                                                        <path d="M7 12l5 5 5-5" />
                                                        <path d="M5 20h14" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="Believe-main-Section-4">
                                        <div className="Compact-title">
                                            UN Global Compact (UNGC) Commitment
                                        </div>
                                        <div className="Compact-subtitle">
                                            Aligned with global goals. Accountable to the future.
                                        </div>
                                        <div className="Compact-des">
                                            Mayur has been a proud member of the United Nations Global
                                            Compact since 2020.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== CORPORATE SECTION ===== */}
                <div className="Corporate" ref={corporateRef}>
                    <div className='Corporate-bg'>
                        <div className="Corporate-wrapper">

                            {/* ---- LEFT ---- */}
                            <div className="Corporate-left">
                                <div className="Corporate-heading-row">
                                    <div className="Corporate-green-bar"></div>
                                    <div className="Corporate-left-content">
                                        <div className="Corporate-Box-title">Corporate Social Responsibility</div>
                                        <div className="Corporate-Box-Subtitle">
                                            Responsibility beyond business. Impact beyond numbers.
                                        </div>
                                        <div className="Corporate-Box-des">
                                            At Mayur, CSR is an integral part of our identity. Our initiatives
                                            are focused on environmental stewardship, social development, and
                                            long‑term community impact.
                                        </div>
                                    </div>
                                </div>

                                <div className="Corp-cards-row">

                                    {/* ---- Card 01 — ALWAYS OPEN ---- */}
                                    <div className="corp-card corp-card--always-open">
                                        <div className="corp-card-inner">
                                            <div className="corp-card-img">
                                                <img src="/New-image-4.jpg" alt="Trees Planted" />
                                            </div>
                                            <div className="corp-card-body">
                                                <div className="corp-card-numbers">01.</div>
                                                <div className="corp-card-bottom">
                                                    <div className="corp-card-title">35,000+ Trees Planted Since 2020</div>
                                                    <div className="corp-card-desc">
                                                        <li>
                                                            Large-scale plantation drives with a long-term commitment
                                                            to biodiversity, carbon absorption, and continuous
                                                            expansion of green cover.
                                                        </li>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ---- Card 02 — Featured ---- */}
                                    <div className="corp-card corp-card--featured">
                                        <div className="corp-card-inner">
                                            <div className="corp-card-img">
                                                <img src="/New-image-5.jpg" alt="Carbon Reduction" />
                                            </div>
                                            <div className="corp-card-body">
                                                <div className="corp-card-number">02.</div>
                                                <div className="corp-card-bottom">
                                                    <div className="corp-card-title">Carbon Impact Reduction</div>
                                                    <div className="corp-card-desc">
                                                        <li>
                                                            Focused initiatives to reduce emissions through
                                                            energy-efficient manufacturing, waste reduction, and
                                                            responsible resource use.
                                                        </li>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ---- Card 03 — Normal ---- */}
                                    <div className="corp-card">
                                        <div className="corp-card-inner">
                                            <div className="corp-card-img">
                                                <img src="/New-image-7.jpg" alt="Education" />
                                            </div>
                                            <div className="corp-card-body">
                                                <div className="corp-card-number">03.</div>
                                                <div className="corp-card-bottom">
                                                    <div className="corp-card-title">Infrastructure for Sustainability</div>
                                                    <div className="corp-card-desc">
                                                        <li>
                                                            Installation of bag fillers to reduce packaging waste
                                                            minimizing material loss through improved processes, and
                                                            promoting a safe, inclusive workplace
                                                        </li>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* ---- RIGHT ---- */}
                            <div className="Corporate-right">
                                <div className="Floating-info-card">

                                    {/* ---- Card 04 — ALWAYS OPEN ---- */}
                                    <div className="corp-card corp-card--always-open">
                                        <div className="corp-card-inner">
                                            <div className="corp-card-img">
                                                <img src="/New-image-6.jpeg" alt="Education" />
                                            </div>
                                            <div className="corp-card-body">
                                                <div className="corp-card-number">04.</div>
                                                <div className="corp-card-bottom">
                                                    <div className="corp-card-title">
                                                        Education &amp; Community Development
                                                    </div>
                                                    <div className="corp-card-desc">
                                                        <li>
                                                            Supporting education, community programs, and empowering
                                                            future generations through learning
                                                        </li>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="Photo-collage">
                                    <div className="Photo-collage-image">
                                        <img src="/0003.png" alt="Collage Main" />
                                    </div>
                                    <div className="Photo-collage-2">
                                        <img src="/00001.png" alt="" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/* ===== END CORPORATE ===== */}


                {/* ===== PEEK CAROUSEL SLIDER ===== */}
                <div className="Sustainability-Box-Container">

                    {/* ── Title + decorative line ── */}
                    <div className="Sustainability-Product-title">Sustainability Product</div>
                    <div className="sbs-title-line"></div>

                    <div className="sbs-outer">

                        {/* ---- Carousel Track ---- */}
                        <div className="sbs-carousel-wrap">
                            {slides.map((s, i) => {
                                const pos = getRelPos(i);
                                const isActive = pos === 0;
                                const posKey =
                                    pos === 0 ? 'active' :
                                        pos === 1 ? 'right' :
                                            pos === -1 ? 'left' : 'hidden';

                                return (
                                    <div className="sbs-item-container" key={s.id}>
                                        <div
                                            className={`sbs-item sbs-item--${posKey}`}
                                            onClick={() => {
                                                if (!isActive) {
                                                    goTo(i);
                                                } else if (isMobile) {
                                                    setPanelOpen(p => !p);
                                                }
                                            }}
                                            onMouseEnter={() => {
                                                if (isActive && !isMobile) {
                                                    isHovering.current = true;
                                                    setPanelOpen(true);
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                if (isActive && !isMobile) {
                                                    isHovering.current = false;
                                                    setPanelOpen(false);
                                                }
                                            }}
                                        >
                                            {/* Background image */}
                                            <div
                                                className="sbs-bg"
                                                style={{ backgroundImage: `url(${s.image})` }}
                                            ></div>
                                            <div className="sbs-bg-dark"></div>

                                            {/* Peek arrow hint */}
                                            {!isActive && (
                                                <div className={`sbs-peek-arrow sbs-peek-arrow--${posKey}`}>
                                                    <span>{posKey === 'right' ? '›' : '‹'}</span>
                                                </div>
                                            )}

                                            {/* Left Content */}
                                            <div className={`sbs-left${isActive && panelOpen ? ' sbs-left-shrink' : ''}`}>
                                                <h2 className="sbs-brand">{s.brand}</h2>
                                                <p className="sbs-material">{s.material}</p>
                                                {isActive && isMobile && (
                                                    <div className="sbs-tap-hint">
                                                        <span className="sbs-hint-dot"></span>
                                                        <span>{panelOpen ? 'Tap to close' : 'Tap to explore'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Detail Panel */}
                                            <div className={`sbs-panel${isActive && panelOpen ? ' sbs-panel-open' : ''}`}>
                                                <div className="sbs-panel-scroll">
                                                    <div className="sbs-panel-brand">{s.brand}</div>
                                                    <div className="sbs-panel-mat">{s.material}</div>
                                                    <div className="sbs-panel-line"></div>
                                                    <p className="sbs-panel-sub">{s.subtitle}</p>

                                                    <div className="sbs-kh-row">
                                                        <span className="sbs-kh-dash"></span>
                                                        <span className="sbs-kh-text">Key Highlights</span>
                                                        <span className="sbs-kh-dash"></span>
                                                    </div>

                                                    <ul className="sbs-list">
                                                        {s.highlights.map((pt, hi) => (
                                                            <li
                                                                key={hi}
                                                                className={isActive && panelOpen ? 'sbs-list-item-in' : ''}
                                                                style={{ animationDelay: `${0.06 * hi + 0.2}s` }}
                                                            >
                                                                <span className="sbs-dot-bullet"></span>
                                                                <span>{pt}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ---- Dots navigation (also doubles as carousel position indicator) ---- */}
                        <div className="sbs-nav-row">
                            <div className="sbs-dots">
                                {slides.map((s, i) => (
                                    <span
                                        key={s.id}
                                        className={`sbs-dot${i === current ? ' sbs-dot-on' : ''}`}
                                        onClick={() => goTo(i)}
                                    ></span>
                                ))}
                            </div>
                            <div className="sbs-count">
                                <span className="sbs-cur">{String(current + 1).padStart(2, '0')}</span>
                                <span className="sbs-sep"> / </span>
                                <span className="sbs-tot">{String(slides.length).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ===== END PEEK CAROUSEL SLIDER ===== */}


                {/* ===== DESIGN SECTION ===== */}
                <div
                    className={`design-section${designPopupOpen ? ' ds-popup-open' : ''}`}
                    ref={designSectionRef}
                    onClick={() => {
                        if (isMobile) setDesignPopupOpen((p) => !p);
                    }}
                >
                    <div className="ds-bg"></div>
                    <div className="ds-bg-img"></div>
                    <div className="ds-overlay"></div>

                    <div className="ds-right ds-right--zoom">
                        <div className="ds-left">
                            <div className="ds-label">Sustainable Product</div>
                            <h2 className="ds-title">
                                Recycled <span> PET </span><br />Fabric
                            </h2>
                            <div className="ds-line"></div>
                            <div className="ds-subtitle">
                                Sustainable Base Material from Recycled Plastic Bottles
                            </div>
                        </div>
                        <p className="ds-desc">
                            Discover an extraordinary range of handpicked products, sourced from the
                            heart of nature. Every detail crafted with care, every element designed to
                            elevate your experience.
                        </p>
                    </div>

                    {isMobile && (
                        <div className="ds-hover-hint">
                            <span className="ds-hover-dot"></span>
                            <span>{designPopupOpen ? 'Tap to close' : 'Tap to view details'}</span>
                        </div>
                    )}
                </div>
                {/* ===== END DESIGN SECTION ===== */}

            </div>
        </>
    );
}