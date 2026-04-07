import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, X, Settings, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { GoPlus } from 'react-icons/go';
import { FiMinus } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import "./Product.css";

const API_URL = import.meta.env.VITE_API_URL || 'https://api.futuratextiles.in/api/products';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.futuratextiles.in';

const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    const cleaned = imagePath.replace(/\\/g, '/');
    return cleaned.startsWith('http') ? cleaned : `${BASE_URL}/${cleaned}`;
};

const CATEGORY_HIERARCHY = {
    'After Market Automotive': ['MARINE REVOLUTION', 'AUTO REVOLUTION', 'RUNABOUT', 'XTREME'],
    'Marine': ['APOLLO', 'AMERICANA', 'MATRIX', 'RUNABOUT', 'XTREME'],
    'Contract Furnishing': ['APOLLO', 'AMERICANA', 'MATRIX'],
    'Trucking': ['AUTO REVOLUTION', 'MARINE REVOLUTION'],
    'HealthCare': ['APOLLO', 'AMERICANA', 'MATRIX'],
    'Offroading': []
};

const DEFAULT_FILTERS = {
    color: [
        { value: 'beige', label: 'Beige', count: 0 }, { value: 'black', label: 'Black', count: 0 },
        { value: 'blue', label: 'Blue', count: 0 }, { value: 'brown', label: 'Brown', count: 0 },
        { value: 'grey', label: 'Grey', count: 0 }, { value: 'green', label: 'Green', count: 0 },
        { value: 'orange', label: 'Orange', count: 0 }, { value: 'pink', label: 'Pink', count: 0 },
        { value: 'purple', label: 'Purple', count: 0 }, { value: 'red', label: 'Red', count: 0 },
        { value: 'silver', label: 'Silver', count: 0 }, { value: 'white', label: 'White', count: 0 }
    ],
    performance: [
        { value: 'high-performance', label: 'High Performance', count: 0 },
        { value: 'medium-performance', label: 'Medium Performance', count: 0 },
        { value: 'standard', label: 'Standard', count: 0 },
        { value: 'premium', label: 'Premium', count: 0 },
        { value: 'eco-friendly', label: 'Eco-Friendly', count: 0 }
    ],
    features: [
        { value: 'waterproof', label: 'Waterproof', count: 0 }, { value: 'durable', label: 'Durable', count: 0 },
        { value: 'lightweight', label: 'Lightweight', count: 0 }, { value: 'scratch-resistant', label: 'Scratch Resistant', count: 0 },
        { value: 'easy-to-clean', label: 'Easy to Clean', count: 0 }, { value: 'uv-resistant', label: 'UV Resistant', count: 0 }
    ]
};

