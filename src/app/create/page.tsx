import CreateProjectForm from "@/components/projects/create-project-form";

export default function CreatePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-bold">Start a project</h1>
        <p className="text-muted-foreground">
          Share your idea, explain your goal, and invite the campus community to
          support it.
        </p>
      </div>

      <CreateProjectForm />
    </main>
  );
}