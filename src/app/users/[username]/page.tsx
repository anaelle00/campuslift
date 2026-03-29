import Image from "next/image";
import ProjectGrid from "@/components/projects/project-grid";
import { getPublicProfilePageData } from "@/features/profiles/queries";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const { profile, projects } = await getPublicProfilePageData(username);

  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold">User not found</h1>
        <p className="mt-2 text-gray-600">
          No public profile matches @{username}.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <section className="flex items-start gap-6">
        <Image
          src={profile.avatar_url || "/avatar-placeholder.png"}
          alt="Profile avatar"
          width={96}
          height={96}
          className="h-24 w-24 rounded-full border object-cover"
        />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {profile.display_name || profile.username}
          </h1>

          <p className="text-gray-500">@{profile.username}</p>

          {profile.organization ? (
            <p className="text-gray-600">{profile.organization}</p>
          ) : null}

          {profile.bio ? (
            <p className="max-w-xl text-gray-700">{profile.bio}</p>
          ) : null}

          {profile.website ? (
            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {profile.website}
            </a>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Projects created</h2>
          <p className="text-gray-600">Initiatives started by this creator.</p>
        </div>

        <ProjectGrid projects={projects} />
      </section>
    </main>
  );
}
