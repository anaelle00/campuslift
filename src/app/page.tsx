import Link from "next/link";
import ProjectGrid from "@/components/projects/project-grid";
import { getHomePageData } from "@/features/projects/queries";
import { ArrowRight, Users, Lightbulb, TrendingUp, Star } from "lucide-react";

const stats = [
  { label: "Projects funded", value: "12", icon: Lightbulb },
  { label: "Active supporters", value: "87", icon: Users },
  { label: "Avg. pledge", value: "$8", icon: Star },
  { label: "Clubs helped", value: "9", icon: TrendingUp },
];

export default async function HomePage() {
  const { user, featuredProjects, favoriteProjectIds, errorMessage } =
    await getHomePageData();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-16">
      {/* ── Hero ── */}
      <section className="relative mt-6 overflow-hidden rounded-2xl bg-hero-bg px-8 py-16 md:px-14 md:py-20">
        {/* Subtle glow blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.24 264), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 right-1/3 h-56 w-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.18 220), transparent 70%)" }}
        />

        <div className="relative z-10 grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left – copy */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Community-powered
            </span>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-hero-foreground md:text-5xl lg:text-[3.5rem]">
              Support student ideas,{" "}
              <span className="text-primary">one pledge</span>{" "}
              at a time.
            </h1>

            <p className="max-w-md text-base leading-relaxed text-hero-muted">
              CampusLift helps students showcase projects, raise small community
              pledges, and bring meaningful campus ideas to life.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 hover:shadow-primary/30"
              >
                Explore projects
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-hero-foreground backdrop-blur-sm transition hover:bg-white/10"
              >
                Start a project
              </Link>
            </div>
          </div>

          {/* Right – stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/4 p-5 backdrop-blur-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-hero-foreground">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs text-hero-muted">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured projects ── */}
      <section className="mt-16 space-y-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Featured
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Projects looking for support
            </h2>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {errorMessage ? (
          <p className="text-destructive">Error loading featured projects.</p>
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
