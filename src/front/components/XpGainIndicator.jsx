import React from 'react';
import '../styles/XpGainIndicator.css'; 


function XpGainIndicator({ amount }) {
    if (!amount || amount <= 0) {
        return null; // No muestra nada si no hay XP
    }

    return (
        <div className="xp-gain-indicator">
            +{amount} XP! 🔥
        </div>
    );
}

export default XpGainIndicator;