"use client";

import { useState, useEffect } from "react";

type FunnelMetric = {
    label: string;
    percentage: number;
    actualCount: number;
    tooltip: string;
    example: string;
};

function InfoTooltip({
    tooltip,
    example,
}: {
    tooltip: string;
    example: string;
}) {
    return (
        <div className="relative group inline-flex items-center ml-1">
            <svg
                className="w-4 h-4 text-purple-400 cursor-help"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <div className="absolute left-6 bottom-0 mb-0 hidden group-hover:block z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                <p className="font-medium mb-2">{tooltip}</p>
                <p className="text-gray-300 italic">Example: {example}</p>
                <div className="absolute left-0 top-3 -ml-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
        </div>
    );
}

function AnimatedMetricValue({
    percentage,
    actualCount,
}: {
    percentage: number;
    actualCount: number;
}) {
    const [showPercentage, setShowPercentage] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            // Wait for exit animation, then switch
            setTimeout(() => {
                setShowPercentage(prev => !prev);
                setIsAnimating(false);
            }, 200);
        }, 3000); // Switch every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <span className="font-bold min-w-[90px] text-right inline-flex justify-end overflow-hidden h-5 relative">
            <span
                className={`inline-block transition-all duration-200 ease-in-out ${isAnimating
                        ? "-translate-y-full opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
            >
                {showPercentage ? (
                    <>{percentage.toFixed(1)}%</>
                ) : (
                    <>
                        {actualCount} user{actualCount !== 1 ? "s" : ""}
                    </>
                )}
            </span>
        </span>
    );
}

export function FunnelBreakdown({
    visits,
    ctaClicks,
    checkoutStarts,
    payments,
}: {
    visits: number;
    ctaClicks: number;
    checkoutStarts: number;
    payments: number;
}) {
    const metrics: FunnelMetric[] = [
        {
            label: "CTA Click Rate",
            percentage: visits > 0 ? (ctaClicks / visits) * 100 : 0,
            actualCount: ctaClicks,
            tooltip:
                "Percentage of visitors who clicked a 'Get Started' or pricing button.",
            example:
                "If 100 people visit your site and 70 click the CTA, the rate is 70%.",
        },
        {
            label: "Checkout Start Rate",
            percentage: ctaClicks > 0 ? (checkoutStarts / ctaClicks) * 100 : 0,
            actualCount: checkoutStarts,
            tooltip:
                "Percentage of CTA clickers who started the Stripe checkout process.",
            example:
                "If 70 clicked CTA and 20 started checkout, the rate is 28.6%.",
        },
        {
            label: "Payment Completion",
            percentage:
                checkoutStarts > 0 ? (payments / checkoutStarts) * 100 : 0,
            actualCount: payments,
            tooltip:
                "Percentage of users who completed payment after starting checkout.",
            example:
                "If 20 started checkout and 5 paid, the completion rate is 25%.",
        },
    ];

    return (
        <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h3 className="text-purple-900 font-semibold mb-2">
                Funnel Breakdown
            </h3>
            <ul className="space-y-3 text-sm">
                {metrics.map(metric => (
                    <li
                        key={metric.label}
                        className="flex justify-between items-center text-purple-700"
                    >
                        <span className="flex items-center">
                            {metric.label}
                            <InfoTooltip
                                tooltip={metric.tooltip}
                                example={metric.example}
                            />
                        </span>
                        <AnimatedMetricValue
                            percentage={metric.percentage}
                            actualCount={metric.actualCount}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
