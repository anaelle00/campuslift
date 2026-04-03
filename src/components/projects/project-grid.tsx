import { Project } from "@/types/project";
import ProjectCard from "./project-card";

type Props = {
  projects: Project[];
  favoriteProjectIds?: string[];
  isLoggedIn?: boolean;
  showStatusControl?: boolean;
};

export default function ProjectGrid({
  projects,
  favoriteProjectIds = [],
  isLoggedIn = false,
  showStatusControl = false,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isLoggedIn={isLoggedIn}
          isFavorite={favoriteProjectIds.includes(project.id)}
          showStatusControl={showStatusControl}
        />
      ))}
    </div>
  );
}