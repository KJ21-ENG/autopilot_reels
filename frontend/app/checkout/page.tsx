"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { ANALYTICS_EVENT_NAMES, emitAnalyticsEvent } from "@/lib/analytics";

// Initialize Stripe outside of component
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

type CheckoutResponse =
    | { data: { client_secret: string }; error: null }
    | { data: null; error: { code: string; message: string } };

const plans = [
    {
        name: "Starter",
        monthlyPrice: 19,
        yearlyPrice: 15,
        description: "Perfect for getting started",
        cta: "Get Starter",
        highlighted: false,
        features: [
            "30 videos per month",
            "720p video quality",
            "Basic AI voices",
            "1 social account",
            "Email support",
        ],
    },
    {
        name: "Creator",
        monthlyPrice: 39,
        yearlyPrice: 29,
        description: "Most popular for growing creators",
        cta: "Get Creator",
        highlighted: true,
        badge: "Most Popular",
        features: [
            "100 videos per month",
            "1080p video quality",
            "Premium AI voices",
            "3 social accounts",
            "Auto-posting enabled",
            "Priority support",
        ],
    },
    {
        name: "Pro",
        monthlyPrice: 79,
        yearlyPrice: 59,
        description: "For serious content creators",
        cta: "Get Pro",
        highlighted: false,
        features: [
            "Unlimited videos",
            "4K video quality",
            "All AI voices + custom",
            "10 social accounts",
            "Advanced analytics",
            "Dedicated support",
            "API access",
        ],
    },
];

function CheckoutContent() {
    const searchParams = useSearchParams();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    // Initialize state with search params if available, else default to monthly
    const [billingMode, setBillingMode] = useState<"monthly" | "yearly">(() => {
        return searchParams.get("billing") === "yearly" ? "yearly" : "monthly";
    });

    const payload = useMemo(() => {
        const plan = searchParams.get("plan") ?? undefined;
        // If the user hasn't selected a plan, we can't create a session yet.
        // But if they have, we use the CURRENT state for billing, not just the URL param.
        // However, the original code used URL params to drive everything.
        // Let's stick to using state for the UI toggle, and pass that to the API.

        const source = searchParams.get("source") ?? "checkout";
        return { plan, billing: billingMode, source };
    }, [searchParams, billingMode]);

    const hasSelectedPlan = Boolean(payload.plan);

    useEffect(() => {
        if (!hasSelectedPlan) {
            setClientSecret(null);
            return;
        }

        let cancelled = false;

        const createSession = async () => {
            try {
                // Clear any previous error/secret when switching plans/billing
                setError(null);

                const response = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const body = (await response.json()) as CheckoutResponse;

                if (!response.ok || body.error) {
                    throw new Error(body.error?.message ?? "Checkout failed.");
                }

                if (!cancelled) {
                    setClientSecret(body.data.client_secret);
                }
            } catch (err: unknown) {
                console.error("Checkout session creation failed.", err);
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong.",
                    );
                }
            }
        };

        void createSession();

        return () => {
            cancelled = true;
        };
    }, [payload, hasSelectedPlan]);

    // If no plan selected, show plan selector
    if (!hasSelectedPlan) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 pt-8 pb-6 md:pt-10 md:pb-8 flex justify-center">
                <section className="w-full max-w-6xl">
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                href="/"
                                aria-label="Back to home"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </Link>
                            <h1 className="flex-1 text-center text-3xl md:text-4xl font-bold text-gray-900">
                                Choose your plan
                            </h1>
                            <div className="h-10 w-10" aria-hidden="true" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 mb-6">
                                Select a plan to continue to secure checkout.
                            </p>
                            <p className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 mb-8">
                                Important: Use the same email during checkout
                                that you will use to create your account after
                                payment. Access is linked to that email.
                            </p>
                            <div className="inline-flex items-center gap-3 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setBillingMode("monthly")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        billingMode === "monthly"
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBillingMode("yearly")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        billingMode === "yearly"
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Yearly
                                    <span className="ml-1 text-xs text-green-500 font-semibold">
                                        Save 25%
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map(plan => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl p-8 transition-all flex flex-col h-full ${
                                    plan.highlighted
                                        ? "bg-white border-2 border-purple-500 shadow-xl scale-105 z-10"
                                        : "bg-white border border-gray-200 shadow-sm"
                                }`}
                            >
                                {plan.badge ? (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            {plan.badge}
                                        </span>
                                    </div>
                                ) : null}

                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {plan.name}
                                </h2>
                                <p className="text-gray-500 text-sm mb-4">
                                    {plan.description}
                                </p>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">
                                        $
                                        {billingMode === "yearly"
                                            ? plan.yearlyPrice
                                            : plan.monthlyPrice}
                                    </span>
                                    <span className="text-gray-500">
                                        /month
                                    </span>
                                    {billingMode === "yearly" ? (
                                        <p className="text-sm text-green-600 mt-1">
                                            Billed ${plan.yearlyPrice * 12}/year
                                        </p>
                                    ) : null}
                                </div>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map(feature => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-2 text-gray-600 text-sm"
                                        >
                                            <svg
                                                className="w-5 h-5 text-purple-600 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/checkout?plan=${encodeURIComponent(
                                        plan.name,
                                    )}&billing=${billingMode}&source=${encodeURIComponent(
                                        payload.source ?? "checkout",
                                    )}`}
                                    onClick={() => {
                                        void emitAnalyticsEvent(
                                            {
                                                event_name:
                                                    ANALYTICS_EVENT_NAMES.ctaClick,
                                                metadata: {
                                                    location: "checkout",
                                                    plan: plan.name,
                                                },
                                            },
                                            {
                                                useBeacon: true,
                                                beaconOnly: true,
                                            },
                                        );
                                    }}
                                    className={`block text-center w-full py-3 rounded-lg font-semibold transition-all mt-auto ${
                                        plan.highlighted
                                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        );
    }

    // Render Embedded Checkout
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col p-4">
            {/* Branded Header */}
            <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-6 mb-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
                        <svg
                            className="w-6 h-6 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                        AutopilotReels
                    </span>
                </Link>
                <Link
                    href="/checkout"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-full transition-colors"
                >
                    Change Plan
                </Link>
            </header>

            <div className="w-full max-w-4xl mx-auto min-h-[600px] flex-grow">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Complete your subscription
                    </h1>
                    <p className="text-gray-500">
                        Secure checkout powered by Stripe
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
                            Selected Plan
                        </p>
                        <h2 className="text-xl font-bold text-gray-900">
                            {payload.plan} ({payload.billing})
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                            $
                            {payload.billing === "yearly"
                                ? plans.find(p => p.name === payload.plan)
                                      ?.yearlyPrice
                                : plans.find(p => p.name === payload.plan)
                                      ?.monthlyPrice}
                            <span className="text-sm text-gray-500 font-normal">
                                /mo
                            </span>
                        </p>
                        {payload.billing === "yearly" && (
                            <p className="text-xs text-green-600 font-medium">
                                Billed annually
                            </p>
                        )}
                    </div>
                </div>

                {clientSecret ? (
                    <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{ clientSecret }}
                    >
                        <EmbeddedCheckout className="h-full w-full" />
                    </EmbeddedCheckoutProvider>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-[400px] p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-gray-500">Loading checkout...</p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-white flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading...</p>
                    </div>
                </main>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
