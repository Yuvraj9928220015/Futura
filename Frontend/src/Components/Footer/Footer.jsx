import "./Footer.css";
import { useState } from "react";
import { MdOutlinePhone } from "react-icons/md";
import { MdFax } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

// ✅ Automatically detect: localhost ya production
const BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://api.futuratextiles.in";

// ✅ FIX: Critical styles inline rakho taaki production me CSS override na ho
const footerStyle = {
    backgroundColor: "#7a6b64",
    color: "white",
    width: "100%",
    padding: "30px 60px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Roboto', sans-serif",
};

export default function Footer() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailAddress: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage({ text: "", type: "" });
    };

    const handleSubmit = async () => {
        const { firstName, lastName, emailAddress } = formData;

        if (!firstName || !lastName || !emailAddress) {
            setMessage({ text: "Please fill in all fields.", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/receive/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, emailAddress })
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ text: "✅ Successfully subscribed!", type: "success" });
                setFormData({ firstName: "", lastName: "", emailAddress: "" });
            } else {
                setMessage({ text: data.message, type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Something went wrong. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="Footer-Top"></div>

            {/* ✅ FIX: style prop se inline backgroundColor diya — production me kabhi override nahi hoga */}
            <div className="Footer" style={footerStyle}>
                <div className="container-fluid">
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="Footer-Box-1">
                                <div className="Futura-logo">
                                    <img src="Futura-logo-white.png" alt="Futura Logo" />
                                </div>

                                <div className="contact-section">
                                    <div className="footer-contact-title">Office Contacts</div>
                                    <div className="contact-item">
                                        <MdOutlinePhone className="contact-icon" />
                                        <span>T: (877) 426-8177</span>
                                    </div>
                                    <div className="contact-item">
                                        <MdFax className="contact-icon" />
                                        <span>FAX: (662) 932-8934</span>
                                    </div>
                                </div>

                                <div className="address-section">
                                    <div className="address-title">Futura textiles</div>
                                    <div className="address-item">
                                        <IoLocationOutline className="address-icon" />
                                        <span>8709 Caroma St. Olive Branch, MS 38654</span>
                                    </div>
                                    <div className="map-button-section">
                                        <button className="google-maps-btn">Google Maps</button>
                                    </div>
                                </div>

                                <div className="Map">
                                    <img src="/Futura-Map.png" alt="Map location" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="Footer-Box-2">
                                <div className="social-icons">
                                    <div className="social-mida-icons">
                                        <a href="https://www.facebook.com/share/1JxiRZ64bd/?mibextid=wwXIfr"><img src="/icon-3.png" alt="" /></a>
                                        <a href="https://www.instagram.com/mayur_uniquoters_limited/"><img src="/icon-1.png" alt="" /></a>
                                        <a href="https://www.linkedin.com/search/results/all/?keywords=futura%20textiles"><img src="/icon-2.png" alt="" /></a>
                                    </div>
                                    <div className="social-text">Connect with us on social media!</div>
                                </div>

                                <div className="newsletter-section">
                                    <div className="newsletter-title">
                                        Sign up to receive updates of upcoming events and program
                                    </div>

                                    <div className="newsletter-form">
                                        <div className="input-row">
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                className="form-input"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                className="form-input"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                            <input
                                                type="email"
                                                name="emailAddress"
                                                placeholder="Email Address"
                                                className="form-input full-width"
                                                value={formData.emailAddress}
                                                onChange={handleChange}
                                            />
                                            <button
                                                className="signup-btn"
                                                onClick={handleSubmit}
                                                disabled={loading}
                                            >
                                                {loading ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>

                                        {message.text && (
                                            <div style={{
                                                marginTop: "12px",
                                                padding: "10px 14px",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                color: message.type === "success" ? "#276749" : "#9b1c1c",
                                                backgroundColor: message.type === "success" ? "#c6f6d5" : "#fed7d7",
                                                border: `1px solid ${message.type === "success" ? "#9ae6b4" : "#feb2b2"}`
                                            }}>
                                                {message.text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="Copyright">
                <div className="Copyright-text">© Copyright 2025. Futura Textiles.</div>
                <div className="Copyright-text">
                    <a href="https://lensclicker.com/">Designed and Developed by lensclickerdigital.com</a>
                </div>
            </div>
        </>
    );
}