import { request } from "./client.js";

export function fetchSensorData(limit = 50) {
  return request(`/sensors?limit=${limit}`);
}

export function fetchPrediction() {
  return request("/predict");
}
