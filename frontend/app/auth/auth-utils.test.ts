import { describe, expect, it } from "vitest";
import {
    buildAuthErrorMessage,
    buildOAuthRedirectUrl,
    normalizeRedirectTarget,
} from "./auth-utils";

describe("auth utils", () => {
    it("normalizes redirect targets to safe paths", () => {
        expect(normalizeRedirectTarget("/dashboard")).toBe("/dashboard");
        expect(normalizeRedirectTarget("https://evil.test")).toBe(
            "/dashboard/series",
        );
        expect(normalizeRedirectTarget("//evil.test")).toBe(
            "/dashboard/series",
        );
        expect(normalizeRedirectTarget(null)).toBe("/dashboard/series");
    });

    it("builds the OAuth redirect URL with encoded redirect", () => {
        const url = buildOAuthRedirectUrl("https://app.test", "/dashboard");
        expect(url).toBe(
            "https://app.test/auth/callback?redirect=%2Fdashboard",
        );
    });

    it("formats friendly auth error messages", () => {
        expect(
            buildAuthErrorMessage({ message: "Invalid login credentials" }),
        ).toContain("No account found");
        expect(buildAuthErrorMessage({ message: "Rate limit" })).toContain(
            "Too many attempts",
        );
        expect(
            buildAuthErrorMessage({ message: "User already registered" }),
        ).toContain("sign in instead");
        expect(
            buildAuthErrorMessage({
                message: "Signups not allowed for this instance",
            }),
        ).toContain("sign-ups are disabled");
        expect(
            buildAuthErrorMessage({
                message: "Password should be at least 6 characters",
            }),
        ).toContain("at least 6 characters");
    });
});
