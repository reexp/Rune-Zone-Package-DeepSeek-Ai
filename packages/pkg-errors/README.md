# @runezone/rune-errors

Typed error layer untuk seluruh ekosistem RuneZone — CMS, Admin Dashboard, Website, Mobile, Cloudflare Workers, API SDK, CLI, hingga Third-Party Apps.

Package ini adalah **Layer 1** dari RuneZone Shared SDK: satu-satunya dependensinya adalah [`@runezone/rune-types`](https://www.npmjs.com/package/@runezone/rune-types).

## Fitur

- ✅ Kelas dasar `RuneError` + **14 kelas error bertipe** (404, 401, 429, 409, 504, dst.)
- ✅ Kode error standar + dukungan kode kustom tanpa kehilangan autocomplete
- ✅ Pemetaan otomatis `code → status HTTP` untuk Route Handler / API
- ✅ Serialisasi & deserialisasi aman untuk JSON, logging, dan body respons API
- ✅ Normalisasi error — catch apa pun (`Error`, string, object, primitif) menjadi `RuneError`
- ✅ Type guard lengkap (`isRuneError`, `isSerializedError`, `isFieldErrors`, dst.)
- ✅ Berjalan di Node.js, Edge Runtime, Cloudflare Workers, dan browser
- ✅ Tree-shaking friendly (`sideEffects: false`), ESM + CJS, TypeScript strict
- ✅ 100% diketik — tanpa `any`

## Instalasi

```bash
pnpm add @runezone/rune-errors
```

## Quick Start

```ts
import { NotFoundError, serializeError, toHttpStatus } from "@runezone/rune-errors";

// Next.js Route Handler
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const post = await findPost("hello");
    if (!post) {
      throw new NotFoundError("Artikel tidak ditemukan", {
        details: { slug: "hello" },
      });
    }
    return NextResponse.json({ data: post });
  } catch (error) {
    // status diambil otomatis: 404
    return NextResponse.json(
      { error: serializeError(error, { includeStack: false }) },
      { status: toHttpStatus(error) },
    );
  }
}
```

## Ringkasan API

| Kategori | Ekspor |
| --- | --- |
| Kelas dasar | `RuneError` |
| Kelas bertipe | `InternalError`, `ConfigurationError`, `ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`, `RateLimitError`, `TimeoutError`, `NetworkError`, `StorageError`, `DatabaseError`, `UnsupportedError`, `CancelledError` |
| Helper | `normalizeError`, `getErrorMessage`, `serializeError`, `deserializeError`, `toHttpStatus`, `codeToHttpStatus` |
| Type guard | `isRuneError`, `isError`, `isErrorCode`, `isStandardErrorCode`, `isSerializedError`, `isFieldErrors` |
| Konstanta | `ERROR_CODES`, `STANDARD_ERROR_CODES`, `DEFAULT_STATUS_BY_CODE`, `ERROR_CLASS_BY_NAME`, `ERROR_CODE_BY_CLASS` |

Dokumentasi lengkap: [docs/api.md](./docs/api.md). Contoh lengkap: [examples/basic.ts](./examples/basic.ts).

## Scripts

```bash
pnpm build        # tsup → dist (ESM + CJS + d.ts)
pnpm dev          # build watch mode
pnpm lint         # ESLint (max-warnings 0)
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest
pnpm test:coverage# Vitest + coverage
pnpm format       # Prettier write
pnpm format:check # Prettier check
```

## FAQ

**Apa bedanya `RuneError.toJSON()` dan `serializeError()`?**
`toJSON()` menghasilkan bentuk ringkas aman untuk respons API (tanpa `stack`/`cause`). `serializeError()` menghasilkan bentuk lengkap untuk logging/observability, termasuk `stack` dan `cause` (dengan batas kedalaman).

**Bagaimana menambah error code khusus domain?**
Cukup gunakan string bebas pada opsi `code`, mis. `new RuneError("...", { code: "STRIPE_WEBHOOK_SIGNATURE" })`. Type `ErrorCode` tetap menampilkan autocomplete kode standar.

**Mengapa `isRuneError` punya fallback brand `isRuneError`?**
Agar deteksi tetap akurat bila aplikasi memiliki dua salinan library yang berbeda (duplikasi `instanceof`). Brand runtime memastikan hasil konsisten.

**Bisakah dipakai di Cloudflare Workers / Edge?**
Ya. Package tidak bergantung pada API Node.js apa pun (murni ECMAScript + `Error.cause` ES2022).

## Best Practice

1. Lempar kelas error yang spesifik, bukan `RuneError` generik.
2. Bawa metadata yang berguna di `details` — tetapi jangan taruh data sensitif.
3. Di Route Handler/API, gunakan `serializeError(err, { includeStack: false })` agar stack tidak bocor ke klien.
4. Untuk logging, gunakan `serializeError(err)` lengkap dengan stack.
5. Di blok `catch`, bungkus dengan `normalizeError(err)` agar semua error konsisten.

## License

[MIT](./LICENSE)
