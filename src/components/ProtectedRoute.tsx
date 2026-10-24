import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useHydrated, useStore } from "@/data/store";
import type { Role } from "@/types";

/** Hanya merender isi bila pengguna login dengan peran yang sesuai. */
export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const ready = useHydrated();
  const session = useStore((s) => s.session);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!session) navigate({ to: "/login", search: { reason: "auth" }, replace: true });
    else if (session.role !== role) navigate({ to: session.role === "admin" ? "/admin" : "/mahasiswa", replace: true });
  }, [ready, session, role, navigate]);

  if (!ready || session?.role !== role)
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground" role="status">Memuat…</div>;
  return <>{children}</>;
}
