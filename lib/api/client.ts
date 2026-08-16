import { getAccessToken, getRefreshToken, setTokenPair, clearSession } from "@/lib/auth-storage";
import { ApiError, type ApiErrorBody } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const data = await response.json();
        setTokenPair(data.accessToken, data.refreshToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const errorBody: ApiErrorBody = payload?.error ?? {
      code: "UNKNOWN_ERROR",
      message: response.statusText || "Request failed",
    };
    throw new ApiError(response.status, errorBody);
  }

  return payload as T;
}

async function doRequest(url: string, init: RequestInit, useAuth: boolean, isRetry = false): Promise<Response> {
  const response = await fetch(url, init);

  if (response.status === 401 && useAuth && !isRetry) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const headers = new Headers(init.headers);
      const token = getAccessToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return doRequest(url, { ...init, headers }, useAuth, true);
    }
    clearSession();
  }

  return response;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (options.auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await doRequest(
    `${API_BASE}${path}`,
    {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    },
    Boolean(options.auth),
  );

  return handleResponse<T>(response);
}

export async function apiFetchForm<T>(path: string, form: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await doRequest(`${API_BASE}${path}`, { method: "POST", headers, body: form }, true);

  return handleResponse<T>(response);
}

export function apiOrigin(): string {
  return API_BASE.replace(/\/api\/v1\/?$/, "");
}
