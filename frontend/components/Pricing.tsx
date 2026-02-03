"use client";

import { useState } from "react";

const plans = [
    {
        name: "Starter",
        monthlyPrice: 19,
        yearlyPrice: 15,
        description: "Perfect for getting started",
        features: [
            "30 videos per month",
            "720p video quality",
            "Basic AI voices",
            "1 social account",
            "Email support",
        ],
        cta: "Get Starter",
        highlighted: false,
    },
    {
        name: "Creator",
        monthlyPrice: 39,
        yearlyPrice: 29,
        description: "Most popular for growing creators",
        features: [
            "100 videos per month",
            "1080p video quality",
            "Premium AI voices",
            "3 social accounts",
            "Auto-posting enabled",
            "Priority support",
        ],
        cta: "Get Creator",
        highlighted: true,
        badge: "Most Popular",
    },
    {
        name: "Pro",
        monthlyPrice: 79,
        yearlyPrice: 59,
        description: "For serious content creators",
        features: [
            "Unlimited videos",
            "4K video quality",
            "All AI voices + custom",
            "10 social accounts",
            "Advanced analytics",
            "Dedicated support",
            "API access",
        ],
        cta: "Get Pro",
        highlighted: false,
    },
];

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

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
                            <span className="ml-1 text-xs text-green-500 font-semibold">Save 25%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
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
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">
                                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                </span>
                                <span className="text-gray-500">/month</span>
                                {isYearly && (
                                    <p className="text-sm text-green-600 mt-1">
                                        Billed ${plan.yearlyPrice * 12}/year
                                    </p>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                                        <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <a
                                href="/checkout"
                                className={`w-full py-3 rounded-lg font-semibold transition-all mt-auto ${plan.highlighted
                                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                    }`}
                            >
                                {plan.cta}
                            </a>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
}
