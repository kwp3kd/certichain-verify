import { useEffect } from "react";
import { Loader2, Wallet, LogOut, ExternalLink } from "lucide-react";
import { Button } from "./kit";
import { connectWallet, disconnectWallet, initWallet, useWallet } from "@/services/wallet";
import { short } from "@/utils/blockchain";
import { cn } from "@/lib/utils";

export function NetworkBadge({ className }: { className?: string | undefined }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary", className)}>
      <span className="size-1.5 rounded-full bg-primary" aria-hidden /> Solana Devnet
    </span>
  );
}

export function WalletStatus() {
  const w = useWallet();
  const ok = !!w.address && w.networkOk;
  return (
    <p role="status" className={cn("text-sm font-medium", ok ? "text-verify" : "text-muted-foreground")}>
      {ok ? "● Terhubung ke Solana Devnet" : w.address ? "● Wallet terhubung, jaringan Devnet belum terjangkau" : "○ Belum terhubung"}
    </p>
  );
}

export function ConnectWalletButton({ className }: { className?: string | undefined }) {
  const w = useWallet();
  useEffect(() => initWallet(), []);

  if (!w.installed) {
    return (
      <div className={cn("space-y-2", className)}>
        <span title="Pasang ekstensi Phantom terlebih dahulu" className="inline-block">
          <Button variant="ghost" disabled><Wallet className="size-4" /> Connect Phantom</Button>
        </span>
        <p className="text-sm text-muted-foreground">
          Ekstensi Phantom belum terpasang.{" "}
          <a href="https://phantom.app/download" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Pasang dari phantom.app <ExternalLink className="size-3" />
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {w.address ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="glass-inset px-3 py-2 font-mono text-xs" title={w.address}>{short(w.address, 6, 4)}</span>
          <Button variant="ghost" size="sm" onClick={() => void disconnectWallet()}><LogOut className="size-4" /> Putuskan</Button>
        </div>
      ) : (
        <Button type="button" onClick={() => void connectWallet()} disabled={w.connecting}>
          {w.connecting ? <><Loader2 className="size-4 animate-spin" /> Memproses…</> : <><Wallet className="size-4" /> Connect Phantom</>}
        </Button>
      )}
      <WalletStatus />
      {w.error && <p role="alert" className="text-sm font-medium text-warn">{w.error}</p>}
    </div>
  );
}
