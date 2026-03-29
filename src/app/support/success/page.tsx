import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    projectId?: string | string[];
    session_id?: string | string[];
  }>;
};

function getSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SupportSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const projectId = getSearchParam(params.projectId);
  const sessionId = getSearchParam(params.session_id);

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
            Payment sent to Stripe
          </span>

          <h1 className="text-3xl font-bold">Support in progress</h1>

          <p className="text-gray-600">
            Stripe confirmed your checkout. CampusLift is now finalizing the
            pledge and updating the project totals.
          </p>

          {sessionId ? (
            <p className="text-sm text-gray-500">Checkout session: {sessionId}</p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={projectId ? `/projects/${projectId}` : "/explore"}
            className="rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90"
          >
            Back to project
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border px-4 py-2 transition hover:bg-gray-50"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
