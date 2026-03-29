"use client";

import { useEffect } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/page-container";

type RouteErrorStateProps = {
  title?: string;
  description?: string;
  reset?: () => void;
  error?: Error & { digest?: string };
};

export default function RouteErrorState({
  title = "Something went wrong",
  description = "This page could not be loaded. Please try again.",
  reset,
  error,
}: RouteErrorStateProps) {
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <PageContainer>
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Error
          </p>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {reset ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Try again
            </button>
          ) : null}

          <Link
            href="/"
            className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-gray-100"
          >
            Back to home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
