// src/front/main.jsx (CORREGIDO)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"; // <-- USA BrowserRouter
import AppRouter from './Router.jsx'; // <-- IMPORTA TU COMPONENTE Router (ahora AppRouter)
import { StoreProvider } from './hooks/useGlobalReducer.jsx';

// Importa los estilos globales
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "./styles/index.css"; 
import "./styles/Button.css"; 

const App = () => {
    // Ya no necesitas la lógica de VITE_BACKEND_URL aquí si Router maneja todo
    return (
        <React.StrictMode>
            <StoreProvider>
                <BrowserRouter> {/* <-- USA BrowserRouter aquí */}
                    <AppRouter /> {/* <-- Renderiza tu componente de rutas */}
                </BrowserRouter>
            </StoreProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />); // Llama a render con App