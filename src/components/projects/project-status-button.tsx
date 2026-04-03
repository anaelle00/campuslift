"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectStatus } from "@/types/project";

type Props = {
  projectId: string;
  currentStatus: ProjectStatus;
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-border bg-muted text-muted-foreground",
};

export default function ProjectStatusButton({ projectId, currentStatus }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleStatusChange(newStatus: ProjectStatus) {
    setIsLoading(true);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[currentStatus]}`}
      >
        {STATUS_LABELS[currentStatus]}
      </span>

      {currentStatus === "draft" && (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleStatusChange("published")}
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
        >
          Publish
        </button>
      )}

      {currentStatus === "published" && (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleStatusChange("archived")}
          className="rounded-lg border px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition hover:bg-accent disabled:opacity-60"
        >
          Archive
        </button>
      )}

      {currentStatus === "archived" && (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleStatusChange("published")}
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
        >
          Republish
        </button>
      )}
    </div>
  );
}
