import './About.css';
import { useEffect, useState, useRef } from "react";
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

const ITEM_SPACING = 300;
const AMPLITUDE = 110;
const SVG_H = 340;

const TOTAL_ITEMS = 16;
const TRACK_WIDTH = TOTAL_ITEMS * ITEM_SPACING;

function generateWavePath(totalWidth, h, amplitude, freq) {
    const cy = h / 2;
    const cp = freq * 0.36;
    let d = `M 0,${cy}`;
    const steps = Math.ceil(totalWidth / freq) + 2;
    for (let i = 0; i < steps; i++) {
        const x0 = i * freq;
        const xEnd = (i + 1) * freq;
        const yPeak = i % 2 === 0 ? cy - amplitude : cy + amplitude;
        const yNext = i % 2 === 0 ? cy + amplitude : cy - amplitude;
        d += ` C ${x0 + cp},${yPeak} ${xEnd - cp},${yPeak} ${xEnd},${cy}`;
        if (i + 1 < steps) {
            const xEnd2 = (i + 2) * freq;
            d += ` C ${xEnd + cp},${yNext} ${xEnd2 - cp},${yNext} ${xEnd2},${cy}`;
            i++;
        }
    }
    return d;
}

const timelineData = [
    { year: "1996", description: "First Export Shipment company Jaitpura Plant", position: "bottom" },
    { year: "2005", description: "Production commences at 2nd coating line at Jaitpura", position: "top" },
    { year: "2005", description: "Quality Certification 9001:2000 company Jaitpura Plant", position: "bottom" },
    { year: "2008", description: "Added third coating line at Jaitpura Plant", position: "top" },
    { year: "2011", description: "Total capacity of Jaitpura Plant increased", position: "bottom" },
    { year: "2012", description: "Received Forbes Asia Top 200 Best Under a Billion", position: "top" },
    { year: "2012", description: "New Knitting Plant at Dhodsar Plant", position: "bottom" },
    { year: "2014", description: "Fifth coating line inaugurated at Dhodsar Plant", position: "top" },
    { year: "2015", description: "Implement SAP at Jaitpura Plant", position: "bottom" },
    { year: "2015", description: "Added sixth coating line at Dhodsar Plant", position: "top" },
    { year: "2016", description: "TS Certification 16949:2009 at Jaitpura Plant", position: "bottom" },
    { year: "2019", description: "Acquisition of Futura Textile INC (USA)", position: "top" },
    { year: "2019", description: "Added automatic mixing machine at Dhodsar Plant", position: "bottom" },
    { year: "2019", description: "New PU Plant at Gwalior Madhya Pradesh", position: "top" },
    { year: "2020", description: "Our Membership with United Nations Global Impact", position: "bottom" },
    { year: "2021", description: "Expansion of Futura Textile INC (USA)", position: "top" },
];

const slides = [
    {
        src: '/About-2.jpg',
        alt: 'World Trade Park, Jaipur Project',
        topText: 'Quality check',
    },
    {
        src: '/About-3.jpg',
        alt: 'City Development, Kota Project',
        topText: 'Coated material',
    },
    {
        src: '/About-4.jpg',
        alt: 'Lodha Residence, Jaipur Project',
        topText: 'Consistent production',
    },
    {
        src: '/About-1.jpg',
        alt: 'Amar Jawan Jyoti Memorial, Jaipur Project',
        topText: 'Amar Jawan Jyoti Memorial, Jaipur',
    },
];

/*
  ★ 6 certificates — update `src` with your actual image paths.
  The `label` is shown as a small text below if the image hasn't loaded.
*/
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
        description:
            "Futura Textiles was established to provide exceptional quality of coated fabrics (specialized in PVC) to the Automotive, Marine, Contract, trucking and hospitality markets in North and Central America. We supply through an exclusive supply agreement with our business partners Mayur Uniquoters ltd who are also an equity partner in Futura Textiles",
    },
    mayur: {
        description:
            "Mayur Uniquoters Ltd is India's leading manufacturer of artificial leather and coated fabrics. With state-of-the-art facilities and decades of expertise, we serve global markets with innovative solutions in automotive, furniture, footwear, and fashion industries. Our commitment to quality and sustainability makes us a trusted partner worldwide.",
    },
};

