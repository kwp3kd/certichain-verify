import { useNavigate } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/Navbar";
import { VerifyPanel } from "@/components/VerifyPanel";

export function VerifyShell({ code }: { code?: string }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 text-center animate-rise">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Verifikasi Keaslian Sertifikat</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Masukkan kode sertifikat atau gunakan QR Code untuk memeriksa keaslian sertifikat.</p>
        </div>
        <VerifyPanel
          key={code ?? "new"}
          initialCode={code}
          onNavigate={(c) => (c ? navigate({ to: "/verify/$id", params: { id: c } }) : undefined)}
        />
        <p className="mt-8 text-center text-xs text-muted-foreground">Coba kode demo: <span className="font-mono">SRT-2026-0001</span> (valid) atau <span className="font-mono">SRT-2026-0003</span> (tidak sesuai).</p>
      </main>
      <Footer />
    </div>
  );
}

