import { CheckCircle2, AlertTriangle, SearchX, Award } from "lucide-react";
import type { Certificate } from "@/types";
import { formatDate } from "@/utils/blockchain";
import { BlockchainInfo } from "./BlockchainInfo";
import { AIExplanation } from "./AIExplanation";
import { compareHashes } from "@/services/hash";

function CertificatePreview({ cert }: { cert: Certificate }) {
  return (
    <div className="glass-card overflow-hidden" aria-label="Pratinjau sertifikat">
      <div className="border-b border-border bg-primary/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Sertifikat Kegiatan
      </div>
      <div className="p-6 text-center sm:p-8">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Award className="size-6" aria-hidden /></span>
        <p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">Diberikan kepada</p>
        <p className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">{cert.studentName}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">NIM {cert.studentNim}</p>
        <p className="mt-4 text-sm text-muted-foreground">Atas partisipasinya dalam kegiatan</p>
        <p className="mt-1 font-display text-lg font-semibold">{cert.activityName}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {cert.activityType} · {cert.organizer} · {formatDate(cert.eventDate)}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
          <span>ID <span className="font-mono text-primary">{cert.id}</span></span>
          <span>Diterbitkan {formatDate(cert.issuedAt)}</span>
        </div>
      </div>
    </div>
  );
}

export function HashCompare({ a, b, source = "chain" }: { a: string; b: string; source?: HashSource }) {
  const ok = compareHashes(a, b);
  return (
    <div className="glass-inset grid gap-2 p-4 font-mono text-xs" aria-label="Perbandingan sidik jari">
      <p className="text-muted-foreground">Hash Sertifikat → <span className="text-foreground">{a.slice(0, 20)}…</span></p>
      <p className="text-muted-foreground">{source === "chain" ? "Hash Blockchain" : "Hash tercatat (database)"} → <span className="text-foreground">{b ? `${b.slice(0, 20)}…` : "tidak ada"}</span></p>
      <p className={ok ? "font-semibold text-verify" : "font-semibold text-warn"}>{ok ? "= sama · ✓ VALID" : "≠ berbeda · ✕ Sertifikat tidak sesuai dengan catatan tersimpan."}</p>
    </div>
  );
}

export type HashSource = "chain" | "database";

export function VerificationResult({ cert, overrideHash, source = "database", notice }: { cert: Certificate; overrideHash?: string | undefined; source?: HashSource; notice?: string | undefined }) {
  const fileHash = overrideHash ?? cert.fileHash;
  // Keputusan HANYA dari perbandingan hash.
  const ok = compareHashes(fileHash, cert.blockchainHash);
  const shown = { ...cert, fileHash };
  return (
    <div className="space-y-4 animate-rise" aria-live="polite">
      <div className={`glass-card overflow-hidden ${ok ? "" : ""}`}>
        <div className={ok ? "bg-verify/10 p-6" : "bg-warn/10 p-6"}>
          <div className="flex items-start gap-4">
            <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${ok ? "bg-verify text-verify-foreground" : "bg-warn text-warn-foreground"}`}>
              {ok ? <CheckCircle2 className="size-7" aria-hidden /> : <AlertTriangle className="size-7" aria-hidden />}
            </span>
            <div className="min-w-0">
              <p className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${ok ? "text-verify" : "text-warn"}`}>
                {ok ? "✓ SERTIFIKAT TERVERIFIKASI" : "✕ SERTIFIKAT TIDAK SESUAI"}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {ok
                  ? "Sertifikat ini sesuai dengan data yang tercatat dan berhasil diverifikasi."
                  : "Data sertifikat tidak sesuai dengan catatan yang tersedia. Sertifikat perlu diperiksa kembali kepada pihak penerbit."}
              </p>
            </div>
          </div>
        </div>
        <dl className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
          {[
            ["ID Sertifikat", cert.id],
            ["Nama Penerima", cert.studentName],
            ["Kegiatan", cert.activityName],
            ["Jenis Kegiatan", cert.activityType],
            ["Penyelenggara", cert.organizer],
            ["Tanggal Penerbitan", formatDate(cert.issuedAt)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className={k === "ID Sertifikat" ? "font-mono text-sm text-primary" : "text-sm font-medium"}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      {notice && <p role="note" className="rounded-xl bg-warn/10 p-3 text-sm font-medium text-warn">{notice}</p>}
      {ok && <CertificatePreview cert={cert} />}
      <AIExplanation status={ok ? "VALID" : "INVALID"} activityName={cert.activityName} source={source} />
      <HashCompare a={fileHash} b={cert.blockchainHash} source={source} />
      <BlockchainInfo cert={shown} title="Detail verifikasi" />
    </div>
  );
}

export function NotFoundResult({ code }: { code: string }) {
  return (
    <div className="glass-card flex items-start gap-4 p-6 animate-rise" role="alert">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted"><SearchX className="size-6" aria-hidden /></span>
      <div>
        <p className="font-display text-2xl font-semibold">Kode tidak ditemukan</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Kami tidak menemukan sertifikat dengan kode <span className="font-mono text-foreground">{code}</span>. Periksa kembali penulisan kode (contoh: SRT-2026-0001) atau hubungi pihak penerbit.
        </p>
      </div>
    </div>
  );
}
