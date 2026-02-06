"use client";

import { usePathname } from "next/navigation";

export default function DashboardBreadcrumb() {
    const pathname = usePathname();

    const getPageName = () => {
        if (pathname === "/dashboard") return "Settings"; // Based on current sidebar mapping
        if (pathname === "/dashboard/videos") return "Videos";
        if (pathname === "/dashboard/series") return "Series";
        if (pathname === "/dashboard/guides") return "Guides";

        // Fallback for other paths
        const segments = pathname.split("/").filter(Boolean);
        const last = segments[segments.length - 1];
        return last ? last.charAt(0).toUpperCase() + last.slice(1) : "Overview";
    };

    return (
        <div className="flex items-center text-sm font-medium text-gray-500">
            <span>Dashboard</span>
            <svg
                className="w-5 h-5 mx-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
            </svg>
            <span className="text-gray-900">{getPageName()}</span>
        </div>
    );
}
