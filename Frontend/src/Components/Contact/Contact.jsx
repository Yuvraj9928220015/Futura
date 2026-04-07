import React, { useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
import './Contact.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Contact() {
    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferredLanguage: '',
        natureOfEnquiry: '',
        country: 'India',
        subject: '',
        details: '',
        receiveUpdates: false,
        agreeToPrivacy: false
    });

    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    const languages = ['English', 'Hindi', 'Arabic', 'French', 'Spanish'];
    const enquiryNatures = ['General Enquiry', 'Product Information', 'Custom Order', 'Support', 'Partnership'];
    const countries = ['India', 'USA', 'UK', 'UAE', 'France', 'Germany', 'Australia', 'Singapore'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Error clear karo jab user type kare
        if (errorMessage) setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Server se error message show karo
                throw new Error(data.message || 'Something went wrong. Please try again.');
            }

            // ✅ Success
            setIsSubmitted(true);

            // 4 seconds baad form reset karo
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    title: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    preferredLanguage: '',
                    natureOfEnquiry: '',
                    country: 'India',
                    subject: '',
                    details: '',
                    receiveUpdates: false,
                    agreeToPrivacy: false
                });
            }, 4000);

        } catch (error) {
            console.error('❌ Form submit error:', error);
            setErrorMessage(error.message || 'Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        console.log('Newsletter email:', newsletterEmail);
        setNewsletterEmail('');
    };

    return (
        <div className="contact-page">
            {/* Header Section */}
            <div className="contact-header">
                <h1 className="contact-title"><img src="/Futura-logo.png" alt="" /></h1>
                <div className="contact-intro">
                    <p>To make an enquiry please use our contact form below.</p>
                    <p>To find your nearest Graff boutique, please use our <a href="#boutique" className="boutique-link">Boutique Locator</a>.</p>
                </div>
            </div>

            {/* Contact Form */}
            <div className="form-section">
                <div className="form-container-wrapper">
                    {isSubmitted ? (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h3>Thank You!</h3>
                            <p>Your enquiry has been sent successfully. We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">

                            {/* ✅ Error message banner */}
                            {errorMessage && (
                                <div className="error-banner">
                                    ⚠️ {errorMessage}
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <select
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Title*</option>
                                        {titles.map((title, index) => (
                                            <option key={index} value={title}>{title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email*"
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="First Name*"
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group phone-group">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Telephone number*"
                                        className="form-input phone-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Last Name*"
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <select
                                        name="preferredLanguage"
                                        value={formData.preferredLanguage}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="">Preferred Language</option>
                                        {languages.map((lang, index) => (
                                            <option key={index} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <select
                                        name="natureOfEnquiry"
                                        value={formData.natureOfEnquiry}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Nature Of Enquiry*</option>
                                        {enquiryNatures.map((nature, index) => (
                                            <option key={index} value={nature}>{nature}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        {countries.map((country, index) => (
                                            <option key={index} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Subject*"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <textarea
                                    name="details"
                                    value={formData.details}
                                    onChange={handleInputChange}
                                    placeholder="Details*"
                                    className="form-textarea"
                                    rows="6"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group full-width checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="receiveUpdates"
                                        checked={formData.receiveUpdates}
                                        onChange={handleInputChange}
                                        className="form-checkbox"
                                    />
                                    <span className="checkbox-text">
                                        I would like to receive updates from Futura Textiles using any of the method(s) that I have provided above. You can unsubscribe at any time.
                                    </span>
                                </label>
                            </div>

                            <div className="form-group full-width checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="agreeToPrivacy"
                                        checked={formData.agreeToPrivacy}
                                        onChange={handleInputChange}
                                        className="form-checkbox"
                                    />
                                    <span className="checkbox-text">
                                        * By entering your email, you agree to receive exclusive updates, offers, news, and other communications from Futura Textiles. You may unsubscribe at any time by contacting our Client Services Team at{' '}
                                        <a href="mailto:customerservice@futuratextiles.com">customerservice@futuratextiles.com</a>.
                                        For more details please see our <a href="#privacy">Privacy Policy</a>.
                                    </span>
                                </label>
                            </div>

                            <div className="form-group full-width recaptcha-section">
                                <div className="recaptcha-placeholder">
                                    <div className="recaptcha-checkbox">
                                        <input type="checkbox" required />
                                    </div>
                                    <div className="recaptcha-text">
                                        <span>I'm not a robot</span>
                                    </div>
                                    <div className="recaptcha-logo">
                                        <div className="recaptcha-icon">reCAPTCHA</div>
                                        <div className="recaptcha-links">
                                            <a href="#privacy">Privacy</a> - <a href="#terms">Terms</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Loading state button */}
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'SENDING...' : 'SEND ENQUIRY'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Global Headquarters Section */}
            <div className="headquarters-section">
                <div className="headquarters-divider">
                    <span>GLOBAL HEADQUARTERS</span>
                </div>

                <div className="headquarters-grid">
                    <div className="hq-card">
                        <h3>Address</h3>
                        <p className="address">Futura Textiles</p>
                        <p className="phone">8709 Caroma St. Olive Branch, MS 38654</p>
                    </div>

                    <div className="hq-card">
                        <h3>Phone</h3>
                        <p className="address">(877) 426-8177</p>
                        <p className="phone">Tel: <a href="tel:+16629328934">(662) 932-8934</a></p>
                    </div>

                    <div className="hq-card">
                        <h3>Email</h3>
                        <p className="address">customerservice@futuratextiles.com</p>
                        <p className="phone"><a href="mailto:office@futuratextiles.com">office@futuratextiles.com</a></p>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="map-section">
                <div className="map-container">
                    <div className="map-wrapper">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.1234567890!2d58.4000000!3d23.5880000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM1JzE2LjgiTiA1OMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Boutique Location Map"
                        ></iframe>
                    </div>
                    <div className="boutique-info">
                        <div className="boutique-header">
                            <MdLocationOn className="location-pin-icon" />
                            <p className="boutique-heading">YOUR NEAREST FUTURA BOUTIQUES</p>
                        </div>
                        <div className="boutique-details">
                            <h2 className="boutique-name"><img src="/Futura-logo.png" alt="" /></h2>
                        </div>
                        <button className="view-all-btn">VIEW ALL BOUTIQUES</button>
                    </div>
                </div>
            </div>
        </div>
    );
}