// src/front/pages/DashboardPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; // Hook del estado global
import "../styles/DashboardPage.css"; // Estilos específicos del Dashboard

// Utilidades de Fecha
import {
  startOfWeek,
  addDays,
  localKey,
  fmtDay,
  dayLetter,
} from "../utils/dateUtils.js";

// Assets (Imágenes y Sonido)
import closedEggImg from "../assets/img/closed-egg.png";
import openEggImg from "../assets/img/open-egg.png";
import completionSound from "../assets/audio/completionSound.mp3"; // Verifica ruta y nombre
// Asegúrate de importar tu logo de streak si lo usas en este componente
// import fireStreakLogoImg from "../assets/img/fire-streak-logo.png";

// Componentes
import PhoenixStreakFM from "../components/PhoenixStreakFM.jsx"; // Verifica ruta
import DailyTasksModal from "../components/DailyTasksModal.jsx"; // Verifica ruta
import XpGainIndicator from "../components/XpGainIndicator.jsx"; // Verifica ruta

// Datos Simulados (Mocks)
const MOCK_MOTIVATIONAL_QUOTE = {
  quote: "The first step doesn't get you where you want to go, but it takes you out of where you are.",
  author: "J. P. Morgan",
};

// Componente Principal del Dashboard
function DashboardPage() {
  const navigate = useNavigate(); // Hook para navegación
  const { store, dispatch } = useGlobalReducer(); // Acceso al estado global y dispatch

  // Lee datos del estado global, con valores por defecto por si aún no cargan
  const tasks = store.tasks || [];
  const userData = store.user || { username: "User", level: 1, xp: 0, phoenixEmbers: 0, currentStreak: 0 };

  // --- Estados Locales del Componente ---
  const [motivationalQuote] = useState(MOCK_MOTIVATIONAL_QUOTE);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), 1)); // Lunes de la semana visible
  const [completedDays, setCompletedDays] = useState(new Set()); // Almacena keys ('YYYY-MM-DD') de días completados LOCALMENTE
  const [showDailyTasksModal, setShowDailyTasksModal] = useState(false); // Visibilidad del modal
  const [showCompletionEffect, setShowCompletionEffect] = useState(false); // Animación "DÍA COMPLETADO"
  const [xpGainAnimation, setXpGainAnimation] = useState({ amount: 0, show: false }); // Animación "+XP"
  const [pulseExpBar, setPulseExpBar] = useState(false); // Trigger para animación de ExpBar (necesitará pasarse a Layout)
  const completionAudioRef = useRef(new Audio(completionSound)); // Referencia al audio
  const [celebrateTrigger, setCelebrateTrigger] = useState(0); // Trigger para animación del Fénix
  const wasDayCompleteRef = useRef(false); // Ref para recordar el estado anterior del día

  // --- Datos Derivados y Cálculos ---
  // Calcula los 7 días de la semana a mostrar
  const weekProgress = useMemo(() => {
    const todayKey = localKey(new Date());
    return [...Array(7)].map((_, i) => {
      const date = addDays(weekStart, i);
      const key = localKey(date);
      return {
        date, key, day: dayLetter(date), label: fmtDay(date),
        isToday: key === todayKey,
        complete: completedDays.has(key), // Usa el estado local 'completedDays'
        height: [0, 14, 24, 16, 8, 12, 20][i], // Altura mock
      };
    });
  }, [weekStart, completedDays]); // Recalcula si cambia la semana o los días completados

  const currentDay = weekProgress.find((d) => d.isToday); // Objeto del día actual
  const isPhoenixHappy = !!currentDay?.complete; // Estado del Fénix
  const pendingTasks = tasks.filter(task => !task.completed).length; // Tareas pendientes (del store)
  const isDayCompleteNow = pendingTasks === 0 && tasks.length > 0; // Si el día está completo AHORA

  // --- Efecto para Disparar Animaciones de Completado (SOLO en la transición) ---
  useEffect(() => {
    const todayKey = currentDay?.key;
    if (todayKey) {
      const isCompleteNow = completedDays.has(todayKey); // Estado actual de completado
      const wasCompleteBefore = wasDayCompleteRef.current; // Estado anterior guardado

      // Si ANTES no estaba completo y AHORA sí lo está
      if (!wasCompleteBefore && isCompleteNow) {
        console.log("¡Día recién completado! Disparando efectos...");
        const xpGainedToday = 50; // XP simulado
        completionAudioRef.current.play().catch(e => console.error("Error playing sound:", e));
        setShowCompletionEffect(true);
        setTimeout(() => setShowCompletionEffect(false), 3000);
        setXpGainAnimation({ amount: xpGainedToday, show: true });
        setTimeout(() => setXpGainAnimation({ amount: 0, show: false }), 3000); // Duración animación XP
        setPulseExpBar(true); // Activa pulso (debe pasarse a ExpBar)
        setTimeout(() => setPulseExpBar(false), 600);
        setCelebrateTrigger(x => x + 1); // Trigger animación Fénix
        setShowDailyTasksModal(false); // Cierra el modal
      }

      // Actualiza la referencia para el próximo render
      wasDayCompleteRef.current = isCompleteNow;
    }
  }, [completedDays, currentDay]); // Se ejecuta si cambia el set de días completados o el día actual

  // --- Manejadores de Eventos ---
  // Añadir Tarea (dispatch a store)
  const handleAddTask = (taskName) => {
    dispatch({ type: "ADD_TASK", payload: { taskName } });
  };

  // Marcar/Desmarcar Tarea (dispatch a store Y actualiza completedDays local)
  const handleToggleTask = (taskId) => {
    // Primero, actualiza el estado global de la tarea
    dispatch({ type: "TOGGLE_TASK", payload: { taskId } });

    // Luego, verifica si esto completó o descompletó el día para actualizar el estado LOCAL 'completedDays'
    // Necesitamos recalcular cómo quedarían las tareas DESPUÉS del dispatch (el store se actualiza asíncronamente)
    // Para simplificar en MOCK, recalculamos aquí basado en el estado *futuro* esperado
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return; // Seguridad

    const futureTasks = tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const willBeComplete = futureTasks.every(t => t.completed) && futureTasks.length > 0;
    const todayKey = currentDay?.key;

    if (todayKey) {
        const isCurrentlyComplete = completedDays.has(todayKey);
        if (willBeComplete && !isCurrentlyComplete) {
            // Si va a estar completo y no lo estaba, actualiza el Set local
            setCompletedDays(prev => new Set(prev).add(todayKey));
        } else if (!willBeComplete && isCurrentlyComplete) {
            // Si va a estar incompleto y sí lo estaba, actualiza el Set local
             setCompletedDays(prev => {
                 const newSet = new Set(prev);
                 newSet.delete(todayKey);
                 return newSet;
             });
        }
    }
  };

  // Abrir el modal al hacer clic en un huevo/día
  const handleDayClick = (dayData) => {
    console.log("Opening modal for day:", dayData.day);
    setShowDailyTasksModal(true);
  };
  // Abrir el modal al hacer clic en el botón principal
  const handleDailyTasksButtonClick = () => {
    console.log("Opening modal for today");
    setShowDailyTasksModal(true);
  };

  // Navegar entre semanas
  const goPrevWeek = () => setWeekStart((ws) => addDays(ws, -7));
  const goNextWeek = () => setWeekStart((ws) => addDays(ws, 7));


  // --- Renderizado JSX ---
  return (
    <div className="stage">
      {/* Fénix / Animación */}
      <div className="phoenix-central-container d-flex justify-content-center">
        <PhoenixStreakFM completed={isPhoenixHappy} trigger={celebrateTrigger} />
      </div>

      {/* Mensajes */}
      <div className="dashboard-message">
        <p className="lead">
          You've been working on your health for <span className="text-rise-orange fw-bold">{userData.currentStreak} days</span>!
        </p>
        {!isDayCompleteNow && (
          <p className="text-muted">
            You have <span className="fw-bold">{pendingTasks} tasks</span> left for today. Keep the streak going!
          </p>
        )}
        {isDayCompleteNow && (
          <span className="text-success mt-2 d-block">✨ Day Completed! ✨</span>
        )}
      </div>

      {/* Progreso Semanal */}
      <div className="week-strip-grid">
        <button type="button" className="week-arrow" onClick={goPrevWeek} aria-label="Previous Week">
          &lt;
        </button>
        <div className="week-days-wrapper">
          {weekProgress.map((day) => (
            <div
              key={day.key}
              className="day-item"
              onClick={() => handleDayClick(day)}
              style={{ marginBottom: `${day.height}px` }}
            >
              <span className={`day-letter fw-bold ${day.isToday ? "text-rise-orange" : ""}`}>
                {day.day}
              </span>
              <img
                src={day.complete ? openEggImg : closedEggImg}
                alt={day.complete ? "Cracked Egg" : "Closed Egg"}
                className={`day-egg-image ${day.complete ? "open" : "closed"}`}
              />
              <span className="day-date small text-muted mt-2">{day.label}</span>
              {day.isToday && <span className="today-indicator">TODAY</span>}
            </div>
          ))}
        </div>
        <button type="button" className="week-arrow" onClick={goNextWeek} aria-label="Next Week">
          &gt;
        </button>
      </div>

      {/* Botón Daily Tasks */}
      <div className="cta-wrap">
        <button className="rise-btn rise-btn--lg daily-tasks-button" onClick={handleDailyTasksButtonClick}>
          Daily Tasks
        </button>
      </div>

      {/* Frase Motivacional */}
      <div className="motivational-quote-wrapper">
        <p className="quote-text">"{motivationalQuote.quote}"</p>
        <p className="quote-author">- {motivationalQuote.author}</p>
      </div>

      {/* Overlays: Animaciones y Modal */}
      {showCompletionEffect && (
        <div className="completion-animation-overlay">
          <h1 className="text-center text-success completion-message">
            DAY COMPLETE! ✨
          </h1>
        </div>
      )}
      {xpGainAnimation.show && <XpGainIndicator amount={xpGainAnimation.amount} />}
      <DailyTasksModal
        show={showDailyTasksModal}
        onClose={() => setShowDailyTasksModal(false)}
        tasks={tasks} // Pasa las tareas del store global
        onToggleTask={handleToggleTask} // Pasa el manejador que usa dispatch
        onAddTask={handleAddTask} // Pasa el manejador que usa dispatch
        currentDay={currentDay}
      />
    </div>
  );
}

export default DashboardPage;