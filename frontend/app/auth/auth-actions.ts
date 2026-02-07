import type { SupabaseClient } from "@supabase/supabase-js";
import { buildAuthErrorMessage, createAuthSession } from "./auth-utils";

type AuthSession = { access_token: string } | null | undefined;

type AuthResult = {
    redirectTo?: string;
    notice?: string;
    error?: string;
};

type AuthClient = SupabaseClient;

type FetchFn = typeof fetch;

type EmailMode = "sign-in" | "sign-up";

async function validateCheckoutEmailMatch({
    email,
    stripeSessionId,
    fetchFn,
}: {
    email: string;
    stripeSessionId: string;
    fetchFn: FetchFn;
}): Promise<{ ok: true } | { ok: false; message: string }> {
    try {
        const response = await fetchFn("/api/auth/validate-checkout-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                stripe_session_id: stripeSessionId,
            }),
        });

        if (!response.ok) {
            return {
                ok: false,
                message:
                    "We couldn’t verify your checkout session. Return to checkout confirmation and try again.",
            };
        }

        const payload = (await response.json()) as {
            data?: { match?: boolean; payment_found?: boolean };
        };

        if (!payload.data?.payment_found) {
            return {
                ok: false,
                message:
                    "We couldn’t verify your checkout session. Return to checkout confirmation and try again.",
            };
        }

        if (!payload.data.match) {
            return {
                ok: false,
                message:
                    "Use the same email you used during checkout to create your account.",
            };
        }

        return { ok: true };
    } catch (error) {
        console.warn("Unable to validate checkout email ownership.", error);
        return {
            ok: false,
            message:
                "We couldn’t verify your checkout session. Please try again.",
        };
    }
}

async function resolveAlreadyRegisteredMessage({
    email,
    stripeSessionId,
    fetchFn,
}: {
    email: string;
    stripeSessionId?: string | null;
    fetchFn: FetchFn;
}): Promise<string> {
    try {
        const response = await fetchFn("/api/auth/account-provider", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, stripe_session_id: stripeSessionId }),
        });

        if (!response.ok) {
            return "That email already has an account. Please sign in instead.";
        }

        const payload = (await response.json()) as {
            data?: { has_google_provider?: boolean };
        };

        if (payload.data?.has_google_provider) {
            return "That email already has an account. Please use Continue with Google to log in.";
        }
    } catch (error) {
        console.warn(
            "Unable to resolve auth provider for existing account.",
            error,
        );
    }

    return "That email already has an account. Please sign in instead.";
}

export async function performEmailAuth({
    supabase,
    firstName,
    lastName,
    email,
    password,
    mode,
    redirectTo,
    stripeSessionId,
    enforceCheckoutEmailMatch = false,
    allowSignup = true,
    fetchFn = fetch,
}: {
    supabase: AuthClient;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    mode: EmailMode;
    redirectTo: string;
    stripeSessionId?: string | null;
    enforceCheckoutEmailMatch?: boolean;
    allowSignup?: boolean;
    fetchFn?: FetchFn;
}): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
        return { error: "Enter a valid email address to continue." };
    }

    if (mode === "sign-up" && !allowSignup) {
        return {
            error: "Account creation is only available after checkout. Please complete checkout first.",
        };
    }

    if (mode === "sign-up" && enforceCheckoutEmailMatch && stripeSessionId) {
        const ownershipCheck = await validateCheckoutEmailMatch({
            email: normalizedEmail,
            stripeSessionId,
            fetchFn,
        });
        if (!ownershipCheck.ok) {
            return { error: ownershipCheck.message };
        }
    }

    const action =
        mode === "sign-up"
            ? supabase.auth.signUp({
                  email: normalizedEmail,
                  password,
                  options: {
                      data: {
                          first_name: firstName,
                          last_name: lastName,
                          full_name:
                              `${firstName ?? ""} ${lastName ?? ""}`.trim(),
                      },
                  },
              })
            : supabase.auth.signInWithPassword({
                  email: normalizedEmail,
                  password,
              });

    const { data, error } = await action;

    if (error) {
        const normalizedErrorMessage = error.message?.toLowerCase() ?? "";
        if (normalizedErrorMessage.includes("invalid login credentials")) {
            return { error: "Incorrect email or password." };
        }

        if (normalizedErrorMessage.includes("user already registered")) {
            return {
                error: await resolveAlreadyRegisteredMessage({
                    email: normalizedEmail,
                    stripeSessionId,
                    fetchFn,
                }),
            };
        }

        return { error: buildAuthErrorMessage(error) };
    }

    const session = (data as { session?: AuthSession }).session;

    if (!session?.access_token) {
        return {
            notice: "Check your email to confirm your account, then sign in to continue.",
        };
    }

    const sessionResult = await createAuthSession({
        accessToken: session.access_token,
        stripeSessionId,
        enforcePaid: Boolean(stripeSessionId),
        fetchFn,
    });

    if (sessionResult.error) {
        return { error: sessionResult.error.message };
    }

    return { redirectTo };
}

export async function performGoogleAuth({
    supabase,
    redirectTo,
    origin,
    markPaid,
    stripeSessionId,
}: {
    supabase: AuthClient;
    redirectTo: string;
    origin: string;
    markPaid: boolean;
    stripeSessionId?: string | null;
}): Promise<AuthResult> {
    const callbackParams = new URLSearchParams({ redirect: redirectTo });
    if (markPaid) {
        callbackParams.set("post_payment", "1");
    }
    if (stripeSessionId) {
        callbackParams.set("session_id", stripeSessionId);
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback?${callbackParams.toString()}`,
        },
    });

    if (error) {
        return { error: buildAuthErrorMessage(error) };
    }

    if (data?.url) {
        return { redirectTo: data.url };
    }

    return { error: "We couldn’t start Google sign-in. Please try again." };
}

export async function performPasswordReset({
    email,
    redirectTo,
}: {
    email: string;
    redirectTo: string;
}): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
        return { error: "Enter a valid email address to continue." };
    }

    const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, redirectTo }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.error || "Failed to send reset email." };
    }

    return {
        notice: "Check your email for the reset link.",
    };
}
