"use client";

import { useState, useTransition } from "react";
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
  currentSearch: string | null;
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
  currentSearch,
  currentPage,
  totalPages,
  totalCount,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(currentSearch ?? "");

  function updateExploreParams(updates: {
    category?: ExploreCategory;
    sort?: ExploreSortOption;
    page?: number;
    search?: string | null;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextCategory = updates.category ?? currentCategory;
    const nextSort = updates.sort ?? currentSort;
    const nextPage = updates.page ?? currentPage;
    const nextSearch = "search" in updates ? updates.search : currentSearch;

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

    if (!nextSearch) {
      params.delete("search");
    } else {
      params.set("search", nextSearch);
    }

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    updateExploreParams({ search: searchInput.trim() || null, page: 1 });
  }

  const hasActiveFilters =
    currentCategory !== DEFAULT_EXPLORE_CATEGORY ||
    currentSort !== DEFAULT_EXPLORE_SORT ||
    !!currentSearch;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search projects by name or description…"
          className="flex-1 rounded-xl border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          Search
        </button>
        {currentSearch && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setSearchInput("");
              updateExploreParams({ search: null, page: 1 });
            }}
            className="rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
          >
            Clear
          </button>
        )}
      </form>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
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
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                } ${isPending ? "cursor-wait opacity-70" : ""}`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-muted-foreground">
            Sort by
          </label>
          <select
            id="sort"
            value={currentSort}
            disabled={isPending}
            onChange={(e) =>
              updateExploreParams({ sort: e.target.value as ExploreSortOption, page: 1 })
            }
            className="rounded-xl border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="most-funded">Most funded</option>
            <option value="deadline-soon">Deadline soon</option>
          </select>
        </div>
      </div>

      {/* Results info + pagination */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 text-sm text-muted-foreground shadow-sm md:flex-row md:items-center md:justify-between">
        <p>
          {totalCount > 0
            ? `${totalCount} project${totalCount > 1 ? "s" : ""} — page ${currentPage} of ${totalPages}`
            : "No projects match the current filters."}
        </p>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setSearchInput("");
                updateExploreParams({
                  category: DEFAULT_EXPLORE_CATEGORY,
                  sort: DEFAULT_EXPLORE_SORT,
                  search: null,
                  page: 1,
                });
              }}
              className="rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:bg-accent"
            >
              Reset all
            </button>
          )}
          {totalCount > 0 && (
            <>
              <button
                type="button"
                disabled={currentPage <= 1 || isPending}
                onClick={() => updateExploreParams({ page: currentPage - 1 })}
                className="rounded-xl border px-4 py-1.5 font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages || isPending}
                onClick={() => updateExploreParams({ page: currentPage + 1 })}
                className="rounded-xl border px-4 py-1.5 font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>

      {projects.length > 0 ? (
        <ProjectGrid
          projects={projects}
          favoriteProjectIds={favoriteProjectIds}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        <div className="rounded-2xl border bg-card px-6 py-16 text-center shadow-sm">
          <p className="text-4xl">🔍</p>
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {currentSearch
              ? `No results for "${currentSearch}". Try a different search term or category.`
              : "There are no projects in this category yet. Be the first to start one!"}
          </p>
        </div>
      )}
    </div>
  );
}
