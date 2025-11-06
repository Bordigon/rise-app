import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import AppSidebar from "../components/AppSidebar.jsx";
import ExpBar from "../components/ExpBar.jsx";
import PublicNavbar from "../components/PublicNavbar.jsx";
import "../styles/Layout.css";
import { calculateLevelData } from "../utils/levelUtils.js";

export default function Layout() {
    const { store } = useGlobalReducer();
    const isAuthenticated = !!store.token;
    const location = useLocation();
    const isProfilePage = location.pathname === '/profile';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    // --- CORRECCIÓN AQUÍ ---
    // 1. Obtén el XP total de forma segura. Si user es 'null', usa 0.
    const totalExp = store.user ? store.user.level : 0;

    // 2. Llama a la función con el XP total.
    // calculateLevelData(0) devolverá { level: 1, currentLevelExp: 0, expToNextLevel: 1000 }
    const { level, currentLevelExp, expToNextLevel } = calculateLevelData(totalExp);
    // --- FIN DE LA CORRECCIÓN ---

    const mainClasses = isAuthenticated
        ? `main-with-sidebar ${isProfilePage ? 'no-padding-profile' : ''}`
        : "main-full-width";
    
    // --- ESTA ES LA LÓGICA CLAVE ---
    // Cambiamos la clase del layout principal
    const layoutClass = isAuthenticated ? "app-layout-private" : "app-layout-public";
    // --- FIN DE LA LÓGICA CLAVE ---

    const layoutClass = isAuthenticated ? "app-layout-private" : "app-layout-public";

    return (
        <div className={layoutClass}> {/* <-- USA LA CLASE DINÁMICA */}
            {isAuthenticated ? (
                // --- VISTA PRIVADA (LOGUEADO) ---
                <>
                    <AppSidebar user={store.user} />
                    <ExpBar
                        level={level}
                        currentExp={currentExp}
                        nextLevelExp={nextLevelExp}
                    />
                </>
            ) : (
                // --- VISTA PÚBLICA (NO LOGUEADO) ---
                // Solo muestra el Navbar público si NO estamos en login/register
                !isAuthPage && <PublicNavbar />
            )}
            
            <main className={mainClasses}>
                <Outlet />
            </main>
        </div>
    );
}