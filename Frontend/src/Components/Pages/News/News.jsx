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
            title: "Summer Architecture Workshop",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dignissim et turpis non hendrerit. Nunc nec lacinia tellus. Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
            image: "New-Events.jpg"
        },
        {
            date: {
                month: "JUL",
                day: "04"
            },
            title: "Independence Day Design Meet",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dignissim et turpis non hendrerit. Nunc nec lacinia tellus. Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
            image: "Mayur-2.jpg"
        },
        {
            date: {
                month: "AUG",
                day: "12"
            },
            title: "Modern Architecture Exhibition",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dignissim et turpis non hendrerit. Nunc nec lacinia tellus. Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
            image: "Mayur-5.jpg"
        },
        {
            date: {
                month: "SEP",
                day: "15"
            },
            title: "Sustainable Design Conference",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dignissim et turpis non hendrerit. Nunc nec lacinia tellus. Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
            image: "marine-cover-1.jpg"
        },
        {
            date: {
                month: "DEC",
                day: "11"
            },
            title: "Year End Architecture Showcase",
            location: "1015 California Ave, Los Angeles CA",
            time: "7:00 pm — 8:00 pm",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dignissim et turpis non hendrerit. Nunc nec lacinia tellus. Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
            image: "Mayur-3.jpg"
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
            {/* Hero Section */}
            <div className="About">
                <div className="About-Banner">
                    <img src="/Mayur-2.jpg" alt="" />
                    <div className="About-Banner-overley">
                        <div className="About-title">News & Events</div>
                        <div className="About-des">Premium coated fabrics for automotive excellence.</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-fluid px-5 py-3">
                {/* Section Header */}
                <div className="row">
                    <div className="col-12">
                        <div className="Section-Header">
                            <h2 className="About-Section-Heading">News & Events</h2>
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