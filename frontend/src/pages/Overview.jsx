import React, { useState } from "react";
import { usePolling } from "../hooks/usePolling.js";
import { fetchPrediction, fetchSensorData } from "../api/sensors.js";
import { fetchWorkouts } from "../api/workouts.js";
import ConfidenceBar from "../components/ConfidenceBar.jsx";
import StreamStatusBadge from "../components/StreamStatusBadge.jsx";
import SensorChart from "../components/SensorChart.jsx";
import RawValuesGrid from "../components/RawValuesGrid.jsx";
import RecentWorkoutsTable from "../components/RecentWorkoutsTable.jsx";
import { formatAgeSeconds, formatClockTime } from "../utils/time.js";

const POLL_MS = 3000;

export default function Overview() {
  const [chartView, setChartView] = useState("accel");

  const predictState = usePolling(fetchPrediction, POLL_MS, []);
  const sensorState = usePolling(() => fetchSensorData(30), POLL_MS, []);
  const workoutsState = usePolling(() => fetchWorkouts({ limit: 100 }), 5000, []);

  const prediction = predictState.data;
  const hasPredictionError = prediction && prediction.error;
  const validPrediction = prediction && !prediction.error;

  const samples = sensorState.data ? sensorState.data.sensor_data : [];
  const chronological = [...samples].reverse();
  const latestSample = samples[0] || null;

  const workouts = workoutsState.data
    ? [...workoutsState.data.workouts].sort((a, b) => b.id - a.id).slice(0, 5)
    : [];

  const anyError = predictState.error || sensorState.error || workoutsState.error;

  const streamTimestamp = validPrediction ? prediction.latest_sensor_at : latestSample?.created_at;
  const ageSeconds = latestSample ? formatAgeSeconds(latestSample.created_at) : null;

  return (
    <div className="page-content">
      {anyError && (
        <div className="error-banner">
          Could not reach the API. Check that the backend is running and CORS is configured.
        </div>
      )}

      <div className="status-grid">
        <div className="status-panel">
          <span className="status-label">Current Activity</span>
          {predictState.loading && !prediction ? (
            <span className="status-secondary">Loading...</span>
          ) : validPrediction ? (
            <>
              <span className="status-primary">{prediction.prediction}</span>
              <ConfidenceBar confidence={prediction.confidence} />
            </>
          ) : hasPredictionError ? (
            <span className="status-secondary">
              Insufficient data ({prediction.available}/{prediction.required})
            </span>
          ) : (
            <span className="status-secondary">No prediction available</span>
          )}
        </div>

        <div className="status-panel">
          <span className="status-label">Data Stream</span>
          <StreamStatusBadge timestamp={streamTimestamp} />
        </div>

        <div className="status-panel">
          <span className="status-label">Last Sample</span>
          <span className="status-primary">{ageSeconds !== null ? `${ageSeconds.toFixed(1)}s ago` : "--"}</span>
          <span className="status-secondary">
            {latestSample ? `${formatClockTime(latestSample.created_at)} · #${latestSample.id}` : "no samples yet"}
          </span>
        </div>

        <div className="status-panel">
          <span className="status-label">Model</span>
          <span className="status-primary" style={{ fontSize: 15 }}>Random Forest</span>
          <span className="status-secondary">REST · WALKING · SQUAT</span>
          <span className="status-secondary">
            {validPrediction ? `window size ${prediction.window_size}` : "window size --"}
          </span>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Sensor Trend</span>
            <div className="chart-tabs">
              <button
                type="button"
                className={`chart-tab${chartView === "accel" ? " active" : ""}`}
                onClick={() => setChartView("accel")}
              >
                Accel
              </button>
              <button
                type="button"
                className={`chart-tab${chartView === "gyro" ? " active" : ""}`}
                onClick={() => setChartView("gyro")}
              >
                Gyro
              </button>
            </div>
          </div>
          {chartView === "accel" ? (
            <SensorChart data={chronological} xKey="accel_x" yKey="accel_y" zKey="accel_z" unitLabel="g" small />
          ) : (
            <SensorChart data={chronological} xKey="gyro_x" yKey="gyro_y" zKey="gyro_z" unitLabel="°/s" small />
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Latest Sensor Values</span>
          </div>
          <RawValuesGrid sample={latestSample} compact />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Workouts</span>
        </div>
        <RecentWorkoutsTable workouts={workouts} />
      </div>
    </div>
  );
}
