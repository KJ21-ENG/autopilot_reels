"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import PrimaryLinkButton from "../../../components/PrimaryLinkButton";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

export default function CheckoutReturnPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [customerEmail, setCustomerEmail] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailStatus, setEmailStatus] = useState<{
        state: "idle" | "sending" | "sent" | "error";
        message: string;
    }>({ state: "idle", message: "" });

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        fetch(`/api/stripe/session?session_id=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                setStatus(data.status);
                setClientSecret(data.client_secret);
                setCustomerEmail(data.customer_email);
            })
            .catch(() => {
                setStatus("error");
            });

        // Check for active session using our internal API
        fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: "check" }),
        })
            .then(res => res.json())
            .then(payload => {
                if (payload.data?.session) {
                    setIsLoggedIn(true);
                }
            })
            .catch(() => setIsLoggedIn(false));
    }, [sessionId]);

    // Handle automated setup email for new users
    useEffect(() => {
        if (status !== "complete" || isLoggedIn || !sessionId) {
            return;
        }

        setEmailStatus({ state: "sending", message: "" });

        fetch("/api/auth/resume/request", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
        })
            .then(res => res.json())
            .then(payload => {
                switch (payload.data?.status) {
                    case "email_sent":
                        setEmailStatus({
                            state: "sent",
                            message: "We've emailed you a secure setup link.",
                        });
                        break;
                    case "link_generated":
                        setEmailStatus({
                            state: "sent",
                            message:
                                "Setup link generated (check server logs).",
                        });
                        break;
                    case "already_linked":
                        setEmailStatus({
                            state: "sent",
                            message: "Payment already linked to an account.",
                        });
                        break;
                    default:
                        setEmailStatus({
                            state: "error",
                            message:
                                "We couldn't send the setup email, but you can still continue below.",
                        });
                }
            })
            .catch(() => {
                setEmailStatus({
                    state: "error",
                    message:
                        "We couldn't send the setup email, but you can still continue below.",
                });
            });
    }, [status, isLoggedIn, sessionId]);

    if (!sessionId) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Invalid Session
                    </h1>
                    <Link
                        href="/"
                        className="text-purple-600 hover:text-purple-700"
                    >
                        Go Home
                    </Link>
                </div>
            </main>
        );
    }

    if (status === "error") {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Something went wrong
                    </h1>
                    <p className="text-gray-600 mb-4">
                        We couldn&apos;t retrieve your order details. Please try
                        again.
                    </p>
                    <Link
                        href="/checkout"
                        className="text-purple-600 hover:text-purple-700"
                    >
                        Return to Checkout
                    </Link>
                </div>
            </main>
        );
    }

    if (status === "open") {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Incomplete
                    </h1>
                    <Link
                        href="/checkout"
                        className="text-purple-600 hover:text-purple-700"
                    >
                        Return to Checkout
                    </Link>
                </div>
            </main>
        );
    }

    if (status === "complete") {
        if (clientSecret) {
            return (
                <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-4xl mx-auto min-h-[600px]">
                        <EmbeddedCheckoutProvider
                            key={clientSecret}
                            stripe={stripePromise}
                            options={{ clientSecret }}
                        >
                            <EmbeddedCheckout className="h-full w-full" />
                        </EmbeddedCheckoutProvider>
                    </div>
                </main>
            );
        }

        const isNewUser = !isLoggedIn;

        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 mb-2">
                        {isNewUser ? "Payment Successful" : "Order Complete"}
                    </p>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        {isNewUser ? "Let's finish setup." : "Welcome back!"}
                    </h1>

                    <p className="text-gray-500 mb-8 text-lg">
                        {isNewUser
                            ? "Your plan is active. Complete your account setup to unlock your dashboard."
                            : "Your subscription has been successfully upgraded."}
                    </p>

                    {isNewUser && (
                        <div className="mb-10 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-left">
                            <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                                What happens next
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-600">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                        1
                                    </div>
                                    <span className="text-sm font-medium">
                                        Continue to account setup
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                        2
                                    </div>
                                    <span className="text-sm font-medium">
                                        Create your secure account
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                        3
                                    </div>
                                    <span className="text-sm font-medium">
                                        Access your video studio
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className="space-y-4">
                        {isNewUser && emailStatus.state !== "idle" && (
                            <p
                                className={`text-sm font-medium ${emailStatus.state === "error" ? "text-amber-600" : "text-emerald-600"}`}
                            >
                                {emailStatus.state === "sending"
                                    ? "Sending your setup link..."
                                    : emailStatus.message}
                            </p>
                        )}

                        <PrimaryLinkButton
                            href={
                                isNewUser
                                    ? `/auth?session_id=${sessionId}${customerEmail ? `&email=${encodeURIComponent(customerEmail)}` : ""}`
                                    : "/dashboard"
                            }
                            className="py-4 text-lg shadow-xl shadow-purple-100 hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            {isNewUser
                                ? "Continue to Account Setup"
                                : "Go to Dashboard"}
                        </PrimaryLinkButton>

                        {isNewUser && (
                            <p className="text-xs text-gray-400 font-medium">
                                Important: Use the same email you used at
                                checkout.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading order status...</p>
            </div>
        </main>
    );
}
