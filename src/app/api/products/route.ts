import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function stripDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code < 0x0300 || code > 0x036f;
    })
    .join("");
}

function slugify(text: string): string {
  return stripDiacritics(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const products = await db.getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();

    if (!body.name || typeof body.salePrice !== "number") {
      return NextResponse.json({ error: "Nombre y precio son obligatorios" }, { status: 400 });
    }

    const product = await db.addProduct({
      slug: (body.slug ? slugify(body.slug) : slugify(body.name)) || `producto-${Date.now()}`,
      name: body.name,
      tagline: body.tagline || undefined,
      description: body.description || undefined,
      salePrice: body.salePrice,
      originalPrice: typeof body.originalPrice === "number" ? body.originalPrice : undefined,
      currency: body.currency || "S/",
      images: Array.isArray(body.images) ? body.images : [],
      stock: typeof body.stock === "number" ? body.stock : null,
      active: body.active ?? true,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error creando producto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
