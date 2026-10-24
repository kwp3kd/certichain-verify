import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateChatCompletion } from "@lovable.dev/ai-gateway";

const MODEL = "google/gemini-3.8-flash" as const;

const textOf = (r: unknown): string => {
  const c = (r as { choices?: { message?: { content?: unknown } }[] })?.choices?.[0]?.message?.content;
  return typeof c === "string" ? c.trim() : "";
};

/** Menjelaskan hasil yang SUDAH diputuskan oleh perbandingan hash. AI tidak menentukan status. */
export const explainResult = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ status: z.enum(["VALID", "INVALID", "NOT_FOUND"]), activityName: z.string().max(150).optional(), source: z.enum(["chain", "database"]) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const r = await generateChatCompletion({
        model: MODEL,
        messages: [
          { role: "system", content: "Anda menjelaskan hasil verifikasi sertifikat kampus kepada orang awam dalam bahasa Indonesia sederhana, maksimal 3 kalimat. Status sudah ditentukan oleh sistem melalui perbandingan sidik jari (hash). Jangan pernah mengubah, meragukan, atau menilai ulang status." },
          { role: "user", content: `Status: ${data.status}. Kegiatan: ${data.activityName ?? "-"}. Hash pembanding diambil dari: ${data.source === "chain" ? "catatan blockchain Solana Devnet" : "database (mode simulasi, belum dari blockchain)"}.` },
        ],
      });
      const text = textOf(r);
      return text ? { ok: true as const, text } : { ok: false as const };
    } catch (e) {
      console.error(e);
      return { ok: false as const };
    }
  });

/** OCR halaman pertama sertifikat (gambar) bila PDF tidak punya lapisan teks. */
export const ocrCertificate = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ image: z.string().startsWith("data:image/").max(6_000_000) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const r = await generateChatCompletion({
        model: MODEL,
        messages: [
          { role: "user", content: [
            { type: "text", text: "Salin seluruh teks yang terlihat pada gambar sertifikat ini apa adanya. Hanya teks, tanpa komentar." },
            { type: "image_url", image_url: { url: data.image } },
          ] },
        ],
      });
      return { ok: true as const, text: textOf(r) };
    } catch (e) {
      console.error(e);
      return { ok: false as const, text: "" };
    }
  });
