import AuthForm from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome to CampusLift</h1>
        <p className="text-gray-600">
          Log in or create an account to manage your student projects.
        </p>
      </div>

      <AuthForm />
    </main>
  );
}