"use client";

import { useEffect } from "react";
import PrimaryLinkButton from "../../../components/PrimaryLinkButton";

export default function CheckoutCancelPage() {
  useEffect(() => {
    sessionStorage.removeItem("checkout_initiated");
    try {
      localStorage.removeItem("checkout_started_at");
    } catch (error) {
      console.warn("Unable to clear checkout start timestamp.", error);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Checkout canceled</h1>
        <p className="text-gray-500 mb-8">
          No worries — your payment wasn&apos;t completed. You can review plans and try again whenever you&apos;re ready.
        </p>
        <PrimaryLinkButton href="/#pricing">
          Back to Pricing
        </PrimaryLinkButton>
      </div>
    </main>
  );
}
