"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { ANALYTICS_EVENT_NAMES, emitAnalyticsEvent } from "@/lib/analytics";

type CheckoutResponse =
    | { data: { checkout_url: string }; error: null }
    | { data: null; error: { code: string; message: string } };

const CHECKOUT_LOCK_MAX_AGE_MS = 90 * 1000;
let activeCheckoutPromise: Promise<string> | null = null;
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const [hasError, setHasError] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState<
        "monthly" | "yearly"
    >(searchParams.get("billing") === "yearly" ? "yearly" : "monthly");

    const payload = useMemo(() => {
        const plan = searchParams.get("plan") ?? undefined;
        const billingParam = searchParams.get("billing");
        const billing =
            billingParam === "yearly" || billingParam === "monthly"
                ? billingParam
                : undefined;
        const source = searchParams.get("source") ?? undefined;

        return { plan, billing, source };
    }, [searchParams]);
    const hasSelectedPlan = Boolean(payload.plan);
    const source = payload.source ?? "checkout";

    useEffect(() => {
        if (!hasSelectedPlan) {
            return;
        }

        let cancelled = false;

        const startCheckout = async () => {
            try {
                const alreadyInitiated =
                    sessionStorage.getItem("checkout_initiated") === "1";
                if (alreadyInitiated) {
                    let shouldRecoverFromStaleLock = true;
                    try {
                        const startedAtRaw = localStorage.getItem(
                            "checkout_started_at",
                        );
                        const startedAt = startedAtRaw
                            ? Number.parseInt(startedAtRaw, 10)
                            : NaN;
                        const lockAge = Number.isNaN(startedAt)
                            ? Number.POSITIVE_INFINITY
                            : Date.now() - startedAt;
                        shouldRecoverFromStaleLock =
                            lockAge > CHECKOUT_LOCK_MAX_AGE_MS;
                    } catch (error) {
                        console.warn(
                            "Unable to read checkout start timestamp.",
                            error,
                        );
                    }

                    if (!shouldRecoverFromStaleLock) {
                        if (activeCheckoutPromise) {
                            const checkoutUrl = await activeCheckoutPromise;
                            if (!cancelled) {
                                window.location.assign(checkoutUrl);
                            }
                            return;
                        }

                        if (!cancelled) {
                            setIsWaiting(true);
                        }
                        return;
                    }

                    sessionStorage.removeItem("checkout_initiated");
                    try {
                        localStorage.removeItem("checkout_started_at");
                    } catch (error) {
                        console.warn(
                            "Unable to clear stale checkout lock.",
                            error,
                        );
                    }
                }

                sessionStorage.setItem("checkout_initiated", "1");
                try {
                    localStorage.setItem(
                        "checkout_started_at",
                        Date.now().toString(),
                    );
                } catch (error) {
                    console.warn(
                        "Unable to persist checkout start timestamp.",
                        error,
                    );
                }

                const requestPromise =
                    activeCheckoutPromise ??
                    (async () => {
                        const response = await fetch("/api/stripe/checkout", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify(payload),
                        });
                        const body =
                            (await response.json()) as CheckoutResponse;

                        if (!response.ok || body.error) {
                            throw new Error(
                                body.error?.message ?? "Checkout failed.",
                            );
                        }

                        const checkoutUrl = body.data.checkout_url;
                        if (!checkoutUrl) {
                            throw new Error("Missing Stripe checkout URL.");
                        }

                        return checkoutUrl;
                    })();

                activeCheckoutPromise = requestPromise;
                const checkoutUrl = await requestPromise;
                await new Promise(resolve => setTimeout(resolve, 600));
                if (!cancelled) {
                    window.location.assign(checkoutUrl);
                }
            } catch (error) {
                console.error("Checkout redirect failed.", error);
                if (!cancelled) {
                    setHasError(true);
                    setIsWaiting(false);
                }
                sessionStorage.removeItem("checkout_initiated");
                try {
                    localStorage.removeItem("checkout_started_at");
                } catch (error) {
                    console.warn(
                        "Unable to clear checkout start timestamp.",
                        error,
                    );
                }
            } finally {
                activeCheckoutPromise = null;
            }
        };

        void startCheckout();

        return () => {
            cancelled = true;
        };
    }, [hasSelectedPlan, payload]);

    const handleRetry = () => {
        sessionStorage.removeItem("checkout_initiated");
        try {
            localStorage.removeItem("checkout_started_at");
        } catch (error) {
            console.warn("Unable to clear checkout start timestamp.", error);
        }
        window.location.reload();
    };

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
                                    onClick={() =>
                                        setSelectedBilling("monthly")
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        selectedBilling === "monthly"
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedBilling("yearly")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        selectedBilling === "yearly"
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
                                        {selectedBilling === "yearly"
                                            ? plan.yearlyPrice
                                            : plan.monthlyPrice}
                                    </span>
                                    <span className="text-gray-500">
                                        /month
                                    </span>
                                    {selectedBilling === "yearly" ? (
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

                                <button
                                    type="button"
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
                                        const next = `/checkout?plan=${encodeURIComponent(
                                            plan.name,
                                        )}&billing=${selectedBilling}&source=${encodeURIComponent(source)}`;
                                        router.push(next);
                                    }}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all mt-auto ${
                                        plan.highlighted
                                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                    }`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Checkout
                </h1>
                <p className="text-gray-500 mb-6">
                    Redirecting to secure checkout...
                </p>
                {isWaiting && !hasError && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            If checkout is already in progress, please complete
                            or cancel it to continue. This page will stay here
                            to avoid creating a duplicate session.
                        </p>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
                        >
                            Retry Checkout
                        </button>
                    </div>
                )}
                {hasError && (
                    <div className="space-y-3">
                        <p className="text-sm text-red-600">
                            We couldn&apos;t start checkout. Please try again.
                        </p>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
                        >
                            Retry Checkout
                        </button>
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Loading...
                        </h1>
                    </div>
                </main>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
