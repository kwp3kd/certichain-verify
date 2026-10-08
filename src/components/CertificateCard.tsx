import { Link } from "@tanstack/react-router";
import { Award, ShieldCheck } from "lucide-react";
import type { Certificate } from "@/types";
import { StatusBadge } from "./kit";
import { formatDate } from "@/utils/blockchain";

export function CertificateCard({ cert }: { cert: Certificate }) {
  return (
    <article className="glass-card flex flex-col overflow-hidden">
      <div className="relative bg-primary/10 p-5">
        <Award className="absolute right-4 top-4 size-10 text-primary/30" aria-hidden />
        <p className="font-mono text-xs text-primary">{cert.id}</p>
        <h3 className="mt-2 pr-10 font-display text-xl font-semibold leading-snug">{cert.activityName}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{cert.organizer}</p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">{formatDate(cert.issuedAt)}</span>
          <StatusBadge status={cert.verificationStatus} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to="/mahasiswa/sertifikat/$id" params={{ id: cert.id }} className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">Detail</Link>
          <Link to="/verify/$id" params={{ id: cert.id }} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-glass text-sm font-medium ring-1 ring-border"><ShieldCheck className="size-4" /> Verifikasi</Link>
        </div>
      </div>
    </article>
  );
}
