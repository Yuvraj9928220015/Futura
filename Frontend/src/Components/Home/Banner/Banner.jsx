import React, { useState, useEffect, useRef } from 'react';
import "./Banner.css";

export default function Banner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRefs = useRef([]);
    const slides = [
        // {
        //     video: '/video-3.mp4',
        //     title: 'Best Sellers',
        //     subtitle: 'Explore Collections',
        // },
        {
            image: '/MATRIX-Banner.png',
            title: 'Matrix Collection',
            subtitle: 'View Collection',
        },
        {
            image: 'Marine-Banner1.png',
            title: 'Marine Collections',
            subtitle: 'Explore Collections',
        },
        {
            video: '/Banner-video.mp4',
            title: 'High Performance Material',
            subtitle: 'Explore More',
        },
        {
            image: '/Contract-Furnishing-Banner.png',
            title: 'Contract Collection',
            subtitle: 'View Collection',
        }
    ];

    useEffect(() => {
        let interval;

        if (isPlaying && slides.length > 1) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 10000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [slides.length, isPlaying]);

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

        if (slides[currentSlide] && !slides[currentSlide].video) {
            videoRefs.current.forEach(video => {
                if (video) video.pause();
            });
            setIsPlaying(false);
        } else if (slides[currentSlide] && slides[currentSlide].video) {
            if (!isPlaying) {
                const currentVideo = videoRefs.current[currentSlide];
                if (currentVideo) {
                    currentVideo.play().catch(e => console.error("Error playing video:", e));
                    setIsPlaying(true);
                }
            }
        }

    }, [currentSlide, slides, isPlaying]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsPlaying(true);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsPlaying(true);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        if (slides[currentSlide] && slides[currentSlide].video) {
            const currentVideo = videoRefs.current[currentSlide];
            if (currentVideo) {
                if (isPlaying) {
                    currentVideo.pause();
                    setIsPlaying(false);
                } else {
                    currentVideo.play().catch(e => console.error("Error playing video:", e));
                    setIsPlaying(true);
                }
            }
        } else {
            setIsPlaying((prev) => !prev);
        }
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

                            <div className="image-Overlay"></div>

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

                {/* Play/Pause Button - Only show if current slide is a video */}
                {slides[currentSlide] && slides[currentSlide].video && (
                    <button
                        onClick={togglePlayPause}
                        className="play-pause-btn"
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                        {isPlaying ? (
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: "20px" }}><path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"></path></svg>
                        ) : (
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: "20px" }}><path d="M8 5v14l11-7z"></path></svg>
                        )}
                    </button>
                )}


                {slides.length > 1 && (
                    <div className="dot-indicators">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`dot ${index === currentSlide ? 'dot-active' : ''}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}