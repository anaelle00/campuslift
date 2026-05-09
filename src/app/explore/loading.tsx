import RouteLoadingState from "@/components/layout/route-loading-state";

export default function ExploreLoading() {
  return (
    <RouteLoadingState
      title="Loading projects"
      description="Fetching the latest projects available on CampusLift."
    />
  );
}
