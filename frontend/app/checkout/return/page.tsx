"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import Link from "next/link";

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
            body: JSON.stringify({ accessToken: "check" }), // API handles validation
        })
            .then(res => res.json())
            .then(payload => {
                if (payload.data?.session) {
                    setIsLoggedIn(true);
                }
            })
            .catch(() => setIsLoggedIn(false));
    }, [sessionId]);

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
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        {isNewUser
                            ? "Thank you for your purchase. Next, let's complete your account setup to activate your subscription."
                            : "Thank you for your purchase. Your account has been upgraded."}
                    </p>
                    {isNewUser ? (
                        <Link
                            href={`/auth?session_id=${sessionId}${customerEmail ? `&email=${encodeURIComponent(customerEmail)}` : ""}`}
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:scale-105"
                        >
                            Complete Account Setup
                        </Link>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:scale-105"
                        >
                            Go to Dashboard
                        </Link>
                    )}
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
