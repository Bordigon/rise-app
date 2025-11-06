import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/AppSidebar.css";
import { calculateLevelData } from "../utils/levelUtils.js";

import fireLogo from "../assets/img/appsidebarimgs/fireLogo.png";
import storeReducer from "../store";

export default function AppSidebar({ user }) {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const { level, currentLevelExp, expToNextLevel } = calculateLevelData(store.user.level || 0); 
  

  const {
    username = store.user.name,
    levelTotal = level, 
    phoenixEmbers = 0,
    currentStreak = 0,
    avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${store.user.name}`
  } = user || {};

  const handleLogout = () => {
  
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  }

  return (
    <nav className="app-sidebar">
      {/* Top: avatar + name/level */}
      <div className="sidebar-header">
        <div className="avatar-ring">
          {avatar ? (
            <img src={avatar} alt="User avatar" />
          ) : (
            <div className="avatar-fallback">User</div>
          )}
        </div>
        <div className="sidebar-user">
          <h2 className="sidebar-username">{username}</h2>
          <p className="sidebar-level">Level {levelTotal}</p>
        </div>
      </div>

      {/* Middle: navigation buttons */}
      <div className="sidebar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          <i className="bi bi-house"></i>
          <span>Today</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          <i className="bi bi-person"></i>
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/Community"
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          <i className="bi bi-people-fill"></i>
          <span>Community</span>
        </NavLink>
      </div>

      {/* Bottom: streak + brasas */}
      <div className="sidebar-footer">
        <div className="streak-pill" title="Racha diaria">
          <img src={fireLogo} alt="Streak" />
          <span>{currentStreak}</span>
          <small>days</small>
        </div>

        <button className="brasas-btn" type="button">
          {phoenixEmbers} Embers 🔥
        </button>

        <button 
          type="button" 
          className="btn btn-danger"
          onClick={handleLogout}>

          Logout
        </button>
      </div>
    </nav>
  );
}
