import { useState, useEffect, useRef } from "react";
import "./Testimonial.css";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Play, Pause } from "lucide-react";

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animClass, setAnimClass] = useState("slide-in-next");
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isAnimating = useRef(false);
  const videoRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      title: "Futura Clients' Voices",
      subtitle:
        "Here's what our partners say about experiencing Futura materials real quality, real performance, real impact. From texture to performance, everything reflects innovation and attention to detail.",
      quote:
        "From texture to performance, everything reflects innovation and attention to detail.",
      description: "Truly reliable and future-ready materials.",
      author: "Aryan",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format",
    },
    {
      id: 2,
      title: "Futura Clients' Voices",
      subtitle:
        "Here's what our partners say about experiencing Futura materials real quality, real performance, real impact. From texture to performance, everything reflects innovation and attention to detail.",
      quote:
        "Outstanding quality and exceptional service delivery that exceeds expectations every time.",
      description: "Professional grade materials with unmatched durability.",
      author: "Priya",
      rating: 5,
      avatar:
        "https://i.pinimg.com/736x/42/27/2b/42272bb7560299c11b8e677b9a6e4dcb.jpg",
    },
    {
      id: 3,
      title: "Futura Clients' Voices",
      subtitle:
        "Here's what our partners say about experiencing Futura materials real quality, real performance, real impact. From texture to performance, everything reflects innovation and attention to detail.",
      quote:
        "Innovative solutions backed by cutting-edge technology and superior material science.",
      description: "Setting new standards in material excellence.",
      author: "Rahul",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&auto=format",
    },
  ];

  const changeTo = (newIndex, dir) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    setAnimClass("prepare");

    setTimeout(() => {
      setCurrentTestimonial(newIndex);
      setAnimClass(dir === "next" ? "slide-in-next" : "slide-in-prev");

      setTimeout(() => {
        isAnimating.current = false;
      }, 650);
    }, 50);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentTestimonial + 1) % testimonials.length;
      changeTo(nextIndex, "next");
    }, 6000);

    return () => clearInterval(interval);
  }, [currentTestimonial]);

  // Mobile/Desktop detect karne ke liye
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize(); // initial check
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const nextTestimonial = () => {
    const nextIndex = (currentTestimonial + 1) % testimonials.length;
    changeTo(nextIndex, "next");
  };

  const prevTestimonial = () => {
    const prevIndex =
      (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    changeTo(prevIndex, "prev");
  };

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const current = testimonials[currentTestimonial];

  return (
    <div className="testimonial-container">
      <div className="testimonial-content">

        {/* LEFT SIDE */}
        <div className="testimonial-left">
          <div className="testimonial-header">
            <div className="header-icon">
              <div className="icon-circle">
                <span className="icon-text">FC</span>
              </div>
            </div>
            <h2 className="testimonial-title">{current.title}</h2>
          </div>

          <p className="testimonial-subtitle">{current.subtitle}</p>

          <div className="navigation-buttons">
            <button
              onClick={prevTestimonial}
              className="nav-button prev-button"
            >
              <GoArrowLeft />
            </button>

            <button
              onClick={nextTestimonial}
              className="nav-button next-button"
            >
              <GoArrowRight />
            </button>
          </div>

          <div className="dot-indicators">
            {testimonials.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === currentTestimonial ? "dot-active" : ""
                  }`}
                onClick={() =>
                  changeTo(idx, idx > currentTestimonial ? "next" : "prev")
                }
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="testimonial-right">
          <div className={`animated-content ${animClass}`}>
            <div className="quote-section">
              <blockquote className="testimonial-quote">
                <div className="quote-icon">
                  <svg width="40" height="32" viewBox="0 0 40 32">
                    <path
                      d="M0 32h16V16H8c0-8.837 7.163-16 16-16V0C10.745 0 0 10.745 0 24v8zM32 16H24c0-8.837 7.163-16 16-16V0C26.745 0 16 10.745 16 24v8h16V16z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                {current.quote}
              </blockquote>

              <p className="testimonial-description">
                {current.description}
              </p>
            </div>

            <div className="author-section">
              <div className="author-info">
                <img
                  src={current.avatar}
                  alt={current.author}
                  className="author-avatar"
                />

                <div className="author-details">
                  <div className="rating">
                    <span className="rating-text">5.0/5</span>

                    {[...Array(current.rating)].map((_, index) => (
                      <span key={index} className="star">
                        ★
                      </span>
                    ))}
                  </div>

                  <div className="author-name">{current.author}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* VIDEO SECTION */}
      <div className="Marine-Banner">
        <div className="certificate-video">
          <video
            ref={videoRef}
            src={isMobile ? "New-Mobile-2.mp4" : "New-video-5.mp4"}
            autoPlay
            muted
            loop
            playsInline
            className="background-video"
          />

          <button
            onClick={toggleVideoPlayback}
            className="video-control-btn"
          >
            {isVideoPlaying ? (
              <Pause className="control-icon" />
            ) : (
              <Play className="control-icon" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;