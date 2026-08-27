"use client";

import { usePathname, useRouter } from "next/navigation";
import { Package, User, CreditCard, LogOut, LayoutGrid } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/cuenta", label: "Resumen", icon: LayoutGrid },
  { href: "/cuenta/pedidos", label: "Pedidos", icon: Package },
  { href: "/cuenta/perfil", label: "Perfil", icon: User },
  { href: "/cuenta/pagos", label: "Pagos", icon: CreditCard },
];

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/cuenta/login") return <>{children}</>;

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/cuenta/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/">
            <Logo size="sm" />
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <nav className="flex gap-1.5 mb-6 overflow-x-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? "bg-accent text-white" : "text-text-muted hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </a>
            );
          })}
        </nav>

        {children}
      </div>
    </div>
  );
}
