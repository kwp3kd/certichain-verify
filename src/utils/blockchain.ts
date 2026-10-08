/**
 * Simulasi blockchain (mock). Fungsi-fungsi ini sengaja dibuat dengan
 * antarmuka async agar mudah diganti dengan pemanggilan smart contract /
 * backend sungguhan pada tahap berikutnya.
 */
import { ISSUER_WALLET } from "@/data/mock";

export async function sha256Hex(data: ArrayBuffer | string): Promise<string> {
  const buf = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export async function hashFile(file: File) {
  return sha256Hex(await file.arrayBuffer());
}

const pad = (n: number) => String(n).padStart(2, "0");
export function nowStamp(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export type MockRecord = {
  blockchainHash: string;
  transactionId: string;
  blockNumber: number;
  issuerWallet: string;
  timestamp: string;
};

/** Mencatat hash ke "blockchain" simulasi. Hanya hash + ID, tanpa data pribadi. */
export async function recordToMockChain(certificateId: string, fileHash: string): Promise<MockRecord> {
  await new Promise((r) => setTimeout(r, 1200));
  const tx = (await sha256Hex(certificateId + fileHash + Date.now())).toLowerCase();
  return {
    blockchainHash: fileHash,
    transactionId: "0x" + tx,
    blockNumber: 18294531 + Math.floor(Math.random() * 90000),
    issuerWallet: ISSUER_WALLET,
    timestamp: nowStamp(),
  };
}

export const short = (s: string, a = 10, b = 6) => (s.length > a + b + 1 ? `${s.slice(0, a)}…${s.slice(-b)}` : s);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
