"use client";

import RouteErrorState from "@/components/layout/route-error-state";

export default function DashboardError({
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
      title="Dashboard unavailable"
      description="CampusLift could not load your dashboard data right now."
    />
  );
}
