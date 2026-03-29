import RouteLoadingState from "@/components/layout/route-loading-state";

export default function ProjectLoading() {
  return (
    <RouteLoadingState
      title="Loading project"
      description="Fetching the project details, support history, and discussion thread."
    />
  );
}
