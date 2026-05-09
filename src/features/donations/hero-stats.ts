import { createClient } from "@/lib/supabase/server";

export type HeroStats = {
  projectsFunded: number;
  activeSupporters: number;
  averagePledge: number;
  recentPledgesCount: number;
};

export async function getHeroStats(): Promise<HeroStats> {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const since = thirtyDaysAgo.toISOString();

  const [projectsResult, pledgesResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .gt("current_amount", 0),
    supabase
      .from("pledges")
      .select("amount, user_id")
      .gte("created_at", since),
  ]);

  const projectsFunded = projectsResult.count ?? 0;
  const recentPledges = pledgesResult.data ?? [];
  const recentPledgesCount = recentPledges.length;

  const uniqueSupporters = new Set(
    recentPledges.map((pledge) => pledge.user_id),
  );
  const activeSupporters = uniqueSupporters.size;

  const totalAmount = recentPledges.reduce(
    (sum, pledge) => sum + (pledge.amount ?? 0),
    0,
  );
  const averagePledge =
    recentPledgesCount > 0 ? Math.round(totalAmount / recentPledgesCount) : 0;

  return {
    projectsFunded,
    activeSupporters,
    averagePledge,
    recentPledgesCount,
  };
}
