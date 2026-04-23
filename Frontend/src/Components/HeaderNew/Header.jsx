import { IoMdCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import "./Header.css";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next"; // ✅ make sure i18n is imported

export default function HeaderNew() {
    const { t } = useTranslation();
    const [activeModal, setActiveModal] = useState(null);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [country, setCountry] = useState({ name: 'UK', flag: '🇬🇧', code: 'gb' });
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const countrySelectRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const countries = [
        { name: 'US', flag: '🇺🇸', code: 'us' },
        { name: 'CA', flag: '🇨🇦', code: 'ca' },
        { name: 'UK', flag: '🇬🇧', code: 'gb' },
        { name: 'AU', flag: '🇦🇺', code: 'au' },
        { name: 'DE', flag: '🇩🇪', code: 'de' },
        { name: 'FR', flag: '🇫🇷', code: 'fr' },
        { name: 'ES', flag: '🇪🇸', code: 'es' },
        { name: 'IT', flag: '🇮🇹', code: 'it' },
        { name: 'JP', flag: '🇯🇵', code: 'jp' },
        { name: 'CN', flag: '🇨🇳', code: 'cn' },
    ];

    const countryToLang = {
        us: 'en', ca: 'en', gb: 'en', au: 'en',
        de: 'de', fr: 'fr', es: 'es', it: 'it', jp: 'ja', cn: 'zh',
    };

    useEffect(() => {
        const savedLang = localStorage.getItem('i18nextLng');
        if (savedLang) {
            const matchedCountry = Object.entries(countryToLang).find(([, lang]) => lang === savedLang);
            if (matchedCountry) {
                const found = countries.find(c => c.code === matchedCountry[0]);
                if (found) setCountry(found);
            }
        }
    }, []);

    const openModal = (modalType) => {
        setActiveModal(modalType);
        setShowCountryDropdown(false);
        setShowSearchInput(false);
    };

    const toggleCountryDropdown = (e) => {
        e.stopPropagation();

        if (!showCountryDropdown && countrySelectRef.current) {
            const rect = countrySelectRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 6,
                left: rect.left,
            });
        }

        setShowCountryDropdown(prev => !prev);
        setShowSearchInput(false);
    };

    const toggleSearchInput = (e) => {
        e.stopPropagation();
        setShowSearchInput(prev => !prev);
        setShowCountryDropdown(false);
        if (!showSearchInput) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
        }
    };

    const handleCountryChange = (selectedCountry, e) => {
        e.stopPropagation();
        setCountry(selectedCountry);
        setShowCountryDropdown(false);
        const lang = countryToLang[selectedCountry.code] || 'en';
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
    };

    // ✅ Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedTrigger = countrySelectRef.current?.contains(event.target);
            const clickedDropdown = dropdownRef.current?.contains(event.target);

            if (!clickedTrigger && !clickedDropdown) {
                setShowCountryDropdown(false);
            }

            const searchButton = document.querySelector('.search-button');
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                if (searchButton && !searchButton.contains(event.target)) {
                    setShowSearchInput(false);
                }
            }
        };

        if (showCountryDropdown || showSearchInput) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCountryDropdown, showSearchInput]);

    return (
        <>
            <div className="Header">
                <div className="Header-container">
                    <div className="header-main-container">
                        <ul className="header-main-section-1">
                            <li
                                className="country-select"
                                onClick={toggleCountryDropdown}
                                ref={countrySelectRef}
                            >
                                <span className="country-flag">
                                    <img
                                        src={`https://flagcdn.com/w20/${country.code}.png`}
                                        alt={country.name}
                                        style={{ marginRight: "6px" }}
                                    />
                                </span>
                                {t('LANGUAGE')}
                            </li>
                        </ul>
                        <div className="Header-container-title"> <img src="/Futura-New-38.png" alt="" /> Events &amp; Exhibition</div>
                    </div>

                    {/* ✅ Search Input */}
                    {showSearchInput && (
                        <form onSubmit={handleSearchSubmit} style={{ padding: '8px' }}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                            />
                            <button type="submit">Go</button>
                        </form>
                    )}

                    <div className="Header-container-Box">
                        <span><IoMdCall /> (877) 426-8177</span>
                        <span><MdEmail /> customerservice@futuratextiles.com</span>
                    </div>
                </div>
            </div>

            {/* ✅ FIX: Dropdown rendered OUTSIDE .Header so it is NOT inside Header's stacking context.
                This means z-index works globally and the dropdown always appears above the Navbar. */}
            {showCountryDropdown && (
                <div
                    ref={dropdownRef}
                    className="country-dropdown-portal"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                    }}
                >
                    <div className="country-dropdown">
                        {countries.map((c) => (
                            <div
                                key={c.code}
                                className="country-item"
                                onClick={(e) => handleCountryChange(c, e)}
                            >
                                <img
                                    src={`https://flagcdn.com/w20/${c.code}.png`}
                                    alt={c.name}
                                    style={{ width: "20px", marginRight: "6px" }}
                                />
                                <span>{c.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}