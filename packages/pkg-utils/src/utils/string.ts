import { get } from "./object";

/**
 * Ubah huruf pertama menjadi huruf besar.
 */
export function capitalize(value: string): string {
  if (value.length === 0) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Ubah huruf pertama menjadi huruf kecil.
 */
export function uncapitalize(value: string): string {
  if (value.length === 0) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/**
 * Pecah string (camelCase, snake_case, kebab-case, spasi) menjadi kata-kata.
 */
export function toWords(value: string): string[] {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Ubah string menjadi camelCase. */
export function camelCase(value: string): string {
  return toWords(value)
    .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word.toLowerCase())))
    .join("");
}

/** Ubah string menjadi PascalCase. */
export function pascalCase(value: string): string {
  return toWords(value)
    .map((word) => capitalize(word.toLowerCase()))
    .join("");
}

/** Ubah string menjadi snake_case. */
export function snakeCase(value: string): string {
  return toWords(value)
    .map((word) => word.toLowerCase())
    .join("_");
}

/** Ubah string menjadi kebab-case. */
export function kebabCase(value: string): string {
  return toWords(value)
    .map((word) => word.toLowerCase())
    .join("-");
}

/** Ubah string menjadi CONSTANT_CASE (UPPER_SNAKE). */
export function constantCase(value: string): string {
  return toWords(value)
    .map((word) => word.toUpperCase())
    .join("_");
}

/** Ubah string menjadi Title Case. */
export function titleCase(value: string): string {
  return toWords(value)
    .map((word) => capitalize(word))
    .join(" ");
}

/** Opsi untuk {@link slugify}. */
export interface SlugifyOptions {
  /** Pemisah antar kata. Default `-`. */
  separator?: string;
  /** Ubah ke huruf kecil. Default `true`. */
  lower?: boolean;
}

/**
 * Ubah string menjadi slug URL yang aman (tanpa diakritik).
 *
 * @example
 * slugify("Halo Dunia!") // "halo-dunia"
 */
export function slugify(value: string, options: SlugifyOptions = {}): string {
  const { separator = "-", lower = true } = options;
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const body = lower ? normalized.toLowerCase() : normalized;
  const escaped = escapeRegExp(separator);
  return body
    .replace(/[^a-z0-9]+/gi, separator)
    .replace(new RegExp(`(?:${escaped})+`, "g"), separator)
    .replace(new RegExp(`^${escaped}|${escaped}$`, "g"), "");
}

/** Opsi untuk {@link truncate}. */
export interface TruncateOptions {
  /** Panjang maksimum (termasuk suffix). Default 100. */
  length?: number;
  /** Suffix. Default `…`. */
  suffix?: string;
}

/**
 * Potong string agar tidak melebihi panjang tertentu.
 */
export function truncate(value: string, options: TruncateOptions = {}): string {
  const { length = 100, suffix = "…" } = options;
  if (value.length <= length) return value;
  const cut = Math.max(0, length - suffix.length);
  return `${value.slice(0, cut).trimEnd()}${suffix}`;
}

/**
 * Sensor nilai dengan menyisakan beberapa karakter pertama dan terakhir.
 *
 * @example
 * mask("1234567890", 4, 2) // "1234••••90"
 */
export function mask(value: string, keepFirst = 4, keepLast = 4, maskChar = "•"): string {
  if (value.length <= keepFirst + keepLast) return maskChar.repeat(value.length);
  const middle = value.length - keepFirst - keepLast;
  return `${value.slice(0, keepFirst)}${maskChar.repeat(middle)}${value.slice(-keepLast)}`;
}

/**
 * Escape semua karakter khusus RegExp pada string.
 */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Interpolasi template `{key}` dengan data.
 * Kunci mendukung dot notation (`user.name`).
 *
 * @example
 * interpolate("Halo {name}!", { name: "Rune" }) // "Halo Rune!"
 */
export function interpolate(
  template: string,
  data: Record<string, unknown>,
  pattern: RegExp = /\{([^}]+)\}/g,
): string {
  return template.replace(pattern, (match, key: string) => {
    const value = get(data, key.trim());
    return value === undefined ? match : String(value);
  });
}

/**
 * Buang seluruh tag HTML, sisakan teks polos.
 */
export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Hapus whitespace berlebih (collapse) dari string.
 */
export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** `true` jika string tidak kosong setelah di-trim. */
export const isBlank = (value: string): boolean => value.trim().length === 0;

/** `true` jika string tidak kosong dan bukan whitespace. */
export const isNotBlank = (value: string): boolean => !isBlank(value);

/**
 * Ambil `count` kata pertama dari string.
 */
export function takeWords(value: string, count: number): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, Math.max(0, count)).join(" ");
}

/** Ubah string menjadi array karakter unik. */
export function uniqueChars(value: string): string {
  return [...new Set(value)].join("");
}

/** Balik urutan karakter. */
export function reverse(value: string): string {
  return [...value].reverse().join("");
}

/** `true` jika string mengandung huruf, angka, `-`, atau `_` saja. */
export function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
