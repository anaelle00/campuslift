"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ModerationReportItem } from "@/features/moderation/queries";

type Props = {
  reports: ModerationReportItem[];
};

type ModerationAction = "resolve" | "dismiss" | "delete_comment";

type ApiResult = {
  success: boolean;
  message?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function ModerationReports({ reports }: Props) {
  const router = useRouter();
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAction(reportId: string, action: ModerationAction) {
    setErrorMessage("");
    setPendingKey(`${reportId}:${action}`);

    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      const result = (await response.json()) as ApiResult;

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      router.refresh();
    } finally {
      setPendingKey(null);
    }
  }

  if (!reports.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-8 text-center">
        <h3 className="text-lg font-semibold">No reports in this queue</h3>
        <p className="mt-2 text-sm text-gray-600">
          When users report comments, they will appear here for review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}

      {reports.map((report) => (
        <article
          key={report.id}
          className="space-y-4 rounded-3xl border bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="rounded-full bg-amber-100 px-3 py-1 font-medium uppercase text-amber-700">
                  {report.reason}
                </span>
                <span>{dateFormatter.format(new Date(report.createdAt))}</span>
              </div>

              <h2 className="text-xl font-semibold">
                <Link href={report.project.href} className="hover:underline">
                  {report.project.title}
                </Link>
              </h2>

              <p className="text-sm text-gray-600">
                Author:{" "}
                {report.author.href ? (
                  <Link href={report.author.href} className="hover:underline">
                    {report.author.label}
                  </Link>
                ) : (
                  report.author.label
                )}{" "}
                | Reporter:{" "}
                {report.reporter.href ? (
                  <Link href={report.reporter.href} className="hover:underline">
                    {report.reporter.label}
                  </Link>
                ) : (
                  report.reporter.label
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAction(report.id, "resolve")}
                disabled={pendingKey === `${report.id}:resolve`}
                className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-60"
              >
                {pendingKey === `${report.id}:resolve` ? "Saving..." : "Resolve"}
              </button>

              <button
                type="button"
                onClick={() => handleAction(report.id, "dismiss")}
                disabled={pendingKey === `${report.id}:dismiss`}
                className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-60"
              >
                {pendingKey === `${report.id}:dismiss` ? "Saving..." : "Dismiss"}
              </button>

              <button
                type="button"
                onClick={() => handleAction(report.id, "delete_comment")}
                disabled={pendingKey === `${report.id}:delete_comment`}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {pendingKey === `${report.id}:delete_comment`
                  ? "Deleting..."
                  : "Delete comment"}
              </button>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Comment
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                {report.comment.body}
              </p>
            </div>

            {report.details ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Reporter details
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                  {report.details}
                </p>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
