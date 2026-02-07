"use client";

import { useState } from "react";

export default function DeleteAccountModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
        "idle",
    );

    const handleDelete = async () => {
        setStatus("sending");
        try {
            const res = await fetch("/api/account/request-deletion", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Failed to send request");
            setStatus("sent");
            setIsDeleted(true);
        } catch (e) {
            setStatus("error");
            console.error(e);
            setStatus("idle");
            // Optional: show toast/alert
            alert(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
                Delete account
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        {!isDeleted ? (
                            <>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>

                                <div className="flex items-center gap-3 mb-4 text-red-600">
                                    <svg
                                        className="w-6 h-6"
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
                                    <h3 className="text-lg font-bold">
                                        Delete account
                                    </h3>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">
                                    This action is permanent and cannot be
                                    undone.
                                </p>

                                <div className="bg-red-50 border border-red-100 rounded-md p-4 mb-6">
                                    <p className="text-sm font-medium text-red-800 mb-2">
                                        The following will be permanently
                                        deleted:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                        <li>
                                            All your video series and settings
                                        </li>
                                        <li>
                                            All generated videos and content
                                        </li>
                                        <li>
                                            All connected social media accounts
                                        </li>
                                        <li>
                                            Your account and all personal data
                                        </li>
                                    </ul>
                                    <p className="mt-4 text-sm font-bold text-red-800">
                                        There is no way to recover your data
                                        after deletion.
                                    </p>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={status === "sending"}
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-4 w-4 text-white"
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
                                                Sending...
                                            </>
                                        ) : (
                                            "Delete my account"
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <svg
                                        className="h-6 w-6 text-green-600"
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
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Check your email
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    We&apos;ve sent a confirmation link to your
                                    email address. Please click the link to
                                    permanently delete your account.
                                </p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
