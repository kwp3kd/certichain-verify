import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAuthorizedIssuer } from "@/config/wallets";

/** Memberi peran admin hanya jika wallet terdaftar DAN pemilik wallet menandatangani pesan aktivasi. */
export const activateAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ wallet: z.string().min(32).max(44), signature: z.array(z.number().int().min(0).max(255)).length(64) }).parse(d))
  .handler(async ({ data, context }) => {
    if (!isAuthorizedIssuer(data.wallet)) {
      return { ok: false as const, error: "Wallet ini belum terdaftar sebagai penerbit resmi. Hubungi pengelola kampus untuk didaftarkan." };
    }
    const message = `Sahabat: aktivasi akses admin untuk akun ${context.userId}. Pesan ini tidak memindahkan dana.`;
    let valid = false;
    try {
      valid = nacl.sign.detached.verify(new TextEncoder().encode(message), Uint8Array.from(data.signature), bs58.decode(data.wallet));
    } catch {
      valid = false;
    }
    if (!valid) return { ok: false as const, error: "Tanda tangan wallet tidak valid. Silakan coba lagi." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const r1 = await supabaseAdmin.from("user_roles").upsert({ user_id: context.userId, role: "admin" }, { onConflict: "user_id,role" });
    const r2 = await supabaseAdmin.from("profiles").update({ wallet: data.wallet }).eq("id", context.userId);
    if (r1.error || r2.error) {
      console.error(r1.error ?? r2.error);
      return { ok: false as const, error: "Layanan sedang tidak tersedia. Silakan coba lagi." };
    }
    return { ok: true as const };
  });
