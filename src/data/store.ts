import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { loadSession, signOut } from "@/services/auth";
import type { Activity, Certificate, Session } from "@/types";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["certificates"]["Row"];
type State = { certificates: Certificate[]; activities: Activity[]; session: Session | null; ready: boolean; loadError: string };

const empty: State = { certificates: [], activities: [], session: null, ready: false, loadError: "" };
let state: State = empty;
const listeners = new Set<() => void>();
const set = (p: Partial<State>) => { state = { ...state, ...p }; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state), () => sel(empty));
}
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => state.ready, () => false);
}

const stamp = (iso: string | null) => (iso ? iso.replace("T", " ").slice(0, 19) : "");

export function rowToCertificate(r: Row): Certificate {
  const recorded = !!r.transaction_id;
  return {
    id: r.id,
    studentName: r.student_name,
    studentNim: r.student_nim,
    activityName: r.activity_name,
    activityType: r.activity_type,
    organizer: r.organizer,
    eventDate: r.event_date,
    issuedAt: r.issued_at,
    fileHash: r.file_hash,
    blockchainHash: r.file_hash,
    transactionId: r.transaction_id ?? "",
    blockNumber: r.block_number ?? 0,
    issuerWallet: r.issuer_wallet ?? "",
    timestamp: stamp(r.recorded_at ?? r.created_at),
    verificationStatus: "VALID",
    blockchainStatus: recorded ? "RECORDED" : "NOT_RECORDED",
    recipientEmail: r.recipient_email,
    filePath: r.file_path,
  };
}

async function loadData(session: Session | null) {
  if (!session) return set({ certificates: [], activities: [] });
  try {
    const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    let activities: Activity[] = [];
    if (session.role === "admin") {
      const { data: a } = await supabase.from("activities").select("*").order("at", { ascending: false }).limit(50);
      activities = (a ?? []).map((x) => ({ id: x.id, message: x.message, at: stamp(x.at).slice(0, 16), kind: (["issue", "record", "verify", "warn"].includes(x.kind) ? x.kind : "issue") as Activity["kind"] }));
    }
    set({ certificates: (data ?? []).map(rowToCertificate), activities, loadError: "" });
  } catch {
    set({ loadError: "Layanan sedang tidak tersedia. Silakan coba lagi." });
  }
}

export async function refresh() {
  const session = await loadSession();
  set({ session });
  await loadData(session);
  set({ ready: true });
}

let inited = false;
export function initStore() {
  if (inited || typeof window === "undefined") return;
  inited = true;
  void refresh();
  try {
    supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setTimeout(() => void refresh(), 0);
    });
  } catch { /* ignore */ }
}

async function logActivity(message: string, kind: Activity["kind"]) {
  try { await supabase.from("activities").insert({ message, kind }); } catch { /* ignore */ }
}

export type NewCertificate = Omit<Certificate, "blockchainHash" | "verificationStatus" | "blockchainStatus" | "timestamp"> & { recipientEmail: string; recordedAt: string | null; file: File };

export const actions = {
  async logout() {
    await signOut();
    set({ session: null, certificates: [], activities: [] });
  },
  async addCertificate(c: NewCertificate): Promise<{ ok: true } | { ok: false; error: string }> {
    const s = state.session;
    if (!s || s.role !== "admin") return { ok: false, error: "Sesi admin berakhir. Silakan masuk kembali." };
    try {
      const path = `${s.userId}/${c.id}.pdf`;
      const up = await supabase.storage.from("certificates").upload(path, c.file, { contentType: "application/pdf", upsert: true });
      if (up.error) throw up.error;
      const { error } = await supabase.from("certificates").insert({
        id: c.id, issuer_id: s.userId, recipient_email: c.recipientEmail.toLowerCase(), student_name: c.studentName, student_nim: c.studentNim,
        activity_name: c.activityName, activity_type: c.activityType, organizer: c.organizer, event_date: c.eventDate, issued_at: c.issuedAt,
        file_hash: c.fileHash, file_path: path, transaction_id: c.transactionId || null, block_number: c.blockNumber || null,
        issuer_wallet: c.issuerWallet || null, recorded_at: c.recordedAt,
      });
      if (error) throw error;
      await logActivity(`${c.id} diterbitkan untuk ${c.studentName}${c.transactionId ? " & dicatat di Solana Devnet" : " (belum dicatat ke blockchain)"}`, c.transactionId ? "record" : "issue");
      await loadData(s);
      return { ok: true };
    } catch (e) {
      const dup = /duplicate|unique/i.test((e as { message?: string })?.message ?? "");
      return { ok: false, error: dup ? "ID sertifikat ini sudah digunakan." : "Layanan sedang tidak tersedia. Silakan coba lagi." };
    }
  },
  async deleteCertificate(id: string) {
    const s = state.session;
    try {
      const cert = state.certificates.find((c) => c.id === id);
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
      if (cert?.filePath) await supabase.storage.from("certificates").remove([cert.filePath]).catch(() => null);
      await logActivity(`${id} dihapus dari daftar`, "warn");
      await loadData(s);
      return true;
    } catch {
      return false;
    }
  },
};

export const getCertificate = (id: string) => state.certificates.find((c) => c.id.toLowerCase() === id.trim().toLowerCase());
