import { describe, expect, it } from "vitest";

import { createResumeToken, verifyResumeToken } from "./resume-token";

describe("resume token", () => {
  it("creates and verifies a valid token", () => {
    const token = createResumeToken(
      {
        email: "Buyer@Example.com",
        stripe_session_id: "cs_test_123",
      },
      {
        secret: "test-secret",
        ttlSeconds: 60,
      }
    );

    const verified = verifyResumeToken(token, { secret: "test-secret" });
    expect(verified.valid).toBe(true);
    if (verified.valid) {
      expect(verified.payload.email).toBe("buyer@example.com");
      expect(verified.payload.stripe_session_id).toBe("cs_test_123");
    }
  });

  it("rejects token with wrong secret", () => {
    const token = createResumeToken(
      {
        email: "buyer@example.com",
        stripe_session_id: "cs_test_123",
      },
      {
        secret: "test-secret",
      }
    );
    const verified = verifyResumeToken(token, { secret: "other-secret" });
    expect(verified.valid).toBe(false);
  });
});
