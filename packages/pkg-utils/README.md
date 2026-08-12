# @runezone/rune-utils

> Utilitas umum (object, string, array, number, date, async, function, url, id)
> untuk **RuneZone Shared SDK**.
> **Layer 1** — hanya bergantung pada `@runezone/rune-types`.

---

## 1. Tujuan Package

`@runezone/rune-utils` menyediakan kumpulan utilitas murni yang dipakai bersama oleh
seluruh package ekosistem RuneZone (CMS, Dashboard, Web, Mobile, Workers, CLI, API SDK).

- **Zero framework binding** — murni TypeScript, berjalan di Node, Edge, dan Browser.
- **Immutable-first** — operasi object/array tidak memutasi input.
- **Type-safe & tree-shakable** — named export ESM, `sideEffects: false`.
- **Pola konsisten** — nama fungsi, guard, dan error mengikuti standar SDK.

## 2. Dependency

| Jenis | Package | Keterangan |
| --- | --- | --- |
| Runtime | `@runezone/rune-types` | Tipe dasar (branded type, dst.). |
| Dev | `typescript`, `tsup`, `vitest`, `eslint`, `prettier`, `rimraf` | Tooling build & quality |

## 3. Struktur Folder

```
packages/pkg-utils/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── README.md
├── CHANGELOG.md
├── LICENSE
├── docs/
│   └── api.md            # Referensi API lengkap
├── examples/
│   └── basic.ts          # Contoh penggunaan
├── src/
│   ├── constants/        # Alfabet untuk generator ID
│   ├── helpers/          # Type guards runtime
│   ├── types/            # Tipe utilitas ringan
│   ├── utils/            # Implementasi utilitas per domain
│   │   ├── object.ts
│   │   ├── string.ts
│   │   ├── array.ts
│   │   ├── number.ts
│   │   ├── date.ts
│   │   ├── async.ts
│   │   ├── function.ts
│   │   ├── url.ts
│   │   └── id.ts
│   └── index.ts          # Barrel export (public API)
└── tests/                # Unit test (Vitest) per modul
```

## 4. Instalasi

```bash
# Monorepo (pnpm workspace)
pnpm --filter @runezone/rune-utils install

# Konsumen npm
pnpm add @runezone/rune-utils
```

## 5. Quick Start

```ts
import { slugify, deepMerge, get, retry, generateUuid } from "@runezone/rune-utils";

const slug = slugify("RuneZone: Shared SDK!"); // "runezone-shared-sdk"
const config = deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
const name = get(config, "a.b"); // 1
const id = generateUuid(); // UUID v4

const result = await retry(async () => {
  return fetch("/api/v1/posts").then((r) => r.json());
}, { attempts: 3, delayMs: 100 });
```

## 6. Konfigurasi

| Opsi | Lokasi | Keterangan |
| --- | --- | --- |
| Build | `tsup.config.ts` | ESM + CJS, dts, sourcemap. |
| TypeScript | `tsconfig.json` | Strict, `verbatimModuleSyntax`. |
| Lint | `eslint.config.mjs` | Config shared `@runezone/eslint-config`. |
| Test | `vitest.config.ts` | Config shared `@runezone/vitest-config`. |

## 7. Perintah

```bash
pnpm --filter @runezone/rune-utils build          # tsup (ESM + CJS + d.ts)
pnpm --filter @runezone/rune-utils dev            # watch mode
pnpm --filter @runezone/rune-utils typecheck      # tsc --noEmit
pnpm --filter @runezone/rune-utils lint           # eslint
pnpm --filter @runezone/rune-utils test           # vitest run
pnpm --filter @runezone/rune-utils test:coverage  # vitest + coverage
pnpm --filter @runezone/rune-utils clean          # hapus dist & coverage
```

## 8. Publikasi

```bash
pnpm changeset add   # tulis deskripsi perubahan
pnpm changeset version
pnpm --filter @runezone/rune-utils publish --access public
```

## 9. API Reference

Lihat [docs/api.md](./docs/api.md) untuk daftar lengkap seluruh ekspor.

## 10. FAQ

**Q: Mengapa `slugify` menghasilkan `cafe-creme` untuk `Café & Crème`?**
Karena karakter non-ASCII dinormalisasi (NFKD) lalu akar di-strip, sehingga huruf
beraksen dipetakan ke pasangan ASCII dasarnya.

**Q: Apakah fungsi-fungsi aman untuk Cloudflare Workers?**
Ya. Tidak ada API Node-spesifik; ID memakai `globalThis.crypto` yang tersedia di
Workers, Edge, dan browser modern.

**Q: Apakah operasi object immutable?**
Ya. `set`, `deepMerge`, `pick`, `omit`, dst. tidak memutasi input; node yang tidak
berubah di-reuse (structural sharing).

## 11. Migration

Versi `0.x` belum stabil; perubahan breaking akan diumumkan via CHANGELOG dan
dikelola dengan Changesets. Selalu pin versi minor saat digunakan di production.

## 12. Best Practice

- Gunakan `import type` untuk semua impor tipe (didukung `verbatimModuleSyntax`).
- Jangan pernah import dari jalur internal (`src/utils/...`); gunakan barrel root.
- Lebih suka helper immutable dibanding mutasi manual agar mudah di-debug.
- Untuk ID publik, gunakan `generateNanoId()` atau `generateId(size, ALPHABET_URL_SAFE)`.

## 13. Lisensi

MIT — lihat [LICENSE](./LICENSE).
