// src/front/pages/DashboardPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../styles/DashboardPage.css";

import {
  startOfWeek,
  addDays,
  localKey,
  fmtDay,
  dayLetter,
} from "../utils/dateUtils.js";

import closedEggImg from "../assets/img/dashboardpageimgs/closed-egg.png";
import openEggImg from "../assets/img/dashboardpageimgs/open-egg.png";
import completionSound from "../assets/audio/completionSound.mp3";

import PhoenixStreakFM from "../components/PhoenixStreakFM.jsx";
import DailyTasksModal from "../components/DailyTasksModal.jsx";
import XpGainIndicator from "../components/XpGainIndicator.jsx";
import { taskList } from "../services/taskService.js";

const MOCK_MOTIVATIONAL_QUOTE = {
  quote: "The first step doesn't get you where you want to go, but it takes you out of where you are.",
  author: "J. P. Morgan",
};

function DashboardPage() {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const handleGetTasks = async () => {
    const data = await taskList();
    dispatch({ type: "SET_TASK", payload: { data } })
  }


  const tasks = store.user || [];
  console.log(tasks);
  const userData = store.user || { username: "User", level: 1, xp: 0, phoenixEmbers: 0, currentStreak: 0 };
  const completedDays = store.completedDays || new Set();

  const [motivationalQuote] = useState(MOCK_MOTIVATIONAL_QUOTE);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), 1));
  const [showDailyTasksModal, setShowDailyTasksModal] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [xpGainAnimation, setXpGainAnimation] = useState({ amount: 0, show: false });
  const [pulseExpBar, setPulseExpBar] = useState(false);
  const completionAudioRef = useRef(new Audio(completionSound));
  const [celebrateTrigger, setCelebrateTrigger] = useState(0);

  const weekProgress = useMemo(() => {
    const todayKey = localKey(new Date());
    return [...Array(7)].map((_, i) => {
      const date = addDays(weekStart, i);
      const key = localKey(date);
      return {
        date, key, day: dayLetter(date), label: fmtDay(date),
        isToday: key === todayKey,
        complete: completedDays.has(key),
        height: [0, 14, 24, 16, 8, 12, 20][i],
      };
    });
  }, [weekStart, completedDays]);

  const currentDay = weekProgress.find((d) => d.isToday);
  const isPhoenixHappy = !!currentDay?.complete;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const isDayCompleteNow = pendingTasks === 0 && tasks.length > 0;

  const handleAddTask = (taskName) => {
    dispatch({ type: "ADD_TASK", payload: { taskName } });
  };

  const handleToggleTask = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const futureTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const willBeDayComplete = futureTasks.every(t => t.completed) && futureTasks.length > 0;
    const todayKey = currentDay?.key;

    if (!todayKey) return;

    const isCurrentlyComplete = completedDays.has(todayKey);

    dispatch({ type: "TOGGLE_TASK", payload: { taskId } });

    if (willBeDayComplete && !isCurrentlyComplete) {
      console.log("¡Día recién completado! Disparando efectos...");
      dispatch({ type: "MARK_DAY_COMPLETE", payload: { dayKey: todayKey } });

      const xpGainedToday = 50;
      completionAudioRef.current.play().catch(e => console.error("Error playing sound:", e));
      setShowCompletionEffect(true);
      setTimeout(() => setShowCompletionEffect(false), 3000);
      setXpGainAnimation({ amount: xpGainedToday, show: true });
      setTimeout(() => setXpGainAnimation({ amount: 0, show: false }), 3000);
      setPulseExpBar(true);
      setTimeout(() => setPulseExpBar(false), 600);
      setCelebrateTrigger(x => x + 1);
      setShowDailyTasksModal(false);
    } else if (!willBeDayComplete && isCurrentlyComplete) {
      console.log("Día descompletado.");
      dispatch({ type: "MARK_DAY_INCOMPLETE", payload: { dayKey: todayKey } });
    }
  };

  const handleDayClick = (dayData) => {
    console.log("Opening modal for day:", dayData.day);
    setShowDailyTasksModal(true);
  };
  const handleDailyTasksButtonClick = () => {
    console.log("Opening modal for today");
    setShowDailyTasksModal(true);
  };

  const goPrevWeek = () => setWeekStart((ws) => addDays(ws, -7));
  const goNextWeek = () => setWeekStart((ws) => addDays(ws, 7));

  return (
    <div className="stage">
      <div className="phoenix-central-container d-flex justify-content-center">
        <PhoenixStreakFM completed={isPhoenixHappy} trigger={celebrateTrigger} />
      </div>

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

      <div className="cta-wrap">
        <button className="rise-btn rise-btn--lg daily-tasks-button" onClick={handleDailyTasksButtonClick}>
          Daily Tasks
        </button>
      </div>

      <div className="motivational-quote-wrapper">
        <p className="quote-text">"{motivationalQuote.quote}"</p>
        <p className="quote-author">- {motivationalQuote.author}</p>
      </div>

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
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onAddTask={handleAddTask}
        currentDay={currentDay}
      />
    </div>
  );
}

export default DashboardPage;