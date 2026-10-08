import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button, Modal, SimNotice } from "@/components/kit";
import { actions, useHydrated, useStore } from "@/data/store";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

export type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean };

export function DashboardLayout({ role, nav }: { role: Role; nav: NavItem[] }) {
  const session = useStore((s) => s.session);
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (hydrated && session?.role !== role) navigate({ to: "/login", search: { role } });
  }, [hydrated, session, role, navigate]);

  if (!hydrated || session?.role !== role)
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground" role="status">Memuat…</div>;

  const Side = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5"><Brand /></div>
      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Menu utama">
        {nav.map((n) => {
          const active = n.exact ? path === n.to : path === n.to || path.startsWith(n.to + "/");
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-glass hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <n.icon className="size-4" aria-hidden /> {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="mb-2 px-3 py-2">
          <p className="truncate text-sm font-medium">{session.name}</p>
          <p className="text-xs text-muted-foreground">{role === "admin" ? "Admin / Panitia" : `Mahasiswa · ${session.nim}`}</p>
        </div>
        <button onClick={() => setConfirm(true)} className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-warn/10 hover:text-warn">
          <LogOut className="size-4" aria-hidden /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-glass backdrop-blur-xl lg:block">{Side}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-popover shadow-glass animate-in slide-in-from-left">
            <button onClick={() => setOpen(false)} aria-label="Tutup menu" className="absolute right-3 top-3 grid size-10 place-items-center rounded-lg hover:bg-muted"><X className="size-5" /></button>
            {Side}
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-glass px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setOpen(true)} aria-label="Buka menu" className="grid size-11 place-items-center rounded-xl hover:bg-muted lg:hidden"><Menu className="size-5" /></button>
          <SimNotice className="hidden sm:inline-flex" />
          <p className="truncate text-sm text-muted-foreground">Halo, <span className="font-medium text-foreground">{session.name}</span></p>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Keluar dari akun?"
        footer={<>
          <Button variant="ghost" onClick={() => setConfirm(false)}>Batal</Button>
          <Button variant="danger" onClick={() => { actions.logout(); navigate({ to: "/" }); }}>Ya, logout</Button>
        </>}
      >
        Anda perlu login kembali untuk mengakses dashboard.
      </Modal>
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <div className="animate-rise">{children}</div>;
}
