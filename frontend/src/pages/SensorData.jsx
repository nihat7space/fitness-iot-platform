import React, { useState } from "react";
import { usePolling } from "../hooks/usePolling.js";
import { fetchSensorData } from "../api/sensors.js";
import SensorChart from "../components/SensorChart.jsx";
import RawValuesGrid from "../components/RawValuesGrid.jsx";
import { formatClockTime } from "../utils/time.js";

const POLL_MS = 3000;
const SAMPLE_LIMIT = 50;

export default function SensorData() {
  const [limit, setLimit] = useState(SAMPLE_LIMIT);
  const sensorState = usePolling(() => fetchSensorData(limit), POLL_MS, [limit]);

  const samples = sensorState.data ? sensorState.data.sensor_data : [];
  const chronological = [...samples].reverse();
  const latestSample = samples[0] || null;

  return (
    <div className="page-content">
      {sensorState.error && (
        <div className="error-banner">
          Could not reach the API. Check that the backend is running and CORS is configured.
        </div>
      )}

      <div className="toolbar" style={{ justifyContent: "flex-end" }}>
        <div className="field" style={{ width: 140 }}>
          <label htmlFor="sample-limit">Samples shown</label>
          <select id="sample-limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Accelerometer (X / Y / Z)</span>
            <span className="card-subtitle">Acceleration (g)</span>
          </div>
          <SensorChart data={chronological} xKey="accel_x" yKey="accel_y" zKey="accel_z" unitLabel="g" />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Gyroscope (X / Y / Z)</span>
            <span className="card-subtitle">Angular velocity (°/s)</span>
          </div>
          <SensorChart data={chronological} xKey="gyro_x" yKey="gyro_y" zKey="gyro_z" unitLabel="°/s" />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Latest Raw Values</span>
          <span className="card-subtitle">{latestSample ? formatClockTime(latestSample.created_at) : ""}</span>
        </div>
        <RawValuesGrid sample={latestSample} />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Latest Samples</span>
          <span className="card-subtitle">newest first</span>
        </div>
        {samples.length === 0 ? (
          <div className="empty-state">No sensor samples yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Time</th>
                  <th>Accel X</th>
                  <th>Accel Y</th>
                  <th>Accel Z</th>
                  <th>Gyro X</th>
                  <th>Gyro Y</th>
                  <th>Gyro Z</th>
                  <th>Label</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample) => (
                  <tr key={sample.id}>
                    <td>{sample.id}</td>
                    <td>{formatClockTime(sample.created_at)}</td>
                    <td>{Number(sample.accel_x).toFixed(3)}</td>
                    <td>{Number(sample.accel_y).toFixed(3)}</td>
                    <td>{Number(sample.accel_z).toFixed(3)}</td>
                    <td>{Number(sample.gyro_x).toFixed(3)}</td>
                    <td>{Number(sample.gyro_y).toFixed(3)}</td>
                    <td>{Number(sample.gyro_z).toFixed(3)}</td>
                    <td>{sample.label || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
