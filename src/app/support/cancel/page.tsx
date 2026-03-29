import Link from "next/link";

type CancelPageProps = {
  searchParams: Promise<{
    projectId?: string | string[];
  }>;
};

function getSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SupportCancelPage({ searchParams }: CancelPageProps) {
  const params = await searchParams;
  const projectId = getSearchParam(params.projectId);

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            Checkout canceled
          </span>

          <h1 className="text-3xl font-bold">No payment was processed</h1>

          <p className="text-gray-600">
            You can return to the project page and try again whenever you want.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={projectId ? `/projects/${projectId}` : "/explore"}
            className="rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90"
          >
            Back to project
          </Link>

          <Link
            href="/explore"
            className="rounded-lg border px-4 py-2 transition hover:bg-gray-50"
          >
            Explore projects
          </Link>
        </div>
      </div>
    </main>
  );
}
