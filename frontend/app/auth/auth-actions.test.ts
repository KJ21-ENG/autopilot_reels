import { describe, expect, it, vi } from "vitest";
import { performEmailAuth, performGoogleAuth } from "./auth-actions";
import type { SupabaseClient } from "@supabase/supabase-js";

type SupabaseAuthMock = {
    signInWithPassword: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    signInWithOAuth: ReturnType<typeof vi.fn>;
};

type SupabaseMock = {
    auth: SupabaseAuthMock;
};

const buildSupabaseMock = (
    overrides?: Partial<SupabaseAuthMock>,
): SupabaseMock => {
    const auth: SupabaseAuthMock = {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signInWithOAuth: vi.fn(),
        ...overrides,
    };

    return { auth };
};

describe("auth actions", () => {
    it("redirects after successful email sign-in", async () => {
        const signInWithPassword = vi.fn().mockResolvedValue({
            data: { session: { access_token: "token" } },
            error: null,
        });
        const supabase = buildSupabaseMock({
            signInWithPassword,
        });

        const fetchFn = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ data: { session: true }, error: null }),
        });

        const result = await performEmailAuth({
            supabase: supabase as unknown as SupabaseClient,
            email: "  User@Example.com  ",
            password: "password",
            mode: "sign-in",
            redirectTo: "/dashboard",
            stripeSessionId: "cs_test_123",
            fetchFn: fetchFn as unknown as typeof fetch,
        });

        expect(signInWithPassword).toHaveBeenCalledWith({
            email: "user@example.com",
            password: "password",
        });
        expect(fetchFn).toHaveBeenCalledWith(
            "/api/auth/session",
            expect.any(Object),
        );
        expect(fetchFn).toHaveBeenCalledWith(
            "/api/auth/session",
            expect.objectContaining({
                body: JSON.stringify({
                    access_token: "token",
                    stripe_session_id: "cs_test_123",
                    enforce_paid: true,
                }),
            }),
        );
        expect(result.redirectTo).toBe("/dashboard");
    });

    it("returns a clear error for non-email input", async () => {
        const supabase = buildSupabaseMock();

        const result = await performEmailAuth({
            supabase: supabase as unknown as SupabaseClient,
            email: "myusername",
            password: "password",
            mode: "sign-in",
            redirectTo: "/dashboard",
        });

        expect(result.error).toBe("Enter a valid email address to continue.");
        expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it("returns a friendly error when credentials are invalid", async () => {
        const supabase = buildSupabaseMock({
            signInWithPassword: vi.fn().mockResolvedValue({
                data: { session: null },
                error: { message: "Invalid login credentials" },
            }),
        });

        const result = await performEmailAuth({
            supabase: supabase as unknown as SupabaseClient,
            email: "user@example.com",
            password: "password",
            mode: "sign-in",
            redirectTo: "/dashboard",
        });

        expect(result.error).toBe("Incorrect email or password.");
    });

    it("returns a notice when sign-up requires email confirmation", async () => {
        const supabase = buildSupabaseMock({
            signUp: vi.fn().mockResolvedValue({
                data: { session: null },
                error: null,
            }),
        });

        const result = await performEmailAuth({
            supabase: supabase as unknown as SupabaseClient,
            email: "user@example.com",
            password: "password",
            mode: "sign-up",
            redirectTo: "/dashboard",
        });

        expect(result.notice).toContain("Check your email");
    });

    it("blocks sign-up when signup is not allowed for this auth entry point", async () => {
        const signUp = vi.fn();
        const supabase = buildSupabaseMock({ signUp });

        const result = await performEmailAuth({
            supabase: supabase as unknown as SupabaseClient,
            email: "user@example.com",
            password: "password",
            mode: "sign-up",
            redirectTo: "/dashboard",
            allowSignup: false,
        });

        expect(result.error).toContain("only available after checkout");
        expect(signUp).not.toHaveBeenCalled();
    });

    it("blocks post-payment sign-up when entered email does not match checkout email", async () => {
        const signUp = vi.fn().mockResolvedValue({
            data: { session: null },
            error: null,
        });
        const supabase = buildSupabaseMock({ signUp });

        const fetchFn = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: { payment_found: true, match: false },
                error: null,
            }),
        });

        const result = await performEmailAuth({
            supabase: supabase as unknown as SupabaseClient,
            email: "other@example.com",
            password: "password",
            mode: "sign-up",
            redirectTo: "/dashboard",
            stripeSessionId: "cs_test_123",
            enforceCheckoutEmailMatch: true,
            fetchFn: fetchFn as unknown as typeof fetch,
        });

        expect(result.error).toBe(
            "Use the same email you used during checkout to create your account.",
        );
        expect(signUp).not.toHaveBeenCalled();
    });

    it("shows Google login guidance only when existing account has Google provider", async () => {
        const supabase = buildSupabaseMock({
            signUp: vi.fn().mockResolvedValue({
                data: { session: null },
                error: { message: "User already registered" },
            }),
        });

        const fetchFn = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: { has_google_provider: true },
                error: null,
            }),
        });

        const result = await performEmailAuth({
            supabase: supabase as unknown as SupabaseClient,
            email: "user@example.com",
            password: "password",
            mode: "sign-up",
            redirectTo: "/dashboard",
            stripeSessionId: "cs_test_123",
            fetchFn: fetchFn as unknown as typeof fetch,
        });

        expect(result.error).toBe(
            "That email already has an account. Please use Continue with Google to log in.",
        );
        expect(fetchFn).toHaveBeenCalledWith(
            "/api/auth/account-provider",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    email: "user@example.com",
                    stripe_session_id: "cs_test_123",
                }),
            }),
        );
    });

    it("keeps generic sign-in guidance when existing account is not Google-linked", async () => {
        const supabase = buildSupabaseMock({
            signUp: vi.fn().mockResolvedValue({
                data: { session: null },
                error: { message: "User already registered" },
            }),
        });

        const fetchFn = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: { has_google_provider: false },
                error: null,
            }),
        });

        const result = await performEmailAuth({
            supabase: supabase as unknown as SupabaseClient,
            email: "user@example.com",
            password: "password",
            mode: "sign-up",
            redirectTo: "/dashboard",
            stripeSessionId: "cs_test_123",
            fetchFn: fetchFn as unknown as typeof fetch,
        });

        expect(result.error).toBe(
            "That email already has an account. Please sign in instead.",
        );
    });

    it("starts Google OAuth and returns the redirect URL", async () => {
        const supabase = buildSupabaseMock({
            signInWithOAuth: vi.fn().mockResolvedValue({
                data: { url: "https://accounts.google.com" },
                error: null,
            }),
        });

        const result = await performGoogleAuth({
            supabase: supabase as unknown as SupabaseClient,
            redirectTo: "/dashboard",
            origin: "https://app.test",
            markPaid: false,
        });

        expect(result.redirectTo).toBe("https://accounts.google.com");
    });

    it("passes the expected redirect target to Google OAuth", async () => {
        const signInWithOAuth = vi.fn().mockResolvedValue({
            data: { url: "https://accounts.google.com" },
            error: null,
        });

        const supabase = buildSupabaseMock({ signInWithOAuth });

        await performGoogleAuth({
            supabase: supabase as unknown as SupabaseClient,
            redirectTo: "/dashboard",
            origin: "https://app.test",
            markPaid: true,
            stripeSessionId: "cs_test_123",
        });

        expect(signInWithOAuth).toHaveBeenCalledWith({
            provider: "google",
            options: {
                redirectTo:
                    "https://app.test/auth/callback?redirect=%2Fdashboard&post_payment=1&session_id=cs_test_123",
            },
        });
    });
});
