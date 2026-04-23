import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Banner.css";

export default function Banner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const videoRefs = useRef([]);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    const slides = [
        {
            image: '/Futura-New-4.jpeg',
            title: ' One Stop Solution',
            des: 'Crafted to reflect your unique vision and requirements.',
            paragraph: 'Flexible solutions tailored for every project scale and style.',
            link: '/product',
        },
        {
            video: '/Futura-New-50.mp4',
            title: 'Better Tomorrow',
            des: 'Committed to greener practices in everything we do.',
            paragraph: 'Driving sustainability today to protect a better tomorrow.',
            link: '/product',
        },
        {
            image: '/Futura-New-36.jpeg',
            title: 'Design Expertise',
            des: 'Creative concepts that bring aesthetics and functionality together.',
            paragraph: 'Thoughtfully designed spaces that elevate every environment.',
            link: '/products/design-expertise',
        },
        {
            video: '/New-video-2.mp4',
            title: 'Weather',
            Prag: 'Ready Material',
            des: 'Designed to endure extreme climates without compromise.',
            paragraph: 'Maintains durability, color, and performance in every condition',
            link: '/product',
        },
        {
            image: 'Marine-Banner1.png',
            title: 'Marine Upholstery',
            des: 'Engineered to withstand harsh marine conditions with ease.',
            paragraph: 'Delivers superior comfort, resilience, and long-term performance.',
            link: '/marine',
        },
        {
            video: '/New-video-4.mp4',
            title: 'Engineered for',
            Prag: 'Performance',
            des: 'High-quality materials developed for strength and reliability.',
            paragraph: 'Built to perform consistently across demanding applications.',
            link: '/Preformance',
        },
        {
            image: '/MATRIX-Banner-1.png',
            title: 'Contract Furnishing',
            des: 'Tailored interiors crafted to meet your exact project needs.',
            paragraph: 'Designed for long-lasting durability with refined elegance.',
            link: '/contract',
        },
        {
            video: '/New-video-3.mp4',
            title: 'Durability Focus',
            des: 'Engineered with strength to stand the test of time.',
            paragraph: 'Ensures consistent performance and reliability in every use.',
            link: '/marine',
        },
    ];

    const getSlideDuration = (index) => {
        return slides[index]?.video ? 10000 : 5000;
    };

    const startAutoPlay = (index) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const duration = getSlideDuration(index);
        timerRef.current = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, duration);
    };

    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (slides[index] && slides[index].video && video) {
                if (index === currentSlide) {
                    video.currentTime = 0;
                    video.play().catch(e => console.error("Error playing video:", e));
                } else {
                    video.pause();
                }
            }
        });

        startAutoPlay(currentSlide);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentSlide]);

    const nextSlide = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setCurrentSlide(index);
    };

    const handleVideoRef = (el, index) => {
        videoRefs.current[index] = el;
    };

    const handleNavigate = (link) => {
        if (link) {
            navigate(link);
        }
    };

    return (
        <>
            <div data-aos="fade-down" className="Banner-slider-container">
                <div className="Banner-slider-wrapper">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`Banner-slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            {slide.video ? (
                                <video
                                    ref={(el) => handleVideoRef(el, index)}
                                    className="Banner-slide-media Banner-slide-video"
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallbackElement = e.target.parentElement.querySelector('.Banner-slide-fallback');
                                        if (fallbackElement) fallbackElement.style.display = 'flex';
                                    }}
                                >
                                    <source src={slide.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="Banner-slide-media Banner-slide-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallbackElement = e.target.parentElement.querySelector('.Banner-slide-fallback');
                                        if (fallbackElement) fallbackElement.style.display = 'flex';
                                    }}
                                />
                            )}
                            <div className="Banner-slide-dark-overlay"></div>

                            <div className="Banner-slide-fallback">
                                {slide.video ? `Video ${index + 1} failed to load.` : `Image ${index + 1} failed to load.`}
                            </div>

                            <div className="Banner-slide-overlay">
                                {index === currentSlide && (
                                    <div className="Banner-text-overlay">
                                        <h2 className="Banner-text-title">{slide.title}</h2>
                                        <h2 className="Banner-text-title">{slide.Prag}</h2>
                                        <p className="Banner-text-subtitle">{slide.subtitle}</p>
                                        <p className="Banner-text-des">{slide.des}</p>
                                        <p className="Banner-text-paragraph">{slide.paragraph}</p>
                                        {/* ✅ Button navigates to slide's own link */}
                                        <div className="Banner-text-overlay-btn">
                                            <button onClick={() => handleNavigate(slide.link)}>
                                                See Your Product
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {slides.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="nav-arrow nav-arrow-left" aria-label="Previous slide">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: "24px" }}>
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                            </svg>
                        </button>
                        <button onClick={nextSlide} className="nav-arrow nav-arrow-right" aria-label="Next slide">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: "24px" }}>
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </>
    );
}