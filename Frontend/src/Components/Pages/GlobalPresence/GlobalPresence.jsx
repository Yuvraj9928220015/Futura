import "./GlobalPresence.css"
import { FiArrowUpRight } from "react-icons/fi";


function GlobalPresence() {
    const collections = [
        {
            id: 1,
            name: 'Mondrian',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
            type: 'short'
        },
        {
            id: 2,
            name: 'Brera',
            image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
            type: 'tall'
        },
        {
            id: 3,
            name: 'Nirnia',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
            type: 'tall'
        },
        {
            id: 4,
            name: 'Alea Pro',
            image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
            type: 'short'
        },
        {
            id: 5,
            name: 'Artex',
            image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
            type: 'short'
        },
        {
            id: 6,
            name: 'Nirnia',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
            type: 'tall'
        }
    ];

    // 
    const blogItems = [
        {
            type: 'content',
            title: 'SMALL BUSINESS GOALS FOR THE YEAR',
            date: '',
            icon: '→'
        },
        {
            type: 'image',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=500&fit=crop',
            alt: 'Woman in white dress'
        },
        {
            type: 'content',
            title: 'STAYING MOTIVATED THROUGH THE WEEK',
            date: '',
            icon: '→'
        },
        {
            type: 'image',
            image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&h=500&fit=crop',
            alt: 'Flowers bouquet'
        },
        {
            type: 'image',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
            alt: 'Woman in white dress'
        },
        {
            type: 'content',
            title: 'RESOURCES FOR YOUR BUSINESS',
            date: '9/20/18',
            icon: '→'
        },
        {
            type: 'image',
            image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=500&fit=crop',
            alt: 'Woman with flowers'
        },
        {
            type: 'content',
            title: 'STEPPING UP YOUR BUSINESS GAME',
            date: '10/8/18',
            icon: '→'
        }
    ];

    return (
        <>
            <div className="GlobalPresence">
                {/* Hero Banner Section */}
                <div className="About">
                    <div className="About-Banner">
                        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80" alt="Global Presence Banner" />
                        <div className="About-Banner-overlay">
                            <div className="About-title">Global Presence</div>
                            <div className="About-des">Living spaces that blend form and function in perfect harmony</div>
                        </div>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="GlobalPresence-container">
                    {/* Section Title */}
                    <div className="section-header">
                        <div className="GlobalPresence-title">Global Presence</div>
                        <div className="GlobalPresence-subtitle">
                            Discover timeless elegance in every detail
                        </div>
                    </div>

                    <div className="container-fluid">
                        <div className="row g-4">
                            {/* Left Large Image */}
                            <div className="col-lg-8 col-md-12">
                                <div className="GlobalPresence-Box main-image-box">
                                    <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80" alt="Modern Interior" />
                                    <div className="image-overlay">
                                        <span className="badge">Designer Interior</span>
                                        <h3>Modern Minimalist</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side Cards */}
                            <div className="col-lg-4 col-md-12">
                                <div className="right-column">
                                    {/* Top Card - Into a gallery */}
                                    <div className="card-box gallery-card">
                                        <div className="card-content">
                                            <span className="small-badge">Aesthetic</span>
                                            <p className="card-subtitle">Experience the artistry where form meets function</p>
                                            <h3 className="card-title">Into a gallery of elegance</h3>
                                        </div>
                                    </div>

                                    {/* Bottom Card - Best Leather */}
                                    <div className="card-box Global-image-card">
                                        <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80" alt="Luxury Leather" />
                                        <div className="card-overlay">
                                            <span className="overlay-badge">Best Leather</span>
                                            <h4 className="overlay-title">A product line serving refined aesthetics and enduring quality</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="stats-section">
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="stat-item">
                                        <h2>500+</h2>
                                        <p>Products</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="stat-item">
                                        <h2>20+</h2>
                                        <p>Projects</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="stat-item">
                                        <h2>50+</h2>
                                        <p>Satisfied Customers</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="stat-item">
                                        <h2>1<sup>st</sup></h2>
                                        <p>Top To Rank</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Elegance Timeline Section - IMPROVED */}
                        <div className="row g-4 timeline-section">
                            <div className="col-lg-6 col-md-12">
                                <div className="timeline-image-wrapper">
                                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80" alt="Modern Style" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="timeline-content">
                                    <span className="section-badge">Elegance - Timeless</span>
                                    <h2 className="timeline-section-title">Modern Style Timeless Charm</h2>
                                    <p className="section-description">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas fugiat corporis expedita ad repudiandae, quod odit totam illum recusandae
                                        inventore nihil minus! Beatae ipsa eaque saepe eos dolores delectus enim excepturi cupiditate. Dolores aut praesentium quos recusandae
                                        repellat autem minima temporibus voluptas possimus, numquam necessitatibus architecto ut officia cupiditate molestiae eveniet rem
                                        dignissimos sunt quod cumque et enim, ducimus consequuntur.
                                    </p>
                                    <button className="cta-button">About Us → </button>
                                </div>
                            </div>
                        </div>

                        {/* Explore Collection Section */}
                        <div className="proudly-section">
                            <div className="row align-items-center">
                                <div className="col-lg-7 col-md-12 col-sm-12 col-12">
                                    <h2 className="proudly-title">Explore Our Proudly Collection</h2>
                                </div>
                                <div className="col-lg-5 col-md-12 col-sm-12 col-12">
                                    <div className="proudly-content">
                                        <button className="cta-button">View More →</button>
                                        <p className="proudly-description">
                                            Poliform will showcase its vision of contemporary architecture, interior design spaces, and innovative furniture design, that makes Italian luxury DNA.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* collection-section */}
                        <div className="collection-section">
                            <div className="container-fluid">
                                <div className="row">
                                    {/* Column 1 */}
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                                        <div className="explore-collection">
                                            <div className="explore-collection-box-1">
                                                <img src={collections[0].image} alt={collections[0].name} />
                                                <div className="collection-overlay">
                                                    <h3 className="collection-name">{collections[0].name}</h3>
                                                    <div className="collection-arrow">
                                                        <FiArrowUpRight />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="explore-collection-box-2">
                                                <img src={collections[1].image} alt={collections[1].name} />
                                                <div className="collection-overlay">
                                                    <h3 className="collection-name">{collections[1].name}</h3>
                                                    <div className="collection-arrow">
                                                        <FiArrowUpRight />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2 */}
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                                        <div className="explore-collection">
                                            <div className="explore-collection-box-2">
                                                <img src={collections[2].image} alt={collections[2].name} />
                                                <div className="collection-overlay">
                                                    <h3 className="collection-name">{collections[2].name}</h3>
                                                    <div className="collection-arrow">
                                                        <FiArrowUpRight />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="explore-collection-box-1">
                                                <img src={collections[3].image} alt={collections[3].name} />
                                                <div className="collection-overlay">
                                                    <h3 className="collection-name">{collections[3].name}</h3>
                                                    <div className="collection-arrow">
                                                        <FiArrowUpRight />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3 */}
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                                        <div className="explore-collection">
                                            <div className="explore-collection-box-1">
                                                <img src={collections[4].image} alt={collections[4].name} />
                                                <div className="collection-overlay">
                                                    <h3 className="collection-name">{collections[4].name}</h3>
                                                    <div className="collection-arrow">
                                                        <FiArrowUpRight />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="explore-collection-box-2">
                                                <img src={collections[5].image} alt={collections[5].name} />
                                                <div className="collection-overlay">
                                                    <h3 className="collection-name">{collections[5].name}</h3>
                                                    <div className="collection-arrow">
                                                        <FiArrowUpRight />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Engage */}

                        <div className="Engage-Section">
                            <div className="row g-4 timeline-section">
                                <div className="col-lg-6 col-md-12">
                                    <div className="timeline-content">
                                        <div className="timeline-section-subtitle">Lorem ipsum dolor sit amet.</div>
                                        <h2 className="timeline-section-title">Engage with Us in Conversation</h2>
                                        <p className="section-description">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis minus odio eaque quibusdam optio soluta molestiae ipsum
                                            error itaque voluptatem, voluptatum deleniti, repellendus debitis quis voluptates blanditiis laudantium? Numquam obcaecati
                                            nesciunt repudiandae provident qui quaerat harum nihil, doloremque maiores, dicta accusamus reiciendis iste ratione sit
                                            explicabo sequi! Unde, nulla repudiandae.
                                        </p>
                                        <button className="cta-button">About Us → </button>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-12">
                                    <div className="timeline-image-section">
                                        <div className="timeline-image-wrapper">
                                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80" alt="Modern Style" />
                                        </div>
                                        <div className="timeline-image-wrapper-2">
                                            <img src="/Rectangle-7.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  */}
                        <div className="blog-grid-container">
                            <div className="section-header">
                                <div className="blog-grid-container-title">Global Presence</div>
                                <div className="blog-grid-container-subtitle">
                                    Discover timeless elegance in every detail
                                </div>
                            </div>
                            <div className="blog-grid">
                                {blogItems.map((item, index) => (
                                    <div key={index} className={`blog-box ${item.type}`}>
                                        {item.type === 'image' ? (
                                            <div className="image-wrapper">
                                                <img src={item.image} alt={item.alt} />
                                            </div>
                                        ) : (
                                            <div className="Global-content-wrapper">
                                                <h3 className="blog-title">{item.title}</h3>
                                                {item.date && <p className="blog-date">{item.date}</p>}
                                                <div className="blog-icon">{item.icon}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default GlobalPresence;