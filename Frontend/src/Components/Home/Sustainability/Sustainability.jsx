import { useEffect, useState, useRef } from 'react';
import { FaCar, FaCouch } from "react-icons/fa";
import { GiWashingMachine } from "react-icons/gi";
import "./Sustainability.css";

// Yahan apni images aur videos ke path daalein
const backgroundMedia = [
    // { type: 'image', url: '/zz.jpg' },
    { type: 'video', url: '/SUSTAINABILITY-VIDEO.mp4' },
    // { type: 'image', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80' }
];

export default function Sustainability() {
    const [animatedValues, setAnimatedValues] = useState({
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
    });

    const [currentSlide, setCurrentSlide] = useState(0);

    const sustainabilityBoxRef = useRef(null);
    const animationTriggered = useRef(false);

    useEffect(() => {
        const slideTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundMedia.length);
        }, 3000);
        return () => clearInterval(slideTimer);
    }, []);

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

    return (
        <>
            <div className="conatiner-Sustainability">
                <div className="Sustainability-container">

                    {/* BACKGROUND LAYER: Images/Videos */}
                    <div className="bg-slider-wrapper">
                        {backgroundMedia.map((media, index) => (
                            <div key={index} className={`bg-slide ${index === currentSlide ? 'active' : ''}`}>
                                {media.type === 'image' ? (
                                    <img src={media.url} alt="background" />
                                ) : (
                                    <video src={media.url} autoPlay loop muted playsInline />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* <div className="bg-overlay-dark"></div> */}

                    <div className="sustainability-content-layer">

                        <div className="container-Sustainability-mrq">
                            <div className="scroll">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="marquee-group">
                                        <div className="item"><GiWashingMachine size={24} /> <span>3 Years Pink Stain Warranty</span></div>
                                        <div className="item"><FaCar size={24} /> <span>10 Years of OEM Excellence Zero Field Failure</span></div>
                                        <div className="item"><FaCouch size={24} /> <span>5 Years Performance Guarantee</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="Sustainability">
                                {/* <div className="row w-100">
                                   
                                    <div data-aos="zoom-out-up" className="col-lg-5 col-md-12 col-sm-12 col-12">
                                        <div className="Sustainability-main-info">
                                            <div className="Sustainability-title">Sustainability</div>
                                            <div className="Sustainability-des">
                                                At Mayur Uniquoters, every piece of leather is crafted with care.
                                                We blend Jaipur’s heritage craftsmanship with eco-conscious practices.
                                                Luxury and quality meet responsibility in every creation.
                                                Together, we make style kind to the planet and timeless in design.
                                            </div>
                                        </div>
                                    </div>

                                   
                                    <div data-aos="zoom-out-up" className="col-lg-7 col-md-12 col-sm-12 col-12" ref={sustainabilityBoxRef}>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                                <div className="Sustainability-Box-1">
                                                    <div className="Sustainability-Box-1-list">
                                                        <li className="Sustainability-Box-1-list-i-1"><img src="ChatGPT-3.png" alt="icon" /></li>
                                                        <li className="Sustainability-Box-1-list-title">{animatedValues.first}%</li>
                                                    </div>
                                                    <div className="Sustainability-Box-1-list-des">Renewable energy</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                                <div className="Sustainability-Box-1">
                                                    <div className="Sustainability-Box-1-list">
                                                        <li className="Sustainability-Box-1-list-i-2"><img src="ChatGPT-4.png" alt="icon" /></li>
                                                        <li className="Sustainability-Box-1-list-title">{animatedValues.second}%</li>
                                                    </div>
                                                    <div className="Sustainability-Box-1-list-des">Water recycled</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                                <div className="Sustainability-Box-1">
                                                    <div className="Sustainability-Box-1-list">
                                                        <li className="Sustainability-Box-1-list-i-3"><img src="ChatGPT-2.png" alt="icon" /></li>
                                                        <li className="Sustainability-Box-1-list-title">{animatedValues.third}%</li>
                                                    </div>
                                                    <div className="Sustainability-Box-1-list-des">Waste recycled</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                                <div className="Sustainability-Box-1">
                                                    <div className="Sustainability-Box-1-list">
                                                        <li className="Sustainability-Box-1-list-i-4"><img src="ChatGPT-1.png" alt="icon" /></li>
                                                        <li className="Sustainability-Box-1-list-title">{animatedValues.fourth}%</li>
                                                    </div>
                                                    <div className="Sustainability-Box-1-list-des">VOC reduction <span>+</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}