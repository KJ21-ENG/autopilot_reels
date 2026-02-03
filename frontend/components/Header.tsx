"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-7 h-7 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
            </svg>
            <span className="text-xl font-semibold text-gray-900">AutopilotReels</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/checkout"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
