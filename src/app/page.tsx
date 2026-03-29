import Link from "next/link";
import ProjectGrid from "@/components/projects/project-grid";
import { getHomePageData } from "@/features/projects/queries";

export default async function HomePage() {
  const { user, featuredProjects, favoriteProjectIds, errorMessage } =
    await getHomePageData();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="grid gap-8 rounded-3xl border bg-white p-8 shadow-sm md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            Community-powered student ideas
          </span>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Support student ideas, one small pledge at a time.
          </h1>

          <p className="max-w-xl text-lg text-gray-600">
            CampusLift helps students showcase projects, raise small community
            pledges, and bring meaningful campus ideas to life.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Explore projects
            </Link>

            <Link
              href="/create"
              className="rounded-xl border px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              Start a project
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 p-6">
          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">This month</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                +24 pledges
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Projects funded</p>
                <p className="mt-2 text-2xl font-bold">12</p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Active supporters</p>
                <p className="mt-2 text-2xl font-bold">87</p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Avg. pledge</p>
                <p className="mt-2 text-2xl font-bold">$8</p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Student clubs helped</p>
                <p className="mt-2 text-2xl font-bold">9</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured projects</h2>
            <p className="text-gray-600">
              Discover a few initiatives currently looking for support.
            </p>
          </div>

          <Link
            href="/explore"
            className="text-sm font-medium text-gray-700 hover:text-black"
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
