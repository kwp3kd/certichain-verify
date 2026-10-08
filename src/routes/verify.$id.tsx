import { createFileRoute } from "@tanstack/react-router";
import { VerifyShell } from "./verify.index";

export const Route = createFileRoute("/verify/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Verifikasi ${params.id} — Sahabat` },
      { name: "description", content: `Hasil pemeriksaan keaslian sertifikat ${params.id}.` },
      { property: "og:title", content: `Verifikasi sertifikat ${params.id}` },
      { property: "og:description", content: "Hasil pemeriksaan keaslian sertifikat kegiatan kampus." },
    ],
  }),
  component: VerifyById,
});

function VerifyById() {
  const { id } = Route.useParams();
  return <VerifyShell code={id} />;
}
