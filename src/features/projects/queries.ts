import { createClient } from "@/lib/supabase/server";
import { getCommentCountByProjectIds } from "@/features/comments/queries";
import { getDonationActivityForUser } from "@/features/donations/queries";
import {
  DEFAULT_EXPLORE_CATEGORY,
  EXPLORE_PAGE_SIZE,
  type ExploreCategory,
  type ExploreSortOption,
} from "@/features/projects/schemas";
import type { Project } from "@/types/project";

type PledgePreview = {
  amount: number;
  created_at: string;
  user_id: string;
};

async function getFavoriteProjectIds(userId: string) {
  const supabase = await createClient();
  const { data: favorites } = await supabase
    .from("favorites")
    .select("project_id")
    .eq("user_id", userId);

  return (favorites ?? []).map((favorite) => favorite.project_id);
}

async function attachCommentCounts(projects: Project[]) {
  const counts = await getCommentCountByProjectIds(projects.map((project) => project.id));

  return projects.map((project) => ({
    ...project,
    comments_count: counts.get(project.id) ?? 0,
  }));
}

export async function getHomePageData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const favoriteProjectIds = user ? await getFavoriteProjectIds(user.id) : [];
  const featuredProjects = await attachCommentCounts((data ?? []) as Project[]);

  return {
    user,
    featuredProjects,
    favoriteProjectIds,
    errorMessage: error?.message ?? null,
  };
}

export async function getExplorePageData(input: {
  category: ExploreCategory;
  sortBy: ExploreSortOption;
  page: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let countQuery = supabase
    .from("projects")
    .select("id", { count: "exact", head: true });

  if (input.category !== DEFAULT_EXPLORE_CATEGORY) {
    countQuery = countQuery.eq("category", input.category);
  }

  const { count, error: countError } = await countQuery;
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / EXPLORE_PAGE_SIZE));
  const currentPage = Math.min(input.page, totalPages);
  const from = (currentPage - 1) * EXPLORE_PAGE_SIZE;
  const to = from + EXPLORE_PAGE_SIZE - 1;

  let projectsQuery = supabase.from("projects").select("*");

  if (input.category !== DEFAULT_EXPLORE_CATEGORY) {
    projectsQuery = projectsQuery.eq("category", input.category);
  }

  if (input.sortBy === "most-funded") {
    projectsQuery = projectsQuery
      .order("current_amount", { ascending: false })
      .order("created_at", { ascending: false });
  } else if (input.sortBy === "deadline-soon") {
    projectsQuery = projectsQuery
      .order("deadline", { ascending: true })
      .order("created_at", { ascending: false });
  } else {
    projectsQuery = projectsQuery.order("created_at", { ascending: false });
  }

  const { data, error } = await projectsQuery.range(from, to);

  const favoriteProjectIds = user ? await getFavoriteProjectIds(user.id) : [];
  const projects = await attachCommentCounts((data ?? []) as Project[]);

  return {
    user,
    projects,
    favoriteProjectIds,
    currentCategory: input.category,
    currentSort: input.sortBy,
    currentPage,
    totalCount,
    totalPages,
    errorMessage: countError?.message ?? error?.message ?? null,
  };
}

export async function getProjectDetailsPageData(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    return {
      user,
      project: null as Project | null,
      pledges: [] as PledgePreview[],
      isFavorite: false,
    };
  }

  const { data: pledges } = await supabase
    .from("pledges")
    .select("amount, created_at, user_id")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  let isFavorite = false;

  if (user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("project_id", id)
      .maybeSingle();

    isFavorite = Boolean(favorite);
  }

  const projectWithCommentCount = (
    await attachCommentCounts([project as Project])
  )[0] as Project;

  return {
    user,
    project: projectWithCommentCount,
    pledges: (pledges ?? []) as PledgePreview[],
    isFavorite,
  };
}

export async function getDashboardPageData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      myProjects: [] as Project[],
      savedProjects: [] as Project[],
      favoriteProjectIds: [] as string[],
      myProjectsError: null as string | null,
      favoritesError: null as string | null,
      totalFundingRaised: 0,
      totalSupporters: 0,
      totalSentAmount: 0,
      sentPaymentsCount: 0,
      sentHistory: [],
      receivedHistory: [],
    };
  }

  const { data: myProjectsData, error: myProjectsError } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const myProjects = await attachCommentCounts((myProjectsData ?? []) as Project[]);

  const { data: favoritesData, error: favoritesError } = await supabase
    .from("favorites")
    .select("project_id")
    .eq("user_id", user.id);

  const favoriteProjectIds = (favoritesData ?? []).map((favorite) => favorite.project_id);

  let savedProjects: Project[] = [];

  if (favoriteProjectIds.length > 0) {
    const { data: savedProjectsData } = await supabase
      .from("projects")
      .select("*")
      .in("id", favoriteProjectIds)
      .order("created_at", { ascending: false });

    savedProjects = await attachCommentCounts((savedProjectsData ?? []) as Project[]);
  }

  const totalFundingRaised = myProjects.reduce(
    (sum, project) => sum + project.current_amount,
    0,
  );

  const totalSupporters = myProjects.reduce(
    (sum, project) => sum + project.supporters_count,
    0,
  );

  const donationActivity = await getDonationActivityForUser(user.id);

  return {
    user,
    myProjects,
    savedProjects,
    favoriteProjectIds,
    myProjectsError: myProjectsError?.message ?? null,
    favoritesError: favoritesError?.message ?? null,
    totalFundingRaised,
    totalSupporters,
    totalSentAmount: donationActivity.totalSentAmount,
    sentPaymentsCount: donationActivity.sentPaymentsCount,
    sentHistory: donationActivity.sentHistory,
    receivedHistory: donationActivity.receivedHistory,
  };
}
