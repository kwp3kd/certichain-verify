import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { CertificateDetail } from "@/components/CertificateDetail";
import { Button, Modal } from "@/components/kit";
import { actions, useStore } from "@/data/store";

export const Route = createFileRoute("/admin/sertifikat/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  const cert = useStore((s) => s.certificates.find((c) => c.id === id));
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="animate-rise">
      <CertificateDetail cert={cert} back="/admin/sertifikat" actions={<Button variant="ghost" onClick={() => setConfirm(true)}><Trash2 className="size-4" /> Hapus</Button>} />
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Hapus sertifikat?" footer={<>
        <Button variant="ghost" onClick={() => setConfirm(false)}>Batal</Button>
        <Button variant="danger" onClick={() => { actions.deleteCertificate(id); navigate({ to: "/admin/sertifikat" }); }}>Ya, hapus</Button>
      </>}>
        Sertifikat <span className="font-mono">{id}</span> akan dihapus dari daftar prototype ini. Tindakan ini tidak dapat dibatalkan.
      </Modal>
    </div>
  );
}
