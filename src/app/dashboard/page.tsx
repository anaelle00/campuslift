import StatsCard from "@/components/dashboard/stats-card";
import ProjectGrid from "@/components/projects/project-grid";
import { mockProjects } from "@/lib/mock-data";

export default function DashboardPage() {
  const myProjects = mockProjects.slice(0, 2);
  const supportedProjects = mockProjects.slice(1, 3);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, Anaelle</h1>
        <p className="text-gray-600">
          Here’s an overview of your activity and the projects you care about.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Projects created"
          value="2"
          helper="1 active this week"
        />
        <StatsCard
          label="Total pledged"
          value="$24"
          helper="Across 3 student projects"
        />
        <StatsCard
          label="Supporters reached"
          value="30"
          helper="Across your published projects"
        />
        <StatsCard
          label="Saved projects"
          value="4"
          helper="Ideas you may want to support"
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">My projects</h2>
          <p className="text-gray-600">
            Track the initiatives you’ve created and their current progress.
          </p>
        </div>

        <ProjectGrid projects={myProjects} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Projects I supported</h2>
          <p className="text-gray-600">
            Keep an eye on the student ideas you’ve backed.
          </p>
        </div>

        <ProjectGrid projects={supportedProjects} />
      </section>
    </main>
  );
}