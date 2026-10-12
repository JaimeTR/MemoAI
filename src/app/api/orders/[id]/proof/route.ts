import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { db } from "@/lib/db";
import { syncOrderToErp } from "@/lib/erp";

const BUCKET = "payment-proofs";

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return;
  await supabaseAdmin.storage.createBucket(BUCKET, { public: true });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    const order = await db.getOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    await ensureBucket();

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${id}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    const updated = await db.updateOrderPaymentProof(id, data.publicUrl);
    if (!updated) {
      return NextResponse.json({ error: "No se pudo guardar el comprobante" }, { status: 500 });
    }

    syncOrderToErp(updated);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("POST /api/orders/[id]/proof failed:", error);
    return NextResponse.json({ error: "Error subiendo el comprobante" }, { status: 500 });
  }
}
