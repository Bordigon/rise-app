import React from 'react';
import '../styles/XpGainIndicator.css'; // Crearemos este archivo CSS

// Recibe la cantidad de XP a mostrar
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