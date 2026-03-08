import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Activity, Ruler, Weight, User, ChevronRight, Loader2, Sparkles, CheckCircle, Calendar, Menu, RefreshCw, Lock, LockKeyhole } from 'lucide-react';
import { generateDietPlan, generateAlternativeMeal } from '../utils/gemini';
import LoadingOverlay from '../components/LoadingOverlay';
import ExploreMenu from '../components/ExploreMenu';
import { useAuth } from '../context/AuthContext';

const DietPlan = () => {
    const [formData, setFormData] = useState(() => {
        const cached = localStorage.getItem('nexus_diet_form');
        return cached ? JSON.parse(cached) : {
            age: '',
            gender: 'Male',
            height: '',
            weight: '',
            activity: 'Moderate',
            goal: 'Weight Loss',
            dietType: 'Vegetarian',
            duration: 'Weekly',
            macros: '',
            allergies: '',
            schedule: 'Standard 3 Meals',
            budget: 'Standard'
        };
    });

    const [dietPlan, setDietPlan] = useState(() => {
        const cached = localStorage.getItem('nexus_diet_plan');
        return cached ? JSON.parse(cached) : null;
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [step, setStep] = useState(() => {
        const cachedStep = localStorage.getItem('nexus_diet_step');
        if (cachedStep) return parseInt(cachedStep);
        const cachedPlan = localStorage.getItem('nexus_diet_plan');
        return cachedPlan ? 2 : 1;
    });

    const [selectedDay, setSelectedDay] = useState(() => {
        const cached = localStorage.getItem('nexus_diet_day');
        return cached ? parseInt(cached) : 1;
    });

    const [loading, setLoading] = useState(false);
    const [swappingMealIdx, setSwappingMealIdx] = useState(null);
    const { user } = useAuth();

    // Persist step changes
    useEffect(() => {
        localStorage.setItem('nexus_diet_step', step.toString());
    }, [step]);

    // Persist formData changes
    useEffect(() => {
        localStorage.setItem('nexus_diet_form', JSON.stringify(formData));
    }, [formData]);

    // Persist dietPlan changes
    useEffect(() => {
        if (dietPlan) {
            localStorage.setItem('nexus_diet_plan', JSON.stringify(dietPlan));
        } else {
            localStorage.removeItem('nexus_diet_plan');
        }
    }, [dietPlan]);

    // Persist selectedDay changes
    useEffect(() => {
        localStorage.setItem('nexus_diet_day', selectedDay.toString());
    }, [selectedDay]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const plan = await generateDietPlan(formData);
            setDietPlan(plan);
            setSelectedDay(1);
            setStep(2);
        } catch (error) {
            alert("Failed to generate diet plan. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwapMeal = async (mealIdx, mealData) => {
        if (!user || user.subscription !== 'paid') return;

        setSwappingMealIdx(mealIdx);
        try {
            const newMeal = await generateAlternativeMeal(mealData.type, mealData.calories, formData.dietType, mealData.ingredients);

            // Create a deep copy of the diet plan to mutate the specific meal
            const updatedDietPlan = JSON.parse(JSON.stringify(dietPlan));
            const dayIndex = updatedDietPlan.days.findIndex(d => d.day === selectedDay);

            if (dayIndex !== -1) {
                updatedDietPlan.days[dayIndex].meals[mealIdx] = {
                    ...updatedDietPlan.days[dayIndex].meals[mealIdx],
                    ...newMeal
                };
                setDietPlan(updatedDietPlan);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to swap meal. Please try again.");
        } finally {
            setSwappingMealIdx(null);
        }
    };

    const currentDayPlan = dietPlan?.days?.find(d => d.day === selectedDay);

    return (
        <div className="section-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 className="section-title" style={{ margin: 0 }}>Smart Diet Plan</h2>
                    <p className="section-desc">Get a nutrition strategy tailored to your unique body metrics and goals.</p>
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

            {step === 1 && (
                <div className="section-page-content">
                    <LoadingOverlay isVisible={loading} message="Nexus AI is analyzing your biometrics..." />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel"
                        style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', borderRadius: '24px' }}
                    >
                        <div className="responsive-grid-2">
                            {/* Age */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Age</label>
                                <div className="input-with-icon">
                                    <User size={18} color="#718096" />
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="25"
                                        className="simple-input"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Gender</label>
                                <select name="gender" className="simple-select" value={formData.gender} onChange={handleChange}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Height */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Height (cm)</label>
                                <div className="input-with-icon">
                                    <Ruler size={18} color="#718096" />
                                    <input
                                        type="number"
                                        name="height"
                                        placeholder="175"
                                        className="simple-input"
                                        value={formData.height}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Weight */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Weight (kg)</label>
                                <div className="input-with-icon">
                                    <Weight size={18} color="#718096" />
                                    <input
                                        type="number"
                                        name="weight"
                                        placeholder="70"
                                        className="simple-input"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Activity Level */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Activity Level</label>
                                <select name="activity" className="simple-select" value={formData.activity} onChange={handleChange}>
                                    <option>Sedentary (Little to no exercise)</option>
                                    <option>Lightly Active (Light exercise 1-3 days/week)</option>
                                    <option>Moderate (Moderate exercise 3-5 days/week)</option>
                                    <option>Very Active (Hard exercise 6-7 days/week)</option>
                                </select>
                            </div>

                            {/* Goal */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Main Goal</label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {['Weight Loss', 'Muscle Gain', 'Maintenance', 'Energy Boost'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, goal: g })}
                                            className={`goal-pill ${formData.goal === g ? 'active' : ''}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Diet Preference */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Diet Type</label>
                                <select name="dietType" className="simple-select" value={formData.dietType} onChange={handleChange}>
                                    <option>Vegetarian</option>
                                    <option>Non-Vegetarian</option>
                                    <option>Vegan</option>
                                    <option>Keto</option>
                                    <option>Paleo</option>
                                </select>
                            </div>

                            {/* Duration */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Duration</label>
                                <select name="duration" className="simple-select" value={formData.duration} onChange={handleChange}>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>

                            {/* PREMIUM SECTION DIVIDER */}
                            <div style={{ gridColumn: 'span 2', marginTop: '1rem', borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem', position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>Premium Biometrics</h3>
                                    {(!user || user.subscription !== 'paid') && (
                                        <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#fee2e2', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                                            <LockKeyhole size={14} /> Paid Feature
                                        </span>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem', marginBottom: '1.5rem' }}>Fine-tune your diet generation with pro constraints.</p>

                                <div className="responsive-grid-2" style={{ opacity: (!user || user.subscription !== 'paid') ? 0.6 : 1, pointerEvents: (!user || user.subscription !== 'paid') ? 'none' : 'auto' }}>

                                    {/* Macros */}
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Advanced Macros</label>
                                        <select name="macros" className="simple-select" value={formData.macros} onChange={handleChange} style={(!user || user.subscription !== 'paid') ? { backgroundColor: '#f1f5f9' } : {}}>
                                            <option value="">AI Default</option>
                                            <option value="High Protein (40P/40C/20F)">High Protein (40P/40C/20F)</option>
                                            <option value="Low Carb (30P/20C/50F)">Low Carb (30P/20C/50F)</option>
                                            <option value="Balanced Focus (30P/40C/30F)">Balanced Focus (30P/40C/30F)</option>
                                        </select>
                                    </div>

                                    {/* Budget */}
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Budget Tier</label>
                                        <select name="budget" className="simple-select" value={formData.budget} onChange={handleChange} style={(!user || user.subscription !== 'paid') ? { backgroundColor: '#f1f5f9' } : {}}>
                                            <option value="Standard">Standard</option>
                                            <option value="Student / Cheap">Student / Cheap</option>
                                            <option value="Premium / Organic">Premium / Organic</option>
                                        </select>
                                    </div>

                                    {/* Schedule */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Meal Frequency & Fasting</label>
                                        <select name="schedule" className="simple-select" value={formData.schedule} onChange={handleChange} style={(!user || user.subscription !== 'paid') ? { backgroundColor: '#f1f5f9' } : {}}>
                                            <option value="Standard 3 Meals">Standard 3 Meals a Day</option>
                                            <option value="5 Small Meals">5 Small Meals</option>
                                            <option value="Intermittent Fasting (16:8)">Intermittent Fasting (16:8 - Skip Breakfast)</option>
                                            <option value="OMAD (One Meal a Day)">OMAD (One Meal a Day)</option>
                                        </select>
                                    </div>

                                    {/* Allergies */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Allergies & Conditions</label>
                                        <input
                                            type="text"
                                            name="allergies"
                                            placeholder="e.g. Gluten-Free, Peanut Allergy, Low Sodium"
                                            className="simple-input"
                                            value={formData.allergies}
                                            onChange={handleChange}
                                            style={{
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '12px',
                                                height: '50px',
                                                padding: '0 1rem',
                                                backgroundColor: (!user || user.subscription !== 'paid') ? '#f1f5f9' : 'white'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !formData.age || !formData.height || !formData.weight}
                            className="generate-btn"
                            style={{ width: '100%', marginTop: '2rem' }}
                        >
                            {loading ? <Loader2 className="spin" /> : <Sparkles />}
                            {loading ? "Analyzing Biometrics..." : `Generate ${formData.duration} Plan`}
                        </button>
                    </motion.div>
                </div>
            )}

            {step === 2 && dietPlan && (
                <div className="diet-results">
                    {/* Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel"
                        style={{ padding: '2rem', borderRadius: '24px', marginBottom: '2rem', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: 'white' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', margin: 0 }}>{dietPlan.calories} kcal</h2>
                                <p style={{ margin: 0, opacity: 0.9 }}>Daily Target</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold' }}>{dietPlan.macros.protein}</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Protein</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold' }}>{dietPlan.macros.carbs}</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Carbs</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold' }}>{dietPlan.macros.fats}</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Fats</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Day Selection Tabs */}
                    <div className="day-selector-container">
                        <div className="day-selector">
                            {dietPlan.days.map((d) => (
                                <button
                                    key={d.day}
                                    className={`day-tab ${selectedDay === d.day ? 'active' : ''}`}
                                    onClick={() => setSelectedDay(d.day)}
                                >
                                    Day {d.day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Day Plan */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDay}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="day-plan-grid"
                        >
                            {currentDayPlan?.meals.map((meal, idx) => (
                                <div key={idx} className="glass-panel meal-card">
                                    <div className="meal-card-header">
                                        <h4 className="meal-type">{meal.type}</h4>
                                        <span className="meal-calories">{meal.calories}</span>
                                    </div>
                                    <h3 className="meal-suggestion">{meal.suggestion}</h3>
                                    <p className="meal-ingredients"><strong>Ingredients:</strong> {meal.ingredients}</p>
                                    <div className="meal-instructions">
                                        <strong>Instructions:</strong>
                                        <p>{meal.instructions}</p>
                                    </div>
                                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                        {(!user || user.subscription !== 'paid') ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                                                <button disabled className="swap-btn disabled" title="Upgrade to Paid to unlock Meal Swapping">
                                                    <Lock size={16} /> Premium Swap
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="swap-btn"
                                                onClick={() => handleSwapMeal(idx, meal)}
                                                disabled={swappingMealIdx === idx}
                                            >
                                                {swappingMealIdx === idx ? (
                                                    <Loader2 className="spin" size={16} />
                                                ) : (
                                                    <RefreshCw size={16} />
                                                )}
                                                {swappingMealIdx === idx ? 'Swapping...' : 'Swap Meal'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Tips */}
                    <div className="tips-section">
                        <h3 className="tips-title">Pro Tips for You</h3>
                        <div className="tips-grid">
                            {dietPlan.tips?.map((tip, i) => (
                                <div key={i} className="tip-item">
                                    <CheckCircle size={18} className="tip-icon" />
                                    <span>{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={() => setStep(1)}
                            className="back-btn"
                        >
                            Adjust Biometrics
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .section-page {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
                .input-with-icon {
                    display: flex;
                    align-items: center;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 0 1rem;
                    height: 50px;
                }
                .simple-input {
                    border: none;
                    outline: none;
                    padding: 0.5rem;
                    width: 100%;
                    font-size: 1rem;
                }
                .simple-select {
                    width: 100%;
                    height: 50px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 0 1rem;
                    font-size: 1rem;
                    background: white;
                    outline: none;
                }
                .goal-pill {
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #4a5568;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .goal-pill.active {
                    background: #fdf2f8;
                    border-color: #ec4899;
                    color: #ec4899;
                    font-weight: 600;
                }
                .generate-btn {
                    padding: 1rem;
                    background: #ec4899;
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .generate-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .generate-btn:hover:not(:disabled) {
                    background: #db2777;
                    transform: translateY(-2px);
                }
                .day-selector-container {
                    overflow-x: auto;
                    padding-bottom: 1rem;
                    margin-bottom: 2rem;
                    scrollbar-width: thin;
                    scrollbar-color: #ec4899 #f3f4f6;
                }
                .day-selector {
                    display: flex;
                    gap: 0.75rem;
                    white-space: nowrap;
                    padding: 0.25rem;
                }
                .day-tab {
                    padding: 0.6rem 1.25rem;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .day-tab:hover {
                    border-color: #ec4899;
                    color: #ec4899;
                }
                .day-tab.active {
                    background: #ec4899;
                    color: white;
                    border-color: #ec4899;
                    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
                }
                .day-plan-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .meal-card {
                    padding: 1.5rem;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                }
                .meal-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .meal-type {
                    margin: 0;
                    color: #ec4899;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.85rem;
                }
                .meal-calories {
                    font-size: 0.85rem;
                    background: #fdf2f8;
                    color: #ec4899;
                    padding: 2px 10px;
                    border-radius: 20px;
                    font-weight: 700;
                }
                .meal-suggestion {
                    margin: 0 0 1rem 0;
                    font-size: 1.4rem;
                    color: #1e293b;
                    font-weight: 800;
                    line-height: 1.2;
                }
                .meal-ingredients {
                    font-size: 0.95rem;
                    color: #475569;
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }
                .meal-instructions {
                    font-size: 0.95rem;
                    color: #334155;
                    line-height: 1.6;
                }
                .meal-instructions strong {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #1e293b;
                }
                .swap-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 12px;
                    border: 1px solid #cbd5e1;
                    background: transparent;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                }
                .swap-btn:hover:not(:disabled) {
                    background: #fdf2f8;
                    border-color: #ec4899;
                    color: #ec4899;
                }
                .swap-btn.disabled {
                    cursor: not-allowed;
                    background: #f1f5f9;
                }
                .tips-section {
                    background: #f8fafc;
                    padding: 2rem;
                    border-radius: 24px;
                    margin-bottom: 3rem;
                }
                .tips-title {
                    margin-top: 0;
                    margin-bottom: 1.5rem;
                    color: #1e293b;
                    font-size: 1.25rem;
                }
                .tips-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1rem;
                }
                .tip-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    color: #475569;
                    font-size: 1rem;
                }
                .tip-icon {
                    color: #10b981;
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                .back-btn {
                    padding: 0.8rem 2rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .back-btn:hover {
                    background: #f8fafc;
                    color: #1e293b;
                    border-color: #cbd5e1;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 640px) {
                    .day-plan-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default DietPlan;
