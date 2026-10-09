import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/kit";
import { VerifyPanel } from "@/components/VerifyPanel";

export const Route = createFileRoute("/mahasiswa/verifikasi")({
  component: () => (
    <div className="mx-auto max-w-3xl animate-rise">
      <PageHeader title="Verifikasi Sertifikat" desc="Periksa keaslian sertifikat Anda atau milik orang lain dengan kode sertifikat." />
      <VerifyPanel />
    </div>
  ),
});
