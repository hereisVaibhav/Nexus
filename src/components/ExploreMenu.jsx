import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    X,
    LayoutDashboard,
    Dumbbell,
    Wind,
    Utensils,
    Apple,
    LogOut,
    ShieldCheck,
    Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ExploreMenu = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto'; // Revert back to auto, not unset because some global css might rely on it
        }

        // Cleanup function in case component unmounts while modal is open
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const menuItems = [
        {
            title: 'Home',
            icon: Home,
            path: '/',
            color: '#3b82f6',
            desc: 'Return to landing page'
        },
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard',
            color: '#6366f1',
            desc: 'Your wellness overview'
        },
        {
            title: 'Workouts',
            icon: Dumbbell,
            path: '/workouts',
            color: '#9333ea',
            desc: 'Custom exercise routines'
        },
        {
            title: 'Meditation',
            icon: Wind,
            path: '/meditation',
            color: '#ec4899',
            desc: 'Find your inner peace'
        },
        {
            title: 'Nutrition',
            icon: Utensils,
            path: '/meals',
            color: '#e84118',
            desc: 'Healthy meal suggestions'
        },
        {
            title: 'Diet Plan',
            icon: Apple,
            path: '/diet-plan',
            color: '#10b981',
            desc: 'Personalized nutrition'
        }
    ];

    const isAdmin = user?.role === 'admin';

    const finalMenuItems = isAdmin ? [
        ...menuItems,
        {
            title: 'Admin Panel',
            icon: ShieldCheck,
            path: '/admin',
            color: '#ef4444',
            desc: 'System administration'
        }
    ] : menuItems;

    const handleLogout = () => {
        logout();
        onClose();
    };

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 1000
                        }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            height: '100vh',
                            width: '100%',
                            maxWidth: '400px',
                            background: 'white',
                            zIndex: 1001,
                            padding: '2rem',
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img src="/logo.png" alt="Nexus Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#2d1b3d' }}>Explore Nexus</h2>
                            </div>
                            <button
                                onClick={onClose}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568' }}
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {finalMenuItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    onClick={() => handleNavigation(item.path)}
                                    className="glass-panel"
                                    style={{
                                        padding: '1.25rem',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: `${item.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: item.color,
                                        flexShrink: 0
                                    }}>
                                        <item.icon size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, color: '#2d3748', fontSize: '1.1rem' }}>{item.title}</h4>
                                        <p style={{ margin: '0.1rem 0 0', color: '#718096', fontSize: '0.8rem' }}>{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '2rem', flexShrink: 0 }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    border: '1px solid #fed7d7',
                                    background: '#fff5f5',
                                    color: '#e53e3e',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <LogOut size={20} /> Logout
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ExploreMenu;
