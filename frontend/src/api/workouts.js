import { request } from "./client.js";

export function fetchWorkouts({ exercise, minVolume, sortBy, descending, offset, limit, token } = {}) {
  const params = new URLSearchParams();
  if (exercise) params.set("exercise", exercise);
  if (minVolume !== undefined && minVolume !== "") params.set("min_volume", minVolume);
  if (sortBy) params.set("sort_by", sortBy);
  if (descending) params.set("descending", "true");
  if (offset !== undefined) params.set("offset", offset);
  if (limit !== undefined && limit !== null) params.set("limit", limit);

  const query = params.toString();
  return request(`/workouts${query ? `?${query}` : ""}`, { token });
}

export function createWorkout(workout, token) {
  return request("/workouts", { method: "POST", body: workout, token });
}

export function updateWorkout(id, workout, token) {
  return request(`/workouts/${id}`, { method: "PUT", body: workout, token });
}

export function deleteWorkout(id, token) {
  return request(`/workouts/${id}`, { method: "DELETE", token });
}
