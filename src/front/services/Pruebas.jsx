import React, { useState, useEffect, useRef } from 'react';
import { userRegister, userLogin, userProfile, userDelete } from './userService.js';

function Pruebas() {
    const [info, setInfo] = useState("");
    const hasRun = useRef(false);  // ← useRef para control de ejecución

    const loginUser = async () => {
        let body = {
            email: "test176175@gmail.com",
            password: "yo soy groot",
            name: "grrrrot"
        }
        console.log("Enviando:", body);

        try {
            await userRegister(body);
            body = {
                email: "test176175@gmail.com",
                password: "yo soy groot"
            }
            await userLogin(body);

            await userProfile();

            const erase = await userDelete();

            return erase
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