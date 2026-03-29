"use client";

import { useMemo, useState } from "react";
import ProjectGrid from "@/components/projects/project-grid";
import { Project } from "@/types/project";

type Props = {
  projects: Project[];
  favoriteProjectIds?: string[];
  isLoggedIn?: boolean;
};

const categories = [
  "All",
  "Tech",
  "Association",
  "Art",
  "Event",
  "Social",
  "Education",
];

type SortOption = "newest" | "most-funded" | "deadline-soon";

export default function ExploreProjects({
  projects,
  favoriteProjectIds = [],
  isLoggedIn = false,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (selectedCategory !== "All") {
      result = result.filter((project) => project.category === selectedCategory);
    }

    if (sortBy === "newest") {
      result.sort((a, b) => {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bDate - aDate;
      });
    }

    if (sortBy === "most-funded") {
      result.sort((a, b) => b.current_amount - a.current_amount);
    }

    if (sortBy === "deadline-soon") {
      result.sort((a, b) => {
        const aDate = new Date(a.deadline).getTime();
        const bDate = new Date(b.deadline).getTime();
        return aDate - bDate;
      });
    }

    return result;
  }, [projects, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="most-funded">Most funded</option>
            <option value="deadline-soon">Deadline soon</option>
          </select>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <ProjectGrid
          projects={filteredProjects}
          favoriteProjectIds={favoriteProjectIds}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">
          No projects found for this category.
        </div>
      )}
    </div>
  );
}