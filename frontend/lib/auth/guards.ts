import { SupabaseClient } from "@supabase/supabase-js";

export type AuthState = {
    isKnown: boolean;
    hasSession: boolean;
    hasPaid: boolean;
    isAdmin: boolean;
    userId?: string;
};

export type GuardDecision = {
    allowed: boolean;
    reason: "unknown" | "unauthenticated" | "unpaid" | "authorized";
    redirectTo?: string;
    message: string;
};

type CookieStoreLike = {
    get: (name: string) => { value: string } | undefined;
};

export const SESSION_COOKIE = "autopilotreels_session";
const PAID_COOKIE = "autopilotreels_paid";

export const PROTECTED_ROUTES = ["/dashboard"] as const;
export const GUEST_ROUTES = ["/", "/auth", "/checkout"] as const;

export function getAuthStateFromCookies(cookies: CookieStoreLike): AuthState {
    const hasSession = Boolean(cookies.get(SESSION_COOKIE)?.value);
    const hasPaid = Boolean(cookies.get(PAID_COOKIE)?.value);
    const isKnown = hasSession || hasPaid;

    return {
        isKnown,
        hasSession,
        hasPaid,
        isAdmin: false, // Cookie-based state is optimistic and lacks role detail
    };
}

export async function resolveVerifiedAuthState(
    cookies: CookieStoreLike,
    deps: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getSupabaseServer: () => SupabaseClient<any, "public", any>;
    },
): Promise<AuthState> {
    const accessToken = cookies.get(SESSION_COOKIE)?.value?.trim();
    if (!accessToken) {
        return {
            isKnown: false,
            hasSession: false,
            hasPaid: false,
            isAdmin: false,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let supabase: SupabaseClient<any, "public", any>;

    try {
        supabase = deps.getSupabaseServer();
    } catch (error) {
        console.warn("Unable to initialize Supabase for auth guard.", error);
        return {
            isKnown: false,
            hasSession: false,
            hasPaid: false,
            isAdmin: false,
        };
    }

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

    // 2. Check for Admin role
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

export function buildAuthRedirect(targetPath: string): string {
    const redirectTarget = encodeURIComponent(targetPath);
    return `/auth?redirect=${redirectTarget}`;
}

export function getProtectedRouteDecision({
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

export function getGuestRouteDecision({
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
