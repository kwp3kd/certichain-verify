export async function sha256Hex(data: ArrayBuffer | string): Promise<string> {
  const buf = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export class FileReadError extends Error {
  constructor() {
    super("File tidak dapat dibaca. Pastikan format PDF.");
  }
}

export async function hashFile(file: File): Promise<string> {
  try {
    return await sha256Hex(await file.arrayBuffer());
  } catch {
    throw new FileReadError();
  }
}

/** Satu-satunya penentu VALID / TIDAK SESUAI: kedua hash harus sama persis. AI tidak terlibat. */
export function compareHashes(certificateHash: string | null | undefined, recordedHash: string | null | undefined): boolean {
  if (!certificateHash || !recordedHash) return false;
  return certificateHash.trim().toUpperCase() === recordedHash.trim().toUpperCase();
}
