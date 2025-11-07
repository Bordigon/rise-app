import React, { useState, useEffect, useRef } from 'react';
import { userRegister, userLogin, userProfile, userDelete, getUsers, deleteUser } from './userService.js';
import { allTasks, taskCreate, taskDelete, taskDone, taskGet, taskList, taskUndone } from './taskService.js';

function Pruebas() {
    const [info, setInfo] = useState("");
    const hasRun = useRef(false);  // ← useRef para control de ejecución

    const loginUser = async () => {
        let body = {
            "email": "gistavo@gmail.com",
            "password": "yo soy groot",
            "name": "gustavo"
        }
        console.log("Enviando:", body);

        try {
            //await userRegister(body);

            body = {
                "email": "gistavo@gmail.com",
                "password": "yo soy groot"
            }

            //await userLogin(body);

            await userProfile();

            await taskCreate("sacar a pasear el perro", null, null, false);

            await taskGet(6);

            await taskDone(7);

            await taskDelete(8);

            await taskUndone();

            await taskList();

            await allTasks();

            const users = await getUsers();

            return users;
        } catch (error) {
            console.error("Error completo:", error);
            setInfo(`Error: ${error.message}`);
        }
    }

    useEffect(() => {
        if (!hasRun.current) {
            hasRun.current = true;  // ← Marcar como ejecutado
            console.log("useEffect ejecutándose...");
            loginUser();
        }
    }, []);  // ← Array vacío = solo al montar

    return (
        <div>
            <h1>Pruebas de Registro</h1>
            <p>Estado: {info || "Cargando..."}</p>
        </div>
    )
}

export default Pruebas;