import { getFunnelStats } from "./stats";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ANALYTICS_EVENT_NAMES } from "./events";
import { describe, expect, it, vi, beforeEach, Mock } from "vitest";

// Mock the dependencies
vi.mock("@/lib/supabase/server", () => ({
    getSupabaseServer: vi.fn(),
}));

describe("getFunnelStats", () => {
    const mockFrom = vi.fn();
    const mockSelect = vi.fn();
    const mockEq = vi.fn();
    const mockSupabase = {
        from: mockFrom,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (getSupabaseServer as Mock).mockReturnValue(mockSupabase);

        // Setup chain mocks return values
        mockFrom.mockReturnValue({ select: mockSelect });
        mockSelect.mockReturnValue({ eq: mockEq });
    });

    it("should return correct counts when fetching succeeds", async () => {
        // Setup mock responses for each call order matching the Promise.all in implementation
        // order: landingView, ctaClick, checkoutStart, paymentSuccess, signupComplete
        mockEq
            .mockResolvedValueOnce({ count: 100, error: null }) // landingView
            .mockResolvedValueOnce({ count: 50, error: null }) // ctaClick
            .mockResolvedValueOnce({ count: 20, error: null }) // checkoutStart
            .mockResolvedValueOnce({ count: 10, error: null }) // paymentSuccess
            .mockResolvedValueOnce({ count: 5, error: null }); // signupComplete

        const stats = await getFunnelStats();

        expect(stats).toEqual({
            visits: 100,
            ctaClicks: 50,
            checkoutStarts: 20,
            payments: 10,
            signups: 5,
        });

        expect(mockFrom).toHaveBeenCalledTimes(5);
        expect(mockEq).toHaveBeenCalledWith(
            "event_name",
            ANALYTICS_EVENT_NAMES.landingView,
        );
    });

    it("should handle errors gracefully and return 0", async () => {
        // Return error for all calls
        mockEq.mockResolvedValue({ count: null, error: { message: "Error" } });

        const stats = await getFunnelStats();

        expect(stats).toEqual({
            visits: 0,
            ctaClicks: 0,
            checkoutStarts: 0,
            payments: 0,
            signups: 0,
        });
    });
});
