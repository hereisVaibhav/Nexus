import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { content } from '../data/predefinedContent';
import { getPersistentDailyRoutine } from '../utils/gemini';
import WellnessCard from '../components/WellnessCard';
import ActionDetail from '../components/ActionDetail';
import ExploreMenu from '../components/ExploreMenu';
import { Sparkles, BrainCircuit, Loader2, Menu, LockKeyhole } from 'lucide-react';
import { generateWorkout } from '../utils/gemini';

const Workouts = () => {
    const [dailyWorkout, setDailyWorkout] = useState(null);
    const [loadingDaily, setLoadingDaily] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [customWorkout, setCustomWorkout] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user } = useAuth();

    // Expanded Arrays for Free Users
    const levels = ['Beginner', 'Early Intermediate', 'Intermediate', 'Advanced', 'Pro', 'Elite'];
    const focusAreas = ['Full Body', 'Upper Body', 'Lower Body', 'Core & Abs', 'Cardio / HIIT', 'Mobility & Stretching', 'Chest & Triceps', 'Back & Biceps'];
    const durations = Array.from({ length: 12 }, (_, i) => `${(i + 1) * 5} min`); // 5 to 60 min

    // AI Form State
    const [formData, setFormData] = useState({
        level: 'Intermediate',
        type: 'Full Body',
        duration: '15 min',
        equipment: 'Bodyweight Only',
        goal: 'General Fitness'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchDaily = async () => {
            try {
                setLoadingDaily(true);
                const routine = await getPersistentDailyRoutine();
                setDailyWorkout(routine.workout);
            } catch (error) {
                console.error("Failed to fetch persistent workout:", error);
            } finally {
                setLoadingDaily(false);
            }
        };
        fetchDaily();
    }, []);


    const handleAction = (item) => {
        setSelectedItem(item);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await generateWorkout(formData);
            setCustomWorkout(result);
        } catch (error) {
            console.error("Failed to generate workout:", error);
            alert("Failed to generate workout. Please check your API key in .env");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="section-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h2 className="section-title" style={{ margin: 0 }}>Your Workouts</h2>
                    <p className="section-desc">Consistent movement is key to a healthy lifestyle.</p>
                </div>
                <button
                    onClick={() => setIsMenuOpen(true)}
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
            </div>

            <ExploreMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* AI Generator Section */}
            <div className="ai-generator-section" style={{ marginBottom: '3rem' }}>
                <div
                    className="ai-generator-card glass-panel"
                    style={{
                        background: '#39244a', // Dark purple background from screenshot
                        borderRadius: '24px',
                        color: 'white'
                    }}
                >
                    <div className="ai-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                        <div
                            className="ai-icon-wrapper"
                            style={{
                                background: 'rgba(255, 71, 87, 0.1)', // Soft red bg
                                color: '#ff4757', // Red icon
                                padding: '1rem',
                                borderRadius: '16px',
                                marginBottom: '1rem'
                            }}
                        >
                            <BrainCircuit size={32} />
                        </div>
                        <h3 className="ai-title" style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Workout generator</h3>
                    </div>

                    <div className="ai-inputs-grid">
                        <div className="ai-input-group">
                            <label style={{ color: '#c7a3d1', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Level & Focus Area</label>
                            <div className="responsive-grid-2">
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    style={{
                                        background: '#2d1b3d',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        color: 'white',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    style={{
                                        background: '#2d1b3d',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        color: 'white',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {focusAreas.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="ai-input-group">
                            <label style={{ color: '#c7a3d1', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Workout Duration</label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                style={{
                                    background: '#2d1b3d',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    color: 'white',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    width: '100%',
                                    fontSize: '1rem'
                                }}
                            >
                                {durations.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* PREMIUM SECTION DIVIDER */}
                        <div style={{ gridColumn: 'span 2', marginTop: '1rem', borderTop: '2px dashed rgba(255,255,255,0.2)', paddingTop: '2rem', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, color: '#10b981', fontSize: '1.1rem', fontWeight: '700' }}>Premium Parameters</h3>
                                {(!user || user.subscription !== 'paid') && (
                                    <span style={{ fontSize: '0.75rem', color: '#ff4757', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255, 71, 87, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                                        <LockKeyhole size={12} /> Paid Feature
                                    </span>
                                )}
                            </div>

                            <div className="responsive-grid-2 premium-section" style={{ opacity: (!user || user.subscription !== 'paid') ? 0.4 : 1, pointerEvents: (!user || user.subscription !== 'paid') ? 'none' : 'auto' }}>
                                {/* Equipment */}
                                <div className="ai-input-group">
                                    <label style={{ color: '#c7a3d1', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Equipment Access</label>
                                    <select
                                        name="equipment"
                                        value={formData.equipment}
                                        onChange={handleChange}
                                        style={{
                                            background: '#2d1b3d',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            color: 'white',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            width: '100%',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        <option value="Bodyweight Only">Bodyweight Only (No Equipment)</option>
                                        <option value="Dumbbells Only">Dumbbells Only</option>
                                        <option value="Resistance Bands">Resistance Bands</option>
                                        <option value="Kettlebells">Kettlebells</option>
                                        <option value="Full Gym Access">Full Gym Access</option>
                                    </select>
                                </div>

                                {/* Training Style Focus */}
                                <div className="ai-input-group">
                                    <label style={{ color: '#c7a3d1', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Training Goal focus</label>
                                    <select
                                        name="goal"
                                        value={formData.goal}
                                        onChange={handleChange}
                                        style={{
                                            background: '#2d1b3d',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            color: 'white',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            width: '100%',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        <option value="General Fitness">General Fitness (Balanced)</option>
                                        <option value="Hypertrophy (Muscle Growth)">Hypertrophy (Muscle Growth)</option>
                                        <option value="Explosive Power (Plyometrics)">Explosive Power (Plyometrics)</option>
                                        <option value="Fat Burn / High Heart Rate">Fat Burn / High Heart Rate</option>
                                        <option value="Endurance">Endurance (High Reps)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="ai-generate-btn"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(90deg, #ff4757, #ff6b81)',
                            color: 'white',
                            border: 'none',
                            padding: '1.25rem',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: '800',
                            marginTop: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                            opacity: isGenerating ? 0.7 : 1,
                            boxShadow: '0 10px 25px rgba(255, 71, 87, 0.4)'
                        }}
                    >
                        {isGenerating ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <Sparkles size={24} />
                        )}
                        {isGenerating ? 'AI is Thinking...' : 'Generate My Workout'}
                    </button>
                    <p style={{ textAlign: 'center', color: '#c7a3d1', fontSize: '0.8rem', marginTop: '1.5rem', fontStyle: 'italic' }}>AI-generated content. Perform exercises safely.</p>
                </div>
            </div>

            {/* Generated Item or Loading State */}
            {isGenerating && (
                <div className="mb-8">
                    <div className="shimmer-card">
                        <div className="shimmer-line title"><div className="shimmer-wrapper"></div></div>
                        <div className="shimmer-line desc"><div className="shimmer-wrapper"></div></div>
                        <div className="shimmer-line desc-short"><div className="shimmer-wrapper"></div></div>
                        <div className="shimmer-line meta"><div className="shimmer-wrapper"></div></div>
                        <div className="shimmer-line btn"><div className="shimmer-wrapper"></div></div>
                    </div>
                </div>
            )}

            {customWorkout && !isGenerating && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit className="text-emerald-500" size={20} />
                        <h3 className="text-lg font-bold text-gray-700">Your Custom Workout</h3>
                    </div>
                    <div className="center-grid">
                        <WellnessCard item={{ ...customWorkout, id: 'ai-w' }} onAction={handleAction} />
                    </div>
                </div>
            )}

            {loadingDaily && (
                <div className="mb-8">
                    <div className="shimmer-card">
                        <div className="shimmer-line title"><div className="shimmer-wrapper"></div></div>
                        <div className="shimmer-line btn"><div className="shimmer-wrapper"></div></div>
                    </div>
                </div>
            )}

            {!loadingDaily && dailyWorkout && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-yellow-500" size={20} />
                        <h3 className="text-lg font-bold text-gray-700">Today's Recommendation</h3>
                    </div>
                    <div className="center-grid">
                        <WellnessCard item={dailyWorkout} onAction={handleAction} />
                    </div>
                </div>
            )}


            <h3 className="text-lg font-bold text-gray-700 mb-4 mt-8">Explore All Workouts</h3>
            <div className="cards-grid">
                {content.workouts.map(workout => (
                    <WellnessCard key={workout.id} item={workout} onAction={handleAction} />
                ))}
            </div>

            {selectedItem && (
                <ActionDetail
                    item={selectedItem}
                    type="Workout"
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
};

export default Workouts;
