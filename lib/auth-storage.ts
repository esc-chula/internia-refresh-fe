// Access + refresh tokens live in localStorage (used by the API client)
// plus two plain cookies (used by proxy.ts for route-protection redirects
// — see PLAN.md decision #6: bearer tokens, not cross-domain cookies, are
// the actual auth mechanism; these cookies only carry routing hints). The
// refresh token never needs a cookie — only this module's own fetch
// client reads it, to silently mint a new access token.
const ACCESS_TOKEN_KEY = "internia_access_token";
const REFRESH_TOKEN_KEY = "internia_refresh_token";
const TOKEN_COOKIE = "internia_token";
const ONBOARDED_COOKIE = "internia_onboarded";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setSession(accessToken: string, refreshToken: string, onboarded: boolean) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  document.cookie = `${TOKEN_COOKIE}=${accessToken}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  document.cookie = `${ONBOARDED_COOKIE}=${onboarded ? "1" : "0"}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

// setTokenPair updates just the access/refresh tokens (e.g. after a
// silent refresh) without touching the onboarded cookie.
export function setTokenPair(accessToken: string, refreshToken: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  document.cookie = `${TOKEN_COOKIE}=${accessToken}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function setOnboarded(onboarded: boolean) {
  document.cookie = `${ONBOARDED_COOKIE}=${onboarded ? "1" : "0"}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function clearSession() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${ONBOARDED_COOKIE}=; path=/; max-age=0`;
}
