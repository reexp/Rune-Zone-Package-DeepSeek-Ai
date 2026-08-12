/**
 * Kumpulan alfabet yang dipakai untuk generator ID acak.
 * Semua konstanta bersifat `as const` dan hanya berisi string karakter tunggal.
 */

/** Digit 0–9. */
export const ALPHABET_NUMERIC = "0123456789" as const;

/** Huruf kecil a–z. */
export const ALPHABET_ALPHA_LOWER = "abcdefghijklmnopqrstuvwxyz" as const;

/** Huruf besar A–Z. */
export const ALPHABET_ALPHA_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" as const;

/** Gabungan huruf besar dan kecil. */
export const ALPHABET_ALPHA = `${ALPHABET_ALPHA_LOWER}${ALPHABET_ALPHA_UPPER}` as const;

/** Huruf besar + kecil + digit. */
export const ALPHABET_ALPHANUMERIC = `${ALPHABET_ALPHA}${ALPHABET_NUMERIC}` as const;

/** Huruf kecil + digit (paling umum untuk ID publik). */
export const ALPHABET_ALPHANUMERIC_LOWER = `${ALPHABET_ALPHA_LOWER}${ALPHABET_NUMERIC}` as const;

/** Base32 (RFC 4648) — huruf besar + 2–7. */
export const ALPHABET_BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567" as const;

/** Heksadesimal huruf kecil. */
export const ALPHABET_HEX = "0123456789abcdef" as const;

/** URL-safe: huruf, digit, `-`, `_` (64 karakter). */
export const ALPHABET_URL_SAFE =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-" as const;
