import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2 } from "lucide-react";
import { EmptyState, PageHeader, StatCard } from "@/components/kit";
import { CertificateCard } from "@/components/CertificateCard";
import { useMyCertificates } from "@/data/useMyCertificates";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/mahasiswa/")({ component: Page });

function Page() {
  const mine = useMyCertificates();
  const name = useStore((s) => s.session?.name);
  const sorted = [...mine].sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  return (
    <div className="animate-rise">
      <PageHeader title={`Halo, ${name?.split(" ")[0]}`} desc="Semua sertifikat kegiatan Anda ada di sini dan bisa diverifikasi siapa saja." />
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Jumlah sertifikat" value={mine.length} icon={<Award className="size-4" />} tone="primary" />
        <StatCard label="Sertifikat valid" value={mine.filter((c) => c.verificationStatus === "VALID").length} icon={<CheckCircle2 className="size-4" />} tone="verify" />
      </div>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Sertifikat terbaru</h2>
        <Link to="/mahasiswa/sertifikat" className="text-sm text-primary hover:underline">Lihat semua</Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.slice(0, 3).map((c) => <CertificateCard key={c.id} cert={c} />)}
      </div>
      {!mine.length && <EmptyState title="Belum ada sertifikat" text="Sertifikat akan muncul setelah panitia menerbitkannya untuk NIM Anda." />}
    </div>
  );
}
