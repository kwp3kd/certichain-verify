import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/kit";
import { VerifyPanel } from "@/components/VerifyPanel";

export const Route = createFileRoute("/admin/verifikasi")({
  component: () => (
    <div className="mx-auto max-w-3xl animate-rise">
      <PageHeader title="Verifikasi Sertifikat" desc="Masukkan kode sertifikat untuk mencocokkan sidik jarinya dengan catatan blockchain." />
      <VerifyPanel />
    </div>
  ),
});
