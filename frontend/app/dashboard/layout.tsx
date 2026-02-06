import Link from "next/link";
import { cookies } from "next/headers";
import { ReactNode } from "react";

import {
    getProtectedRouteDecision,
    resolveVerifiedAuthState,
} from "@/lib/auth/guards";
import { getSupabaseServer } from "@/lib/supabase/server";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const authState = await resolveVerifiedAuthState(await cookies(), {
        getSupabaseServer,
    });
    const decision = getProtectedRouteDecision({
        route: "/dashboard",
        auth: authState,
    });

    if (!decision.allowed) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="max-w-lg w-full text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Dashboard Access Required
                    </h1>
                    <p className="text-gray-500 mb-6">{decision.message}</p>
                    <Link
                        href={decision.redirectTo ?? "/auth"}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
                    >
                        Continue
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
            <DashboardSidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 flex-shrink-0">
                    <DashboardBreadcrumb />
                </header>
                <div className="flex-1 overflow-y-auto p-8 border-l border-gray-100 flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
