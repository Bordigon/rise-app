import { Profiler } from "react";
import { authFetch } from "./authService";
export const api = `https://ghastly-spooky-fishsticks-r4x6gvqgxgwjcpppj-3001.app.github.dev`;

/*export const authFetch = async (url, options = {}) => {
    const token = localStor
}*/

export const userRegister = async (body) => {
  try {
    const response = await fetch(`${api}/api/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.ok);
    console.log(response.status);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(`la cagaste ${err}`);
  }
};

export const userLogin = async (body) => {
  try {
    const response = await fetch(`${api}/api/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.ok);
    console.log(response.status);
    const data = await response.json();
    console.log(data);
    localStorage.setItem("jwt-token", data.token);
    localStorage.setItem("jwt-refresh-token", data.refresh_token);
    return data;
  } catch (err) {
    console.error(`la cagaste en ${err}`);
  }
};

export const userProfile = async () => {
  const options = { method: "GET" };
  const data = await authFetch(`api/profile`, options);
  console.log(data);
  return data;
};

export const userDelete = async () => {
  const resp = await authFetch(`api/user/delete`, { method: "DELETE" });
  return resp;
};

export const getUsers = async () => {
  try {
    const userTasks = await fetch(`${api}api/users`);
    const users = await userTasks.json();
    return users[0].email;
  } catch (err) {
    console.error(`La has cagado, ${err}`);
  }
};
