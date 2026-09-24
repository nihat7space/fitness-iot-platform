import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Overview", end: true },
  { to: "/workouts", label: "Workouts" },
  { to: "/sensor-data", label: "Sensor Data" }
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Fitness IoT Platform</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {user ? (
          <>
            <span className="text-secondary mono" style={{ fontSize: 12 }}>{user.username}</span>
            <button className="btn btn-ghost" onClick={logout}>Sign out</button>
          </>
        ) : (
          <NavLink to="/login" className="sidebar-link">Sign in</NavLink>
        )}
      </div>
    </aside>
  );
}
