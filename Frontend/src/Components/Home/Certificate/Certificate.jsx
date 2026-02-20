import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import './Certificate.css';

const Certificate = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  const certifications = [
    {
      maintitle: "Environmental Management",
      subtitle: "Sustainable Business Practices",
      certificateImage: "/futara-icons-certificate-1.png",
      title: "ISO",
      standard: "18001:2007",
      description: "Environmental",
      subDescription: " Management"
    },
    {
      maintitle: "Environmental Management",
      subtitle: "Excellence in Quality Standards",
      certificateImage: "/futara-icons-certificate-2.png",
      title: "ISO",
      standard: "14001:2015",
      description: "Quality",
      subDescription: " Management"
    },
    {
      maintitle: "Environmental Management",
      subtitle: "Workplace Safety Excellence",
      certificateImage: "/futara-icons-certificate-3.png",
      title: "ISO",
      standard: "45001:2018",
      description: "Occupational Health",
      subDescription: " & Safety"
    },
    {
      maintitle: "Environmental Management",
      subtitle: "Excellence in Automotive Standards",
      certificateImage: "/futara-icons-certificate-4.png",
      title: "IATF",
      standard: "16949:2016",
      description: "Automotive Quality",
      subDescription: " Management System"
    },
    {
      maintitle: "Environmental Management",
      subtitle: "Workplace Safety Excellence",
      certificateImage: "/futara-icons-certificate-5.png",
      title: "ISO",
      standard: "9001:2015",
      description: "Occupational Health",
      subDescription: " & Safety"
    },
    {
      maintitle: "Environmental Management",
      subtitle: "Excellence in Automotive Standards",
      certificateImage: "/futara-icons-certificate-6.png",
      title: "VDA",
      standard: "16949:2016",
      description: "Automotive Quality",
      subDescription: " Management System"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % certifications.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [certifications.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % certifications.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>  (prev - 1 + certifications.length) % certifications.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <>
      <div className="Main-slider-container">
        <div className="slider-container">
          {/* Main slider */}
          <div className="slider-content">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="slide-inner">
                  {/* Left content */}
                  <div className="slide-text-content">
                    <h1 className="certification-Product-Box-title">{cert.maintitle}</h1>
                    <p className="subtitle">{cert.subtitle}</p>
                  </div>

                  {/* Right certification badge - Image changes per certification */}
                  <div className="Certificate-container">
                    <div className="Certificate-container-Box">
                      <img 
                        src={cert.certificateImage} 
                        alt={`${cert.title} ${cert.standard} Certificate`} 
                        className="certificate-badge-image"
                      />
                      <div className="Certificate-container-content">
                        <div className="Certificate-container-title">
                          {cert.title}
                        </div>
                        <div className="Certificate-container-standard">
                          {cert.standard}
                        </div>
                        <div className="Certificate-container-description">
                          {cert.description}
                        </div>
                        <div className="Certificate-container-subDescription">
                          {cert.subDescription}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={prevSlide} className="nav-arrow left" aria-label="Previous slide">
            <ChevronLeft className="arrow-icon" />
          </button>

          <button onClick={nextSlide} className="nav-arrow right" aria-label="Next slide">
            <ChevronRight className="arrow-icon" />
          </button>

          {/* Dots indicator */}
          <div className="dots-container">
            {certifications.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Banner Section */}
      <div className="Marine-Banner">
        <div className="certificate-video">
          <video
            ref={videoRef}
            src="15687656-uhd_3840_2160_25fps_1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="background-video"
          />

          {/* Video Control Button */}
          <button
            onClick={toggleVideoPlayback}
            className="video-control-btn"
            aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
          >
            {isVideoPlaying ? (
              <Pause className="control-icon" />
            ) : (
              <Play className="control-icon" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Certificate;