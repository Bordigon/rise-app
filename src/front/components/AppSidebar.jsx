import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/AppSidebar.css";


import fireLogo from "../assets/img/appsidebarimgs/fireLogo.png";


export default function AppSidebar({ user }) {
  const {
    username = "PhoenixPlayer",
    level = 1,
    phoenixEmbers = 0,
    currentStreak = 0,
    avatar,
  } = user || {};

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
          <p className="sidebar-level">Level {level}</p>
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
      </div>
    </nav>
  );
}
