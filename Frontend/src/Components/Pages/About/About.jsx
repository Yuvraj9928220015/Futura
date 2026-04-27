import './About.css';
import { useEffect, useState, useRef, useCallback, useMemo } from "react";

/* ─────────────────────────────────────────
   SLIDES DATA
───────────────────────────────────────── */
const allImageSlides = [
    { src: '/About-2.jpg', alt: 'Quality check', text: 'Quality Check', subtext: 'Precision at every step' },
    { src: '/About-3.jpg', alt: 'Coated material', text: 'Coated Material', subtext: 'Advanced PVC Technology' },
    { src: '/About-4.jpg', alt: 'Consistent production', text: 'Consistent Production', subtext: '4.45M Linear Meters / Month' },
    { src: '/About-1.jpg', alt: 'Material Processing', text: 'Material Processing', subtext: 'Engineered for durability' },
    { src: '/Futura-New-32.jpeg', alt: 'Sample Evaluation', text: 'Sample Evaluation', subtext: 'Testing every detail' },
    { src: '/Futura-New-33.jpeg', alt: 'Performance Testing', text: 'Performance Testing', subtext: 'Measured for excellence' },
];

const certificates = [
    { src: '/Certification-logo-1.png', label: 'ISO 9001:2015' },
    { src: '/Certification-logo-2.png', label: 'ISO 14001:2015' },
    { src: '/Certification-logo-3.png', label: 'ISO 45001:2018' },
    { src: '/Certification-logo-4.png', label: 'IATF 16949:2016' },
    { src: '/Certification-logo-5.png', label: 'VDA 6.3' },
    { src: '/Certification-logo-6.png', label: 'OHSAS 18001:2007' },
];

const companyContent = {
    futura: {
        description: 'Futura Textiles was established to provide exceptional quality of coated fabrics (specialized in PVC) to the Automotive, Marine, Contract, trucking and hospitality markets in North and Central America. We supply through an exclusive supply agreement with our business partners Mayur Uniquoters ltd. who are also an equity partner in Futura Textiles.',
    },
    mayur: {
        description: "Mayur Uniquoters Ltd is India's leading manufacturer of artificial leather and coated fabrics. With state-of-the-art facilities and decades of expertise, we serve global markets with innovative solutions in automotive, furniture, footwear, and fashion industries. Our commitment to quality and sustainability makes us a trusted partner worldwide.",
    },
};

