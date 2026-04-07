import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import './Certificate.css';

const Certificate = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const videoRef = useRef(null);
  const animFrameRef = useRef(null);
  const autoplayRef = useRef(null);
  const isPausedRef = useRef(false);

  const AUTOPLAY_DELAY = 3000;

  const certifications = [
    {
      maintitle: "Global Standards and Certifications ",
      subtitle: "Our Commitment to Best Business Practices",
      certificateImage: "/futara-icons-certificate-1.png",
      title: "ISO",
      standard: "18001:2007",
      description: "Environmental",
      subDescription: " Management"
    },
    {
      maintitle: "Global Standards and Certifications ",
      subtitle: "Our Commitment to Best Business Practices",
      certificateImage: "/futara-icons-certificate-2.png",
      title: "ISO",
      standard: "14001:2015",
      description: "Quality",
      subDescription: " Management"
    },
    {
      maintitle: "Global Standards and Certifications ",
      subtitle: "Our Commitment to Best Business Practices",
      certificateImage: "/futara-icons-certificate-3.png",
      title: "ISO",
      standard: "45001:2018",
      description: "Occupational Health",
      subDescription: " & Safety"
    },
    {
      maintitle: "Global Standards and Certifications ",
      subtitle: "Our Commitment to Best Business Practices",
      certificateImage: "/futara-icons-certificate-5.png",
      title: "ISO",
      standard: "9001:2015",
      description: "Occupational Health",
      subDescription: " & Safety"
    },
    {
      maintitle: "Global Standards and Certifications ",
      subtitle: "Our Commitment to Best Business Practices",
      certificateImage: "/futara-icons-certificate-4.png",
      title: "IATF",
      standard: "16949:2016",
      description: "Automotive Quality",
      subDescription: " Management System"
    },
    {
      maintitle: "Global Standards and Certifications ",
      subtitle: "Our Commitment to Best Business Practices",
      certificateImage: "/futara-icons-certificate-6.png",
      title: "VDA",
      standard: "16949:2016",
      description: "Verband der",
      subDescription: "Automobilindustrie"
    }
  ];

  // ─── Animation (same as original) ────────────────────────────
  const animateTo = (startX, onDone) => {
    const duration = 650;
    const startTime = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setTranslateX(startX * (1 - easeOut(progress)));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setTranslateX(0);
        onDone();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  // ─── Core slide changer (same logic as original) ─────────────
  const changeSlide = useCallback((newIndex, direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const startX = direction === 'next' ? window.innerWidth : -window.innerWidth;

    setCurrentSlide(newIndex);
    setTranslateX(startX);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animateTo(startX, () => setIsAnimating(false));
      });
    });
  }, [isAnimating]);

  // ─── Autoplay ─────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentSlide((prev) => {
          const next = (prev + 1) % certifications.length;
          const startX = window.innerWidth;
          setIsAnimating(true);
          setTranslateX(startX);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              animateTo(startX, () => setIsAnimating(false));
            });
          });
          return next;
        });
      }
    }, AUTOPLAY_DELAY);
  }, [certifications.length]);

  useEffect(() => {
    startAutoplay();
    return () => {
      clearInterval(autoplayRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [startAutoplay]);

  // ─── Hover: pause / resume ────────────────────────────────────
  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };

  // ─── Navigation — resets autoplay timer on click ──────────────
  const nextSlide = () => {
    changeSlide((currentSlide + 1) % certifications.length, 'next');
    startAutoplay();
  };

  const prevSlideHandler = () => {
    changeSlide((currentSlide - 1 + certifications.length) % certifications.length, 'prev');
    startAutoplay();
  };

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    changeSlide(index, index > currentSlide ? 'next' : 'prev');
    startAutoplay();
  };

  // ─── Video toggle (original) ──────────────────────────────────
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      isVideoPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const cert = certifications[currentSlide];

  return (
    <>
      <div className="Main-slider-container">
        <div className="slider-outer-clip">
          {/* onMouseEnter/Leave on slider-container to pause/resume autoplay */}
          <div
            className="slider-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="slider-content">

              {/* LEFT: instant update, no animation */}
              <div className="static-left-wrapper">
                <div className="static-left-content">
                  <h1 className="certification-Product-Box-title">{cert.maintitle}</h1>
                  <p className="subtitle">{cert.subtitle}</p>
                  <div className="certification-btn">
                    <a href="/about"><button>Read More</button></a>
                  </div>
                </div>
              </div>

              {/* RIGHT: JS-driven translateX from viewport edge */}
              <div className="animated-right-content">
                <div
                  className="cert-slide"
                  style={{ transform: `translateX(${translateX}px)` }}
                >
                  <div className="Certificate-container-Box">
                    <img
                      src={cert.certificateImage}
                      alt={`${cert.title} ${cert.standard} Certificate`}
                      className="certificate-badge-image"
                    />
                    <div className="Certificate-container-content">
                      <div className="Certificate-container-title">{cert.title}</div>
                      <div className="Certificate-container-standard">{cert.standard}</div>
                      <div className="Certificate-container-description">{cert.description}</div>
                      <div className="Certificate-container-subDescription">{cert.subDescription}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button onClick={nextSlide} className="nav-arrow right" aria-label="Next slide">
              <ChevronRight className="arrow-icon" />
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;