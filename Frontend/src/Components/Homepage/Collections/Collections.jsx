import { Link } from "react-router-dom";
import './Collections.css';

const collections = [
    {
        img: '/Automotive-9.jpg',
        title: 'Automotive',
        desc: 'For All your Automotive Needs',
        path: '/automotive'
    },
    {
        img: '/marine-2.png',
        title: 'Marine',
        desc: 'For All your Marine Needs',
        path: '/marine'
    },
    {
        img: '/Product-Banner-1.png',
        title: 'Contract',
        desc: 'For All your Contract Furnishing Needs',
        path: '/contract'
    },
];

export default function Collections() {
    return (
        <div className="collections-container">
            <div className="collections-wrapper">

                {/* Hero Text */}
                <div className="content-section">
                    <div className="content-container">
                        <h2 className="collections-About-Section-Heading">
                            "Made to<span>Perform,</span>Designed to<span>Care.</span>"
                        </h2>
                        <p className="content-container-des">
                            At Futura, We specialize in PVC-coated fabrics designed to meet the diverse
                            needs of marine, contract furnishing, and automotive industries.
                        </p>
                    </div>
                </div>

                {/* Image Cards */}
                <div className="Perform-section">
                    <div className="collections-grid">
                        {collections.map((item) => (
                            <Link 
                                to={item.path} 
                                key={item.title} 
                                className="collections-wrapper-Box"
                            >
                                <img src={item.img} alt={item.title} />

                                <div className="collections-wrapper-Box-content">
                                    <div className="collections-wrapper-title">{item.title}</div>
                                    <div className="collections-wrapper-line" />
                                    <div className="collections-wrapper-des">{item.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}