"use client";

import { FormEvent } from "react";

type Props = {
  replyBody: string;
  isSubmitting: boolean;
  onBodyChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function CommentReplyForm({
  replyBody,
  isSubmitting,
  onBodyChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border bg-muted/50 p-4"
    >
      <textarea
        value={replyBody}
        onChange={(event) => onBodyChange(event.target.value)}
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
          onClick={onCancel}
          className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
