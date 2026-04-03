import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/project";
import ProjectProgress from "./project-progress";
import FavoriteButton from "./favorite-button";
import ProjectStatusButton from "./project-status-button";

type Props = {
  project: Project;
  isFavorite?: boolean;
  isLoggedIn?: boolean;
  showStatusControl?: boolean;
};

const categoryStyles: Record<string, string> = {
  Tech: "bg-blue-50 text-blue-700 border-blue-100",
  Association: "bg-violet-50 text-violet-700 border-violet-100",
  Art: "bg-pink-50 text-pink-700 border-pink-100",
  Event: "bg-amber-50 text-amber-700 border-amber-100",
  Social: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Education: "bg-indigo-50 text-indigo-700 border-indigo-100",
};

export default function ProjectCard({
  project,
  isFavorite = false,
  isLoggedIn = false,
  showStatusControl = false,
}: Props) {
  const badgeStyle = categoryStyles[project.category] ?? "bg-muted text-muted-foreground border-border";

  return (
    <div className="group overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_oklch(0.52_0.22_285_/_0.10)]">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="absolute right-3 top-3">
          <FavoriteButton
            projectId={project.id}
            initialIsFavorite={isFavorite}
            isLoggedIn={isLoggedIn}
          />
        </div>

        <span className={`absolute left-3 top-3 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeStyle}`}>
          {project.category}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <Link href={`/projects/${project.id}`}>
            <h3 className="font-display text-base font-semibold leading-snug transition-colors hover:text-primary">
              {project.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            by{" "}
            <Link
              href={`/users/${project.owner_username}`}
              className="font-medium hover:text-primary hover:underline"
            >
              {project.owner_name}
            </Link>
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {project.short_description}
        </p>

        <ProjectProgress
          current={project.current_amount}
          target={project.target_amount}
        />

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{project.supporters_count} supporters</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{project.comments_count ?? 0} comments</span>
        </div>

        {showStatusControl && (
          <div className="border-t pt-3">
            <ProjectStatusButton
              projectId={project.id}
              currentStatus={project.status}
            />
          </div>
        )}
      </div>
    </div>
  );
}
