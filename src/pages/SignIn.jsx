import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to sign in');
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
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d1b3d', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: '#718096' }}>Sign in to continue your wellness journey</p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
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

                    <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                        <Link to="/forgot-password" style={{ color: '#718096', fontSize: '0.85rem', textDecoration: 'none' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="workout-theme"
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
                        Sign In <ArrowRight size={20} />
                    </motion.button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#718096' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#9333ea', fontWeight: '600', textDecoration: 'none' }}>
                        Sign Up
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
