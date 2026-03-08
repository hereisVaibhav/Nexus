import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Brain, Utensils, BarChart2, Star, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-page-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Elevate Your <span className="highlight-text">Life</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your all-in-one platform for physical vigor, mental clarity, and nutritional balance.
                        Join the Nexus Wellness community today.
                    </p>
                    <div className="hero-cta-group">
                        <Link to="/signup" className="primary-btn">
                            Get Started <ArrowRight size={20} />
                        </Link>
                        <Link to="/about" className="secondary-btn">
                            Learn More
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    {/* Abstract or geometric shape visuals could go here */}
                    <div className="blobs-container">
                        <div className="blob blob-1"></div>
                        <div className="blob blob-2"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Why Choose Nexus?</h2>
                    <p className="section-desc">Comprehensive tools to manage every aspect of your well-being.</p>
                </div>
                <div className="features-grid">
                    <FeatureCard
                        icon={<Activity />}
                        title="Personalized Workouts"
                        desc="Tailored exercise plans that adapt to your fitness level and goals."
                        color="var(--accent)"
                    />
                    <FeatureCard
                        icon={<Brain />}
                        title="Mental Clarity"
                        desc="Guided meditations and mindfulness exercises to reduce stress."
                        color="#a29bfe"
                    />
                    <FeatureCard
                        icon={<Utensils />}
                        title="Smart Nutrition"
                        desc="AI-powered meal plans and nutritional advice for a balanced diet."
                        color="#00b894"
                    />
                    <FeatureCard
                        icon={<BarChart2 />}
                        title="Progress Tracking"
                        desc="Visualize your journey with detailed analytics and insights."
                        color="#0984e3"
                    />
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing-section" style={{ padding: '6rem 2rem', background: '#f8fafc' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="section-title">Investment in Yourself</h2>
                    <p className="section-desc">Choose the plan that fits your wellness journey.</p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 400px))',
                    gap: '2.5rem',
                    justifyContent: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <PriceCard
                        title="Starter"
                        price="$0"
                        features={[
                            "Personalized Daily Workouts",
                            "Basic Nutrition Guidance",
                            "Community Access",
                            "Standard Progress Tracking"
                        ]}
                        isFeatured={false}
                        ctaText="Get Started"
                        ctaLink="/signup"
                    />
                    <PriceCard
                        title="Premium"
                        price="$10"
                        features={[
                            "Everything in Starter",
                            "AI-Generated Custom Meal Plans",
                            "Advanced Biometric Analytics",
                            "Early Access to New Features",
                            "Priority Update Notifications"
                        ]}
                        isFeatured={true}
                        ctaText="Connect on LinkedIn"
                        ctaLink="https://www.linkedin.com/in/vaibhav-shingade-5bb329258/"
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: '4rem', maxWidth: '700px', margin: '4rem auto 0' }}>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        <strong>Pre-Launch Opportunity:</strong> To get the paid access early, connect & message me on
                        <a href="https://www.linkedin.com/in/vaibhav-shingade-5bb329258/" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', textDecoration: 'none', fontWeight: '700', margin: '0 0.4rem' }}>Linkdin</a>
                        and start your premium journey & get new updates before everyone else.
                    </p>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <h2 className="section-title">Success Stories</h2>
                <div className="testimonials-grid">
                    <TestimonialCard
                        name="Alex Johnson"
                        role="Software Engineer"
                        quote="Nexus Wellness transformed my daily routine. The workout plans are perfect for my busy schedule."
                    />
                    <TestimonialCard
                        name="Sarah Williams"
                        role="Graphic Designer"
                        quote="The meditation sessions have been a game-changer for my focus and creativity. Highly recommended!"
                    />
                    <TestimonialCard
                        name="Michael Chen"
                        role="Entrepreneur"
                        quote="Finally, an app that integrates diet, exercise, and mental health. It's the complete package."
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to start your journey?</h2>
                    <p>Join thousands of users who have transformed their lives with Nexus Wellness.</p>
                    <Link to="/signup" className="cta-btn-large">
                        Join Now For Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-section">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <img src="/logo.png" alt="Nexus Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            <h3 style={{ margin: 0 }}>NEXUS WELLNESS</h3>
                        </div>
                        <p>Empowering your holistic health journey.</p>
                    </div>
                    <div className="footer-links">
                        <div className="link-column">
                            <h4>Company</h4>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/how-it-works">How it works</Link>
                        </div>
                        <div className="link-column">
                            <h4>Connect</h4>
                            <a href="#">Twitter</a>
                            <a href="#">Instagram</a>
                            <a href="https://www.linkedin.com/in/vaibhav-shingade-5bb329258/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Nexus Wellness. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

// Helper Components for Cleaner Code
const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="feature-card">
        <div className="feature-icon" style={{ color: color, backgroundColor: `${color}20` }}>
            {icon}
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

const PriceCard = ({ title, price, features, isFeatured, ctaText, ctaLink }) => (
    <div className={`pricing-card ${isFeatured ? 'featured' : ''}`} style={{
        padding: '2.5rem',
        borderRadius: '24px',
        background: isFeatured ? 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)' : 'white',
        color: isFeatured ? 'white' : '#1e293b',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: isFeatured ? '0 20px 40px rgba(147, 51, 234, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        transition: 'transform 0.3s ease'
    }}>
        {isFeatured && <span style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '700'
        }}>Most Popular</span>}

        <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{price}</span>
                <span style={{ fontSize: '1rem', opacity: 0.8 }}>/month</span>
            </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
            {features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                    <CheckCircle size={18} style={{ color: isFeatured ? 'white' : '#10b981' }} />
                    {f}
                </li>
            ))}
        </ul>

        {ctaLink.startsWith('http') ? (
            <a href={ctaLink} target="_blank" rel="noopener noreferrer" style={{
                padding: '1rem',
                borderRadius: '16px',
                border: 'none',
                background: isFeatured ? 'white' : '#1e293b',
                color: isFeatured ? '#9333ea' : 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
            }}>
                {ctaText}
            </a>
        ) : (
            <Link to={ctaLink} style={{
                padding: '1rem',
                borderRadius: '16px',
                border: 'none',
                background: isFeatured ? 'white' : '#1e293b',
                color: isFeatured ? '#9333ea' : 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
            }}>
                {ctaText}
            </Link>
        )}
    </div>
);

const TestimonialCard = ({ name, role, quote }) => (
    <div className="testimonial-card">
        <div className="quote-icon">❝</div>
        <p className="quote-text">{quote}</p>
        <div className="testimonial-author">
            <div className="author-avatar">{name[0]}</div>
            <div className="author-info">
                <h4>{name}</h4>
                <span>{role}</span>
            </div>
        </div>
    </div>
);

export default Home;
