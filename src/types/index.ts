export type Certificate = {
  id: string;
  studentName: string;
  studentNim: string;
  activityName: string;
  activityType: string;
  organizer: string;
  eventDate: string;
  issuedAt: string;
  fileHash: string;
  /** Hash pembanding: dari akun blockchain, atau dari database saat mode simulasi. */
  blockchainHash: string;
  transactionId: string;
  blockNumber: number;
  issuerWallet: string;
  timestamp: string;
  verificationStatus: "VALID" | "INVALID";
  blockchainStatus: "RECORDED" | "NOT_RECORDED";
  recipientEmail?: string;
  filePath?: string;
};

export type Activity = {
  id: string;
  message: string;
  at: string;
  kind: "issue" | "record" | "verify" | "warn";
};

export type Role = "admin" | "mahasiswa";

export type Session = { userId: string; email: string; role: Role; name: string; nim?: string; wallet?: string | null; pendingAdmin?: boolean };
