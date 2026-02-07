import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
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
                <h1>Contact Us</h1>
                <p className="text-gray-600 mb-8">
                    We&apos;re here to help you grow your content empire.
                    Whether you have questions about the product, need technical
                    assistance, or want to discuss enterprise options, our team
                    is ready to assist.
                </p>

                <section className="mb-12">
                    <h2>Get in Touch</h2>
                    <p>
                        The best way to reach us is via email. We aim to respond
                        to all inquiries within 24 hours.
                    </p>
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-purple-600 font-semibold mb-2">
                            Support & General Inquiries
                        </span>
                        <a
                            href="mailto:support@autopilotreels.com"
                            className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors"
                        >
                            support@autopilotreels.com
                        </a>
                    </div>
                </section>

                <section className="mb-8">
                    <h2>Office Hours</h2>
                    <p>
                        Monday – Friday: 9:00 AM – 6:00 PM EST
                        <br />
                        Saturday – Sunday: Limited support
                    </p>
                </section>

                <section>
                    <h2>Frequently Asked Questions</h2>
                    <p>
                        Check our <Link href="/#faq">FAQ section</Link> for
                        quick answers to common questions about features,
                        pricing, and account management.
                    </p>
                </section>
            </main>
        </div>
    );
}
