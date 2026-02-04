"use client";

import { useEffect, useState } from "react";

export function useAuthTabStatus() {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [isAuthTab] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const initiatedCheckout = sessionStorage.getItem("checkout_initiated");
    if (initiatedCheckout) {
      return false;
    }

    const openedByOtherTab = typeof window.opener !== "undefined" && window.opener !== null;

    if (openedByOtherTab) {
      return true;
    }

    try {
      const startedAt = localStorage.getItem("checkout_started_at");
      if (!startedAt) {
        return false;
      }

      const windowMs = 2 * 60 * 1000;
      const elapsed = Date.now() - Number(startedAt);

      return Number.isFinite(elapsed) && elapsed >= 0 && elapsed <= windowMs;
    } catch (error) {
      console.warn("Unable to read checkout start timestamp.", error);
      return false;
    }
  });

  useEffect(() => {
    if (!isAuthTab) {
      return;
    }

    const countdown = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    const closer = window.setTimeout(() => {
      window.close();
    }, 5000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(closer);
    };
  }, [isAuthTab]);

  return { isAuthTab, secondsRemaining };
}

export default function AuthTabNotice() {
  const { isAuthTab, secondsRemaining } = useAuthTabStatus();

  if (!isAuthTab) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      <p className="text-sm text-gray-400">
        This tab was opened for payment authorization. You can close it and return
        to the original tab. Closing automatically in {secondsRemaining}s.
      </p>
      <button
        type="button"
        onClick={() => window.close()}
        className="inline-flex w-full items-center justify-center border border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50"
      >
        Close This Tab
      </button>
    </div>
  );
}
