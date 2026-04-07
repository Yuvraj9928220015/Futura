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
                    <div className="Focus-Product-Inner">

                        {/* LEFT — Image / Video */}
                        <div data-aos="fade-right" className="Focus-Product-Media">
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

                        {/* RIGHT — Content */}
                        <div data-aos="fade-left" className="Focus-Product-Content">
                            <h2 className="Focus-Product-Title">
                                Get to<br />
                                Know<br />
                                Our<br />
                                Product
                            </h2>

                            <a href="/Preformance">
                                <button className="explore-btn">Explore Features</button>
                            </a>

                            <div className="decorative-line"></div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}