import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectDetailsPageData } from "@/features/projects/queries";
import EditProjectForm from "@/components/projects/edit-project-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { project } = await getProjectDetailsPageData(id);

  if (!project) {
    notFound();
  }

  if (project.owner_id !== user.id) {
    redirect(`/projects/${id}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-bold">Edit project</h1>
        <p className="text-muted-foreground">
          Update your project details. Changes go live immediately.
        </p>
      </div>

      <EditProjectForm project={project} />
    </main>
  );
}
