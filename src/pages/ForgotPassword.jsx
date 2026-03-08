import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, HelpCircle, Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const { fetchSecurityQuestion, resetPassword } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Email, 2: Answer & New Password, 3: Success
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetchQuestion = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const q = await fetchSecurityQuestion(email);
            setQuestion(q);
            setStep(2);
        } catch (err) {
            setError(err.message || 'Could not find account');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await resetPassword(email, answer, newPassword);
            setStep(3);
        } catch (err) {
            setError(err.message || 'Reset failed');
        } finally {
            setLoading(false);
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
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d1b3d', marginBottom: '0.5rem' }}>
                        {step === 3 ? 'Success!' : 'Reset Password'}
                    </h2>
                    <p style={{ color: '#718096' }}>
                        {step === 1 && 'Enter your email to retrieve your security question'}
                        {step === 2 && 'Answer your security question to reset password'}
                        {step === 3 && 'Your password has been reset successfully'}
                    </p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleFetchQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
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
                                gap: '0.5rem'
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Find Account'}
                        </motion.button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>Security Question:</p>
                            <p style={{ fontSize: '1rem', color: '#2d1b3d', fontWeight: 'bold' }}>{question}</p>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <HelpCircle size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
                            <input
                                type="text"
                                placeholder="Your Answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
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
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
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
                                gap: '0.5rem'
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                        </motion.button>
                    </form>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#10b981', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <CheckCircle size={64} />
                        </div>
                        <Link
                            to="/signin"
                            className="meditation-theme"
                            style={{
                                display: 'block',
                                padding: '1rem',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                                fontWeight: '600'
                            }}
                        >
                            Back to Sign In
                        </Link>
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#718096' }}>
                    <Link to="/signin" style={{ color: '#ec4899', fontWeight: '600', textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
