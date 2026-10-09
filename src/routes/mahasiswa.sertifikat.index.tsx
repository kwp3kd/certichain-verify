import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, PageHeader } from "@/components/kit";
import { CertificateCard } from "@/components/CertificateCard";
import { useMyCertificates } from "@/data/useMyCertificates";

export const Route = createFileRoute("/mahasiswa/sertifikat/")({ component: Page });

function Page() {
  const mine = useMyCertificates();
  return (
    <div className="animate-rise">
      <PageHeader title="Sertifikat Saya" desc="Buka detail untuk melihat QR Code dan status verifikasi." />
      {mine.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mine.map((c) => <CertificateCard key={c.id} cert={c} />)}</div>
      ) : (
        <EmptyState title="Belum ada sertifikat" text="Sertifikat akan muncul setelah panitia menerbitkannya." />
      )}
    </div>
  );
}
