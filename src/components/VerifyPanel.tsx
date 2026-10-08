import { useEffect, useState, type FormEvent } from "react";
import { QrCode, Loader2, FileUp } from "lucide-react";
import { Button, Input } from "./kit";
import { NotFoundResult, VerificationResult } from "./VerificationResult";
import { actions, getCertificate, useHydrated } from "@/data/store";
import { hashFile } from "@/utils/blockchain";
import type { Certificate } from "@/types";

type Result = { kind: "found"; cert: Certificate; overrideHash?: string } | { kind: "missing"; code: string } | null;

export function VerifyPanel({ initialCode = "", onNavigate }: { initialCode?: string; onNavigate?: (code: string) => void }) {
  const hydrated = useHydrated();
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showQrHelp, setShowQrHelp] = useState(false);

  const run = async (c: string, f: File | null) => {
    const v = c.trim().toUpperCase();
    if (!v) return setError("Masukkan kode sertifikat terlebih dahulu.");
    if (!/^[A-Z0-9-]{4,30}$/.test(v)) return setError("Kode hanya berisi huruf, angka, dan tanda hubung. Contoh: SRT-2026-0001");
    setError("");
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));
    const cert = getCertificate(v);
    if (!cert) {
      setResult({ kind: "missing", code: v });
    } else {
      const overrideHash = f ? await hashFile(f) : undefined;
      const ok = (overrideHash ?? cert.fileHash) === cert.blockchainHash;
      actions.logVerify(cert.id, ok);
      setResult({ kind: "found", cert, overrideHash });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialCode && hydrated) run(initialCode, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, hydrated]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (onNavigate && !file) return onNavigate(code.trim().toUpperCase());
    run(code, file);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} noValidate className="glass-card p-5 sm:p-6">
        <label htmlFor="cert-code" className="block text-sm font-medium">Kode sertifikat</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            id="cert-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Contoh: SRT-2026-0001"
            aria-invalid={!!error}
            aria-describedby={error ? "cert-err" : undefined}
            className="h-12 font-mono text-base uppercase"
            autoComplete="off"
          />
          <Button type="submit" size="lg" disabled={loading} className="sm:w-40">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Memeriksa…</> : "Verifikasi"}
          </Button>
        </div>
        {error && <p id="cert-err" role="alert" className="mt-2 text-sm font-medium text-warn">{error}</p>}

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            <FileUp className="mr-1 inline size-4" aria-hidden /> Opsional: cocokkan juga dengan file PDF yang Anda terima
          </summary>
          <div className="mt-3 space-y-1">
            <label htmlFor="verify-file" className="sr-only">File sertifikat PDF</label>
            <input id="verify-file" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:font-medium file:text-accent-foreground" />
            <p className="text-xs text-muted-foreground">File hanya diproses di perangkat Anda untuk dihitung sidik jarinya — tidak diunggah ke mana pun.</p>
          </div>
        </details>

        <button type="button" onClick={() => setShowQrHelp((s) => !s)} className="mt-4 flex items-center gap-2 text-sm text-primary hover:underline">
          <QrCode className="size-4" aria-hidden /> Belum punya kode? Scan QR Code pada sertifikat.
        </button>
        {showQrHelp && (
          <p className="mt-2 rounded-xl bg-accent p-3 text-sm text-accent-foreground">
            Arahkan kamera ponsel ke QR Code yang tercetak di sertifikat. Halaman hasil verifikasi akan langsung terbuka otomatis.
          </p>
        )}
      </form>

      {loading && (
        <div className="glass-card flex items-center gap-3 p-6 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-5 animate-spin text-primary" /> Mencocokkan sidik jari sertifikat dengan catatan…
        </div>
      )}
      {result?.kind === "found" && <VerificationResult cert={result.cert} overrideHash={result.overrideHash} />}
      {result?.kind === "missing" && <NotFoundResult code={result.code} />}
    </div>
  );
}
