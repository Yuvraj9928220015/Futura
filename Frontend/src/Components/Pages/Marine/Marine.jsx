import './Marine.css';
import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';


function Marine() {
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const videoRef = useRef(null);

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

    console.log(toggleVideoPlayback);

    return (
        <>
            <div className="Automotive">
                <div className="About">
                    <div className="About-Banner">
                        {/* <img src="/marine-2.png" alt="" /> */}
                        <video
                            src="/Marine-Video-2.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="About-Banner-video"
                        />
                        <div className="About-Banner-overley">
                            <div className="About-title">Marine</div>
                            <div className="About-des">Built for Waves. Styled for the World</div>
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
                                    <img src="/marine-1.png" alt="Luxury seating fabric" />
                                </div>
                            </div>
                            <div className="featured-item">
                                <div className="Contract-Box content-box">
                                    <div className="Contract-main-Box">
                                        {/* <span className="Contract-subtitle">Premium Quality</span> */}
                                        <h3 className="Contract-title">Segment Overview</h3>
                                        <p className="Contract-des">
                                            With close research into the latest design trends for marine applications, we create materials that reflect contemporary styling and performance expectations for marine upholsteries across the globe
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
                                        {/* <span className="Contract-subtitle">Performance Design</span> */}
                                        <h3 className="Contract-title">Futura Materials for the Marine Segment</h3>
                                        <p className="Contract-des">
                                            Backed by world-class technology, our wide-ranging collection is developed to withstand demanding marine conditions. The materials are UV stable and offer brilliant durability, making them highly suitable for marine upholstery environments
                                        </p>
                                        <div className="feature-list">
                                            <div className="Contract-des">Our marine collections bring together performance and design, offering materials that align with global marine upholstery needs. Each collection is created to deliver durability, UV stability, and trend-driven aesthetics tailored for marine settings</div>
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

                {/*  */}

                {/* <div className="Marine-Banner">
                    <div className="certificate-video">
                        <video
                            ref={videoRef}
                            src="certificate-video.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="background-video"
                        />

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

                        <div className="Marine-Banner-overley">
                            <div className="Marine-Banner-overley-title">Lorem, ipsum dolor.</div>
                            <div className="Marine-Banner-overley-des">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione necessitatibus, quos libero laboriosam <br />
                                harum maxime pariatur sint illum eveniet molestias fugit, quo a voluptas unde? <br />
                                Aperiam, necessitatibus. Aperiam, dignissimos praesentium.
                            </div>
                            <div className="Marine-Banner-overley-but">
                                <button>READ MORE</button>
                            </div>
                        </div>
                    </div>

                </div> */}

                {/*  */}

                <div className="Overview">
                    <div className="Section-Header">
                        <div className='About-Section-Heading'>Product Ranges</div>
                    </div>
                    <div data-aos="fade-up" className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="Overview-Box">
                                    <div className="Overview-Box-image">
                                        <img src="/acbf4.jpg" alt="" />
                                    </div>
                                    <div className="Overview-Box-contant">
                                        <div className="Overview-Box-contant-title">Apollo</div>
                                        <div className="Overview-Box-contant-des">
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            Fugit omnis eveniet molestias voluptatibus ullam expedita corporis illo quos
                                            repudiandae velit.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="Overview-Box">
                                    <div className="Overview-Box-image">
                                        <img src="/Mayur-1.jpg" alt="" />
                                    </div>
                                    <div className="Overview-Box-contant">
                                        <div className="Overview-Box-contant-title">Marine Revolution</div>
                                        <div className="Overview-Box-contant-des">
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            Fugit omnis eveniet molestias voluptatibus ullam expedita corporis illo quos
                                            repudiandae velit.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="Overview-Box">
                                    <div className="Overview-Box-image">
                                        <img src="/Mayur-2.jpg" alt="" />
                                    </div>
                                    <div className="Overview-Box-contant">
                                        <div className="Overview-Box-contant-title">Americana</div>
                                        <div className="Overview-Box-contant-des">
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            Fugit omnis eveniet molestias voluptatibus ullam expedita corporis illo quos
                                            repudiandae velit.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="Overview-Box">
                                    <div className="Overview-Box-image">
                                        <img src="/Mayur-4.jpg" alt="" />
                                    </div>
                                    <div className="Overview-Box-contant">
                                        <div className="Overview-Box-contant-title">Xtreme</div>
                                        <div className="Overview-Box-contant-des">
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            Fugit omnis eveniet molestias voluptatibus ullam expedita corporis illo quos
                                            repudiandae velit.
                                        </div>
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

export default Marine;