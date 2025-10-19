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

  const defaultTasks = [
    { id: 1, name: "Beber 2 litros de agua", completed: false },
    { id: 2, name: "Hacer 30 min de ejercicio", completed: true },
    { id: 3, name: "Leer 15 páginas", completed: false },
    { id: 4, name: "Planificar el día siguiente", completed: false },
  ];
  const displayTasks =
    Array.isArray(tasks) && tasks.length > 0 ? tasks : defaultTasks;

  const handleAddTask = () => {
    if (newTaskText.trim() && typeof onAddTask === "function") {
      onAddTask(newTaskText.trim());
      setNewTaskText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  return (
    <div className="daily-tasks-modal-overlay" onClick={onClose}>
      <div
        className="daily-tasks-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            Tareas Diarias - Día {currentDay?.day || "Actual"}
          </h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {displayTasks.length === 0 ? (
            <p className="text-center text-muted">No hay tareas para este día.</p>
          ) : (
            <ul className="tasks-list">
              {displayTasks.map((task) => (
                <li
                  key={task.id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <span className="task-name">{task.name}</span>
                  <button
                    className={`toggle-task-button ${
                      task.completed ? "completed" : ""
                    }`}
                    onClick={() => onToggleTask(task.id)}
                  >
                    {task.completed ? (
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
              placeholder="Añadir nueva tarea..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="add-task-button" onClick={handleAddTask}>
              <i className="bi bi-plus-circle-fill"></i> Añadir
            </button>
          </div>
        </div>

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
