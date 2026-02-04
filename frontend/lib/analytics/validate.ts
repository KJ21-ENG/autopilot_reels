import type { AnalyticsEventPayload } from "./events";

const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]+$/;

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: "invalid_event"; message: string } };

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  return Object.getPrototypeOf(value) === Object.prototype;
};

export const validateAnalyticsEventPayload = (
  payload: unknown
): ValidationResult<AnalyticsEventPayload> => {
  if (!payload || typeof payload !== "object") {
    return {
      ok: false,
      error: { code: "invalid_event", message: "Event payload must be an object." },
    };
  }

  const event = payload as AnalyticsEventPayload;

  if (!isNonEmptyString(event.event_name)) {
    return {
      ok: false,
      error: { code: "invalid_event", message: "Event name is required." },
    };
  }

  if (!EVENT_NAME_PATTERN.test(event.event_name)) {
    return {
      ok: false,
      error: {
        code: "invalid_event",
        message: "Event name must be snake_case.",
      },
    };
  }

  if (event.user_id !== undefined && !isNonEmptyString(event.user_id)) {
    return {
      ok: false,
      error: { code: "invalid_event", message: "user_id must be a string." },
    };
  }

  if (event.session_id !== undefined && !isNonEmptyString(event.session_id)) {
    return {
      ok: false,
      error: { code: "invalid_event", message: "session_id must be a string." },
    };
  }

  if (event.metadata !== undefined && !isPlainObject(event.metadata)) {
    return {
      ok: false,
      error: { code: "invalid_event", message: "metadata must be an object." },
    };
  }

  return { ok: true, data: event };
};
