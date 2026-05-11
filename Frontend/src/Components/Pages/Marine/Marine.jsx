import './Marine.css';
import { useNavigate } from 'react-router-dom';

const MARINE_PRODUCTS = [
    {
        title: 'Apollo',
        image: '/acbf4.jpg',
        description: 'Premium marine upholstery engineered for vessels that demand the highest standards of comfort and resilience.',
    },
    {

        title: ' Matrix',
        image: '/Mayur-1.jpg',
        description: 'Next-gen marine fabric with cutting-edge weaving technology and a rich color palette inspired by global oceanic trends.',
    },
    {
        title: 'Americana',
        image: '/Mayur-2.jpg',
        description: 'Classic American boating heritage meets supple hand-feel and rugged marine performance.',
    },
    {
        title: 'Xtreme',
        image: '/Mayur-4.jpg',
        description: 'Engineered for the most demanding marine environments — built to never fade, crack, or peel.',
    },
];

function Marine() {
    const navigate = useNavigate();

    const handleCategoryClick = (e, item) => {
        e.preventDefault();
        const slug = item.toLowerCase().replace(/\s+/g, '-');
        navigate(`/product?category=${slug}`);
    };

    return (
        <>
            <div className="Automotive">
                <div className="performance-Banner-container-line"></div>

                {/* ── Hero Banner ── */}
                <div className="About">
                    <div className="About-Banner">
                        <video
                            src="/Marine-Video-2.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="About-Banner-video"
                        />
                        <div className="About-Banner-overlay">
                            <div className="Contract-hero-content">
                                <h1 className="About-title">Marine</h1>
                                <p className="About-des">Performance You Feel. Durability You Trust</p>
                                <div className="Contract-hero-content-line"></div>
                            </div>
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
                                    <img src="/marine-1.png" alt="Luxury seating fabric" />
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box content-box">
                                    <div className="Contract-main-Box">
                                        <h3 className="Contract-title">Segment Overview</h3>
                                        <p className="Contract-des">
                                            With close research into the latest design trends for marine applications, we create
                                            materials that reflect contemporary styling and performance expectations for marine
                                            upholsteries across the globe
                                        </p>
                                        <div className="feature-list">
                                            <div className="feature-item">✓ Advanced coating technology</div>
                                            <div className="feature-item">✓ Superior durability</div>
                                            <div className="feature-item">✓ Luxury comfort</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box content-box">
                                    <div className="Contract-main-Box">
                                        <h3 className="Contract-title">Futura Materials for the Marine Segment</h3>
                                        <p className="Contract-des">
                                            Backed by world-class technology, our wide-ranging collection is developed to withstand
                                            demanding marine conditions. The materials are UV stable and offer brilliant durability,
                                            making them highly suitable for marine upholstery environments
                                        </p>
                                        <div className="feature-list">
                                            <div className="Contract-des">
                                                Our marine collections bring together performance and design, offering materials that
                                                align with global marine upholstery needs. Each collection is created to deliver
                                                durability, UV stability, and trend-driven aesthetics tailored for marine settings
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box image-box">
                                    <img src="/WhatsApp-1.jpg" alt="Performance fabric" />
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
                            {MARINE_PRODUCTS.map(({ title, image, description }) => (
                                <div key={title} className="col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="Overview-Box">
                                        <div className="Overview-Box-image">
                                            <img src={image} alt={title} />
                                        </div>
                                        <div className="Overview-Box-contant">
                                            <div className="Overview-Box-contant-title">{title}</div>
                                            <div className="Overview-Box-contant-des">{description}</div>
                                            {/* Exact same as Navbar handleCategoryClick */}
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

export default Marine;