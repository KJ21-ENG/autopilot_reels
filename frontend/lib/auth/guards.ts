import { SupabaseClient } from "@supabase/supabase-js";

export type AuthState = {
    isKnown: boolean;
    hasSession: boolean;
    hasPaid: boolean;
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

const SESSION_COOKIE = "autopilotreels_session";
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
    };
}

export async function resolveVerifiedAuthState(
    cookies: CookieStoreLike,
    deps: {
        getSupabaseServer: () => SupabaseClient<any, "public", any>;
    },
): Promise<AuthState> {
    const accessToken = cookies.get(SESSION_COOKIE)?.value?.trim();
    if (!accessToken) {
        return { isKnown: false, hasSession: false, hasPaid: false };
    }

    let supabase: SupabaseClient<any, "public", any>;

    try {
        supabase = deps.getSupabaseServer();
    } catch (error) {
        console.warn("Unable to initialize Supabase for auth guard.", error);
        return { isKnown: false, hasSession: false, hasPaid: false };
    }

    const { data: userData, error: userError } =
        await supabase.auth.getUser(accessToken);
    if (userError || !userData.user?.id) {
        return { isKnown: false, hasSession: false, hasPaid: false };
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
    return {
        isKnown: true,
        hasSession: true,
        hasPaid,
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

    if (!auth.hasPaid) {
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

    // If they are signed in, we generally want to redirect them to the dashboard
    // UNLESS they are on /checkout and haven't paid yet
    if (route === "/checkout" && !auth.hasPaid) {
        return {
            allowed: true,
            reason: "authorized",
            message: "Allowed to complete checkout.",
        };
    }

    return {
        allowed: false,
        reason: "authorized", // They are authorized, but not allowed on this guest route
        redirectTo: auth.hasPaid ? "/dashboard/series" : "/checkout",
        message: "Already signed in. Redirecting to your dashboard.",
    };
}
