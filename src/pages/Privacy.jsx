import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
    return (
        <div className="policy-page-container">
            <header className="policy-header">
                <h1>Privacy Policy</h1>
                <p>Your privacy is our priority. Learn how we protect your data at Nexus Wellness.</p>
            </header>

            <section className="policy-section">
                <div className="privacy-intro">
                    <ShieldCheck size={48} className="privacy-icon-main" />
                    <h2>Commitment to Privacy</h2>
                    <p>
                        At Nexus Wellness, we believe that your health journey should be private. We are committed to transparency about how we collect, use, and protect your information.
                        Our goal is to provide a personalized wellness experience while ensuring your data remains secure.
                    </p>
                </div>
            </section>

            <section className="policy-section">
                <h2>Data We Collect</h2>
                <div className="privacy-grid">
                    <div className="privacy-item">
                        <Users className="mission-icon" />
                        <h3>Account Information</h3>
                        <p>When you sign up, we collect basic info like your name and email to manage your account and secure your data.</p>
                    </div>
                    <div className="privacy-item">
                        <Activity className="mission-icon" />
                        <h3>Wellness Preferences</h3>
                        <p>We collect data regarding your fitness level, dietary needs, and wellness goals to personalize your daily routines.</p>
                    </div>
                </div>
            </section>

            <section className="policy-section">
                <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    We use the Gemma 27 engine to generate personalized mini-workouts and recipes. Your inputs (mood,
                    preferences) are sent to the AI engine to create actionable content specifically for you. We do not use your personal information to train third-party AI models.
                </p>
            </section>

            <section className="policy-section">
                <h2>Security Measures</h2>
                <div className="security-list">
                    <div className="security-item">
                        <Lock size={20} />
                        <span>Encrypted data transmission and storage.</span>
                    </div>
                    <div className="security-item">
                        <Eye size={20} />
                        <span>Transparent data usage policies.</span>
                    </div>
                    <div className="security-item">
                        <FileText size={20} />
                        <span>Regular security audits and updates.</span>
                    </div>
                </div>
            </section>

            <section className="policy-section">
                <h2>Your Rights</h2>
                <p>
                    You have the right to access, correct, or delete your personal data at any time. If you have questions about your privacy or wish to exercise your rights, please contact our support team.
                </p>
            </section>

            <footer className="policy-footer">
                <Link to="/" className="back-home-btn">Back to Home</Link>
            </footer>
        </div>
    );
};

// Internal icons for privacy page
const Activity = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const Users = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export default Privacy;
