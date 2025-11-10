import React, { useState, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileCategoryModal.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function hexToRgb(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `${r}, ${g}, ${b}`;
}

export default function ProfileCategoryModal({ show, onClose, category, allCategoriesData, profileProgress }) {
  const [showStats, setShowStats] = useState(true);
  const navigate = useNavigate();

  if (!show) return null;

  const highlightedRadarChartData = useMemo(() => {
    if (!profileProgress || !category) return null;

    const labels = Object.values(allCategoriesData).map(cat => cat.label);
    const progressValues = Object.keys(allCategoriesData).map(key => profileProgress[key.toUpperCase()] || 0);
    const categoryIndex = labels.indexOf(category.label);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Other Areas',
          data: progressValues,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 1,
          pointBackgroundColor: 'rgba(255, 255, 255, 0.6)',
        },
        {
          label: category.label,
          data: progressValues.map((val, idx) => (idx === categoryIndex ? val : null)),
          backgroundColor: `${category.color}40`,
          borderColor: `${category.color}FF`,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: `${category.color}FF`,
          pointBorderColor: '#fff',
          fill: true,
        }
      ]
    };
  }, [profileProgress, category, allCategoriesData]);

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { display: true, color: 'rgba(255, 255, 255, 0.2)' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        pointLabels: {
          font: { size: 14, weight: 'bold' },
          color: 'white'
        },
        ticks: { display: false, backdropColor: 'transparent' },
        beginAtZero: true,
        min: 0,
        max: 150
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} XP`
        }
      }
    }
  };

  const handleGoToAddTask = () => {
    navigate('/dashboard', {
      state: {
        openTaskModal: true,
        prefillCategory: category.key
      }
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--category-color': category.color,
          '--category-color-rgb': hexToRgb(category.color)
        }}
      >
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        <div className="modal-category-header">
          <img src={category.orbImg} alt={`${category.label} Orb`} className="modal-category-orb-img" />
          <h2 style={{ color: category.color }}>{category.label}</h2>
        </div>

        <div className="modal-body-content">
          {showStats ? (
            <div className="modal-stats-view">
              <div className="category-current-xp">
                Progress in {category.label}:
                <span style={{ color: category.color, fontWeight: 'bold' }}>
                  {profileProgress[category.label.toUpperCase()] || 0} XP
                </span>
              </div>
              {highlightedRadarChartData && (
                <div className="radar-chart-container">
                  <Radar data={highlightedRadarChartData} options={radarChartOptions} />
                </div>
              )}
            </div>
          ) : (
            <div className="modal-info-view">
              <p className="modal-info-description">{category.description}</p>
              <div className="modal-info-suggestions">
                <h3>Suggested Tasks:</h3>
                <ul>
                  {category.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer-buttons">
          <button
            className={`modal-footer-btn ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(true)}
          >
            Stats
          </button>
          <button
            className={`modal-footer-btn ${!showStats ? 'active' : ''}`}
            onClick={() => setShowStats(false)}
          >
            Info
          </button>
          <button
            className="modal-footer-btn add-new-task-btn"
            onClick={handleGoToAddTask}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
}