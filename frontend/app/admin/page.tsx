import { getFunnelStats } from "@/lib/analytics/stats";
import { ExportUsersCard } from "./ExportUsersCard";
import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/guards";

// Dynamic forcing required for admin dashboard to prevent caching of stats
export const dynamic = "force-dynamic";

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="relative overflow-hidden p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                        {label}
                    </h3>
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {value.toLocaleString()}
                    </div>
                </div>
                <div className="text-gray-300 group-hover:text-purple-600/20 transition-colors p-2 bg-gray-50 rounded-lg group-hover:bg-purple-600/5">
                    {icon}
                </div>
            </div>
        </div>
    );
}

// Icons
const Icons = {
    Visits: (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
        </svg>
    ),
    Click: (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
        </svg>
    ),
    Checkout: (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
        </svg>
    ),
    Payment: (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
    Signup: (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
};

export default async function AdminPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
        redirect("/");
    }

    const supabase = getSupabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map(e => e.trim())
        : [];

    if (!user || !user.email || !adminEmails.includes(user.email)) {
        redirect("/");
    }

    const stats = await getFunnelStats();

    return (
        <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)] p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Monitor user acquisition and funnel performance at a
                        glance.
                    </p>
                </header>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Funnel Overview
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        <StatCard
                            label="Visits"
                            value={stats.visits}
                            icon={Icons.Visits}
                        />
                        <StatCard
                            label="CTA Clicks"
                            value={stats.ctaClicks}
                            icon={Icons.Click}
                        />
                        <StatCard
                            label="Checkouts"
                            value={stats.checkoutStarts}
                            icon={Icons.Checkout}
                        />
                        <StatCard
                            label="Payments"
                            value={stats.payments}
                            icon={Icons.Payment}
                        />
                        <StatCard
                            label="Signups"
                            value={stats.signups}
                            icon={Icons.Signup}
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Data Management
                    </h2>
                    <div className="max-w-2xl">
                        <ExportUsersCard />
                    </div>
                </section>
            </div>
        </div>
    );
}
