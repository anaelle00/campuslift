"use client";

import RouteErrorState from "@/components/layout/route-error-state";

export default function ExploreError({
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
      title="Explore is unavailable"
      description="The project catalog could not be loaded right now."
    />
  );
}
