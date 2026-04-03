"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import CommentItem from "@/components/comments/comment-item";
import CommentReplyForm from "@/components/comments/comment-reply-form";
import CommentReportForm from "@/components/comments/comment-report-form";
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
    return (
      <CommentItem
        key={comment.id}
        comment={comment}
        depth={depth}
        currentUserId={currentUserId}
        isLoggedIn={isLoggedIn}
        replyTargetId={replyTargetId}
        deletingCommentId={deletingCommentId}
        reportTargetId={reportTargetId}
        onReply={(id) => {
          setReplyTargetId((current) => (current === id ? null : id));
          setReplyBody("");
          setErrorMessage("");
        }}
        onDelete={handleDelete}
        onReaction={handleReaction}
        onReport={(id) => {
          setReportTargetId((current) => (current === id ? null : id));
          setReportReason("spam");
          setReportDetails("");
          setErrorMessage("");
        }}
        replyForm={
          replyTargetId === comment.id ? (
            <CommentReplyForm
              replyBody={replyBody}
              isSubmitting={isSubmitting}
              onBodyChange={setReplyBody}
              onSubmit={(event) => handleReplySubmit(event, comment.id)}
              onCancel={() => { setReplyTargetId(null); setReplyBody(""); }}
            />
          ) : null
        }
        reportForm={
          reportTargetId === comment.id ? (
            <CommentReportForm
              reportReason={reportReason}
              reportDetails={reportDetails}
              isSubmitting={isSubmitting}
              onReasonChange={setReportReason}
              onDetailsChange={setReportDetails}
              onSubmit={(event) => handleReport(event, comment.id)}
              onCancel={() => { setReportTargetId(null); setReportReason("spam"); setReportDetails(""); }}
            />
          ) : null
        }
      />
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

        <p className="text-sm text-muted-foreground">
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
          <p className="mt-2 text-sm text-muted-foreground">
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
