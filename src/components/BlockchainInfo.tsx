import { useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import type { Certificate } from "@/types";
import { cn } from "@/lib/utils";

function Row({ label, value, help, mono = true }: { label: string; value: string; help?: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {help && <p className="text-xs text-muted-foreground">{help}</p>}
      </div>
      <div className="flex min-w-0 items-start gap-2">
        <p className={cn("min-w-0 flex-1 break-all text-sm text-muted-foreground", mono && "font-mono text-xs leading-relaxed")}>{value}</p>
        {mono && (
          <button
            type="button"
            title="Salin"
            aria-label={`Salin ${label}`}
            onClick={() => {
              navigator.clipboard?.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            {copied ? <Check className="size-3.5 text-verify" /> : <Copy className="size-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export function BlockchainInfo({ cert, defaultOpen = false, title = "Detail teknis blockchain" }: { cert: Certificate; defaultOpen?: boolean; title?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  const match = cert.fileHash === cert.blockchainHash;
  return (
    <div className="glass-inset">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-[0.875rem] px-4 py-3.5 text-left"
      >
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{title}</span>
          <span className="block text-sm text-muted-foreground">Untuk pengguna yang ingin melihat sidik jari digital & catatan pencatatan.</span>
        </span>
        <ChevronDown className={cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div className="divide-y divide-border border-t border-border px-4">
          <Row label="Certificate Hash" help="Sidik jari file sertifikat" value={cert.fileHash} />
          <Row label="Hash Blockchain" help="Sidik jari yang tercatat" value={cert.blockchainHash} />
          <Row label="Hasil pencocokan" mono={false} value={match ? "✓ Kedua sidik jari sama persis" : "✕ Sidik jari berbeda — isi sertifikat kemungkinan berubah"} />
          <Row label="Status Blockchain" mono={false} value={cert.blockchainStatus === "RECORDED" ? "Tercatat (simulasi)" : "Belum tercatat"} />
          <Row label="Transaction ID" value={cert.transactionId} />
          <Row label="Block Number" value={String(cert.blockNumber)} />
          <Row label="Timestamp" value={cert.timestamp} />
          <Row label="Wallet penerbit" value={cert.issuerWallet} />
          <p className="py-3 text-xs text-muted-foreground">Data di atas adalah simulasi untuk prototype dan bukan transaksi blockchain sungguhan.</p>
        </div>
      )}
    </div>
  );
}
