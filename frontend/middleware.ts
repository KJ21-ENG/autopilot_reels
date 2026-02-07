import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

// --- Inlined Types & Constants from @/lib/auth/guards ---

type AuthState = {
    isKnown: boolean;
    hasSession: boolean;
    hasPaid: boolean;
    isAdmin: boolean;
    userId?: string;
};

type GuardDecision = {
    allowed: boolean;
    reason: "unknown" | "unauthenticated" | "unpaid" | "authorized";
    redirectTo?: string;
    message: string;
};

const SESSION_COOKIE = "autopilotreels_session";

function buildAuthRedirect(targetPath: string): string {
    const redirectTarget = encodeURIComponent(targetPath);
    return `/auth?redirect=${redirectTarget}`;
}

// --- Inlined Logic from @/lib/auth/guards ---

async function resolveVerifiedAuthState(
    supabase: SupabaseClient,
    cookies: { get: (name: string) => { value: string } | undefined },
): Promise<AuthState> {
    const accessToken = cookies.get(SESSION_COOKIE)?.value?.trim();

    // If no access token, we are definitely a guest
    if (!accessToken) {
        return {
            isKnown: false,
            hasSession: false,
            hasPaid: false,
            isAdmin: false,
        };
    }

    // Verify the user
    // Note: getUser() is safe to call in middleware and will validate the JWT
    const { data: userData, error: userError } =
        await supabase.auth.getUser(accessToken);

    if (userError || !userData.user?.id) {
        return {
            isKnown: false,
            hasSession: false,
            hasPaid: false,
            isAdmin: false,
        };
    }

    // Check payment status
    const { data: links, error: linksError } = await supabase
        .from("user_payment_links")
        .select("id")
        .eq("user_id", userData.user.id)
        .limit(1);

    if (linksError) {
        console.warn(
            "Unable to verify paid linkage for auth guard.",
            linksError,
        );
    }

    const hasPaid = Boolean(links && links.length > 0);

    // Check Admin role
    const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .single();

    const isAdmin = Boolean(roleData);

    return {
        isKnown: true,
        hasSession: true,
        hasPaid,
        isAdmin,
        userId: userData.user.id,
    };
}

function getProtectedRouteDecision({
    route,
    auth,
}: {
    route: string;
    auth: AuthState;
}): GuardDecision {
    if (!auth.isKnown) {
        return {
            allowed: false,
            reason: "unknown",
            redirectTo: buildAuthRedirect(route),
            message: "Please complete post-payment sign in to continue.",
        };
    }

    if (!auth.hasSession) {
        return {
            allowed: false,
            reason: "unauthenticated",
            redirectTo: buildAuthRedirect(route),
            message: "Please sign in to access your dashboard.",
        };
    }

    if (!auth.hasPaid && !auth.isAdmin) {
        return {
            allowed: false,
            reason: "unpaid",
            redirectTo: "/checkout",
            message: "Complete checkout to unlock dashboard access.",
        };
    }

    return {
        allowed: true,
        reason: "authorized",
        message: "Access granted.",
    };
}

function getGuestRouteDecision({
    route,
    auth,
}: {
    route: string;
    auth: AuthState;
}): GuardDecision {
    // If they aren't signed in, guest routes are always allowed
    if (!auth.hasSession) {
        return {
            allowed: true,
            reason: "authorized",
            message: "Guest access granted.",
        };
    }

    // Admins can browse guest routes like the landing page or checkout
    if (auth.isAdmin && (route === "/" || route === "/checkout")) {
        return {
            allowed: true,
            reason: "authorized",
            message: "Admins can browse guest routes.",
        };
    }

    // Normal users who are signed in:
    // If they are on /checkout and haven't paid yet, they are allowed to stay
    if (route === "/checkout" && !auth.hasPaid) {
        return {
            allowed: true,
            reason: "authorized",
            message: "Allowed to complete checkout.",
        };
    }

    // Otherwise, redirect them away from guest routes
    let redirectTo = "/dashboard/series";
    if (auth.isAdmin) {
        redirectTo = "/admin";
    } else if (!auth.hasPaid) {
        redirectTo = "/checkout";
    }

    return {
        allowed: false,
        reason: "authorized",
        redirectTo,
        message: "Already signed in. Redirecting to your dashboard.",
    };
}

// --- Middleware Main ---

export async function middleware(request: NextRequest) {
    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        // Initialize Supabase Client (Edge Compatible)
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value),
                        );
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options),
                        );
                    },
                },
            },
        );

        // Resolve Auth State
        const authState = await resolveVerifiedAuthState(
            supabase,
            request.cookies,
        );

        const { pathname } = request.nextUrl;

        // Handle Protected Routes (/dashboard)
        if (pathname.startsWith("/dashboard")) {
            const decision = getProtectedRouteDecision({
                route: pathname,
                auth: authState,
            });

            if (decision.allowed || decision.reason === "unpaid") {
                return response;
            }

            const redirectUrl = new URL(
                decision.redirectTo ?? "/auth",
                request.nextUrl.origin,
            );
            return NextResponse.redirect(redirectUrl);
        }

        // Handle Guest Routes (/, /auth, /checkout)
        const isGuestRoute =
            pathname === "/" ||
            pathname === "/auth" ||
            pathname === "/checkout";

        if (isGuestRoute) {
            const decision = getGuestRouteDecision({
                route: pathname,
                auth: authState,
            });

            if (decision.allowed) {
                return response;
            }

            const redirectUrl = new URL(
                decision.redirectTo ?? "/dashboard/series",
                request.nextUrl.origin,
            );
            return NextResponse.redirect(redirectUrl);
        }

        return response;
    } catch (e) {
        console.error("Middleware crash:", e);
        // Fail open
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/", "/auth", "/checkout", "/dashboard/:path*"],
};
