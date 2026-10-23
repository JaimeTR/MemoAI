import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Schibsted_Grotesk, Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.SITE_URL ?? "https://devmarkpe.store";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DevmarkPE Store — Tecnología con IA en Perú",
    template: "%s | DevmarkPE Store",
  },
  description:
    "La tienda de tecnología con inteligencia artificial de DEVMARK: grabadoras, lentes, audífonos y gadgets con IA. Envío gratis a todo el Perú, pago con Yape o Plin y contraentrega.",
  keywords: ["tienda de tecnología", "gadgets con IA", "grabadora con IA", "lentes inteligentes", "audífonos con IA", "Perú", "DEVMARK", "MemoAI"],
  openGraph: {
    title: "DevmarkPE Store — Tecnología con IA en Perú",
    description: "Gadgets con inteligencia artificial elegidos por DEVMARK. Envío gratis a todo el Perú.",
    type: "website",
    locale: "es_PE",
    siteName: "DevmarkPE Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevmarkPE Store — Tecnología con IA en Perú",
    description: "Gadgets con inteligencia artificial elegidos por DEVMARK.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${sora.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${schibsted.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
