import { useEffect } from "react";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "route_error_component" });
  }, [error]);
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="glass-card max-w-md p-6 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-warn/10 text-warn"><AlertTriangle className="size-6" aria-hidden /></span>
        <h1 className="mt-4 font-display text-2xl font-semibold">Terjadi kesalahan pada halaman ini</h1>
        <p className="mt-2 text-sm text-muted-foreground">Halaman lain tetap dapat digunakan. Silakan muat ulang atau kembali ke beranda.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Muat ulang</button>
          <a href="/" className="inline-flex h-11 items-center rounded-xl bg-glass px-5 text-sm font-medium ring-1 ring-border">Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  );
}
