import PageContainer from "@/components/layout/page-container";

type RouteLoadingStateProps = {
  title?: string;
  description?: string;
};

export default function RouteLoadingState({
  title = "Loading page",
  description = "Fetching the latest data for this view.",
}: RouteLoadingStateProps) {
  return (
    <PageContainer>
      <div className="space-y-6 py-4">
        <div className="space-y-3">
          <div className="h-10 w-64 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded-xl bg-gray-200" />
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="h-6 w-56 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="h-4 w-5/6 animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-3xl border bg-white p-5 shadow-sm"
            >
              <div className="h-44 animate-pulse rounded-2xl bg-gray-200" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 animate-pulse rounded-xl bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded-xl bg-gray-100" />
                <div className="h-4 w-2/3 animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-white p-5 text-sm text-gray-500 shadow-sm">
          <p className="font-semibold text-gray-700">{title}</p>
          <p className="mt-1">{description}</p>
        </div>
      </div>
    </PageContainer>
  );
}
