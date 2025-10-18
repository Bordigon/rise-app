import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout.jsx"; // Asegúrate que la ruta es correcta
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import useGlobalReducer from "./hooks/useGlobalReducer.jsx"; // Importa el hook


const PrivateRoute = ({ children }) => {
    const { store } = useGlobalReducer();
   
    return store.token ? children : <Navigate to="/login" replace />;
};

// Renombramos la función a AppRouter (convención de React)
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas Públicas */}
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas (envueltas individualmente o en grupo) */}
        {/* Aquí asumimos que Layout ya no necesita saber si está autenticado */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><DashboardPage /></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><ProfilePage /></PrivateRoute>}
        />
        <Route
          path="/leaderboard"
          element={<PrivateRoute><LeaderboardPage /></PrivateRoute>}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

// Asegúrate de importar los componentes de las páginas privadas si los usas aquí
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";