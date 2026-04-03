"use client";

import { FormEvent } from "react";

type ReportReason = "spam" | "harassment" | "hate" | "misinformation" | "other";

type Props = {
  reportReason: ReportReason;
  reportDetails: string;
  isSubmitting: boolean;
  onReasonChange: (value: ReportReason) => void;
  onDetailsChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function CommentReportForm({
  reportReason,
  reportDetails,
  isSubmitting,
  onReasonChange,
  onDetailsChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Reason</label>
        <select
          value={reportReason}
          onChange={(event) =>
            onReasonChange(event.target.value as ReportReason)
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
        <label className="text-sm font-medium">Details (optional)</label>
        <textarea
          value={reportDetails}
          onChange={(event) => onDetailsChange(event.target.value)}
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
          onClick={onCancel}
          className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
