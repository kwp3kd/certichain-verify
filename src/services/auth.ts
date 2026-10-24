/** Layanan akun. Semua pemanggilan dibungkus agar tidak pernah memunculkan layar putih. */
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@/types";

const FRIENDLY = "Layanan sedang tidak tersedia. Silakan coba lagi.";

const translate = (msg: string) => {
  if (/invalid login/i.test(msg)) return "Email atau kata sandi tidak cocok.";
  if (/not confirmed/i.test(msg)) return "Email belum dikonfirmasi. Buka tautan konfirmasi di email Anda.";
  if (/already registered|already exists/i.test(msg)) return "Email ini sudah terdaftar. Silakan masuk.";
  if (/password/i.test(msg) && /(weak|short|least)/i.test(msg)) return "Kata sandi terlalu lemah. Gunakan minimal 8 karakter.";
  if (/rate limit/i.test(msg)) return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  return FRIENDLY;
};

export async function signUp(input: { email: string; password: string; name: string; nim: string; requestedRole: "admin" | "mahasiswa"; wallet?: string | null }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
        data: { name: input.name, nim: input.nim, requested_role: input.requestedRole, wallet: input.wallet ?? null },
      },
    });
    if (error) return { ok: false as const, error: translate(error.message) };
    return { ok: true as const, needsConfirm: !data.session };
  } catch {
    return { ok: false as const, error: FRIENDLY };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { ok: false as const, error: translate(error.message) } : { ok: true as const };
  } catch {
    return { ok: false as const, error: FRIENDLY };
  }
}

export async function signOut() {
  try { await supabase.auth.signOut(); } catch { /* ignore */ }
}

/** Mengambil sesi + peran dari server. Gagal/korup = dianggap belum login. */
export async function loadSession(): Promise<Session | null> {
  try {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return null;
    const [{ data: roles }, { data: profile }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      supabase.from("profiles").select("name, nim, wallet").eq("id", user.id).maybeSingle(),
    ]);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    return {
      userId: user.id,
      email: user.email ?? "",
      role: isAdmin ? "admin" : "mahasiswa",
      name: profile?.name || String(meta["name"] ?? "") || (user.email ?? "Pengguna"),
      nim: profile?.nim ?? "",
      wallet: profile?.wallet ?? null,
      pendingAdmin: !isAdmin && meta["requested_role"] === "admin",
    };
  } catch {
    return null;
  }
}

export const adminActivationMessage = (userId: string) => `Sahabat: aktivasi akses admin untuk akun ${userId}. Pesan ini tidak memindahkan dana.`;
