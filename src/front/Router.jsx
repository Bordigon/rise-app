import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout.jsx"; // Asegúrate que la ruta es correcta
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import useGlobalReducer from "./hooks/useGlobalReducer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Pruebas from "./services/Pruebas.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx"; 
import CommunityPage from "./pages/CommunityPage.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas Públicas */}
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><DashboardPage /></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><ProfilePage /></PrivateRoute>}
        />
        <Route
          path="/community"
          element={<PrivateRoute><CommunityPage /></PrivateRoute>}
        />

        <Route
          path = "/pruebas"
          element = {<Pruebas />}
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

