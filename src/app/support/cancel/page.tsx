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
          <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            Checkout canceled
          </span>

          <h1 className="font-display text-3xl font-bold">No payment was processed</h1>

          <p className="text-muted-foreground">
            You can return to the project page and try again whenever you want.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={projectId ? `/projects/${projectId}` : "/explore"}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Back to project
          </Link>

          <Link
            href="/explore"
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            Explore projects
          </Link>
        </div>
      </div>
    </main>
  );
}
