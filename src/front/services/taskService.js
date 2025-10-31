import { authFetch } from "./authService.js";
import { api } from "./userService.js";

export const tasksList = async () => {
  const data = await authFetch(`api/tasks`, { method: "GET" });
  return data;
};

export const tasksUndone = async () => {
  const data = await authFetch(`api/tasks/undone`, { method: "GET" });
  return data;
};

