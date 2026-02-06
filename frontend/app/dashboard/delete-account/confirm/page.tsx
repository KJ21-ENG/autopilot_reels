"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function ConfirmDeletionPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const [status, setStatus] = useState<
        "idle" | "deleting" | "success" | "error"
    >("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const supabase = getSupabaseBrowser();

    const handleConfirm = async () => {
        if (!token) return;

        setStatus("deleting");

        try {
            const res = await fetch("/api/account/confirm-deletion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete account");
            }

            // Sign out from client side to clear session
            await supabase.auth.signOut();
            setStatus("success");

            // Optional: Auto redirect after few seconds
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message);
        }
    };

    if (!token) {
        return (
            <div className="flex-1 w-full bg-gray-50 flex items-start justify-center p-4 pt-20">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                        Invalid Link
                    </h1>
                    <p className="text-gray-500 mb-4">
                        This confirmation link is invalid or missing a token.
                    </p>
                    <Link
                        href="/dashboard"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="flex-1 w-full bg-gray-50 flex items-start justify-center p-4 pt-20">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <svg
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Account Deleted
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Your account has been permanently deleted. We're sorry
                        to see you go.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full bg-gray-50 flex items-start justify-center p-4 pt-20">
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 max-w-md w-full text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                    <svg
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirm Deletion
                </h1>
                <p className="text-gray-500 mb-6">
                    Are you sure you want to permanently delete your account?
                    This action cannot be undone.
                </p>

                {status === "error" && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-sm">
                        Error: {errorMsg}
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={handleConfirm}
                        disabled={status === "deleting"}
                        className="w-full px-4 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {status === "deleting" ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            "Yes, permanently delete"
                        )}
                    </button>
                    <Link
                        href="/dashboard"
                        className="block w-full px-4 py-3 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}
