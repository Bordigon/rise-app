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

    const totalExp = store.user.level? store.user.level: 0;
    const { level, currentLevelExp, expToNextLevel } = calculateLevelData(totalExp);

    const mainClasses = isAuthenticated
        ? `main-with-sidebar ${isProfilePage ? 'no-padding-profile' : ''}` 
        : "main-full-width";
    
    // --- ESTA ES LA LÓGICA CLAVE ---
    // Cambiamos la clase del layout principal
    const layoutClass = isAuthenticated ? "app-layout-private" : "app-layout-public";
    // --- FIN DE LA LÓGICA CLAVE ---

    return (
        <div className={layoutClass}> {/* <-- USA LA CLASE DINÁMICA */}
            {isAuthenticated ? (
                <>
                    <AppSidebar user={store.user} />
                    <ExpBar
                        level={level}
                        currentExp={currentLevelExp}
                        nextLevelExp={expToNextLevel}
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