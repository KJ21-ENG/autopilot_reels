"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type CheckoutResponse =
    | { data: { checkout_url: string }; error: null }
    | { data: null; error: { code: string; message: string } };

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const [hasError, setHasError] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);

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

    useEffect(() => {
        let cancelled = false;

        const startCheckout = async () => {
            try {
                const alreadyInitiated =
                    sessionStorage.getItem("checkout_initiated") === "1";
                if (alreadyInitiated) {
                    if (!cancelled) {
                        setIsWaiting(true);
                    }
                    return;
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

                const response = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const body = (await response.json()) as CheckoutResponse;

                if (!response.ok || body.error) {
                    throw new Error(body.error?.message ?? "Checkout failed.");
                }

                const checkoutUrl = body.data.checkout_url;
                if (checkoutUrl) {
                    if (!cancelled) {
                        setIsLaunching(true);
                    }
                    await new Promise(resolve => setTimeout(resolve, 600));
                    if (!cancelled) {
                        window.location.assign(checkoutUrl);
                    }
                    return;
                }

                throw new Error("Missing Stripe checkout URL.");
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
            }
        };

        void startCheckout();

        return () => {
            cancelled = true;
        };
    }, [payload]);

    const handleRetry = () => {
        sessionStorage.removeItem("checkout_initiated");
        try {
            localStorage.removeItem("checkout_started_at");
        } catch (error) {
            console.warn("Unable to clear checkout start timestamp.", error);
        }
        window.location.reload();
    };

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
                        <Link
                            href="/#pricing"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg"
                        >
                            Back to Pricing
                        </Link>
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
                        <Link
                            href="/#pricing"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg"
                        >
                            Back to Pricing
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
