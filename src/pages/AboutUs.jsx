import React from 'react';
import { Award, Target, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className="policy-page-container">
            <header className="policy-header">
                <h1>About Nexus Wellness</h1>
                <p>Empowering your journey to holistic health through AI and low-friction consistency.</p>
            </header>

            <section className="policy-section">
                <h2>Our Mission</h2>
                <div className="mission-grid">
                    <div className="mission-item">
                        <Target className="mission-icon" />
                        <h3>Actionable Integration</h3>
                        <p>We provide a holistic daily "dose" of wellness across multiple pillars—physical, mental, and nutritional—all in one place.</p>
                    </div>
                    <div className="mission-item">
                        <Heart className="mission-icon" />
                        <h3>Removing Friction</h3>
                        <p>We eliminate choice paralysis by telling you exactly what to do in just 15-20 minutes a day.</p>
                    </div>
                </div>
            </section>

            <section className="policy-section">
                <h2>The Problem We're Solving</h2>
                <p>
                    Existing wellness apps are often too complex, overwhelming users with excessive tracking, or heavily pay-walled before a habit can even be formed.
                    Consistency is hindered by choice paralysis; the modern world offers too many options, leading to burnout rather than balance.
                </p>
            </section>

            <section className="policy-section">
                <h2>Our Solution</h2>
                <p>
                    Nexus Wellness is an AI-guided daily wellness companion. We offer a guided, personalized daily routine that takes only 10-20 minutes to complete.
                    Each routine includes a mini-workout, a lifestyle tip, a breathing exercise, a healthy meal idea, and a "challenge of the day."
                </p>
                <p>
                    By leveraging AI (Gemini 1.5) to craft actionable, low-friction plans, we turn the struggle of consistency into a simple daily habit.
                </p>
            </section>

            <section className="policy-section founder-story">
                <h2>The Founder's Story</h2>
                <div className="founder-content">
                    <div className="founder-quote">
                        <blockquote>
                            "The reason I started this company is deeply personal. I struggled to maintain a consistent wellness routine while juggling multiple apps for meditation, workouts, and nutrition. The problem wasn’t an absence of tools; it was the friction of choice and the overwhelming complexity of existing platforms."
                        </blockquote>
                        <cite>— Vaibhav, Founder of Nexus Wellness</cite>
                    </div>
                    <p>
                        Vaibhav and Khalid, the founders of Nexus, recognized that wellness shouldn't be a chore. With backgrounds in building AI-powered consumer tools, they set out to create a platform that "just tells you what to do," removing all barriers to a healthier lifestyle.
                    </p>
                </div>
            </section>

            <footer className="policy-footer">
                <Link to="/" className="back-home-btn">Back to Home</Link>
            </footer>
        </div>
    );
};

export default AboutUs;
