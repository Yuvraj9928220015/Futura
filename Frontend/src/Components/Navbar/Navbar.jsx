import { useState, useEffect, useRef } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const PRODUCT_TABS = [
    {
        label: 'Product Collections',
        collections: [
            'Americana', 'Apollo', 'Sauve', 'Offroad',
            'Poseidon', 'Runabout', 'Matrix', 'Xtreme',
            'Auto Revolution', 'Marine Revolution', 'Fuerte',
        ],
    },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavHovered, setIsNavHovered] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
    const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
    const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false);
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [activeProductTab, setActiveProductTab] = useState(0);

    const navigate = useNavigate();

    const collectionsRef = useRef(null);
    const productRef = useRef(null);
    const collectionsTimeoutRef = useRef(null);
    const productTimeoutRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
                setIsMobileMenuOpen(false);
                setIsMobileCollectionsOpen(false);
                setIsMobileProductOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    // ── Collections hover handlers ──
    const handleCollectionsMouseEnter = () => {
        clearTimeout(collectionsTimeoutRef.current);
        setIsCollectionsDropdownOpen(true);
    };

    const handleCollectionsMouseLeave = () => {
        collectionsTimeoutRef.current = setTimeout(() => {
            setIsCollectionsDropdownOpen(false);
        }, 150);
    };

    // ── Product hover handlers ──
    const handleProductMouseEnter = () => {
        clearTimeout(productTimeoutRef.current);
        setIsProductDropdownOpen(true);
    };

    const handleProductMouseLeave = () => {
        productTimeoutRef.current = setTimeout(() => {
            setIsProductDropdownOpen(false);
        }, 150);
    };

    // ── Mobile handlers ──
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(prev => !prev);
        if (!isMobileMenuOpen) {
            setIsMobileCollectionsOpen(false);
            setIsMobileProductOpen(false);
        }
    };

    const handleMobileCollectionsToggle = (e) => {
        e.preventDefault();
        setIsMobileCollectionsOpen(prev => !prev);
    };

    const handleMobileProductToggle = (e) => {
        e.preventDefault();
        setIsMobileProductOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileCollectionsOpen(false);
        setIsMobileProductOpen(false);
    };

    // ── Category click handler ──
    // Navigate to /product with ?category=<slug> query param
    const handleCategoryClick = (e, item) => {
        e.preventDefault();
        const slug = item.toLowerCase().replace(/\s+/g, '-');
        setIsProductDropdownOpen(false);
        closeMobileMenu();
        navigate(`/product?category=${slug}`);
    };

    const splitIntoColumns = (arr, cols = 3) => {
        const perCol = Math.ceil(arr.length / cols);
        return Array.from({ length: cols }, (_, i) => arr.slice(i * perCol, i * perCol + perCol));
    };

    // Logo should show "hover" variant when: nav is hovered OR any dropdown is open
    const showHoverLogo = isNavHovered || isCollectionsDropdownOpen || isProductDropdownOpen;

    return (
        <>
            {/* Overlay for collections dropdown click-outside on desktop */}
            <div
                className={`dropdown-overlay ${isCollectionsDropdownOpen ? 'show' : ''}`}
                onClick={() => setIsCollectionsDropdownOpen(false)}
            />
            <div
                className={`mobile-overlay ${isMobileMenuOpen ? 'show' : ''}`}
                onClick={closeMobileMenu}
            />

            <nav
                className={`Navbar ${isScrolled ? 'scrolled' : ''}`}
                onMouseEnter={() => setIsNavHovered(true)}
                onMouseLeave={() => setIsNavHovered(false)}
            >
                <div className="Navbar_container">
                    <div className="Navbar_Section">

                        {/* ── Left Nav Links ── */}
                        <ul className="Navbar_list-left">

                            {/* INDUSTRIAL SEGMENTS — hover dropdown */}
                            <li
                                className="dropdown collections-dropdown-wrapper"
                                ref={collectionsRef}
                                onMouseEnter={handleCollectionsMouseEnter}
                                onMouseLeave={handleCollectionsMouseLeave}
                            >
                                <a
                                    href="#"
                                    className={`nav-link dropdown-toggle ${isCollectionsDropdownOpen ? 'active' : ''}`}
                                    aria-haspopup="true"
                                    aria-expanded={isCollectionsDropdownOpen}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    INDUSTRIAL SEGMENTS
                                    {isCollectionsDropdownOpen
                                        ? <MdKeyboardArrowUp className="arrow-icon" />
                                        : <MdKeyboardArrowDown className="arrow-icon" />
                                    }
                                </a>

                                {/* Collections Mega Dropdown */}
                                <div
                                    className={`mega-dropdown-menu ${isCollectionsDropdownOpen ? 'open' : ''}`}
                                    onMouseEnter={handleCollectionsMouseEnter}
                                    onMouseLeave={handleCollectionsMouseLeave}
                                >
                                    <div className="dropdown-content">
                                        <div className="dropdown-links">
                                            <ul>
                                                <li><a href="/automotive" className="nav-link">Automotive</a></li>
                                                <li><a href="/marine" className="nav-link">Marine</a></li>
                                                <li><a href="/contract" className="nav-link">Contract Furnishing</a></li>
                                            </ul>
                                        </div>
                                        <div className="dropdown-images">
                                            <a href="/automotive" className="image-card">
                                                <img src="Automotive-15.jpg" alt="Automotive Collection" loading="lazy" />
                                            </a>
                                            <a href="/marine" className="image-card">
                                                <img src="marine-1.png" alt="Marine Collection" loading="lazy" />
                                            </a>
                                            <a href="/contract" className="image-card">
                                                <img src="About_Banner.jpg" alt="Contract Collection" loading="lazy" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* PRODUCT — hover dropdown */}
                            <li
                                className="dropdown product-dropdown-wrapper"
                                ref={productRef}
                                onMouseEnter={handleProductMouseEnter}
                                onMouseLeave={handleProductMouseLeave}
                            >
                                <a
                                    href="/product"
                                    className={`nav-link dropdown-toggle ${isProductDropdownOpen ? 'active' : ''}`}
                                    aria-haspopup="true"
                                    aria-expanded={isProductDropdownOpen}
                                >
                                    PRODUCT
                                    {isProductDropdownOpen
                                        ? <MdKeyboardArrowUp className="arrow-icon" />
                                        : <MdKeyboardArrowDown className="arrow-icon" />
                                    }
                                </a>

                                {/* Product Mega Dropdown */}
                                <div
                                    className={`product-mega-menu ${isProductDropdownOpen ? 'open' : ''}`}
                                    onMouseEnter={handleProductMouseEnter}
                                    onMouseLeave={handleProductMouseLeave}
                                >
                                    {/* Tabs */}
                                    <div className="product-tabs">
                                        {PRODUCT_TABS.map((tab, i) => (
                                            <button
                                                key={tab.label}
                                                className={`product-tab-btn ${activeProductTab === i ? 'active' : ''}`}
                                                onMouseEnter={() => setActiveProductTab(i)}
                                                onClick={() => setActiveProductTab(i)}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab Content */}
                                    <div className="product-tab-content">
                                        {PRODUCT_TABS.map((tab, i) => {
                                            const columns = splitIntoColumns(tab.collections);
                                            return (
                                                <div
                                                    key={tab.label}
                                                    className={`product-tab-panel ${activeProductTab === i ? 'active' : ''}`}
                                                >
                                                    {columns.map((col, ci) => (
                                                        <ul key={ci} className="product-col-list">
                                                            {col.map((item) => (
                                                                <li key={item}>
                                                                    {/* ✅ onClick navigates to /product?category=slug */}
                                                                    <a
                                                                        href={`/product?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                                        className="product-item-link"
                                                                        onClick={(e) => handleCategoryClick(e, item)}
                                                                    >
                                                                        {item}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </li>

                            <li><a href="/sustainability" className="nav-link">SUSTAINABILITY</a></li>
                        </ul>

                        {/* ── Central Logo ── */}
                        <div className="Navbar_logo">
                            <a href="/" aria-label="Futura Home">
                                <img
                                    src="/Futura-logo.png"
                                    alt="Futura Logo"
                                    className={`logo-default ${(!isScrolled && !showHoverLogo) ? 'show' : 'hide'}`}
                                />
                                <img
                                    src="/Futura-logo.png"
                                    alt="Futura Logo"
                                    className={`logo-hover ${(isScrolled || showHoverLogo) ? 'show' : 'hide'}`}
                                />
                            </a>
                        </div>

                        {/* ── Right Nav Links ── */}
                        <ul className="Navbar_list-right">
                            <li><a href="/about" className="nav-link">ABOUT US</a></li>
                            <li><a href="/Preformance" className="nav-link">PERFORMANCE & FEATURES</a></li>
                            <li><a href="/news" className="nav-link">EVENTS & EXHIBITION</a></li>
                        </ul>

                        {/* ── Hamburger ── */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={handleMobileMenuToggle}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                <ul className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`} role="menu">

                    {/* Mobile: INDUSTRIAL SEGMENTS */}
                    <li className="dropdown-mobile" role="none">
                        <a
                            href="#"
                            className={`nav-link dropdown-toggle-mobile ${isMobileCollectionsOpen ? 'active' : ''}`}
                            onClick={handleMobileCollectionsToggle}
                            aria-haspopup="true"
                            aria-expanded={isMobileCollectionsOpen}
                            role="menuitem"
                        >
                            INDUSTRIAL SEGMENTS
                            {isMobileCollectionsOpen
                                ? <MdKeyboardArrowUp className="arrow-mobile-icon" />
                                : <MdKeyboardArrowDown className="arrow-mobile-icon" />
                            }
                        </a>
                        <ul className={`mobile-menu-dropdown ${isMobileCollectionsOpen ? 'show' : ''}`}>
                            <li><a href="/automotive" className="nav-link" onClick={closeMobileMenu}>Automotive Collection</a></li>
                            <li><a href="/marine" className="nav-link" onClick={closeMobileMenu}>Marine Collection</a></li>
                            <li><a href="/contract" className="nav-link" onClick={closeMobileMenu}>Contract Collection</a></li>
                        </ul>
                    </li>

                    {/* Mobile: PRODUCT */}
                    <li className="dropdown-mobile" role="none">
                        <a
                            href="#"
                            className={`nav-link dropdown-toggle-mobile ${isMobileProductOpen ? 'active' : ''}`}
                            onClick={handleMobileProductToggle}
                            aria-haspopup="true"
                            aria-expanded={isMobileProductOpen}
                            role="menuitem"
                        >
                            PRODUCT
                            {isMobileProductOpen
                                ? <MdKeyboardArrowUp className="arrow-mobile-icon" />
                                : <MdKeyboardArrowDown className="arrow-mobile-icon" />
                            }
                        </a>
                        <ul className={`mobile-menu-dropdown mobile-product-dropdown ${isMobileProductOpen ? 'show' : ''}`}>
                            {PRODUCT_TABS.map((tab) => (
                                <li key={tab.label} className="mobile-product-group">
                                    <span className="mobile-product-group-label">{tab.label}</span>
                                    <ul className="mobile-product-sublist">
                                        {tab.collections.map((item) => (
                                            <li key={item}>
                                                {/* ✅ Mobile: same category-filter navigation */}
                                                <a
                                                    href={`/product?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="nav-link"
                                                    onClick={(e) => handleCategoryClick(e, item)}
                                                >
                                                    {item}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li role="none"><a href="/sustainability" className="nav-link" onClick={closeMobileMenu} role="menuitem">SUSTAINABILITY</a></li>
                    <li role="none"><a href="/about" className="nav-link" onClick={closeMobileMenu} role="menuitem">ABOUT US</a></li>
                    <li role="none"><a href="/Preformance" className="nav-link" onClick={closeMobileMenu} role="menuitem">PERFORMANCE & FEATURES</a></li>
                    <li role="none"><a href="/news" className="nav-link" onClick={closeMobileMenu} role="menuitem">NEWS & EVENTS</a></li>
                </ul>
            </nav>
        </>
    );
};

export default Navbar;