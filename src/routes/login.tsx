import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Brand } from "@/components/Brand";
import { Button, Field, Input } from "@/components/kit";
import { actions } from "@/data/store";
import { DUMMY_ACCOUNTS } from "@/data/mock";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { role?: Role } => ({ role: s.role === "mahasiswa" ? "mahasiswa" : s.role === "admin" ? "admin" : undefined }),
  head: () => ({
    meta: [
      { title: "Login — Sahabat" },
      { name: "description", content: "Masuk sebagai admin/panitia atau mahasiswa untuk mengelola dan melihat sertifikat." },
      { property: "og:title", content: "Login — Sahabat" },
      { property: "og:description", content: "Masuk untuk mengelola atau melihat sertifikat kegiatan kampus." },
    ],
  }),
  component: Login,
});

const schema = z.object({
  email: z.string().trim().email("Format email belum benar.").max(255),
  password: z.string().min(1, "Kata sandi wajib diisi.").max(100),
});

function Login() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(search.role ?? "admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fill = () => {
    setEmail(DUMMY_ACCOUNTS[role].email);
    setPassword(DUMMY_ACCOUNTS[role].password);
    setErrors({});
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email, password });
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    const acc = DUMMY_ACCOUNTS[role];
    if (r.data.email !== acc.email || r.data.password !== acc.password) {
      setErrors({ form: "Email atau kata sandi tidak cocok. Gunakan tombol \"Isi akun demo\" di bawah." });
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    actions.login(role === "admin" ? { role, name: acc.name } : { role, name: acc.name, nim: DUMMY_ACCOUNTS.mahasiswa.nim });
    navigate({ to: role === "admin" ? "/admin" : "/mahasiswa" });
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md animate-rise">
        <div className="mb-8 flex justify-center"><Brand /></div>
        <div className="glass-card p-6 sm:p-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Masuk</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pilih peran Anda, lalu masuk dengan akun kampus.</p>

          <div role="tablist" aria-label="Peran" className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
            {(["admin", "mahasiswa"] as Role[]).map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={role === r}
                onClick={() => { setRole(r); setErrors({}); }}
                className={cn("h-10 rounded-lg text-sm font-medium transition-colors", role === r ? "bg-popover shadow-sm" : "text-muted-foreground")}
              >
                {r === "admin" ? "Admin / Panitia" : "Mahasiswa"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <Field id="email" label="Email kampus" error={errors.email}>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} autoComplete="username" />
            </Field>
            <Field id="password" label="Kata sandi" error={errors.password}>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} autoComplete="current-password" />
            </Field>
            {errors.form && <p role="alert" className="rounded-xl bg-warn/10 p-3 text-sm font-medium text-warn">{errors.form}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Memproses…" : "Masuk"}</Button>
          </form>

          <div className="mt-6 rounded-xl bg-accent p-4 text-sm text-accent-foreground">
            <p className="font-medium">Akun demo ({role === "admin" ? "Admin" : "Mahasiswa"})</p>
            <p className="mt-1 font-mono text-xs">{DUMMY_ACCOUNTS[role].email} · {DUMMY_ACCOUNTS[role].password}</p>
            <button type="button" onClick={fill} className="mt-2 text-sm font-semibold underline-offset-4 hover:underline">Isi akun demo</button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Kami tidak pernah meminta private key, seed phrase, atau kata sandi wallet.</p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Hanya ingin memeriksa sertifikat? <Link to="/verify" className="font-medium text-primary hover:underline">Verifikasi tanpa login</Link>
        </p>
      </div>
    </main>
  );
}
