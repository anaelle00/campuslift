import ProjectGrid from "@/components/projects/project-grid";
import { mockProjects } from "@/lib/mock-data";

export default function ExplorePage() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Explore Projects</h1>

      <p className="text-gray-600">
        Discover student initiatives and support the ideas you believe in.
      </p>

      <ProjectGrid projects={mockProjects} />
    </main>
  );
}