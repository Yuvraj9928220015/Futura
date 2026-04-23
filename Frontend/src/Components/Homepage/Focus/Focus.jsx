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

const stories = [
    {
        id: 1,
        title: "Get to Know",
        excerpt: " Our Product",
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
    {
        id: 1,
        type: "image",
        date: "Feature Focus",
        title: "Discover the performance that defines every material.",
        image: "/Futura-New-10.jpeg",
    },
    {
        id: 2,
        type: "image",
        date: "Feature Focus",
        title: "Explore textures, finishes, and functional strength.",
        image: "/Futura-New-11.jpeg",
    },
    {
        id: 3,
        type: "video",
        date: "Feature Focus",
        title: "Designed to meet the demands of every application.",
        src: "/Our-Product-video.mp4",
    },
    {
        id: 4,
        type: "image",
        date: "Feature Focus",
        title: "Built with quality, innovation, and durability",
        image: "/Futura-New-8.jpeg",
    },
];

const AUTOPLAY_DELAY = 4000;
const TRANSITION_DURATION = 650;

// ─── Slide Content Component ───
function SlideContent({ slide, isActive }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (slide.type !== "video") return;
        const vid = videoRef.current;
        if (!vid) return;

        if (isActive) {
            vid.currentTime = 0;
            vid.play().catch(() => { });
        } else {
            vid.pause();
            vid.currentTime = 0;
        }
    }, [isActive, slide.type]);

    return (
        <>
            {slide.type === "video" ? (
                <video
                    ref={videoRef}
                    className="Featured-Slide-Img"
                    src={slide.src}
                    poster={slide.poster}
                    muted
                    loop
                    playsInline
                />
            ) : (
                <img
                    src={slide.image}
                    alt={slide.title}
                    className="Featured-Slide-Img"
                />
            )}

            <div className="Featured-Card-Overlay">
                {slide.type === "video" && (
                    <span className="Featured-Video-Badge">
                        <PlayIcon /> Video
                    </span>
                )}
                <div className="Featured-Card-Date">
                    <ClockIcon /> {slide.date}
                </div>
                <h3 className="Featured-Card-Title">{slide.title}</h3>
            </div>
        </>
    );
}

