import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, FileText, FilePlus2, ShieldCheck, Link2, History } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Dashboard Admin — Sahabat" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <DashboardLayout
      role="admin"
      nav={[
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { to: "/admin/sertifikat", label: "Sertifikat", icon: FileText },
        { to: "/admin/tambah", label: "Tambah Sertifikat", icon: FilePlus2 },
        { to: "/admin/verifikasi", label: "Verifikasi", icon: ShieldCheck },
        { to: "/admin/blockchain", label: "Blockchain", icon: Link2 },
        { to: "/admin/aktivitas", label: "Aktivitas", icon: History },
      ]}
    />
  ),
});
