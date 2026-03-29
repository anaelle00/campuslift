"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProjectGrid from "@/components/projects/project-grid";
import {
  DEFAULT_EXPLORE_CATEGORY,
  DEFAULT_EXPLORE_SORT,
  EXPLORE_CATEGORIES,
  type ExploreCategory,
  type ExploreSortOption,
} from "@/features/projects/schemas";
import { Project } from "@/types/project";

type Props = {
  projects: Project[];
  favoriteProjectIds?: string[];
  isLoggedIn?: boolean;
  currentCategory: ExploreCategory;
  currentSort: ExploreSortOption;
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

export default function ExploreProjects({
  projects,
  favoriteProjectIds = [],
  isLoggedIn = false,
  currentCategory,
  currentSort,
  currentPage,
  totalPages,
  totalCount,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateExploreParams(updates: {
    category?: ExploreCategory;
    sort?: ExploreSortOption;
    page?: number;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextCategory = updates.category ?? currentCategory;
    const nextSort = updates.sort ?? currentSort;
    const nextPage = updates.page ?? currentPage;

    if (nextCategory === DEFAULT_EXPLORE_CATEGORY) {
      params.delete("category");
    } else {
      params.set("category", nextCategory);
    }

    if (nextSort === DEFAULT_EXPLORE_SORT) {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {EXPLORE_CATEGORIES.map((category) => {
            const isActive = currentCategory === category;

            return (
              <button
                key={category}
                type="button"
                disabled={isPending}
                onClick={() => updateExploreParams({ category, page: 1 })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isPending ? "cursor-wait opacity-70" : ""}`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Sort by
          </label>
          <select
            id="sort"
            value={currentSort}
            disabled={isPending}
            onChange={(e) =>
              updateExploreParams({
                sort: e.target.value as ExploreSortOption,
                page: 1,
              })
            }
            className="rounded-xl border px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="most-funded">Most funded</option>
            <option value="deadline-soon">Deadline soon</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 text-sm text-gray-600 shadow-sm md:flex-row md:items-center md:justify-between">
        <p>
          {totalCount > 0
            ? `Showing page ${currentPage} of ${totalPages} across ${totalCount} project${totalCount > 1 ? "s" : ""}.`
            : "No projects match the current filters."}
        </p>

        {totalCount > 0 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateExploreParams({ page: currentPage - 1 })}
              className="rounded-xl border px-4 py-2 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => updateExploreParams({ page: currentPage + 1 })}
              className="rounded-xl border px-4 py-2 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      {projects.length > 0 ? (
        <ProjectGrid
          projects={projects}
          favoriteProjectIds={favoriteProjectIds}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">
          <p>No projects found for this category.</p>
          {currentCategory !== DEFAULT_EXPLORE_CATEGORY ||
          currentSort !== DEFAULT_EXPLORE_SORT ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                updateExploreParams({
                  category: DEFAULT_EXPLORE_CATEGORY,
                  sort: DEFAULT_EXPLORE_SORT,
                  page: 1,
                })
              }
              className="mt-4 rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Reset filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
