import React, { useState, useEffect, useRef } from 'react';
import "./Banner.css";

export default function Banner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const videoRefs = useRef([]);
    const slides = [
        {
            image: '/MATRIX-Banner.png',
            title: 'Matrix Collection',
            subtitle: 'View Collection',
        },
        {
            video: '/New-video-3.mp4',
            title: 'Weather Ready Material',
            subtitle: 'Explore More',
        },
        {
            image: 'Marine-Banner1.png',
            title: 'Marine Upholstery',
            subtitle: 'Explore Collections',
        },
        {
            video: '/New-video-4.mp4',
            title: 'Engineered for performance',
            subtitle: 'Explore More',
        },
        {
            image: '/Contract-Furnishing-Banner.png',
            title: 'Contract Furnishing',
            subtitle: 'View Collection',
        },
        {
            video: '/New-video-2.mp4',
            title: 'Weather Ready Material',
            subtitle: 'Explore More',
        },
    ];

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
    }, [currentSlide]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const handleVideoRef = (el, index) => {
        videoRefs.current[index] = el;
    };

    return (
        <>
            <div data-aos="fade-up" className="Banner-slider-container">
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
                                        if (fallbackElement) {
                                            fallbackElement.style.display = 'flex';
                                        }
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
                                        if (fallbackElement) {
                                            fallbackElement.style.display = 'flex';
                                        }
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
                                        <p className="Banner-text-subtitle">
                                            <div className="Banner-text-subtitle-line"></div>
                                            <button>{slide.subtitle}</button>
                                            <div className="Banner-text-subtitle-line"></div>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {slides.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="nav-arrow nav-arrow-left"
                            aria-label="Previous slide"
                        >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: "24px" }}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="nav-arrow nav-arrow-right"
                            aria-label="Next slide"
                        >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: "24px" }}><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
                        </button>
                    </>
                )}
            </div>
        </>
    );
}