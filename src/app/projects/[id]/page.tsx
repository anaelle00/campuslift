import Image from "next/image";
import { notFound } from "next/navigation";
import { mockProjects } from "@/lib/mock-data";
import ProjectProgress from "@/components/projects/project-progress";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-3">
        <span className="inline-block text-sm bg-gray-100 px-3 py-1 rounded-full">
          {project.category}
        </span>

        <h1 className="text-3xl font-bold">{project.title}</h1>

        <p className="text-gray-600">{project.description}</p>

        <div className="text-sm text-gray-500">
          By {project.ownerName} · Deadline: {project.deadline}
        </div>
      </div>

      <div className="border rounded-2xl p-5 space-y-4 bg-white">
        <h2 className="text-xl font-semibold">Funding Progress</h2>

        <ProjectProgress
          current={project.currentAmount}
          target={project.targetAmount}
        />

        <p className="text-sm text-gray-500">
          {project.supportersCount} supporters
        </p>

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Enter amount"
            className="border rounded-lg px-3 py-2 w-40"
          />
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
            Support this project
          </button>
        </div>
      </div>
    </main>
  );
}