const TruncatedText = ({ text, maxLength = 100 }) => {
    const [expanded, setExpanded] = useState(false);
    if (!text) return null;
    if (text.length <= maxLength) return <p>{text}</p>;
    return (
        <p>
            {expanded ? text : `${text.substring(0, maxLength)}...`}
            <span onClick={() => setExpanded(!expanded)}
                style={{ color: '#007bff', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}>
                {expanded ? ' Read less' : ' Read more'}
            </span>
        </p>
    );
};

const SLIDES = [
    { id: 1, image: "/Product-Banner-1.png", title: "Americana", subtitle: "Explore the ocean in style", link: "/products/americana" },
    { id: 2, image: "/Product-Banner-2.png", title: "Apollo", subtitle: "4 WAY STRETCH 360", link: "/products/apollo" },
    { id: 3, image: "/Product-Banner-3.png", title: "Automotive", subtitle: "Contemporary living spaces", link: "/products/automotive" },
    { id: 4, image: "/Runabout.png", title: "Runabout", subtitle: "Nature's paradise", link: "/products/runabout" },
    { id: 5, image: "/XTREME.png", title: "Xtreme", subtitle: "City living redefined", link: "/products/xtreme" }
];

const AUTOPLAY_MS = 4500;

/* ══════════════════════════════════════════════════
   THREE-PANEL CENTER-FOCUS SLIDER
══════════════════════════════════════════════════ */
const ThreePanelSlider = () => {
    const N = SLIDES.length;
    const mod = (n) => ((n % N) + N) % N;
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [direction, setDirection] = useState('next');
    const animRef = useRef(false);
    const autoRef = useRef(null);
    const progressRef = useRef(null);
    const progressStartRef = useRef(null);

    const stopProgress = () => { cancelAnimationFrame(progressRef.current); clearTimeout(autoRef.current); };
    const startProgress = useCallback(() => {
        stopProgress(); setProgress(0); progressStartRef.current = performance.now();
        const tick = () => {
            const elapsed = performance.now() - progressStartRef.current;
            const pct = Math.min((elapsed / AUTOPLAY_MS) * 100, 100);
            setProgress(pct);
            if (pct < 100) { progressRef.current = requestAnimationFrame(tick); }
            else { autoRef.current = setTimeout(() => goTo('next'), 80); }
        };
        progressRef.current = requestAnimationFrame(tick);
    }, []);

    const goTo = useCallback((dir) => {
        if (animRef.current) return;
        animRef.current = true; setAnimating(true); setDirection(dir);
        setCurrent(prev => dir === 'next' ? mod(prev + 1) : mod(prev - 1));
        setTimeout(() => { animRef.current = false; setAnimating(false); }, 680);
    }, []);

    const goToIndex = useCallback((idx, dir = 'next') => {
        if (animRef.current) return;
        animRef.current = true; setAnimating(true); setDirection(dir); setCurrent(idx);
        setTimeout(() => { animRef.current = false; setAnimating(false); }, 680);
    }, []);

    useEffect(() => { if (!animating) startProgress(); return stopProgress; }, [current, animating]);

    const getPos = (idx) => { let diff = ((idx - current) % N + N) % N; if (diff > N / 2) diff -= N; return diff; };
    const getCardClass = (idx) => {
        const d = getPos(idx);
        if (d === 0) return 'lcs-card lcs-center';
        if (d === -1) return 'lcs-card lcs-left';
        if (d === 1) return 'lcs-card lcs-right';
        return 'lcs-card lcs-hidden';
    };

    const handlePrev = () => { stopProgress(); goTo('prev'); };
    const handleNext = () => { stopProgress(); goTo('next'); };

    return (
        <section className="lcs-root">
            <div className="lcs-stage">
                {SLIDES.map((slide, i) => {
                    const pos = getPos(i);
                    return (
                        <div key={slide.id} className={getCardClass(i)}
                            onClick={() => { if (pos === -1) { stopProgress(); goTo('prev'); } else if (pos === 1) { stopProgress(); goTo('next'); } }}>
                            <img src={slide.image} alt={slide.title} className="lcs-img" draggable={false} />
                            {pos === 0 && (
                                <div className="lcs-overlay">
                                    <div className="lcs-copy">
                                        <Link to={slide.link || '#'} className="lcs-title">{slide.title}</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button className="lcs-btn lcs-btn-prev" onClick={handlePrev} disabled={animating} aria-label="Previous"><ChevronLeft size={22} /></button>
            <button className="lcs-btn lcs-btn-next" onClick={handleNext} disabled={animating} aria-label="Next"><ChevronRight size={22} /></button>
        </section>
    );
};

const CategoryPriorityModal = ({ categories, priorityOrder, onSave, onClose }) => {
    const [localOrder, setLocalOrder] = useState(() => {
        const rest = categories.filter(c => !priorityOrder.includes(c));
        return [...priorityOrder, ...rest];
    });
    const [dragIdx, setDragIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);

    const moveUp = (idx) => {
        if (idx === 0) return;
        setLocalOrder(prev => {
            const next = [...prev];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            return next;
        });
    };

    const moveDown = (idx) => {
        if (idx === localOrder.length - 1) return;
        setLocalOrder(prev => {
            const next = [...prev];
            [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
            return next;
        });
    };

    const handleDragStart = (idx) => setDragIdx(idx);
    const handleDragOver = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
    const handleDrop = (idx) => {
        if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
        setLocalOrder(prev => {
            const next = [...prev];
            const [moved] = next.splice(dragIdx, 1);
            next.splice(idx, 0, moved);
            return next;
        });
        setDragIdx(null); setDragOverIdx(null);
    };

    const resetOrder = () => setLocalOrder([...categories].sort());

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
            <div style={{
                background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
            }}>
                <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ color: '#fff', margin: 0, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                            Category Display Order
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0 0', fontSize: '0.78rem' }}>
                            Drag or use arrows to set priority • #1 shows first
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1rem' }}>
                    {localOrder.map((cat, idx) => (
                        <div
                            key={cat}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={() => handleDrop(idx)}
                            onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: dragOverIdx === idx ? '#f0f4ff' : dragIdx === idx ? '#e8f0ff' : '#f8f9fa',
                                border: dragOverIdx === idx ? '2px dashed #4f6ef7' : '2px solid transparent',
                                borderRadius: '10px', padding: '10px 12px', marginBottom: '8px',
                                cursor: 'grab', transition: 'all 0.15s ease',
                                boxShadow: dragIdx === idx ? '0 4px 12px rgba(79,110,247,0.25)' : '0 1px 3px rgba(0,0,0,0.06)'
                            }}
                        >
                            <div style={{
                                minWidth: '28px', height: '28px', borderRadius: '50%',
                                background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7c2f' : '#e2e8f0',
                                color: idx < 3 ? '#fff' : '#64748b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.72rem', fontWeight: 700
                            }}>
                                {idx + 1}
                            </div>
                            <GripVertical size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{cat}</span>
                            <span style={{
                                fontSize: '0.72rem', color: '#64748b', background: '#e2e8f0',
                                borderRadius: '12px', padding: '2px 8px', marginRight: '4px'
                            }}>
                                {idx + 1}{idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <button onClick={() => moveUp(idx)} disabled={idx === 0} style={{
                                    border: 'none', background: idx === 0 ? '#f1f5f9' : '#e0e7ff', borderRadius: '4px',
                                    padding: '2px 5px', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? '#cbd5e1' : '#4f6ef7',
                                    display: 'flex', lineHeight: 1
                                }}>
                                    <ArrowUp size={13} />
                                </button>
                                <button onClick={() => moveDown(idx)} disabled={idx === localOrder.length - 1} style={{
                                    border: 'none', background: idx === localOrder.length - 1 ? '#f1f5f9' : '#e0e7ff', borderRadius: '4px',
                                    padding: '2px 5px', cursor: idx === localOrder.length - 1 ? 'not-allowed' : 'pointer',
                                    color: idx === localOrder.length - 1 ? '#cbd5e1' : '#4f6ef7', display: 'flex', lineHeight: 1
                                }}>
                                    <ArrowDown size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px', justifyContent: 'flex-end', background: '#fafafa' }}>
                    <button onClick={resetOrder} style={{
                        padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
                        background: '#fff', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                    }}>
                        Reset Order
                    </button>
                    <button onClick={onClose} style={{
                        padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
                        background: '#fff', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                    }}>
                        Cancel
                    </button>
                    <button onClick={() => { onSave(localOrder); onClose(); }} style={{
                        padding: '8px 20px', border: 'none', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)',
                        color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(79,110,247,0.4)'
                    }}>
                        Apply Order
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PRODUCT PAGE
══════════════════════════════════════════════════════════════ */
const Product = () => {
    // ✅ NEW: Read URL query params (e.g. ?category=americana from navbar click)
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        parentCategory: null,
        category: [],
        color: [],
        performance: [],
        features: []
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expanded, setExpanded] = useState({ category: true, color: false, performance: false, features: false });
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dynFilters, setDynFilters] = useState({
        category: [], color: DEFAULT_FILTERS.color, performance: DEFAULT_FILTERS.performance, features: DEFAULT_FILTERS.features
    });

    // ── Category Priority State ──
    const [categoryPriorityOrder, setCategoryPriorityOrder] = useState([]);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => { fetchProducts(); }, []);

    // ✅ NEW: When URL ?category param changes, apply it as a filter
    // This runs after products are loaded OR when the URL changes
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedFilters(prev => ({
                ...prev,
                parentCategory: null,
                category: [categoryParam]   // e.g. ['americana'] or ['auto-revolution']
            }));
            // Scroll to product grid smoothly
            setTimeout(() => {
                const grid = document.querySelector('.products-content');
                if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        } else {
            // No category param → clear category filter
            setSelectedFilters(prev => ({ ...prev, parentCategory: null, category: [] }));
        }
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true); setError(null);
            const r = await fetch(API_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
            if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
            const data = await r.json();
            setAllProducts(data);
            buildDynFilters(data);

            const cats = [...new Set(data.map(p => p.category || 'Uncategorized'))].sort();
            setAllCategories(cats);
            setCategoryPriorityOrder(cats);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    const buildDynFilters = (products) => {
        const o = {
            category: new Map(),
            color: new Map(DEFAULT_FILTERS.color.map(c => [c.value, { ...c, count: 0 }])),
            performance: new Map(DEFAULT_FILTERS.performance.map(p => [p.value, { ...p, count: 0 }])),
            features: new Map(DEFAULT_FILTERS.features.map(f => [f.value, { ...f, count: 0 }])),
        };
        products.forEach(p => {
            const cat = p.category || 'Uncategorized';
            const cv = cat.toLowerCase().replace(/\s+/g, '-');
            o.category.set(cv, { value: cv, label: cat, count: (o.category.get(cv)?.count || 0) + 1 });
            if (p.color) {
                const cols = Array.isArray(p.color) ? p.color : p.color.split(',').map(c => c.trim());
                cols.forEach(c => { if (!c) return; const v = c.toLowerCase().replace(/\s+/g, '-'); const e = o.color.get(v); e ? e.count++ : o.color.set(v, { value: v, label: c, count: 1 }); });
            }
            if (p.performance) { const v = p.performance.toLowerCase().replace(/\s+/g, '-'); const e = o.performance.get(v); e ? e.count++ : o.performance.set(v, { value: v, label: p.performance, count: 1 }); }
            if (p.features) {
                const fa = Array.isArray(p.features) ? p.features : [p.features];
                fa.forEach(f => { const v = f.toLowerCase().replace(/\s+/g, '-'); const e = o.features.get(v); e ? e.count++ : o.features.set(v, { value: v, label: f, count: 1 }); });
            }
        });
        const srt = map => Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
        setDynFilters({ category: srt(o.category), color: srt(o.color), performance: srt(o.performance), features: srt(o.features) });
    };

    const toggle = (s) => setExpanded(p => ({ ...p, [s]: !p[s] }));
    const handleParent = (cat) => setSelectedFilters(p => ({ ...p, parentCategory: p.parentCategory === cat ? null : cat, category: [] }));

    // ✅ UPDATED: When user manually changes category filter, also update URL param
    const handleFilter = (type, val) => {
        setSelectedFilters(prev => {
            const cur = type === 'category' ? prev.category : prev[type];
            const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
            const updated = type === 'category' ? { ...prev, category: next } : { ...prev, [type]: next };

            // Sync URL when category filter changes
            if (type === 'category') {
                if (next.length === 1) {
                    setSearchParams({ category: next[0] }, { replace: true });
                } else {
                    setSearchParams({}, { replace: true });
                }
            }
            return updated;
        });
    };

    // ✅ UPDATED: clearAll also clears URL params
    const clearAll = () => {
        setSelectedFilters({ parentCategory: null, category: [], color: [], performance: [], features: [] });
        setSearchTerm('');
        setSearchParams({}, { replace: true });
    };

    /* ── Filter products ── */
    const filtered = allProducts.filter(p => {
        const s = searchTerm.toLowerCase();
        const ms = !searchTerm || p.title?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s);
        const pc = (p.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-');
        const po = p.category || 'Uncategorized';
        let mc = true;
        if (selectedFilters.parentCategory) {
            const al = CATEGORY_HIERARCHY[selectedFilters.parentCategory] || [];
            const an = al.map(c => c.toLowerCase().replace(/\s+/g, '-'));
            mc = selectedFilters.category.length > 0
                ? selectedFilters.category.includes(pc)
                : an.includes(pc) || al.includes(po);
        } else if (selectedFilters.category.length > 0) {
            mc = selectedFilters.category.includes(pc);
        }
        const cols = Array.isArray(p.color)
            ? p.color.map(c => c.toLowerCase().replace(/\s+/g, '-'))
            : (p.color ? p.color.split(',').map(c => c.trim().toLowerCase().replace(/\s+/g, '-')) : []);
        const mc2 = selectedFilters.color.length === 0 || selectedFilters.color.some(sc => cols.includes(sc));
        const mp = selectedFilters.performance.length === 0 || selectedFilters.performance.includes((p.performance || '').toLowerCase().replace(/\s+/g, '-'));
        const fa = Array.isArray(p.features) ? p.features.map(f => f.toLowerCase().replace(/\s+/g, '-')) : (p.features ? [p.features.toLowerCase().replace(/\s+/g, '-')] : []);
        const mf = selectedFilters.features.length === 0 || selectedFilters.features.some(sf => fa.includes(sf));
        return ms && mc && mc2 && mp && mf;
    });

    const sortedFiltered = [...filtered].sort((a, b) => {
        const catA = a.category || 'Uncategorized';
        const catB = b.category || 'Uncategorized';
        const idxA = categoryPriorityOrder.indexOf(catA);
        const idxB = categoryPriorityOrder.indexOf(catB);
        const rankA = idxA === -1 ? 9999 : idxA;
        const rankB = idxB === -1 ? 9999 : idxB;
        return rankA - rankB;
    });

    const activeCount = () => {
        let n = selectedFilters.category.length + selectedFilters.color.length + selectedFilters.performance.length + selectedFilters.features.length;
        if (selectedFilters.parentCategory) n++;
        return n;
    };

    // ✅ NEW: Active category label for display (e.g. "Showing: Americana")
    const activeCategoryLabel = () => {
        if (selectedFilters.category.length === 1) {
            const slug = selectedFilters.category[0];
            const match = dynFilters.category.find(c => c.value === slug);
            return match ? match.label : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
        return null;
    };

    const swatch = (name) => {
        const m = { 'beige': '#F5F5DC', 'black': '#000000', 'blue': '#0066CC', 'brown': '#8B4513', 'cool neutrals': 'linear-gradient(135deg,#B8B8B8,#D3D3D3)', 'green': '#2E8B57', 'grey': '#808080', 'metallic': 'linear-gradient(135deg,#C0C0C0,#E8E8E8 50%,#C0C0C0)', 'multi color': 'linear-gradient(135deg,#FF0000,#FF7F00 14%,#FFFF00 28%,#00FF00 42%,#0000FF 57%,#4B0082 71%,#9400D3 85%,#FF0000)', 'orange': '#FF8C00', 'pink': '#FF69B4', 'purple': '#9370DB', 'red': '#DC143C', 'silver': '#C0C0C0', 'teal': '#008B8B', 'warm neutrals': 'linear-gradient(135deg,#D2B48C,#F5DEB3)', 'white': '#FFFFFF', 'yellow': '#FFD700' };
        return m[name.toLowerCase().trim()] || '#CCCCCC';
    };

    const subCount = (_, sub) => allProducts.filter(p =>
        (p.category || '').toLowerCase().replace(/\s+/g, '-') === sub.toLowerCase().replace(/\s+/g, '-') || p.category === sub
    ).length;

    return (
        <div className="product-wrapper">
            <ThreePanelSlider />
            <div className="Product-Container">
                <div className="Product-Container-title">
                    <span>Our Collections</span>

                    {/* ✅ NEW: Show active category breadcrumb from navbar click */}
                    {activeCategoryLabel() && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '0.9rem', color: '#555', marginTop: '6px'
                        }}>
                            <span style={{ color: '#999' }}>Showing:</span>
                            <span style={{
                                background: '#1a1a2e', color: '#fff',
                                padding: '3px 12px', borderRadius: '20px',
                                fontSize: '0.82rem', fontWeight: 600
                            }}>
                                {activeCategoryLabel()}
                            </span>
                            <button
                                onClick={clearAll}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#e74c3c', fontSize: '0.8rem', fontWeight: 600,
                                    padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '3px'
                                }}
                            >
                                <X size={13} /> Clear
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '8px', margin: '1rem 0', textAlign: 'center' }}>
                        ❌ Error: {error}
                        <button onClick={fetchProducts} style={{ marginLeft: '10px', padding: '5px 10px', background: '#c33', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Retry</button>
                    </div>
                )}

                {allCategories.length > 0 && (
                    <button
                        onClick={() => setShowPriorityModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', border: 'none', borderRadius: '8px',
                            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                            color: '#fff', fontSize: '0.82rem', fontWeight: 600,
                            cursor: 'pointer', letterSpacing: '0.03em',
                            boxShadow: '0 4px 14px #00000040'
                        }}
                    >
                        <Settings size={15} />
                        Set Category Order
                    </button>
                )}

                <button className="mobile-filter-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                    <Filter size={20} /> Filters {activeCount() > 0 && `(${activeCount()})`}
                </button>

                <div className="products-layout">
                    {/* ── Sidebar ── */}
                    <div className={`filter-sidebar${mobileOpen ? ' mobile-open' : ''}`}>
                        <div className="mobile-filter-header">
                            <h3>Filters</h3>
                            <button className="close-mobile-filter" onClick={() => setMobileOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="filter-section">
                            <h4>Search</h4>
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={20} />
                                <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input" />
                            </div>
                        </div>

                        {activeCount() > 0 && (
                            <div className="filter-section">
                                <button className="clear-all-btn" onClick={clearAll}>Clear All Filters ({activeCount()})</button>
                            </div>
                        )}

                        <div className="filter-section">
                            <div className="filter-header" onClick={() => toggle('category')}>
                                <h4>Industrial Segments</h4>
                                {expanded.category ? <FiMinus size={20} /> : <GoPlus size={20} />}
                            </div>
                            <div className={`filter-dropdown${expanded.category ? ' expanded' : ''}`}>
                                <div className="filter-options">
                                    {Object.keys(CATEGORY_HIERARCHY).map(par => {
                                        const subs = CATEGORY_HIERARCHY[par];
                                        const isA = selectedFilters.parentCategory === par;
                                        return (
                                            <div key={par} className="parent-category-wrapper">
                                                <div className={`parent-category-item${isA ? ' active' : ''}`} onClick={() => handleParent(par)}>
                                                    <span className="parent-category-label">{par}</span>
                                                    <ChevronRight size={18} className={`parent-category-arrow${isA ? ' rotated' : ''}`} />
                                                </div>
                                                {isA && subs.length > 0 && (
                                                    <div className="sub-category-options">
                                                        {subs.map(sub => {
                                                            const sv = sub.toLowerCase().replace(/\s+/g, '-');
                                                            return (
                                                                <label key={sv} className="filter-checkbox subcategory-checkbox">
                                                                    <input type="checkbox" value={sv} checked={selectedFilters.category.includes(sv)} onChange={() => handleFilter('category', sv)} />
                                                                    <span className="Product-checkmark" />
                                                                    <span className="filter-label">{sub} ({subCount(par, sub)})</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="filter-section">
                            <div className="filter-header" onClick={() => toggle('color')}>
                                <h4>Color</h4>
                                {expanded.color ? <FiMinus size={20} /> : <GoPlus size={20} />}
                            </div>
                            <div className={`filter-dropdown${expanded.color ? ' expanded' : ''}`}>
                                <div className="filter-options">
                                    {dynFilters.color.map(opt => (
                                        <label key={opt.value} className="filter-checkbox color-filter-checkbox">
                                            <input type="checkbox" value={opt.value} checked={selectedFilters.color.includes(opt.value)} onChange={() => handleFilter('color', opt.value)} />
                                            <span className="Product-checkmark" />
                                            <span className="Product-color-swatch" style={{ background: swatch(opt.label), border: opt.label.toLowerCase() === 'white' ? '1px solid #ccc' : '1px solid #0000001a' }} />
                                            <span className="filter-label">{opt.label} ({opt.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="filter-section">
                            <div className="filter-header" onClick={() => toggle('performance')}>
                                <h4>Performance</h4>
                                {expanded.performance ? <FiMinus size={20} /> : <GoPlus size={20} />}
                            </div>
                            <div className={`filter-dropdown${expanded.performance ? ' expanded' : ''}`}>
                                <div className="filter-options">
                                    {dynFilters.performance.map(opt => (
                                        <label key={opt.value} className="filter-checkbox">
                                            <input type="checkbox" value={opt.value} checked={selectedFilters.performance.includes(opt.value)} onChange={() => handleFilter('performance', opt.value)} />
                                            <span className="Product-checkmark" />
                                            <span className="filter-label">{opt.label} ({opt.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="filter-section">
                            <div className="filter-header" onClick={() => toggle('features')}>
                                <h4>Features</h4>
                                {expanded.features ? <FiMinus size={20} /> : <GoPlus size={20} />}
                            </div>
                            <div className={`filter-dropdown${expanded.features ? ' expanded' : ''}`}>
                                <div className="filter-options">
                                    {dynFilters.features.map(opt => (
                                        <label key={opt.value} className="filter-checkbox">
                                            <input type="checkbox" value={opt.value} checked={selectedFilters.features.includes(opt.value)} onChange={() => handleFilter('features', opt.value)} />
                                            <span className="Product-checkmark" />
                                            <span className="filter-label">{opt.label} ({opt.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="filter-section">
                            <div className="results-count">Showing {sortedFiltered.length} of {allProducts.length} products</div>
                        </div>
                    </div>

                    {mobileOpen && <div className="mobile-filter-overlay" onClick={() => setMobileOpen(false)} />}

                    {/* ── Products Grid ── */}
                    <div className="products-content">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>Loading products...</div>
                        ) : sortedFiltered.length === 0 ? (
                            <div className="no-projects">
                                <p>No products found matching your criteria.</p>
                                <button className="clear-filters-btn" onClick={clearAll}>Clear All Filters</button>
                            </div>
                        ) : (
                            <div className="projects-grid-new">
                                {sortedFiltered.map(product => (
                                    <div key={product._id} className="Projects-Box-new">
                                        <div className="project-image-wrapper">
                                            <Link to={`/ProductDetail/${product._id}`} className="project-image-link">
                                                <img
                                                    src={product.image?.length > 0 ? getImageUrl(product.image[0]) : "https://via.placeholder.com/400x300?text=No+Image"}
                                                    alt={product.title || 'Product'}
                                                    className="project-image"
                                                    onError={e => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                                                />
                                                <div className="project-overlay" />
                                            </Link>
                                        </div>
                                        <div className="project-content">
                                            <div className="Projects-Box-main-heading">
                                                <Link to={`/ProductDetail/${product._id}`} className="project-title-link">
                                                    {product.title || 'Untitled Product'}
                                                </Link>
                                                <div className="Projects-Box-svg">
                                                    {product.icons?.length > 0 ? (
                                                        <div className="product-icons-display">
                                                            {product.icons.map((icon, i) => (
                                                                <img key={i} src={getImageUrl(icon)} alt={`Icon ${i + 1}`} className="products-icon-item"
                                                                    style={{ width: '45px', height: '80px', objectFit: 'contain', marginLeft: '5px' }}
                                                                    onError={e => { e.target.style.display = 'none'; }} />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <img src="/iconPvc-6.svg" alt="Default icon" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="Projects-Box-main-des">
                                                <TruncatedText text={product.description || 'No description available'} maxLength={100} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Category Priority Modal ── */}
            {showPriorityModal && (
                <CategoryPriorityModal
                    categories={allCategories}
                    priorityOrder={categoryPriorityOrder}
                    onSave={(newOrder) => setCategoryPriorityOrder(newOrder)}
                    onClose={() => setShowPriorityModal(false)}
                />
            )}
        </div>
    );
};

export default Product;