import { ALPHABET_ALPHANUMERIC_LOWER } from "../constants/alphabet";

/** Ambil objek crypto global (browser, Node >= 19, Cloudflare Workers). */
function getCrypto(): Crypto | undefined {
  const globalScope = globalThis as { crypto?: Crypto };
  return globalScope.crypto;
}

/** Hasilkan byte acak aman (crypto). */
function randomValues(length: number): Uint8Array {
  const crypto = getCrypto();
  if (crypto?.getRandomValues === undefined) {
    throw new Error(
      "Secure random source (crypto.getRandomValues) is unavailable in this environment",
    );
  }
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/**
 * Hasilkan ID acak aman dengan rejection sampling.
 *
 * @param size Panjang ID. Default 21.
 * @param alphabet Alfabet karakter yang diizinkan. Default alfanumerik huruf kecil.
 *
 * @example
 * generateId() // "abc123xyz456..."
 * generateId(8, ALPHABET_HEX) // "f3a9c1d2"
 */
export function generateId(size = 21, alphabet: string = ALPHABET_ALPHANUMERIC_LOWER): string {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("size must be a positive integer");
  }
  const characters = [...alphabet];
  if (characters.length === 0) {
    throw new RangeError("alphabet must not be empty");
  }
  if (characters.length > 256) {
    throw new RangeError("alphabet must have at most 256 characters");
  }

  const alphabetSize = characters.length;
  const maxAcceptable = 256 - (256 % alphabetSize);
  let out = "";
  let buffer: Uint8Array = new Uint8Array(0);
  let index = 0;

  while (out.length < size) {
    if (index >= buffer.length) {
      buffer = randomValues(size);
      index = 0;
    }
    const byte = buffer[index];
    index += 1;
    if (byte === undefined) continue;
    if (byte < maxAcceptable) {
      out += characters[byte % alphabetSize] as string;
    }
  }
  return out;
}

/** Alias {@link generateId} dengan ukuran default 21 (gaya nanoid). */
export const generateNanoId = generateId;

/**
 * Hasilkan UUID v4.
 */
export function generateUuid(): string {
  const crypto = getCrypto();
  if (crypto?.randomUUID !== undefined) return crypto.randomUUID();

  const bytes = randomValues(16);
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20,
  )}-${hex.slice(20)}`;
}

/**
 * Buat generator ID dengan konfigurasi tetap.
 *
 * @example
 * const newId = createIdGenerator(16, ALPHABET_HEX);
 * newId(); // "a1b2c3d4..."
 */
export function createIdGenerator(
  size = 21,
  alphabet: string = ALPHABET_ALPHANUMERIC_LOWER,
): () => string {
  return () => generateId(size, alphabet);
}

/**
 * Hasilkan token acak hex.
 *
 * @example
 * generateToken(32) // "9f86d081884c7d659a2f..."
 */
export function generateToken(bytes = 32): string {
  return Array.from(randomValues(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
