import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

type SupabaseMockOptions = {
    sessionToken?: string;
    userId?: string | null;
    links?: Array<{ id: string }> | null;
    userError?: boolean;
    linksError?: boolean;
    userRole?: { id: string; user_id: string; role: string } | null;
};

const renderDashboardLayout = async (options: SupabaseMockOptions = {}) => {
    vi.resetModules();
    const cookieStore = {
        get: (name: string) =>
            name === "autopilotreels_session" && options.sessionToken
                ? { value: options.sessionToken }
                : undefined,
    };

    vi.doMock("next/headers", () => ({
        cookies: () => cookieStore,
    }));

    vi.doMock("@/lib/supabase/server", () => ({
        getSupabaseServer: () => ({
            auth: {
                getUser: async () => ({
                    data: {
                        user: options.userId ? { id: options.userId } : null,
                    },
                    error: options.userError ? { message: "error" } : null,
                }),
            },
            from: (table: string) => {
                if (table === "user_roles") {
                    let roleFilter: string | null = null;
                    const chain = {
                        eq: (col: string, val: string) => {
                            if (col === "role") roleFilter = val;
                            return chain;
                        },
                        single: async () => {
                            // If filtering for admin, and the option provided is NOT admin, return null.
                            // The test passes { role: "unpaid" }.
                            // Code queries .eq("role", "admin").
                            // So if roleFilter is "admin" and options.userRole.role is not "admin", should return null.
                            if (
                                roleFilter === "admin" &&
                                options.userRole?.role !== "admin"
                            ) {
                                return {
                                    data: null,
                                    error: {
                                        message: "No rows found",
                                        code: "PGRST116",
                                    },
                                };
                            }
                            return {
                                data: options.userRole ?? null,
                                error: null,
                            };
                        },
                    };
                    return { select: () => chain };
                }
                return {
                    select: () => ({
                        eq: () => ({
                            limit: async () => ({
                                data: options.links ?? [],
                                error: options.linksError
                                    ? { message: "error" }
                                    : null,
                            }),
                        }),
                    }),
                };
            },
        }),
    }));

    vi.doMock("../../components/dashboard/DashboardSidebar", () => ({
        default: () => <div data-testid="dashboard-sidebar">Sidebar</div>,
    }));

    const { default: DashboardLayout } = await import("./layout");
    const markup = renderToStaticMarkup(
        await DashboardLayout({ children: <div>Dashboard Content</div> }),
    );
    return markup;
};

describe("dashboard layout access control", () => {
    it("renders the dashboard shell and content for authenticated paid users", async () => {
        const markup = await renderDashboardLayout({
            sessionToken: "token-1",
            userId: "user-1",
            links: [{ id: "upl-1" }],
        });

        expect(markup).toContain("Dashboard Content");
        expect(markup).toContain('data-testid="dashboard-sidebar"');
        expect(markup).not.toContain("Dashboard Access Required");
    });

    it("shows a checkout path for authenticated unpaid users", async () => {
        const markup = await renderDashboardLayout({
            sessionToken: "token-2",
            userId: "user-2",
            links: [],
            userRole: { id: "ur-2", user_id: "user-2", role: "unpaid" },
        });

        expect(markup).toContain("Dashboard Access Required");
        expect(markup).toContain('href="/checkout"');
        expect(markup).not.toContain("Dashboard Content");
    });
});
