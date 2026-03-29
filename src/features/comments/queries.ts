import { createClient } from "@/lib/supabase/server";

export const COMMENTS_PAGE_SIZE = 10;

type CommentRow = {
  id: string;
  body: string;
  project_id: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  deleted_at: string | null;
};

type CommentProfile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

export type CommentNode = {
  id: string;
  body: string;
  createdAt: string;
  deletedAt: string | null;
  parentId: string | null;
  isReportedByCurrentUser: boolean;
  reactions: {
    likes: number;
    dislikes: number;
    userReaction: "like" | "dislike" | null;
  };
  author: {
    id: string;
    displayName: string;
    username: string | null;
    avatarUrl: string | null;
  };
  children: CommentNode[];
};

type CommentReactionRow = {
  comment_id: string;
  user_id: string;
  reaction_type: "like" | "dislike";
};

type CommentReportRow = {
  comment_id: string;
};

type CommentProjectCountRow = {
  project_id: string;
};

export type ProjectCommentsPageData = {
  totalCount: number;
  totalRootComments: number;
  currentPage: number;
  totalPages: number;
  comments: CommentNode[];
};

function normalizePage(rawPage: number) {
  return Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
}

function getDisplayName(profile: CommentProfile | undefined, fallback: string) {
  return profile?.display_name ?? profile?.username ?? fallback;
}

function sortByCreatedAtDesc(a: CommentRow, b: CommentRow) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export async function getCommentCountByProjectIds(projectIds: string[]) {
  const uniqueProjectIds = Array.from(new Set(projectIds.filter(Boolean)));

  if (uniqueProjectIds.length === 0) {
    return new Map<string, number>();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("project_id")
    .in("project_id", uniqueProjectIds)
    .is("deleted_at", null);

  const counts = new Map<string, number>();

  for (const comment of (data ?? []) as CommentProjectCountRow[]) {
    counts.set(comment.project_id, (counts.get(comment.project_id) ?? 0) + 1);
  }

  return counts;
}

export async function getProjectCommentsPageData(
  projectId: string,
  rawPage = 1,
): Promise<ProjectCommentsPageData> {
  const currentPage = normalizePage(rawPage);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: commentsData } = await supabase
    .from("comments")
    .select("id, body, project_id, user_id, parent_id, created_at, deleted_at")
    .eq("project_id", projectId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const allComments = (commentsData ?? []) as CommentRow[];
  const rootComments = allComments
    .filter((comment) => comment.parent_id === null)
    .sort(sortByCreatedAtDesc);

  const totalRootComments = rootComments.length;
  const totalPages = Math.max(1, Math.ceil(totalRootComments / COMMENTS_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const offset = (safePage - 1) * COMMENTS_PAGE_SIZE;
  const paginatedRoots = rootComments.slice(offset, offset + COMMENTS_PAGE_SIZE);
  const selectedRootIds = new Set(paginatedRoots.map((comment) => comment.id));

  const childrenByParentId = new Map<string, CommentRow[]>();

  for (const comment of allComments) {
    if (!comment.parent_id) {
      continue;
    }

    const siblings = childrenByParentId.get(comment.parent_id) ?? [];
    siblings.push(comment);
    childrenByParentId.set(comment.parent_id, siblings);
  }

  const profileIds = Array.from(new Set(allComments.map((comment) => comment.user_id)));
  let profilesMap = new Map<string, CommentProfile>();

  if (profileIds.length > 0) {
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", profileIds);

    profilesMap = new Map(
      ((profilesData ?? []) as CommentProfile[]).map((profile) => [profile.id, profile]),
    );
  }

  const commentIds = allComments.map((comment) => comment.id);
  const reactionsMap = new Map<
    string,
    { likes: number; dislikes: number; userReaction: "like" | "dislike" | null }
  >();

  if (commentIds.length > 0) {
    const { data: reactionsData } = await supabase
      .from("comment_reactions")
      .select("comment_id, user_id, reaction_type")
      .in("comment_id", commentIds);

    for (const reaction of (reactionsData ?? []) as CommentReactionRow[]) {
      const current = reactionsMap.get(reaction.comment_id) ?? {
        likes: 0,
        dislikes: 0,
        userReaction: null,
      };

      if (reaction.reaction_type === "like") {
        current.likes += 1;
      } else {
        current.dislikes += 1;
      }

      if (user && reaction.user_id === user.id) {
        current.userReaction = reaction.reaction_type;
      }

      reactionsMap.set(reaction.comment_id, current);
    }
  }

  const reportedCommentIds = new Set<string>();

  if (user && commentIds.length > 0) {
    const { data: reportsData } = await supabase
      .from("comment_reports")
      .select("comment_id")
      .eq("user_id", user.id)
      .in("comment_id", commentIds);

    for (const report of (reportsData ?? []) as CommentReportRow[]) {
      reportedCommentIds.add(report.comment_id);
    }
  }

  function buildNode(comment: CommentRow): CommentNode {
    const profile = profilesMap.get(comment.user_id);
    const children = childrenByParentId.get(comment.id) ?? [];
    const reactions = reactionsMap.get(comment.id) ?? {
      likes: 0,
      dislikes: 0,
      userReaction: null,
    };

    return {
      id: comment.id,
      body: comment.body,
      createdAt: comment.created_at,
      deletedAt: comment.deleted_at,
      parentId: comment.parent_id,
      isReportedByCurrentUser: reportedCommentIds.has(comment.id),
      reactions,
      author: {
        id: comment.user_id,
        displayName: getDisplayName(profile, "CampusLift user"),
        username: profile?.username ?? null,
        avatarUrl: profile?.avatar_url ?? null,
      },
      children: children.map(buildNode),
    };
  }

  const comments = paginatedRoots
    .filter((comment) => selectedRootIds.has(comment.id))
    .map(buildNode);

  return {
    totalCount: allComments.length,
    totalRootComments,
    currentPage: safePage,
    totalPages,
    comments,
  };
}
