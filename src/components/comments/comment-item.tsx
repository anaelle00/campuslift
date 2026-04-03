"use client";

import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type { CommentNode } from "@/features/comments/queries";

type ReactionType = "like" | "dislike";

type Props = {
  comment: CommentNode;
  depth: number;
  currentUserId: string | null;
  isLoggedIn: boolean;
  replyTargetId: string | null;
  deletingCommentId: string | null;
  reportTargetId: string | null;
  onReply: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onReaction: (commentId: string, reactionType: ReactionType) => void;
  onReport: (commentId: string) => void;
  replyForm: React.ReactNode | null;
  reportForm: React.ReactNode | null;
};

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

export default function CommentItem({
  comment,
  depth,
  currentUserId,
  isLoggedIn,
  replyTargetId,
  deletingCommentId,
  reportTargetId,
  onReply,
  onDelete,
  onReaction,
  onReport,
  replyForm,
  reportForm,
}: Props) {
  const deleted = Boolean(comment.deletedAt);
  const canDelete = currentUserId === comment.author.id && !deleted;
  const canReply = isLoggedIn && !deleted;
  const canReport =
    isLoggedIn &&
    !deleted &&
    currentUserId !== comment.author.id &&
    !comment.isReportedByCurrentUser;

  return (
    <li className={depth > 0 ? "mt-4 border-l border-border pl-4" : ""}>
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
              <span className="text-muted-foreground">
                @{comment.author.username ?? "user"}
              </span>
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
                    onClick={() => onReaction(comment.id, "like")}
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
                    onClick={() => onReaction(comment.id, "dislike")}
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
                  onClick={() => onReply(comment.id)}
                  className="font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {replyTargetId === comment.id ? "Cancel reply" : "Reply"}
                </button>
              ) : null}

              {canDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(comment.id)}
                  disabled={deletingCommentId === comment.id}
                  className="font-medium text-red-500 transition hover:text-red-600 disabled:opacity-60"
                >
                  {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
                </button>
              ) : null}

              {canReport ? (
                <button
                  type="button"
                  onClick={() => onReport(comment.id)}
                  className="font-medium text-amber-600 transition hover:text-amber-700"
                >
                  {reportTargetId === comment.id ? "Cancel report" : "Report"}
                </button>
              ) : null}

              {comment.isReportedByCurrentUser ? (
                <span className="font-medium text-amber-600">Reported</span>
              ) : null}
            </div>

            {replyTargetId === comment.id && replyForm}
            {reportTargetId === comment.id && reportForm}
          </div>
        </div>
      </div>

      {comment.children.length ? (
        <ul className="space-y-4 pt-4">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              depth={depth + 1}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
              replyTargetId={replyTargetId}
              deletingCommentId={deletingCommentId}
              reportTargetId={reportTargetId}
              onReply={onReply}
              onDelete={onDelete}
              onReaction={onReaction}
              onReport={onReport}
              replyForm={replyTargetId === child.id ? replyForm : null}
              reportForm={reportTargetId === child.id ? reportForm : null}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
