export default function CreatePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Start a project</h1>
        <p className="text-gray-600">
          Share your idea, explain your goal, and invite the campus community to
          support it.
        </p>
      </div>

      <form className="space-y-6 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Project title
          </label>
          <input
            id="title"
            type="text"
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
            <label htmlFor="goal" className="text-sm font-medium">
              Funding goal
            </label>
            <input
              id="goal"
              type="number"
              placeholder="150"
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Project image
            </label>
            <input
              id="image"
              type="file"
              className="w-full rounded-xl border px-4 py-3 outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-gray-100"
          >
            Save draft
          </button>
          <button
            type="submit"
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Publish project
          </button>
        </div>
      </form>
    </main>
  );
}