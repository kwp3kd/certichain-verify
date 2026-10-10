import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Check, FileUp, Fingerprint, Link2, Loader2, CheckCircle2 } from "lucide-react";
import { Button, Field, Input, PageHeader, Select, buttonClass } from "@/components/kit";
import { QRCode } from "@/components/QRCode";
import { actions, useStore } from "@/data/store";
import { ACTIVITY_TYPES, UNIVERSITY } from "@/data/mock";
import { hashFile, recordToMockChain, type MockRecord } from "@/utils/blockchain";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/tambah")({ component: Wizard });

const STEPS = ["Data Sertifikat", "Hash", "Blockchain", "QR Code", "Selesai"];

const schema = z.object({
  id: z.string().trim().regex(/^[A-Z0-9-]{4,30}$/, "Gunakan huruf besar, angka, dan tanda hubung. Contoh: SRT-2026-0013"),
  studentName: z.string().trim().min(2, "Nama penerima wajib diisi.").max(100),
  studentNim: z.string().trim().regex(/^\d{5,15}$/, "NIM hanya berisi angka (5–15 digit)."),
  activityName: z.string().trim().min(3, "Nama kegiatan wajib diisi.").max(150),
  activityType: z.string().min(1),
  organizer: z.string().trim().min(2, "Penyelenggara wajib diisi.").max(150),
  eventDate: z.string().min(1, "Pilih tanggal kegiatan."),
  issuedAt: z.string().min(1, "Pilih tanggal penerbitan."),
});
type Form = z.infer<typeof schema>;

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium" aria-label="Langkah">
      {STEPS.map((s, i) => (
        <li key={s} aria-current={i === step ? "step" : undefined}
          className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5", i < step ? "bg-verify/10 text-verify" : i === step ? "bg-primary text-primary-foreground" : "text-muted-foreground ring-1 ring-border")}>
          {i < step ? <Check className="size-3.5" aria-hidden /> : <span>{i + 1}</span>} {s}
        </li>
      ))}
    </ol>
  );
}

