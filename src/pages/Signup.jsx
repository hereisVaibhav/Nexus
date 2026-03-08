import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        securityQuestion: 'What was the name of your first pet?',
        securityAnswer: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Auto-lowercase the email as user types
        setFormData({ ...formData, [name]: name === 'email' ? value.toLowerCase() : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Email must be fully lowercase
        if (formData.email !== formData.email.toLowerCase()) {
            setError('Please enter your correct email ID — only lowercase letters are allowed (e.g. example@gmail.com or example@outlook.com).');
            return;
        }

        // Allowed domains
        const allowedDomains = ['gmail.com', 'outlook.com'];
        const emailParts = formData.email.split('@');

        if (emailParts.length !== 2 || !allowedDomains.includes(emailParts[1])) {
            setError('Please enter your correct email ID — only @gmail.com or @outlook.com addresses are accepted.');
            return;
        }

        // Password: min 6 chars, must have letters + numbers or special characters
        const pwd = formData.password;
        const hasLetter = /[a-zA-Z]/.test(pwd);
        const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
        if (pwd.length < 6 || !hasLetter || !hasNumberOrSpecial) {
            setError('Password must be at least 6 characters and include a mix of letters and numbers or special characters.');
            return;
        }

        try {
            await register(formData.fullName, formData.email, formData.password, formData.securityQuestion, formData.securityAnswer);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to sign up');
        }
    };

    return (
        <div className="section-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{ padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '400px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        src="/logo.png"
                        alt="Nexus Logo"
                        style={{ width: '80px', height: '80px', marginBottom: '1.5rem', objectFit: 'contain' }}
                    />
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d1b3d', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: '#718096' }}>Join us and start your wellness journey</p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address (lowercase only)"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1rem',
                                outline: 'none',
                                textTransform: 'lowercase'
                            }}
                        />
                    </div>

                    <div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password (min. 6 mixed characters)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#718096', marginTop: '0.4rem', paddingLeft: '0.25rem' }}>
                            🔒 Use at least 6 characters — mix letters, numbers &amp; special characters
                        </p>
                    </div>

                    <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '1rem', fontWeight: '500' }}>Account Recovery Question</p>

                        <div style={{ marginBottom: '1rem' }}>
                            <select
                                name="securityQuestion"
                                value={formData.securityQuestion}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: 'white',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#2d3748'
                                }}
                            >
                                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                <option value="In what city were you born?">In what city were you born?</option>
                                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                <option value="What high school did you attend?">What high school did you attend?</option>
                            </select>
                        </div>

                        <div>
                            <input
                                type="text"
                                name="securityAnswer"
                                placeholder="Your Answer (Required)"
                                value={formData.securityAnswer}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: 'white',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="meditation-theme"
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem'
                        }}
                    >
                        Sign Up <ArrowRight size={20} />
                    </motion.button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#718096' }}>
                    Already have an account?{' '}
                    <Link to="/signin" style={{ color: '#ec4899', fontWeight: '600', textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
