import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  // catalogoEnErp: si el catalogo se gestiona en el ERP (el panel lo avisa). Sin secretos, solo el si o no.
  const catalogoEnErp = Boolean(process.env.ERP_API_URL && process.env.ERP_TIENDA_SECRET && process.env.ERP_EMPRESA_ID);
  return NextResponse.json({ settings: await db.getSettings(), catalogoEnErp });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const settings = await db.updateSettings(body);
  return NextResponse.json({ settings });
}
