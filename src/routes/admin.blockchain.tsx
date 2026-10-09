import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { Button, ChainBadge, Modal, PageHeader, SearchInput } from "@/components/kit";
import { BlockchainInfo } from "@/components/BlockchainInfo";
import { useStore } from "@/data/store";
import { short } from "@/utils/blockchain";
import type { Certificate } from "@/types";

export const Route = createFileRoute("/admin/blockchain")({ component: Page });

function Page() {
  const certs = useStore((s) => s.certificates);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Certificate | null>(null);
  const rows = certs.filter((c) => c.id.toLowerCase().includes(q.toLowerCase()) || c.transactionId.includes(q.toLowerCase()));
  return (
    <div className="animate-rise">
      <PageHeader title="Riwayat Pencatatan Blockchain" />
      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>Blockchain digunakan sebagai bukti pencatatan keaslian sertifikat, bukan sebagai tempat penyimpanan file sertifikat. Nama dan NIM tidak pernah dicatat. Seluruh data di halaman ini adalah simulasi.</p>
      </div>
      <div className="mb-4 max-w-md"><SearchInput value={q} onChange={setQ} placeholder="Cari Certificate ID atau Transaction ID…" /></div>
      <div className="glass-card hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              {["Certificate ID", "Certificate Hash", "Transaction ID", "Block", "Wallet", "Timestamp", "Status", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-xs">
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-primary">{c.id}</td>
                <td className="px-4 py-3">{short(c.blockchainHash, 12, 4)}</td>
                <td className="px-4 py-3 text-muted-foreground">{short(c.transactionId, 10, 4)}</td>
                <td className="px-4 py-3">{c.blockNumber}</td>
                <td className="px-4 py-3 text-muted-foreground">{short(c.issuerWallet, 6, 4)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{c.timestamp}</td>
                <td className="px-4 py-3 font-sans"><ChainBadge status={c.blockchainStatus} /></td>
                <td className="px-4 py-3 font-sans"><Button size="sm" variant="ghost" onClick={() => setSel(c)}>Lihat Detail</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {rows.map((c) => (
          <li key={c.id} className="glass-card p-4">
            <div className="flex justify-between gap-2"><span className="font-mono text-xs text-primary">{c.id}</span><ChainBadge status={c.blockchainStatus} /></div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">Block {c.blockNumber} · {c.timestamp}</p>
            <p className="mt-1 break-all font-mono text-xs">{short(c.blockchainHash, 16, 6)}</p>
            <Button size="md" variant="ghost" className="mt-3 w-full" onClick={() => setSel(c)}>Lihat Detail</Button>
          </li>
        ))}
      </ul>
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.id ?? ""}>
        {sel && <div className="max-h-[60vh] overflow-y-auto"><BlockchainInfo cert={sel} defaultOpen /></div>}
      </Modal>
    </div>
  );
}
