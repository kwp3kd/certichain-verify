import { createFileRoute, Link } from "@tanstack/react-router";
import { FilePlus2 } from "lucide-react";
import { PageHeader, buttonClass } from "@/components/kit";
import { CertificateTable } from "@/components/CertificateTable";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/admin/sertifikat/")({ component: Page });

function Page() {
  const certs = useStore((s) => s.certificates);
  return (
    <div className="animate-rise">
      <PageHeader title="Daftar Sertifikat" desc="Kelola dan periksa semua sertifikat yang diterbitkan." action={<Link to="/admin/tambah" className={buttonClass()}><FilePlus2 className="size-4" /> Tambah</Link>} />
      <CertificateTable certificates={certs} detailBase="admin" />
    </div>
  );
}
