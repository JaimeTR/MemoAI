import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ settings: await db.getSettings() });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const settings = await db.updateSettings(body);
  return NextResponse.json({ settings });
}
