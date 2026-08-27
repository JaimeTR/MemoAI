import { supabaseAdmin } from "@/lib/supabase/admin";

// Finds or silently creates a customer account (no password — customers log in via magic link)
// for the given email, and returns its id. Shared by the checkout order flow and the standalone
// /api/account/ensure route.
export async function ensureCustomerAccount(email: string, name: string, phone: string): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const existing = await supabaseAdmin.from("profiles").select("id").eq("email", normalizedEmail).maybeSingle();
  if (existing.data) return existing.data.id;

  const created = await supabaseAdmin.auth.admin.createUser({
    email: normalizedEmail,
    email_confirm: true,
    user_metadata: { name, phone },
  });

  let userId = created.data.user?.id;

  if (!userId) {
    const { data: list } = await supabaseAdmin.auth.admin.listUsers();
    userId = list?.users.find((u) => u.email?.toLowerCase() === normalizedEmail)?.id;
  }

  if (!userId) return null;

  await supabaseAdmin.from("profiles").upsert({ id: userId, email: normalizedEmail, name, phone }, { onConflict: "id" });
  return userId;
}
