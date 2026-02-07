"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function PasswordUpdateForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassword("");
        setConfirmPassword("");

        if (password !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match" });
            return;
        }

        if (password.length < 6) {
            setStatus({
                type: "error",
                message: "Password must be at least 6 characters",
            });
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: "" });

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setStatus({ type: "error", message: error.message });
        } else {
            setStatus({
                type: "success",
                message: "Password updated successfully",
            });
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700"
                >
                    New Password
                </label>
                <div className="mt-1">
                    <input
                        id="new-password"
                        name="new-password"
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Confirm New Password
                </label>
                <div className="mt-1">
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>
            </div>

            {status.message && (
                <div
                    className={`rounded-md p-4 ${
                        status.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                    }`}
                >
                    <p className="text-sm font-medium">{status.message}</p>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </div>
        </form>
    );
}
