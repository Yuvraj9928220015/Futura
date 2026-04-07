import './Automotive.css';
import { useNavigate } from 'react-router-dom';

function Automotive() {
    const navigate = useNavigate();

    // ✅ Exact same logic as Navbar.jsx
    const handleCategoryClick = (e, item) => {
        e.preventDefault();
        const slug = item.toLowerCase().replace(/\s+/g, '-');
        navigate(`/product?category=${slug}`);
    };

    const productRanges = [
        {
            title: 'Auto Revolution',
            image: '/image-1.png',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit omnis eveniet molestias voluptatibus ullam expedita corporis illo quos repudiandae velit.',
        },
        {
            title: 'Automotive',
            image: '/image-2.png',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit omnis eveniet molestias voluptatibus ullam expedita corporis illo quos repudiandae velit.',
        },
    ];

    return (
        <>
            <div className="Automotive">
                <div className="performance-Banner-container-line"></div>

                {/* ── Hero Banner ── */}
                <div className="About">
                    <div className="About-Banner">
                        <video
                            src="/Auto-Video.mp4"
                            autoPlay muted loop playsInline
                            className="About-Banner-video"
                        />
                        <div className="About-Banner-overlay">
                            <div className="About-title">Automotive</div>
                            <div className="About-des">Engineered Comfort. Enhanced Interiors</div>
                        </div>
                    </div>
                </div>

                {/* ── Segment Overview ── */}
                <div className="Product-Ranges-Section">
                    <div className="Section-Header"></div>
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
                                        <h3 className="Contract-title">Segment Overview</h3>
                                        <p className="Contract-des">
                                            We offer an excellent range of coated fabrics for the automotive industry. Our materials
                                            are designed to enhance the interiors of vehicles while delivering a luxurious effect
                                            with exceptional haptics.
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
                                        <h3 className="Contract-title">Futura Materials for the Automotive Segment</h3>
                                        <p className="Contract-des">
                                            Perforation is one of our key USPs, providing a constructive design element that adds
                                            both visual appeal and functional value. It offers outstanding permeability for car
                                            seatings, helping increase overall comfort. Our coated fabrics are crafted to elevate
                                            automotive interiors with a premium touch and refined feel
                                        </p>
                                        <div className="feature-list">
                                            <div className="Contract-des">
                                                Our product range brings together coated fabrics that enhance automotive interiors
                                                with luxury, comfort, and superior tactile experience. These collections are
                                                developed to integrate seamlessly into car seating and interior applications while
                                                delivering exceptional haptics and aesthetic enhancement
                                            </div>
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

                {/* ── Product Ranges ── */}
                <div className="Overview">
                    <div className="Section-Header">
                        <div className="About-Section-Heading">Product Ranges</div>
                    </div>
                    <div data-aos="fade-up" className="container-fluid">
                        <div className="row">
                            {productRanges.map(({ title, image, description }) => (
                                <div key={title} className="col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="Overview-Box">
                                        <div className="Overview-Box-image">
                                            <img src={image} alt={title} />
                                        </div>
                                        <div className="Overview-Box-contant">
                                            <div className="Overview-Box-contant-title">{title}</div>
                                            <div className="Overview-Box-contant-des">{description}</div>
                                            {/* ✅ Exact same as Navbar.jsx handleCategoryClick */}
                                            <button onClick={(e) => handleCategoryClick(e, title)}>
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Automotive;