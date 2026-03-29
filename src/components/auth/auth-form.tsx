"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setIsSubmitting(true);

    if (!email.trim() || !password.trim()) {
      setIsSubmitting(false);
      setErrorMessage("Please enter your email and password.");
      return;
    }

    if (mode === "signup") {
      if (!username.trim() || !displayName.trim()) {
        setIsSubmitting(false);
        setErrorMessage("Please fill in at least your username and display name.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
            display_name: displayName.trim(),
            organization: organization.trim() || null,
            phone: phone.trim() || null,
            website: website.trim() || null,
            bio: bio.trim() || null,
          },
        },
      });

      setIsSubmitting(false);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (!data.user) {
        setErrorMessage("User account was not created.");
        return;
      }

      setInfoMessage("Account created successfully. You can now log in.");
      setMode("login");
      setPassword("");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold">
          {mode === "login" ? "Log in" : "Create an account"}
        </h2>
        <p className="text-gray-600">
          {mode === "login"
            ? "Access your projects and dashboard."
            : "Create your account and set up your public profile."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            placeholder="password123"
          />
        </div>

        {mode === "signup" ? (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                  placeholder="anaellemathe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium">
                  Display name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                  placeholder="Anaelle Mathe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="organization" className="text-sm font-medium">
                Organization / Company
              </label>
              <input
                id="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                placeholder="Optional"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">
                  Website
                </label>
                <input
                  id="website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Description / Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                placeholder="Tell people a little about yourself or your project."
              />
            </div>
          </>
        ) : null}

        {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}

        {infoMessage ? (
          <p className="text-sm text-emerald-600">{infoMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-gray-600">
        {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setErrorMessage("");
            setInfoMessage("");
          }}
          className="font-semibold text-black underline underline-offset-2"
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </div>
    </div>
  );
}
