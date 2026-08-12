import type { UserConfig } from "vitest";

/** Opsi untuk membuat konfigurasi Vitest per-package. */
export interface PackageVitestConfigOptions {
  /** Nama package (muncul di report runner). */
  name: string;
  /** Environment test: `"node"` (default) atau `"jsdom"`/`"happy-dom"`. */
  environment?: "node" | "jsdom" | "happy-dom" | "edge-runtime";
  /** Mengaktifkan globals (`describe`, `it`, `expect`) tanpa import. Default: `true`. */
  globals?: boolean;
}

/**
 * Factory konfigurasi Vitest untuk package RuneZone.
 *
 * @example
 * ```ts
 * import { definePackageConfig } from "@runezone/vitest-config";
 * export default definePackageConfig({ name: "rune-types" });
 * ```
 */
export declare function definePackageConfig(
  options: PackageVitestConfigOptions,
): UserConfig;
