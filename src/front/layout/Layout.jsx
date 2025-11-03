import React from "react";
import { Outlet, useLocation } from "react-router-dom"; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import AppSidebar from "../components/AppSidebar.jsx";
import ExpBar from "../components/ExpBar.jsx";
import PublicNavbar from "../components/PublicNavbar.jsx"; // Asegúrate de importar PublicNavbar
import "../styles/Layout.css"; 

export default function Layout() {
    const { store } = useGlobalReducer();
    const isAuthenticated = !!store.token;
    const location = useLocation(); 
    const isProfilePage = location.pathname === '/profile';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const level = store.user?.level || 1;
    const currentExp = store.user?.xp || 0;
    const nextLevelExp = 1000;

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