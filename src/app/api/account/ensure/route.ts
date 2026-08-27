import { NextRequest, NextResponse } from "next/server";
import { ensureCustomerAccount } from "@/lib/account";

// Called right after an order is placed. Finds or silently creates a customer account for the
// given email (no password — the customer logs in later via magic link), so the order can be
// linked to it for the "Mi cuenta" order history / tracking.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body.email || "";

  if (!email.trim()) {
    return NextResponse.json({ error: "Email requerido" }, { status: 400 });
  }

  const customerId = await ensureCustomerAccount(email, body.name || "", body.phone || "");

  if (!customerId) {
    return NextResponse.json({ error: "No se pudo crear la cuenta" }, { status: 500 });
  }

  return NextResponse.json({ customerId });
}
