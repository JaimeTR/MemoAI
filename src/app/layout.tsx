import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEMOAI — Grabadora Inteligente con IA | Transcribe y Resume Automáticamente",
  description:
    "MemoAI es tu asistente inteligente para reuniones, clases y entrevistas. Graba, transcribe y resume automáticamente con Inteligencia Artificial. Deja de tomar apuntes y concéntrate en lo que realmente importa.",
  keywords: [
    "grabadora inteligente",
    "inteligencia artificial",
    "transcripción automática",
    "resumen con IA",
    "notas automáticas",
    "grabadora reuniones",
    "grabadora clases",
    "productividad",
    "MemoAI",
  ],
  openGraph: {
    title: "MEMOAI — Grabadora Inteligente con IA",
    description:
      "Graba, transcribe y resume automáticamente con Inteligencia Artificial. Tu asistente para reuniones, clases y entrevistas.",
    type: "website",
    locale: "es_PE",
    siteName: "MemoAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "MEMOAI — Grabadora Inteligente con IA",
    description:
      "Graba, transcribe y resume automáticamente con Inteligencia Artificial.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
