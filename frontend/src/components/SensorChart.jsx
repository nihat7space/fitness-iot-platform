import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { formatClockTime } from "../utils/time.js";

const AXIS_COLORS = {
  x: "var(--chart-x)",
  y: "var(--chart-y)",
  z: "var(--chart-z)"
};

export default function SensorChart({ data, xKey, yKey, zKey, unitLabel, small }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">No sensor samples yet.</div>;
  }

  return (
    <div className={`chart-container${small ? " small" : ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="created_at"
            tickFormatter={formatClockTime}
            stroke="var(--color-text-muted)"
            tick={{ fontSize: 11 }}
            minTickGap={30}
          />
          <YAxis
            stroke="var(--color-text-muted)"
            tick={{ fontSize: 11 }}
            width={44}
            label={unitLabel ? { value: unitLabel, angle: -90, position: "insideLeft", fill: "var(--color-text-muted)", fontSize: 11 } : undefined}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: 4,
              fontSize: 12
            }}
            labelFormatter={formatClockTime}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey={xKey} name="X" stroke={AXIS_COLORS.x} dot={false} strokeWidth={1.5} isAnimationActive={false} />
          <Line type="monotone" dataKey={yKey} name="Y" stroke={AXIS_COLORS.y} dot={false} strokeWidth={1.5} isAnimationActive={false} />
          <Line type="monotone" dataKey={zKey} name="Z" stroke={AXIS_COLORS.z} dot={false} strokeWidth={1.5} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
