import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { middleware } from "./middleware";

describe("middleware auth redirects", () => {
  it("redirects unauthenticated users to auth flow", async () => {
    const request = new NextRequest("http://localhost/dashboard");
    const response = await middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain(
      "/auth?redirect=%2Fdashboard"
    );
  });
});
