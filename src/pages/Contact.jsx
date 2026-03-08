import React from 'react';
import { Mail, Linkedin, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        alert('Thank you for your message! This is a demo form.');
    };

    return (
        <div className="policy-page-container">
            <header className="policy-header">
                <h1>Contact Us</h1>
                <p>Have questions or feedback? We'd love to hear from you.</p>
            </header>

            <section className="policy-section">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Our team is here to support your journey to holistic wellness.</p>
                        
                        <div className="info-items">
                            <div className="info-item">
                                <Mail className="info-icon" />
                                <div>
                                    <h4>Email</h4>
                                    <p>support@nexuswellness.com</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Linkedin className="info-icon" />
                                <div>
                                    <h4>LinkedIn</h4>
                                    <a 
                                        href="https://www.linkedin.com/in/vaibhav-shingade-5bb329258/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="contact-link"
                                    >
                                        Vaibhav Shingade
                                    </a>
                                </div>
                            </div>
                            <div className="info-item">
                                <MapPin className="info-icon" />
                                <div>
                                    <h4>Location</h4>
                                    <p>Global / Remote</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" placeholder="Your Name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="your@email.com" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows="4" placeholder="How can we help?" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="policy-footer">
                <Link to="/" className="back-home-btn">Back to Home</Link>
            </footer>
        </div>
    );
};

export default Contact;
