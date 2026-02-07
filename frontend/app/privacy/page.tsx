import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
                <h1>Privacy Policy</h1>
                <p className="text-gray-600 mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such
                        as when you create an account, making a payment, or
                        contact customer support. This may include your name,
                        email address, and payment information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to provide, maintain,
                        and improve our Service, to process your transactions,
                        and to communicate with you about your account and our
                        Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>3. Information Sharing</h2>
                    <p>
                        We do not share your personal information with third
                        parties except as described in this policy, such as with
                        vendors who perform services on our behalf (e.g.,
                        payment processing, email delivery).
                    </p>
                </section>

                <section className="mb-8">
                    <h2>4. Data Security</h2>
                    <p>
                        We take reasonable measures to help protect information
                        about you from loss, theft, misuse and unauthorized
                        access, disclosure, alteration and destruction.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>5. Cookies and Tracking</h2>
                    <p>
                        We use cookies and similar technologies to collect
                        information about your use of our Service and to improve
                        your experience.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>6. Your Rights</h2>
                    <p>
                        You may update, correct, or delete information about you
                        at any time by logging into your account or contacting
                        us.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>7. Changes to this Policy</h2>
                    <p>
                        We may change this Privacy Policy from time to time. If
                        we make changes, we will notify you by revising the date
                        at the top of the policy.
                    </p>
                </section>

                <section>
                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy,
                        please contact us at support@autopilotreels.com.
                    </p>
                </section>
            </main>
        </div>
    );
}
