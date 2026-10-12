import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json();

  const patch: Record<string, unknown> = {};
  if (body.slug !== undefined) patch.slug = body.slug;
  if (body.name !== undefined) patch.name = body.name;
  if (body.tagline !== undefined) patch.tagline = body.tagline;
  if (body.description !== undefined) patch.description = body.description;
  if (body.salePrice !== undefined) patch.salePrice = body.salePrice;
  if (body.originalPrice !== undefined) patch.originalPrice = body.originalPrice;
  if (body.currency !== undefined) patch.currency = body.currency;
  if (body.images !== undefined) patch.images = body.images;
  if (body.stock !== undefined) patch.stock = body.stock;
  if (body.active !== undefined) patch.active = body.active;

  const product = await db.updateProduct(id, patch);

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const deleted = await db.deleteProduct(id);

  if (!deleted) {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
