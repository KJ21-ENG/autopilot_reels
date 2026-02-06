import { NextRequest, NextResponse } from "next/server";

import {
    getGuestRouteDecision,
    getProtectedRouteDecision,
    resolveVerifiedAuthState,
} from "@/lib/auth/guards";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const authState = await resolveVerifiedAuthState(request.cookies, {
        getSupabaseServer,
    });

    // Handle Protected Routes (/dashboard)
    if (pathname.startsWith("/dashboard")) {
        const decision = getProtectedRouteDecision({
            route: pathname,
            auth: authState,
        });

        if (decision.allowed || decision.reason === "unpaid") {
            return NextResponse.next();
        }

        const redirectUrl = new URL(
            decision.redirectTo ?? "/auth",
            request.nextUrl.origin,
        );
        return NextResponse.redirect(redirectUrl);
    }

    // Handle Guest Routes (/, /auth, /checkout)
    const isGuestRoute =
        pathname === "/" || pathname === "/auth" || pathname === "/checkout";

    if (isGuestRoute) {
        const decision = getGuestRouteDecision({
            route: pathname,
            auth: authState,
        });

        if (decision.allowed) {
            return NextResponse.next();
        }

        const redirectUrl = new URL(
            decision.redirectTo ?? "/dashboard/series",
            request.nextUrl.origin,
        );
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/auth", "/checkout", "/dashboard/:path*"],
};
