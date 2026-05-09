"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectStatus } from "@/types/project";

type Props = {
  projectId: string;
  projectTitle: string;
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

export default function ProjectStatusButton({ projectId, projectTitle, currentStatus }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  if (showDeleteConfirm) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Delete <span className="font-semibold text-foreground">&ldquo;{projectTitle}&rdquo;</span>? This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="rounded-lg bg-destructive px-2.5 py-0.5 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className="rounded-lg border px-2.5 py-0.5 text-xs font-medium transition hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
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

      <button
        type="button"
        onClick={() => setShowDeleteConfirm(true)}
        className="rounded-lg border border-destructive/30 px-2.5 py-0.5 text-xs font-medium text-destructive transition hover:bg-destructive/5"
      >
        Delete
      </button>
    </div>
  );
}
