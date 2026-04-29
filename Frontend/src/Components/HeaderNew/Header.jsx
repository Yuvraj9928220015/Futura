import { IoMdCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import "./Header.css";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function HeaderNew() {
    const { t } = useTranslation();
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [country, setCountry] = useState({ name: 'UK', flag: '🇬🇧', code: 'gb' });
    const countrySelectRef = useRef(null);
    const dropdownRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                !countrySelectRef.current?.contains(e.target) &&
                !dropdownRef.current?.contains(e.target)
            ) {
                setShowCountryDropdown(false);
            }
        };
        if (showCountryDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCountryDropdown]);

    const handleCountryChange = (selectedCountry, e) => {
        e.stopPropagation();
        setCountry(selectedCountry);
        setShowCountryDropdown(false);
        const lang = countryToLang[selectedCountry.code] || 'en';
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
    };

    return (
        <>
            <div className="Header">
                <div className="Header-container">
                    {/* LEFT: Language + Title */}
                    <div className="header-left">
                        <div className="header-lang-wrap" ref={countrySelectRef}>
                            <div
                                className="country-select"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCountryDropdown(prev => !prev);
                                }}
                            >
                                <img
                                    src={`https://flagcdn.com/w20/${country.code}.png`}
                                    alt={country.name}
                                    className="country-flag-img"
                                />
                                {t('LANGUAGE')}
                            </div>

                            {showCountryDropdown && (
                                <div ref={dropdownRef} className="country-dropdown">
                                    {countries.map((c) => (
                                        <div
                                            key={c.code}
                                            className="country-item"
                                            onClick={(e) => handleCountryChange(c, e)}
                                        >
                                            <img
                                                src={`https://flagcdn.com/w20/${c.code}.png`}
                                                alt={c.name}
                                            />
                                            <span>{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="Header-container-title">
                            <a href="/News">
                                <img src="/Futura-New-38.png" alt="" />
                                Events &amp; Exhibition
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: Contact info */}
                    <div className="Header-container-Box">
                        <span>
                            <a href="/contact">
                                <IoMdCall />(877) 426-8177
                            </a>
                        </span>
                        <span className="hide-on-tablet">
                            <a href="/contact">
                                <MdEmail /> customerservice@futuratextiles.com
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}