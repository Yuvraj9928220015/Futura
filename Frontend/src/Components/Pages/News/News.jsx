import React, { useState } from 'react';
import './News.css';

export default function News() {
    const [viewMode, setViewMode] = useState('list');

    const events = [
        {
            date: {
                month: "JUN",
                day: "23"
            },
            title: "Dubai International Boat Show 2025",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "Dubai International Boat Show 2026 is where the global yachting elite come together — a celebration of power, precision, and possibility on the water.",
            image: "News-image-1.jpg"
        },
        {
            date: {
                month: "JUL",
                day: "04"
            },
            title: "IBEX Boat Show 2025",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "This is my eighth year attending IBEX and I will attend it for all of time. It is the best opportunity to meet with long-time colleagues and new people who have come into the industry",
            image: "News-image-2.jpg"
        },
        {
            date: {
                month: "AUG",
                day: "12"
            },
            title: "Dubai International Boat Show 2024",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "The Dubai International Boat Show (DIBS) will hold its 32nd edition as the Middle East's top celebration of yachts, luxury lifestyles, and watersports from 8 – 12 April 2026. Over the years, DIBS has established itself as a global symbol of innovation and glamour, creating an unmatched stage where craft and creativity join the essence of the sea",
            image: "News-image-3.jpg"
        },
        {
            date: {
                month: "SEP",
                day: "15"
            },
            title: "Heimtextil 2024",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "Where trends, design and global business intertwine: Heimtextil is your platform for home and contract textiles and textile design. Experience innovative solutions for the entire interior design: with the Heimtextil Trends 27/28, visionary design by Patricia Urquiola, textile sustainability and order volumes of all sizes.",
            image: "News-image-4.webp"
        },
        {
            date: {
                month: "DEC",
                day: "11"
            },
            title: "IBEX Boat Show 2024",
            location: "The International BoatBuilders' Exhibition & Conference",
            time: "7:00 pm — 8:00 pm",
            description: "Join 7,500+ of your peers and take advantage of endless opportunities to engage with your community, exchange success stories, close deals, and build relationships that have a lasting impact on your business.",
            image: "News-image-5.jpg"
        },
        {
            date: {
                month: "DEC",
                day: "11"
            },
            title: "Mestrade 2024",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "Experience the future of marine innovation at Metstrade. This influential event brings together leisure marine professionals from over 135 countries to connect, collaborate and drive commerce across boatbuilding and marine technology.",
            image: "News-image-6.avif"
        }
    ];

    const renderListView = () => {
        return events.map((event, index) => (
            <div key={index} className="row list-event-row">
                {/* Date Column */}
                <div className="col-12 col-md-2">
                    <div className="list-event-date">
                        <div className="month">{event.date.month}</div>
                        <hr />
                        <div className="day">{event.date.day}</div>
                    </div>
                </div>

                {/* Image Column */}
                <div className="col-12 col-md-4 mb-3">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="list-event-image"
                    />
                </div>

                {/* Content Column */}
                <div className="col-12 col-md-6">
                    <div className="list-event-content">
                        <h3 className="list-event-title">{event.title}</h3>
                        <div className="list-event-details">
                            <div className="list-event-location">{event.location}</div>
                            <div className="list-event-time">{event.time}</div>
                        </div>
                        <p className="list-event-description">{event.description}</p>
                        <button className="view-details-btn">
                            View Event Details →
                        </button>
                    </div>
                </div>
            </div>
        ));
    };

    const renderGridView = () => {
        return (
            <div className="row">
                {events.map((event, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="event-card">
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="event-image"
                                />
                                <div className="event-date">
                                    <div className="month">{event.date.month}</div>
                                    <div className="day">{event.date.day}</div>
                                </div>
                            </div>
                            <div className="event-content">
                                <h3 className="event-title">{event.title}</h3>
                                <div className="event-location">{event.location}</div>
                                <div className="event-time">{event.time}</div>
                                <p className="event-description">{event.description}</p>
                                <button className="view-details-btn">
                                    View Event Details →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="news-container">

            {/* ✅ Hero Section - Video Banner */}
            {/* <div className="About">
                <div className="About-Banner">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="banner-video"
                    >
                        <source src="/New-video-2.mp4" type="video/mp4" />
                    </video>
                    <div className="About-Banner-overley">
                        <div className="About-title">Event & Exhibition</div>
                        <div className="About-des">Premium coated fabrics for automotive excellence.</div>
                    </div>
                </div>
            </div> */}

            {/* Main Content */}
            <div className="container-fluid px-5 py-3">
                {/* Section Header */}
                <div className="row">
                    <div className="col-12">
                        <div className="Section-Header">
                            <h2 className="News-About-Section-Heading">Event & Exhibition</h2>
                        </div>
                    </div>
                </div>

                {/* News Header with Toggle */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="news-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                            <h1 className="news-header-title mb-3 mb-md-0">Upcoming Events</h1>
                            <div className="view-toggle">
                                <button
                                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>LIST</span>
                                </button>
                                <button
                                    className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                        <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                        <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                        <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span>MODULES</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Display */}
                <div className="container-fluid px-0">
                    {viewMode === 'list' ? renderListView() : renderGridView()}
                </div>
            </div>
        </div>
    );
}