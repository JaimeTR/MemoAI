import { createBrowserClient } from "@supabase/ssr";

// Browser client using the public anon key — respects Row Level Security.
// Used from client components for auth (magic link sign-in) and reading the signed-in customer's own data.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
