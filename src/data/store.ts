import { useSyncExternalStore } from "react";
import type { Activity, Certificate, Session } from "@/types";
import { SEED_ACTIVITIES, SEED_CERTIFICATES } from "./mock";

/**
 * Penyimpanan sementara di browser (localStorage) untuk keperluan prototype.
 * Ganti dengan API backend pada tahap berikutnya.
 */
type State = { certificates: Certificate[]; activities: Activity[]; session: Session | null };

const KEY = "sertifikat-proto-v1";
const seed: State = { certificates: SEED_CERTIFICATES, activities: SEED_ACTIVITIES, session: null };
let state: State = seed;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function hydrateStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...seed, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state), () => sel(seed));
}

export function useHydrated() {
  return useSyncExternalStore(subscribe, () => hydrated, () => false);
}

export const actions = {
  login(session: Session) {
    state = { ...state, session };
    emit();
  },
  logout() {
    state = { ...state, session: null };
    emit();
  },
  addCertificate(c: Certificate) {
    state = {
      ...state,
      certificates: [c, ...state.certificates],
      activities: [
        { id: crypto.randomUUID(), message: `${c.id} diterbitkan & dicatat untuk ${c.studentName}`, at: c.timestamp.slice(0, 16), kind: "issue" },
        ...state.activities,
      ],
    };
    emit();
  },
  deleteCertificate(id: string) {
    state = {
      ...state,
      certificates: state.certificates.filter((c) => c.id !== id),
      activities: [
        { id: crypto.randomUUID(), message: `${id} dihapus dari daftar`, at: new Date().toISOString().slice(0, 16).replace("T", " "), kind: "warn" },
        ...state.activities,
      ],
    };
    emit();
  },
  logVerify(id: string, ok: boolean) {
    state = {
      ...state,
      activities: [
        { id: crypto.randomUUID(), message: `${id} diverifikasi — ${ok ? "valid" : "tidak sesuai"}`, at: new Date().toISOString().slice(0, 16).replace("T", " "), kind: ok ? "verify" : "warn" },
        ...state.activities,
      ].slice(0, 50),
    };
    emit();
  },
};

export const getCertificate = (id: string) =>
  state.certificates.find((c) => c.id.toLowerCase() === id.trim().toLowerCase());
