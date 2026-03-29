"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProjectForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tech");
  const [ownerName, setOwnerName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    if (
      !title.trim() ||
      !shortDescription.trim() ||
      !description.trim() ||
      !category.trim() ||
      !ownerName.trim() ||
      !targetAmount.trim() ||
      !deadline.trim()
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

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

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        data?: { redirectTo: string };
      };

      if (response.status === 401) {
        setErrorMessage("You must be logged in to create a project.");
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      router.push(result.data?.redirectTo ?? "/explore");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border bg-white p-6 shadow-sm"
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
          placeholder="Ex: 3D printed prototype for robotics demo"
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
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
          placeholder="A short one-line summary of your project"
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
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
          placeholder="Explain your project, why it matters, and what the funding will support."
          rows={6}
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
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
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
          >
            <option>Tech</option>
            <option>Association</option>
            <option>Art</option>
            <option>Event</option>
            <option>Social</option>
            <option>Education</option>
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
            placeholder="Ex: Anaelle"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="goal" className="text-sm font-medium">
            Funding goal
          </label>
          <input
            id="goal"
            type="number"
            min="1"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="150"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
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
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="imageFile" className="text-sm font-medium">
          Project image
        </label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border px-4 py-3 outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm"
        />
        <p className="text-sm text-gray-500">
          Upload an image for your project.
        </p>
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          disabled
          className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save draft soon
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Publishing..." : "Publish project"}
        </button>
      </div>
    </form>
  );
}
