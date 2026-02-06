"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthTabNotice, { useAuthTabStatus } from "./AuthTabNotice";
import PrimaryLinkButton from "../../../components/PrimaryLinkButton";

const copyBySession = (hasSessionId: boolean) => {
    if (hasSessionId) {
        return {
            eyebrow: "Payment successful",
            title: "Your plan is active. Let’s finish setup.",
            body: "Create your account with the same checkout email to unlock dashboard access.",
        };
    }

    return {
        eyebrow: "Checkout complete",
        title: "Thanks for your order",
        body: "If payment just finished, your confirmation may take a moment. You can continue now and complete account setup.",
    };
};

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const stripeSessionId = searchParams.get("session_id");
    const hasSessionId = Boolean(searchParams.get("session_id"));
    const { eyebrow, title, body } = copyBySession(hasSessionId);
    const { isAuthTab } = useAuthTabStatus();
    const [emailStatus, setEmailStatus] = useState<
        | { state: "idle" }
        | { state: "sending" }
        | { state: "sent"; message: string }
        | { state: "error"; message: string }
    >(stripeSessionId ? { state: "sending" } : { state: "idle" });
    const authHref = stripeSessionId
        ? `/auth?redirect=/dashboard&post_payment=1&session_id=${encodeURIComponent(stripeSessionId)}`
        : "/auth?redirect=/dashboard&post_payment=1";
    useEffect(() => {
        sessionStorage.removeItem("checkout_initiated");
        try {
            localStorage.removeItem("checkout_started_at");
        } catch (error) {
            console.warn("Unable to clear checkout start timestamp.", error);
        }
    }, []);

    useEffect(() => {
        if (!stripeSessionId || isAuthTab) {
            return;
        }
        let active = true;
        const send = async () => {
            try {
                const response = await fetch("/api/auth/resume/request", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ session_id: stripeSessionId }),
                });
                const payload = (await response.json()) as {
                    data?: { status?: string; delivery?: string };
                    error?: { message?: string };
                };
                if (!response.ok) {
                    if (active) {
                        setEmailStatus({
                            state: "error",
                            message:
                                payload.error?.message ??
                                "We couldn’t send your setup email yet. You can continue below.",
                        });
                    }
                    return;
                }

                if (!active) {
                    return;
                }
                switch (payload.data?.status) {
                    case "email_sent":
                        setEmailStatus({
                            state: "sent",
                            message:
                                "We emailed your setup link. Check your inbox to finish later.",
                        });
                        break;
                    case "link_generated":
                        setEmailStatus({
                            state: "sent",
                            message:
                                "Setup link generated. Check server logs if you want to finish later.",
                        });
                        break;
                    case "already_linked":
                        setEmailStatus({
                            state: "sent",
                            message:
                                "Your payment is already linked to an account.",
                        });
                        break;
                    case "no_paid_payment":
                    case "no_email_on_payment":
                        setEmailStatus({
                            state: "error",
                            message:
                                "We couldn’t confirm payment yet. You can still continue below to complete setup.",
                        });
                        break;
                    default:
                        setEmailStatus({
                            state: "sent",
                            message:
                                "We sent a setup link if your payment was confirmed.",
                        });
                }
            } catch (error) {
                console.warn("Unable to request resume setup email.", error);
                if (active) {
                    setEmailStatus({
                        state: "error",
                        message:
                            "We couldn’t send your setup email yet. You can continue below.",
                    });
                }
            }
        };

        void send();

        return () => {
            active = false;
        };
    }, [isAuthTab, stripeSessionId]);

    if (isAuthTab) {
        return (
            <div className="max-w-lg w-full text-center">
                <AuthTabNotice />
                <p className="text-sm text-gray-500">
                    Return to your original tab to finish signing in.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-lg w-full text-center">
            <AuthTabNotice />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-600 mb-2">
                {eyebrow}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-gray-500 mb-6">{body}</p>
            <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                    What happens next
                </p>
                <ul className="space-y-1.5 text-sm text-gray-600">
                    <li>1. Continue to account setup</li>
                    <li>2. Create your account</li>
                    <li>3. You’ll be redirected to your dashboard</li>
                </ul>
            </div>
            {emailStatus.state === "sending" ? (
                <p className="text-sm text-gray-500 mb-4">
                    Sending your setup email...
                </p>
            ) : null}
            {emailStatus.state === "sent" ? (
                <p className="text-sm text-emerald-700 mb-4">
                    {emailStatus.message}
                </p>
            ) : null}
            {emailStatus.state === "error" ? (
                <p className="text-sm text-amber-700 mb-4">
                    {emailStatus.message}
                </p>
            ) : null}
            <PrimaryLinkButton href={authHref}>
                Continue to Account Setup
            </PrimaryLinkButton>
            <p className="text-sm text-gray-400 mt-3">
                Important: Use the same email you used at checkout so we can
                link your paid access.
            </p>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
            <Suspense
                fallback={
                    <div className="max-w-lg w-full text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Loading...
                        </h1>
                    </div>
                }
            >
                <CheckoutSuccessContent />
            </Suspense>
        </main>
    );
}
