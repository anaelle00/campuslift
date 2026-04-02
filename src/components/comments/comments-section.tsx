"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type {
  CommentNode,
  ProjectCommentsPageData,
} from "@/features/comments/queries";

type Props = {
  projectId: string;
  currentUserId: string | null;
  isLoggedIn: boolean;
  commentsPageData: ProjectCommentsPageData;
};

type ApiResult = {
  success: boolean;
  message?: string;
};

type ReactionType = "like" | "dislike";
type ReportReason = "spam" | "harassment" | "hate" | "misinformation" | "other";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeStyle: "short",
});

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isCommentDeleted(comment: CommentNode) {
  return Boolean(comment.deletedAt);
}

export default function CommentsSection({
  projectId,
  currentUserId,
  isLoggedIn,
  commentsPageData,
}: Props) {
  const router = useRouter();

  const [newCommentBody, setNewCommentBody] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>("spam");
  const [reportDetails, setReportDetails] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function submitComment(body: string, parentId?: string | null) {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body,
          parentId,
        }),
      });

      const result = (await response.json()) as ApiResult;

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      setNewCommentBody("");
      setReplyBody("");
      setReplyTargetId(null);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTopLevelSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    await submitComment(newCommentBody);
  }

  async function handleReplySubmit(
    event: FormEvent<HTMLFormElement>,
    parentId: string,
  ) {
    event.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    await submitComment(replyBody, parentId);
  }

  async function handleDelete(commentId: string) {
    setErrorMessage("");
    setDeletingCommentId(commentId);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as ApiResult;

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      router.refresh();
    } finally {
      setDeletingCommentId(null);
    }
  }

  async function handleReaction(commentId: string, reactionType: ReactionType) {
    setErrorMessage("");

    try {
      const response = await fetch(`/api/comments/${commentId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reactionType,
        }),
      });

      const result = (await response.json()) as ApiResult;

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage("Something went wrong.");
    }
  }

  async function handleReport(
    event: FormEvent<HTMLFormElement>,
    commentId: string,
  ) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/comments/${commentId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails,
        }),
      });

      const result = (await response.json()) as ApiResult;

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      setReportTargetId(null);
      setReportReason("spam");
      setReportDetails("");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderComment(comment: CommentNode, depth = 0): React.ReactNode {
    const deleted = isCommentDeleted(comment);
    const canDelete = currentUserId === comment.author.id && !deleted;
    const canReply = isLoggedIn && !deleted;
    const canReport =
      isLoggedIn &&
      !deleted &&
      currentUserId !== comment.author.id &&
      !comment.isReportedByCurrentUser;

    return (
      <li
        key={comment.id}
        className={depth > 0 ? "mt-4 border-l border-border pl-4" : ""}
      >
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Avatar className="size-10 border-none after:hidden">
              {comment.author.avatarUrl ? (
                <AvatarImage
                  src={comment.author.avatarUrl}
                  alt={comment.author.displayName}
                />
              ) : null}
              <AvatarFallback>
                {getInitials(comment.author.displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {comment.author.username ? (
                  <Link
                    href={`/users/${comment.author.username}`}
                    className="font-semibold hover:underline"
                  >
                    {comment.author.displayName}
                  </Link>
                ) : (
                  <span className="font-semibold">{comment.author.displayName}</span>
                )}

                <span className="text-muted-foreground">@{comment.author.username ?? "user"}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">
                  {dateFormatter.format(new Date(comment.createdAt))}
                </span>
              </div>

              {deleted ? (
                <p className="text-sm italic text-muted-foreground">
                  This comment was deleted.
                </p>
              ) : (
                <p className="whitespace-pre-wrap text-sm text-foreground">
                  {comment.body}
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-sm">
                {!deleted ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReaction(comment.id, "like")}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        comment.reactions.userReaction === "like"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "hover:bg-accent"
                      }`}
                    >
                      Like ({comment.reactions.likes})
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReaction(comment.id, "dislike")}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        comment.reactions.userReaction === "dislike"
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : "hover:bg-accent"
                      }`}
                    >
                      Dislike ({comment.reactions.dislikes})
                    </button>
                  </>
                ) : null}

                {canReply ? (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTargetId((current) =>
                        current === comment.id ? null : comment.id,
                      );
                      setReplyBody("");
                      setErrorMessage("");
                    }}
                    className="font-medium text-muted-foreground transition hover:text-foreground"
                  >
                    {replyTargetId === comment.id ? "Cancel reply" : "Reply"}
                  </button>
                ) : null}

                {canDelete ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingCommentId === comment.id}
                    className="font-medium text-red-500 transition hover:text-red-600 disabled:opacity-60"
                  >
                    {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
                  </button>
                ) : null}

                {canReport ? (
                  <button
                    type="button"
                    onClick={() => {
                      setReportTargetId((current) =>
                        current === comment.id ? null : comment.id,
                      );
                      setReportReason("spam");
                      setReportDetails("");
                      setErrorMessage("");
                    }}
                    className="font-medium text-amber-600 transition hover:text-amber-700"
                  >
                    {reportTargetId === comment.id ? "Cancel report" : "Report"}
                  </button>
                ) : null}

                {comment.isReportedByCurrentUser ? (
                  <span className="font-medium text-amber-600">Reported</span>
                ) : null}
              </div>

              {replyTargetId === comment.id ? (
                <form
                  onSubmit={(event) => handleReplySubmit(event, comment.id)}
                  className="space-y-3 rounded-2xl border bg-muted/50 p-4"
                >
                  <textarea
                    value={replyBody}
                    onChange={(event) => setReplyBody(event.target.value)}
                    rows={3}
                    placeholder="Write your reply..."
                    className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Posting..." : "Post reply"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReplyTargetId(null);
                        setReplyBody("");
                      }}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-accent"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}

              {reportTargetId === comment.id ? (
                <form
                  onSubmit={(event) => handleReport(event, comment.id)}
                  className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason</label>
                    <select
                      value={reportReason}
                      onChange={(event) =>
                        setReportReason(event.target.value as ReportReason)
                      }
                      className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="spam">Spam</option>
                      <option value="harassment">Harassment</option>
                      <option value="hate">Hate</option>
                      <option value="misinformation">Misinformation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Details (optional)
                    </label>
                    <textarea
                      value={reportDetails}
                      onChange={(event) => setReportDetails(event.target.value)}
                      rows={3}
                      placeholder="Add a short context for the moderator..."
                      className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Submit report"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReportTargetId(null);
                        setReportReason("spam");
                        setReportDetails("");
                      }}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-accent"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>

        {comment.children.length ? (
          <ul className="space-y-4 pt-4">
            {comment.children.map((child) => renderComment(child, depth + 1))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <section id="comments" className="space-y-6 rounded-2xl border bg-card p-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Discussion</h2>
            <p className="text-sm text-muted-foreground">
              {commentsPageData.totalCount} comments across this project thread.
            </p>
          </div>

          {commentsPageData.totalPages > 1 ? (
            <p className="text-sm text-muted-foreground">
              Page {commentsPageData.currentPage} of {commentsPageData.totalPages}
            </p>
          ) : null}
        </div>

        <p className="text-sm text-gray-600">
          Ask questions, share feedback, or reply to other supporters.
        </p>
      </div>

      <form onSubmit={handleTopLevelSubmit} className="space-y-3">
        <textarea
          value={newCommentBody}
          onChange={(event) => setNewCommentBody(event.target.value)}
          rows={4}
          placeholder={
            isLoggedIn ? "Write a comment..." : "Log in to join the discussion."
          }
          disabled={!isLoggedIn || isSubmitting}
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          {isLoggedIn ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Posting..." : "Post comment"}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Log in to comment
            </Link>
          )}

          <p className="text-xs text-muted-foreground">
            Nested replies are supported in this thread.
          </p>
        </div>
      </form>

      {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}

      {commentsPageData.comments.length ? (
        <ul className="space-y-4">
          {commentsPageData.comments.map((comment) => renderComment(comment))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed p-6 text-center">
          <h3 className="text-lg font-semibold">No comments yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Start the discussion with the first comment on this project.
          </p>
        </div>
      )}

      {commentsPageData.totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <Link
            href={
              commentsPageData.currentPage > 1
                ? `/projects/${projectId}?commentsPage=${commentsPageData.currentPage - 1}#comments`
                : "#comments"
            }
            aria-disabled={commentsPageData.currentPage === 1}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              commentsPageData.currentPage === 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-accent"
            }`}
          >
            Previous page
          </Link>

          <Link
            href={
              commentsPageData.currentPage < commentsPageData.totalPages
                ? `/projects/${projectId}?commentsPage=${commentsPageData.currentPage + 1}#comments`
                : "#comments"
            }
            aria-disabled={
              commentsPageData.currentPage === commentsPageData.totalPages
            }
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              commentsPageData.currentPage === commentsPageData.totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-accent"
            }`}
          >
            Next page
          </Link>
        </div>
      ) : null}
    </section>
  );
}
