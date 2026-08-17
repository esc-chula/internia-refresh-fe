
const ACCESS_TOKEN_KEY = "internia_access_token";
const REFRESH_TOKEN_KEY = "internia_refresh_token";
const TOKEN_COOKIE = "internia_token";
const ONBOARDED_COOKIE = "internia_onboarded";
const IS_ADMIN_COOKIE = "internia_is_admin";
const MAX_AGE = 60 * 60 * 24 * 30;

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getIsAdmin(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((row) => row === `${IS_ADMIN_COOKIE}=1`);
}

export function setSession(accessToken: string, refreshToken: string, onboarded: boolean, isAdmin = false) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  document.cookie = `${TOKEN_COOKIE}=${accessToken}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  document.cookie = `${ONBOARDED_COOKIE}=${onboarded ? "1" : "0"}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  document.cookie = `${IS_ADMIN_COOKIE}=${isAdmin ? "1" : "0"}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function setTokenPair(accessToken: string, refreshToken: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  document.cookie = `${TOKEN_COOKIE}=${accessToken}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function setOnboarded(onboarded: boolean) {
  document.cookie = `${ONBOARDED_COOKIE}=${onboarded ? "1" : "0"}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function setIsAdminCookie(isAdmin: boolean) {
  document.cookie = `${IS_ADMIN_COOKIE}=${isAdmin ? "1" : "0"}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function clearSession() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${ONBOARDED_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${IS_ADMIN_COOKIE}=; path=/; max-age=0`;
}