export default function Focus() {
    // ── State ──
    const [current, setCurrent] = useState(0);
    const [nextIndex, setNextIndex] = useState(null);
    const [dir, setDir] = useState("next");
    const [transitioning, setTransitioning] = useState(false);

    // ── Refs ──
    const timerRef = useRef(null);
    const currentRef = useRef(current);
    const transitioningRef = useRef(false);

    // Keep refs in sync
    useEffect(() => { currentRef.current = current; }, [current]);
    useEffect(() => { transitioningRef.current = transitioning; }, [transitioning]);

    // ── Core slide trigger ──
    const triggerSlide = (direction) => {
        if (transitioningRef.current) return;

        const curr = currentRef.current;
        const total = featuredSlides.length;
        const next =
            direction === "next"
                ? (curr + 1) % total
                : (curr - 1 + total) % total;

        setDir(direction);
        setNextIndex(next);
        setTransitioning(true);

        setTimeout(() => {
            setCurrent(next);
            setNextIndex(null);
            setTransitioning(false);
        }, TRANSITION_DURATION);
    };

    // ── Autoplay ──
    const startAutoplay = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            triggerSlide("next");
        }, AUTOPLAY_DELAY);
    };

    useEffect(() => {
        startAutoplay();
        return () => clearInterval(timerRef.current);
    }, []); // ✅ FIX: run only once, refs handle fresh values

    // ── Dot navigation ──
    const goTo = (index) => {
        if (index === currentRef.current || transitioningRef.current) return;
        const direction = index > currentRef.current ? "next" : "prev";
        setDir(direction);
        setNextIndex(index);
        setTransitioning(true);
        setTimeout(() => {
            setCurrent(index);
            setNextIndex(null);
            setTransitioning(false);
        }, TRANSITION_DURATION);
    };

    // ── Render helpers ──
    const exitingSlide  = transitioning ? featuredSlides[current]   : null;
    const enteringSlide = transitioning ? featuredSlides[nextIndex]  : null;
    const activeSlide   = !transitioning ? featuredSlides[current]   : null;

    return (
        <div className="Focus-main-container">

            {/* ===== Features Section ===== */}
            <div className="Features-Section">
                <div className="Focus">
                    <div className="container-fluid">
                        <div className="row">
                            {[
                                { icon: "/futara-icons-Cruelty-free.png", label: <>Cruelty <br /> Free</> },
                                { icon: "/futara-icons-ethical.png", label: "Ethical" },
                                { icon: "/futara-icons-Non-Toxic.png", label: "Non-Toxic" },
                                { icon: "/futara-icons-Phthalate-free.png", label: <>Phthalate <br /> Free</> },
                            ].map((item, i) => (
                                <div key={i} className="col-lg-3 col-md-3 col-sm-6 col-6">
                                    <div className="Features-Section-Box">
                                        <div className="Features-Section-image">
                                            <img src={item.icon} alt="" />
                                        </div>
                                        <div className="Features-Section-text">{item.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Latest Stories Section ===== */}
            <div className="Latest-Stories-Section">
                <div className="container-fluid">
                    <div className="row g-4">

                        {/* LEFT — story cards */}
                        <div className="col-lg-6 col-12">
                            <h2 className="Latest-Stories-Heading">Performance & Features</h2>
                            <div className="Story-Cards-Stack">
                                {stories.map((story) => (
                                    <div className="Story-Card" key={story.id}>
                                        <div className="Story-Card-Thumb">
                                            <img src={story.image} alt={story.title} />
                                        </div>
                                        <div className="Story-Card-Body">
                                            <h3 className="Story-Card-Title">{story.title}</h3>
                                            <h3 className="Story-Card-excerpt">{story.excerpt}</h3>
                                            {story.explore && (
                                                <div className="Story-Card-explore">
                                                    <a href="/Preformance">
                                                        {story.explore}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="Story-Card-container">
                                            <h5 className="Story-Card-SubTitle">{story.subtitle}</h5>
                                            <p className="Story-Card-Des">{story.des}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — Featured Slider */}
                        <div className="col-lg-6 col-12">
                            <div
                                className="Featured-Slider"
                                onMouseEnter={() => clearInterval(timerRef.current)}
                                onMouseLeave={startAutoplay}
                            >
                                <div className="Featured-Slider-Viewport">

                                    {/* ✅ EXITING slide (old current) */}
                                    {transitioning && exitingSlide && (
                                        <div
                                            className={`Featured-Slide slide-exit-${dir}`}
                                            key={`exit-${current}`}
                                        >
                                            <SlideContent slide={exitingSlide} isActive={false} />
                                        </div>
                                    )}

                                    {/* ✅ ENTERING slide (new nextIndex) */}
                                    {transitioning && enteringSlide && (
                                        <div
                                            className={`Featured-Slide slide-enter-${dir}`}
                                            key={`enter-${nextIndex}`}
                                        >
                                            <SlideContent slide={enteringSlide} isActive={false} />
                                        </div>
                                    )}

                                    {/* ✅ ACTIVE slide (after transition) */}
                                    {!transitioning && activeSlide && (
                                        <div
                                            className="Featured-Slide slide-active"
                                            key={`active-${current}`}
                                        >
                                            <SlideContent slide={activeSlide} isActive={true} />
                                        </div>
                                    )}

                                </div>

                                {/* Prev Arrow */}
                                <button
                                    className="Slider-Arrow Slider-Arrow--prev"
                                    onClick={() => { clearInterval(timerRef.current); triggerSlide("prev"); startAutoplay(); }}
                                    aria-label="Previous slide"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2.2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>

                                {/* Next Arrow */}
                                <button
                                    className="Slider-Arrow Slider-Arrow--next"
                                    onClick={() => { clearInterval(timerRef.current); triggerSlide("next"); startAutoplay(); }}
                                    aria-label="Next slide"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2.2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>

                                {/* Dot indicators */}
                                <div className="Slider-Dots">
                                    {featuredSlides.map((slide, i) => (
                                        <button
                                            key={i}
                                            className={`Slider-Dot ${i === (transitioning ? nextIndex : current) ? "active" : ""} ${slide.type === "video" ? "Slider-Dot--video" : ""}`}
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

        </div>
    );
}