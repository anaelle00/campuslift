import RouteLoadingState from "@/components/layout/route-loading-state";

export default function ProfileLoading() {
  return (
    <RouteLoadingState
      title="Loading profile"
      description="Fetching your profile details and support activity."
    />
  );
}