export default function About() {
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("futura");
    const splideRef = useRef(null);
    const typingSectionRef = useRef(null);

    const wavePath = generateWavePath(TRACK_WIDTH * 2 + 400, SVG_H, AMPLITUDE, ITEM_SPACING);

    useEffect(() => {
        let splide = null;
        if (splideRef.current) {
            splide = new Splide(splideRef.current, {
                perPage: 3,
                focus: 'center',
                type: 'loop',
                arrows: true,
                pagination: false,
                gap: '1rem',
                autoplay: true,
                interval: 3000,
                pauseOnHover: true,
                speed: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                breakpoints: {
                    992: { perPage: 2, gap: '0.8rem' },
                    768: { perPage: 1, gap: '0.5rem' },
                },
            });
            splide.mount();
        }
        return () => { if (splide) splide.destroy(); };
    }, []);

    const [visibleSections, setVisibleSections] = useState({ section1: false });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sectionId = entry.target.getAttribute('data-section');
                    if (sectionId) {
                        setVisibleSections(prev => ({
                            ...prev,
                            [sectionId]: entry.isIntersecting,
                        }));
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px' }
        );
        if (typingSectionRef.current) observer.observe(typingSectionRef.current);
        return () => { if (typingSectionRef.current) observer.unobserve(typingSectionRef.current); };
    }, []);

    return (
        <>
            {/* ════════════════════════════════════════
                HERO + ABOUT US BOX
            ════════════════════════════════════════ */}
            <div className="About">
                <div className="About-us">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-8 col-md-12 col-sm-12"></div>
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="About-Us-Box">
                                    <div className="About-Us-image">
                                        <img src="/02.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── GLOBAL LEADERS ── */}
                <div className="Golbal-Leaders-container">
                    <div className="Golbal-Leaders">
                        <div className="Golbal-Leaders-title">Global Leaders</div>
                        <div className="Golbal-Leaders-des">in Coated Fabric Solutions</div>
                    </div>

                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="Futura-Textiles-image">
                                    <img src="/Rectangle-6.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="Futura-Textiles-container">
                                    <div className="Futura-Textiles-content">
                                        <div className="Futura-Textiles-content-About">About us</div>
                                        <div className="company-tabs">
                                            <button
                                                onClick={() => setActiveTab("futura")}
                                                className={`tab-button ${activeTab === "futura" ? "active" : ""}`}
                                            >
                                                | Futura Textiles
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("mayur")}
                                                className={`tab-button ${activeTab === "mayur" ? "active" : ""}`}
                                            >
                                                | Mayur Uniquoters
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

            {/* ════════════════════════════════════════
                TIMELINE MAIN CONTAINER
            ════════════════════════════════════════ */}
            <div className="Futura-Line-main-container">

                {/* ── WAVE TIMELINE ── */}
                <div className="Futura-Line-container">
                    <div className="Futura-Line">
                        <div className="timeline-scroll-wrapper">
                            <div
                                className="timeline-track"
                                style={{
                                    width: `${TRACK_WIDTH * 2}px`,
                                    animationDuration: `${TOTAL_ITEMS * 2.8}s`,
                                    '--scroll-dist': `-${TRACK_WIDTH}px`,
                                }}
                            >
                                <svg
                                    className="timeline-wave-svg"
                                    viewBox={`0 0 ${TRACK_WIDTH * 2} ${SVG_H}`}
                                    preserveAspectRatio="none"
                                    style={{ width: `${TRACK_WIDTH * 2}px`, height: `${SVG_H}px` }}
                                >
                                    <defs>
                                        <linearGradient id="tlWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#b85c38" stopOpacity="0.20" />
                                            <stop offset="50%" stopColor="#c9a84c" stopOpacity="0.60" />
                                            <stop offset="100%" stopColor="#b85c38" stopOpacity="0.20" />
                                        </linearGradient>
                                    </defs>
                                    <path d={wavePath} stroke="#c9a84c" strokeWidth="12" fill="none" strokeOpacity="0.07" />
                                    <path d={wavePath} stroke="url(#tlWaveGrad)" strokeWidth="2.5" fill="none" strokeDasharray="12,8" />
                                </svg>

                                {/* ── ITEMS SET 1 ── */}
                                <div
                                    className="timeline-items-container"
                                    style={{ width: `${TRACK_WIDTH}px`, height: `${SVG_H}px` }}
                                >
                                    {timelineData.map((item, idx) => {
                                        const xPos = idx * ITEM_SPACING + ITEM_SPACING / 2;
                                        return (
                                            <div
                                                key={idx}
                                                className={`timeline-point ${item.position}`}
                                                style={{
                                                    left: `${xPos}px`,
                                                    height: `${SVG_H / 2}px`,
                                                    top: item.position === "bottom" ? `${SVG_H / 2}px` : "0",
                                                }}
                                            >
                                                <div className="timeline-content-box">
                                                    <div className="timeline-year">{item.year}</div>
                                                    <div className="timeline-description">{item.description}</div>
                                                </div>
                                                <div className="timeline-connector" />
                                                <div className="timeline-dot-wrap">
                                                    <div className="timeline-dot-ring" />
                                                    <div className="timeline-dot" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* ── ITEMS SET 2 (seamless duplicate) ── */}
                                <div
                                    className="timeline-items-container duplicate"
                                    style={{
                                        left: `${TRACK_WIDTH}px`,
                                        width: `${TRACK_WIDTH}px`,
                                        height: `${SVG_H}px`,
                                    }}
                                >
                                    {timelineData.map((item, idx) => {
                                        const xPos = idx * ITEM_SPACING + ITEM_SPACING / 2;
                                        return (
                                            <div
                                                key={`dup-${idx}`}
                                                className={`timeline-point ${item.position}`}
                                                style={{
                                                    left: `${xPos}px`,
                                                    height: `${SVG_H / 2}px`,
                                                    top: item.position === "bottom" ? `${SVG_H / 2}px` : "0",
                                                }}
                                            >
                                                <div className="timeline-content-box">
                                                    <div className="timeline-year">{item.year}</div>
                                                    <div className="timeline-description">{item.description}</div>
                                                </div>
                                                <div className="timeline-connector" />
                                                <div className="timeline-dot-wrap">
                                                    <div className="timeline-dot-ring" />
                                                    <div className="timeline-dot" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════
                    MANUFACTURER SECTION
                ════════════════════════════════════════ */}
                <div className="Manufacturer">
                    <div className="Manfacturer-Box-1">
                        <div className="Manfacturer-Box-1-line-1"></div>
                        <div className="Manfacturer-Box-1-title">OUR PLANT <span>IN INDIA</span></div>
                    </div>
                    <div className="Manfacturer-Box-2">
                        <div className="Manfacturer-Box-1-line-2"></div>
                        <div className="Manfacturer-Box-1-des">
                            We are the largest manufacturer of artificial leather, using the 'Release Paper Transfer
                            Coating Technology' in India. We have come a long way in the past two decades from a meagre
                            production of 0.25 million linear meters per month, to an astonishing 4.45 million linear
                            meters per month,
                            {expanded && (
                                <span className="extra-text">
                                    {" "}through our 7 state of the art coating lines of which 5 are Italian lines. The latest
                                    addition is the PU plant at Morena with an initial capacity of 5 million mtrs/annum
                                    and a total expandable capacity 20 million mtrs /annum.
                                </span>
                            )}
                            <span className="readmore" onClick={() => setExpanded(!expanded)}>
                                {expanded ? " Show Less" : " Read More...."}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════
                    SPLIDE SLIDER
                ════════════════════════════════════════ */}
                <div className="About-slider-container">
                    <section
                        ref={splideRef}
                        className="splide modern-slider"
                        aria-label="Image gallery carousel"
                    >
                        <div data-aos="fade-up" className="splide__track">
                            <ul className="splide__list">
                                {slides.map((slide, index) => (
                                    <li key={index} className="splide__slide modern-slide">
                                        <div className="About-slide-content">
                                            <div className="Slide-image-wrapper">
                                                <img
                                                    src={slide.src}
                                                    alt={slide.alt}
                                                    loading="lazy"
                                                />
                                                <div className="text-content">
                                                    <div className="top-text">{slide.topText}</div>
                                                    <div className="bottom-text">{slide.bottomText}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>

                {/* ════════════════════════════════════════
                    CERTIFICATION SECTION — LEFT / RIGHT SPLIT
                ════════════════════════════════════════ */}
                <div className="About-Certification-container">

                    {/* ── LEFT: Text content ── */}
                    <div className="About-Certification-content">
                        <div className="Certification-content-label">Quality Assurance</div>
                        <h2 className="Certification-content-title">
                            Our
                            <strong>Certificates</strong>
                        </h2>
                        <div className="Certification-content-divider"></div>
                        <p className="Certification-content-description">
                            The organization was certified to "Quality Management System" ISO 9001:2000 in the
                            year 2005 and presently, certified "Integrated Management System" (i.e., combined
                            of ISO 9001, ISO 14001, &amp; OHSAS 18001) as Group &amp; also Certified @ IATF/TS
                            16949 for Automotive Unit. With above system company also following the German
                            Automotive Guideline for Process as per VDA 6.3. TPM practices to achieve excellence
                            in all activities with improved working culture initiated with 5's &amp; Kaizen.
                        </p>
                    </div>

                    {/* ── RIGHT: Logo grid (6 certificates) ── */}
                    <div className="About-Certification-logo">
                        <div className="Certification-logos-grid">
                            {certificates.map((cert, index) => (
                                <div className="Certification-logo-item" key={index}>
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
                {/* ── END CERTIFICATION ── */}

            </div>{/* .Futura-Line-main-container */}
        </>
    );
}