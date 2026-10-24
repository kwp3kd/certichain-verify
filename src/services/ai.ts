/** Lapisan bantu AI. Tidak pernah menentukan VALID / TIDAK SESUAI. */
import { explainResult, ocrCertificate } from "@/lib/ai.functions";

export type ExplainInput = { status: "VALID" | "INVALID" | "NOT_FOUND"; activityName?: string; source: "chain" | "database" };

export const STATIC_EXPLANATION: Record<ExplainInput["status"], string> = {
  VALID: "Sidik jari digital sertifikat ini sama persis dengan yang tercatat saat diterbitkan. Artinya isi file tidak berubah sejak diterbitkan oleh panitia.",
  INVALID: "Sidik jari digital sertifikat ini berbeda dengan yang tercatat. Kemungkinan file sudah diubah atau bukan file asli; silakan konfirmasi ke pihak penerbit.",
  NOT_FOUND: "Kode sertifikat ini tidak ditemukan dalam catatan. Periksa kembali penulisan kode atau hubungi pihak penerbit.",
};

export async function explain(input: ExplainInput): Promise<{ text: string; fromAI: boolean }> {
  try {
    const r = await explainResult({ data: input });
    if (r.ok) return { text: r.text, fromAI: true };
  } catch { /* fallback */ }
  return { text: STATIC_EXPLANATION[input.status], fromAI: false };
}

async function loadPdf(file: File) {
  const pdfjs = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  return pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
}

async function extractText(file: File): Promise<string> {
  const doc = await loadPdf(file);
  let out = "";
  for (let i = 1; i <= Math.min(doc.numPages, 3); i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    out += tc.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
  }
  if (out.replace(/\s/g, "").length >= 20) return out;
  // Tidak ada lapisan teks → render halaman 1 lalu OCR dengan AI.
  const page = await doc.getPage(1);
  const vp = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement("canvas");
  canvas.width = vp.width; canvas.height = vp.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return out;
  await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
  const r = await ocrCertificate({ data: { image: canvas.toDataURL("image/jpeg", 0.8) } });
  return r.ok ? r.text : out;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");

export type OcrCheck = { status: "match" } | { status: "mismatch"; fields: string[] } | { status: "unavailable" };

/** Membandingkan teks di PDF dengan isian form. Hanya peringatan; admin tetap boleh lanjut. */
export async function checkPdfAgainstForm(file: File, form: { studentName: string; studentNim: string; activityName: string }): Promise<OcrCheck> {
  try {
    const text = norm(await extractText(file));
    if (text.length < 10) return { status: "unavailable" };
    const fields: string[] = [];
    if (!text.includes(norm(form.studentName))) fields.push("Nama penerima");
    if (!text.includes(norm(form.studentNim))) fields.push("NIM");
    if (!text.includes(norm(form.activityName))) fields.push("Nama kegiatan");
    return fields.length ? { status: "mismatch", fields } : { status: "match" };
  } catch {
    return { status: "unavailable" };
  }
}
