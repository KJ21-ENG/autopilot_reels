"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthTabNotice, { useAuthTabStatus } from "./AuthTabNotice";
import PrimaryLinkButton from "../../../components/PrimaryLinkButton";

const copyBySession = (hasSessionId: boolean) => {
  if (hasSessionId) {
    return {
      title: "Payment confirmed",
      body: "You're all set. Create your account to unlock your new workspace.",
    };
  }

  return {
    title: "Thanks for checking out",
    body: "If you just completed payment, your confirmation is on the way. You can continue to create your account now.",
  };
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const hasSessionId = Boolean(searchParams.get("session_id"));
  const { title, body } = copyBySession(hasSessionId);
  const { isAuthTab } = useAuthTabStatus();
  useEffect(() => {
    sessionStorage.removeItem("checkout_initiated");
    try {
      localStorage.removeItem("checkout_started_at");
    } catch (error) {
      console.warn("Unable to clear checkout start timestamp.", error);
    }
  }, []);


  if (isAuthTab) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <AuthTabNotice />
          <p className="text-sm text-gray-500">
            Return to your original tab to finish signing in.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <AuthTabNotice />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-500 mb-8">{body}</p>
        <PrimaryLinkButton href="/auth">
          Continue to Sign In
        </PrimaryLinkButton>
        <p className="text-sm text-gray-400 mt-4">
          Use the same email you checked out with to link your access.
        </p>
      </div>
    </main>
  );
}
