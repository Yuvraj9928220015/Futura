import { useState, useEffect, useRef } from "react";
import "./Focus.css";

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const features = [
    { icon: "/futara-icons-Cruelty-free.png", label: "Cruelty Free" },
    { icon: "/futara-icons-ethical.png", label: "Ethical" },
    { icon: "/futara-icons-Non-Toxic.png", label: "Non-Toxic" },
    { icon: "/futara-icons-Phthalate-free.png", label: "Phthalate Free" },
];

const stories = [
    {
        id: 1,
        title: "Get to Know",
        excerpt: "Our Product",
        explore: "Explore Features",
        image: "/New-image-2.png",
    },
    {
        id: 2,
        date: "December 6, 2024",
        subtitle: "Where Performance Meets Innovation",
        des: "Dive into the key features, textures, and performance qualities that define our materials across automotive, marine, and contract applications.",
        image: "/Runabout-1.png",
    },
];

const featuredSlides = [
    { id: 1, type: "image", date: "Feature Focus", title: "Discover the performance that defines every material.", image: "/Futura-New-10.jpeg" },
    { id: 2, type: "image", date: "Feature Focus", title: "Explore textures, finishes, and functional strength.", image: "/Futura-New-11.jpeg" },
    { id: 3, type: "video", date: "Feature Focus", title: "Designed to meet the demands of every application.", src: "/Our-Product-video.mp4" },
    { id: 4, type: "image", date: "Feature Focus", title: "Built with quality, innovation, and durability", image: "/Futura-New-8.jpeg" },
];

const AUTOPLAY_DELAY = 4000;
const TRANSITION_DURATION = 650;

function SlideContent({ slide, isActive }) {
    const videoRef = useRef(null);
    useEffect(() => {
        if (slide.type !== "video") return;
        const vid = videoRef.current;
        if (!vid) return;
        if (isActive) { vid.currentTime = 0; vid.play().catch(() => { }); }
        else { vid.pause(); vid.currentTime = 0; }
    }, [isActive, slide.type]);

    return (
        <>
            {slide.type === "video" ? (
                <video ref={videoRef} className="featured-slide-img" src={slide.src} poster={slide.poster} muted loop playsInline />
            ) : (
                <img src={slide.image} alt={slide.title} className="featured-slide-img" />
            )}
            <div className="featured-card-overlay">
                {slide.type === "video" && (
                    <span className="featured-video-badge"><PlayIcon /> Video</span>
                )}
                <div className="featured-card-date"><ClockIcon /> {slide.date}</div>
                <h3 className="featured-card-title">{slide.title}</h3>
            </div>
        </>
    );
}

export default function Focus() {
    const [current, setCurrent] = useState(0);
    const [nextIndex, setNextIndex] = useState(null);
    const [dir, setDir] = useState("next");
    const [transitioning, setTransitioning] = useState(false);

    const timerRef = useRef(null);
    const currentRef = useRef(current);
    const transitioningRef = useRef(false);

    useEffect(() => { currentRef.current = current; }, [current]);
    useEffect(() => { transitioningRef.current = transitioning; }, [transitioning]);

    const triggerSlide = (direction) => {
        if (transitioningRef.current) return;
        const curr = currentRef.current;
        const total = featuredSlides.length;
        const next = direction === "next" ? (curr + 1) % total : (curr - 1 + total) % total;
        setDir(direction);
        setNextIndex(next);
        setTransitioning(true);
        setTimeout(() => { setCurrent(next); setNextIndex(null); setTransitioning(false); }, TRANSITION_DURATION);
    };

    const startAutoplay = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => triggerSlide("next"), AUTOPLAY_DELAY);
    };

    useEffect(() => { startAutoplay(); return () => clearInterval(timerRef.current); }, []);

    const goTo = (index) => {
        if (index === currentRef.current || transitioningRef.current) return;
        const direction = index > currentRef.current ? "next" : "prev";
        setDir(direction); setNextIndex(index); setTransitioning(true);
        setTimeout(() => { setCurrent(index); setNextIndex(null); setTransitioning(false); }, TRANSITION_DURATION);
    };

    const exitingSlide = transitioning ? featuredSlides[current] : null;
    const enteringSlide = transitioning ? featuredSlides[nextIndex] : null;
    const activeSlide = !transitioning ? featuredSlides[current] : null;

    return (
        <div className="focus-root">

            {/* Features Section */}
            <div className="features-section">
                <div className="features-grid">
                    {features.map((item, i) => (
                        <div className="feature-box" key={i}>
                            <div className="feature-icon-wrap">
                                <img src={item.icon} alt={item.label} />
                            </div>
                            <div className="feature-label">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stories + Slider Section */}
            <div className="stories-section">
                <h2 className="stories-section-heading">Performance &amp; Features</h2>

                <div className="stories-layout">

                    {/* LEFT — Story Cards */}
                    <div className="story-cards-stack">
                        {stories.map((story) => (
                            <div className="story-card" key={story.id}>
                                <div className="story-card-thumb">
                                    <img src={story.image} alt={story.title} />
                                </div>
                                <div className="story-card-body">
                                    <h3 className="story-card-title">{story.title}</h3>
                                    <h3 className="story-card-excerpt">{story.excerpt}</h3>
                                    {story.explore && (
                                        <div className="story-card-explore">
                                            <a href="/Preformance">{story.explore}</a>
                                        </div>
                                    )}
                                </div>
                                {(story.subtitle || story.des) && (
                                    <div className="story-card-container">
                                        {story.subtitle && <h5 className="story-card-subtitle">{story.subtitle}</h5>}
                                        {story.des && <p className="story-card-des">{story.des}</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT — Featured Slider */}
                    <div>
                        <div
                            className="featured-slider"
                            onMouseEnter={() => clearInterval(timerRef.current)}
                            onMouseLeave={startAutoplay}
                        >
                            <div className="featured-slider-viewport">
                                {transitioning && exitingSlide && (
                                    <div className={`featured-slide slide-exit-${dir}`} key={`exit-${current}`}>
                                        <SlideContent slide={exitingSlide} isActive={false} />
                                    </div>
                                )}
                                {transitioning && enteringSlide && (
                                    <div className={`featured-slide slide-enter-${dir}`} key={`enter-${nextIndex}`}>
                                        <SlideContent slide={enteringSlide} isActive={false} />
                                    </div>
                                )}
                                {!transitioning && activeSlide && (
                                    <div className="featured-slide slide-active" key={`active-${current}`}>
                                        <SlideContent slide={activeSlide} isActive={true} />
                                    </div>
                                )}
                            </div>

                            <button
                                className="slider-arrow slider-arrow--prev"
                                onClick={() => { clearInterval(timerRef.current); triggerSlide("prev"); startAutoplay(); }}
                                aria-label="Previous slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>

                            <button
                                className="slider-arrow slider-arrow--next"
                                onClick={() => { clearInterval(timerRef.current); triggerSlide("next"); startAutoplay(); }}
                                aria-label="Next slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>

                            <div className="slider-dots">
                                {featuredSlides.map((slide, i) => (
                                    <button
                                        key={i}
                                        className={[
                                            "slider-dot",
                                            i === (transitioning ? nextIndex : current) ? "active" : "",
                                            slide.type === "video" ? "slider-dot--video" : "",
                                        ].join(" ").trim()}
                                        onClick={() => goTo(i)}
                                        aria-label={`Slide ${i + 1}${slide.type === "video" ? " (video)" : ""}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}