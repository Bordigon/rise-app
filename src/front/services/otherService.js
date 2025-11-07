import { authFetch } from "./authService.js";

export const emberAdd = async (id) => {
  const data = await authFetch(`api/embers/${id}`, { method: "POST" });
  return data;
};
