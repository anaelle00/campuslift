import Link from "next/link";
import ModerationReports from "@/components/admin/moderation-reports";
import StatsCard from "@/components/dashboard/stats-card";
import { getModerationPageData } from "@/features/moderation/queries";

type PageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

function getSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ModerationPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const status = getSearchParam(resolvedSearchParams.status);
  const { user, isAdmin, currentStatus, stats, reports } =
    await getModerationPageData(status);

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        <h1 className="text-3xl font-bold">Moderation</h1>
        <p className="text-gray-600">
          You need to be logged in to access the moderation dashboard.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Log in
        </Link>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        <h1 className="text-3xl font-bold">Moderation</h1>
        <p className="text-gray-600">
          Your account does not have access to the moderation dashboard.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Moderation dashboard</h1>
        <p className="text-gray-600">
          Review reported comments, dismiss false positives, or remove abusive
          content.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          label="Open reports"
          value={String(stats.open)}
          helper="Needs moderator action"
        />
        <StatsCard
          label="Resolved"
          value={String(stats.resolved)}
          helper="Marked as handled"
        />
        <StatsCard
          label="Dismissed"
          value={String(stats.dismissed)}
          helper="Rejected moderation reports"
        />
      </section>

      <section className="flex flex-wrap gap-3">
        {(["open", "resolved", "dismissed"] as const).map((statusOption) => (
          <Link
            key={statusOption}
            href={`/admin/moderation?status=${statusOption}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              currentStatus === statusOption
                ? "bg-black text-white"
                : "border text-gray-600 hover:bg-gray-100 hover:text-black"
            }`}
          >
            {statusOption[0].toUpperCase()}
            {statusOption.slice(1)}
          </Link>
        ))}
      </section>

      <ModerationReports reports={reports} />
    </main>
  );
}
