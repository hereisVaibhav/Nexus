import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Utensils, Wind, User, Activity, Zap, LogOut, CheckCircle, Calendar, ArrowRight, Loader2, Lock, Apple, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPersistentDailyRoutine, generateWeeklyPlan } from '../utils/gemini';
import LoadingOverlay from '../components/LoadingOverlay';
import ExploreMenu from '../components/ExploreMenu';

const Dashboard = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [profileLoading, setProfileLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [generatingPlan, setGeneratingPlan] = useState(false);
    const [expandedItems, setExpandedItems] = useState({}); // Track expanded sections
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu toggle state

    const toggleSection = (dayIndex, section) => {
        setExpandedItems(prev => ({
            ...prev,
            [`${dayIndex}-${section}`]: !prev[`${dayIndex}-${section}`]
        }));
    };

    // Goal Selection State
    const [selectedGoal, setSelectedGoal] = useState('');
    const [duration, setDuration] = useState('');
    const [durationType, setDurationType] = useState('weeks'); // 'weeks' or 'days'

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setProfileLoading(false);
            }
        };

        if (user) fetchProfile();
    }, [user]);

    const handleGeneratePlan = async () => {
        if (!selectedGoal || !duration) return;
        setGeneratingPlan(true);

        try {
            // NEW: Generate a 7-day plan (now dynamic)
            const weeklyPlan = await generateWeeklyPlan(selectedGoal, duration, durationType);

            // Construct the plan object
            const planPayload = {
                wellness_goal: selectedGoal,
                plan_duration: `${duration} ${durationType}`,
                current_plan_data: {
                    ...weeklyPlan,
                    started_at: new Date().toISOString() // Track when the plan was started
                }
            };

            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/profile/update-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(planPayload)
            });

            if (res.ok) {
                // Refresh profile to show dashboard
                const updatedProfile = { ...profile, ...planPayload };
                setProfile(updatedProfile);
            } else {
                alert('Failed to save plan');
            }

        } catch (error) {
            console.error("Error generating plan", error);
            alert("Error generating plan. Please try again.");
        } finally {
            setGeneratingPlan(false);
        }
    };

    const handleDeletePlan = async () => {
        if (!window.confirm("Are you sure you want to delete your current plan? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/profile/delete-plan`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                // Clear profile plan data locally to trigger the "Create Plan" view
                setProfile({ ...profile, wellness_goal: null, plan_duration: null, current_plan_data: null });
            } else {
                alert('Failed to delete plan');
            }
        } catch (error) {
            console.error("Error deleting plan", error);
            alert("Error deleting plan");
        }
    };


    if (authLoading || profileLoading) {
        return (
            <div className="section-page" style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="ai-loader"></div>
            </div>
        );
    }

    if (!user) return null; // Should redirect via AuthContext protection or higher level route

    // --- MODE 1: GOAL SELECTION ---
    if (!profile?.current_plan_data) {
        return (
            <div className="section-page">
                <LoadingOverlay isVisible={generatingPlan} message="Nexus AI is crafting your weekly plan..." />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel"
                    style={{ maxWidth: '600px', margin: '2rem auto', padding: '3rem', borderRadius: '24px', textAlign: 'center' }}
                >
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2d1b3d' }}>Let's Build Your Plan</h1>
                    <p style={{ color: '#718096', marginBottom: '2.5rem' }}>
                        Tell us your goal and timeline, and our AI will craft a personalized wellness schedule just for you.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>

                        {/* 1. Select Goal */}
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem', color: '#4a5568' }}>1. What is your main goal?</label>
                            <div className="responsive-grid-2">
                                {['Weight Loss', 'Muscle Gain', 'Stress Reduction', 'Better Sleep'].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setSelectedGoal(g)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: selectedGoal === g ? '2px solid #9333ea' : '1px solid #e2e8f0',
                                            background: selectedGoal === g ? '#f3e8ff' : 'white',
                                            color: selectedGoal === g ? '#9333ea' : '#4a5568',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Select Duration */}
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem', color: '#4a5568' }}>2. Duration</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="number"
                                    placeholder="4"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        width: '80px',
                                        fontSize: '1.1rem',
                                        textAlign: 'center'
                                    }}
                                />
                                <select
                                    value={durationType}
                                    onChange={(e) => setDurationType(e.target.value)}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        flex: 1,
                                        fontSize: '1rem',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="weeks">Weeks</option>
                                    <option value="days">Days</option>
                                    <option value="months">Months</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleGeneratePlan}
                            disabled={!selectedGoal || !duration || generatingPlan}
                            className="workout-theme"
                            style={{
                                padding: '1.2rem',
                                borderRadius: '16px',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: (!selectedGoal || !duration || generatingPlan) ? 'not-allowed' : 'pointer',
                                opacity: (!selectedGoal || !duration || generatingPlan) ? 0.7 : 1,
                                marginTop: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {generatingPlan ? (
                                <>
                                    <Loader2 className="spin" size={24} /> Generating Plan...
                                </>
                            ) : (
                                <>
                                    Generate Plan <ArrowRight size={24} />
                                </>
                            )}
                        </button>

                    </div>
                </motion.div>
            </div>
        );
    }

    // --- MODE 2: ACTIVE DASHBOARD ---
    const fullPlanData = profile.current_plan_data;
    // Handle both old single-day format and new multi-day format for backward compatibility
    const isMultiDay = fullPlanData?.days && Array.isArray(fullPlanData.days);

    // Calculate Current Day Logic
    let currentDayIndex = 0;
    if (fullPlanData && (fullPlanData.started_at || profile.updated_at)) {
        const startDate = new Date(fullPlanData.started_at || profile.updated_at);
        const today = new Date();

        // Reset time part to ensure we count calendar days
        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const diffTime = now - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Ensure index is within bounds of the plan (e.g., if plan is 7 days and user is on day 8)
        const maxDays = isMultiDay ? fullPlanData.days.length : 1;
        currentDayIndex = Math.min(Math.max(0, diffDays), maxDays - 1);
    }

    const currentDayPlan = isMultiDay ? fullPlanData.days[currentDayIndex] : fullPlanData;

    // Quick helper to safely map dashboard cards
    const dashboardCards = [
        {
            title: 'Daily Workout',
            description: currentDayPlan?.workout?.title || 'Your daily customized workout',
            icon: Dumbbell,
            path: '/workouts',
            theme: 'workout-icon-bg',
            color: '#9333ea',
            stat: currentDayPlan?.workout?.duration || 'Ready'
        },
        {
            title: 'Daily Meal',
            description: currentDayPlan?.meal?.title || 'Your nutritious meal plan',
            icon: Utensils,
            path: '/meals',
            theme: 'meal-icon-bg',
            color: '#e84118',
            stat: currentDayPlan?.meal?.calories || 'View Plan'
        },
        {
            title: 'Meditation',
            description: currentDayPlan?.breathing?.title || 'Mindfulness session',
            icon: Wind,
            path: '/meditation',
            theme: 'breathing-icon-bg',
            color: '#ec4899',
            stat: currentDayPlan?.breathing?.duration || 'Start'
        }
    ];

    return (
        <div className="section-page">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h1 className="section-title" style={{ margin: 0 }}>
                            Good Morning, {user.name || profile.full_name?.split(' ')[0]}
                        </h1>
                        <span style={{
                            fontSize: '0.8rem',
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontWeight: '600'
                        }}>
                            Day 1 of {profile.plan_duration}
                        </span>
                    </div>
                    <p className="section-desc" style={{ marginBottom: 0 }}>
                        Today's Focus: <strong>{isMultiDay ? currentDayPlan.focus : profile.wellness_goal}</strong>
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={20} color="#fbbf24" fill="#fbbf24" />
                        <span style={{ fontWeight: '700', color: '#4a5568' }}>
                            {user.login_streak || 1} Day{(user.login_streak || 1) !== 1 ? 's' : ''} Streak
                        </span>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        title="Explore Nexus"
                        className="glass-panel"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '1px solid #e2e8f0',
                            color: '#4a5568'
                        }}
                    >
                        <Menu size={24} />
                    </button>

                    <button
                        onClick={logout}
                        title="Logout"
                        className="glass-panel"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '1px solid #fed7d7'
                        }}
                    >
                        <LogOut size={20} color="#e53e3e" />
                    </button>
                </div>
            </motion.div>

            {/* Plan Display Grid */}
            <div className="cards-grid">
                {dashboardCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigate(card.path)}
                        className="activity-card"
                        style={{ alignItems: 'flex-start', textAlign: 'left', minHeight: '220px', cursor: 'pointer' }}
                    >
                        <div className={`icon-wrapper ${card.theme}`} style={{ marginBottom: '1.5rem' }}>
                            <card.icon size={24} />
                        </div>

                        <h3 className="card-title-lg">{card.title}</h3>
                        <p className="card-desc" style={{ fontSize: '0.9rem' }}>{card.description}</p>

                        <div style={{
                            marginTop: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.8rem',
                            color: card.color,
                            fontWeight: '600',
                            background: 'rgba(0,0,0,0.03)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '12px'
                        }}>
                            <Activity size={14} />
                            {card.stat}
                        </div>
                    </motion.div>
                ))}
            </div>

            <ExploreMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Active Plan Details */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-panel"
                style={{ marginTop: '3rem', padding: '2rem', borderRadius: '24px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Calendar size={24} color="#4a5568" />
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#2d3748' }}>Your Plan Details</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleDeletePlan}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid #fed7d7',
                                background: '#fff5f5',
                                color: '#e53e3e',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Zap size={16} /> Delete Plan
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: '#718096', display: 'block', marginBottom: '0.25rem' }}>Current Goal</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#9333ea' }}>{profile.wellness_goal}</div>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: '#718096', display: 'block', marginBottom: '0.25rem' }}>Duration</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>{profile.plan_duration}</div>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: '#718096', display: 'block', marginBottom: '0.25rem' }}>Status</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Active <CheckCircle size={16} />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Weekly Schedule View */}
            {
                isMultiDay && (
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#2d1b3d' }}>Your Plan Schedule</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {fullPlanData.days.map((day, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-panel"
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        border: idx === currentDayIndex ? '2px solid #9333ea' : '1px solid transparent',
                                        opacity: idx > currentDayIndex ? 0.7 : 1,
                                        filter: idx > currentDayIndex ? 'grayscale(0.5)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#2d3748' }}>Day {day.day}: {day.focus}</h4>
                                            {idx === currentDayIndex && <span style={{ background: '#9333ea', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem' }}>Today</span>}
                                            {idx > currentDayIndex && <span style={{ background: '#cbd5e0', color: '#4a5568', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Lock size={12} /> Locked</span>}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

                                        {/* WORKOUT */}
                                        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', background: '#faf5ff', border: '1px solid #e9d8fd' }}>
                                            <div
                                                onClick={() => idx === currentDayIndex && toggleSection(idx, 'workout')}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: idx === currentDayIndex ? 'pointer' : 'default' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Dumbbell size={18} color={idx === currentDayIndex ? "#9333ea" : "#a0aec0"} />
                                                    <span style={{ fontWeight: '600', color: idx === currentDayIndex ? '#2d3748' : '#718096' }}>{day.workout.title}</span>
                                                </div>
                                                {idx === currentDayIndex && (
                                                    <span style={{ fontSize: '1.2rem', color: '#9333ea' }}>{expandedItems[`${idx}-workout`] ? '−' : '+'}</span>
                                                )}
                                            </div>

                                            {expandedItems[`${idx}-workout`] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #d6bcfa', fontSize: '0.9rem', color: '#4a5568' }}
                                                >
                                                    <p style={{ fontWeight: '600', color: '#6b46c1', marginBottom: '0.5rem' }}>Duration: {day.workout.duration}</p>
                                                    <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>{day.workout.warmup}</p>
                                                    <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                                        {day.workout.exercises && day.workout.exercises.length > 0 ? (
                                                            day.workout.exercises.map((ex, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{ex}</li>)
                                                        ) : (
                                                            <li>{day.workout.instructions || "Check detailed plan."}</li>
                                                        )}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* MEAL */}
                                        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', background: '#fff5f5', border: '1px solid #fed7d7' }}>
                                            <div
                                                onClick={() => idx === currentDayIndex && toggleSection(idx, 'meal')}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: idx === currentDayIndex ? 'pointer' : 'default' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Utensils size={18} color={idx === currentDayIndex ? "#e53e3e" : "#a0aec0"} />
                                                    <span style={{ fontWeight: '600', color: idx === currentDayIndex ? '#2d3748' : '#718096' }}>{day.meal.title}</span>
                                                </div>
                                                {idx === currentDayIndex && (
                                                    <span style={{ fontSize: '1.2rem', color: '#e53e3e' }}>{expandedItems[`${idx}-meal`] ? '−' : '+'}</span>
                                                )}
                                            </div>

                                            {expandedItems[`${idx}-meal`] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #feb2b2', fontSize: '0.9rem', color: '#4a5568' }}
                                                >
                                                    <p style={{ fontWeight: '600', color: '#c53030', marginBottom: '0.5rem' }}>Calories: {day.meal.calories}</p>
                                                    {day.meal.ingredients && (
                                                        <div style={{ marginBottom: '0.5rem' }}>
                                                            <strong style={{ fontSize: '0.85rem' }}>Ingredients:</strong>
                                                            <p style={{ margin: 0 }}>{day.meal.ingredients.join(', ')}</p>
                                                        </div>
                                                    )}
                                                    {day.meal.recipe ? (
                                                        <div>
                                                            <strong style={{ fontSize: '0.85rem' }}>Instructions:</strong>
                                                            <ol style={{ paddingLeft: '1.2rem', margin: '0.25rem 0 0' }}>
                                                                {day.meal.recipe.map((step, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{step}</li>)}
                                                            </ol>
                                                        </div>
                                                    ) : <p>{day.meal.instructions}</p>}
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* BREATHING */}
                                        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', background: '#fff0f6', border: '1px solid #fbcfe8' }}>
                                            <div
                                                onClick={() => idx === currentDayIndex && toggleSection(idx, 'breathing')}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: idx === currentDayIndex ? 'pointer' : 'default' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Wind size={18} color={idx === currentDayIndex ? "#db2777" : "#a0aec0"} />
                                                    <span style={{ fontWeight: '600', color: idx === currentDayIndex ? '#2d3748' : '#718096' }}>{day.breathing.title}</span>
                                                </div>
                                                {idx === currentDayIndex && (
                                                    <span style={{ fontSize: '1.2rem', color: '#db2777' }}>{expandedItems[`${idx}-breathing`] ? '−' : '+'}</span>
                                                )}
                                            </div>

                                            {expandedItems[`${idx}-breathing`] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #fbcfe8', fontSize: '0.9rem', color: '#4a5568' }}
                                                >
                                                    <p style={{ fontWeight: '600', color: '#b83280', marginBottom: '0.5rem' }}>Duration: {day.breathing.duration}</p>
                                                    {day.breathing.guide ? (
                                                        <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                                            {day.breathing.guide.map((step, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{step}</li>)}
                                                        </ol>
                                                    ) : <p>{day.breathing.instructions}</p>}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default Dashboard;
