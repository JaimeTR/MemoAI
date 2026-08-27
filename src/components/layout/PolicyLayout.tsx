import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface PolicySection {
  heading: string;
  body: string[];
}

interface PolicyLayoutProps {
  title: string;
  updated: string;
  sections: PolicySection[];
}

export function PolicyLayout({ title, updated, sections }: PolicyLayoutProps) {
  return (
    <div className="noise-bg min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Logo size="sm" />
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-xs text-text-muted mb-10">Última actualización: {updated}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-base md:text-lg font-semibold mb-2">{section.heading}</h2>
              {section.body.map((p, i) => (
                <p key={i} className="text-sm text-text-muted leading-relaxed mb-2 last:mb-0">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
