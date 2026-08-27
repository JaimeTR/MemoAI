import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data } = await supabaseAdmin.from("profiles").select("name, email, phone").eq("id", user.id).maybeSingle();

  return NextResponse.json({
    profile: {
      name: data?.name || "",
      email: data?.email || user.email,
      phone: data?.phone || "",
    },
  });
}

export async function PUT(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ name: body.name, phone: body.phone })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
