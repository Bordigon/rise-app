import React from "react";
import { Outlet, useLocation } from "react-router-dom"; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import AppSidebar from "../components/AppSidebar.jsx";
import ExpBar from "../components/ExpBar.jsx";
import "../styles/Layout.css"; 

export default function Layout() {
    const { store } = useGlobalReducer();
    const isAuthenticated = !!store.token;
    const location = useLocation(); 
    const isProfilePage = location.pathname === '/profile'; 

    const level = store.user?.level || 1;
    const currentExp = store.user?.xp || 0;
    const nextLevelExp = 1000;

    
    const mainClasses = isAuthenticated
        ? `main-with-sidebar ${isProfilePage ? 'no-padding-profile' : ''}` 
        : "main-full-width";

    return (
        <div className="app-layout">
            {isAuthenticated && <AppSidebar user={store.user} />}

            {/* Aplica las clases construidas */}
            <main className={mainClasses}>
                <Outlet />
            </main>

            {isAuthenticated && (
                <ExpBar
                    level={level}
                    currentExp={currentExp}
                    nextLevelExp={nextLevelExp}
                />
            )}
        </div>
    );
}