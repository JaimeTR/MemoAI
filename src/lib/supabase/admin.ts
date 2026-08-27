import { createClient } from "@supabase/supabase-js";

// Server-only client using the service_role key — bypasses Row Level Security.
// Used by API routes (admin panel, checkout, account provisioning). Never import this from client components.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
