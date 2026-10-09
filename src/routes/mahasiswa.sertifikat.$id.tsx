import { createFileRoute } from "@tanstack/react-router";
import { CertificateDetail } from "@/components/CertificateDetail";
import { useMyCertificates } from "@/data/useMyCertificates";

export const Route = createFileRoute("/mahasiswa/sertifikat/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  const cert = useMyCertificates().find((c) => c.id === id);
  return <div className="animate-rise"><CertificateDetail cert={cert} back="/mahasiswa/sertifikat" /></div>;
}
