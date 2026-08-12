import type { PackagePlatform, RuntimeName } from "../types/runtime";

/** Seluruh nama runtime yang didukung. */
export const RUNTIME_NAMES: readonly RuntimeName[] = [
  "node",
  "edge",
  "browser",
  "worker",
  "unknown",
] as const;

/** Seluruh platform package yang didukung. */
export const PACKAGE_PLATFORMS: readonly PackagePlatform[] = [
  "node",
  "edge",
  "browser",
  "universal",
] as const;

/** Locale default untuk konten & i18n. */
export const DEFAULT_LOCALE = "en";

/** Timezone default untuk timestamp & penjadwalan. */
export const DEFAULT_TIMEZONE = "UTC";
