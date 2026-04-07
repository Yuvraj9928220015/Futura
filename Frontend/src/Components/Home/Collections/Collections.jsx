import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Collections.css';

export default function Collections() {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);

    const collections = [
        { id: 1, name: 'Marine', route: '/marine' },
        { id: 2, name: 'Automotive', route: '/automotive' },
        { id: 3, name: 'Contract', route: '/contract' },
    ];

    const handleNavigation = (item) => {
        setActiveItem(item.id);
        navigate(item.route);
    };

    return (
        <>
            <div className="collections-container">
                <div className="collections-wrapper">
                    <div className="content-section">
                        <div className="content-container">

                            <h2 className="collections-About-Section-Heading">
                                "Made to perform, Designed to care."
                            </h2>

                            <div className="collections-list-line"></div>

                            <div className="collections-list">
                                {collections.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`collection-item ${activeItem === item.id ? 'active' : ''}`}
                                        onClick={() => handleNavigation(item)}
                                    >
                                        <span className="item-text">
                                            {item.name}{index < collections.length - 1 ? ' |' : ''}
                                        </span>
                                        <div className="item-underline"></div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    <div className="collections-grid">
                        <div className="image-section">
                            <div className="image-container">
                                <img
                                    src="/pvc-leather1.png"
                                    alt="Collection"
                                    className="collection-image"
                                />
                                <div data-aos="fade-left" className="collection-image-overlay">
                                    <div className="overlay-content">
                                        <div className="overlay-text-wrapper">
                                            <h3 className="collection-image-title">At Futura,</h3>
                                            <p className="collection-image-des">
                                                We specialize in PVC-coated fabrics designed to meet the diverse needs of marine,
                                                contract furnishing, and automotive industries. Engineered for resilience and longevity,
                                                our materials withstand demanding environments.
                                            </p>
                                            <p className="collection-image-subtitle">Read More..</p>
                                        </div>
                                        <div className="read-more">
                                            <div className="about-link"><a href="/about">About Futura</a></div>
                                            <span className="separator">|</span>
                                            <div className="about-link"><a href="/about">About Mayur</a></div>
                                        </div>
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