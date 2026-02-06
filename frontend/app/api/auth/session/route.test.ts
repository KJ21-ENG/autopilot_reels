import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const cookieStore = {
  set: vi.fn(),
  delete: vi.fn(),
};

const authGetUser = vi.fn();
const adminDeleteUser = vi.fn();
const from = vi.fn();

const paymentsQuery = {
  select: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  limit: vi.fn(),
};

const linksQuery = {
  select: vi.fn(),
  eq: vi.fn(),
  limit: vi.fn(),
};

const linksInsert = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    auth: { getUser: authGetUser, admin: { deleteUser: adminDeleteUser } },
    from,
  }),
}));

describe("POST /api/auth/session", () => {
  beforeEach(() => {
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.order.mockReturnValue(paymentsQuery);
    paymentsQuery.select.mockReturnValue(paymentsQuery);

    linksQuery.eq.mockReturnValue(linksQuery);
    linksQuery.select.mockReturnValue(linksQuery);

    from.mockImplementation((table: string) => {
      if (table === "payments") {
        return { select: paymentsQuery.select };
      }

      if (table === "user_payment_links") {
        return { select: linksQuery.select, insert: linksInsert };
      }

      return { select: vi.fn(), insert: vi.fn() };
    });
  });

  afterEach(() => {
    authGetUser.mockReset();
    adminDeleteUser.mockReset();
    from.mockReset();
    cookieStore.set.mockReset();
    cookieStore.delete.mockReset();

    paymentsQuery.select.mockReset();
    paymentsQuery.eq.mockReset();
    paymentsQuery.order.mockReset();
    paymentsQuery.limit.mockReset();

    linksQuery.select.mockReset();
    linksQuery.eq.mockReset();
    linksQuery.limit.mockReset();
    linksInsert.mockReset();
  });

  it("returns 400 when token is missing", async () => {
    const request = new Request("http://localhost/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      data: null,
      error: { code: "missing_token", message: "Missing authentication token." },
    });
  });

  it("returns 401 when token is invalid", async () => {
    authGetUser.mockResolvedValue({ data: { user: null }, error: { message: "invalid" } });

    const request = new Request("http://localhost/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ access_token: "bad-token" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      data: null,
      error: { code: "invalid_token", message: "We could not confirm your session." },
    });
  });

  it("links a paid payment to the authenticated user using stripe_session_id", async () => {
    authGetUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "buyer@example.com" } },
      error: null,
    });

    paymentsQuery.limit.mockResolvedValue({
      data: [{ id: "pay-1", email: "buyer@example.com", status: "paid" }],
      error: null,
    });
    linksQuery.limit.mockResolvedValue({ data: [], error: null });
    linksInsert.mockResolvedValue({ error: null });

    const request = new Request("http://localhost/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ access_token: "good-token", stripe_session_id: "cs_test_123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { session: true, paid: true }, error: null });
    expect(paymentsQuery.eq).toHaveBeenCalledWith("stripe_session_id", "cs_test_123");
    expect(linksInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        payment_id: "pay-1",
        linked_at: expect.any(String),
      })
    );
    expect(cookieStore.set).toHaveBeenCalledWith("autopilotreels_session", "good-token", expect.any(Object));
    expect(cookieStore.set).toHaveBeenCalledWith("autopilotreels_paid", "1", expect.any(Object));
  });

  it("is idempotent for repeated callbacks when linkage already exists", async () => {
    authGetUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "buyer@example.com" } },
      error: null,
    });

    paymentsQuery.limit.mockResolvedValue({
      data: [{ id: "pay-1", email: "buyer@example.com", status: "paid" }],
      error: null,
    });
    linksQuery.limit.mockResolvedValue({ data: [{ id: "upl-1" }], error: null });

    const request = new Request("http://localhost/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ access_token: "good-token", stripe_session_id: "cs_test_123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { session: true, paid: true }, error: null });
    expect(linksInsert).not.toHaveBeenCalled();
    expect(cookieStore.set).toHaveBeenCalledWith("autopilotreels_session", "good-token", expect.any(Object));
    expect(cookieStore.set).toHaveBeenCalledWith("autopilotreels_paid", "1", expect.any(Object));
  });

  it("returns a successful session with paid false when no matching payment exists", async () => {
    authGetUser.mockResolvedValue({
      data: { user: { id: "user-2", email: "buyer@example.com" } },
      error: null,
    });

    paymentsQuery.limit.mockResolvedValue({ data: [], error: null });

    const request = new Request("http://localhost/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ access_token: "good-token" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { session: true, paid: false }, error: null });
    expect(cookieStore.set).toHaveBeenCalledWith("autopilotreels_session", "good-token", expect.any(Object));
    expect(cookieStore.set).not.toHaveBeenCalledWith("autopilotreels_paid", "1", expect.any(Object));
    expect(cookieStore.delete).toHaveBeenCalledWith("autopilotreels_paid");
    expect(linksInsert).not.toHaveBeenCalled();
  });

  it("removes unpaid user when post-payment flow has no paid record", async () => {
    authGetUser.mockResolvedValue({
      data: { user: { id: "user-4", email: "buyer@example.com" } },
      error: null,
    });

    paymentsQuery.limit
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({ data: [], error: null });

    const request = new Request("http://localhost/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        access_token: "good-token",
        stripe_session_id: "cs_test_999",
        enforce_paid: true,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { session: false, paid: false }, error: null });
    expect(adminDeleteUser).toHaveBeenCalledWith("user-4");
    expect(cookieStore.set).not.toHaveBeenCalledWith("autopilotreels_session", expect.anything(), expect.anything());
    expect(cookieStore.delete).toHaveBeenCalledWith("autopilotreels_session");
    expect(cookieStore.delete).toHaveBeenCalledWith("autopilotreels_paid");
  });

  it("rejects linking when checkout email does not match authenticated email", async () => {
    authGetUser.mockResolvedValue({
      data: { user: { id: "user-3", email: "other@example.com" } },
      error: null,
    });

    paymentsQuery.limit
      .mockResolvedValueOnce({
        data: [{ id: "pay-1", email: "buyer@example.com", status: "paid" }],
        error: null,
      })
      .mockResolvedValueOnce({
        data: [{ id: "pay-1", email: "buyer@example.com", status: "paid" }],
        error: null,
      });

    const request = new Request("http://localhost/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ access_token: "good-token", stripe_session_id: "cs_test_123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({
      data: null,
      error: {
        code: "payment_email_mismatch",
        message:
          "Please sign in with the same email used during checkout, or continue with Google for that account.",
      },
    });
    expect(linksInsert).not.toHaveBeenCalled();
    expect(cookieStore.delete).toHaveBeenCalledWith("autopilotreels_paid");
  });
});
