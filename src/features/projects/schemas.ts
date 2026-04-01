export type CreateProjectInput = {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  ownerName: string;
  targetAmount: number;
  deadline: string;
};

export const PROJECT_CATEGORIES = [
  "Tech",
  "Association",
  "Art",
  "Event",
  "Social",
  "Education",
] as const;

export const EXPLORE_CATEGORIES = ["All", ...PROJECT_CATEGORIES] as const;
export const EXPLORE_SORT_OPTIONS = [
  "newest",
  "most-funded",
  "deadline-soon",
] as const;

export const DEFAULT_EXPLORE_CATEGORY = "All";
export const DEFAULT_EXPLORE_SORT = "newest";
export const EXPLORE_PAGE_SIZE = 9;

export type ExploreCategory = (typeof EXPLORE_CATEGORIES)[number];
export type ExploreSortOption = (typeof EXPLORE_SORT_OPTIONS)[number];

type SearchParamValue = string | string[] | undefined;

function getSearchParamValue(value?: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function validateCreateProjectInput(input: CreateProjectInput) {
  if (
    !input.title.trim() ||
    !input.shortDescription.trim() ||
    !input.description.trim() ||
    !input.category.trim() ||
    !input.ownerName.trim() ||
    !input.deadline.trim()
  ) {
    return "Please fill in all required fields.";
  }

  if (!Number.isFinite(input.targetAmount) || input.targetAmount <= 0) {
    return "Please enter a valid funding goal.";
  }

  return null;
}

export function parseExplorePageInput(input: {
  category?: SearchParamValue;
  sort?: SearchParamValue;
  page?: SearchParamValue;
  search?: SearchParamValue;
}) {
  const rawCategory = getSearchParamValue(input.category);
  const rawSort = getSearchParamValue(input.sort);
  const rawPage = getSearchParamValue(input.page);
  const rawSearch = getSearchParamValue(input.search);

  const category = EXPLORE_CATEGORIES.includes(rawCategory as ExploreCategory)
    ? (rawCategory as ExploreCategory)
    : DEFAULT_EXPLORE_CATEGORY;

  const sortBy = EXPLORE_SORT_OPTIONS.includes(rawSort as ExploreSortOption)
    ? (rawSort as ExploreSortOption)
    : DEFAULT_EXPLORE_SORT;

  const parsedPage = Number.parseInt(rawPage ?? "", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const search = rawSearch?.trim() || null;

  return {
    category,
    sortBy,
    page,
    search,
  };
}
