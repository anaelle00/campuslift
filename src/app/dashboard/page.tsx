import Link from "next/link";
import StatsCard from "@/components/dashboard/stats-card";
import SupportHistoryList from "@/components/donations/support-history-list";
import ProjectGrid from "@/components/projects/project-grid";
import { getDashboardPageData } from "@/features/projects/queries";

export default async function DashboardPage() {
  const {
    user,
    myProjects,
    savedProjects,
    favoriteProjectIds,
    myProjectsError,
    favoritesError,
    totalFundingRaised,
    totalSupporters,
    totalSentAmount,
    sentPaymentsCount,
    sentHistory,
    receivedHistory,
  } = await getDashboardPageData();

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          You need to be logged in to view your dashboard.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Log in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <section className="space-y-2">
        <h1 className="font-display text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Here is an overview of your projects and saved ideas.
        </p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          label="Projects created"
          value={String(myProjects.length)}
          helper="Projects linked to your account"
        />
        <StatsCard
          label="Funding raised"
          value={`$${totalFundingRaised}`}
          helper="Across your projects"
        />
        <StatsCard
          label="Total supporters"
          value={String(totalSupporters)}
          helper="Community supporters"
        />
        <StatsCard
          label="Saved projects"
          value={String(savedProjects.length)}
          helper="Projects you bookmarked"
        />
        <StatsCard
          label="You pledged"
          value={`$${totalSentAmount}`}
          helper="Total support you have sent"
        />
        <StatsCard
          label="Payments made"
          value={String(sentPaymentsCount)}
          helper="Successful support payments"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SupportHistoryList
          title="Payments you made"
          description="Your most recent support payments across CampusLift projects."
          counterpartyLabel="Creator"
          emptyTitle="No payments yet"
          emptyDescription="Support a project to start building your payment history."
          items={sentHistory}
        />
        <SupportHistoryList
          title="Payments received"
          description="Recent supporters who contributed to your own projects."
          counterpartyLabel="Supporter"
          emptyTitle="No supporters yet"
          emptyDescription="Once people back your projects, their payments will appear here."
          items={receivedHistory}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">My projects</h2>
            <p className="text-muted-foreground">
              Track the initiatives you have created and their current progress.
            </p>
          </div>

          <Link
            href="/create"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Create new project
          </Link>
        </div>

        {myProjectsError ? (
          <div className="rounded-2xl border bg-card p-6 text-red-500 shadow-sm">
            Error loading your projects: {myProjectsError}
          </div>
        ) : myProjects.length > 0 ? (
          <ProjectGrid
            projects={myProjects}
            favoriteProjectIds={favoriteProjectIds}
            isLoggedIn={true}
          />
        ) : (
          <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="mt-2 text-muted-foreground">
              You have not created any projects yet.
            </p>
            <Link
              href="/create"
              className="mt-4 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Start your first project
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Saved projects</h2>
          <p className="text-muted-foreground">
            These are the projects you have marked as favorites.
          </p>
        </div>

        {favoritesError ? (
          <div className="rounded-2xl border bg-card p-6 text-red-500 shadow-sm">
            Error loading favorites: {favoritesError}
          </div>
        ) : savedProjects.length > 0 ? (
          <ProjectGrid
            projects={savedProjects}
            favoriteProjectIds={favoriteProjectIds}
            isLoggedIn={true}
          />
        ) : (
          <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold">No saved projects yet</h3>
            <p className="mt-2 text-muted-foreground">
              Explore projects and click the heart icon to save the ones you
              like.
            </p>
            <Link
              href="/explore"
              className="mt-4 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore projects
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
