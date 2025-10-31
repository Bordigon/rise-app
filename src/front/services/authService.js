import { api } from "./userService.js";


const refresh = async () =>{
    const refresh_token_aux = localStorage.getItem("jwt-refresh-token");

    if (!refresh_token_aux){
        throw Error("No hay refresh token")
    }

    const resp = await fetch(`${api}/api/refresh`, {
        method: "POST",
        headers:{
            "Authorization": `Bearer ${refresh_token_aux}`
        }
    });

    if (!resp.ok){
        localStorage.removeItem("jwt-token")
        localStorage.removeItem("jwt-refresh-token")
        throw new Error("Refresh token inválido o caducado")
    }

    const data = await resp.json();
    localStorage.setItem("jwt-token", data.token);
    console.log("Token refrescado");
    return data.token;
}


export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("jwt-token");

  const resp = await fetch(`${api}/${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if(resp.status === 401){
    await refresh()
    return await authFetch(url, options)
  }

  if (!resp.ok) {
    throw Error("Hubo un problema");
  } else if (resp.status == 403) {
    throw Error("Missing or invalid token");
  }
  console.log("pre data del authFetch");
  console.log(resp);
  const data = await resp.json();
  console.log("Tu data");
  console.log(data);
  return data;
};

