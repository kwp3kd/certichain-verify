import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, PageHeader } from "@/components/kit";
import { ActivityList } from "@/components/ActivityList";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/admin/aktivitas")({ component: Page });

function Page() {
  const acts = useStore((s) => s.activities);
  return (
    <div className="animate-rise">
      <PageHeader title="Riwayat Aktivitas" desc="Catatan penerbitan, pencatatan, dan verifikasi sertifikat." />
      {acts.length ? <div className="glass-card px-6 py-2"><ActivityList items={acts} /></div> : <EmptyState title="Belum ada aktivitas" text="Aktivitas akan muncul setelah sertifikat diterbitkan." />}
    </div>
  );
}
