import { useSyncExternalStore } from "react";
import { env } from "@/config/env";

/** Provider Phantom yang disuntikkan ekstensi browser (window.phantom.solana). */
export type PhantomProvider = {
  isPhantom?: boolean;
  publicKey: { toString(): string } | null;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signMessage(msg: Uint8Array, display?: "utf8"): Promise<{ signature: Uint8Array }>;
  signAndSendTransaction(tx: unknown): Promise<{ signature: string }>;
  on?(event: string, cb: (...a: unknown[]) => void): void;
};

export function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const p = (window as unknown as { phantom?: { solana?: PhantomProvider } }).phantom?.solana;
  return p?.isPhantom ? p : null;
}

type WalletState = { installed: boolean; address: string | null; connecting: boolean; networkOk: boolean; error: string };
let state: WalletState = { installed: false, address: null, connecting: false, networkOk: false, error: "" };
const listeners = new Set<() => void>();
const set = (p: Partial<WalletState>) => { state = { ...state, ...p }; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const SERVER: WalletState = { installed: false, address: null, connecting: false, networkOk: false, error: "" };

export function useWallet() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

export const isUserRejection = (e: unknown) => {
  const err = e as { code?: number; message?: string } | null;
  return err?.code === 4001 || /reject|denied|cancel/i.test(err?.message ?? "");
};

async function checkDevnet(): Promise<boolean> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(env.rpcUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth" }) });
      if (res.ok) return true;
    } catch { /* retry */ }
    await new Promise((r) => setTimeout(r, 700 * (i + 1)));
  }
  return false;
}

let inited = false;
export function initWallet() {
  if (inited || typeof window === "undefined") return;
  inited = true;
  const detect = () => {
    const p = getPhantom();
    set({ installed: !!p });
    if (!p) return;
    p.on?.("disconnect", () => set({ address: null, networkOk: false }));
    p.on?.("accountChanged", (pk) => set({ address: pk ? String(pk) : null }));
    p.connect({ onlyIfTrusted: true }).then(async (r) => set({ address: r.publicKey.toString(), networkOk: await checkDevnet() })).catch(() => {});
  };
  // Ekstensi kadang disuntikkan sedikit terlambat.
  detect();
  setTimeout(() => { if (!state.installed) detect(); }, 800);
}

export async function connectWallet(): Promise<string | null> {
  const p = getPhantom();
  if (!p) { set({ installed: false, error: "Ekstensi Phantom belum terpasang." }); return null; }
  set({ connecting: true, error: "" });
  try {
    const r = await p.connect();
    const address = r.publicKey.toString();
    // Jaringan dikunci ke Solana Devnet: semua koneksi & transaksi memakai RPC Devnet.
    const networkOk = await checkDevnet();
    set({ address, networkOk, connecting: false, error: networkOk ? "" : "Wallet terhubung, tetapi jaringan Solana Devnet sedang tidak dapat dijangkau." });
    return address;
  } catch (e) {
    set({ connecting: false, error: isUserRejection(e) ? "Permintaan koneksi dibatalkan oleh pengguna." : "Layanan sedang tidak tersedia. Silakan coba lagi." });
    return null;
  }
}

export async function disconnectWallet() {
  try { await getPhantom()?.disconnect(); } catch { /* ignore */ }
  set({ address: null, networkOk: false, error: "" });
}

export async function signWalletMessage(message: string): Promise<number[]> {
  const p = getPhantom();
  if (!p || !state.address) throw new Error("Hubungkan wallet Phantom terlebih dahulu.");
  try {
    const { signature } = await p.signMessage(new TextEncoder().encode(message), "utf8");
    return Array.from(signature);
  } catch (e) {
    throw new Error(isUserRejection(e) ? "Penandatanganan dibatalkan oleh pengguna." : "Layanan sedang tidak tersedia. Silakan coba lagi.");
  }
}
