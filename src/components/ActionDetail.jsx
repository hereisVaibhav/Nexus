import React from 'react';
import { X, Clock, CheckCircle } from 'lucide-react';

const ActionDetail = ({ item, onClose, type }) => {
    if (!item) return null;

    // Helper to split instructions into list items if possible
    const renderInstructions = (text) => {
        if (!text) return null;

        // Handle numbered lists (e.g., "1. Step one. 2. Step two.")
        const isNumbered = /\d+\.\s/.test(text);
        let steps = [];

        if (isNumbered) {
            // Split by numbers like "1. ", "2. " etc.
            steps = text.split(/\d+\.\s+/).map(s => s.trim()).filter(s => s.length > 0);
        } else {
            // Split by period for standard sentences
            steps = text.split('.').map(s => s.trim()).filter(s => s.length > 0);
        }

        if (steps.length > 1) {
            return (
                <ul className="instruction-list">
                    {steps.map((step, idx) => (
                        <li key={idx} className="instruction-step">
                            <span className="step-number">{idx + 1}</span>
                            <span className="step-text">
                                {step}{!step.endsWith('.') && !isNumbered && '.'}
                                {/* Only add a dot if it doesn't have one and wasn't a numbered list part */}
                            </span>
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="instruction-text">{text}</p>;
    };

    return (
        <div className="action-overlay-backdrop">
            <div className="action-modal glass-panel">
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <span className="modal-category">{item.category || type}</span>
                    <h2 className="modal-title">{item.title}</h2>
                    {item.duration && (
                        <div className="modal-meta">
                            <Clock size={16} />
                            <span>{item.duration}</span>
                        </div>
                    )}
                </div>

                <div className="modal-content">
                    {item.ingredients && (
                        <div className="modal-section">
                            <h3 className="section-header">Ingredients</h3>
                            <div className="ingredients-box">
                                {item.ingredients.split(',').map((ing, i) => (
                                    <span key={i} className="ingredient-tag">{ing.trim()}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="modal-section">
                        <h3 className="section-header">{(item.recipe || item.fullSteps) ? 'Summary' : 'Instructions'}</h3>
                        {renderInstructions(item.instructions || item.advice || item.goal)}
                    </div>

                    {(item.recipe || item.fullSteps) && (
                        <div className="modal-section">
                            <h3 className="section-header">{item.recipe ? 'Full Recipe' : 'Step-by-Step Guide'}</h3>
                            {renderInstructions(item.recipe || item.fullSteps)}
                        </div>
                    )}
                </div>

                <button className="complete-btn" onClick={onClose}>
                    Complete Session
                </button>
            </div>
        </div>
    );
};

export default ActionDetail;
