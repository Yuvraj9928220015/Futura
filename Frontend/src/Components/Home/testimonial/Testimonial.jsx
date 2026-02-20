import { useState, useEffect } from 'react';
import './Testimonial.css';
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      title: "Futura Clients' Voices",
      subtitle: "Here's what our partners say about experiencing Futura materials real quality, real performance, real impact. From texture to performance, everything reflects innovation and attention to detail.",
      quote: "From texture to performance, everything reflects innovation and attention to detail.",
      description: "Truly reliable and future-ready materials. ",
      author: "Aryan",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format"
    },
    {
      id: 2,
      title: "Futura Clients' Voices",
      subtitle: "Here's what our partners say about experiencing Futura materials real quality, real performance, real impact. From texture to performance, everything reflects innovation and attention to detail.",
      quote: "Outstanding quality and exceptional service delivery that exceeds expectations every time.",
      description: "Professional grade materials with unmatched durability.",
      author: "Priya",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face&auto=format"
    },
    {
      id: 3,
      title: "Futura Clients' Voices",
      subtitle: "Here's what our partners say about experiencing Futura materials real quality, real performance, real impact. From texture to performance, everything reflects innovation and attention to detail.",
      quote: "Innovative solutions backed by cutting-edge technology and superior material science.",
      description: "Setting new standards in material excellence.",
      author: "Rahul",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&auto=format"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <>
      <div className="testimonial-container">
        <div className="testimonial-content">
          <div className="testimonial-left">
            <div className="testimonial-header">
              <div className="header-icon">
                <div className="icon-circle">
                  <span className="icon-text">FC</span>
                </div>
              </div>
              <h2 className="testimonial-title">{current.title}</h2>
            </div>

            <p className="testimonial-subtitle">
              {current.subtitle}
            </p>

            <div className="navigation-buttons">
              <button
                onClick={prevTestimonial}
                className="nav-button prev-button"
                aria-label="Previous testimonial"
              >
                <GoArrowLeft />
              </button>
              <button
                onClick={nextTestimonial}
                className="nav-button next-button"
                aria-label="Next testimonial"
              >
                <GoArrowRight />
              </button>
            </div>
          </div>

          <div className="testimonial-right">
            <div className="quote-section">

              <blockquote className="testimonial-quote">
                <div className="quote-icon">
                  <svg color='black' width="40" height="32" viewBox="0 0 40 32" fill="none">
                    <path d="M0 32h16V16H8c0-8.837 7.163-16 16-16V0C10.745 0 0 10.745 0 24v8zM32 16H24c0-8.837 7.163-16 16-16V0C26.745 0 16 10.745 16 24v8h16V16z" fill="currentColor" />
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
                      <span key={index} className="star">★</span>
                    ))}
                  </div>
                  <div className="author-name">{current.author}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;