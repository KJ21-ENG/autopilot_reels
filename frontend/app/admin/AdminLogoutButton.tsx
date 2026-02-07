"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useState } from "react";

export function AdminLogoutButton() {
    const router = useRouter();
    const supabase = getSupabaseBrowser();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            // 1. Clear server-side custom cookies
            await fetch("/api/auth/logout", { method: "POST" });

            // 2. Sign out from Supabase Auth
            await supabase.auth.signOut();

            // 3. Redirect to admin login
            router.push("/admin/login");
            router.refresh(); // Ensure server-side guards re-evaluate
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-purple-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
        >
            <svg
                className={`w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                {isLoading ? (
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                ) : (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                )}
            </svg>
            <span>{isLoading ? "Logging out..." : "Log out"}</span>
        </button>
    );
}
