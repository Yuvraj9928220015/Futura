import { useState, useEffect } from 'react';
import './Categories.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const categoryData = {
    Apollo: {
        latest: 'LATEST COLLECTION',
        title: 'Apollo',
        description: 'The unique 4 way stretch of this vinyl makes it perfect for contouring around any frame securing a snuggle, waterproof fit. Futura a Apollo 360 degrees 4-way stretch features a contemporary color line and is preferred as a perfect seating in marine, healthcare, ergonomic contract furnishings and much more.',
        image1: 'Apollo-2.png',
        image2: 'Apollo-3.png',
    },
    Americana: {
        latest: 'LATEST COLLECTION',
        title: 'Americana',
        description: 'Americana passes the flammability tests which are of utmost importance. Determines the burn resistance capabilities of materials used in Marine, contract furnishing and healthcare. Passes fire-test-response standard, designed for the assessment of the resistance of our applications when it comes to combustion after exposure to smouldering cigarettes.',
        image1: 'Americana-2.png',
        image2: 'Americana-1.png',
    },
    'Auto Revolution': {
        latest: 'NEW RELEASE',
        title: 'Auto Revolution',
        description: 'Auto Revolution synthetic leather is resistant to weather, abrasions, UV radiations and biological fluids. They can be characterized by a wide range of thickness, embossing, colors, patterns and color fastness. Mostly used for automotive and trucking surfaces',
        image1: 'Auto_Revolution-image.png',
        image2: 'Auto_Revolution-image-1.JPG',
    },
    'Marien Revolution': {
        latest: 'SPRING COLLECTION',
        title: 'Marien Revolution',
        description: 'Marien Revolution passes the flammability tests which are of utmost importance. Determines the burn resistance capabilities of materials used in Marine, contract furnishing and healthcare. Passes fire-test-response standard, designed for the assessment of the resistance of our applications when it comes to combustion after exposure to smouldering cigarettes.',
        image1: '1eb.jpg',
        image2: 'In-grid-2.webp',
    },
    Matrix: {
        latest: 'SEASONAL FAVORITE',
        title: 'Matrix',
        description: 'It is ideal for contract and hospitality applications and combines the practicality of a PVC coated artificial leather with a real leather finish. Even in the most demanding contract environments, they are cleanable, chemical resistant, and super durable.',
        image1: 'd7b.jpg',
        image2: 'In-grid-2.webp',
    },
    Polaris: {
        latest: 'WINTER COLLECTION',
        title: 'Polaris',
        description: 'Polaris is the luxury artificial leather having a unique depth of quality and is extremely fire retardant, waterproof and anti microbial. It is approved for deep, infection control cleaning making it ideally suited for severe contract/hospitality and automotive upholstery',
        image1: '1eb.jpg',
        image2: 'In-grid-2.webp',
    },
    'Promo Revolution': {
        latest: 'SPECIAL EDITION',
        title: 'Promo Revolution',
        description: 'From steering wheels to door trims, our designs enable the automotive interior industry to choose materials for next generation. Promo Rev strive for a cleaner and more sustainable design, with appealing, long-lasting materials for automotive interior surfaces.',
        image1: 'd7b.jpg',
        image2: 'In-grid-2.webp',
    },
    Rudra: {
        latest: 'CULTURAL COLLECTION',
        title: 'Rudra',
        description: 'The Rudra collection is a powerful statement of tradition and strength, inspired by ancient motifs and crafted with modern precision.',
        image1: '1eb.jpg',
        image2: 'In-grid-2.webp',
    },
    'Runabout Glaucus': {
        latest: 'SUMMER LINE',
        title: 'Runabout Glaucus',
        description: 'Rich in style and aesthetics, Runabout designs are sturdy and high in performance. The breathability aspect of this vinyl material makes it extremely comfortable to cover automotive and marine surfaces.',
        image1: 'd7b.jpg',
        image2: 'In-grid-2.webp',
    },
    Extreme: {
        latest: 'ATHLETIC WEAR',
        title: 'Extreme', 
        description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout',
        image1: '1eb.jpg',
        image2: 'In-grid-2.webp',
    },
};

export default function Categories() {
    const categoryNames = Object.keys(categoryData);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const nextSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % categoryNames.length);
    };

    const prevSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + categoryNames.length) % categoryNames.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentCategoryName = categoryNames[currentSlideIndex];
    const selectedData = categoryData[currentCategoryName];

    const goToSlide = (index) => {
        setCurrentSlideIndex(index);
    };

    console.log(goToSlide);

    return (
        <>
            <div className="Categories-Container-heading">
                <h1 className="Categories-About-Section-Heading">Product Collections</h1>
                <div className="collections-title-line">
                    <span></span>
                </div>
            </div>

            <div className="Categories-Container">
                <div className="Slider-Wrapper">
                    <button onClick={prevSlide} className="Slider-Button prev-button" aria-label="Previous slide">
                        <FaChevronLeft />
                    </button>

                    <div data-aos="zoom-in" className="Slider-Content-Container">
                        <div className="Categories-Content-Box">
                            <div className="Categories-Box-content">
                                <div className="Categories-Box-Latest">{selectedData.latest}</div>
                                <div className="Categories-Box-title">{selectedData.title}</div>
                                <div className="Categories-Box-des">{selectedData.description}</div>
                                <div className="Categories-Box-but">
                                    <button>READ MORE →</button>
                                </div>
                            </div>

                            <div className="Categories-Images-Container">
                                <div className="Categories-Image-1">
                                    <img src={selectedData.image1} alt={selectedData.title} />
                                </div>
                                <div className="Categories-Image-2">
                                    <img src={selectedData.image2} alt={selectedData.title} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={nextSlide} className="Slider-Button next-button" aria-label="Next slide">
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </>
    );
}