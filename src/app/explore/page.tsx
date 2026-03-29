import ExploreProjects from "@/components/projects/explore-projects";
import { getExplorePageData } from "@/features/projects/queries";

export default async function ExplorePage() {
  const { user, projects, favoriteProjectIds, errorMessage } =
    await getExplorePageData();

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold">Explore Projects</h1>
        <p className="mt-4 text-red-500">
          Error loading projects: {errorMessage}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Explore Projects</h1>

      <p className="text-gray-600">
        Discover student initiatives and support the ideas you believe in.
      </p>

      <ExploreProjects
        projects={projects}
        favoriteProjectIds={favoriteProjectIds}
        isLoggedIn={!!user}
      />
    </main>
  );
}
