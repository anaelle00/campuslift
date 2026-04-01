import Link from "next/link";
import ProjectGrid from "@/components/projects/project-grid";
import { getHomePageData } from "@/features/projects/queries";

export default async function HomePage() {
  const { user, featuredProjects, favoriteProjectIds, errorMessage } =
    await getHomePageData();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section
        className="grain relative grid gap-8 overflow-hidden rounded-3xl border p-8 md:grid-cols-2 md:items-center"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 10% 20%, oklch(0.82 0.10 285 / 0.18), transparent),
            radial-gradient(ellipse 55% 70% at 90% 85%, oklch(0.88 0.07 60 / 0.16), transparent),
            radial-gradient(ellipse 40% 40% at 60% 10%, oklch(0.85 0.08 285 / 0.10), transparent),
            oklch(0.985 0.005 85)
          `,
        }}
      >
        <div className="relative z-10 space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Community-powered student ideas
          </span>

          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Support student ideas,{" "}
            <span className="text-primary">one pledge</span> at a time.
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            CampusLift helps students showcase projects, raise small community
            pledges, and bring meaningful campus ideas to life.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Explore projects
            </Link>

            <Link
              href="/create"
              className="rounded-xl border border-primary/20 bg-white/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition hover:bg-white"
            >
              Start a project
            </Link>
          </div>
        </div>

        <div
          className="relative z-10 rounded-3xl p-1"
          style={{
            background: `linear-gradient(135deg, oklch(0.75 0.15 285 / 0.3), oklch(0.88 0.07 60 / 0.2))`,
          }}
        >
          <div className="space-y-4 rounded-[1.25rem] bg-white/90 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">This month</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                +24 pledges
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">Projects funded</p>
                <p className="mt-2 font-display text-2xl font-bold">12</p>
              </div>

              <div className="rounded-2xl bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">Active supporters</p>
                <p className="mt-2 font-display text-2xl font-bold">87</p>
              </div>

              <div className="rounded-2xl bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">Avg. pledge</p>
                <p className="mt-2 font-display text-2xl font-bold">$8</p>
              </div>

              <div className="rounded-2xl bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">Student clubs helped</p>
                <p className="mt-2 font-display text-2xl font-bold">9</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Featured projects</h2>
            <p className="text-muted-foreground">
              Discover initiatives currently looking for support.
            </p>
          </div>

          <Link
            href="/explore"
            className="rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/5"
          >
            View all
          </Link>
        </div>

        {errorMessage ? (
          <p className="text-red-500">Error loading featured projects.</p>
        ) : (
          <ProjectGrid
            projects={featuredProjects}
            favoriteProjectIds={favoriteProjectIds}
            isLoggedIn={!!user}
          />
        )}
      </section>
    </main>
  );
}
