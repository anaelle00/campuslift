import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { actionFailure, actionSuccess, type ActionResult } from "@/features/shared/result";
import { createNotification } from "@/features/notifications/actions";
import {
  type CommentReportReason,
  validateCommentBody,
  validateCommentReportInput,
  validateParentCommentId,
} from "@/features/comments/schemas";

type ReactionType = "like" | "dislike";

export async function createComment(
  projectId: string,
  rawBody: unknown,
  rawParentId?: unknown,
): Promise<ActionResult> {
  if (!projectId.trim()) {
    return actionFailure("Project id is required.");
  }

  const { body, error: validationError } = validateCommentBody(rawBody);

  if (validationError || body === null) {
    return actionFailure(validationError ?? "Comment body is required.");
  }

  const parentId = validateParentCommentId(rawParentId);
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to comment.", 401);
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, title, owner_id")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return actionFailure("Project not found.", 404);
  }

  if (parentId) {
    const { data: parentComment, error: parentError } = await supabase
      .from("comments")
      .select("id, project_id")
      .eq("id", parentId)
      .is("deleted_at", null)
      .single();

    if (parentError || !parentComment || parentComment.project_id !== projectId) {
      return actionFailure("Parent comment not found.", 404);
    }
  }

  const { error } = await supabase.from("comments").insert({
    project_id: projectId,
    user_id: user.id,
    parent_id: parentId,
    body,
  });

  if (error) {
    return actionFailure(error.message);
  }

  // Notify the project owner (skip if commenter is the owner)
  if (project.owner_id && project.owner_id !== user.id) {
    const adminSupabase = createAdminClient();
    const { data: commenterProfile } = await adminSupabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .single();

    const commenterName = commenterProfile?.display_name ?? commenterProfile?.username ?? "Someone";

    await createNotification({
      userId: project.owner_id,
      type: "new_comment",
      title: "New comment on your project",
      body: `${commenterName} commented on "${project.title}".`,
      projectId,
    });
  }

  return actionSuccess(undefined, "Comment posted.");
}

export async function deleteComment(commentId: string): Promise<ActionResult> {
  if (!commentId.trim()) {
    return actionFailure("Comment id is required.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to delete a comment.", 401);
  }

  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("id, user_id, deleted_at")
    .eq("id", commentId)
    .single();

  if (commentError || !comment) {
    return actionFailure("Comment not found.", 404);
  }

  if (comment.user_id !== user.id) {
    return actionFailure("You can only delete your own comments.", 403);
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess(undefined, "Comment deleted.");
}

export async function toggleCommentReaction(
  commentId: string,
  reactionType: ReactionType,
): Promise<ActionResult<{ reaction: ReactionType | null }>> {
  if (!commentId.trim()) {
    return actionFailure("Comment id is required.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to react to a comment.", 401);
  }

  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("id")
    .eq("id", commentId)
    .is("deleted_at", null)
    .single();

  if (commentError || !comment) {
    return actionFailure("Comment not found.", 404);
  }

  const { data: existingReaction, error: existingReactionError } = await supabase
    .from("comment_reactions")
    .select("reaction_type")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingReactionError) {
    return actionFailure(existingReactionError.message);
  }

  if (existingReaction?.reaction_type === reactionType) {
    const { error } = await supabase
      .from("comment_reactions")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", user.id);

    if (error) {
      return actionFailure(error.message);
    }

    return actionSuccess({ reaction: null });
  }

  if (existingReaction) {
    const { error } = await supabase
      .from("comment_reactions")
      .update({
        reaction_type: reactionType,
      })
      .eq("comment_id", commentId)
      .eq("user_id", user.id);

    if (error) {
      return actionFailure(error.message);
    }

    return actionSuccess({ reaction: reactionType });
  }

  const { error } = await supabase.from("comment_reactions").insert({
    comment_id: commentId,
    user_id: user.id,
    reaction_type: reactionType,
  });

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess({ reaction: reactionType });
}

export async function reportComment(
  commentId: string,
  rawReason: unknown,
  rawDetails: unknown,
): Promise<ActionResult> {
  if (!commentId.trim()) {
    return actionFailure("Comment id is required.");
  }

  const {
    reason,
    details,
    error: validationError,
  } = validateCommentReportInput(rawReason, rawDetails);

  if (validationError || reason === null) {
    return actionFailure(validationError ?? "Please choose a valid report reason.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to report a comment.", 401);
  }

  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("id, user_id")
    .eq("id", commentId)
    .is("deleted_at", null)
    .single();

  if (commentError || !comment) {
    return actionFailure("Comment not found.", 404);
  }

  if (comment.user_id === user.id) {
    return actionFailure("You cannot report your own comment.");
  }

  const { error } = await supabase.from("comment_reports").insert({
    comment_id: commentId,
    user_id: user.id,
    reason: reason as CommentReportReason,
    details,
  });

  if (error) {
    if (error.code === "23505") {
      return actionFailure("You already reported this comment.");
    }

    return actionFailure(error.message);
  }

  return actionSuccess(undefined, "Comment reported.");
}
