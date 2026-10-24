import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/kit";
import { useStore } from "@/data/store";
import { UNIVERSITY } from "@/data/mock";

export const Route = createFileRoute("/mahasiswa/profil")({ component: Page });

function Page() {
  const s = useStore((st) => st.session);
  return (
    <div className="mx-auto max-w-2xl animate-rise">
      <PageHeader title="Profil" />
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 font-display text-2xl font-bold text-primary">{s?.name?.[0] ?? "?"}</span>
          <div><p className="font-display text-2xl font-semibold">{s?.name}</p><p className="text-sm text-muted-foreground">Mahasiswa</p></div>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {[["NIM", s?.nim || "—"], ["Email", s?.email], ["Universitas", UNIVERSITY]].map(([k, v]) => (
            <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="text-sm font-medium">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-6 rounded-xl bg-accent p-3 text-xs text-accent-foreground">Data profil ini tidak pernah dicatat ke blockchain.</p>
      </div>
    </div>
  );
}
