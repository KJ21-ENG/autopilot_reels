import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
};

const renderSuccess = async (
  query: string,
  options?: { opener?: object | null; localStorage?: Storage; sessionStorage?: Storage }
) => {
  vi.resetModules();
  vi.doMock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(query),
  }));
  const localStorageMock =
    options?.localStorage ??
    (globalThis as typeof globalThis & { localStorage?: Storage }).localStorage ??
    (createMemoryStorage() as unknown as Storage);
  const sessionStorageMock =
    options?.sessionStorage ??
    (globalThis as typeof globalThis & { sessionStorage?: Storage }).sessionStorage ??
    (createMemoryStorage() as unknown as Storage);
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    configurable: true,
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    value: sessionStorageMock,
    configurable: true,
  });
  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage: localStorageMock,
      sessionStorage: sessionStorageMock,
      location: { search: query },
      opener: options?.opener,
    },
    configurable: true,
  });
  const { default: SuccessPage } = await import("./success/page");
  return renderToStaticMarkup(<SuccessPage />);
};

const renderCancel = async () => {
  vi.resetModules();
  vi.doMock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(""),
  }));
  const { default: CancelPage } = await import("./cancel/page");
  return renderToStaticMarkup(<CancelPage />);
};

describe("checkout result pages", () => {
  it("renders a success confirmation when session_id is present", async () => {
    const markup = await renderSuccess("?session_id=cs_test_123");

    expect(markup).toContain("Payment confirmed");
    expect(markup).toContain("/auth");
  });

  it("links success and cancel pages to the correct destinations", async () => {
    const [successMarkup, cancelMarkup] = await Promise.all([
      renderSuccess("?session_id=cs_test_456"),
      renderCancel(),
    ]);

    expect(successMarkup).toContain("href=\"/auth\"");
    expect(cancelMarkup).toContain("href=\"/#pricing\"");
  });

  it("hides the main confirmation when rendered in the auth-only tab", async () => {
    const localStorageMock = createMemoryStorage();
    const sessionStorageMock = createMemoryStorage();

    localStorageMock.setItem("checkout_started_at", Date.now().toString());

    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      configurable: true,
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      value: sessionStorageMock,
      configurable: true,
    });
    Object.defineProperty(globalThis, "window", {
      value: { localStorage: localStorageMock, sessionStorage: sessionStorageMock },
      configurable: true,
    });

    const markup = await renderSuccess("");

    expect(markup).toContain("Close This Tab");
    expect(markup).not.toContain("Payment confirmed");
  });

  it("shows confirmation when checkout was initiated in this tab", async () => {
    const localStorageMock = createMemoryStorage();
    const sessionStorageMock = createMemoryStorage();

    localStorageMock.setItem("checkout_started_at", Date.now().toString());
    sessionStorageMock.setItem("checkout_initiated", "1");

    const markup = await renderSuccess("?session_id=cs_confirmed", {
      localStorage: localStorageMock as unknown as Storage,
      sessionStorage: sessionStorageMock as unknown as Storage,
    });

    expect(markup).toContain("Payment confirmed");
    expect(markup).not.toContain("Close This Tab");
  });

  it("shows close-tab guidance when success is opened by another tab", async () => {
    const localStorageMock = createMemoryStorage();
    const sessionStorageMock = createMemoryStorage();

    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      configurable: true,
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      value: sessionStorageMock,
      configurable: true,
    });
    Object.defineProperty(globalThis, "window", {
      value: {
        localStorage: localStorageMock,
        sessionStorage: sessionStorageMock,
        location: { search: "?session_id=cs_opened" },
        opener: {},
      },
      configurable: true,
    });

    const markup = await renderSuccess("?session_id=cs_opened", {
      opener: {},
      localStorage: localStorageMock as unknown as Storage,
      sessionStorage: sessionStorageMock as unknown as Storage,
    });

    expect(markup).toContain("Close This Tab");
    expect(markup).not.toContain("Payment confirmed");
  });

  it("shows confirmation when checkout timestamp is stale", async () => {
    const localStorageMock = createMemoryStorage();
    const sessionStorageMock = createMemoryStorage();

    const stale = Date.now() - 5 * 60 * 1000;
    localStorageMock.setItem("checkout_started_at", stale.toString());

    const markup = await renderSuccess("", {
      localStorage: localStorageMock as unknown as Storage,
      sessionStorage: sessionStorageMock as unknown as Storage,
    });

    expect(markup).toContain("Thanks for checking out");
    expect(markup).not.toContain("Close This Tab");
  });
});
