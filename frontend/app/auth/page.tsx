"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { normalizeRedirectTarget } from "./auth-utils";
import {
    performEmailAuth,
    performGoogleAuth,
    performPasswordReset,
} from "./auth-actions";
import { emitAnalyticsEvent, ANALYTICS_EVENT_NAMES } from "@/lib/analytics";

const EMPTY_STATE = { error: "", notice: "" };

function AuthPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = normalizeRedirectTarget(searchParams.get("redirect"));
    const resumeToken = searchParams.get("resume_token");
    const authError = searchParams.get("error");
    const authErrorEmail = searchParams.get("email");
    const queryNoAccountEmail =
        authError === "no_account" ? (authErrorEmail?.trim() ?? "") : "";
    const queryNoAccountMessage =
        authError === "no_account"
            ? queryNoAccountEmail
                ? `No account found with "${queryNoAccountEmail}"`
                : "No account found."
            : "";
    const queryPaymentMismatchMessage =
        authError === "payment_email_mismatch"
            ? "Please sign in with the same email used during checkout, or continue with Google for that account."
            : "";
    const [resumeState, setResumeState] = useState<
        | { state: "idle" }
        | { state: "loading" }
        | { state: "ready"; email: string; stripeSessionId: string }
        | { state: "error"; message: string }
    >(resumeToken ? { state: "loading" } : { state: "idle" });
    const stripeSessionId =
        searchParams.get("session_id") ??
        (resumeState.state === "ready" ? resumeState.stripeSessionId : null);
    const allowSignup =
        Boolean(stripeSessionId) || resumeState.state === "ready";
    const supabase = useMemo(() => getSupabaseBrowser(), []);

    const [email, setEmail] = useState(
        searchParams.get("email")?.trim() ?? queryNoAccountEmail,
    );
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState(EMPTY_STATE);
    const [hasInteracted, setHasInteracted] = useState(() =>
        Boolean(authError),
    );
    const [googlePendingResume, setGooglePendingResume] = useState<
        string | null
    >(() => {
        if (authError === "no_account" && queryNoAccountEmail && !allowSignup) {
            return queryNoAccountEmail.trim().toLowerCase();
        }
        return null;
    });
    const [resumePending, setResumePending] = useState(false);
    const [showCheckoutPrompt, setShowCheckoutPrompt] = useState(false);
    const [view, setView] = useState<"default" | "forgot_password">("default");
    const [loading, setLoading] = useState<
        "idle" | "email" | "google" | "reset"
    >("idle");
    const emailRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const activeError =
        status.error ||
        (!hasInteracted
            ? queryNoAccountMessage || queryPaymentMismatchMessage
            : "");

    // Reset happens on user actions; avoid effect-driven setState.

    const requestResumeLink = async (normalizedEmail: string) => {
        try {
            const response = await fetch("/api/auth/resume/request", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail }),
            });
            const payload = (await response.json()) as {
                data?: {
                    status?: string;
                    delivery?: string;
                    missing?: string[];
                };
                error?: { message?: string };
            };
            if (!response.ok) {
                return {
                    ok: false,
                    message:
                        payload.error?.message ??
                        "We couldn't send the setup link right now. Please try again.",
                    code: "request_failed" as const,
                };
            }
            const status = payload.data?.status;
            if (status === "no_paid_payment") {
                return {
                    ok: false,
                    message: "",
                    code: "no_paid_payment" as const,
                };
            }
            if (status === "already_linked") {
                return {
                    ok: true,
                    message: "That payment is already linked to an account.",
                    code: "already_linked" as const,
                };
            }
            if (status === "link_generated") {
                const missing = payload.data?.missing?.length
                    ? ` Missing: ${payload.data.missing.join(", ")}.`
                    : "";
                return {
                    ok: true,
                    message: `We generated your setup link. Check your server logs to continue.${missing}`,
                    code: "link_generated" as const,
                };
            }
            if (status === "email_sent") {
                return {
                    ok: true,
                    message:
                        "We sent a secure setup link to that email. Open it to finish setup.",
                    code: "email_sent" as const,
                };
            }
            return {
                ok: true,
                message:
                    "If a paid checkout was found, a setup link was sent. Please check your inbox.",
                code: "unknown" as const,
            };
        } catch (error) {
            console.warn("Unable to request setup resume link.", error);
            return {
                ok: false,
                message:
                    "We couldn't send the setup link right now. Please try again.",
                code: "request_failed" as const,
            };
        }
    };

    const resolveAccountProviderMessage = async (
        normalizedEmail: string,
        sessionId?: string | null,
    ): Promise<{ type: "active_error" | "notice"; message: string }> => {
        try {
            const response = await fetch("/api/auth/account-provider", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    email: normalizedEmail,
                    stripe_session_id: sessionId,
                }),
            });
            if (!response.ok) {
                return {
                    type: "active_error",
                    message: "Incorrect email or password.",
                };
            }
            const payload = (await response.json()) as {
                data?: { has_google_provider?: boolean };
            };
            if (payload.data?.has_google_provider) {
                return {
                    type: "notice",
                    message:
                        "That account uses Google. Please continue with Google to sign in.",
                };
            }
            return {
                type: "active_error",
                message: "Incorrect email or password.",
            };
        } catch (error) {
            console.warn(
                "Unable to resolve account provider for resume.",
                error,
            );
            return {
                type: "active_error",
                message: "Incorrect email or password.",
            };
        }
    };

    useEffect(() => {
        if (!googlePendingResume) {
            return;
        }
        let active = true;
        const run = async () => {
            const result = await requestResumeLink(googlePendingResume);
            if (!active) {
                return;
            }
            if (result.code === "no_paid_payment") {
                setShowCheckoutPrompt(true);
                if (googlePendingResume) {
                    setStatus({
                        error: `No account found with "${googlePendingResume}"`,
                        notice: "",
                    });
                } else {
                    setStatus({ error: "No account found.", notice: "" });
                }
            } else if (result.ok) {
                setShowCheckoutPrompt(false);
                setStatus({ error: "", notice: result.message });
            } else {
                setStatus({ error: result.message, notice: "" });
            }
            setGooglePendingResume(null);
            setResumePending(false);
        };
        void run();
        return () => {
            active = false;
        };
    }, [googlePendingResume]);

    useEffect(() => {
        if (!resumeToken) {
            return;
        }

        let active = true;
        const verify = async () => {
            try {
                const response = await fetch("/api/auth/resume/verify", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ token: resumeToken }),
                });
                const payload = (await response.json()) as {
                    data?: { email?: string; stripe_session_id?: string };
                    error?: { message?: string };
                };
                if (
                    !response.ok ||
                    !payload.data?.email ||
                    !payload.data?.stripe_session_id
                ) {
                    if (active) {
                        setResumeState({
                            state: "error",
                            message:
                                payload.error?.message ??
                                "This setup link is invalid or expired. Request a new one below.",
                        });
                    }
                    return;
                }

                if (active) {
                    setResumeState({
                        state: "ready",
                        email: payload.data.email,
                        stripeSessionId: payload.data.stripe_session_id,
                    });
                    setEmail(payload.data.email);
                }
            } catch (error) {
                console.warn("Unable to verify resume token.", error);
                if (active) {
                    setResumeState({
                        state: "error",
                        message:
                            "This setup link is invalid or expired. Request a new one below.",
                    });
                }
            }
        };

        void verify();

        return () => {
            active = false;
        };
    }, [resumeToken]);

    useEffect(() => {
        if (!allowSignup || !stripeSessionId) {
            return;
        }

        let active = true;

        const hydrateEmailFromCheckout = async () => {
            try {
                const response = await fetch("/api/payments/lookup", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ session_id: stripeSessionId }),
                });

                if (!response.ok) {
                    return;
                }

                const payload = (await response.json()) as {
                    data?: { payments?: Array<{ email?: string | null }> };
                };

                const checkoutEmail =
                    payload.data?.payments?.[0]?.email?.trim();
                if (!checkoutEmail || !active) {
                    return;
                }

                setEmail(current => (current ? current : checkoutEmail));
            } catch (error) {
                console.warn(
                    "Unable to prefill email from checkout session.",
                    error,
                );
            }
        };

        void hydrateEmailFromCheckout();

        return () => {
            active = false;
        };
    }, [allowSignup, stripeSessionId]);

    const handleEmail = async (mode: "sign-in" | "sign-up") => {
        setHasInteracted(true);
        setShowCheckoutPrompt(false);
        const resolvedEmail = (email || emailRef.current?.value || "").trim();
        const normalizedEmail = resolvedEmail.toLowerCase();
        const resolvedFirstName = (
            firstName ||
            firstNameRef.current?.value ||
            ""
        ).trim();
        const resolvedLastName = (
            lastName ||
            lastNameRef.current?.value ||
            ""
        ).trim();
        const resolvedPassword = password || passwordRef.current?.value || "";
        const resolvedConfirmPassword =
            confirmPassword || confirmPasswordRef.current?.value || "";

        if (!resolvedEmail || !resolvedPassword) {
            setStatus({
                error: "Enter your email and password to continue.",
                notice: "",
            });
            return;
        }

        if (
            allowSignup &&
            mode === "sign-up" &&
            resolvedPassword !== resolvedConfirmPassword
        ) {
            setStatus({
                error: "Passwords do not match.",
                notice: "",
            });
            return;
        }

        setLoading("email");
        setStatus(EMPTY_STATE);

        const result = await performEmailAuth({
            supabase,
            firstName: resolvedFirstName,
            lastName: resolvedLastName,
            email: resolvedEmail,
            password: resolvedPassword,
            mode,
            redirectTo,
            stripeSessionId,
            enforceCheckoutEmailMatch: Boolean(stripeSessionId),
            allowSignup,
        });

        if (result.error) {
            const normalizedError = result.error.toLowerCase();
            if (
                (normalizedError.includes("no account found") ||
                    normalizedError.includes("incorrect email or password")) &&
                !allowSignup
            ) {
                setLoading("idle");
                setResumePending(true);
                const resumeResult = await requestResumeLink(normalizedEmail);
                setResumePending(false);
                if (resumeResult.code === "no_paid_payment") {
                    setShowCheckoutPrompt(true);
                    setStatus({
                        error: result.error ?? "Incorrect email or password.",
                        notice: "",
                    });
                    return;
                }
                if (resumeResult.ok) {
                    setShowCheckoutPrompt(false);
                    if (resumeResult.code === "already_linked") {
                        const { type, message } =
                            await resolveAccountProviderMessage(
                                normalizedEmail,
                                stripeSessionId,
                            );
                        setStatus({
                            error: type === "active_error" ? message : "",
                            notice: type === "notice" ? message : "",
                        });
                    } else {
                        setStatus({
                            error: "",
                            notice: resumeResult.message,
                        });
                    }
                } else {
                    setStatus({ error: resumeResult.message, notice: "" });
                }
                return;
            }
            setLoading("idle");
            setStatus({ error: result.error, notice: "" });
            return;
        }

        if (result.notice) {
            setStatus({ error: "", notice: result.notice });
            return;
        }

        if (result.redirectTo) {
            if (allowSignup) {
                // Fire and forget, don't block redirect
                void emitAnalyticsEvent({
                    event_name: ANALYTICS_EVENT_NAMES.signupComplete,
                    metadata: {
                        stripe_session_id: stripeSessionId,
                        method: "email",
                    },
                });
            }
            router.replace(result.redirectTo);
        }
    };

    const handlePasswordReset = async () => {
        setHasInteracted(true);
        const resolvedEmail = (email || emailRef.current?.value || "").trim();

        if (!resolvedEmail) {
            setStatus({
                error: "Enter your email to receive a reset link.",
                notice: "",
            });
            return;
        }

        setLoading("reset");
        setStatus(EMPTY_STATE);

        const result = await performPasswordReset({
            email: resolvedEmail,
            // When resetting password, we want them to go to settings page to change it
            redirectTo: `${window.location.origin}/auth/callback?type=recovery&redirect=/dashboard/settings`,
        });

        setLoading("idle");

        if (result.error) {
            setStatus({ error: result.error, notice: "" });
            return;
        }

        if (result.notice) {
            setStatus({ error: "", notice: result.notice });
            // Optionally switch back to default view after success, or stay to show notice
            // setView("default");
        }
    };

    const handleGoogle = async () => {
        setHasInteracted(true);
        setLoading("google");
        setStatus(EMPTY_STATE);
        setShowCheckoutPrompt(false);

        const result = await performGoogleAuth({
            supabase,
            redirectTo,
            origin: window.location.origin,
            markPaid: allowSignup,
            stripeSessionId,
        });

        setLoading("idle");

        if (result.error) {
            const errorMessage = result.error.toLowerCase();
            if (errorMessage.includes("no account found") && !allowSignup) {
                const normalizedEmail = (email || emailRef.current?.value || "")
                    .trim()
                    .toLowerCase();
                if (normalizedEmail) {
                    setResumePending(true);
                    setGooglePendingResume(normalizedEmail);
                    return;
                }
                setStatus({
                    error: result.error,
                    notice: "",
                });
                return;
            }
            setStatus({ error: result.error, notice: "" });
            return;
        }

        if (result.redirectTo) {
            window.location.assign(result.redirectTo);
        }
    };

    if (resumeState.state === "loading") {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {view === "forgot_password"
                        ? "Reset Password"
                        : allowSignup
                          ? "Complete Your Account"
                          : "Sign In"}
                </h1>
                <p className="text-gray-500 mt-2">
                    {view === "forgot_password"
                        ? "Enter your email to receive a reset link."
                        : allowSignup
                          ? "Set up your account to activate your paid access."
                          : "Sign in to access your dashboard."}
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="space-y-4">
                    <label className="block" htmlFor="email">
                        <span className="text-sm font-medium text-gray-700">
                            Email
                        </span>
                        <input
                            id="email"
                            ref={emailRef}
                            type="email"
                            value={email}
                            onChange={event => {
                                setHasInteracted(true);
                                setEmail(event.target.value);
                            }}
                            placeholder="you@example.com"
                            disabled={allowSignup}
                            aria-disabled={allowSignup}
                            className={`mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                allowSignup
                                    ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                                    : "border-gray-200 bg-white"
                            }`}
                            autoComplete="email"
                        />
                    </label>

                    {allowSignup && (
                        <div className="flex gap-4">
                            <label className="block flex-1" htmlFor="firstName">
                                <span className="text-sm font-medium text-gray-700">
                                    First Name
                                </span>
                                <input
                                    id="firstName"
                                    ref={firstNameRef}
                                    type="text"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    placeholder="Jane"
                                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="block flex-1" htmlFor="lastName">
                                <span className="text-sm font-medium text-gray-700">
                                    Last Name
                                </span>
                                <input
                                    id="lastName"
                                    ref={lastNameRef}
                                    type="text"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                        </div>
                    )}

                    {view === "default" && (
                        <label className="block" htmlFor="password">
                            <span className="text-sm font-medium text-gray-700">
                                Password
                            </span>
                            <div className="relative">
                                <input
                                    id="password"
                                    ref={passwordRef}
                                    type="password"
                                    value={password}
                                    onChange={event => {
                                        setHasInteracted(true);
                                        setPassword(event.target.value);
                                    }}
                                    placeholder="••••••••"
                                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    autoComplete="current-password"
                                />
                            </div>
                            {!allowSignup && (
                                <div className="mt-1 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStatus(EMPTY_STATE);
                                            setView("forgot_password");
                                        }}
                                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}
                        </label>
                    )}

                    {view === "default" && allowSignup ? (
                        <label className="block" htmlFor="confirmPassword">
                            <span className="text-sm font-medium text-gray-700">
                                Confirm password
                            </span>
                            <input
                                id="confirmPassword"
                                ref={confirmPasswordRef}
                                type="password"
                                value={confirmPassword}
                                onChange={event => {
                                    setHasInteracted(true);
                                    setConfirmPassword(event.target.value);
                                }}
                                placeholder="••••••••"
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoComplete="new-password"
                            />
                        </label>
                    ) : null}

                    {view === "forgot_password" ? (
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                disabled={loading !== "idle"}
                                className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading === "reset"
                                    ? "Sending..."
                                    : "Send Reset Link"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStatus(EMPTY_STATE);
                                    setView("default");
                                }}
                                className="w-full text-sm text-gray-500 hover:text-gray-700"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                handleEmail(allowSignup ? "sign-up" : "sign-in")
                            }
                            disabled={loading !== "idle" || resumePending}
                            className={`w-full rounded-lg px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                                allowSignup
                                    ? "bg-purple-600 text-white hover:bg-purple-700"
                                    : "bg-white text-purple-700 border border-purple-200 hover:border-purple-300"
                            }`}
                        >
                            {loading === "email" || resumePending
                                ? "Working..."
                                : allowSignup
                                  ? "Create account"
                                  : "Sign in"}
                        </button>
                    )}

                    {allowSignup ? (
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            By creating an account, you agree to our{" "}
                            <a
                                href="/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-700 hover:text-purple-800 underline"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                                href="/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-700 hover:text-purple-800 underline"
                            >
                                Privacy Policy
                            </a>
                            .
                        </p>
                    ) : null}

                    {view === "default" && (
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-50 px-2 text-gray-400">
                                    Or
                                </span>
                            </div>
                        </div>
                    )}

                    {view === "default" && (
                        <button
                            type="button"
                            onClick={handleGoogle}
                            disabled={loading !== "idle" || resumePending}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 inline-flex items-center justify-center gap-2"
                        >
                            {loading === "google" ? (
                                "Connecting..."
                            ) : (
                                <>
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 01-2.4 3.62v3h3.88c2.28-2.1 3.56-5.2 3.56-8.65z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3A7.18 7.18 0 0112 19.2a7.2 7.2 0 01-6.76-4.98H1.23v3.13A12 12 0 0012 24z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.24 14.22A7.2 7.2 0 015 12c0-.77.14-1.5.24-2.22V6.65H1.23A12 12 0 000 12c0 1.93.46 3.76 1.23 5.35l4.01-3.13z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 4.8c1.76 0 3.33.6 4.56 1.8l3.42-3.42C17.94 1.1 15.23 0 12 0A12 12 0 001.23 6.65l4.01 3.13A7.2 7.2 0 0112 4.8z"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>
                    )}

                    <div aria-live="polite" className="min-h-[1.25rem]">
                        {activeError && (
                            <p className="text-sm text-red-600">
                                {activeError}
                            </p>
                        )}
                        {status.notice && (
                            <p className="text-sm text-emerald-600">
                                {status.notice}
                            </p>
                        )}
                    </div>

                    {showCheckoutPrompt ? (
                        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 space-y-3">
                            <p className="text-sm text-purple-900">
                                New here? Choose a plan, complete checkout, then
                                sign in to access your dashboard.
                            </p>
                            <div>
                                <Link
                                    href="/checkout"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                                >
                                    Choose Plan & Checkout
                                </Link>
                            </div>
                        </div>
                    ) : null}

                    {googlePendingResume ? (
                        <p className="text-sm text-gray-500">
                            Sending your setup link...
                        </p>
                    ) : null}

                    {resumeState.state === "error" ? (
                        <p className="text-sm text-red-600">
                            {resumeState.message}
                        </p>
                    ) : null}
                </div>
            </div>

            {!allowSignup ? (
                <p className="text-xs text-gray-400 mt-2 text-center">
                    New account creation is only available right after checkout.
                </p>
            ) : null}
        </div>
    );
}

export default function AuthPage() {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
            <Suspense
                fallback={
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                }
            >
                <AuthPageContent />
            </Suspense>
        </main>
    );
}
