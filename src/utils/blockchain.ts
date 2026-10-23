export { sha256Hex, hashFile } from "@/services/hash";

const pad = (n: number) => String(n).padStart(2, "0");
export function nowStamp(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export const short = (s: string, a = 10, b = 6) => (s && s.length > a + b + 1 ? `${s.slice(0, a)}…${s.slice(-b)}` : s || "—");

export const formatDate = (d: string) => {
  if (!d) return "—";
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};
