import { authFetch } from "./authService.js";
import { api } from "./userService.js";

export const followingsGet = async () => {
  const followings = await authFetch(`api/following`);
  console.log(followings);
  return followings;
};

export const followersGet = async () => {
  const followings = await authFetch(`api/follower`);
  console.log(followings);
  return followings;
};

export const followingNew = async (id) => {
  const data = await authFetch(`api/following/${id}`, { method: "POST" });
  return data;
};
