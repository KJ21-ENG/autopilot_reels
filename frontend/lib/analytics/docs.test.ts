import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ANALYTICS_EVENT_SCHEMA_DOC, BASELINE_ANALYTICS_EVENTS } from "./events";

describe("analytics docs", () => {
  it("documents the baseline event schema and names", () => {
    const docsPath = path.resolve(process.cwd(), "docs", "analytics.md");
    const docs = readFileSync(docsPath, "utf8");

    expect(docs).toContain("Event Schema");

    for (const eventName of BASELINE_ANALYTICS_EVENTS) {
      expect(docs).toContain(eventName);
    }

    expect(ANALYTICS_EVENT_SCHEMA_DOC).toContain("event_name");
  });
});
