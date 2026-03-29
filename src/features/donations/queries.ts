import { createClient } from "@/lib/supabase/server";

const HISTORY_LIMIT = 6;

type PledgeRow = {
  amount: number;
  created_at: string;
  project_id: string;
  stripe_checkout_session_id: string | null;
  user_id?: string;
};

type ProjectLookup = {
  id: string;
  title: string;
  owner_id?: string;
  owner_name?: string;
  owner_username?: string;
  current_amount?: number;
  supporters_count?: number;
};

type ProfileLookup = {
  id: string;
  display_name: string | null;
  username: string | null;
};

export type PaymentHistoryItem = {
  id: string;
  amount: number;
  createdAt: string;
  projectId: string;
  projectTitle: string;
  projectHref: string;
  counterpartyLabel: string;
  counterpartyHref: string | null;
  source: "stripe" | "manual";
};

export type DonationActivity = {
  totalSentAmount: number;
  sentPaymentsCount: number;
  totalReceivedAmount: number;
  receivedPaymentsCount: number;
  sentHistory: PaymentHistoryItem[];
  receivedHistory: PaymentHistoryItem[];
};

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getPaymentSource(pledge: PledgeRow) {
  return pledge.stripe_checkout_session_id ? "stripe" : "manual";
}

function buildHistoryId(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(":");
}

export async function getDonationActivityForUser(
  userId: string,
): Promise<DonationActivity> {
  const supabase = await createClient();

  const { data: sentPledges } = await supabase
    .from("pledges")
    .select("amount, created_at, project_id, stripe_checkout_session_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const allSentPledges = (sentPledges ?? []) as PledgeRow[];
  const recentSentPledges = allSentPledges.slice(0, HISTORY_LIMIT);
  const sentProjectIds = unique(recentSentPledges.map((pledge) => pledge.project_id));

  let sentProjectsMap = new Map<string, ProjectLookup>();

  if (sentProjectIds.length > 0) {
    const { data: sentProjects } = await supabase
      .from("projects")
      .select("id, title, owner_name, owner_username")
      .in("id", sentProjectIds);

    sentProjectsMap = new Map(
      ((sentProjects ?? []) as ProjectLookup[]).map((project) => [project.id, project]),
    );
  }

  const sentHistory: PaymentHistoryItem[] = recentSentPledges.map((pledge) => {
    const project = sentProjectsMap.get(pledge.project_id);

    return {
      id: buildHistoryId([pledge.project_id, pledge.created_at, "sent"]),
      amount: pledge.amount,
      createdAt: pledge.created_at,
      projectId: pledge.project_id,
      projectTitle: project?.title ?? "Untitled project",
      projectHref: `/projects/${pledge.project_id}`,
      counterpartyLabel: project?.owner_name ?? "Creator",
      counterpartyHref: project?.owner_username
        ? `/users/${project.owner_username}`
        : null,
      source: getPaymentSource(pledge),
    };
  });

  const { data: ownedProjects } = await supabase
    .from("projects")
    .select("id, title, owner_id, current_amount, supporters_count")
    .eq("owner_id", userId);

  const allOwnedProjects = (ownedProjects ?? []) as ProjectLookup[];
  const ownedProjectIds = unique(allOwnedProjects.map((project) => project.id));

  let receivedPledges: PledgeRow[] = [];

  if (ownedProjectIds.length > 0) {
    const { data } = await supabase
      .from("pledges")
      .select("amount, created_at, project_id, stripe_checkout_session_id, user_id")
      .in("project_id", ownedProjectIds)
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);

    receivedPledges = (data ?? []) as PledgeRow[];
  }

  const supporterIds = unique(
    receivedPledges.map((pledge) => pledge.user_id ?? "").filter(Boolean),
  );

  let supportersMap = new Map<string, ProfileLookup>();

  if (supporterIds.length > 0) {
    const { data: supporters } = await supabase
      .from("profiles")
      .select("id, display_name, username")
      .in("id", supporterIds);

    supportersMap = new Map(
      ((supporters ?? []) as ProfileLookup[]).map((supporter) => [
        supporter.id,
        supporter,
      ]),
    );
  }

  const ownedProjectsMap = new Map(
    allOwnedProjects.map((project) => [project.id, project]),
  );

  const receivedHistory: PaymentHistoryItem[] = receivedPledges.map((pledge) => {
    const project = ownedProjectsMap.get(pledge.project_id);
    const supporter = pledge.user_id ? supportersMap.get(pledge.user_id) : null;
    const supporterLabel =
      supporter?.display_name ?? supporter?.username ?? "Supporter";

    return {
      id: buildHistoryId([
        pledge.project_id,
        pledge.created_at,
        pledge.user_id,
        "received",
      ]),
      amount: pledge.amount,
      createdAt: pledge.created_at,
      projectId: pledge.project_id,
      projectTitle: project?.title ?? "Untitled project",
      projectHref: `/projects/${pledge.project_id}`,
      counterpartyLabel: supporterLabel,
      counterpartyHref: supporter?.username ? `/users/${supporter.username}` : null,
      source: getPaymentSource(pledge),
    };
  });

  return {
    totalSentAmount: allSentPledges.reduce((sum, pledge) => sum + pledge.amount, 0),
    sentPaymentsCount: allSentPledges.length,
    totalReceivedAmount: allOwnedProjects.reduce(
      (sum, project) => sum + (project.current_amount ?? 0),
      0,
    ),
    receivedPaymentsCount: allOwnedProjects.reduce(
      (sum, project) => sum + (project.supporters_count ?? 0),
      0,
    ),
    sentHistory,
    receivedHistory,
  };
}
