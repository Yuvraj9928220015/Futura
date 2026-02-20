import "./Footer.css"
import { TiSocialFacebook } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { MdOutlinePhone } from "react-icons/md";
import { MdFax } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";

export default function Footer() {
    return (
        <>
            <div className="Footer-Top"></div>
            <div className="Footer">
                <div className="container-fluid">
                    <div className="row">
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

                        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="Footer-Box-2">
                                <div className="social-icons">
                                    <div className="social-mida-icons">
                                        <FaFacebook  className="social-icon" />
                                        <FaInstagram className="social-icon" />
                                        <FaLinkedinIn className="social-icon" />
                                    </div>
                                    <div className="social-text">
                                        Connect with us on social media!
                                    </div>
                                </div>


                                <div className="newsletter-section">
                                    <div className="newsletter-title">
                                        Sign up to receive updates of upcoming events and program
                                    </div>

                                    <div className="newsletter-form">
                                        <div className="input-row">
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                className="form-input"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                className="form-input"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                className="form-input full-width"
                                            />
                                            <button className="signup-btn">Sign up</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="Copyright">
                <div className="Copyright-text">
                    © Copyright 2025. Futura Textiles.
                </div>
                <div className="Copyright-text">
                    <a href="https://lensclicker.com/">
                        Designed and Developed by lensclickerdigital.com
                    </a>
                </div>
            </div>
        </>
    );
}