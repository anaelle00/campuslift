function requireEnv(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) throw new Error(`Missing ${name} environment variable.`);
  return trimmed;
}

// Server-side helpers — safe to use dynamic access (Node.js process.env).
// Do NOT use these in client-imported modules.
export function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name} environment variable.`);
  return value;
}

export function getOptionalEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

function validateUrl(value: string, name: string): string {
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error(`Invalid ${name} environment variable.`);
  }
}

// NEXT_PUBLIC_* must be accessed via static literals so Next.js can inline
// them into the client bundle. Dynamic access (process.env[name]) does not work.
export const publicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: validateUrl(
    requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    "NEXT_PUBLIC_SUPABASE_URL",
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: requireEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ),
  NEXT_PUBLIC_APP_URL: (() => {
    const value = process.env.NEXT_PUBLIC_APP_URL?.trim() || null;
    return value ? validateUrl(value, "NEXT_PUBLIC_APP_URL") : null;
  })(),
};