function Wizard() {
  const certificates = useStore((s) => s.certificates);
  const count = certificates.length;
  const existing = certificates.map((c) => c.id);
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({
    id: `SRT-2026-${String(count + 1).padStart(4, "0")}`,
    studentName: "", studentNim: "", activityName: "", activityType: "Seminar",
    organizer: "BEM " + UNIVERSITY, eventDate: today, issuedAt: today,
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [hash, setHash] = useState("");
  const [record, setRecord] = useState<MockRecord | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  const next0 = async () => {
    const r = schema.safeParse({ ...form, id: form.id.toUpperCase() });
    const errs: Record<string, string> = r.success ? {} : Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]));
    if (existing.includes(form.id.toUpperCase())) errs["id"] = "ID ini sudah digunakan. Gunakan ID lain.";
    if (!file) errs["file"] = "Unggah file sertifikat PDF.";
    else if (file.type !== "application/pdf") errs["file"] = "File harus berformat PDF.";
    else if (file.size > 10 * 1024 * 1024) errs["file"] = "Ukuran file maksimal 10 MB.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setHash(await hashFile(file!));
    setBusy(false);
    setStep(1);
  };

  const next1 = async () => {
    setBusy(true);
    setRecord(await recordToMockChain(form.id, hash));
    setBusy(false);
    setStep(2);
  };

  const save = () => {
    if (!record) return;
    actions.addCertificate({
      ...form, id: form.id.toUpperCase(), fileHash: hash, ...record,
      verificationStatus: "VALID", blockchainStatus: "RECORDED",
    });
    setStep(4);
  };

  return (
    <div className="mx-auto max-w-3xl animate-rise">
      <PageHeader title="Tambah Sertifikat" desc="Ikuti langkah berikut. Sistem akan membuat sidik jari file dan mencatatnya ke simulasi blockchain." />
      <div className="glass-card p-5 sm:p-8">
        <Stepper step={step} />

        {step === 0 && (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="id" label="ID / kode sertifikat" error={errors["id"]}><Input id="id" value={form.id} onChange={set("id")} className="font-mono uppercase" aria-invalid={!!errors["id"]} /></Field>
              <Field id="type" label="Jenis kegiatan"><Select id="type" value={form.activityType} onChange={set("activityType")}>{ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}</Select></Field>
              <Field id="name" label="Nama penerima" error={errors["studentName"]}><Input id="name" value={form.studentName} onChange={set("studentName")} aria-invalid={!!errors["studentName"]} /></Field>
              <Field id="nim" label="NIM" error={errors["studentNim"]}><Input id="nim" inputMode="numeric" value={form.studentNim} onChange={set("studentNim")} aria-invalid={!!errors["studentNim"]} /></Field>
              <div className="sm:col-span-2"><Field id="act" label="Nama kegiatan" error={errors["activityName"]}><Input id="act" value={form.activityName} onChange={set("activityName")} aria-invalid={!!errors["activityName"]} placeholder="Contoh: Seminar Keamanan Data Nasional" /></Field></div>
              <div className="sm:col-span-2"><Field id="org" label="Penyelenggara" error={errors["organizer"]}><Input id="org" value={form.organizer} onChange={set("organizer")} aria-invalid={!!errors["organizer"]} /></Field></div>
              <Field id="ed" label="Tanggal kegiatan" error={errors["eventDate"]}><Input id="ed" type="date" value={form.eventDate} onChange={set("eventDate")} /></Field>
              <Field id="ia" label="Tanggal penerbitan" error={errors["issuedAt"]}><Input id="ia" type="date" value={form.issuedAt} onChange={set("issuedAt")} /></Field>
            </div>
            <Field id="file" label="File sertifikat (PDF)" error={errors["file"]} hint="Maksimal 10 MB. File hanya dihitung sidik jarinya, tidak dicatat ke blockchain.">
              <label htmlFor="file" className={cn("flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 text-sm hover:bg-glass", errors["file"] ? "border-warn" : "border-border")}>
                <FileUp className="size-5 text-primary" aria-hidden />
                <span className="min-w-0 truncate">{file ? file.name : "Pilih atau tarik file PDF ke sini"}</span>
              </label>
              <input id="file" type="file" accept="application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </Field>
            <div className="flex justify-end"><Button onClick={next0} disabled={busy}>{busy ? <><Loader2 className="size-4 animate-spin" /> Membuat hash…</> : "Lanjut: Buat Hash"}</Button></div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 space-y-5">
            <div className="flex flex-col items-center gap-2 text-center text-sm">
              <span className="glass-inset px-4 py-2">📄 {file?.name}</span><span className="text-muted-foreground">↓ Hashing (SHA-256)</span>
              <span className="flex items-center gap-2 font-semibold text-primary"><Fingerprint className="size-4" /> Certificate Hash</span>
            </div>
            <div className="glass-inset break-all p-4 text-center font-mono text-sm">{hash}</div>
            <p className="text-center text-sm text-muted-foreground">Ini adalah sidik jari digital file. Jika isi PDF diubah sedikit saja, sidik jarinya akan berbeda total.</p>
            <div className="flex justify-between"><Button variant="ghost" onClick={() => setStep(0)}>Kembali</Button><Button onClick={next1} disabled={busy}>{busy ? <><Loader2 className="size-4 animate-spin" /> Mencatat…</> : <><Link2 className="size-4" /> Catat ke Blockchain</>}</Button></div>
          </div>
        )}

        {step === 2 && record && (
          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-3 rounded-xl bg-verify/10 p-4 text-sm text-verify"><CheckCircle2 className="size-5" /> <span className="font-medium">Hash berhasil dicatat ke simulasi blockchain.</span></div>
            <dl className="glass-inset divide-y divide-border px-4 font-mono text-xs">
              {[["Transaction ID", record.transactionId], ["Block Number", String(record.blockNumber)], ["Timestamp", record.timestamp], ["Wallet penerbit", record.issuerWallet], ["Data dicatat", `ID ${form.id} + hash (tanpa nama/NIM)`]].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]"><dt className="font-sans text-sm font-medium">{k}</dt><dd className="break-all text-muted-foreground">{v}</dd></div>
              ))}
            </dl>
            <div className="flex justify-end"><Button onClick={() => setStep(3)}>Lanjut: Buat QR Code</Button></div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-5 text-center">
            <div className="flex justify-center"><QRCode id={form.id.toUpperCase()} size={180} /></div>
            <p className="text-sm text-muted-foreground">Cetak QR Code ini pada sertifikat. Saat dipindai, halaman verifikasi akan langsung terbuka.</p>
            <div className="flex justify-between"><Button variant="ghost" onClick={() => setStep(2)}>Kembali</Button><Button onClick={save}>Simpan Sertifikat</Button></div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8 space-y-4 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-verify text-verify-foreground"><Check className="size-8" /></span>
            <h2 className="font-display text-3xl font-semibold">Sertifikat tersimpan</h2>
            <p className="text-sm text-muted-foreground">Sertifikat <span className="font-mono text-foreground">{form.id}</span> untuk {form.studentName} siap dibagikan.</p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Link to="/admin/sertifikat/$id" params={{ id: form.id.toUpperCase() }} className={buttonClass()}>Lihat detail</Link>
              <Link to="/admin/sertifikat" className={buttonClass("ghost")}>Ke daftar sertifikat</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
