import './Automotive.css';
import { useState } from 'react';

function Automotive() {
    const [hoveredImage, setHoveredImage] = useState(null);

    return (
        <>
            <div className="Automotive">
                <div className="About">
                    <div className="About-Banner">
                        <video
                            src="/Auto-Video.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="About-Banner-video"
                        />
                        <div className="About-Banner-overlay">
                            <div className="About-title">Automotive</div>
                            <div className="About-des">
                                Engineered Comfort. Enhanced Interiors
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Ranges Section */}
                <div className="Product-Ranges-Section">
                    <div className="Section-Header">

                    </div>
                    <div className="container-fluid">
                        <div data-aos="fade-right" className="featured-grid">
                            <div className="featured-item">
                                <div className="Contract-Box image-box">
                                    <img src="/Automotive-16.jpg" alt="Luxury seating fabric" />
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box content-box">
                                    <div className="Contract-main-Box">
                                        {/* <span className="Contract-subtitle">Premium Quality</span> */}
                                        <h3 className="Contract-title">Segment Overview</h3>
                                        <p className="Contract-des">
                                            We offer an excellent range of coated fabrics for the automotive industry. Our materials are designed to enhance the interiors of vehicles while delivering a luxurious effect with exceptional haptics.
                                        </p>
                                        <div className="feature-list">
                                            <div className="feature-item">✓ Advanced coating technology</div>
                                            <div className="feature-item">✓ Superior durability</div>
                                            <div className="feature-item">✓ Luxury comfort</div>
                                            <div className="feature-item">✓ Superior durability</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box content-box">
                                    <div className="Contract-main-Box">
                                        {/* <span className="Contract-subtitle">Performance Design</span> */}
                                        <h3 className="Contract-title">Futura Materials for the Automotive Segment</h3>
                                        <p className="Contract-des">
                                            Perforation is one of our key USPs, providing a constructive design element that adds both visual appeal and functional value. It offers outstanding permeability for car seatings, helping increase overall comfort. Our coated fabrics are crafted to elevate automotive interiors with a premium touch and refined feel</p>
                                        <div className="feature-list">
                                            <div className="Contract-des">Our product range brings together coated fabrics that enhance automotive interiors with luxury, comfort, and superior tactile experience. These collections are developed to integrate seamlessly into car seating and interior applications while delivering exceptional haptics and aesthetic enhancement</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box image-box">
                                    <img src="/Automotive-12.jpg" alt="Performance fabric" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Section */}
                {/* <div className="Premium-Section">
                    <div className="Section-Header">
                        <div className='About-Section-Heading'>Premium Collection</div>
                        <div className="premium-subtitle">Luxury Redefined</div>
                    </div>
                    <div className="container-fluid">
                        <div className="premium-grid">
                            <div className="premium-card">
                                <div className="premium-icon">
                                    <div className="icon-circle">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#FFD700" />
                                        </svg>
                                    </div>
                                </div>
                                <h3>Gold Standard</h3>
                                <p>Premium materials with unmatched durability and luxury finish for the most discerning automotive manufacturers.</p>
                            </div>
                            <div className="premium-card">
                                <div className="premium-icon">
                                    <div className="icon-circle">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <h3>Quality Assured</h3>
                                <p>Rigorous testing and quality control ensures every fabric meets international automotive standards.</p>
                            </div>
                            <div className="premium-card">
                                <div className="premium-icon">
                                    <div className="icon-circle">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M13 10V3L4 14H11L11 21L20 10H13Z" fill="#FF6B6B" />
                                        </svg>
                                    </div>
                                </div>
                                <h3>Innovation</h3>
                                <p>Cutting-edge technology and innovative design approaches that set new industry benchmarks.</p>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Product Overview */}
                <div className="Overview">
                    <div className="Section-Header">
                        <div className='About-Section-Heading'>Product Ranges</div>
                    </div>
                    <div data-aos="fade-up" className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="Overview-Box">
                                    <div className="Overview-Box-image">
                                        <img src="/image-1.png" alt="" />
                                    </div>
                                    <div className="Overview-Box-contant">
                                        <div className="Overview-Box-contant-title">Auto Revolution</div>
                                        <div className="Overview-Box-contant-des">
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            Fugit omnis eveniet molestias voluptatibus ullam expedita corporis illo quos
                                            repudiandae velit.
                                        </div>
                                        <button>View</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="Overview-Box">
                                    <div className="Overview-Box-image">
                                        <img src="/image-2.png" alt="" />
                                    </div>
                                    <div className="Overview-Box-contant">
                                        <div className="Overview-Box-contant-title">Automotive</div>
                                        <div className="Overview-Box-contant-des">
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            Fugit omnis eveniet molestias voluptatibus ullam expedita corporis illo quos
                                            repudiandae velit.
                                        </div>
                                        <button>View</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Automotive;