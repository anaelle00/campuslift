import AuthForm from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.82 0.10 285 / 0.14), transparent),
            radial-gradient(ellipse 60% 40% at 80% 80%, oklch(0.88 0.07 60 / 0.10), transparent)
          `,
        }}
      />

      <div className="mb-8 space-y-2 text-center">
        <h1 className="font-display text-3xl font-bold">Welcome to CampusLift</h1>
        <p className="text-muted-foreground">
          Log in or create an account to manage your student projects.
        </p>
      </div>

      <AuthForm />
    </main>
  );
}