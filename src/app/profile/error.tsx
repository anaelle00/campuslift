"use client";

import RouteErrorState from "@/components/layout/route-error-state";

export default function ProfileError({
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
      title="Profile unavailable"
      description="CampusLift could not load your profile page right now."
    />
  );
}
