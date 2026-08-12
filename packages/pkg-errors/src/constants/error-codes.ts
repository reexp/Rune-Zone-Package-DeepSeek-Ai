import type { StandardErrorCode } from "../types";

/**
 * Kode error standar RuneZone.
 *
 * Dipakai sebagai nilai default di kelas error dan sebagai `code` saat
 * serialisasi. Key dan value sengaja identik agar aman disimpan/dikirim.
 */
export const ERROR_CODES: Record<StandardErrorCode, StandardErrorCode> = {
  UNKNOWN: "UNKNOWN",
  INTERNAL: "INTERNAL",
  CONFIGURATION: "CONFIGURATION",
  VALIDATION: "VALIDATION",
  AUTHENTICATION: "AUTHENTICATION",
  AUTHORIZATION: "AUTHORIZATION",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMIT: "RATE_LIMIT",
  TIMEOUT: "TIMEOUT",
  NETWORK: "NETWORK",
  STORAGE: "STORAGE",
  DATABASE: "DATABASE",
  UNSUPPORTED: "UNSUPPORTED",
  CANCELLED: "CANCELLED",
};

/** Seluruh kode standar sebagai array — untuk Set/validasi. */
export const STANDARD_ERROR_CODES: readonly StandardErrorCode[] = [
  "UNKNOWN",
  "INTERNAL",
  "CONFIGURATION",
  "VALIDATION",
  "AUTHENTICATION",
  "AUTHORIZATION",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMIT",
  "TIMEOUT",
  "NETWORK",
  "STORAGE",
  "DATABASE",
  "UNSUPPORTED",
  "CANCELLED",
] as const;
