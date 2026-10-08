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
  blockchainHash: string;
  transactionId: string;
  blockNumber: number;
  issuerWallet: string;
  timestamp: string;
  verificationStatus: "VALID" | "INVALID";
  blockchainStatus: "RECORDED" | "NOT_RECORDED";
};

export type Activity = {
  id: string;
  message: string;
  at: string;
  kind: "issue" | "record" | "verify" | "warn";
};

export type Role = "admin" | "mahasiswa";

export type Session = { role: Role; name: string; nim?: string };
