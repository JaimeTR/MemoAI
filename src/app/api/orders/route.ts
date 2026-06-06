import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const orders = db.getOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const order = db.addOrder({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      address: body.address,
      city: body.city,
      department: body.department,
      product: "MemoAI - Grabadora Inteligente",
      amount: 299,
      status: "pending",
      paymentProvider: body.paymentProvider || "culqi",
    });

    const customer = db.addCustomer({
      name: body.customerName,
      email: body.customerEmail,
      phone: body.customerPhone,
    });

    db.linkOrderToCustomer(body.customerEmail, order.id);

    return NextResponse.json({ success: true, order, customer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
