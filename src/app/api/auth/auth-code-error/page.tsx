"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const message =
    searchParams.get("message") || "An unknown error has occurred.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Login Failed</h1>
      <p className="text-gray-700">{message}</p>

      <a
        href="/auth/login"
        className="mt-4 inline-block text-blue-600 underline"
      >
        Go back to login page
      </a>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <AuthCodeErrorContent />
    </Suspense>
  );
}
