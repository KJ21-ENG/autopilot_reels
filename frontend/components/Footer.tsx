"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <svg className="w-7 h-7 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
                            </svg>
                            <span className="text-xl font-semibold">AutopilotReels</span>
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Build your content empire while you sleep.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    How it works
                                </Link>
                            </li>
                            <li>
                                <Link href="#faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <p className="text-gray-400 text-sm text-center">
                        © {new Date().getFullYear()} AutopilotReels. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
