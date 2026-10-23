/**
 * Daftar alamat wallet Phantom (Solana) yang boleh mendaftar sebagai Admin/Panitia.
 * Tambahkan alamat publik wallet penerbit di sini (BUKAN private key / seed phrase).
 * Daftar ini juga diperiksa di server sebelum akses admin diberikan.
 */
export const AUTHORIZED_ISSUER_WALLETS: string[] = [
  // "Contoh: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
];

export const isAuthorizedIssuer = (address: string | null | undefined): boolean =>
  !!address && AUTHORIZED_ISSUER_WALLETS.some((w) => w.trim() === address.trim());
