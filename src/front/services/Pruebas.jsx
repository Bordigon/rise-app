import React, { useState, useEffect, useRef } from 'react';
import { userRegister, userLogin } from './userService.js';

function Pruebas() {
    const [info, setInfo] = useState("");
    const hasRun = useRef(false);  // ← useRef para control de ejecución

    const loginUser = async () => {
        let body = {
            email: "test1761750657491@gmail.com",
            password: "yo soy groot"
        }
        console.log("Enviando:", body);

        try {
            const data = await userLogin(body);
            console.log("Respuesta del servidor:", data);
            console.log(data.token);

            if (data && data.name) {
                setInfo(`Usuario creado: ${data.name}`);
            } else if (data && data.msg) {
                setInfo(`Mensaje: ${data.msg}`);
            } else {
                setInfo("Respuesta inesperada del servidor");
            }

            return data;
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