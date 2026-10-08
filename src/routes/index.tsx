import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Fingerprint, Link2, QrCode, ShieldCheck, Lock, Clock, Building2, ArrowRight } from "lucide-react";
import { Navbar, Footer } from "@/components/Navbar";
import { SimNotice, buttonClass } from "@/components/kit";
import { QRCode } from "@/components/QRCode";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahabat — Verifikasi Sertifikat Kegiatan Kampus Berbasis Blockchain" },
      { name: "description", content: "Cek keaslian sertifikat kegiatan kampus dalam hitungan detik lewat kode atau QR Code. Sidik jari digital tercatat di blockchain (simulasi)." },
      { property: "og:title", content: "Sahabat — Verifikasi Sertifikat Kampus" },
      { property: "og:description", content: "Cek keaslian sertifikat kegiatan kampus lewat kode atau QR Code." },
    ],
  }),
  component: Landing,
});

const flow = [
  { icon: FileText, label: "Sertifikat", text: "Panitia membuat sertifikat PDF." },
  { icon: Fingerprint, label: "Hash", text: "Sistem membuat sidik jari digital file." },
  { icon: Link2, label: "Blockchain", text: "Sidik jari dicatat sebagai bukti.", hl: "primary" },
  { icon: QrCode, label: "QR Code", text: "QR dicetak pada sertifikat." },
  { icon: ShieldCheck, label: "Verifikasi", text: "Siapa pun bisa cek keasliannya.", hl: "verify" },
];

const benefits = [
  { icon: Clock, title: "Cek dalam hitungan detik", text: "HRD cukup scan QR atau ketik kode, tanpa perlu menghubungi kampus." },
  { icon: Lock, title: "Data pribadi tetap aman", text: "Blockchain hanya menyimpan sidik jari & ID — bukan nama, NIM, atau nilai." },
  { icon: ShieldCheck, title: "Sulit dipalsukan", text: "Perubahan sekecil apa pun pada file membuat sidik jarinya berbeda." },
  { icon: Building2, title: "Siap dikembangkan", text: "Dirancang agar mudah dihubungkan ke backend & blockchain sungguhan." },
];

function Landing() {
  const certs = useStore((s) => s.certificates);
  const valid = certs.filter((c) => c.verificationStatus === "VALID").length;
  const activities = new Set(certs.map((c) => c.activityName)).size;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
          <div className="animate-rise">
            <SimNotice />
            <h1 className="mt-5 text-balance font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Verifikasi Sertifikat Kegiatan Kampus Berbasis Blockchain
            </h1>
            <p className="mt-5 max-w-[46ch] text-pretty text-lg text-muted-foreground">
              Sertifikat PDF mudah diedit. Sahabat menyimpan sidik jari digital sertifikat di blockchain, sehingga keasliannya bisa dicek siapa pun dalam hitungan detik.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/verify" className={buttonClass("primary", "lg")}>Verifikasi Sertifikat</Link>
              <Link to="/login" className={buttonClass("ghost", "lg")}>Login</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <div><div className="font-display text-3xl font-semibold">{certs.length}</div><div className="text-sm text-muted-foreground">Sertifikat</div></div>
              <div><div className="font-display text-3xl font-semibold text-verify">{valid}</div><div className="text-sm text-muted-foreground">Terverifikasi</div></div>
              <div><div className="font-display text-3xl font-semibold">{activities}</div><div className="text-sm text-muted-foreground">Kegiatan</div></div>
            </div>
          </div>

          <div className="relative animate-rise [animation-delay:120ms]">
            <div className="absolute -right-4 -top-6 size-28 rounded-2xl bg-primary/10 blur-md" aria-hidden />
            <div className="glass-card relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Contoh hasil verifikasi</div>
                  <div className="mt-1 font-display text-xl font-semibold tracking-tight">SERTIFIKAT TERVERIFIKASI</div>
                </div>
                <span className="grid size-11 place-items-center rounded-xl bg-verify/10 text-xl text-verify" aria-hidden>✓</span>
              </div>
              <div className="glass-inset mt-5 grid grid-cols-[auto_1fr] items-center gap-4 p-4">
                <QRCode id="SRT-2026-0001" size={72} showUrl={false} />
                <div className="space-y-1 text-sm">
                  <div className="font-mono text-primary">SRT-2026-0001</div>
                  <div className="font-medium">Rani Kusuma</div>
                  <div className="text-muted-foreground">Seminar Keamanan Data Nasional — BEM</div>
                </div>
              </div>
              <div className="glass-inset mt-4 p-4">
                <div className="mb-2 text-xs font-semibold text-muted-foreground">DETAIL TEKNIS</div>
                <div className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                  Hash&nbsp;&nbsp;A8F91C72B4E91D3F…<br />TX&nbsp;&nbsp;&nbsp;0x7a91bc82d4f6…<br />Block&nbsp;18294531 · 2026-09-15 10:30
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-verify" aria-hidden />Hash sertifikat cocok dengan catatan blockchain.
              </div>
            </div>
          </div>
        </section>

        <section id="alur" className="border-y border-border bg-glass/50 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Alur sistem</h2>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {flow.map((f, i) => (
                <li key={f.label} className={`glass-inset relative p-4 ${f.hl === "primary" ? "bg-primary/10" : f.hl === "verify" ? "bg-verify/10" : ""}`}>
                  <div className="flex items-center gap-2">
                    <f.icon className={`size-4 ${f.hl === "verify" ? "text-verify" : "text-primary"}`} aria-hidden />
                    <span className="text-sm font-semibold">{i + 1}. {f.label}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
                  {i < flow.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-muted-foreground lg:block" aria-hidden />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="glass-card p-6">
            <h2 className="font-display text-2xl font-semibold">Masalahnya</h2>
            <p className="mt-2 max-w-[46ch] text-sm text-muted-foreground">Sertifikat PDF atau gambar mudah diedit. Verifikasi manual memakan waktu dan rawan salah.</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Nama penerima diubah", "Tanggal kegiatan diganti", "Sertifikat palsu beredar"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="font-semibold text-warn" aria-hidden>✕</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-6">
            <h2 className="font-display text-2xl font-semibold">Solusinya</h2>
            <p className="mt-2 max-w-[46ch] text-sm text-muted-foreground">Sidik jari (hash) setiap sertifikat dicatat ke blockchain. Saat diperiksa, sistem membandingkan keduanya. Sama berarti asli.</p>
            <div className="glass-inset mt-5 space-y-1 p-4 font-mono text-xs">
              <p className="text-muted-foreground">Hash Sertifikat → A8F91C72B4E91D…</p>
              <p className="text-muted-foreground">Hash Blockchain → A8F91C72B4E91D…</p>
              <p className="font-semibold text-verify">= sama · ✓ TERVERIFIKASI</p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Blockchain digunakan sebagai bukti pencatatan, bukan tempat menyimpan file atau data pribadi.</p>
          </div>
        </section>

        <section id="manfaat" className="border-t border-border bg-glass/50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Manfaat untuk semua pihak</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b) => (
                <div key={b.title} className="glass-card p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><b.icon className="size-5" aria-hidden /></span>
                  <p className="mt-4 font-semibold">{b.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link to="/verify" className={buttonClass("primary", "lg")}>Coba verifikasi sekarang <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
