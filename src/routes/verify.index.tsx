import { createFileRoute } from "@tanstack/react-router";
import { VerifyShell } from "@/components/VerifyShell";

export const Route = createFileRoute("/verify/")({
  head: () => ({
    meta: [
      { title: "Verifikasi Keaslian Sertifikat — Sahabat" },
      { name: "description", content: "Masukkan kode sertifikat atau scan QR Code untuk memeriksa keaslian sertifikat kegiatan kampus." },
      { property: "og:title", content: "Verifikasi Keaslian Sertifikat — Sahabat" },
      { property: "og:description", content: "Masukkan kode sertifikat atau scan QR Code untuk memeriksa keaslian sertifikat." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  return <VerifyShell />;
}
