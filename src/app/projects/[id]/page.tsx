import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentsSection from "@/components/comments/comments-section";
import DeleteProjectButton from "@/components/projects/delete-project-button";
import FavoriteButton from "@/components/projects/favorite-button";
import RealtimeFunding from "@/components/projects/realtime-funding";
import SupportProjectForm from "@/components/projects/support-project-form";
import { getProjectCommentsPageData } from "@/features/comments/queries";
import { getProjectDetailsPageData } from "@/features/projects/queries";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ commentsPage?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { project } = await getProjectDetailsPageData(id);

  if (!project) {
    return { title: "Project not found" };
  }

  const percentage = Math.min(
    Math.round((project.current_amount / project.target_amount) * 100),
    100,
  );

  return {
    title: project.title,
    description: `${project.short_description} — ${percentage}% funded · Goal: $${project.target_amount}`,
    openGraph: {
      title: project.title,
      description: `${project.short_description} — ${percentage}% funded · Goal: $${project.target_amount}`,
      images: [
        {
          url: project.image_url,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: `${project.short_description} — ${percentage}% funded`,
      images: [project.image_url],
    },
  };
}

function getSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const commentsPage = Number(getSearchParam(resolvedSearchParams.commentsPage) ?? "1");
  const { user, project, pledges, isFavorite } =
    await getProjectDetailsPageData(id);

  if (!project) {
    notFound();
  }

  const commentsPageData = await getProjectCommentsPageData(id, commentsPage);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="relative h-80 w-full overflow-hidden rounded-2xl">
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="absolute right-4 top-4">
          <FavoriteButton
            projectId={project.id}
            initialIsFavorite={isFavorite}
            isLoggedIn={!!user}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-sm font-medium text-primary">
            {project.category}
          </span>

          {user?.id === project.owner_id && (
            <div className="flex items-center gap-2">
              <Link
                href={`/projects/${project.id}/edit`}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
              >
                Edit project
              </Link>
              <DeleteProjectButton
                projectId={project.id}
                projectTitle={project.title}
              />
            </div>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold">{project.title}</h1>

        <p className="leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>By{" "}
            <Link
              href={`/users/${project.owner_username}`}
              className="font-medium text-foreground hover:text-primary hover:underline"
            >
              {project.owner_name}
            </Link>
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Deadline: {project.deadline}</span>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="font-display text-xl font-semibold">Funding Progress</h2>

        <RealtimeFunding
          projectId={project.id}
          initialAmount={project.current_amount}
          initialSupporters={project.supporters_count}
          targetAmount={project.target_amount}
        />

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{commentsPageData.totalCount} comments</span>
        </div>

        <SupportProjectForm projectId={project.id} isLoggedIn={!!user} />

        {pledges.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-display text-base font-semibold">Recent supporters</h3>
            <ul className="space-y-1.5">
              {pledges.map((pledge) => (
                <li key={pledge.created_at} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">${pledge.amount}</span> pledged
                </li>
              ))}
            </ul>
          </div>
        )}

        {pledges.length === 0 && (
          <p className="text-sm text-muted-foreground border-t pt-4">No supporters yet — be the first.</p>
        )}
      </div>

      <CommentsSection
        projectId={project.id}
        currentUserId={user?.id ?? null}
        isLoggedIn={!!user}
        commentsPageData={commentsPageData}
      />
    </main>
  );
}
