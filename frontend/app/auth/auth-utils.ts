type SupabaseError = { message?: string } | null | undefined;

type SessionResponse = {
    data: { session: true; paid?: boolean } | null;
    error: { code: string; message: string } | null;
};

export const DEFAULT_REDIRECT = "/dashboard/series";

export function normalizeRedirectTarget(value: string | null): string {
    if (!value) {
        return DEFAULT_REDIRECT;
    }

    if (value.startsWith("/") && !value.startsWith("//")) {
        return value;
    }

    return DEFAULT_REDIRECT;
}

export function buildOAuthRedirectUrl(
    origin: string,
    redirectTo: string,
): string {
    const target = encodeURIComponent(redirectTo);
    return `${origin}/auth/callback?redirect=${target}`;
}

export function buildAuthErrorMessage(error: SupabaseError): string {
    const message = error?.message?.toLowerCase() ?? "";

    if (message.includes("invalid login credentials")) {
        return "No account found with these credentials. Check your email/password, create an account, or use Continue with Google if you signed up with Google.";
    }

    if (message.includes("email") && message.includes("confirm")) {
        return "Check your email to confirm your account, then try signing in.";
    }

    if (message.includes("password") && message.includes("weak")) {
        return "Choose a stronger password and try again.";
    }

    if (message.includes("password") && message.includes("at least")) {
        return "Password must be at least 6 characters.";
    }

    if (message.includes("user already registered")) {
        return "That email already has an account. Please sign in instead.";
    }

    if (message.includes("signups not allowed")) {
        return "New email sign-ups are disabled right now. Please use Google sign-in.";
    }

    if (message.includes("invalid email")) {
        return "Enter a valid email address to continue.";
    }

    if (message.includes("rate limit")) {
        return "Too many attempts. Please wait a moment and try again.";
    }

    return "We couldn’t complete sign-in. Please try again.";
}

export async function createAuthSession({
    accessToken,
    stripeSessionId,
    enforcePaid,
    fetchFn = fetch,
}: {
    accessToken: string;
    stripeSessionId?: string | null;
    enforcePaid?: boolean;
    fetchFn?: typeof fetch;
}): Promise<SessionResponse> {
    const payload: { access_token: string; stripe_session_id?: string } = {
        access_token: accessToken,
    };
    if (stripeSessionId) {
        payload.stripe_session_id = stripeSessionId;
    }
    if (enforcePaid) {
        (payload as { enforce_paid?: boolean }).enforce_paid = true;
    }

    const response = await fetchFn("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        try {
            const payload = (await response.json()) as SessionResponse;
            return {
                data: null,
                error: payload.error ?? {
                    code: "session_failed",
                    message: "We couldn’t save your session.",
                },
            };
        } catch (error) {
            console.error("Unable to parse auth session response.", error);
            return {
                data: null,
                error: {
                    code: "session_failed",
                    message: "We couldn’t save your session.",
                },
            };
        }
    }

    return (await response.json()) as SessionResponse;
}
