import { useEffect, useState, useRef } from 'react';
import { FaCar, FaCouch } from "react-icons/fa";
import { GiWashingMachine } from "react-icons/gi";
import "./Sustainability.css";

const backgroundMedia = {
    desktop: [
        { type: 'video', url: '/SUSTAINABILITY-VIDEO.mp4' },
    ],
    mobile: [
        { type: 'video', url: '/NEW-SUSTAINABILITY-VIDEO.mp4' },
    ],
};

export default function Sustainability() {
    const [animatedValues, setAnimatedValues] = useState({
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
    });

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isMobile, setIsMobile] = useState(null);
    const sustainabilityBoxRef = useRef(null);
    const animationTriggered = useRef(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const activeMedia = isMobile ? backgroundMedia.mobile : backgroundMedia.desktop;

    useEffect(() => {
        const slideTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeMedia.length);
        }, 3000);
        return () => clearInterval(slideTimer);
    }, [activeMedia.length]);

    useEffect(() => {
        const targets = { first: 38, second: 20, third: 92, fourth: 85 };
        const intervals = {};

        const animateValue = (key) => {
            let start = 0;
            const target = targets[key];
            const duration = 2000;
            const increment = target / (duration / 10);

            intervals[key] = setInterval(() => {
                start += increment;
                if (start >= target) {
                    start = target;
                    clearInterval(intervals[key]);
                }
                setAnimatedValues(prev => ({ ...prev, [key]: Math.ceil(start) }));
            }, 10);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationTriggered.current) {
                        animateValue('first');
                        animateValue('second');
                        animateValue('third');
                        animateValue('fourth');
                        animationTriggered.current = true;
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (sustainabilityBoxRef.current) {
            observer.observe(sustainabilityBoxRef.current);
        }

        return () => {
            for (const key in intervals) clearInterval(intervals[key]);
            if (sustainabilityBoxRef.current) observer.unobserve(sustainabilityBoxRef.current);
        };
    }, []);

    if (isMobile === null) {
        return null;
    }

    return (
        <>
            <div className="conatiner-Sustainability">

                {/* Marquee */}
                <div className="container-Sustainability-mrq">
                    <div
                        className={`scroll ${isPaused ? 'paused' : ''}`}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="marquee-group">
                                <div className="item"><GiWashingMachine size={24} /> <span>3 Years Pink Stain Warranty</span></div>
                                <div className="item"><FaCar size={24} /> <span>10 Years of OEM Excellence</span></div>
                                <div className="item"><FaCouch size={24} /> <span>5 Years Performance Guarantee</span></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main container */}
                <div className="Sustainability-main-container-fluid">

                    <div className="bg-slider-wrapper">
                        {activeMedia.map((media, index) => (
                            <div key={`${isMobile ? 'mobile' : 'desktop'}-${index}`} className={`bg-slide ${index === currentSlide ? 'active' : ''}`}>
                                {media.type === 'image' ? (
                                    <img src={media.url} alt="background" />
                                ) : (
                                    <video
                                        key={media.url}
                                        src={media.url}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="sustainability-content-layer">
                        <div className="Sustainability-main-container">
                            <div className="Sustainability">
                                {/* Content yahan aayega */}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}