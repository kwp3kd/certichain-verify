import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import type { Certificate } from "@/types";
import { ChainBadge, EmptyState, SearchInput, Select, StatusBadge } from "./kit";
import { formatDate } from "@/utils/blockchain";
import { ACTIVITY_TYPES } from "@/data/mock";

const PAGE = 8;

export function CertificateTable({ certificates, detailBase }: { certificates: Certificate[]; detailBase: "admin" | "mahasiswa" }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return certificates.filter(
      (c) =>
        (status === "ALL" || c.verificationStatus === status) &&
        (type === "ALL" || c.activityType === type) &&
        (!s || [c.id, c.studentName, c.activityName, c.studentNim].some((v) => v.toLowerCase().includes(s))),
    );
  }, [certificates, q, status, type]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cur = Math.min(page, pages);
  const rows = filtered.slice((cur - 1) * PAGE, cur * PAGE);
  const detailTo = detailBase === "admin" ? "/admin/sertifikat/$id" : "/mahasiswa/sertifikat/$id";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Cari ID, nama, NIM, atau kegiatan…" />
        <div>
          <label htmlFor="f-status" className="sr-only">Filter status</label>
          <Select id="f-status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="ALL">Semua status</option>
            <option value="VALID">Valid</option>
            <option value="INVALID">Tidak sesuai</option>
          </Select>
        </div>
        <div>
          <label htmlFor="f-type" className="sr-only">Filter jenis kegiatan</label>
          <Select id="f-type" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="ALL">Semua jenis</option>
            {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Tidak ada sertifikat" text="Tidak ada sertifikat yang cocok dengan pencarian atau filter Anda. Coba ubah kata kunci." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="glass-card hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {["No", "ID Sertifikat", "Nama Penerima", "Kegiatan", "Jenis", "Terbit", "Status", "Blockchain", "Aksi"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((c, i) => (
                  <tr key={c.id} className="hover:bg-glass">
                    <td className="px-4 py-3 text-muted-foreground">{(cur - 1) * PAGE + i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">{c.id}</td>
                    <td className="px-4 py-3 font-medium">{c.studentName}</td>
                    <td className="max-w-[220px] truncate px-4 py-3" title={c.activityName}>{c.activityName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.activityType}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(c.issuedAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.verificationStatus} /></td>
                    <td className="px-4 py-3"><ChainBadge status={c.blockchainStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link to={detailTo} params={{ id: c.id }} title="Lihat detail" aria-label={`Detail ${c.id}`} className="grid size-9 place-items-center rounded-lg hover:bg-muted"><Eye className="size-4" /></Link>
                        <Link to="/verify/$id" params={{ id: c.id }} title="Verifikasi" aria-label={`Verifikasi ${c.id}`} className="grid size-9 place-items-center rounded-lg text-verify hover:bg-verify/10"><ShieldCheck className="size-4" /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {rows.map((c) => (
              <li key={c.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs text-primary">{c.id}</span>
                  <StatusBadge status={c.verificationStatus} />
                </div>
                <p className="mt-2 font-medium">{c.studentName}</p>
                <p className="text-sm text-muted-foreground">{c.activityName}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(c.issuedAt)}</span>
                  <ChainBadge status={c.blockchainStatus} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link to={detailTo} params={{ id: c.id }} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-glass text-sm font-medium ring-1 ring-border"><Eye className="size-4" /> Detail</Link>
                  <Link to="/verify/$id" params={{ id: c.id }} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-accent-foreground"><ShieldCheck className="size-4" /> Verifikasi</Link>
                </div>
              </li>
            ))}
          </ul>
          <nav className="flex items-center justify-between text-sm" aria-label="Halaman">
            <p className="text-muted-foreground">{filtered.length} sertifikat · halaman {cur} dari {pages}</p>
            <div className="flex gap-2">
              <button disabled={cur <= 1} onClick={() => setPage(cur - 1)} aria-label="Sebelumnya" className="grid size-10 place-items-center rounded-xl bg-glass ring-1 ring-border disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              <button disabled={cur >= pages} onClick={() => setPage(cur + 1)} aria-label="Berikutnya" className="grid size-10 place-items-center rounded-xl bg-glass ring-1 ring-border disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
