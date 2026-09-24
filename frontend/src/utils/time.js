export const FRESHNESS_THRESHOLD_MS = 5000;

export function parseTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatClockTime(value) {
  const date = parseTimestamp(value);
  if (!date) return "--";
  return date.toLocaleTimeString();
}

export function formatAgeSeconds(value, now = Date.now()) {
  const date = parseTimestamp(value);
  if (!date) return null;
  return (now - date.getTime()) / 1000;
}

export function isStreamFresh(value, now = Date.now()) {
  const ageSeconds = formatAgeSeconds(value, now);
  if (ageSeconds === null) return false;
  return ageSeconds * 1000 <= FRESHNESS_THRESHOLD_MS;
}
