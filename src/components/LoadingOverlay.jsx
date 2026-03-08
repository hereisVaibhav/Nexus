import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

const LoadingOverlay = ({ isVisible, message = "Nexus AI is crafting your plan..." }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        textAlign: 'center',
                        padding: '2rem'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1.5rem'
                        }}
                    >
                        <div className="ai-loader-container" style={{ position: 'relative' }}>
                            <div className="ai-loader"></div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: '#9333ea'
                                }}
                            >
                                <Sparkles size={24} />
                            </motion.div>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: '#1a202c',
                                marginBottom: '0.5rem',
                                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {message}
                            </h2>
                            <p style={{ color: '#718096', fontWeight: '500' }}>
                                This usually takes a few seconds...
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            color: '#94a3b8',
                            fontSize: '0.9rem'
                        }}>
                            <Loader2 size={16} className="spin" />
                            <span>Processing Biometrics</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingOverlay;
