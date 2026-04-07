import { useState, useEffect, useRef } from 'react';
import './Categories.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const categoryData = {
    Apollo: {
        latest: 'LATEST COLLECTION',
        title: 'Apollo',
        description: 'The unique 4 way stretch of this vinyl makes it perfect for contouring around any frame securing a snuggle, waterproof fit. Futura a Apollo 360 degrees 4-way stretch features a contemporary color line and is preferred as a perfect seating in marine, healthcare, ergonomic contract furnishings and much more.',
        image1: 'Apollo-image-2.png',
        image2: 'Apollo-image-1.png',
    },
    Americana: {
        latest: 'LATEST COLLECTION',
        title: 'Americana',
        description: 'Americana passes the flammability tests which are of utmost importance. Determines the burn resistance capabilities of materials used in Marine, contract furnishing and healthcare. Passes fire-test-response standard.',
        image1: 'image (2).png',
        image2: 'image (4).png',
    },
    Matrix: {
        latest: 'SEASONAL FAVORITE',
        title: 'Matrix',
        description: 'It is ideal for contract and hospitality applications and combines the practicality of a PVC coated artificial leather with a real leather finish. Even in the most demanding contract environments, they are cleanable, chemical resistant, and super durable.',
        image1: 'Matrix-image-2.png',
        image2: 'Matrix-image-1.png',
    },
    Suave: {
        latest: 'SEASONAL FAVORITE',
        title: 'Suave',
        description: 'It is ideal for contract and hospitality applications and combines the practicality of a PVC coated artificial leather with a real leather finish. Even in the most demanding contract environments, they are cleanable, chemical resistant, and super durable.',
        image1: 'Sauve-image-3.png',
        image2: 'Suave-New-image-1.png',
    },
    Offroad: {
        latest: 'SUMMER LINE',
        title: 'Offroad',
        description: 'Rich in style and aesthetics, Runabout designs are sturdy and high in performance. The breathability aspect of this vinyl material makes it extremely comfortable to cover automotive and marine surfaces.',
        image1: 'OffRoad-New-image-2.JPG',
        image2: 'OffRoad-image-1.png',
    },
    Poseiden: {
        latest: 'ATHLETIC WEAR',
        title: 'Poseiden',
        description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout makes it extremely comfortable to cover automotive and marine surfaces.',
        image1: 'Poseiden-image-1.JPG',
        image2: 'Poseiden-image-2.png',
    },
    'Runabout Glaucus': {
        latest: 'SUMMER LINE',
        title: 'Runabout Glaucus',
        description: 'Rich in style and aesthetics, Runabout designs are sturdy and high in performance. The breathability aspect of this vinyl material makes it extremely comfortable to cover automotive and marine surfaces.',
        image1: 'Runabout-New-image-1.png',
        image2: 'Runabout-New-image-2.JPG',
    },
    // 'Auto Revolution': {
    //     latest: 'NEW RELEASE',
    //     title: 'Auto Revolution',
    //     description: 'Auto Revolution synthetic leather is resistant to weather, abrasions, UV radiations and biological fluids. They can be characterized by a wide range of thickness, embossing, colors, patterns and color fastness. Mostly used for automotive and trucking surfaces.',
    //     image1: 'Auto_Revolution-image.png',
    //     image2: 'Auto_Revolution-image-1.JPG',
    // },
    // 'Marien Revolution': {
    //     latest: 'SPRING COLLECTION',
    //     title: 'Marien Revolution',
    //     description: 'Marien Revolution passes the flammability tests which are of utmost importance. Determines the burn resistance capabilities of materials used in Marine, contract furnishing and healthcare. Passes fire-test-response standard.',
    //     image1: '1eb.jpg',
    //     image2: 'In-grid-2.webp',
    // },
    // 'Promo Revolution': {
    //     latest: 'SPECIAL EDITION',
    //     title: 'Promo Revolution',
    //     description: 'From steering wheels to door trims, our designs enable the automotive interior industry to choose materials for next generation. Promo Rev strive for a cleaner and more sustainable design, with appealing, long-lasting materials for automotive interior surfaces.',
    //     image1: 'image-2.png',
    //     image2: 'Apollo-3.png',
    // },
    // Extreme: {
    //     latest: 'ATHLETIC WEAR',
    //     title: 'Extreme',
    //     description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout makes it extremely comfortable to cover automotive and marine surfaces.',
    //     image1: '1eb.jpg',
    //     image2: 'In-grid-2.webp',
    // },
};

