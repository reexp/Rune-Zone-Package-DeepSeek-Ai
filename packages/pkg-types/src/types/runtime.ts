/**
 * Kontrak runtime & platform — menentukan di mana sebuah package
 * boleh berjalan (Node, Edge, Browser, Worker) dan bagaimana cara
 * membangunnya agar tetap portable.
 */

/** Nama runtime yang didukung ekosistem RuneZone. */
export type RuntimeName = "node" | "edge" | "browser" | "worker" | "unknown";

/**
 * Platform build sebuah package.
 *
 * - `node`: hanya berjalan di Node.js
 * - `edge`: berjalan di Edge Runtime (Next.js/Cloudflare)
 * - `browser`: berjalan di browser
 * - `universal`: aman di semua platform
 */
export type PackagePlatform = "node" | "edge" | "browser" | "universal";
