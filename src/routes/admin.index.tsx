import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, CheckCircle2, AlertTriangle, CalendarDays, FilePlus2 } from "lucide-react";
import { PageHeader, StatCard, buttonClass } from "@/components/kit";
import { ActivityList } from "@/components/ActivityList";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

const MONTHS = ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"];

function AdminHome() {
  const certs = useStore((s) => s.certificates);
  const acts = useStore((s) => s.activities);
  const valid = certs.filter((c) => c.verificationStatus === "VALID").length;
  const counts = MONTHS.map((_, i) => certs.filter((c) => new Date(c.issuedAt).getMonth() === 4 + i).length);
  const max = Math.max(1, ...counts);
  return (
    <div className="animate-rise">
      <PageHeader title="Dashboard" desc="Ringkasan penerbitan sertifikat kegiatan." action={<Link to="/admin/tambah" className={buttonClass()}><FilePlus2 className="size-4" /> Tambah Sertifikat</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total sertifikat" value={certs.length} icon={<FileText className="size-4" />} tone="primary" />
        <StatCard label="Sertifikat valid" value={valid} icon={<CheckCircle2 className="size-4" />} tone="verify" />
        <StatCard label="Tidak sesuai" value={certs.length - valid} hint="Perlu diperiksa" icon={<AlertTriangle className="size-4" />} tone="warn" />
        <StatCard label="Total kegiatan" value={new Set(certs.map((c) => c.activityName)).size} icon={<CalendarDays className="size-4" />} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="glass-card p-6">
          <h2 className="font-semibold">Sertifikat per bulan (2026)</h2>
          <div className="mt-6 flex h-48 items-end gap-3" role="img" aria-label={MONTHS.map((m, i) => `${m}: ${counts[i]}`).join(", ")}>
            {counts.map((n, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-medium">{n}</span>
                <div className="w-full rounded-t-lg bg-primary/80" style={{ height: `${(n / max) * 100}%`, minHeight: 4 }} />
                <span className="text-xs text-muted-foreground">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Aktivitas terbaru</h2>
            <Link to="/admin/aktivitas" className="text-sm text-primary hover:underline">Lihat semua</Link>
          </div>
          <ActivityList items={acts.slice(0, 5)} />
        </section>
      </div>
    </div>
  );
}