export default function Categories() {
    const categoryNames = Object.keys(categoryData);

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const [displayIndex, setDisplayIndex] = useState(0);

    const [contentAnim, setContentAnim] = useState('idle');
    const [imagesAnim, setImagesAnim] = useState('idle');

    const isAnimating = useRef(false);

    const changeSlide = (newIndex, direction) => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        // ── Phase 1: EXIT ──
        setContentAnim('exit');
        setImagesAnim(direction === 'next' ? 'exit-left' : 'exit-right');

        setTimeout(() => {
            setDisplayIndex(newIndex);
            setCurrentSlideIndex(newIndex);

            setContentAnim('enter');
            setImagesAnim(direction === 'next' ? 'enter-right' : 'enter-left');

            setTimeout(() => {
                setContentAnim('idle');
                setImagesAnim('idle');
                isAnimating.current = false;
            }, 500);
        }, 400);
    };

    const nextSlide = () => {
        const newIndex = (currentSlideIndex + 1) % categoryNames.length;
        changeSlide(newIndex, 'next');
    };

    const prevSlide = () => {
        const newIndex = (currentSlideIndex - 1 + categoryNames.length) % categoryNames.length;
        changeSlide(newIndex, 'prev');
    };

    const goToSlide = (index) => {
        if (index === currentSlideIndex || isAnimating.current) return;
        const direction = index > currentSlideIndex ? 'next' : 'prev';
        changeSlide(index, direction);
    };

    // Auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            const newIndex = (currentSlideIndex + 1) % categoryNames.length;
            changeSlide(newIndex, 'next');
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlideIndex]);

    const selectedData = categoryData[categoryNames[displayIndex]];

    // ── Map state → CSS class ──
    const contentClass = {
        idle: '',
        exit: 'content-exit',
        enter: 'content-enter',
    }[contentAnim] || '';

    const imagesClass = {
        idle: '',
        'exit-left': 'images-exit-left',
        'exit-right': 'images-exit-right',
        'enter-right': 'images-enter-right',
        'enter-left': 'images-enter-left',
    }[imagesAnim] || '';

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

                    {/* ── Prev Button ── */}
                    <button
                        onClick={prevSlide}
                        className="Slider-Button prev-button"
                        aria-label="Previous slide"
                    >
                        <FaChevronLeft />
                    </button>

                    {/* ── Slider Content ── */}
                    <div className="Slider-Content-Container">
                        <div className="Categories-Content-Box">

                            {/* ── LEFT: Text Content (FADE only) ── */}
                            <div className={`Categories-Box-content ${contentClass}`}>
                                <div className="Categories-Box-Latest">{selectedData.latest}</div>
                                <div className="Categories-Box-title">{selectedData.title}</div>
                                <div className="Categories-Box-des">{selectedData.description}</div>
                                <div className="Categories-Box-but">
                                    <button>READ MORE →</button>
                                </div>
                            </div>

                            {/* ── RIGHT: Images (SLIDE animation) ── */}
                            <div className={`Categories-Images-Container ${imagesClass}`}>
                                <div className="Categories-Image-1">
                                    <img src={selectedData.image1} alt={selectedData.title} />
                                </div>
                                <div className="Categories-Image-2">
                                    <img src={selectedData.image2} alt={selectedData.title} />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Next Button ── */}
                    <button
                        onClick={nextSlide}
                        className="Slider-Button next-button"
                        aria-label="Next slide"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </>
    );
}