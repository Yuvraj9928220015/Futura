import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import "./Apollo.css";

const Apollo = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isTransitioning, setIsTransitioning] = useState(false);

    console.log(setSelectedCategory);
    console.log(setSearchTerm);

    // Sample data with categories
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            title: "Luxury Yacht Experience",
            subtitle: "Explore the ocean in style",
            description: "Discover the ultimate luxury with our premium yacht collection",
            category: "yacht"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2353&q=80",
            title: "Cape Town, Planted Pavilion",
            subtitle: "Find out more",
            description: "Experience sustainable architecture in harmony with nature",
            category: "architecture"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            title: "Modern Architecture",
            subtitle: "Contemporary living spaces",
            description: "Innovative design meets functional living",
            category: "architecture"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            title: "Scenic Mountain View",
            subtitle: "Nature's paradise",
            description: "Experience breathtaking mountain landscapes",
            category: "nature"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            title: "Urban Architecture",
            subtitle: "City living redefined",
            description: "Modern urban spaces for contemporary lifestyle",
            category: "architecture"
        }
    ];

    const projects = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Karuizawa, Hand in Hand House",
            description: "Find out more",
            category: "apollo"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Ocean Luxury Yacht",
            description: "Premium sailing experience",
            category: "americana"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Mountain Resort Villa",
            description: "Nature retreat destination",
            category: "americana"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Contemporary Urban Loft",
            description: "Modern city living",
            category: "marineRevolution"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Skyline Penthouse",
            description: "Luxury high-rise living",
            category: "Matrix"
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Private Yacht Charter",
            description: "Exclusive ocean adventures",
            category: "Polaris"
        },
        {
            id: 7,
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Karuizawa, Hand in Hand House",
            description: "Find out more",
            category: "promoRevolution"
        }
    ];

    // Smooth slide transition
    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setIsTransitioning(false);
        }, 150);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            setIsTransitioning(false);
        }, 150);
    };

    // Get previous and next slide indices
    const getPrevIndex = () => (currentSlide - 1 + slides.length) % slides.length;
    const getNextIndex = () => (currentSlide + 1) % slides.length;

    // Filter projects based on search and category
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    console.log(filteredProjects);

    // Auto-play functionality
    useEffect(() => {
        const autoPlay = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);

        return () => clearInterval(autoPlay);
    }, [isTransitioning]);

    return (
        <>
            <div className="About">
                <div className="About-Banner">
                    <img src="/About_Banner.jpg" alt="" />
                    <div className="About-Banner-overley">
                        <div className="About-title">Apollo</div>
                        <div className="About-des">Premium coated fabrics for automotive excellence.</div>
                    </div>
                </div>
            </div>
            <div className="product-wrapper">
                {/* Three Panel Slider */}
                <div className="threePanelSlider">
                    <div className="sliderContainer">

                        {/* Left Panel (Previous Slide) */}
                        <div
                            className={`panel leftPanel ${isTransitioning ? 'transitioning' : ''}`}
                            onClick={prevSlide}
                        >
                            <div className="panelImage">
                                <img
                                    src={slides[getPrevIndex()].image}
                                    alt={slides[getPrevIndex()].title}
                                    className="image"
                                />
                            </div>
                        </div>

                        {/* Center Panel (Current Slide) */}
                        <div className={`panel centerPanel ${isTransitioning ? 'transitioning' : ''}`}>
                            <div className="panelImage">
                                <img
                                    src={slides[currentSlide].image}
                                    alt={slides[currentSlide].title}
                                    className="image"
                                />
                                <div className="contentOverlay">
                                    <div className="slideContent">
                                        <h2 className="slideTitle">{slides[currentSlide].title}</h2>
                                        <p className="slideSubtitle">{slides[currentSlide].subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel (Next Slide) */}
                        <div
                            className={`panel rightPanel ${isTransitioning ? 'transitioning' : ''}`}
                            onClick={nextSlide}
                        >
                            <div className="panelImage">
                                <img
                                    src={slides[getNextIndex()].image}
                                    alt={slides[getNextIndex()].title}
                                    className="image"
                                />
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            className="navBtn prevBtn"
                            onClick={prevSlide}
                            disabled={isTransitioning}
                            aria-label="Previous slide"
                        >
                            <IoIosArrowRoundBack size={20} />
                        </button>

                        <button
                            className="navBtn nextBtn"
                            onClick={nextSlide}
                            disabled={isTransitioning}
                            aria-label="Next slide"
                        >
                            <IoIosArrowRoundForward size={20} />
                        </button>

                    </div>
                </div>

                {/* Projects Section */}
                <div className="Product-Container">
                    <div className="Product-Container-title">Apollo</div>

                    <div className="Product-Container-des">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div className="">
                                        <p><span>T</span>he ipsum dolor sit amet consectetur adipisicing elit. Magnam iste rem sequi repudiandae, labore distinctio aliquam consequatur, minima dolorem vel voluptates nemo voluptatum deleniti, minus magni tenetur! Sapiente, in consequatur.</p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam iste rem sequi repudiandae, labore distinctio aliquam consequatur, minima dolorem vel voluptates nemo voluptatum deleniti, minus magni tenetur! Sapiente, in consequatur.</p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam iste rem sequi repudiandae, labore distinctio aliquam consequatur, minima dolorem vel voluptates nemo voluptatum deleniti, minus magni tenetur! Sapiente, in consequatur.</p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam iste rem sequi repudiandae, labore distinctio aliquam consequatur, minima dolorem vel voluptates nemo voluptatum deleniti, minus magni tenetur! Sapiente, in consequatur. </p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam iste rem sequi repudiandae, labore distinctio aliquam consequatur, minima dolorem vel voluptates nemo voluptatum deleniti, minus magni tenetur! Sapiente, in consequatur.</p>
                                    </div>

                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div className="Product-Container-image">
                                        <img src="/New-Events.jpg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="projects-grid">
                        {filteredProjects.length === 0 ? (
                            <div className="no-projects">
                                <p>No projects found matching your criteria.</p>
                            </div>
                        ) : (
                            filteredProjects.map((project) => (
                                <div key={project.id} className="Projects-Box">
                                    <div className="project-image-wrapper">
                                        <a href="/Apollo">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="project-image"
                                            />
                                        </a>
                                        <div className="project-overlay"></div>
                                    </div>
                                    <div className="project-content">
                                        <div className="Projects-Box-main-heading">
                                            {project.title}
                                        </div>
                                        <div className="Projects-Box-main-des">
                                            {project.description}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Apollo;