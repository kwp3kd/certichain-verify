import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Award, ShieldCheck, User } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export const Route = createFileRoute("/mahasiswa")({
  head: () => ({ meta: [{ title: "Dashboard Mahasiswa — Sahabat" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <DashboardLayout
      role="mahasiswa"
      nav={[
        { to: "/mahasiswa", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { to: "/mahasiswa/sertifikat", label: "Sertifikat Saya", icon: Award },
        { to: "/mahasiswa/verifikasi", label: "Verifikasi", icon: ShieldCheck },
        { to: "/mahasiswa/profil", label: "Profil", icon: User },
      ]}
    />
  ),
});
