import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Customer } from "@/lib/db";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false });

  if (error || !profiles) {
    return NextResponse.json({ customers: [] });
  }

  const { data: orders } = await supabaseAdmin.from("orders").select("id, customer_id");
  const ordersByCustomer = new Map<string, string[]>();
  for (const o of orders || []) {
    if (!o.customer_id) continue;
    const list = ordersByCustomer.get(o.customer_id) || [];
    list.push(o.id);
    ordersByCustomer.set(o.customer_id, list);
  }

  const customers: Customer[] = profiles.map((p) => ({
    id: p.id,
    name: p.name || "",
    email: p.email,
    phone: p.phone || "",
    orders: ordersByCustomer.get(p.id) || [],
    createdAt: p.created_at,
  }));

  return NextResponse.json({ customers });
}
