import { getFunnelStats } from "@/lib/analytics/stats";
import { ExportUsersCard } from "./ExportUsersCard";
import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/guards";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { FunnelBreakdown } from "./FunnelBreakdown";

// Dynamic forcing required for admin dashboard to prevent caching of stats
export const dynamic = "force-dynamic";

function StatCard({
    label,
    value,
    icon,
    tooltip,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    tooltip?: { text: string; example: string };
}) {
    return (
        <div className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                        {label}
                        {tooltip && (
                            <span className="relative group/tip inline-flex">
                                <svg
                                    className="w-3.5 h-3.5 text-gray-400 cursor-help"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="absolute left-0 top-full mt-2 hidden group-hover/tip:block z-50 w-56 p-2.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl normal-case tracking-normal">
                                    <span className="font-medium block mb-1">{tooltip.text}</span>
                                    <span className="text-gray-300 italic block">Example: {tooltip.example}</span>
                                    <span className="absolute left-2 -top-1 w-2 h-2 bg-gray-900 rotate-45" />
                                </span>
                            </span>
                        )}
                    </h3>
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {typeof value === "number"
                            ? label.toLowerCase().includes("revenue")
                                ? value.toLocaleString(undefined, {
                                    style: "currency",
                                    currency: "USD",
                                })
                                : label.toLowerCase().includes("rate") ||
                                    label.toLowerCase().includes("conversion")
                                    ? value.toFixed(1) + "%"
                                    : value.toLocaleString()
                            : value}
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
    Revenue: (
        <svg
            className="w-6 h-6 text-green-600"
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
    Users: (
        <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
    ),
    Conversion: (
        <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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
        redirect("/admin/login");
    }

    const supabase = getSupabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
        redirect("/admin/login");
    }

    // RBAC: Check user_roles table
    const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

    if (roleError || roleData?.role !== "admin") {
        // If they are logged in but not an admin, we show a simplified "Access Denied" or redirect
        // For now, redirecting to login with a hint/state would be better, but let's keep it simple
        redirect("/admin/login?error=unauthorized");
    }

    const stats = await getFunnelStats();

    return (
        <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)] p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 group"
                            aria-label="AutopilotReels Home"
                        >
                            <svg
                                className="w-8 h-8 text-purple-600"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
                            </svg>
                            <span className="text-2xl font-semibold text-gray-900">
                                AutopilotReels
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <AdminLogoutButton />
                    </div>
                </header>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Funnel & Revenue
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Revenue"
                            value={stats.totalRevenue / 100}
                            icon={Icons.Revenue}
                            tooltip={{
                                text: "Total money earned from all successful payments.",
                                example: "If you have 10 users who paid $39 each, revenue is $390.",
                            }}
                        />
                        <StatCard
                            label="Paid Users"
                            value={stats.totalUsers}
                            icon={Icons.Users}
                            tooltip={{
                                text: "Number of unique users who have completed payment.",
                                example: "If 50 people signed up and 10 paid, you have 10 paid users.",
                            }}
                        />
                        <StatCard
                            label="Conversion (V to P)"
                            value={
                                stats.visits > 0
                                    ? (stats.payments / stats.visits) * 100
                                    : 0
                            }
                            icon={Icons.Conversion}
                            tooltip={{
                                text: "Visitor to Payment rate: % of visitors who completed payment.",
                                example: "100 visitors and 5 payments = 5% conversion rate.",
                            }}
                        />
                        <StatCard
                            label="Visits"
                            value={stats.visits}
                            icon={Icons.Visits}
                            tooltip={{
                                text: "Total number of landing page views tracked.",
                                example: "Each time someone opens your homepage, it counts as 1 visit.",
                            }}
                        />
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Recent Activity
                        </h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-gray-600">
                                            User
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-gray-600">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-gray-600">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentPayments.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-8 text-center text-gray-400"
                                            >
                                                No recent payments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.recentPayments.map(p => (
                                            <tr
                                                key={p.id}
                                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {p.email}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {(
                                                        p.amount / 100
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            style: "currency",
                                                            currency: "USD",
                                                        },
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(
                                                        p.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Data Management
                        </h2>
                        <ExportUsersCard />

                        <FunnelBreakdown
                            visits={stats.visits}
                            ctaClicks={stats.ctaClicks}
                            checkoutStarts={stats.checkoutStarts}
                            payments={stats.payments}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
