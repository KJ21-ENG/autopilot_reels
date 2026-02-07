"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function DashboardSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = getSupabaseBrowser();
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        void getUser();
    }, [supabase]);

    const [copied, setCopied] = useState(false);

    const handleContactUs = async () => {
        const email = "support@autopilotreels.com"; // Support email
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSignOut = async () => {
        try {
            // Clear custom cookies server-side
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
            console.warn("Failed to clear custom cookies during logout", e);
        }
        await supabase.auth.signOut();
        router.push("/");
    };

    const navItems = [
        { name: "Series", href: "/dashboard/series", icon: VideoIcon },
        { name: "Videos", href: "/dashboard/videos", icon: FilmIcon },
        { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
    ];

    return (
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white h-full flex-shrink-0">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2"
                    aria-label="AutopilotReels Home"
                >
                    <svg
                        className="w-6 h-6 text-purple-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
                    </svg>
                    <span className="text-lg font-bold text-gray-900">
                        AutopilotReels
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav
                className="flex-1 px-4 space-y-1"
                aria-label="Sidebar Navigation"
            >
                {navItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                isActive
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <item.icon
                                className={`w-5 h-5 ${isActive ? "text-gray-900" : "text-gray-400"}`}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-gray-200 relative">
                {/* Menu Popover */}
                {isMenuOpen && user && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-100 p-2 transform transition-all duration-200 ease-out origin-bottom-left">
                        <div className="p-3 border-b border-gray-100 mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-medium">
                                    {user.user_metadata?.full_name?.[0]?.toUpperCase() ??
                                        user.email?.[0]?.toUpperCase() ??
                                        "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.user_metadata?.full_name ??
                                            user.email}
                                    </p>
                                    {user.user_metadata?.full_name && (
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleContactUs}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 group"
                        >
                            <div className="flex items-center gap-3">
                                <ChatIcon className="w-4 h-4 text-gray-400" />
                                <span>Contact us</span>
                            </div>
                            {copied && (
                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded animate-in fade-in zoom-in duration-200">
                                    Copied!
                                </span>
                            )}
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            <LogoutIcon className="w-4 h-4 text-gray-400" />
                            Log out
                        </button>
                    </div>
                )}

                {/* Trigger Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                    <div
                        className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-medium shrink-0"
                        aria-hidden="true"
                    >
                        {user?.user_metadata?.full_name?.[0]?.toUpperCase() ??
                            user?.email?.[0]?.toUpperCase() ??
                            "U"}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.user_metadata?.full_name ??
                                user?.email ??
                                "Loading..."}
                        </p>
                        {user?.user_metadata?.full_name && (
                            <p className="text-xs text-gray-500 truncate font-normal">
                                {user.email}
                            </p>
                        )}
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

// Icons (Simple SVG components for this file)
function VideoIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    );
}
function FilmIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
        </svg>
    );
}

function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    );
}

function LogoutIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
        </svg>
    );
}

function ChatIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
        </svg>
    );
}
