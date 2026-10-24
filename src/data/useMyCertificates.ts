import { useStore } from "./store";

/** Sertifikat milik mahasiswa yang login (sudah disaring oleh izin database berdasarkan email penerima). */
export function useMyCertificates() {
  return useStore((s) => s.certificates);
}
