"use client";

import { useState, useEffect } from "react";

import { ANALYTICS_EVENT_NAMES, emitAnalyticsEvent } from "@/lib/analytics";
import type { StripePlan, StripeProductsResponse } from "@/app/api/stripe/products/route";

// Currency symbol helper
function getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
        usd: "$",
        gbp: "£",
        eur: "€",
        cad: "CA$",
        aud: "A$",
        jpy: "¥",
        inr: "₹",
    };
    return symbols[currency.toLowerCase()] || currency.toUpperCase() + " ";
}

// Format price from cents to display
function formatPrice(amountInCents: number, currency: string): string {
    const symbol = getCurrencySymbol(currency);
    const amount = amountInCents / 100;
    if (amount % 1 === 0) {
        return `${symbol}${amount}`;
    }
    return `${symbol}${amount.toFixed(2)}`;
}

// Get monthly equivalent price for yearly plans
function getMonthlyEquivalent(yearlyAmountInCents: number): number {
    return Math.round(yearlyAmountInCents / 12);
}

// Fallback plans if Stripe fetch fails
const fallbackPlans: StripePlan[] = [
    {
        id: "starter",
        name: "Starter",
        description: "Perfect for getting started",
        highlighted: false,
        badge: null,
        features: [
            "30 videos per month",
            "720p video quality",
            "Basic AI voices",
            "1 social account",
            "Email support",
        ],
        monthlyPrice: { id: "", amount: 1900, currency: "usd" },
        yearlyPrice: { id: "", amount: 18000, currency: "usd" },
    },
    {
        id: "creator",
        name: "Creator",
        description: "Most popular for growing creators",
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
        monthlyPrice: { id: "", amount: 3900, currency: "usd" },
        yearlyPrice: { id: "", amount: 34800, currency: "usd" },
    },
    {
        id: "pro",
        name: "Pro",
        description: "For serious content creators",
        highlighted: false,
        badge: null,
        features: [
            "Unlimited videos",
            "4K video quality",
            "All AI voices + custom",
            "10 social accounts",
            "Advanced analytics",
            "Dedicated support",
            "API access",
        ],
        monthlyPrice: { id: "", amount: 7900, currency: "usd" },
        yearlyPrice: { id: "", amount: 70800, currency: "usd" },
    },
];

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);
    const [plans, setPlans] = useState<StripePlan[]>(fallbackPlans);
    const [loading, setLoading] = useState(true);

    // Fetch plans from Stripe
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch("/api/stripe/products");
                const data = (await response.json()) as StripeProductsResponse;

                if (data.data?.plans && data.data.plans.length > 0) {
                    // Clean plan names for display (remove "Plan" suffix)
                    const cleanedPlans = data.data.plans.map((plan) => ({
                        ...plan,
                        name: plan.name.replace(/ Plan$/i, "").trim(),
                    }));
                    setPlans(cleanedPlans);
                }
            } catch (err) {
                console.error("Failed to fetch plans:", err);
            } finally {
                setLoading(false);
            }
        };

        void fetchPlans();
    }, []);

    // Calculate savings percentage based on actual prices
    const savingsPercent =
        plans[0]?.monthlyPrice && plans[0]?.yearlyPrice
            ? Math.round(
                100 -
                (getMonthlyEquivalent(plans[0].yearlyPrice.amount) /
                    plans[0].monthlyPrice.amount) *
                100,
            )
            : 25;

    return (
        <section id="pricing" className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Choose your plan
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Simple pricing. No hidden fees. Cancel anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isYearly
                                    ? "bg-purple-600 text-white"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isYearly
                                    ? "bg-purple-600 text-white"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Yearly
                            <span className="ml-1 text-xs text-green-500 font-semibold">
                                Save {savingsPercent}%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-gray-200 animate-pulse"
                            >
                                <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>
                                <div className="h-10 bg-gray-200 rounded w-32 mb-6"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((j) => (
                                        <div
                                            key={j}
                                            className="h-4 bg-gray-200 rounded w-full"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Pricing Cards */
                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan) => {
                            const priceData = isYearly
                                ? plan.yearlyPrice
                                : plan.monthlyPrice;
                            const currency = priceData?.currency || "usd";
                            const displayAmount =
                                isYearly && priceData
                                    ? getMonthlyEquivalent(priceData.amount)
                                    : priceData?.amount || 0;
                            const yearlyTotal = plan.yearlyPrice?.amount
                                ? plan.yearlyPrice.amount / 100
                                : 0;

                            const planHref = `/checkout?source=pricing&plan=${encodeURIComponent(
                                plan.name,
                            )}&billing=${isYearly ? "yearly" : "monthly"}`;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-2xl p-8 transition-all flex flex-col h-full ${plan.highlighted
                                            ? "bg-white border-2 border-purple-500 shadow-xl scale-105 z-10"
                                            : "bg-white border border-gray-200 shadow-sm"
                                        }`}
                                >
                                    {/* Popular Badge */}
                                    {plan.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                {plan.badge}
                                            </span>
                                        </div>
                                    )}

                                    {/* Plan Name */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        {plan.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-gray-900">
                                            {formatPrice(displayAmount, currency)}
                                        </span>
                                        <span className="text-gray-500">/month</span>
                                        {isYearly && yearlyTotal > 0 && (
                                            <p className="text-sm text-green-600 mt-1">
                                                Billed {getCurrencySymbol(currency)}
                                                {yearlyTotal}/year
                                            </p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8 flex-grow">
                                        {plan.features.map((feature, i) => (
                                            <li
                                                key={i}
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

                                    {/* CTA Button */}
                                    <a
                                        href={planHref}
                                        className={`block text-center w-full py-3 rounded-lg font-semibold transition-all mt-auto ${plan.highlighted
                                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                            }`}
                                        onClick={() => {
                                            void emitAnalyticsEvent(
                                                {
                                                    event_name:
                                                        ANALYTICS_EVENT_NAMES.ctaClick,
                                                    metadata: {
                                                        location: "pricing",
                                                        plan: plan.name,
                                                    },
                                                },
                                                {
                                                    useBeacon: true,
                                                    beaconOnly: true,
                                                },
                                            );
                                        }}
                                    >
                                        Get {plan.name}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
