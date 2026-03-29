"use client";

import RouteErrorState from "@/components/layout/route-error-state";

export default function ProjectError({
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
      title="Project page unavailable"
      description="This project could not be loaded right now. Please try again."
    />
  );
}
