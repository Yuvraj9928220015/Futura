import React, { useState, useEffect } from "react";
import "./Preformance.css";

export default function Performance() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const advantages = [
        { name: 'Animal Friendly', ultrafabrics: true, leather: false, pvc: true, silicone: true },
        { name: 'No Formaldehyde/Chromium', ultrafabrics: true, leather: true, pvc: false, silicone: true },
        { name: 'Low VOCs', ultrafabrics: true, leather: false, pvc: false, silicone: true },
        { name: 'Plasticizer Free', ultrafabrics: true, leather: false, pvc: true, silicone: true },
        { name: 'Optimal Yield', ultrafabrics: true, leather: false, pvc: false, silicone: true },
        { name: 'Fade Resistant', ultrafabrics: true, leather: true, pvc: true, silicone: true },
        { name: 'Crack Resistant', ultrafabrics: true, leather: true, pvc: false, silicone: true },
        { name: 'Odorless', ultrafabrics: true, leather: true, pvc: false, silicone: true },
        { name: 'Skin Friendly', ultrafabrics: true, leather: false, pvc: false, silicone: true },
        { name: 'Soft Hand', ultrafabrics: true, leather: true, pvc: true, silicone: true },
        { name: 'Resistant to Chemical Cleaners & Disinfectants', ultrafabrics: true, leather: false, pvc: true, silicone: true },
        { name: 'Enhanced Durability', ultrafabrics: true, leather: false, pvc: true, silicone: true },
        { name: 'Polluting manufacturing', ultrafabrics: true, leather: true, pvc: true, silicone: false }
    ];

    const slides = [
        {
            title: "Innovation in Every Layer",
            subtitle: "Advanced Coating Technology",
            description: "Performance Coated Fabrics",
            details: "Cutting-edge fabric technology designed for maximum durability and performance with superior quality standards.",
            bgVideo: "Performance-Video.mp4"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);
 
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    console.log(goToSlide);

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    console.log(goToPrevSlide);

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    console.log(goToNextSlide);

    return (
        <>
            <div className="performance-main-section">
                {/* Hero Slider Section */}
                <div className="performance-Banner-container">
                    <div className="performance-container">
                        <div className="slider-wrapper">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`performance-slide ${index === currentSlide ? "active" : ""
                                        }`}
                                >
                                    {/* 🎥 Background Video */}
                                    <video
                                        className="slide-video"
                                        src={slide.bgVideo}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />

                                    {/* Overlay */}
                                    {/* <div className="slide-overlay"></div> */}

                                    {/* 🔒 Content – NO CHANGE */}
                                    <div className="slide-content">
                                        <div className="content-wrapper">
                                            <h1 className="main-title">{slide.title}</h1>
                                            <div className="subtitle-section-line"></div>
                                            <div className="subtitle-section">
                                                <div className="subtitle-with-dot">
                                                    <div className="subtitle">
                                                        <li>{slide.subtitle}</li>
                                                    </div>
                                                    <p className="details">{slide.details}</p>
                                                </div>

                                                {/* <div className="content-wrapper-description">
                                                    <div className="description-with-spacing">
                                                        <span className="description">
                                                            {slide.description}
                                                        </span>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Turtle Container */}
                <div className="turtle-container">
                    <div className="container-fluid">
                        <div className="row">
                            {/* <div className="col-lg-1 col-md-1 d-none d-md-block"></div> */}
                            <div className="col-lg-6 col-md-6 col-12">
                                <div className="turtle-box">
                                    <div className="turtle-box-image">
                                        <img src="/New-1.png" alt="Fabric banner" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                                <div className="turtle-box">
                                    <div className="turtle-box-image">
                                        <img src="/In-grid-2.webp" alt="Fabric detail" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Longevity Container */}
                <div className="longevity-container">
                    <div className="container-fluid">
                        <div className="longevity-container-box">
                            <div className="row">
                                <div className="col-lg-5 col-md-12">
                                    <div className="longevity-box">
                                        <div className="longevity-box-content">
                                            <div className="longevity-box-logo">
                                                <img src="/turtle-life.png" alt="Turtle Life logo" />
                                            </div>
                                            <div className="longevity-box-des">
                                                <div className="longevity-box-title">TURTLE LIFE</div>
                                                <div className="longevity-box-prag">A longevity product</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7 col-md-12">
                                    <div className="longevity-box">
                                        <div className="resistance-container">
                                            <div className="resistance-container-box">
                                                <div className="resistance-container-box-icon">
                                                    <div className="resistance-container-box-icon-title">Cold Crack Resistance</div>
                                                    <div><img src="/5.png" alt="Cold crack icon" /></div>
                                                </div>
                                                <div className="resistance-container-box-icon-des">
                                                    Our material passes the requirement of the cold-crack resistance and is an excellent material with no cracks.
                                                </div>
                                            </div>
                                            <div className="resistance-container-box">
                                                <div className="resistance-container-box-icon">
                                                    <div className="resistance-container-box-icon-title">UV Resistant</div>
                                                    <div><img src="/4.png" alt="UV resistant icon" /></div>
                                                </div>
                                                <div className="resistance-container-box-icon-des">
                                                    UV light, or sunlight, will not cause materials and surfaces to fade or discolor as it passes ASTM G154 (500 HOURS)
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="resistance-container">
                                            <div className="resistance-container-box">
                                                <div className="resistance-container-box-icon">
                                                    <div className="resistance-container-box-icon-title">Abrasion</div>
                                                    <div><img src="/3.png" alt="Abrasion icon" /></div>
                                                </div>
                                                <div className="resistance-container-box-icon-des">
                                                    Tests & Martindale Depicts resistance power against damage due to abrasion. ASTM D4157 10,000 rubs
                                                </div>
                                            </div>
                                            <div className="resistance-container-box">
                                                <div className="resistance-container-box-icon">
                                                    <div className="resistance-container-box-icon-title">Weatherometer</div>
                                                    <div><img src="/6.png" alt="Weather icon" /></div>
                                                </div>
                                                <div className="resistance-container-box-icon-des">
                                                    Weatherometers simulate the weathering process of indoor and outdoor sun exposure on materials. (1000 Hrs)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flamesafe Section */}
                <div className="flamesafe">
                    <div data-aos="fade-right" className="container-fluid">
                        <div className="row custom-gap-row">
                            <div className="col-lg-6 col-md-12">
                                <div className="flamesafe-box">
                                    <div className="flamesafe-box-container">
                                        <div className="flamesafe-box-icon">
                                            <div className="flamesafe-box-icon-title">Anti-Flammable</div>
                                            <img src="/5.png" alt="Fire icon" />
                                        </div>
                                        <div id="Flamesafe-Box-des">
                                            The flammability tests which are of utmost importance, Determines the burn resistance capabilities of materials used
                                            in marine, contract furninshing and healthcare. Passes fire-test-response standard, designed for the assessment of the resistance
                                            of our applications when it comes to combustion after exposure to smoldering cigarettes.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="flamesafe-box">
                                    <div className="longevity-box">
                                        <div className="longevity-box-content flamesafe-reverse">
                                            <div className="longevity-box-logo">
                                                <img src="/flamesafe1.png" alt="Flamesafe logo" />
                                            </div>
                                            <div className="longevity-box-des">
                                                <div className="longevity-box-title">FLAMESAFE</div>
                                                <div className="longevity-box-prag">A low emission product</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flamesafe Images */}
                <div data-aos="fade-down" className="flamesafe-2">
                    <div className="container-fluid">
                        <div className="row g-4 custom-gap-row">
                            <div className="col-lg-5 col-md-5 col-12">
                                <div className="flamesafe-2-box">
                                    <img src="/Rectangle-1.png" alt="Fabric texture 1" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                                <div className="flamesafe-2-box">
                                    <img src="/Rectangle-new-2.png" alt="Fabric texture 2" />
                                </div>
                            </div>
                            <div className="col-lg-1 col-md-1 d-none d-md-block"></div>
                        </div>
                    </div>
                </div>

                {/* Safe Touch Section */}
                <div className="safe-touch">
                    <div data-aos="fade-up-right" className="container-fluid">
                        <div className="row custom-gap-row">
                            <div className="col-lg-6 col-md-12">
                                <div className="safe-touch-box-1">
                                    <div className="longevity-box">
                                        <div className="longevity-box-content">
                                            <div className="longevity-box-logo">
                                                <img src="/safe-touch-black.png" alt="Safe Touch logo" />
                                            </div>
                                            <div className="longevity-box-des">
                                                <div className="longevity-box-title">SAFE TOUCH</div>
                                                <div className="longevity-box-prag">A hygiene product</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="safe-touch-image">
                                        <img src="/Rectangle-3.png" alt="Safe touch fabric" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="safe-touch-box-2">
                                    <div className="resistance-container-box">
                                        <div className="resistance-container-box-icon">
                                            <div className="resistance-container-box-icon-title">Anti-Microbial</div>
                                            <div><img src="/5.png" alt="Microbial icon" /></div>
                                        </div>
                                        <div className="resistance-container-box-icon-des">
                                            The test of antibacterial, bactericidal, bacteriostatic activity and has been proven effective.
                                            This relatively quick and easily executed qualitative method determines the antibacterial activity. We provides with pink stain free vinyl. A common test method used to assess materials against pink staining,
                                            using the Streptoverticillium reticulum pink staining test organism, is the ASTM E1428.
                                        </div>
                                    </div>
                                    <div className="resistance-container-box">
                                        <div className="resistance-container-box-icon">
                                            <div className="resistance-container-box-icon-title">Pink Stain</div>
                                            <div><img src="/5.png" alt="Pink stain icon" /></div>
                                        </div>
                                        <div className="resistance-container-box-icon-des">
                                            We provides with pink stain free vinyl. A common test method used to assess materials against pink staining,
                                            using the Streptoverticillium reticulum pink staining test organism, is the ASTM E1428.
                                        </div>
                                    </div>
                                    <div className="resistance-image">
                                        <img src="/Rectangle-4.png" alt="Testing fabric" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Protective Section */}
                <div data-aos="fade-right" className="protective">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-7 col-md-12">
                                <div className="protective-box-1">
                                    <div className="protective-main-box">
                                        <div className="protective-main-box-1">
                                            <div className="protective-main-box-image">
                                                <img src="/Leather-Image.jpeg" alt="Leather layers" />
                                            </div>
                                        </div>
                                        <div className="protective-main-box-2">
                                            <div className="protective-main-box-content">
                                                <div className="protective-main-box-title"><span>01</span> Compact PVC Layer </div>
                                                <div className="protective-main-box-des">
                                                    A smooth, protective PVC surface engineered to resist stains, scuffs, and everyday environmental impact while maintaining a premium finish.
                                                </div>
                                                <hr />
                                            </div>
                                            <div className="protective-main-box-content">
                                                <div className="protective-main-box-title"><span>02</span> Foam Layer </div>
                                                <div className="protective-main-box-des">
                                                    A flexible, cushioned layer that adds softness, enhances comfort, and improves the overall feel of the material during use.
                                                </div>
                                                <hr />
                                            </div>
                                            <div className="protective-main-box-content">
                                                <div className="protective-main-box-title"><span>03</span> Adhesive Layer</div>
                                                <div className="protective-main-box-des">
                                                    A high-performance bonding layer that securely fuses all components together, ensuring long-term stability and uniformity.
                                                </div>
                                                <hr />
                                            </div>
                                            <div className="protective-main-box-content">
                                                <div className="protective-main-box-title"><span>04</span> Backing Fabric</div>
                                                <div className="protective-main-box-des">
                                                    A strong textile base that reinforces the material, adding durability, dimensional stability, and dependable support.
                                                </div>
                                                <hr />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-12">
                                <div className="protective-box-2">
                                    <div className="protective-box-2-title"> How Do We Do It? </div>
                                    <div className="protective-box-2-des">
                                        <p>
                                            Our production method combines advanced technology with responsible manufacturing to create coated fabrics that perform consistently
                                            across applications. Each layer is purpose-built to deliver specific benefits, from surface protection to comfort and structural
                                            strength.
                                        </p>
                                        <p>
                                            With rigorous testing and strict quality checks, we ensure every batch meets the highest standards. Our commitment to continuous
                                            improvement drives innovation in both processes and product performance. As an alternative to traditional leather, our materials
                                            are animal-friendly and manufactured without harmful chemicals
                                        </p>
                                        <p>
                                            Compared to conventional PVC and silicone options, they offer improved crack resistance and enhanced production efficiency.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}