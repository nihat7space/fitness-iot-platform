import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Overview from "./pages/Overview.jsx";
import Workouts from "./pages/Workouts.jsx";
import SensorData from "./pages/SensorData.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <Login />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/sensor-data" element={<SensorData />} />
        </Routes>
      </div>
    </div>
  );
}
