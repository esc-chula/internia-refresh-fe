import { apiFetch } from "./client";
import type { User } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export function googleLoginUrl() {
  return `${API_BASE}/auth/google`;
}

export function logout() {
  return apiFetch<{ ok: boolean }>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiFetch<User>("/auth/me", { auth: true });
}

export function refreshTokenPair(refreshToken: string) {
  return apiFetch<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export function onboard(username: string, department: string) {
  return apiFetch<User>("/me/onboarding", {
    method: "POST",
    auth: true,
    body: { username, department },
  });
}

export function updateProfile(fields: { username?: string; department?: string }) {
  return apiFetch<User>("/me", { method: "PATCH", auth: true, body: fields });
}
