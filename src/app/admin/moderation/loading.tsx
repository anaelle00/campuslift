import RouteLoadingState from "@/components/layout/route-loading-state";

export default function ModerationLoading() {
  return (
    <RouteLoadingState
      title="Loading moderation"
      description="Fetching the latest comment reports and review state."
    />
  );
}
