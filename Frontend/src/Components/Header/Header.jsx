import React, { useState, useRef, useEffect } from 'react';
import { User, ShoppingCart, Search, X } from 'lucide-react';
import "./Header.css";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export default function Header() {
    const { t } = useTranslation();

    const [activeModal, setActiveModal] = useState(null);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [country, setCountry] = useState({ name: 'UK', flag: '🇬🇧', code: 'gb' });
    const countrySelectRef = useRef(null);
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
        us: 'en',
        ca: 'en',
        gb: 'en',
        au: 'en',
        de: 'de',
        fr: 'fr',
        es: 'es',
        it: 'it',
        jp: 'ja',
        cn: 'zh',
    };

    useEffect(() => {
        const savedLang = localStorage.getItem('i18nextLng');
        if (savedLang) {
            const matchedCountry = Object.entries(countryToLang).find(([, lang]) => lang === savedLang);
            if (matchedCountry) {
                const code = matchedCountry[0];
                const found = countries.find(c => c.code === code);
                if (found) setCountry(found);
            }
        }
    }, []);

    const openModal = (modalType) => {
        setActiveModal(modalType);
        setShowCountryDropdown(false);
        setShowSearchInput(false);
    };

    const closeModal = () => setActiveModal(null);
    const switchToRegister = () => setActiveModal('register');
    const switchToLogin = () => setActiveModal('login');

    const [dropdownPosition, setDropdownPosition] = useState({ top: 70, left: 0 });

    const toggleCountryDropdown = (e) => {
        e.stopPropagation();
        if (!showCountryDropdown && countrySelectRef.current) {
            const rect = countrySelectRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 10,
                left: rect.left
            });
        }
        setShowCountryDropdown(!showCountryDropdown);
        setShowSearchInput(false);
    };

    const toggleSearchInput = (e) => {
        e.stopPropagation();
        setShowSearchInput(!showSearchInput);
        setShowCountryDropdown(false);

        if (!showSearchInput) {
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 100);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            alert(`Search functionality would be implemented here for: ${searchQuery}`);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countrySelectRef.current && !countrySelectRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }

            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                const searchButton = document.querySelector('.search-button');
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
            <div className="header">
                <div className="header-main-container">
                    <ul className="header-main-section-1">
                        <li className="country-select" onClick={toggleCountryDropdown} ref={countrySelectRef}>
                            {t('LANGUAGE')}
                            <span className="country-flag">
                                <img src={`https://flagcdn.com/w20/${country.code}.png`} alt={country.name} style={{ marginRight: "6px" }} />
                            </span>

                            {showCountryDropdown && (
                                <div className="country-dropdown-container" style={{ position: 'fixed', top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}>
                                    <div className="country-dropdown">
                                        {countries.map((c) => (
                                            <div key={c.name} className="country-item" onClick={(e) => handleCountryChange(c, e)}>
                                                <img src={`https://flagcdn.com/w20/${c.code}.png`} alt={c.name} style={{ width: "20px", marginRight: "6px" }} />
                                                <span>{c.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                        {/* <li> <a href="/global-Presence">{t('GLOBAL PRESENCE')}</a></li> */}
                    </ul>

                    <ul className="header-main-section-2">
                        <li><a href="/contact">CONTACT US</a></li>
                        <li onClick={() => openModal('login')}><User size={14} /></li>
                        <li><ShoppingCart size={14} /></li>
                        <li className="search-button" onClick={toggleSearchInput}>
                            <Search size={14} /> {t('SEARCH')}
                        </li>
                    </ul>
                </div>

                {/* Search Input */}
                {showSearchInput && (
                    <div className="search-container" ref={searchInputRef}>
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <div className="search-input-wrapper">
                                <Search size={16} className="search-icon-input" />
                                <input
                                    type="text"
                                    placeholder={t('SEARCH') ? `${t('SEARCH')}...` : 'Search...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSearchInput(false);
                                        setSearchQuery('');
                                    }}
                                    className="search-close-btn"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {activeModal && <div className="modal-backdrop" onClick={closeModal}></div>}

            {activeModal === 'login' && (
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{t('LOGIN')}</h2>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label htmlFor="email">{t('EMAIL')}</label>
                                <input type="email" id="email" name="email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">{t('PASSWORD')}</label>
                                <input type="password" id="password" name="password" required />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="submit-btn" onClick={() => alert('Login functionality would be implemented here')}>{t('LOGIN')}</button>
                                <div className="form-links">
                                    <button type="button" className="link-btn">{t('FORGOT_PASSWORD')}</button>
                                    <button type="button" onClick={switchToRegister} className="link-btn">{t('DONT_HAVE_ACCOUNT')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'register' && (
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{t('REGISTER')}</h2>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label htmlFor="fullname">{t('NAME')}</label>
                                <input type="text" id="fullname" name="fullname" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-email">{t('EMAIL')}</label>
                                <input type="email" id="reg-email" name="email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-password">{t('PASSWORD')}</label>
                                <input type="password" id="reg-password" name="password" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">{t('CONFIRM_PASSWORD')}</label>
                                <input type="password" id="confirm-password" name="confirmPassword" required />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="submit-btn" onClick={() => alert('Registration functionality would be implemented here')}>{t('REGISTER')}</button>
                                <div className="form-links">
                                    <button type="button" onClick={switchToLogin} className="link-btn">{t('ALREADY_HAVE')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}