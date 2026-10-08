import { Link } from "@tanstack/react-router";

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-lg" aria-label="Sahabat — beranda">
      <span className="grid size-8 place-items-center rounded-[10px] bg-primary/10">
        <span className="font-display text-base font-bold text-primary">S</span>
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg tracking-tight">Sahabat</span>
        <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Sertifikat Terverifikasi</span>
      </span>
    </Link>
  );
}
