import { useState, useEffect, useRef } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdClose, MdAdd, MdRemove, MdDeleteOutline, MdShoppingBag } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Pages/Cartcontext/Cartcontext';
import './Navbar.css';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.futuratextiles.in';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '/no-image.png';
    const cleaned = imagePath.replace(/\\/g, '/');
    if (cleaned.startsWith('http')) return cleaned;
    return `${BASE_URL}/${cleaned}`;
};

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

/* ── Cart Drawer ── */
const CartDrawer = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems } = useCart();
    const navigate = useNavigate();

    const handleProductClick = (item) => {
        setIsCartOpen(false);
        navigate(`/product/${item.productId}`);
    };

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <div
                    className="cart-backdrop"
                    onClick={() => setIsCartOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`} aria-hidden={!isCartOpen}>
                {/* Header */}
                <div className="cart-drawer__head">
                    <div className="cart-drawer__title">
                        <MdShoppingBag size={20} />
                        <span>Cart</span>
                        {totalItems > 0 && <span className="cart-drawer__count">{totalItems}</span>}
                    </div>
                    <button
                        className="cart-drawer__close"
                        onClick={() => setIsCartOpen(false)}
                        aria-label="Close cart"
                    >
                        <MdClose size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="cart-drawer__body">
                    {cartItems.length === 0 ? (
                        <div className="cart-drawer__empty">
                            <div className="cart-drawer__empty-icon">
                                <MdShoppingBag size={48} />
                            </div>
                            <p className="cart-drawer__empty-title">Your cart is empty</p>
                            <p className="cart-drawer__empty-sub">Add products to get started</p>
                            <button
                                className="cart-drawer__browse-btn"
                                onClick={() => { setIsCartOpen(false); navigate('/product'); }}
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <ul className="cart-drawer__list">
                            {cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                    {/* Image */}
                                    <div
                                        className="cart-item__img-wrap"
                                        onClick={() => handleProductClick(item)}
                                        title="View product"
                                    >
                                        {item.image ? (
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.title}
                                                className="cart-item__img"
                                                onError={(e) => { e.target.src = '/no-image.png'; }}
                                            />
                                        ) : (
                                            <div className="cart-item__img-placeholder">📦</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="cart-item__info">
                                        <p
                                            className="cart-item__title"
                                            onClick={() => handleProductClick(item)}
                                        >
                                            {item.title}
                                        </p>
                                        {item.variantName && (
                                            <p className="cart-item__variant">{item.variantName}</p>
                                        )}

                                        {/* Qty controls */}
                                        <div className="cart-item__controls">
                                            <div className="cart-item__qty">
                                                <button
                                                    className="cart-item__qty-btn"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <MdRemove size={14} />
                                                </button>
                                                <span className="cart-item__qty-num">{item.quantity}</span>
                                                <button
                                                    className="cart-item__qty-btn"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    <MdAdd size={14} />
                                                </button>
                                            </div>

                                            <button
                                                className="cart-item__remove"
                                                onClick={() => removeFromCart(item.id)}
                                                aria-label="Remove item"
                                            >
                                                <MdDeleteOutline size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="cart-drawer__foot">
                        <button
                            className="cart-drawer__enquire-btn"
                            onClick={() => { setIsCartOpen(false); navigate('/contact'); }}
                        >
                            Enquire Now
                        </button>
                        <p className="cart-drawer__foot-note">
                            Our team will contact you shortly
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

/* ── Navbar ── */
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

    const { totalItems, setIsCartOpen, isCartOpen } = useCart();

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
        document.body.style.overflow = (mobileOpen || isCartOpen) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen, isCartOpen]);

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
                        <img src="/Futura-Logo-Final.png" alt="Futura" />
                    </a>

                    {/* ── DESKTOP NAV ── */}
                    <ul className="nb__links">
                        <li>
                            <a href="/about" className="nb__link">About Us</a>
                        </li>

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

                        {/* ── PRODUCT ── */}
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
                                                        <a
                                                            href={item === 'All' ? '/product' : `/product?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
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

                    {/* ── RIGHT: CTA + Cart + Hamburger ── */}
                    <div className="nb__right">
                        <a href="/contact" className="nb__cta">Get in Touch</a>

                        {/* Cart Icon Button */}
                        <button
                            className={`nb__cart-btn ${totalItems > 0 ? 'nb__cart-btn--has-items' : ''}`}
                            onClick={() => setIsCartOpen(true)}
                            aria-label={`Open cart, ${totalItems} items`}
                        >
                            <MdShoppingBag size={20} />
                            {totalItems > 0 && (
                                <span className="nb__cart-badge" key={totalItems}>
                                    {totalItems > 99 ? '99+' : totalItems}
                                </span>
                            )}
                        </button>

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
                        <div className="nb__drawer-head-right">
                            {/* Mobile cart icon */}
                            <button
                                className={`nb__cart-btn nb__cart-btn--mobile ${totalItems > 0 ? 'nb__cart-btn--has-items' : ''}`}
                                onClick={() => { closeMobile(); setIsCartOpen(true); }}
                                aria-label="Open cart"
                            >
                                <MdShoppingBag size={18} />
                                {totalItems > 0 && (
                                    <span className="nb__cart-badge">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                            </button>
                            <button className="nb__drawer-close" onClick={closeMobile} aria-label="Close menu">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <nav className="nb__drawer-nav">
                        <a href="/about" className="nb__drawer-link" onClick={closeMobile}>About Us</a>

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
                                        <a
                                            href={item === 'All' ? '/product' : `/product?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
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

            {/* Cart Drawer (outside nav, renders at root level via portal-like placement) */}
            <CartDrawer />
        </>
    );
};

export default Navbar;