import { createHmac, timingSafeEqual } from "node:crypto";

type ResumeTokenPayload = {
  email: string;
  stripe_session_id: string;
  exp: number;
};

const encodeBase64Url = (input: string) => Buffer.from(input).toString("base64url");
const decodeBase64Url = (input: string) => Buffer.from(input, "base64url").toString("utf8");

const sign = (value: string, secret: string) =>
  createHmac("sha256", secret).update(value).digest("base64url");

export function createResumeToken(
  payload: { email: string; stripe_session_id: string },
  options: { secret: string; ttlSeconds?: number }
): string {
  const ttlSeconds = options.ttlSeconds ?? 60 * 60;
  const tokenPayload: ResumeTokenPayload = {
    email: payload.email.trim().toLowerCase(),
    stripe_session_id: payload.stripe_session_id,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(tokenPayload));
  const signature = sign(encodedPayload, options.secret);
  return `${encodedPayload}.${signature}`;
}

export function verifyResumeToken(
  token: string,
  options: { secret: string }
): { valid: true; payload: ResumeTokenPayload } | { valid: false; reason: string } {
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) {
    return { valid: false, reason: "invalid_format" };
  }

  const expectedSignature = sign(encodedPayload, options.secret);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { valid: false, reason: "invalid_signature" };
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(encodedPayload)) as ResumeTokenPayload;
    if (!parsed.email || !parsed.stripe_session_id || !parsed.exp) {
      return { valid: false, reason: "invalid_payload" };
    }
    if (parsed.exp <= Math.floor(Date.now() / 1000)) {
      return { valid: false, reason: "expired" };
    }

    return { valid: true, payload: parsed };
  } catch {
    return { valid: false, reason: "invalid_payload" };
  }
}
