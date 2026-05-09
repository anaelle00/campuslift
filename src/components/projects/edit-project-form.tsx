"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECT_CATEGORIES } from "@/features/projects/schemas";
import type { Project } from "@/types/project";

type Props = {
  project: Project;
};

export default function EditProjectForm({ project }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(project.title);
  const [shortDescription, setShortDescription] = useState(project.short_description);
  const [description, setDescription] = useState(project.description);
  const [category, setCategory] = useState(project.category);
  const [ownerName, setOwnerName] = useState(project.owner_name);
  const [targetAmount, setTargetAmount] = useState(String(project.target_amount));
  const [deadline, setDeadline] = useState(project.deadline);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("shortDescription", shortDescription.trim());
      formData.append("description", description.trim());
      formData.append("category", category.trim());
      formData.append("ownerName", ownerName.trim());
      formData.append("targetAmount", targetAmount.trim());
      formData.append("deadline", deadline.trim());

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        body: formData,
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        data?: { redirectTo: string };
      };

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      router.push(result.data?.redirectTo ?? `/projects/${project.id}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Project title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="shortDescription" className="text-sm font-medium">
          Short description
        </label>
        <input
          id="shortDescription"
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Full description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className={inputClass}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="ownerName" className="text-sm font-medium">
            Owner name
          </label>
          <input
            id="ownerName"
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="targetAmount" className="text-sm font-medium">
            Funding goal
          </label>
          <input
            id="targetAmount"
            type="number"
            min="1"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="deadline" className="text-sm font-medium">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Project image{" "}
          <span className="font-normal text-muted-foreground">(leave empty to keep current)</span>
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
          >
            Choose image
          </button>
          <span className="text-sm text-muted-foreground">
            {imageFile ? imageFile.name : "No file chosen"}
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border px-5 py-3 text-sm font-medium transition hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
