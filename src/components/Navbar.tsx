import { Link } from "@tanstack/react-router";
import { Brand } from "./Brand";
import { buttonClass } from "./kit";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-glass backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex" aria-label="Navigasi">
          <a href="/#alur" className="hover:text-foreground">Alur</a>
          <a href="/#manfaat" className="hover:text-foreground">Manfaat</a>
          <Link to="/verify" className="hover:text-foreground">Verifikasi</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className={buttonClass("ghost", "sm")}>Login</Link>
          <Link to="/verify" className={buttonClass("primary", "sm", "hidden sm:inline-flex")}>Verifikasi Sertifikat</Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div className="font-display text-lg tracking-tight">Sahabat</div>
        <p className="max-w-[52ch] text-sm text-muted-foreground">Prototype verifikasi sertifikat kampus. Data blockchain adalah simulasi — bukan transaksi jaringan sungguhan.</p>
        <div className="font-mono text-xs text-muted-foreground">© 2026 · Sahabat</div>
      </div>
    </footer>
  );
}
