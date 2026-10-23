/**
 * Integrasi smart contract Anchor di Solana Devnet.
 * Instruksi dienkode sesuai layout Anchor (lihat src/services/idl.json dan anchor/programs/sertifikat).
 * Satu sertifikat = satu PDA = satu transaksi record_certificate.
 */
import { Buffer } from "buffer";
import { env } from "@/config/env";
import { getPhantom, isUserRejection } from "./wallet";

export type ChainCode = "MOCK" | "NO_WALLET" | "USER_REJECTED" | "RPC_UNAVAILABLE" | "TX_FAILED" | "INSUFFICIENT_FUNDS" | "ALREADY_RECORDED";

const MESSAGES: Record<ChainCode, string> = {
  MOCK: "Mode Simulasi — smart contract belum terhubung.",
  NO_WALLET: "Hubungkan wallet Phantom terlebih dahulu.",
  USER_REJECTED: "Transaksi dibatalkan oleh pengguna.",
  RPC_UNAVAILABLE: "Jaringan Solana Devnet sedang tidak dapat dijangkau. Silakan coba lagi.",
  TX_FAILED: "Transaksi gagal diproses jaringan. Sertifikat belum tercatat.",
  INSUFFICIENT_FUNDS: "Saldo SOL Devnet tidak cukup. Isi gratis dari faucet Solana Devnet lalu coba lagi.",
  ALREADY_RECORDED: "ID sertifikat ini sudah tercatat di blockchain. Gunakan ID lain.",
};

export class BlockchainError extends Error {
  code: ChainCode;
  constructor(code: ChainCode) {
    super(MESSAGES[code]);
    this.code = code;
  }
}

const web3 = () => import("@solana/web3.js");

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let last: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i < retries) await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw last;
}

async function discriminator(seed: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
  return Buffer.from(new Uint8Array(d).slice(0, 8));
}

function encString(s: string) {
  const bytes = Buffer.from(s, "utf8");
  const len = Buffer.alloc(4);
  len.writeUInt32LE(bytes.length, 0);
  return Buffer.concat([len, bytes]);
}

async function pdaFor(certificateId: string) {
  const { PublicKey } = await web3();
  const programId = new PublicKey(env.programId);
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from("certificate"), Buffer.from(certificateId)], programId);
  return { pda, programId };
}

async function connection() {
  const { Connection } = await web3();
  return new Connection(env.rpcUrl, "confirmed");
}

export type ChainRecord = { fileHash: string; issuer: string; timestamp: string };

/** Membaca akun PDA sertifikat. null = tidak tercatat. Melempar RPC_UNAVAILABLE jika jaringan gagal. */
export async function fetchCertificate(certificateId: string): Promise<ChainRecord | null> {
  if (env.isBlockchainMock) throw new BlockchainError("MOCK");
  const { PublicKey } = await web3();
  const { pda } = await pdaFor(certificateId);
  const conn = await connection();
  let info;
  try {
    info = await withRetry(() => conn.getAccountInfo(pda));
  } catch {
    throw new BlockchainError("RPC_UNAVAILABLE");
  }
  if (!info) return null;
  try {
    const data = Buffer.from(info.data);
    let o = 8;
    const readStr = () => { const n = data.readUInt32LE(o); o += 4; const s = data.subarray(o, o + n).toString("utf8"); o += n; return s; };
    readStr(); // certificate_id
    const fileHash = readStr();
    const issuer = new PublicKey(data.subarray(o, o + 32)).toBase58(); o += 32;
    const ts = Number(data.readBigInt64LE(o));
    return { fileHash, issuer, timestamp: new Date(ts * 1000).toISOString() };
  } catch {
    return null;
  }
}

export type RecordResult = { txId: string; blockNumber: number; timestamp: string };

export async function recordCertificate(certificateId: string, fileHash: string, wallet: string | null): Promise<RecordResult> {
  if (env.isBlockchainMock) throw new BlockchainError("MOCK");
  const provider = getPhantom();
  if (!provider || !wallet) throw new BlockchainError("NO_WALLET");
  const { PublicKey, Transaction, TransactionInstruction, SystemProgram } = await web3();

  if (await fetchCertificate(certificateId)) throw new BlockchainError("ALREADY_RECORDED");

  const issuer = new PublicKey(wallet);
  const { pda, programId } = await pdaFor(certificateId);
  const data = Buffer.concat([await discriminator("global:record_certificate"), encString(certificateId), encString(fileHash)]);
  const ix = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: pda, isSigner: false, isWritable: true },
      { pubkey: issuer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });

  const conn = await connection();
  let latest;
  try {
    latest = await withRetry(() => conn.getLatestBlockhash("confirmed"));
  } catch {
    throw new BlockchainError("RPC_UNAVAILABLE");
  }
  const tx = new Transaction({ feePayer: issuer, blockhash: latest.blockhash, lastValidBlockHeight: latest.lastValidBlockHeight }).add(ix);

  let signature: string;
  try {
    ({ signature } = await provider.signAndSendTransaction(tx));
  } catch (e) {
    if (isUserRejection(e)) throw new BlockchainError("USER_REJECTED");
    if (/insufficient|lamports|0x1\b/i.test((e as Error)?.message ?? "")) throw new BlockchainError("INSUFFICIENT_FUNDS");
    throw new BlockchainError("TX_FAILED");
  }

  try {
    const conf = await withRetry(() => conn.confirmTransaction({ signature, ...latest }, "confirmed"));
    if (conf.value.err) throw new BlockchainError("TX_FAILED");
  } catch (e) {
    if (e instanceof BlockchainError) throw e;
    throw new BlockchainError("RPC_UNAVAILABLE");
  }

  const status = await withRetry(() => conn.getSignatureStatus(signature)).catch(() => null);
  const slot = status?.value?.slot ?? 0;
  const blockTime = slot ? await conn.getBlockTime(slot).catch(() => null) : null;
  return { txId: signature, blockNumber: slot, timestamp: new Date((blockTime ?? Date.now() / 1000) * 1000).toISOString() };
}
