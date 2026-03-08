import React, { useState, useEffect } from 'react';
import { content } from '../data/predefinedContent';
import { getPersistentDailyRoutine } from '../utils/gemini';
import WellnessCard from '../components/WellnessCard';
import ActionDetail from '../components/ActionDetail';
import ExploreMenu from '../components/ExploreMenu';
import { Sparkles, BrainCircuit, Loader2, Menu, LockKeyhole } from 'lucide-react';
import { generateBreathing } from '../utils/gemini';


const Meditation = () => {
    const [dailyBreathing, setDailyBreathing] = useState(null);
    const [loadingDaily, setLoadingDaily] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [customBreathing, setCustomBreathing] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // AI Form State
    const [mood, setMood] = useState('Anxious');

    useEffect(() => {
        const fetchDaily = async () => {
            try {
                setLoadingDaily(true);
                const routine = await getPersistentDailyRoutine();
                setDailyBreathing(routine.breathing);
            } catch (error) {
                console.error("Failed to fetch persistent breathing:", error);
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
            const result = await generateBreathing(mood);
            setCustomBreathing(result);
        } catch (error) {
            console.error("Failed to generate breathing:", error);
            alert("Failed to generate breathing. Please check your API key in .env");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="section-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h2 className="section-title" style={{ margin: 0 }}>Guided Meditation</h2>
                    <p className="section-desc">Find your inner peace with these breathing techniques.</p>
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
                    className="ai-generator-card"
                    style={{
                        background: '#39244a',
                        borderRadius: '24px',
                        padding: '2rem 3rem',
                        color: 'white'
                    }}
                >
                    <div className="ai-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                        <div
                            className="ai-icon-wrapper"
                            style={{
                                background: 'rgba(255, 71, 87, 0.1)',
                                color: '#ff4757',
                                padding: '1rem',
                                borderRadius: '16px',
                                marginBottom: '1rem'
                            }}
                        >
                            <BrainCircuit size={32} />
                        </div>
                        <h3 className="ai-title" style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>AI Breathing Guide</h3>
                    </div>

                    <div className="ai-inputs-grid">
                        <div className="ai-input-group">
                            <label style={{ color: '#c7a3d1', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>How are you feeling?</label>
                            <select
                                className="ai-select"
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                style={{
                                    background: '#2d1b3d',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    color: 'white',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    width: '100%'
                                }}
                            >
                                <option>Anxious</option>
                                <option>Tired</option>
                                <option>Focus</option>
                                <option>Stressed</option>
                                <option>Restless</option>
                            </select>
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
                        {isGenerating ? 'AI is Thinking...' : 'Generate Technique'}
                    </button>
                    <p style={{ textAlign: 'center', color: '#c7a3d1', fontSize: '0.8rem', marginTop: '1.5rem', fontStyle: 'italic' }}>AI-generated content. Breathe at your own pace.</p>
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

            {customBreathing && !isGenerating && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit className="text-emerald-500" size={20} />
                        <h3 className="text-lg font-bold text-gray-700">Your Custom Technique</h3>
                    </div>
                    <div className="center-grid">
                        <WellnessCard item={{ ...customBreathing, id: 'ai-b' }} onAction={handleAction} />
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

            {!loadingDaily && dailyBreathing && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-yellow-500" size={20} />
                        <h3 className="text-lg font-bold text-gray-700">Today's Recommendation</h3>
                    </div>
                    <div className="center-grid">
                        <WellnessCard item={dailyBreathing} onAction={handleAction} />
                    </div>
                </div>
            )}

            <h3 className="text-lg font-bold text-gray-700 mb-4 mt-8">Explore All Techniques</h3>
            <div className="cards-grid">
                {content.breathing.map(breath => (
                    <WellnessCard key={breath.id} item={breath} onAction={handleAction} />
                ))}
            </div>

            {selectedItem && (
                <ActionDetail
                    item={selectedItem}
                    type="Breathing"
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
};

export default Meditation;