function JourneyScroller({ speed = 0.6 }) {
    const scrollAreaRef = useRef(null);
    const posRef = useRef(0);
    const animRef = useRef(null);
    const hoveredRef = useRef(false);
    const draggingRef = useRef(false);
    const dragStartX = useRef(0);
    const dragStartPos = useRef(0);

    const applyPos = useCallback((p) => {
        posRef.current = p;
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollLeft = p;
        }
    }, []);

    const getMax = useCallback(() => {
        if (!scrollAreaRef.current) return 0;
        return Math.max(0, scrollAreaRef.current.scrollWidth - scrollAreaRef.current.clientWidth);
    }, []);

    useEffect(() => {
        const tick = () => {
            if (!hoveredRef.current && !draggingRef.current) {
                const max = getMax();
                if (posRef.current < max) applyPos(Math.min(posRef.current + speed, max));
            }
            animRef.current = requestAnimationFrame(tick);
        };
        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, [speed, getMax, applyPos]);

    const onPointerDown = (e) => {
        draggingRef.current = true;
        dragStartX.current = e.clientX;
        dragStartPos.current = posRef.current;
        scrollAreaRef.current.setPointerCapture(e.pointerId);
        e.preventDefault();
    };
    const onPointerMove = (e) => {
        if (!draggingRef.current) return;
        applyPos(Math.max(0, Math.min(
            dragStartPos.current + (dragStartX.current - e.clientX),
            getMax()
        )));
    };
    const onPointerUp = () => { draggingRef.current = false; };
    const onTouchStart = (e) => {
        draggingRef.current = true;
        dragStartX.current = e.touches[0].clientX;
        dragStartPos.current = posRef.current;
    };
    const onTouchMove = (e) => {
        if (!draggingRef.current) return;
        applyPos(Math.max(0, Math.min(
            dragStartPos.current + (dragStartX.current - e.touches[0].clientX),
            getMax()
        )));
    };
    const onTouchEnd = () => { draggingRef.current = false; };

    return (
        <div className="journey-wrapper">
            <div className="journey-label-fixed">
                <span className="Journey-text-inline">Journey</span>
            </div>
            <div
                ref={scrollAreaRef}
                className="journey-scroll-area"
                onMouseEnter={() => { hoveredRef.current = true; }}
                onMouseLeave={() => { hoveredRef.current = false; draggingRef.current = false; }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <img
                    src="/Futura-New-27.webp"
                    alt="Futura Timeline"
                    className="journey-timeline-img"
                />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   CARD CONFIGS
───────────────────────────────────────── */
const CARD_CONFIGS = [
    { w: 500, h: 410, st: 12, sl: 10 },
    { w: 460, h: 510, st: 12, sl: -10 },
    { w: 400, h: 460, st: 12, sl: 10 },
    { w: 520, h: 430, st: 12, sl: -10 },
    { w: 360, h: 490, st: 12, sl: 10 },
    { w: 520, h: 445, st: 12, sl: -10 },
];

const CARD_CONFIGS_MD = [
    { w: 500, h: 290, st: 10, sl: 8 },
    { w: 460, h: 360, st: 10, sl: -8 },
    { w: 350, h: 320, st: 10, sl: 8 },
    { w: 520, h: 305, st: 10, sl: -8 },
    { w: 360, h: 345, st: 10, sl: 8 },
    { w: 520, h: 315, st: 10, sl: -8 },
];

const CARD_CONFIGS_SM = [
    { w: 500, h: 210, st: 8, sl: 7 },
    { w: 460, h: 265, st: 8, sl: -7 },
    { w: 350, h: 235, st: 8, sl: 7 },
    { w: 520, h: 220, st: 8, sl: -7 },
    { w: 360, h: 250, st: 8, sl: 7 },
    { w: 520, h: 230, st: 8, sl: -7 },
];

function getCardConfigs() {
    if (typeof window === 'undefined') return CARD_CONFIGS;
    if (window.innerWidth < 600) return CARD_CONFIGS_SM;
    if (window.innerWidth < 1024) return CARD_CONFIGS_MD;
    return CARD_CONFIGS;
}

function FrameImageMarquee({ slides, speed = 0.9, pauseOnHover = true }) {
    const outerRef = useRef(null);
    const pausedRef = useRef(false);
    const posRef = useRef(0);
    const rafRef = useRef(null);
    const [configs, setConfigs] = useState(getCardConfigs);

    useEffect(() => {
        const onResize = () => setConfigs(getCardConfigs());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const allSlides = useMemo(() => [...slides, ...slides], [slides]);

    useEffect(() => {
        const outer = outerRef.current;
        if (!outer) return;

        const tick = () => {
            if (!pausedRef.current) {
                posRef.current += speed;
                const half = outer.scrollWidth / 2;
                if (posRef.current >= half) {
                    posRef.current -= half;
                }
                outer.scrollLeft = posRef.current;
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [speed]);

    return (
        <div
            ref={outerRef}
            className="fmq-outer"
            onMouseEnter={() => { if (pauseOnHover) pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
        >
            {/* No transform on track — scrollLeft on outer handles movement */}
            <div className="fmq-track">
                {allSlides.map((slide, i) => {
                    const c = configs[i % configs.length];
                    const shadowStyle = {
                        width: c.w,
                        height: c.h,
                        top: c.st > 0 ? c.st : 'auto',
                        bottom: c.st < 0 ? Math.abs(c.st) : 'auto',
                        left: c.sl > 0 ? c.sl : 'auto',
                        right: c.sl < 0 ? Math.abs(c.sl) : 'auto',
                    };

                    return (
                        <div key={i} className="fmq-card" style={{ width: c.w, height: c.h }}>
                            <div className="fmq-shadow" style={shadowStyle} />
                            <div className="fmq-frame">
                                <img
                                    src={slide.src}
                                    alt={slide.alt}
                                    className="fmq-img"
                                    draggable="false"
                                    loading="eager"
                                    decoding="async"
                                />
                                <div className="fmq-overlay">
                                    <span className="fmq-text">{slide.text}</span>
                                    <span className="fmq-subtext">{slide.subtext}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN ABOUT
───────────────────────────────────────── */
export default function About() {
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('futura');

    return (
        <>
            <div className="About">
                <div className="About-us">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-8 col-md-12 col-sm-12"></div>
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div data-aos="fade-left" className="About-Us-Box">
                                    <div className="About-Us-image">
                                        <img src="/Futura-New-30.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Golbal-Leaders-container">
                    <div className="Golbal-Leaders">
                        <div className="Golbal-Leaders-title">Global Leaders</div>
                        <div className="Golbal-Leaders-des">in Coated Fabric Solutions</div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div data-aos="fade-right" className="col-lg-4 col-md-12 col-sm-12">
                                <div className="Futura-Textiles-image">
                                    <img src="/Futura-New-28.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="Futura-Textiles-container">
                                    <div className="Futura-Textiles-content">
                                        <div className="Futura-Textiles-content-About">About us</div>
                                        <div className="company-tabs">
                                            <button
                                                onClick={() => setActiveTab('futura')}
                                                className={`tab-button ${activeTab === 'futura' ? 'active' : ''}`}
                                            >
                                                Futura Textiles
                                            </button>
                                            <div className='company-tabs-line'></div>
                                            <button
                                                onClick={() => setActiveTab('mayur')}
                                                className={`tab-button ${activeTab === 'mayur' ? 'active' : ''}`}
                                            >
                                                Mayur Uniquoters
                                            </button>
                                        </div>
                                    </div>
                                    <div className="Futura-Textiles-container-des tab-content">
                                        {companyContent[activeTab].description}
                                    </div>
                                </div>
                                <div className="Zero-Market">
                                    <div className="Zero-Market-line"></div>
                                    <div className="Zero-Market-content">
                                        <div className="Zero-Market-content-title">Zero Market Failures</div>
                                        <div className="Zero-Market-content-des">from the past <span>7 years</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="Futura-Line-main-container">

                {/* ══ JOURNEY ══ */}
                <div className="Futura-Line-container">
                    <JourneyScroller speed={2.5} />
                </div>

                {/* ══ MANUFACTURER ══ */}
                <div data-aos="fade-up" className="Manufacturer">
                    <div className="Manfacturer-Box-1">
                        <div className="Manfacturer-Box-1-line-1"></div>
                        <div className="Manfacturer-Box-1-title">OUR PLANT <span>IN INDIA</span></div>
                    </div>
                    <div className="Manfacturer-Box-2">
                        <div className="Manfacturer-Box-1-line-2"></div> 
                        <div className="Manfacturer-Box-1-des">
                            <p>
                                We are the largest manufacturer of artificial leather, using the 'Release Paper Transfer
                                Coating Technology' in India. We have come a long way in the past two decades from a meagre
                                production of 0.25 million linear meters per month, to an astonishing 4.45 million linear
                                meters per month,
                                {expanded && (
                                    <span className="extra-text">
                                        {' '}through our 7 state of the art coating lines of which 5 are Italian lines. The latest
                                        addition is the PU plant at Morena with an initial capacity of 5 million mtrs/annum
                                        and a total expandable capacity 20 million mtrs /annum.
                                    </span>
                                )}
                                <span className="readmore" onClick={() => setExpanded(!expanded)}>
                                    {expanded ? ' Show Less' : ' Read More....'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══ FRAME IMAGE MARQUEE ══ */}
                <div className="frame-marquee-section">
                    <FrameImageMarquee slides={allImageSlides} speed={0.9} pauseOnHover={true} />
                </div>

                {/* ══ CERTIFICATION ══ */}
                <div className="About-Certification-container">
                    <div className="About-Certification-content">
                        <h2 className="Certification-content-title">
                            Our<strong>Certificates</strong>
                        </h2>
                        <div className="Certification-content-divider"></div>
                        <div className="Certification-content-label">Quality Assurance</div>
                        <p className="Certification-content-description">
                            The organization was certified to "Quality Management System" ISO 9001:2000 in the
                            year 2005 and presently, certified "Integrated Management System" (i.e., combined
                            of ISO 9001, ISO 14001, &amp; OHSAS 18001) as Group &amp; also Certified @ IATF/TS
                            16949 for Automotive Unit. With above system company also following the German
                            Automotive Guideline for Process as per VDA 6.3. TPM practices to achieve excellence
                            in all activities with improved working culture initiated with 5's &amp; Kaizen.
                        </p>
                    </div>
                    <div className="About-Certification-logo">
                        <div className="Certification-logos-grid">
                            {certificates.map((cert, i) => (
                                <div className="Certification-logo-item" key={i}>
                                    <img
                                        src={cert.src}
                                        alt={cert.label}
                                        loading="lazy"
                                    />
                                    <span className="Certification-logo-label">{cert.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}