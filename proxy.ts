import { NextResponse, type NextRequest } from "next/server";

// Route-protection redirects only — the actual auth boundary is the
// backend rejecting/accepting the Bearer token on each API call. These
// cookies (set client-side after login/onboarding, see lib/auth-storage.ts)
// exist purely so this proxy can make routing decisions without a network
// round-trip (PLAN.md decision #6).
const PUBLIC_PATHS = ["/landing", "/login", "/auth/callback"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.cookies.get("internia_token")?.value);
  const isOnboarded = request.cookies.get("internia_onboarded")?.value === "1";
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isOnboardingPath = pathname === "/onboarding";

  if (!isAuthenticated) {
    if (isPublicPath) return NextResponse.next();
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isOnboarded) {
    if (isOnboardingPath) return NextResponse.next();
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (isOnboardingPath || isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
