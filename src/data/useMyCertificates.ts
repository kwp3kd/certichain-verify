import { useMemo } from "react";
import { useStore } from "./store";

export function useMyCertificates() {
  const nim = useStore((s) => s.session?.nim);
  const all = useStore((s) => s.certificates);
  return useMemo(() => all.filter((c) => c.studentNim === nim), [all, nim]);
}
