import React, { useState } from "react";
import "../styles/DailyTasksModal.css";

function DailyTasksModal({
  show,
  onClose,
  tasks,
  onToggleTask,
  onAddTask,
  currentDay,
}) {
  

  if (!show) return null;


  const [newTaskText, setNewTaskText] = useState("");
  const [isHabit, setIsHabit] = useState(false);

  const displayTasks = Array.isArray(tasks) ? tasks : [];

  const handleAddTask = () => {
    if (newTaskText.trim() && typeof onAddTask === "function") {
      onAddTask({
        description: newTaskText.trim(),
        habit: isHabit
      });
      setNewTaskText("");
      setIsHabit(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  const renderCategoryChips = (tarea) => {
    const categories = ['body', 'mind', 'productivity', 'creativity', 'social'];
    return categories.map(catKey => {
      const value = tarea[catKey];
      // Muestra el chip solo si el valor es positivo
      if (value > 0) {
        return (
          <span key={catKey} className={`category-chip ${catKey}-color`}>
            {value}
          </span>
        );
      }
      return null;
    });
  };

  return (
    <div className="daily-tasks-modal-overlay" onClick={onClose}>
      <div
        className="daily-tasks-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            Daily Tasks - Day {currentDay?.day || "Current"}
          </h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {displayTasks.length === 0 ? (
            <p className="text-center text-muted">No tasks for this day.</p>
          ) : (
            <ul className="tasks-list">
              {displayTasks.map((tarea) => (
                <li
                  key={tarea.id}
                  className={`task-item ${tarea.done ? "completed" : ""}`}
                >
                  {/* Contenedor para la info de la tarea (nombre y categorías) */}
                  <div className="task-info">
                    <span className="task-name">{tarea.description}</span>
                    <div className="task-categories-values">
                      {renderCategoryChips(tarea)}
                    </div>
                  </div>

                  {/* Dificultad general (arriba a la derecha) */}
                  {tarea.difficulty > 0 && (
                    <div className="task-difficulty-general">
                      <span>{tarea.difficulty}</span>
                    </div>
                  )}
                  
                  {/* Botón de completar */}
                  <button
                    className={`toggle-task-button ${
                      tarea.done ? "completed" : ""
                    }`}
                    onClick={() => onToggleTask(tarea.id)}
                  >
                    {tarea.done ? (
                      <i className="bi bi-check-circle-fill"></i>
                    ) : (
                      <i className="bi bi-circle"></i>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add task */}
          <div className="add-task-section">
            <input
              type="text"
              className="add-task-input"
              placeholder="Add new task"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="add-task-button" onClick={handleAddTask}>
              <i className="bi bi-plus-circle-fill"></i> Add
            </button>
          </div>
        </div>

        {/* --- 3. NUEVO CHECKBOX --- */}
          <div className="add-habit-toggle form-check">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="isHabitCheck"
              checked={isHabit}
              onChange={(e) => setIsHabit(true)}
            />
            <label className="form-check-label" htmlFor="isHabitCheck">
              Habit: This task will be repeated daily. 
            </label>
          </div>
          {/* --- FIN DE NUEVO CHECKBOX --- */}

        <div className="modal-footer">
          <button className="btn btn-lg btn-rise-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DailyTasksModal;
