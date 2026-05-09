import RouteLoadingState from "@/components/layout/route-loading-state";

export default function DashboardLoading() {
  return (
    <RouteLoadingState
      title="Loading dashboard"
      description="Gathering your projects, favorites, and payment history."
    />
  );
}
