import React, { useEffect, useState } from "react";
import { TiSocialLinkedin } from "react-icons/ti";
import "./PopupForm.css";

// ─────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────
const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.57 1 1 0 01-.24 1.02l-2.21 2.2z" />
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
);

const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.58C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
);

// ─────────────────────────────────────────────
// API Base URL — .env se aata hai
// .env mein add karo:  VITE_API_URL=http://localhost:8000
// ─────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─────────────────────────────────────────────
// PopupForm Component
// ─────────────────────────────────────────────
const PopupForm = () => {

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/Futura-New-45.png";
        link.download = "Contact Futura";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [isOpen, setIsOpen]         = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading]   = useState(false);  // ✅ loading state
    const [errorMsg, setErrorMsg]     = useState('');     // ✅ error state
    const [submitted, setSubmitted]   = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        phone: '',
        emailAddress: '',
        message: '',
    });

    // Auto-open popup on first visit (per session)
    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem("futura_popup_seen");
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem("futura_popup_seen", "true");
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setIsMinimized(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(true);
        setErrorMsg('');
    };

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setSubmitted(false);
        setErrorMsg('');
    };

    const handleChange = (e) => {
        setErrorMsg(''); // clear error on type
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ✅ API call with proper error handling
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch(`${API_URL}/api/popup/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Server-side validation error
                setErrorMsg(data.message || 'Something went wrong. Please try again.');
                setIsLoading(false);
                return;
            }

            // ✅ Success
            setSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsMinimized(true);
                setSubmitted(false);
                setFormData({ name: '', lastName: '', phone: '', emailAddress: '', message: '' });
            }, 2500);

        } catch (error) {
            console.error('❌ Form submit error:', error);
            setErrorMsg('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="pf-overlay"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div className="pf-modal">

                        {/* Close Button */}
                        <button className="pf-close" onClick={handleClose} aria-label="Close">
                            <CloseIcon />
                        </button>

                        {/* ── LEFT — Call Us ── */}
                        <div className="pf-left">
                            <h2 className="pf-left-heading">Call Us</h2>
                            <div className="pf-info-block-container">

                                <div className="pf-info-block">
                                    <div className="pf-icon-circle"><MapPinIcon /></div>
                                    <div className="pf-info-text">
                                        <p className="pf-info-name">Futura Textiles</p>
                                        <p className="pf-info-sub">6211 highway 305 olive branch ms 38654</p>
                                    </div>
                                </div>

                                <div className="pf-info-block">
                                    <div className="pf-icon-circle"><PhoneIcon /></div>
                                    <div className="pf-info-text">
                                        <p className="pf-info-sub">
                                            <span className="pf-label">Phone:</span> (877) 426-8177
                                        </p>
                                        <p className="pf-info-sub">
                                            <span className="pf-label">FAX:</span> (662) 932-8934
                                        </p>
                                    </div>
                                </div>

                                <div className="pf-info-block">
                                    <div className="pf-icon-circle"><EmailIcon /></div>
                                    <div className="pf-info-text">
                                        <p className="pf-info-sub">
                                            <span className="pf-label">Email:</span>{" "}
                                            <a href="mailto:customerservice@futuratextiles.com" className="pf-link">
                                                customerservice@futuratextiles.com
                                            </a>
                                        </p>
                                        <p className="pf-info-sub">
                                            <span className="pf-label">Email:</span>{" "}
                                            <a href="mailto:office@futuratextiles.com" className="pf-link">
                                                office@futuratextiles.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pf-socials">
                                <div className="pf-socials-icon">
                                    <a href="#" className="pf-social-icon" aria-label="Facebook"><FacebookIcon /></a>
                                    <a href="#" className="pf-social-icon" aria-label="Instagram"><InstagramIcon /></a>
                                    <a href="#" className="pf-social-icon" aria-label="Twitter"><TwitterIcon /></a>
                                    <a href="#" className="pf-social-icon" aria-label="YouTube"><YoutubeIcon /></a>
                                    <a href="#" className="pf-social-icon-2" aria-label="Linkedin"><TiSocialLinkedin /></a>
                                </div>
                                <div className="pf-socials-btn" onClick={handleDownload} style={{ cursor: "pointer" }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="30"
                                        height="30"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 3v13" />
                                        <path d="M7 12l5 5 5-5" />
                                        <path d="M5 20h14" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT — Let's Connect ── */}
                        <div className="pf-right">
                            <h2 className="pf-right-heading">Let's Connect</h2>
                            <p className="pf-right-sub">
                                Connect with our experts to discuss your specific requirements.
                            </p>

                            {submitted ? (
                                // ✅ Success State
                                <div className="pf-success">
                                    <div className="pf-success-icon">✓</div>
                                    <p>Thank you! We'll be in touch soon.</p>
                                </div>
                            ) : (
                                <form className="pf-form" onSubmit={handleSubmit}>

                                    <div className="pf-row">
                                        <div className="pf-field">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter Your First Name*"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                disabled={isLoading}
                                                className="pf-input"
                                            />
                                        </div>
                                        <div className="pf-field">
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Enter Your Last Name*"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                disabled={isLoading}
                                                className="pf-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="pf-row">
                                        <div className="pf-field">
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Enter Your Phone No."
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                className="pf-input"
                                            />
                                        </div>
                                        <div className="pf-field">
                                            <input
                                                type="email"
                                                name="emailAddress"
                                                placeholder="Your Email Address"
                                                value={formData.emailAddress}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                className="pf-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="pf-field pf-field-full">
                                        <textarea
                                            name="message"
                                            placeholder="Messages..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="pf-textarea"
                                            rows={5}
                                        />
                                    </div>

                                    {/* ✅ Error Message */}
                                    {errorMsg && (
                                        <p className="pf-error">{errorMsg}</p>
                                    )}

                                    {/* ✅ Submit Button with loading state */}
                                    <button
                                        type="submit"
                                        className="pf-submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Submit'}
                                    </button>

                                </form>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            {isMinimized && (
                <button className="pf-floating" onClick={handleOpen} aria-label="Open contact form">
                    <ChatIcon />
                    <span>Let's Connect</span>
                </button>
            )}
        </>
    );
};

export default PopupForm;