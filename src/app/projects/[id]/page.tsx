import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentsSection from "@/components/comments/comments-section";
import FavoriteButton from "@/components/projects/favorite-button";
import ProjectProgress from "@/components/projects/project-progress";
import SupportProjectForm from "@/components/projects/support-project-form";
import { getProjectCommentsPageData } from "@/features/comments/queries";
import { getProjectDetailsPageData } from "@/features/projects/queries";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ commentsPage?: string | string[] }>;
};

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
      <div className="relative h-72 w-full overflow-hidden rounded-2xl">
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover"
        />

        <div className="absolute right-4 top-4">
          <FavoriteButton
            projectId={project.id}
            initialIsFavorite={isFavorite}
            isLoggedIn={!!user}
          />
        </div>
      </div>

      <div className="space-y-3">
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm">
          {project.category}
        </span>

        <h1 className="text-3xl font-bold">{project.title}</h1>

        <p className="text-gray-600">{project.description}</p>

        <div className="text-sm text-gray-500">
          By{" "}
          <Link
            href={`/users/${project.owner_username}`}
            className="font-medium hover:underline"
          >
            {project.owner_name}
          </Link>{" "}
          | Deadline: {project.deadline}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Funding Progress</h2>

        <ProjectProgress
          current={project.current_amount}
          target={project.target_amount}
        />

        <p className="text-sm text-gray-500">
          {project.supporters_count} supporters | {commentsPageData.totalCount} comments
        </p>

        <SupportProjectForm projectId={project.id} isLoggedIn={!!user} />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Recent supporters</h3>

          {pledges.length ? (
            <ul className="space-y-1 text-sm text-gray-600">
              {pledges.map((pledge) => (
                <li key={pledge.created_at}>${pledge.amount} pledged</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No supporters yet.</p>
          )}
        </div>
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
