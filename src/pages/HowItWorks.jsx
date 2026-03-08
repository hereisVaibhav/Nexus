import React from 'react';
import { Activity, Brain, Utensils, BarChart2, CheckCircle, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    return (
        <div className="policy-page-container">
            <header className="policy-header">
                <h1>How It Works</h1>
                <p>Discover how Nexus Wellness empowers your holistic health journey through our core features.</p>
            </header>

            <section className="policy-section">
                <div className="privacy-intro">
                    <Layers size={48} className="privacy-icon-main" />
                    <h2>Comprehensive Wellness Toolkit</h2>
                    <p>
                        Nexus Wellness is designed to be your all-in-one platform for managing physical fitness, mental clarity, and nutritional balance.
                        Here is a detailed breakdown of how each section and feature works to help you achieve your goals.
                    </p>
                </div>
            </section>

            <section className="policy-section">
                <h2>Features & Sections</h2>

                <div className="feature-detail-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <BarChart2 style={{ color: '#0984e3' }} />
                        <h3>1. Dashboard</h3>
                    </div>
                    <p>
                        <strong>How it works:</strong> The Dashboard is your central hub. It provides an overview of your weekly progress, upcoming meals, and recent activity. It aggregates data from your workouts, meditation sessions, and diet plans to give you a quick snapshot of your holistic health status.
                    </p>
                </div>

                <div className="feature-detail-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <Activity style={{ color: 'var(--accent)' }} />
                        <h3>2. Workouts</h3>
                    </div>
                    <p>
                        <strong>How it works:</strong> The Workouts section generates personalized exercise routines based on your fitness goals, experience level, and available equipment. You can track completed workouts, view exercise demonstrations, and progressively increase the difficulty to ensure steady improvement.
                    </p>
                </div>

                <div className="feature-detail-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <Utensils style={{ color: '#00b894' }} />
                        <h3>3. Diet Plan & Meals</h3>
                    </div>
                    <p>
                        <strong>How it works:</strong> Powered by AI insights, this feature creates tailored nutritional plans. You input your dietary preferences (e.g., vegan, keto, balanced) and goals (weight loss, muscle gain), and the system generates daily meal recommendations complete with recipes and macro breakdowns.
                    </p>
                </div>

                <div className="feature-detail-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <Brain style={{ color: '#a29bfe' }} />
                        <h3>4. Meditation</h3>
                    </div>
                    <p>
                        <strong>How it works:</strong> Mental health is just as important as physical health. The Meditation section offers guided audio and text-based mindfulness exercises. Whether you need a quick stress-relief session or a deeper focus exercise, you can select routines that fit your current mood.
                    </p>
                </div>
            </section>

            <section className="policy-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <HelpCircle size={32} />
                    <h2>Frequently Asked Questions (Q/A)</h2>
                </div>

                <div className="qa-item" style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Q: Do I need prior experience to use the workout plans?</h4>
                    <p>A: Not at all! Nexus Wellness caters to all levels. When setting up your profile, simply select "Beginner," and our algorithms will tailor the exercises to match your starting point safely.</p>
                </div>

                <div className="qa-item" style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Q: Are the AI meal plans customizable?</h4>
                    <p>A: Yes. You can always regenerate a meal or adjust your dietary restrictions in your profile settings. The AI adapts to your changing preferences in real-time.</p>
                </div>

                <div className="qa-item" style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Q: How is my data protected?</h4>
                    <p>A: We use industry-standard encryption for all data transmission and storage. For more details on our data protection practices, please refer to our Privacy Policy.</p>
                </div>

                <div className="qa-item" style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Q: Can I access Nexus Wellness on my mobile device?</h4>
                    <p>A: Yes, our platform is fully responsive and works beautifully on mobile browsers, ensuring you can take your workouts and meal plans wherever you go.</p>
                </div>
            </section>

            <footer className="policy-footer">
                <Link to="/" className="back-home-btn">Back to Home</Link>
            </footer>
        </div>
    );
};

export default HowItWorks;
