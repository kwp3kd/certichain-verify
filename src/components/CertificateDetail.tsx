import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { Certificate } from "@/types";
import { BlockchainInfo } from "./BlockchainInfo";
import { QRCode } from "./QRCode";
import { ChainBadge, EmptyState, StatusBadge, buttonClass } from "./kit";
import { formatDate } from "@/utils/blockchain";
import type { ReactNode } from "react";

export function CertificateDetail({ cert, back, actions }: { cert?: Certificate; back: "/admin/sertifikat" | "/mahasiswa/sertifikat"; actions?: ReactNode }) {
  if (!cert)
    return <EmptyState title="Sertifikat tidak ditemukan" text="Sertifikat mungkin sudah dihapus atau kodenya salah." action={<Link to={back} className={buttonClass("ghost")}>Kembali ke daftar</Link>} />;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={back} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Kembali</Link>
        <div className="flex flex-wrap gap-2">
          {actions}
          <Link to="/verify/$id" params={{ id: cert.id }} className={buttonClass("primary")}><ShieldCheck className="size-4" /> Verifikasi</Link>
        </div>
      </div>
      <div>
        <p className="font-mono text-sm text-primary">{cert.id}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{cert.activityName}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <section className="glass-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Informasi sertifikat</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                ["ID Sertifikat", cert.id],
                ["Nama Penerima", cert.studentName],
                ["NIM", cert.studentNim],
                ["Nama Kegiatan", cert.activityName],
                ["Jenis Kegiatan", cert.activityType],
                ["Penyelenggara", cert.organizer],
                ["Tanggal Kegiatan", formatDate(cert.eventDate)],
                ["Tanggal Penerbitan", formatDate(cert.issuedAt)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="glass-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Informasi verifikasi</h2>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <StatusBadge status={cert.verificationStatus} size="lg" />
              <ChainBadge status={cert.blockchainStatus} />
              <span className="text-xs text-muted-foreground">Dicatat {cert.timestamp}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {cert.verificationStatus === "VALID"
                ? "Sidik jari file sertifikat sama dengan yang tercatat. Sertifikat ini asli."
                : "Sertifikat tidak sesuai dengan catatan yang tersimpan. Perlu diperiksa kembali oleh penerbit."}
            </p>
            <div className="mt-4"><BlockchainInfo cert={cert} /></div>
          </section>
        </div>
        <aside className="glass-card h-fit p-6 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">QR Code verifikasi</h2>
          <div className="mt-4 flex justify-center"><QRCode id={cert.id} /></div>
          <p className="mt-3 text-xs text-muted-foreground">Scan untuk membuka halaman hasil verifikasi sertifikat ini.</p>
        </aside>
      </div>
    </div>
  );
}
