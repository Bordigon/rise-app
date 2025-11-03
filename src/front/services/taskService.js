import { authFetch } from "./authService.js";
import { api } from "./userService.js";

export const taskList = async () => {
  const data = await authFetch(`api/tasks`);
  return data;
};

export const taskUndone = async () => {
  const data = await authFetch(`api/tasks/undone`);
  return data;
};

//--- Necesita una descripción y un valor booleano para habit, el resto pueden ser null, o string
export const taskCreate = async (
  description,
  duration,
  time_to_start,
  habit
) => {
  const info = {
    description: description,
    duration: duration,
    time_to_start: time_to_start,
    habit: habit,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(info),
  };

  const data = await authFetch(`api/tasks/create`, options);
  return data;
};

export const taskGet = async (id) => {
  const data = await authFetch(`api/tasks/${id}`);
  return data;
};

export const taskDone = async (id) => {
  const data = await authFetch(`api/tasks/done/${id}`, { method: "POST" });
  return data;
};

export const taskDelete = async (id) => {
  const data = await authFetch(`api/tasks/delete/${id}`, { method: "DELETE" });
  return data;
};

//----------------------------- Para uso durante el desarrollo
export const allTasks = async () => {
  try {
    const userTasks = await fetch(`${api}/api/tarea`);
    const tasks = await userTasks.json();
    console.log(tasks);
    return tasks;
  } catch (err) {
    console.error(`La has cagado, ${err}`);
  }
};
