import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

type SupabaseMockOptions = {
    sessionToken?: string;
    userId?: string | null;
    links?: Array<{ id: string }> | null;
    userError?: boolean;
    linksError?: boolean;
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
            from: () => ({
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
            }),
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
        });

        expect(markup).toContain("Dashboard Access Required");
        expect(markup).toContain('href="/checkout"');
        expect(markup).not.toContain("Dashboard Content");
    });
});
