import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "./kit";
import { explain, type ExplainInput } from "@/services/ai";

export function AIExplanation(props: ExplainInput) {
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<{ text: string; fromAI: boolean } | null>(null);
  return (
    <div className="glass-inset p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Penjelasan AI (bukan pengganti verifikasi hash)</p>
      {res ? (
        <div className="mt-2 space-y-1">
          <p className="text-sm">{res.text}</p>
          {!res.fromAI && <p className="text-xs text-muted-foreground">AI sedang tidak tersedia — ini penjelasan standar.</p>}
        </div>
      ) : (
        <Button variant="subtle" size="sm" className="mt-2" disabled={loading} onClick={async () => { setLoading(true); setRes(await explain(props)); setLoading(false); }}>
          {loading ? <><Loader2 className="size-4 animate-spin" /> Memproses…</> : <><Sparkles className="size-4" /> Jelaskan dengan AI</>}
        </Button>
      )}
    </div>
  );
}
