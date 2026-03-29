import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/project";
import ProjectProgress from "./project-progress";
import FavoriteButton from "./favorite-button";

type Props = {
  project: Project;
  isFavorite?: boolean;
  isLoggedIn?: boolean;
};

export default function ProjectCard({
  project,
  isFavorite = false,
  isLoggedIn = false,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white transition hover:shadow-md">
      <div className="relative h-40 w-full">
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover"
        />

        <div className="absolute right-3 top-3">
          <FavoriteButton
            projectId={project.id}
            initialIsFavorite={isFavorite}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <Link href={`/projects/${project.id}`} className="block space-y-2">
          <h3 className="text-lg font-semibold hover:underline">
            {project.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500">
            by{" "}
            <Link
                href={`/users/${project.owner_username}`}
                className="font-medium hover:underline"
                >
                {project.owner_name}
            </Link>
        </p>        
    
        <p className="line-clamp-2 text-sm text-gray-600">
            {project.short_description}
        </p>

        <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs">
            {project.category}
        </span>
        
        <ProjectProgress
            current={project.current_amount}
            target={project.target_amount}
          />

        <div className="text-xs text-gray-500">
            {project.supporters_count} supporters | {project.comments_count ?? 0} comments
        </div>
      </div>
    </div>
  );
}
