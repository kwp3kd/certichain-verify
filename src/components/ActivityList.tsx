import { FilePlus2, Link2, ShieldCheck, AlertTriangle } from "lucide-react";
import type { Activity } from "@/types";

const icons = { issue: FilePlus2, record: Link2, verify: ShieldCheck, warn: AlertTriangle };
const tones = { issue: "bg-primary/10 text-primary", record: "bg-primary/10 text-primary", verify: "bg-verify/10 text-verify", warn: "bg-warn/10 text-warn" };

export function ActivityList({ items }: { items: Activity[] }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((a) => {
        const I = icons[a.kind];
        return (
          <li key={a.id} className="flex items-start gap-3 py-3">
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tones[a.kind]}`}><I className="size-4" aria-hidden /></span>
            <div className="min-w-0">
              <p className="text-sm">{a.message}</p>
              <p className="font-mono text-xs text-muted-foreground">{a.at}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
