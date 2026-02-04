import Link from "next/link";
import { cookies } from "next/headers";

import { getAuthStateFromCookies, getProtectedRouteDecision } from "@/lib/auth/guards";

export default function DashboardPage() {
  const authState = getAuthStateFromCookies(cookies());
  const decision = getProtectedRouteDecision({ route: "/dashboard", auth: authState });

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
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Dashboard</h1>
        <p className="text-gray-500 mb-2">
          High demand — limited availability.
        </p>
        <p className="text-gray-400">
          Your access is confirmed. We will notify you when the full experience is ready.
        </p>
      </div>
    </main>
  );
}
