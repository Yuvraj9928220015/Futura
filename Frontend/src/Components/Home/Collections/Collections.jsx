import { useState } from 'react';
import './Collections.css';

export default function Collections() {
    const [currentImage, setCurrentImage] = useState('/pvc-leather1.png');
    const [activeItem, setActiveItem] = useState(1);
    const [overlayContent, setOverlayContent] = useState({
        title: 'At Futura,',
        description: 'We specialize in PVC-coated fabrics designed to meet the diverse needs of marine, contract furnishing, and automotive industries. Engineered for resilience and longevity, our materials withstand demanding environments.',
        subtitle: "Read More.."
    });

    const collections = [
        {
            id: 1,
            name: 'Marine',
            image: '/Collections-Banner.jpg',
            overlay: {
                title: 'At Marine,',
                description: 'We specialize in PVC-coated fabrics designed to meet the diverse needs of marine, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga quod esse minima totam eaque. contract furnishing, and automotive industries. Our materials are engineered for resilience and longevity. and automotive industries. Engineered for resilience and longevity, our materials withstand demanding environments.',
                subtitle: "Read More.."
            }
        },
        {
            id: 2,
            name: 'Automotive',
            image: '/Collections-Banner.jpg',
            overlay: {
                title: 'At Automotive,',
                description: 'We specialize in PVC-coated fabrics designed to meet the diverse needs of automotive, marine, and contract furnishing industries. Engineered for durability and aesthetic appeal.',
                subtitle: "Read More.."
            }
        },
        {
            id: 3,
            name: 'Contract',
            image: '/Collections-Banner.jpg',
            overlay: {
                title: 'At Contract,',
                description: 'We specialize in PVC-coated fabrics designed for contract furnishing, marine, and automotive industries. Our solutions offer superior performance and design flexibility.',
                subtitle: "Read More.."
            }
        }, 
    ];

    const changeContent = (itemId) => {
        const selectedCollection = collections.find(item => item.id === itemId);
        if (selectedCollection) {
            setCurrentImage(selectedCollection.image);
            setActiveItem(itemId);
            setOverlayContent(selectedCollection.overlay);
        }
    };

    console.log(changeContent);

    return (
        <>
            <div className="collections-container">
                <div className="collections-wrapper">
                    <div className="content-section">
                        <div className="content-container">
                            <h2 className="collections-About-Section-Heading">"Made to perform, Designed to care."</h2>
                            <div className="collections-list">
                                {collections.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`collection-item ${activeItem === item.id ? 'active' : ''}`}
                                        onClick={() => changeContent(item.id)}
                                    >
                                        <span className="item-text">{item.name} | </span>
                                        <div className="item-underline"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="collections-list-line"></div>
                    </div>
                    <div className="collections-grid">
                        <div className="image-section">
                            <div className="image-container">
                                <img
                                    src={currentImage}
                                    alt="Collection"
                                    className="collection-image"
                                />
                                <div data-aos="fade-left" className="collection-image-overlay">
                                    <div className="overlay-content">
                                        <div className="overlay-text-wrapper">
                                            <h3 className="collection-image-title">{overlayContent.title}</h3>
                                            <p className="collection-image-des">{overlayContent.description}</p>
                                            <p className="collection-image-subtitle">{overlayContent.subtitle}</p>
                                        </div>
                                        <div className="read-more">
                                            <div className="about-link">About Futura</div>
                                            <span className="separator">|</span>
                                            <div className="about-link">About Mayur</div>
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