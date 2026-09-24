import React from "react";

export default function ConfidenceBar({ confidence }) {
  const pct = Math.round(confidence * 1000) / 10;
  return (
    <div className="field" style={{ gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="helper-text">Confidence</span>
        <span className="mono" style={{ fontSize: 12 }}>{pct.toFixed(1)}%</span>
      </div>
      <div className="confidence-bar-track">
        <div className="confidence-bar-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </div>
    </div>
  );
}
