import { env } from "@/config/env";
import { forwardRef, useEffect, useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { CheckCircle2, AlertTriangle, Search as SearchIcon, X, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
  ghost: "bg-glass ring-1 ring-border hover:bg-popover font-medium text-foreground",
  subtle: "bg-accent text-accent-foreground hover:bg-accent/80 font-medium",
  danger: "bg-warn text-warn-foreground hover:bg-warn/90 font-semibold",
  link: "text-primary underline-offset-4 hover:underline font-medium px-0",
};
const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-4 text-sm", lg: "h-12 px-5 text-base" };

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, ...p },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        variant !== "link" && sizes[size],
        className,
      )}
      {...p}
    />
  );
});
export const buttonClass = (variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", extra = "") =>
  cn("inline-flex items-center justify-center gap-2 rounded-xl transition-colors", variants[variant], sizes[size], extra);

export function Field({ label, error, hint, children, id }: { label: string; error?: string | undefined; hint?: string | undefined; children: ReactNode; id: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-warn">
          <AlertTriangle className="size-3.5" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl bg-glass px-3.5 text-sm ring-1 ring-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring aria-[invalid=true]:ring-warn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(inputClass, className)} {...p} />;
});

export function Select({ className, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputClass, "pr-8", className)} {...p} />;
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const id = useId();
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">Cari</label>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(inputClass, "pl-10")} />
    </div>
  );
}

export function StatusBadge({ status, size = "sm" }: { status: "VALID" | "INVALID"; size?: "sm" | "lg" }) {
  const ok = status === "VALID";
  const Icon = ok ? CheckCircle2 : AlertTriangle;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold ring-1",
        ok ? "bg-verify/10 text-verify ring-verify/25" : "bg-warn/10 text-warn ring-warn/25",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
      )}
    >
      <Icon className={size === "sm" ? "size-3.5" : "size-4"} aria-hidden />
      {ok ? "Valid" : "Tidak sesuai"}
    </span>
  );
}

export function ChainBadge({ status }: { status: "RECORDED" | "NOT_RECORDED" }) {
  const ok = status === "RECORDED";
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium", ok ? "text-primary" : "text-muted-foreground")}>
      <span className={cn("size-1.5 rounded-full", ok ? "bg-primary" : "bg-muted-foreground")} aria-hidden />
      {ok ? "Tercatat" : "Belum tercatat"}
    </span>
  );
}

export function StatCard({ label, value, hint, tone = "default", icon }: { label: string; value: ReactNode; hint?: string | undefined; tone?: "default" | "verify" | "warn" | "primary"; icon?: ReactNode }) {
  const toneCls = { default: "text-foreground", verify: "text-verify", warn: "text-warn", primary: "text-primary" }[tone];
  const iconCls = { default: "bg-muted text-foreground", verify: "bg-verify/10 text-verify", warn: "bg-warn/10 text-warn", primary: "bg-primary/10 text-primary" }[tone];
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", iconCls)}>{icon}</span>}
      </div>
      <p className={cn("mt-2 font-display text-4xl font-semibold tracking-tight", toneCls)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md rounded-2xl bg-popover p-6 shadow-glass ring-1 ring-border animate-rise" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
          <button onClick={onClose} aria-label="Tutup" className="grid size-9 place-items-center rounded-lg hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">{children}</div>
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="glass-inset flex flex-col items-center px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><Inbox className="size-5" aria-hidden /></span>
      <p className="mt-4 font-display text-xl font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string | undefined; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{desc}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SimNotice({ className }: { className?: string | undefined }) {
  if (!env.isBlockchainMock)
    return (
      <span className={cn("inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary", className)}>
        Terhubung ke smart contract · Solana Devnet
      </span>
    );
  return (
    <span role="note" className={cn("inline-flex items-center gap-2 rounded-full bg-warn/10 px-3 py-1 text-xs font-medium text-warn", className)}>
      Mode Simulasi — smart contract belum terhubung
    </span>
  );
}
