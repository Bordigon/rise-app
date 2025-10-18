import React from "react";
import { Outlet } from "react-router-dom";




export default function Layout() {
    return (
        <div className="layout-container" style={{ minHeight: "100vh" }}>
            <Outlet />
        </div>
    );
}