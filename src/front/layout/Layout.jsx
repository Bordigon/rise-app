import React from "react";
import { Outlet } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; 
import AppSidebar from "../components/AppSidebar.jsx";
import ExpBar from "../components/ExpBar.jsx";

export default function Layout() {
    const { store } = useGlobalReducer();
    
    const isAuthenticated = !!store.token;

    console.log("Layout - isAuthenticated:", isAuthenticated); 

    return (
        <div className="app-layout">
            {/* Conditionally render Sidebar */}
            {isAuthenticated && <AppSidebar user={store.user} />}

            {/* Apply class based on authentication */}
            <main className={isAuthenticated ? "main-with-sidebar" : "main-full-width"}>
                <Outlet />
            </main>

            {/* Conditionally render ExpBar */}
            {isAuthenticated && (
                <ExpBar
                    level={store.user?.level || 1}
                    currentExp={store.user?.xp || 0}
                    // Add nextLevelExp logic if available in store.user or calculate it
                    nextLevelExp={1000} // Placeholder
                />
            )}
        </div>
    );
}