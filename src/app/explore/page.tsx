import ExploreProjects from "@/components/projects/explore-projects";
import { parseExplorePageInput } from "@/features/projects/schemas";
import { getExplorePageData } from "@/features/projects/queries";

type ExplorePageProps = {
  searchParams: Promise<{
    category?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseExplorePageInput(resolvedSearchParams);
  const {
    user,
    projects,
    favoriteProjectIds,
    errorMessage,
    currentCategory,
    currentSort,
    currentPage,
    totalCount,
    totalPages,
  } = await getExplorePageData(filters);

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="font-display text-3xl font-bold">Explore Projects</h1>
        <p className="mt-4 text-red-500">
          Error loading projects: {errorMessage}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold">Explore Projects</h1>
        <p className="text-muted-foreground">
          Discover student initiatives and support the ideas you believe in.
        </p>
      </div>

      <ExploreProjects
        projects={projects}
        favoriteProjectIds={favoriteProjectIds}
        isLoggedIn={!!user}
        currentCategory={currentCategory}
        currentSort={currentSort}
        currentPage={currentPage}
        totalCount={totalCount}
        totalPages={totalPages}
      />
    </main>
  );
}
