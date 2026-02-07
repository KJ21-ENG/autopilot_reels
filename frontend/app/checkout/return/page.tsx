"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// import { loadStripe } from "@stripe/stripe-js";
import {} from // EmbeddedCheckoutProvider,
// EmbeddedCheckout,
"@stripe/react-stripe-js";
import Link from "next/link";
import PrimaryLinkButton from "../../../components/PrimaryLinkButton";

// const stripePromise = loadStripe(
//     process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
// );

export default function CheckoutReturnPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<string | null>(null);
    // const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [customerEmail, setCustomerEmail] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailStatus, setEmailStatus] = useState<{
        state: "idle" | "sending" | "sent" | "error";
        message: string;
    }>({ state: "idle", message: "" });
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [closeFailed, setCloseFailed] = useState(false);

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        fetch(`/api/stripe/session?session_id=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                setStatus(data.status);
                // setClientSecret(data.client_secret);
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

    // Listen for storage changes (cross-tab sync)
    useEffect(() => {
        if (!sessionId) return;

        const handleStorageChange = (e: StorageEvent) => {
            // If another tab completes this same session, close this tab
            if (e.key === `stripe_session_completed_${sessionId}`) {
                window.close();
                // If still open, show manual closure hint
                setTimeout(() => setCloseFailed(true), 100);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [sessionId]);

    useEffect(() => {
        if (!isDuplicate || countdown < 0) return;

        if (countdown === 0) {
            const tryClose = () => {
                window.close();
                // If it's still open, the browser blocked it
                setTimeout(() => setCloseFailed(true), 100);
            };
            tryClose();
            return;
        }

        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isDuplicate, countdown]);

    // Handle automated setup email for new users
    useEffect(() => {
        if (status !== "complete" || isLoggedIn || !sessionId || isDuplicate) {
            return;
        }

        // Check if another tab has already claimed this session
        const processedKey = `stripe_session_processed_${sessionId}`;
        if (localStorage.getItem(processedKey)) {
            // Use setTimeout to avoid synchronous setState in effect body warning
            setTimeout(() => {
                setIsDuplicate(true);
            }, 0);
            return;
        }

        // Claim the session
        localStorage.setItem(processedKey, "true");
        // Broadcast completion for this session to other tabs
        localStorage.setItem(`stripe_session_completed_${sessionId}`, "true");

        setTimeout(() => {
            setEmailStatus({ state: "sending", message: "" });
        }, 0);

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
    }, [status, isLoggedIn, sessionId, isDuplicate]);

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
            <main className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-amber-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-2">
                        Payment Incomplete
                    </p>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Almost there!
                    </h1>

                    <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                        It looks like your payment wasn&apos;t finalized. This
                        can happen if the payment window was closed to early or
                        canceled.
                    </p>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10 text-left">
                        <p className="text-amber-900 font-bold text-sm mb-2">
                            What can I do?
                        </p>
                        <p className="text-amber-800 text-sm opacity-90 leading-relaxed">
                            If you still have a payment tab open, you can finish
                            it there. Otherwise, click the button below to
                            return to checkout and try a different method.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                // Notify other checkout tabs to reset
                                localStorage.setItem(
                                    "stripe_checkout_retry_requested",
                                    Date.now().toString(),
                                );
                                // Attempt to close current tab
                                window.close();
                                // Fallback: If close is blocked or same tab, navigate
                                setTimeout(() => {
                                    if (!window.closed) {
                                        window.location.href = "/checkout";
                                    }
                                }, 100);
                            }}
                            className="w-full py-4 text-lg font-bold bg-gray-900 overflow-hidden text-white rounded-xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Return to Checkout & Try Again
                        </button>

                        <p className="text-xs text-gray-400 font-medium">
                            Don&apos;t worry, you haven&apos;t been charged.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (status === "complete") {
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

                    {isDuplicate ? (
                        <div className="space-y-6">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                Already Processing
                            </h1>

                            <p className="text-gray-500 mb-8 text-lg">
                                This payment is already being handled in another
                                tab. You can safely close this one or continue
                                there.
                            </p>

                            <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100 mb-6">
                                <p className="text-purple-600 font-bold text-2xl mb-2">
                                    {countdown > 0 ? `${countdown}s` : "0s"}
                                </p>
                                <p className="text-sm text-purple-500 font-medium">
                                    {closeFailed
                                        ? "Auto-close blocked by browser. Please close this tab manually."
                                        : "This tab will attempt to close automatically."}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    window.close();
                                    setCloseFailed(true);
                                }}
                                className="w-full py-4 text-lg font-bold bg-gray-900 text-white rounded-xl shadow-xl hover:bg-black transition-all active:scale-95"
                            >
                                Close This Tab Now
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                {isNewUser
                                    ? "Let's finish setup."
                                    : "Welcome back!"}
                            </h1>

                            <p className="text-gray-500 mb-8 text-lg">
                                {isNewUser
                                    ? "Your plan is active. Complete your account setup to unlock your dashboard."
                                    : "Your subscription has been successfully upgraded."}
                            </p>

                            <div className="space-y-4">
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
                                        Important: Use the same email you used
                                        at checkout.
                                    </p>
                                )}
                            </div>
                        </>
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
