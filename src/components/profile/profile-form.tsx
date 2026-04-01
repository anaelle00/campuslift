"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  display_name: string | null;
  username: string | null;
  organization: string | null;
  phone: string | null;
  website: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type Props = {
  user: { id: string; email?: string | null };
  profile: Profile | null;
};

export default function ProfileForm({ user, profile }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [organization, setOrganization] = useState(profile?.organization ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [website, setWebsite] = useState(profile?.website ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(avatarUrl || "");
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile, avatarUrl]);

  async function handleSave() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("username", username);
      formData.append("organization", organization);
      formData.append("phone", phone);
      formData.append("website", website);
      formData.append("bio", bio);
      formData.append("currentAvatarUrl", avatarUrl);

      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });
      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        data?: { avatarUrl: string | null };
      };

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Something went wrong.");
      }

      setAvatarUrl(result.data?.avatarUrl ?? avatarUrl);
      setAvatarFile(null);
      setSuccessMessage(result.message ?? "Profile updated successfully.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-8 rounded-3xl border bg-white p-6 shadow-sm">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-200">
          {avatarPreview ? (
            avatarPreview.startsWith("blob:") ? (
              // A local object URL cannot be optimized by Next/Image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={avatarPreview}
                alt="Profile avatar"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            )
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Profile photo</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2"
          />
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Display name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
          />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Organization</label>
          <input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Organization"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
          />
        </div>
      </section>

      <section className="space-y-2">
        <label className="text-sm font-medium">Website</label>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Website"
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
        />
      </section>

      <section className="space-y-2">
        <label className="text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell people a bit about yourself"
          rows={5}
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
        />
      </section>

      {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}

      {successMessage ? (
        <p className="text-sm text-emerald-600">{successMessage}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save profile"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-gray-100"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
