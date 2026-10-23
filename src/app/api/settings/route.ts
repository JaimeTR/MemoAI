import { NextResponse } from "next/server";
import { obtenerAjustes } from "@/lib/ajustes";

/** Datos de pago y contacto para el checkout y el boton de WhatsApp. Se editan en el ERP (Ajustes de tienda). */
export async function GET() {
  return NextResponse.json({ settings: await obtenerAjustes() });
}
