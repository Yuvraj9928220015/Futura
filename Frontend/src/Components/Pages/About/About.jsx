import './About.css';
import { useState } from "react";

export default function About() {
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("futura");

    const images = [
        { src: "/About-1.jpg", alt: "Planning", size: "img-small" },
        { src: "/About-2.jpg", alt: "Machines", size: "img-large" },
        { src: "/About-3.jpg", alt: "Workers", size: "img-medium" },
        { src: "/About-4.jpg", alt: "Materials", size: "img-wide" },
    ];

    // Content for both companies
    const companyContent = {
        futura: {
            title: "Futura Textiles",
            description: "Futura Textiles was established to provide exceptional quality of coated fabrics (specialized in PVC) to the Automotive, Marine, Contract, trucking and hospitality markets in North and Central America. We supply through an exclusive supply agreement with our business partners Mayur Uniquoters ltd who are also an equity partner in Futura Textiles"
        },
        mayur: {
            title: "Mayur Uniquoters",
            description: "Mayur Uniquoters Ltd is India's leading manufacturer of artificial leather and coated fabrics. With state-of-the-art facilities and decades of expertise, we serve global markets with innovative solutions in automotive, furniture, footwear, and fashion industries. Our commitment to quality and sustainability makes us a trusted partner worldwide."
        }
    };

    const timelineData = [
        {
            year: "1994",
            description: "Establishment of The company Jaitpura Plan",
            position: "top"
        },
        {
            year: "1996",
            description: "First Export Shipment company Jaitpura Plan",
            position: "bottom"
        },
        {
            year: "2005",
            description: "Production commences at 2nd coating line at Jaitpura",
            position: "top"
        },
        {
            year: "2005",
            description: "Quality Certification 9001:2000 company Jaitpura Plan",
            position: "bottom"
        },
        {
            year: "2008",
            description: "Added third coating line at Jaitpura Plant",
            position: "top"
        },
        {
            year: "2011",
            description: "Total capacity of Jaitpura Plant increased by Jaitpura Plant",
            position: "bottom"
        },
        {
            year: "2012",
            description: "Received Forbes Asia Top 200 Best Under a Bil",
            position: "top"
        },
        {
            year: "2012",
            description: "New Knitting Plant at Dhodsar Plant",
            position: "bottom"
        },
        {
            year: "2014",
            description: "Fifth coating line inaugurated at Dhodsar Plant",
            position: "top"
        },
        {
            year: "2015",
            description: "Implement SAP company el Jaitpura Plant",
            position: "bottom"
        },
        {
            year: "2015",
            description: "Added sixth coating line at Dhodsar Plant",
            position: "top"
        },
        {
            year: "2016",
            description: "TS Certification 16949:2009 company el Jaitpura Plant",
            position: "bottom"
        },
        {
            year: "2019",
            description: "Acquisition of Futura Textile INC (USA)",
            position: "top"
        },
        {
            year: "2019",
            description: "Added automatic mixing machine at Dhodsar Plant",
            position: "bottom"
        },
        {
            year: "2019",
            description: "New PU Plant at Gwalior Madhya Pradesh",
            position: "top"
        },
        {
            year: "2020",
            description: "Our Membership with United Nations Global Imp",
            position: "bottom"
        },
        {
            year: "2021",
            description: "Acquisition of Futura Textile INC (USA)",
            position: "top"
        }
    ];

    return (
        <>
            <div className="About">
                <div className="About-us">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-8 col-md-12 col-sm-12">
                            </div>
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="About-Us-Box">
                                    <div className="About-Us-image">
                                        <img src="/Rectangle4.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Golbal-Leaders-container">
                    <div className="Golbal-Leaders">
                        <div className="Golbal-Leaders-title">Global Leaders</div>
                        <div className="Golbal-Leaders-des">in Coated Fabric Solutions</div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="Futura-Textiles-image">
                                    <img src="/Rectangle-6.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="Futura-Textiles-container">
                                    <div className="Futura-Textiles-content">
                                        <div className='Futura-Textiles-content-About'>About us</div>

                                        {/* Tab Buttons */}
                                        <div className="company-tabs">
                                            <button
                                                onClick={() => setActiveTab("futura")}
                                                className={`tab-button ${activeTab === "futura" ? "active" : ""}`}
                                            >
                                                | Futura Textiles
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("mayur")}
                                                className={`tab-button ${activeTab === "mayur" ? "active" : ""}`}
                                            >
                                                | Mayur Uniquoters
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="Futura-Textiles-container-des tab-content">
                                        {companyContent[activeTab].description}
                                    </div>
                                </div>
                                <div className="Zero-Market">
                                    <div className="Zero-Market-line"></div>
                                    <div className="Zero-Market-content">
                                        <div className="Zero-Market-content-title">Zero Market Failures</div>
                                        <div className="Zero-Market-content-des">from the past <span> 7 years</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CURVED WAVE TIMELINE DESIGN - FIXED */}
            <div className="Futura-Line-main-container">
                <div className="Futura-Line-container">
                    <div className="Futura-Line">
                        <div className="timeline-scroll-wrapper">
                            <div className="timeline-track">
                                {/* SVG Curved Wave Path - Extended for seamless loop */}
                                <svg className="timeline-wave-svg" viewBox="0 0 15300 300" preserveAspectRatio="none">
                                    <defs>
                                        <path id="wavePath" d="M 0,150 Q 225,50 450,150 T 900,150 T 1350,150 T 1800,150 T 2250,150 T 2700,150 T 3150,150 T 3600,150 T 4050,150 T 4500,150 T 4950,150 T 5400,150 T 5850,150 T 6300,150 T 6750,150 T 7200,150 T 7650,150 T 8100,150 T 8550,150 T 9000,150 T 9450,150 T 9900,150 T 10350,150 T 10800,150 T 11250,150 T 11700,150 T 12150,150 T 12600,150 T 13050,150 T 13500,150 T 13950,150 T 14400,150 T 14850,150 T 15300,150" />
                                    </defs>
                                    <use href="#wavePath" stroke="#cccccc" strokeWidth="2" fill="none" strokeDasharray="8,6" />
                                </svg>

                                {/* Timeline Items - First Set */}
                                <div className="timeline-items-container">
                                    {timelineData.map((item, idx) => {
                                        const xPosition = idx * 450;

                                        return (
                                            <div
                                                key={idx}
                                                className={`timeline-point ${item.position}`}
                                                style={{ left: `${xPosition}px` }}
                                            >
                                                <div className="timeline-dot"></div>
                                                <div className="timeline-content-box">
                                                    <div className="timeline-year">{item.year}</div>
                                                    <div className="timeline-description">{item.description}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Duplicate for seamless loop */}
                                <div className="timeline-items-container duplicate">
                                    {timelineData.map((item, idx) => {
                                        const xPosition = idx * 450;

                                        return (
                                            <div
                                                key={`dup-${idx}`}
                                                className={`timeline-point ${item.position}`}
                                                style={{ left: `${xPosition}px` }}
                                            >
                                                <div className="timeline-dot"></div>
                                                <div className="timeline-content-box">
                                                    <div className="timeline-year">{item.year}</div>
                                                    <div className="timeline-description">{item.description}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Manufacturer">
                    <div className="Manfacturer-Box-1">
                        <div className="Manfacturer-Box-1-line-1"></div>
                        <div className="Manfacturer-Box-1-title">OUR FACTORY <span>IN INDIA</span></div>
                    </div>
                    <div className="Manfacturer-Box-2">
                        <div className="Manfacturer-Box-1-line-2"></div>
                        <div className="Manfacturer-Box-1-des">
                            We are the largest manufacturer of artificial leather, using the 'Release Paper Transfer
                            Coating Technology' in India. We have come a long way in the past two decades from a meagre production of 0.25 million linear meters per month, to an astonishing 4.45 million linear meters per month,
                            {expanded && (
                                <span className="extra-text">
                                    {" "}
                                    through our 7 state of the art coating lines of which 5 are Italian lines. The latest addition is the PU plant at Morena with an initial
                                    capacity of 5 million mtrs/annum and a total expandable capacity 20 million mtrs /annum.
                                </span>
                            )}
                            <span
                                className="readmore"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? " Show Less" : " Read More...."}
                            </span>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" className="Factory">
                    <div className="factory-container">
                        <div className="factory-grid">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`factory-image-wrapper ${image.size}`}
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="factory-image"
                                    />
                                    <div className="factory-overlay"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}