import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/project";
import ProjectProgress from "./project-progress";
import FavoriteButton from "./favorite-button";
import { MessageSquare, Users } from "lucide-react";

type Props = {
  project: Project;
  isFavorite?: boolean;
  isLoggedIn?: boolean;
};

const categoryStyles: Record<string, { bg: string; text: string }> = {
  Tech:        { bg: "bg-blue-500/10",    text: "text-blue-600" },
  Association: { bg: "bg-indigo-500/10",  text: "text-indigo-600" },
  Art:         { bg: "bg-pink-500/10",    text: "text-pink-600" },
  Event:       { bg: "bg-amber-500/10",   text: "text-amber-600" },
  Social:      { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  Education:   { bg: "bg-cyan-500/10",    text: "text-cyan-600" },
};

export default function ProjectCard({
  project,
  isFavorite = false,
  isLoggedIn = false,
}: Props) {
  const badge = categoryStyles[project.category] ?? { bg: "bg-muted", text: "text-muted-foreground" };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/8">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        <span className={`absolute left-3 top-3 rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${badge.bg} ${badge.text}`}>
          {project.category}
        </span>

        {/* Favorite */}
        <div className="absolute right-3 top-3">
          <FavoriteButton
            projectId={project.id}
            initialIsFavorite={isFavorite}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link href={`/projects/${project.id}`}>
            <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight transition-colors hover:text-primary">
              {project.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            by{" "}
            <Link
              href={`/users/${project.owner_username}`}
              className="font-medium transition-colors hover:text-primary hover:underline"
            >
              {project.owner_name}
            </Link>
          </p>
        </div>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.short_description}
        </p>

        <ProjectProgress
          current={project.current_amount}
          target={project.target_amount}
        />

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {project.supporters_count}
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {project.comments_count ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}
