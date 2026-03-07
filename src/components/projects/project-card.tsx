import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/project";
import ProjectProgress from "./project-progress";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="border rounded-xl overflow-hidden hover:shadow-md transition bg-white">
        
        <div className="relative h-40 w-full">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg">{project.title}</h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {project.shortDescription}
          </p>

          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {project.category}
          </span>

          <ProjectProgress
            current={project.currentAmount}
            target={project.targetAmount}
          />

          <div className="text-xs text-gray-500">
            {project.supportersCount} supporters
          </div>
        </div>

      </div>
    </Link>
  );
}