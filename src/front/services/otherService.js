import { authFetch } from "./authService.js";

export const emberAdd = async (amount) => {
  const data = await authFetch(`api/embers/${amount}`, { method: "POST" });
  return data;
};

export const streakPlus = async () => {
  const data = await authFetch(`api/streak`, { method: "POST" });
  return data;
};
