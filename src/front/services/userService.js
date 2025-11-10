import { Profiler } from "react";
import { authFetch } from "./authService";
export const api = import.meta.env.VITE_BACKEND_URL;

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
    return { data: data, httpcode: 201 };
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
  const data = await authFetch(`api/profile`);
  console.log(data);
  return data;
};

export const userDelete = async () => {
  const resp = await authFetch(`api/user/delete`, { method: "DELETE" });
  return resp;
};

//----------------------------------- Durante el desarrollo solamente
export const getUsers = async () => {
  try {
    const userTasks = await fetch(`${api}/api/users`);
    const users = await userTasks.json();
    console.log(users);
    return users;
  } catch (err) {
    console.error(`La has cagado, ${err}`);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${api}/api/delete/${id}`, {
      method: "DELETE",
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
