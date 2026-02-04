import { NextRequest, NextResponse } from "next/server";

import { getAuthStateFromCookies, getProtectedRouteDecision } from "@/lib/auth/guards";

export function middleware(request: NextRequest) {
  const authState = getAuthStateFromCookies(request.cookies);
  const decision = getProtectedRouteDecision({
    route: request.nextUrl.pathname,
    auth: authState,
  });

  if (decision.allowed) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(decision.redirectTo ?? "/auth", request.nextUrl.origin);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
