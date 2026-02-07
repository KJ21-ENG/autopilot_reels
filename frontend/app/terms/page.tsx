import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
                <h1>Terms of Service</h1>
                <p className="text-gray-600 mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using AutopilotReels (&quot;the
                        Service&quot;), you agree to be bound by these Terms of
                        Service. If you do not agree to these terms, please do
                        not use the Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>2. Description of Service</h2>
                    <p>
                        AutopilotReels provides automated video content
                        generation services. We reserve the right to modify,
                        suspend, or discontinue the Service at any time without
                        notice.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>3. User Accounts</h2>
                    <p>
                        You are responsible for maintaining the security of your
                        account and password. You agree to notify us immediately
                        of any unauthorized access to your account.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>4. Content and Copyright</h2>
                    <p>
                        You retain ownership of the content you generate using
                        our Service. However, by using the Service, you grant us
                        a license to process and store your content as necessary
                        to provide the Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>5. Payment and Refunds</h2>
                    <p>
                        Paid services are billed in advance. Refunds are handled
                        in accordance with our Refund Policy. We reserve the
                        right to change our pricing at any time.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>6. Limitation of Liability</h2>
                    <p>
                        AutopilotReels shall not be liable for any indirect,
                        incidental, special, consequential, or punitive damages
                        resulting from your use of or inability to use the
                        Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2>7. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in
                        accordance with the laws of the jurisdiction in which
                        AutopilotReels operates, without regard to its conflict
                        of law provisions.
                    </p>
                </section>

                <section>
                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please
                        contact us at support@autopilotreels.com.
                    </p>
                </section>
            </main>
        </div>
    );
}
