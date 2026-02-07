import { getFunnelStats } from "./stats";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ANALYTICS_EVENT_NAMES } from "./events";
import { describe, expect, it, vi, beforeEach, Mock } from "vitest";

// Mock the dependencies
vi.mock("@/lib/supabase/server", () => ({
    getSupabaseServer: vi.fn(),
}));

describe("getFunnelStats", () => {
    const mockEventsEq = vi.fn();
    const mockRevenueEq = vi.fn();
    const mockRecentLimit = vi.fn();
    const mockUsersSelect = vi.fn();

    const mockSupabase = {
        from: vi.fn((table: string) => {
            if (table === "events") {
                return {
                    select: () => ({
                        eq: mockEventsEq,
                    }),
                };
            }
            if (table === "payments") {
                return {
                    select: (cols: string) => {
                        // Revenue query: .select("amount").eq(...)
                        if (cols === "amount") {
                            return {
                                eq: mockRevenueEq,
                            };
                        }
                        // Recent payments: .select("*").order(...).limit(...)
                        return {
                            order: () => ({
                                limit: mockRecentLimit,
                            }),
                        };
                    },
                };
            }
            if (table === "user_payment_links") {
                // User count: .select("id", { count: "exact", head: true })
                // This is awaited directly
                return {
                    select: mockUsersSelect,
                };
            }
            return {};
        }),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (getSupabaseServer as Mock).mockReturnValue(mockSupabase);
    });

    it("should return correct counts when fetching succeeds", async () => {
        // 1-5. Events (Funnel)
        mockEventsEq
            .mockResolvedValueOnce({ count: 100, error: null }) // landingView
            .mockResolvedValueOnce({ count: 50, error: null }) // ctaClick
            .mockResolvedValueOnce({ count: 20, error: null }) // checkoutStart
            .mockResolvedValueOnce({ count: 10, error: null }) // paymentSuccess
            .mockResolvedValueOnce({ count: 5, error: null }); // signupComplete

        // 6. Revenue
        mockRevenueEq.mockResolvedValue({
            data: [{ amount: 1000 }, { amount: 2000 }],
            error: null,
        });

        // 7. Users
        // Note: select is awaited, so it returns the result
        mockUsersSelect.mockResolvedValue({ count: 42, error: null });

        // 8. Recent Payments
        const recentPaymentsMock = [
            {
                id: "p1",
                email: "test@example.com",
                amount: 1000,
                currency: "usd",
                status: "succeeded",
                created_at: "2023-01-01",
            },
        ];
        mockRecentLimit.mockResolvedValue({
            data: recentPaymentsMock,
            error: null,
        });

        const stats = await getFunnelStats();

        expect(stats).toEqual({
            visits: 100,
            ctaClicks: 50,
            checkoutStarts: 20,
            payments: 10,
            signups: 5,
            totalRevenue: 3000,
            totalUsers: 42,
            recentPayments: recentPaymentsMock,
        });

        expect(mockEventsEq).toHaveBeenCalledTimes(5);
        expect(mockEventsEq).toHaveBeenCalledWith(
            "event_name",
            ANALYTICS_EVENT_NAMES.landingView,
        );
    });

    it("should handle errors gracefully and return 0", async () => {
        // Return error for all calls
        mockEventsEq.mockResolvedValue({
            count: null,
            error: { message: "Error" },
        });
        mockRevenueEq.mockResolvedValue({
            data: null,
            error: { message: "Error" },
        });
        mockUsersSelect.mockResolvedValue({
            count: null,
            error: { message: "Error" },
        });
        mockRecentLimit.mockResolvedValue({
            data: null,
            error: { message: "Error" },
        });

        const stats = await getFunnelStats();

        expect(stats).toEqual({
            visits: 0,
            ctaClicks: 0,
            checkoutStarts: 0,
            payments: 0,
            signups: 0,
            totalRevenue: 0,
            totalUsers: 0,
            recentPayments: [],
        });
    });
});
