import React from "react";

const FIELDS = [
  { key: "accel_x", label: "accel_x (g)" },
  { key: "accel_y", label: "accel_y (g)" },
  { key: "accel_z", label: "accel_z (g)" },
  { key: "gyro_x", label: "gyro_x (dps)" },
  { key: "gyro_y", label: "gyro_y (dps)" },
  { key: "gyro_z", label: "gyro_z (dps)" }
];

export default function RawValuesGrid({ sample, compact }) {
  if (!sample) {
    return <div className="empty-state">No sensor samples yet.</div>;
  }

  return (
    <div className={`raw-values-grid${compact ? " compact" : ""}`}>
      {FIELDS.map((field) => (
        <div className="raw-value" key={field.key}>
          <div className="label">{field.label}</div>
          <div className="value">{Number(sample[field.key]).toFixed(3)}</div>
        </div>
      ))}
    </div>
  );
}
