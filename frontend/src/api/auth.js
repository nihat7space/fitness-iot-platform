import { request } from "./client.js";

export function registerUser({ username, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: { username, email, password }
  });
}

export function loginUser({ identifier, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { identifier, password }
  });
}

export function fetchCurrentUser(token) {
  return request("/auth/me", { token });
}
