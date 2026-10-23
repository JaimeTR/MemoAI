"use client";

import { createContext, useContext, type ReactNode } from "react";
import { PRODUCT } from "@/lib/constants";

export type PrecioMemoAI = { currency: string; salePrice: number; originalPrice: number };

const Contexto = createContext<PrecioMemoAI>({ currency: PRODUCT.currency, salePrice: PRODUCT.salePrice, originalPrice: PRODUCT.originalPrice });

/** El precio de la landing sale del catalogo (ERP); sin el, el de constants. */
export function PrecioProvider({ precio, children }: { precio: PrecioMemoAI; children: ReactNode }) {
  return <Contexto.Provider value={precio}>{children}</Contexto.Provider>;
}

export const usePrecio = () => useContext(Contexto);
