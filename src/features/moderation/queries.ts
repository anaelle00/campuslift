import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ModerationStatus = "open" | "resolved" | "dismissed";

type ModerationReportRow = {
  id: string;
  comment_id: string;
  user_id: string;
  reason: string;
  details: string | null;
  status: ModerationStatus;
  created_at: string;
};

type ModerationCommentRow = {
  id: string;
  body: string;
  user_id: string;
  project_id: string;
};

type ModerationProjectRow = {
  id: string;
  title: string;
  owner_username: string;
};

type ModerationProfileRow = {
  id: string;
  display_name: string | null;
  username: string | null;
};

export type ModerationReportItem = {
  id: string;
  reason: string;
  details: string | null;
  status: ModerationStatus;
  createdAt: string;
  project: {
    id: string;
    title: string;
    href: string;
  };
  comment: {
    id: string;
    body: string;
  };
  reporter: {
    label: string;
    href: string | null;
  };
  author: {
    label: string;
    href: string | null;
  };
};

export type ModerationPageData = {
  user: { id: string; email?: string | null } | null;
  isAdmin: boolean;
  currentStatus: ModerationStatus;
  stats: {
    open: number;
    resolved: number;
    dismissed: number;
  };
  reports: ModerationReportItem[];
};

function normalizeStatus(rawStatus: string | undefined): ModerationStatus {
  if (rawStatus === "resolved" || rawStatus === "dismissed") {
    return rawStatus;
  }

  return "open";
}

function getProfileLabel(profile: ModerationProfileRow | undefined, fallback: string) {
  return profile?.display_name ?? profile?.username ?? fallback;
}

export async function getModerationPageData(
  rawStatus?: string,
): Promise<ModerationPageData> {
  const currentStatus = normalizeStatus(rawStatus);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      isAdmin: false,
      currentStatus,
      stats: {
        open: 0,
        resolved: 0,
        dismissed: 0,
      },
      reports: [],
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      user,
      isAdmin: false,
      currentStatus,
      stats: {
        open: 0,
        resolved: 0,
        dismissed: 0,
      },
      reports: [],
    };
  }

  const adminSupabase = createAdminClient();
  const { data: reportsData } = await adminSupabase
    .from("comment_reports")
    .select("id, comment_id, user_id, reason, details, status, created_at")
    .order("created_at", { ascending: false });

  const allReports = (reportsData ?? []) as ModerationReportRow[];
  const filteredReports = allReports.filter((report) => report.status === currentStatus);
  const commentIds = Array.from(new Set(filteredReports.map((report) => report.comment_id)));

  let commentsMap = new Map<string, ModerationCommentRow>();

  if (commentIds.length > 0) {
    const { data: commentsData } = await adminSupabase
      .from("comments")
      .select("id, body, user_id, project_id")
      .in("id", commentIds);

    commentsMap = new Map(
      ((commentsData ?? []) as ModerationCommentRow[]).map((comment) => [
        comment.id,
        comment,
      ]),
    );
  }

  const projectIds = Array.from(
    new Set(
      filteredReports
        .map((report) => commentsMap.get(report.comment_id)?.project_id ?? "")
        .filter(Boolean),
    ),
  );

  let projectsMap = new Map<string, ModerationProjectRow>();

  if (projectIds.length > 0) {
    const { data: projectsData } = await adminSupabase
      .from("projects")
      .select("id, title, owner_username")
      .in("id", projectIds);

    projectsMap = new Map(
      ((projectsData ?? []) as ModerationProjectRow[]).map((project) => [
        project.id,
        project,
      ]),
    );
  }

  const profileIds = Array.from(
    new Set(
      filteredReports.flatMap((report) => {
        const comment = commentsMap.get(report.comment_id);
        return [report.user_id, comment?.user_id ?? ""].filter(Boolean);
      }),
    ),
  );

  let profilesMap = new Map<string, ModerationProfileRow>();

  if (profileIds.length > 0) {
    const { data: profilesData } = await adminSupabase
      .from("profiles")
      .select("id, display_name, username")
      .in("id", profileIds);

    profilesMap = new Map(
      ((profilesData ?? []) as ModerationProfileRow[]).map((entry) => [
        entry.id,
        entry,
      ]),
    );
  }

  const reports = filteredReports
    .map((report) => {
      const comment = commentsMap.get(report.comment_id);

      if (!comment) {
        return null;
      }

      const project = projectsMap.get(comment.project_id);
      const reporter = profilesMap.get(report.user_id);
      const author = profilesMap.get(comment.user_id);

      return {
        id: report.id,
        reason: report.reason,
        details: report.details,
        status: report.status,
        createdAt: report.created_at,
        project: {
          id: comment.project_id,
          title: project?.title ?? "Unknown project",
          href: `/projects/${comment.project_id}`,
        },
        comment: {
          id: comment.id,
          body: comment.body,
        },
        reporter: {
          label: getProfileLabel(reporter, "Reporter"),
          href: reporter?.username ? `/users/${reporter.username}` : null,
        },
        author: {
          label: getProfileLabel(author, "Author"),
          href: author?.username ? `/users/${author.username}` : null,
        },
      };
    })
    .filter(Boolean) as ModerationReportItem[];

  return {
    user,
    isAdmin: true,
    currentStatus,
    stats: {
      open: allReports.filter((report) => report.status === "open").length,
      resolved: allReports.filter((report) => report.status === "resolved").length,
      dismissed: allReports.filter((report) => report.status === "dismissed").length,
    },
    reports,
  };
}
