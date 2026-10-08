import type { Activity, Certificate } from "@/types";

// SELURUH data di bawah ini fiktif / dummy. Tidak ada transaksi blockchain sungguhan.
export const UNIVERSITY = "Universitas Nusantara Digital";
export const ISSUER_WALLET = "0x82A7c41E9b03D5f6aA18e27C0b9D4e3f1C6091F2";
export const ACTIVITY_TYPES = ["Seminar", "Workshop", "Pelatihan", "Lomba", "Kepanitiaan"];

export const DUMMY_ACCOUNTS = {
  admin: { email: "admin@kampus.ac.id", password: "admin123", name: "Panitia BEM" },
  mahasiswa: { email: "rani@mhs.kampus.ac.id", password: "mhs123", name: "Rani Kusuma", nim: "2108101" },
};

const h = (s: string) => s.padEnd(64, "0").slice(0, 64).toUpperCase();

const base = (
  n: number,
  name: string,
  nim: string,
  activity: string,
  type: string,
  date: string,
  hash: string,
  block: number,
  tx: string,
  valid = true,
): Certificate => ({
  id: `SRT-2026-${String(n).padStart(4, "0")}`,
  studentName: name,
  studentNim: nim,
  activityName: activity,
  activityType: type,
  organizer: "BEM " + UNIVERSITY,
  eventDate: date,
  issuedAt: date,
  fileHash: valid ? h(hash) : h(hash.split("").reverse().join("")),
  blockchainHash: h(hash),
  transactionId: "0x" + tx.padEnd(64, "a").slice(0, 64).toLowerCase(),
  blockNumber: block,
  issuerWallet: ISSUER_WALLET,
  timestamp: `${date} 10:30:25`,
  verificationStatus: valid ? "VALID" : "INVALID",
  blockchainStatus: "RECORDED",
});

export const SEED_CERTIFICATES: Certificate[] = [
  base(1, "Rani Kusuma", "2108101", "Seminar Keamanan Data Nasional", "Seminar", "2026-09-15", "A8F91C72B4E91D3F5C0E7A2B9D14F6E8", 18294531, "7a91bc82d4f6e01c3b"),
  base(2, "Bima Saputra", "2108102", "Seminar Keamanan Data Nasional", "Seminar", "2026-09-15", "4B2E77A90C3F5A1D8E6B2C9F0A7D3E51", 18294604, "3f77d1a2c9e05b84d1"),
  base(3, "Citra Lestari", "2108103", "Seminar Keamanan Data Nasional", "Seminar", "2026-09-15", "D1C05E88B7A2F3940E6C1B5A8D7F2C03", 18294655, "9b2c4ef01a7d36c58e", false),
  base(4, "Rani Kusuma", "2108101", "Workshop Literasi Digital", "Seminar", "2026-08-20", "7E3A9C1F0B8D2E6A5C4F1B7D9E0A3C82", 18120044, "c41d0e9a2b7f63e81a"),
  base(5, "Dimas Pratama", "2108104", "Workshop Literasi Digital", "Seminar", "2026-08-20", "2F8B4D6E1A9C3E7B0D5F2A8C6E4B1D97", 18120102, "e82b5f13c0d94a76b2"),
  base(6, "Eka Wulandari", "2108105", "Seminar Karier Teknologi", "Seminar", "2026-07-11", "9C1E5A3F7B2D8E0C4A6F1B9D3E7C5A20", 17944310, "1d6a8c2f4e0b97d35c"),
  base(7, "Fajar Nugroho", "2108106", "Seminar Karier Teknologi", "Seminar", "2026-07-11", "5A7C9E1B3D5F7A9C1E3B5D7F9A1C3E5B", 17944388, "8f3e1b7d5a2c06e94d"),
  base(8, "Rani Kusuma", "2108101", "Seminar Kewirausahaan Mahasiswa", "Seminar", "2026-06-05", "B3D5F7A9C1E3B5D7F9A1C3E5B7D9F1A3", 17702215, "5c2a9e7b3f1d84a06e"),
  base(9, "Gita Maharani", "2108107", "Seminar Kewirausahaan Mahasiswa", "Seminar", "2026-06-05", "E1F3A5B7C9D1E3F5A7B9C1D3E5F7A9B1", 17702290, "b7e4c2a0f8d61e39a5"),
  base(10, "Hadi Santoso", "2108108", "Seminar Kesehatan Mental", "Seminar", "2026-05-18", "0D2F4A6C8E0B2D4F6A8C0E2B4D6F8A0C", 17488102, "2a9f7d5c3b1e08f46c"),
  base(11, "Indah Permata", "2108109", "Seminar Kesehatan Mental", "Seminar", "2026-05-18", "6F8A0C2E4B6D8F0A2C4E6B8D0F2A4C6E", 17488177, "f0c8a6e4d2b19073e7"),
  base(12, "Joko Wibowo", "2108110", "Seminar Kesehatan Mental", "Seminar", "2026-05-18", "C4E6B8D0F2A4C6E8B0D2F4A6C8E0B2D4", 17488230, "6e4c2a0f8d6b41e2f9"),
];

export const SEED_ACTIVITIES: Activity[] = [
  { id: "a1", message: "SRT-2026-0003 ditandai perlu diperiksa (hash tidak cocok)", at: "2026-09-16 08:47", kind: "warn" },
  { id: "a2", message: "SRT-2026-0002 dicatat ke simulasi blockchain", at: "2026-09-15 10:32", kind: "record" },
  { id: "a3", message: "SRT-2026-0001 diterbitkan untuk Rani Kusuma", at: "2026-09-15 10:30", kind: "issue" },
  { id: "a4", message: "SRT-2026-0004 diverifikasi oleh pihak luar", at: "2026-09-02 14:12", kind: "verify" },
  { id: "a5", message: "SRT-2026-0005 diterbitkan untuk Dimas Pratama", at: "2026-08-20 11:05", kind: "issue" },
];
