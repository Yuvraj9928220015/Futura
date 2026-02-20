import { useState, useEffect, useRef } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
    const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false);

    const collectionsRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (collectionsRef.current && !collectionsRef.current.contains(event.target)) {
                setIsCollectionsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
                setIsMobileMenuOpen(false);
                setIsMobileCollectionsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(prev => !prev);
        if (!isMobileMenuOpen) {
            setIsMobileCollectionsOpen(false);
        }
    };

    const handleMobileCollectionsToggle = (e) => {
        e.preventDefault();
        setIsMobileCollectionsOpen(prev => !prev);
    };

    const handleCollectionsClick = (e) => {
        e.preventDefault();
        setIsCollectionsDropdownOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileCollectionsOpen(false);
    };

    return (
        <>
            {/* Overlay for desktop dropdown */}
            <div
                className={`dropdown-overlay ${isCollectionsDropdownOpen ? 'show' : ''}`}
                onClick={() => setIsCollectionsDropdownOpen(false)}
            />

            {/* Overlay for mobile menu */}
            <div
                className={`mobile-overlay ${isMobileMenuOpen ? 'show' : ''}`}
                onClick={closeMobileMenu}
            />

            <nav className={`Navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="Navbar_container">
                    <div className="Navbar_Section">

                        {/* Left Nav Links */}
                        <ul className="Navbar_list-left">
                            <li
                                className={`dropdown ${isCollectionsDropdownOpen ? 'active' : ''}`}
                                ref={collectionsRef}
                            >
                                <a
                                    href="#"
                                    className={`nav-link dropdown-toggle ${isCollectionsDropdownOpen ? 'active' : ''}`}
                                    onClick={handleCollectionsClick}
                                    aria-haspopup="true"
                                    aria-expanded={isCollectionsDropdownOpen}
                                >
                                    INDUSTRIAL SEGMENTS
                                    {isCollectionsDropdownOpen
                                        ? <MdKeyboardArrowUp className="arrow-icon" />
                                        : <MdKeyboardArrowDown className="arrow-icon" />
                                    }
                                </a>

                                {/* Mega Dropdown */}
                                <div className={`mega-dropdown-menu ${isCollectionsDropdownOpen ? 'open' : ''}`}>
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

                            <li><a href="/product" className="nav-link">PRODUCT</a></li>
                            <li><a href="/sustainability" className="nav-link">SUSTAINABILITY</a></li>
                        </ul>

                        {/* Central Logo */}
                        <div className="Navbar_logo">
                            <a href="/" aria-label="Futura Home">
                                <img
                                    src="/Futura-logo-white.png"
                                    alt="Futura Logo"
                                    className={`logo-normal ${isScrolled ? 'hide' : 'show'}`}
                                />
                                <img
                                    src="/Futura-logo.png"
                                    alt="Futura Logo"
                                    className={`logo-scrolled ${isScrolled ? 'show' : 'hide'}`}
                                />
                            </a>
                        </div>

                        {/* Right Nav Links */}
                        <ul className="Navbar_list-right">
                            <li><a href="/about" className="nav-link">ABOUT US</a></li>
                            <li><a href="/Preformance" className="nav-link">PERFORMANCE & FEATURES</a></li>
                            <li><a href="/news" className="nav-link">NEWS & EVENTS</a></li>
                        </ul>

                        {/* Hamburger Toggle */}
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

                {/* Mobile Menu */}
                <ul className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`} role="menu">

                    {/* Mobile: Industrial Segments */}
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

                    <li role="none"><a href="/product" className="nav-link" onClick={closeMobileMenu} role="menuitem">PRODUCT</a></li>
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