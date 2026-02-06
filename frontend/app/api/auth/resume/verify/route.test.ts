import { afterEach, describe, expect, it, vi } from "vitest";

import { createResumeToken } from "../../../../../lib/auth/resume-token";
import { POST } from "./route";

const from = vi.fn();
const paymentsQuery = {
  select: vi.fn(),
  eq: vi.fn(),
  limit: vi.fn(),
};
const linksQuery = {
  select: vi.fn(),
  eq: vi.fn(),
  limit: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    from,
  }),
}));

describe("POST /api/auth/resume/verify", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    from.mockReset();
    paymentsQuery.select.mockReset();
    paymentsQuery.eq.mockReset();
    paymentsQuery.limit.mockReset();
    linksQuery.select.mockReset();
    linksQuery.eq.mockReset();
    linksQuery.limit.mockReset();
  });

  it("returns verified email and session id for valid token", async () => {
    process.env.AUTH_RESUME_SECRET = "test-secret";

    const token = createResumeToken(
      {
        email: "buyer@example.com",
        stripe_session_id: "cs_test_123",
      },
      { secret: "test-secret", ttlSeconds: 60 }
    );

    paymentsQuery.select.mockReturnValue(paymentsQuery);
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.limit.mockResolvedValue({
      data: [{ id: "pay-1", email: "buyer@example.com", stripe_session_id: "cs_test_123" }],
      error: null,
    });
    linksQuery.select.mockReturnValue(linksQuery);
    linksQuery.eq.mockReturnValue(linksQuery);
    linksQuery.limit.mockResolvedValue({ data: [], error: null });

    from.mockImplementation((table: string) => {
      if (table === "payments") {
        return { select: paymentsQuery.select };
      }
      if (table === "user_payment_links") {
        return { select: linksQuery.select };
      }
      return { select: vi.fn() };
    });

    const response = await POST(
      new Request("http://localhost/api/auth/resume/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      })
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: { email: "buyer@example.com", stripe_session_id: "cs_test_123" },
      error: null,
    });
  });

  it("returns invalid_token for invalid token", async () => {
    process.env.AUTH_RESUME_SECRET = "test-secret";
    const response = await POST(
      new Request("http://localhost/api/auth/resume/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: "bad-token" }),
      })
    );
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error.code).toBe("invalid_token");
  });
});
