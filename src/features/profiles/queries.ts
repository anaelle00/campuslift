import { createClient } from "@/lib/supabase/server";
import { getCommentCountByProjectIds } from "@/features/comments/queries";
import { getDonationActivityForUser } from "@/features/donations/queries";
import type { Project } from "@/types/project";

type ProfileRecord = {
  id: string;
  display_name: string | null;
  username: string | null;
  organization: string | null;
  phone: string | null;
  website: string | null;
  bio: string | null;
  avatar_url: string | null;
};

async function attachCommentCounts(projects: Project[]) {
  const counts = await getCommentCountByProjectIds(projects.map((project) => project.id));

  return projects.map((project) => ({
    ...project,
    comments_count: counts.get(project.id) ?? 0,
  }));
}

export async function getCurrentProfilePageData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null as ProfileRecord | null,
      donationActivity: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const donationActivity = await getDonationActivityForUser(user.id);

  return {
    user,
    profile: (profile ?? null) as ProfileRecord | null,
    donationActivity,
  };
}

export async function getPublicProfilePageData(username: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !profile) {
    return {
      profile: null as ProfileRecord | null,
      projects: [] as Project[],
    };
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false });

  const projectsWithCommentCounts = await attachCommentCounts((projects ?? []) as Project[]);

  return {
    profile: profile as ProfileRecord,
    projects: projectsWithCommentCounts,
  };
}
