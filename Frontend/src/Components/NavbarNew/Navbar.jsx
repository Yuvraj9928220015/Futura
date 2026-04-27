import { useState, useEffect, useRef } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const PRODUCT_COLLECTIONS = [
    'Americana', 'Apollo', 'Suave', 'Offroad',
    'Poseiden', 'Runabout', 'Matrix', 'Xtreme',
    'Auto Revolution', 'Marine Revolution', 'Fuerte', 'All'
];

const INDUSTRIAL_SEGMENTS = [
    { label: 'Automotive', href: '/automotive' },
    { label: 'Marine', href: '/marine' },
    { label: 'Contract Furnishing', href: '/contract' },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [segmentsOpen, setSegmentsOpen] = useState(false);
    const [productOpen, setProductOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSegmentsOpen, setMobileSegmentsOpen] = useState(false);
    const [mobileProductOpen, setMobileProductOpen] = useState(false);

    const segmentsTimer = useRef(null);
    const productTimer = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onResize = () => { if (window.innerWidth > 992) closeMobile(); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const openSegments = () => { clearTimeout(segmentsTimer.current); setSegmentsOpen(true); };
    const closeSegments = () => { segmentsTimer.current = setTimeout(() => setSegmentsOpen(false), 120); };
    const openProduct = () => { clearTimeout(productTimer.current); setProductOpen(true); };
    const closeProduct = () => { productTimer.current = setTimeout(() => setProductOpen(false), 120); };
    const closeMobile = () => {
        setMobileOpen(false);
        setMobileSegmentsOpen(false);
        setMobileProductOpen(false);
    };

    const handleCategoryNav = (e, item) => {
        e.preventDefault();
        setProductOpen(false);
        closeMobile();

        if (item === 'All') {
            navigate('/product');
        } else {
            const slug = item.toLowerCase().replace(/\s+/g, '-');
            navigate(`/product?category=${slug}`);
        }
    };

    const cols = (() => {
        const size = Math.ceil(PRODUCT_COLLECTIONS.length / 3);
        return [0, 1, 2].map(i => PRODUCT_COLLECTIONS.slice(i * size, i * size + size));
    })();

    return (
        <>
            {mobileOpen && <div className="nb-backdrop" onClick={closeMobile} />}

            <nav className={`nb ${isScrolled ? 'nb--scrolled' : ''}`}>
                <div className="nb__inner">

                    {/* ── LOGO ── */}
                    <a href="/" className="nb__logo" aria-label="Futura Home">
                        <img src="/Futura-logo.png" alt="Futura" />
                    </a>

                    {/* ── DESKTOP NAV ── */}
                    <ul className="nb__links">

                        <li>
                            <a href="/about" className="nb__link">About Us</a>
                        </li>

                        {/* ── INDUSTRIAL SEGMENTS dropdown ── */}
                        <li
                            className="nb__dropdown-wrap"
                            onMouseEnter={openSegments}
                            onMouseLeave={closeSegments}
                        >
                            <button
                                className={`nb__link nb__link--btn ${segmentsOpen ? 'nb__link--active' : ''}`}
                                aria-haspopup="true"
                                aria-expanded={segmentsOpen}
                            >
                                Industrial Segments
                                {segmentsOpen
                                    ? <MdKeyboardArrowUp className="nb__arrow" />
                                    : <MdKeyboardArrowDown className="nb__arrow" />}
                            </button>

                            <div
                                className={`nb__mega nb__mega--segments ${segmentsOpen ? 'nb__mega--open' : ''}`}
                                onMouseEnter={openSegments}
                                onMouseLeave={closeSegments}
                            >
                                <div className="nb__seg-inner">
                                    <div className="nb__seg-links">
                                        {INDUSTRIAL_SEGMENTS.map(s => (
                                            <a key={s.href} href={s.href} className="nb__seg-link">
                                                {s.label}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="nb__seg-images">
                                        <a href="/automotive" className="nb__seg-card">
                                            <img src="Automotive-15.jpg" alt="Automotive" loading="lazy" />
                                            <span>Automotive</span>
                                        </a>
                                        <a href="/marine" className="nb__seg-card">
                                            <img src="marine-1.png" alt="Marine" loading="lazy" />
                                            <span>Marine</span>
                                        </a>
                                        <a href="/contract" className="nb__seg-card">
                                            <img src="About_Banner.jpg" alt="Contract" loading="lazy" />
                                            <span>Contract</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>

                        {/* ── PRODUCT dropdown ── */}
                        <li
                            className="nb__dropdown-wrap"
                            onMouseEnter={openProduct}
                            onMouseLeave={closeProduct}
                        >
                            <button
                                className={`nb__link nb__link--btn ${productOpen ? 'nb__link--active' : ''}`}
                                aria-haspopup="true"
                                aria-expanded={productOpen}
                            >
                                <a href="/product" className="nb__link">Product</a>
                                {productOpen
                                    ? <MdKeyboardArrowUp className="nb__arrow" />
                                    : <MdKeyboardArrowDown className="nb__arrow" />}
                            </button>

                            <div
                                className={`nb__mega nb__mega--product ${productOpen ? 'nb__mega--open' : ''}`}
                                onMouseEnter={openProduct}
                                onMouseLeave={closeProduct}
                            >
                                <div className="nb__prod-inner">
                                    <p className="nb__prod-heading"><a href="/product">Product Collections</a></p>
                                    <div className="nb__prod-grid">
                                        {cols.map((col, ci) => (
                                            <ul key={ci} className="nb__prod-col">
                                                {col.map(item => (
                                                    <li key={item}>

                                                        <a href={item === 'All' ? '/product' : `/product?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="nb__prod-link"
                                                            onClick={e => handleCategoryNav(e, item)}
                                                        >
                                                            {item}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <a href="/Preformance" className="nb__link">Performance &amp; Features</a>
                        </li>

                        <li>
                            <a href="/sustainability" className="nb__link">Sustainability</a>
                        </li>

                    </ul>

                    {/* ── RIGHT: CTA + hamburger ── */}
                    <div className="nb__right">
                        <a href="/contact" className="nb__cta">Get in Touch</a>
                        <button
                            className={`nb__ham ${mobileOpen ? 'nb__ham--open' : ''}`}
                            onClick={() => setMobileOpen(p => !p)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>

                {/* ── MOBILE DRAWER ── */}
                <div className={`nb__drawer ${mobileOpen ? 'nb__drawer--open' : ''}`} aria-hidden={!mobileOpen}>

                    <div className="nb__drawer-head">
                        <a href="/" onClick={closeMobile} className="nb__drawer-logo" />
                        <button className="nb__drawer-close" onClick={closeMobile} aria-label="Close menu">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <nav className="nb__drawer-nav">

                        <a href="/about" className="nb__drawer-link" onClick={closeMobile}>About Us</a>

                        {/* Industrial Segments accordion */}
                        <div className="nb__drawer-acc">
                            <button
                                className={`nb__drawer-link nb__drawer-link--acc ${mobileSegmentsOpen ? 'nb__drawer-link--active' : ''}`}
                                onClick={() => setMobileSegmentsOpen(p => !p)}
                                aria-expanded={mobileSegmentsOpen}
                            >
                                <span>Industrial Segments</span>
                                {mobileSegmentsOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                            </button>
                            <ul className={`nb__drawer-sub ${mobileSegmentsOpen ? 'nb__drawer-sub--open' : ''}`}>
                                {INDUSTRIAL_SEGMENTS.map(s => (
                                    <li key={s.href}>
                                        <a href={s.href} onClick={closeMobile}>{s.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Product accordion */}
                        <div className="nb__drawer-acc">
                            <button
                                className={`nb__drawer-link nb__drawer-link--acc ${mobileProductOpen ? 'nb__drawer-link--active' : ''}`}
                                onClick={() => setMobileProductOpen(p => !p)}
                                aria-expanded={mobileProductOpen}
                            >
                                <span>Product</span>
                                {mobileProductOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                            </button>
                            <ul className={`nb__drawer-sub ${mobileProductOpen ? 'nb__drawer-sub--open' : ''}`}>
                                {PRODUCT_COLLECTIONS.map(item => (
                                    <li key={item}>

                                        <a href={item === 'All' ? '/product' : `/product?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                            onClick={e => handleCategoryNav(e, item)}
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <a href="/Preformance" className="nb__drawer-link" onClick={closeMobile}>Performance &amp; Features</a>
                        <a href="/sustainability" className="nb__drawer-link" onClick={closeMobile}>Sustainability</a>

                    </nav>

                    <div className="nb__drawer-foot">
                        <a href="/contact" className="nb__drawer-cta" onClick={closeMobile}>Get in Touch</a>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;