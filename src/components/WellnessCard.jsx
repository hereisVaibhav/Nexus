import React from 'react';
import { Dumbbell, Wind, Utensils, Lightbulb, Trophy } from 'lucide-react';

const icons = {
    'Workout': <Dumbbell className="card-icon" />,
    'Breathing': <Wind className="card-icon" />,
    'Meal': <Utensils className="card-icon" />,
    'Tip': <Lightbulb className="card-icon" />,
    'Challenge': <Trophy className="card-icon" />,
};

const WellnessCard = ({ item, onAction }) => {
    return (
        <div className="wellness-card">
            <div className="card-header">
                {icons[item.category]}
                <span className="card-category">{item.category}</span>
                {item.duration && <span className="card-duration">{item.duration}</span>}
            </div>
            <h3 className="card-title">{item.title}</h3>
            <p className="card-subtitle">
                {item.instructions || item.advice || item.goal}
            </p>
            {item.benefit && (
                <div className="card-benefit">
                    <span className="benefit-label">Benefit:</span> {item.benefit}
                </div>
            )}
            <button className="card-action" onClick={() => onAction && onAction(item)}>
                Start Action
            </button>
        </div>
    );
};

export default WellnessCard;
