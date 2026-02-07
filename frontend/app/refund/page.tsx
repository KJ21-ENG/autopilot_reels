import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <svg
                            className="w-7 h-7 text-purple-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
                        </svg>
                        <span className="text-xl font-bold text-gray-900">
                            AutopilotReels
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12 prose prose-purple bg-white my-8 rounded-xl shadow-sm border border-gray-100">
                <h1>Refund Policy</h1>
                <p className="text-gray-600 mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2>1. 7-Day Money-Back Guarantee</h2>
                    <p>
                        We believe in the value of AutopilotReels, but we
                        understand it might not be the perfect fit for everyone.
                        If you&apos;re not satisfied with the service within
                        your first 7 days, you are eligible for a full refund.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>2. Refund Eligibility</h2>
                    <p>To be eligible for a refund, you must:</p>
                    <ul>
                        <li>
                            Submit your request within 7 days of your initial
                            purchase.
                        </li>
                        <li>
                            Have used less than 10% of your plan&apos;s monthly
                            video generation quota.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2>3. How to Request a Refund</h2>
                    <p>
                        Please email us at{" "}
                        <a href="mailto:support@autopilotreels.com">
                            support@autopilotreels.com
                        </a>{" "}
                        with the subject line &quot;Refund Request&quot;.
                        Include your account email and the reason for the
                        request.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>4. Processing Time</h2>
                    <p>
                        Once approved, refunds are processed within 5-10
                        business days and will be credited back to your original
                        payment method.
                    </p>
                </section>

                <section>
                    <h2>5. Subscription Cancellations</h2>
                    <p>
                        You can cancel your subscription at any time via your
                        account dashboard. After cancellation, you will retain
                        access to your plan until the end of your current
                        billing period.
                    </p>
                </section>
            </main>
        </div>
    );
}
