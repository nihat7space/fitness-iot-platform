import React, { useEffect, useState } from "react";
import { formatAgeSeconds, isStreamFresh } from "../utils/time.js";

export default function StreamStatusBadge({ timestamp }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timestamp) {
    return <span className="badge neutral"><span className="badge-dot" />No data</span>;
  }

  const fresh = isStreamFresh(timestamp);
  const ageSeconds = formatAgeSeconds(timestamp);

  return (
    <span className={`badge ${fresh ? "success" : "neutral"}`}>
      <span className="badge-dot" />
      {fresh ? "Receiving" : `Stale (${Math.round(ageSeconds)}s)`}
    </span>
  );
}
