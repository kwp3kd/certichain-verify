/**
 * Validasi variabel lingkungan saat startup. Tidak pernah melempar error:
 * jika nilai kosong/tidak valid, aplikasi berjalan dalam mode simulasi.
 */
const read = (k: string): string => {
  try {
    const v = (import.meta.env as Record<string, unknown>)[k];
    return typeof v === "string" ? v.trim() : "";
  } catch {
    return "";
  }
};

const BASE58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const programId = read("VITE_SOLANA_PROGRAM_ID");

export const env = {
  cluster: "devnet" as const,
  rpcUrl: read("VITE_SOLANA_RPC_URL") || "https://api.devnet.solana.com",
  programId: BASE58.test(programId) ? programId : "",
  /** true = smart contract belum terhubung → tidak ada transaksi, tidak ada txId. */
  isBlockchainMock: !BASE58.test(programId),
};

export const explorerTx = (sig: string) => `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
export const explorerAddress = (a: string) => `https://explorer.solana.com/address/${a}?cluster=devnet`;
