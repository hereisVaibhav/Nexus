import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const ActivityCard = ({ item, type, icon: Icon, onClick }) => {
    if (!item) return null;

    const getDetails = () => {
        switch (type) {
            case 'workout':
            case 'breathing':
                return (
                    <div className="card-meta">
                        <Clock size={16} />
                        <span>{item.duration}</span>
                    </div>
                );
            case 'meal':
                return (
                    <div className="card-meta italic">
                        "{item.ingredients}"
                    </div>
                );
            case 'challenge':
                return (
                    <div className="card-meta">
                        <CheckCircle size={16} />
                        <span>Goal: {item.goal}</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`activity-card glass-panel ${type}-card`}>
            <div className={`icon-wrapper ${type}-icon-bg`}>
                <Icon size={32} />
            </div>

            <h3 className="card-title-lg">{item.title}</h3>

            <p className="card-desc">
                {item.instructions || item.advice || item.goal}
            </p>

            {item.benefit && (
                <div className="card-benefit-inline">
                    <span className="benefit-dot"></span>
                    {item.benefit}
                </div>
            )}

            {getDetails()}

            <button className="card-btn" onClick={onClick}>
                View Details
            </button>
        </div>
    );
};

export default ActivityCard;
