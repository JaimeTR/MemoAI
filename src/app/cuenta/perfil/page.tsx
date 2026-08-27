"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PerfilPage() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile || { name: "", email: "", phone: "" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profile.name, phone: profile.phone }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-surface-light/60 border border-border text-foreground placeholder-text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Mi perfil</h1>
        <p className="text-sm text-text-muted">Tus datos de contacto.</p>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-6 max-w-md">
        {loading ? (
          <p className="text-sm text-text-muted">Cargando…</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" value={profile.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
            </div>
            <div>
              <label className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5 block">Nombre completo</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5 block">Teléfono</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                className={inputClass}
              />
            </div>
            <Button type="submit" disabled={saving} className="mt-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
              {saved ? "Guardado" : "Guardar cambios"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
