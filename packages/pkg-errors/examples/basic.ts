/**
 * Contoh penggunaan @runezone/rune-errors.
 *
 * Jalankan dengan:
 *   pnpm --filter @runezone/rune-errors tsx examples/basic.ts
 *
 * atau langsung dari root monorepo:
 *   pnpm --filter @runezone/rune-errors exec tsx examples/basic.ts
 */
import {
  ERROR_CODES,
  NotFoundError,
  RateLimitError,
  RuneError,
  ValidationError,
  deserializeError,
  normalizeError,
  serializeError,
  toHttpStatus,
} from "../src/index";

function log(label: string, value: unknown): void {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(value, null, 2));
}

function main(): void {
  // 1. Lempar error bertipe — mis. dari Route Handler Next.js
  try {
    throw new NotFoundError("Artikel tidak ditemukan", {
      details: { resource: "article", slug: "hello-world" },
    });
  } catch (error) {
    log("toHttpStatus", { status: toHttpStatus(error) });
    log("serializeError (tanpa stack)", serializeError(error, { includeStack: false }));
  }

  // 2. Error validasi dengan fieldErrors
  try {
    throw new ValidationError("Data tidak valid", {
      fieldErrors: {
        email: ["Format email salah"],
        password: ["Minimal 8 karakter"],
      },
    });
  } catch (error) {
    const serialized = serializeError(error, { includeStack: false });
    log("ValidationError", serialized);
    // di klien: tampilkan pesan per field tanpa parsing teks
  }

  // 3. Rate limit
  try {
    throw new RateLimitError("Terlalu banyak percobaan", { retryAfter: 30 });
  } catch (error) {
    const restored = deserializeError(serializeError(error, { includeStack: false }));
    log("RateLimitError", {
      status: toHttpStatus(restored),
      retryAfter: restored instanceof RateLimitError ? restored.retryAfter : undefined,
    });
  }

  // 4. Normalisasi nilai apa pun di blok catch
  const failures: unknown[] = [
    new Error("koneksi terputus"),
    "token kedaluwarsa",
    42,
    null,
    { code: 123, message: "gagal dari object" },
  ];
  for (const failure of failures) {
    const normalized = normalizeError(failure, "Terjadi kesalahan tak dikenal");
    log("normalizeError", {
      code: normalized.code,
      message: normalized.message,
      status: toHttpStatus(normalized),
    });
  }

  // 5. Error custom code
  try {
    throw new RuneError("Webhook signature tidak valid", {
      code: "STRIPE_WEBHOOK_SIGNATURE",
      status: 400,
      details: { provider: "stripe" },
    });
  } catch (error) {
    log("Error custom", serializeError(error, { includeStack: false }));
  }

  // 6. Semua kode standar & status defaultnya
  const mapping = Object.entries(ERROR_CODES).map(([key, code]) => ({
    code,
    defaultStatus: toHttpStatus(new RuneError("x", { code })),
    key,
  }));
  log("Pemetaan code → status", mapping);
}

main();
