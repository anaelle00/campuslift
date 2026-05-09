"use client";

import RouteErrorState from "@/components/layout/route-error-state";

export default function ModerationError({
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
      title="Moderation unavailable"
      description="The moderation dashboard could not be loaded right now."
    />
  );
}
