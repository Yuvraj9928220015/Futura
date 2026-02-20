import "./Focus.css"

export default function Focus() {
    return (
        <>
            <div className="Focus-main-container">
                {/* Features Section */}
                <div className="Features-Section">
                    <div className="Focus">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                                    <div className="Features-Section-Box">
                                        <div className="Features-Section-image">
                                            <img src="/futara-icons-Cruelty-free.png" alt="" />
                                        </div>
                                        <div className="Features-Section-text">
                                            Cruelty <br /> Free
                                        </div>
                                    </div>
                                </div>
                                {/*  */}
                                <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                                    <div className="Features-Section-Box">
                                        <div className="Features-Section-image">
                                            <img src="/futara-icons-ethical.png" alt="" />
                                        </div>
                                        <div className="Features-Section-text">
                                            Ethical
                                        </div>
                                    </div>
                                </div>
                                {/*  */}
                                <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                                    <div className="Features-Section-Box">
                                        <div className="Features-Section-image">
                                            <img src="/futara-icons-Non-Toxic.png" alt="" />
                                        </div>
                                        <div className="Features-Section-text">
                                            Non-Toxic
                                        </div>
                                    </div>
                                </div>
                                {/*  */}
                                <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                                    <div className="Features-Section-Box">
                                        <div className="Features-Section-image">
                                            <img src="/futara-icons-Phthalate-free.png" alt="" />
                                        </div>
                                        <div className="Features-Section-text">
                                            Phthalate <br /> Free
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Section */}
                <div className="Focus-Product">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div data-aos="fade-right" className="col-lg-8 col-md-7 col-12">
                                <div className="Focus-Product-Image-Box">
                                    {/* Video with Image Poster (Image shows first) */}
                                    <video 
                                        className="product-video"
                                        poster="/Runabout-1.png"
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline
                                    >
                                        <source src="/Our-Product-video.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                            <div data-aos="fade-left" className="col-lg-4 col-md-5 col-12">
                                <div className="Focus-Product-Content-Box">
                                    <div className="Focus-Product-Box-title">
                                        Get to
                                        Know
                                        Our 
                                        Product
                                    </div>
                                    <div className="Explore-Features">
                                        <button className="explore-btn">Explore Features</button>
                                    </div>
                                    <div className="decorative-line"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}