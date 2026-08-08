import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Banner.css";

export default function Banner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const videoRefs = useRef([]);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const slides = [
        {
            image: '/New-Data-10.jpeg',
            mobileImage: '/New-Data-1.jpeg',
            title: 'One Stop Solution',
            des: 'Crafted to reflect your unique vision and requirements.',
            paragraph: 'Flexible solutions tailored for every project scale and style.',
            link: '/product',
        },
        {
            video: '/Futura-New-50.mp4',
            mobileVideo: '/New-Data-6.mp4',
            title: 'Better Tomorrow',
            des: 'Committed to greener practices in everything we do.',
            paragraph: 'Driving sustainability today to protect a better tomorrow.',
            link: '/product',
        },
        {
            image: '/New-Data-11.jpeg',
            mobileImage: '/New-Data-2.jpeg',
            title: 'Design Expertise',
            des: 'Creative concepts that bring aesthetics and functionality together.',
            paragraph: 'Thoughtfully designed spaces that elevate every environment.',
            link: '/products/design-expertise',
        },
        {
            video: '/New-video-2.mp4',
            mobileVideo: '/New-Data-7.mp4',
            title: 'Weather',
            Prag: 'Ready Material',
            des: 'Designed to endure extreme climates without compromise.',
            paragraph: 'Maintains durability, color, and performance in every condition',
            link: '/product',
        },
        {
            image: '/Marine-Banner1.png',
            mobileImage: '/New-Data-3.jpeg',
            title: 'Marine Upholstery',
            des: 'Engineered to withstand harsh marine conditions with ease.',
            paragraph: 'Delivers superior comfort, resilience, and long-term performance.',
            link: '/marine',
        },
        {
            video: '/New-video-4.mp4',
            mobileVideo: '/New-video-4.mp4',
            title: 'Engineered for',
            Prag: 'Performance',
            des: 'High-quality materials developed for strength and reliability.',
            paragraph: 'Built to perform consistently across demanding applications.',
            link: '/Preformance',
        },
        {
            image: 'MATRIX-Banner-1.png',
            mobileImage: 'MATRIX-Banner-1.png',
            title: 'Contract Furnishing',
            des: 'Tailored interiors crafted to meet your exact project needs.',
            paragraph: 'Designed for long-lasting durability with refined elegance.',
            link: '/contract',
        },
        {
            video: '/New-video-3.mp4',
            mobileVideo: '/New-Data-8.mp4',
            title: 'Durability Focus',
            des: 'Engineered with strength to stand the test of time.',
            paragraph: 'Ensures consistent performance and reliability in every use.',
            link: '/marine',
        },
    ];

    const getActiveMedia = (slide) => {
        if (isMobile) {
            return {
                video: slide.mobileVideo || slide.video || null,
                image: slide.mobileImage || slide.image || null,
                isVideo: !!(slide.mobileVideo || slide.video),
            };
        }
        return {
            video: slide.video || null,
            image: slide.image || null,
            isVideo: !!slide.video,
        };
    };

    const getSlideDuration = useCallback((index) => {
        const { isVideo } = getActiveMedia(slides[index]);
        return isVideo ? 10000 : 4000;
    }, [isMobile]);

    const startAutoPlay = useCallback((index) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, getSlideDuration(index));
    }, [getSlideDuration, slides.length]);

    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            const { isVideo } = getActiveMedia(slides[index]);
            if (isVideo && video) {
                if (index === currentSlide) {
                    video.currentTime = 0;
                    video.play().catch(e => console.error("Video error:", e));
                } else {
                    video.pause();
                }
            }
        });
        startAutoPlay(currentSlide);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [currentSlide, isMobile]);

    const changeSlide = (newIndex) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setCurrentSlide(newIndex);
    };

    const nextSlide = () => changeSlide((currentSlide + 1) % slides.length);
    const prevSlide = () => changeSlide((currentSlide - 1 + slides.length) % slides.length);
    const goToSlide = (index) => changeSlide(index);

    return (
        <>
            <div data-aos="fade-down" className="Banner-slider-container">
                <div className="Banner-slider-wrapper">
                    {slides.map((slide, index) => {
                        const { video, image, isVideo } = getActiveMedia(slide);
                        return (
                            <div
                                key={index}
                                className={`Banner-slide ${index === currentSlide ? 'active' : ''}`}
                            >
                                {isVideo ? (
                                    <video
                                        key={video}
                                        ref={(el) => { videoRefs.current[index] = el; }}
                                        className="Banner-slide-media Banner-slide-video"
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const fb = e.target.parentElement.querySelector('.Banner-slide-fallback');
                                            if (fb) fb.style.display = 'flex';
                                        }}
                                    >
                                        <source src={video} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img
                                        src={image}
                                        alt={slide.title}
                                        className="Banner-slide-media Banner-slide-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const fb = e.target.parentElement.querySelector('.Banner-slide-fallback');
                                            if (fb) fb.style.display = 'flex';
                                        }}
                                    />
                                )}

                                <div className="Banner-slide-dark-overlay" />
                                <div className="Banner-slide-fallback">
                                    {isVideo ? `Video ${index + 1} failed to load.` : `Image ${index + 1} failed to load.`}
                                </div>

                                <div className="Banner-slide-overlay">
                                    {index === currentSlide && (
                                        <div className="Banner-text-overlay">
                                            <h2 className="Banner-text-title">{slide.title}</h2>
                                            {slide.Prag && <h2 className="Banner-text-title">{slide.Prag}</h2>}
                                            <p className="Banner-text-des">{slide.des}</p>
                                            <p className="Banner-text-paragraph">{slide.paragraph}</p>
                                            <div className="Banner-text-overlay-btn">
                                                <button onClick={() => navigate(slide.link)}>
                                                    See Your Product
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {slides.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="nav-arrow nav-arrow-left" aria-label="Previous slide">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: '24px' }}>
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                            </svg>
                        </button>
                        <button onClick={nextSlide} className="nav-arrow nav-arrow-right" aria-label="Next slide">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: '24px' }}>
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                        </button>

                        <div className="dots-container">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentSlide ? 'dot-active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <div className="Banner-slide-counter">
                            {currentSlide + 1} / {slides.length}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}