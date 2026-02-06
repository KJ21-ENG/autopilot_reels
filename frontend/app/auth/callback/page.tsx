"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
    buildAuthErrorMessage,
    normalizeRedirectTarget,
    createAuthSession,
} from "../auth-utils";
import {
    buildNoAccountRedirectHref,
    buildPaymentMismatchRedirectHref,
} from "./recovery";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = useMemo(() => getSupabaseBrowser(), []);
    const redirectTo = normalizeRedirectTarget(searchParams.get("redirect"));
    const markPaidFlow = searchParams.get("post_payment") === "1";
    const stripeSessionId = searchParams.get("session_id");
    const hasRunRef = useRef(false);

    const [status, setStatus] = useState<
        | { state: "loading" }
        | { state: "error"; message: string }
        | { state: "success" }
    >({ state: "loading" });

    useEffect(() => {
        let active = true;

        const run = async () => {
            const redirectNoAccount = (email: string | null | undefined) => {
                const href = buildNoAccountRedirectHref({
                    redirectTo,
                    markPaidFlow,
                    stripeSessionId,
                    email,
                });
                if (active) {
                    setStatus({ state: "success" });
                    router.replace(href);
                }
            };
            const redirectPaymentMismatch = () => {
                const href = buildPaymentMismatchRedirectHref({
                    redirectTo,
                    markPaidFlow,
                    stripeSessionId,
                });
                if (active) {
                    setStatus({ state: "success" });
                    router.replace(href);
                }
            };

            if (hasRunRef.current) {
                return;
            }
            hasRunRef.current = true;
            const errorDescription = searchParams.get("error_description");
            const authCode = searchParams.get("code");

            if (errorDescription) {
                if (active) {
                    setStatus({
                        state: "error",
                        message: decodeURIComponent(errorDescription),
                    });
                }
                return;
            }

            if (!authCode) {
                if (active) {
                    setStatus({
                        state: "error",
                        message:
                            "Missing authorization code. Please try again.",
                    });
                }
                return;
            }

            const existingSession = await supabase.auth.getSession();

            if (existingSession.data?.session?.access_token) {
                const existingEmail =
                    existingSession.data.session.user?.email ?? null;
                const sessionResult = await createAuthSession({
                    accessToken: existingSession.data.session.access_token,
                    stripeSessionId,
                    enforcePaid: true,
                });

                if (sessionResult.error) {
                    if (sessionResult.error.code === "payment_email_mismatch") {
                        redirectPaymentMismatch();
                        return;
                    }
                    if (active) {
                        setStatus({
                            state: "error",
                            message: sessionResult.error.message,
                        });
                    }
                    return;
                }

                if (sessionResult.data?.paid === false) {
                    redirectNoAccount(existingEmail);
                    return;
                }

                if (active) {
                    setStatus({ state: "success" });
                    router.replace(redirectTo);
                }
                return;
            }

            const { data, error } =
                await supabase.auth.exchangeCodeForSession(authCode);

            if (error || !data?.session?.access_token) {
                const fallbackSession = await supabase.auth.getSession();
                if (fallbackSession.data?.session?.access_token) {
                    const fallbackEmail =
                        fallbackSession.data.session.user?.email ?? null;
                    const sessionResult = await createAuthSession({
                        accessToken: fallbackSession.data.session.access_token,
                        stripeSessionId,
                        enforcePaid: true,
                    });

                    if (sessionResult.error) {
                        if (
                            sessionResult.error.code ===
                            "payment_email_mismatch"
                        ) {
                            redirectPaymentMismatch();
                            return;
                        }
                        if (active) {
                            setStatus({
                                state: "error",
                                message: sessionResult.error.message,
                            });
                        }
                        return;
                    }

                    if (sessionResult.data?.paid === false) {
                        redirectNoAccount(fallbackEmail);
                        return;
                    }

                    if (active) {
                        setStatus({ state: "success" });
                        router.replace(redirectTo);
                    }
                    return;
                }

                if (active) {
                    setStatus({
                        state: "error",
                        message: buildAuthErrorMessage(error),
                    });
                }
                return;
            }

            const resolvedEmail = data.session.user?.email ?? null;
            const sessionResult = await createAuthSession({
                accessToken: data.session.access_token,
                stripeSessionId,
                enforcePaid: true,
            });

            if (sessionResult.error) {
                if (sessionResult.error.code === "payment_email_mismatch") {
                    redirectPaymentMismatch();
                    return;
                }
                if (active) {
                    setStatus({
                        state: "error",
                        message: sessionResult.error.message,
                    });
                }
                return;
            }

            if (sessionResult.data?.paid === false) {
                redirectNoAccount(resolvedEmail);
                return;
            }

            if (active) {
                setStatus({ state: "success" });
                router.replace(redirectTo);
            }
        };

        run();

        return () => {
            active = false;
        };
    }, [
        markPaidFlow,
        redirectTo,
        router,
        searchParams,
        stripeSessionId,
        supabase,
    ]);

    return (
        <div className="max-w-md w-full text-center">
            {status.state === "loading" ? (
                <>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Signing you in...
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Finishing Google authentication.
                    </p>
                </>
            ) : null}
            {status.state === "success" ? (
                <>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        You’re all set!
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Redirecting to your dashboard.
                    </p>
                </>
            ) : null}
            {status.state === "error" ? (
                <>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Sign-in failed
                    </h1>
                    <p className="text-gray-500 mt-2">{status.message}</p>
                    <a
                        href="/auth"
                        className="inline-flex mt-6 items-center justify-center rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
                    >
                        Back to sign in
                    </a>
                </>
            ) : null}
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
            <Suspense
                fallback={
                    <div className="max-w-md w-full text-center">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Loading...
                        </h1>
                    </div>
                }
            >
                <AuthCallbackContent />
            </Suspense>
        </main>
    );
}
