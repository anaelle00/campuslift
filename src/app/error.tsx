"use client";

import RouteErrorState from "@/components/layout/route-error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      error={error}
      reset={reset}
      title="CampusLift could not load this page"
      description="The request failed before the page finished rendering. Try again or return to the home page."
    />
  );
}
