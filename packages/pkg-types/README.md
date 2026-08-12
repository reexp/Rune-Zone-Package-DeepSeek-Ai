# @runezone/rune-types

> Core shared types, constants, dan DI symbols untuk **RuneZone Shared SDK**.
> **Layer 0** — zero runtime dependency.

---

## 1. Tujuan Package

`@runezone/rune-types` adalah fondasi tipe dari seluruh ekosistem RuneZone.
Semua package lain (`rune-utils`, `rune-errors`, `rune-db`, dst.) mengonsumsi
kontrak tipe dari package ini sehingga:

- **Satu sumber kebenaran** untuk tipe domain (ID, Result, Pagination, Event, Runtime).
- **Zero dependency** — aman dipakai di Node, Edge (Cloudflare Workers), dan Browser.
- **Type-safe end-to-end** dari repository → REST API → SDK client.
- **Tree-shakable** — hampir seluruh isinya murni tipe (tidak ada runtime value).

## 2. Dependency

| Jenis | Package | Keterangan |
| --- | --- | --- |
| Runtime | — | **Tidak ada** (zero-dependency) |
| Dev | `typescript`, `tsup`, `vitest`, `eslint`, `prettier`, `rimraf` | Tooling build & quality |

## 3. Struktur Folder

```
packages/pkg-types/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── README.md
├── CHANGELOG.md
├── LICENSE
├── src/
│   ├── types/          # Kontrak tipe murni
│   │   ├── base.ts
│   │   ├── event.ts
│   │   ├── id.ts
│   │   ├── pagination.ts
│   │   ├── result.ts
│   │   ├── runtime.ts
│   │   └── timestamp.ts
│   ├── constants/      # Nilai runtime (murni konstanta)
│   │   ├── limits.ts
│   │   ├── runtime.ts
│   │   └── symbols.ts
│   ├── helpers/        # Utilitas type-level
│   │   └── type-level.ts
│   └── index.ts        # Barrel export
├── tests/              # Unit test (type-level + runtime)
├── examples/           # Contoh penggunaan
└── docs/
    └── api.md          # API reference
```

## 4. Package.json

```json
{
  "name": "@runezone/rune-types",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": false,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

## 5. Tsconfig

```json
{
  "extends": "@runezone/tsconfig/base.json",
  "compilerOptions": { "rootDir": ".", "noEmit": true },
  "include": ["src", "tests", "examples", "tsup.config.ts", "vitest.config.ts"],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

## 6. Tsup Config

```ts
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  splitting: false,
  target: "es2022",
});
```

## 7. Source Code

Lihat `src/` — penjelasan tiap file:

| File | Isi |
| --- | --- |
| `types/base.ts` | Brand, Dict, Maybe, DeepPartial, JSONValue, dsb. |
| `types/id.ts` | `EntityId`, `IdPrefix`, `IdGeneratorName` (branded). |
| `types/result.ts` | Kontrak `Result<T, E>` (Ok/Err union). |
| `types/pagination.ts` | `Page`, `CursorPage`, `OrderBy`, meta. |
| `types/timestamp.ts` | `UnixSeconds`, `UnixMillis`, `DurationMillis`. |
| `types/runtime.ts` | `RuntimeName`, `PackagePlatform`. |
| `types/event.ts` | `EventPayload`, `EventHandler`, `EventDefinition`. |
| `constants/limits.ts` | Batas default (page size, batch, upload, dst.). |
| `constants/runtime.ts` | `RUNTIME_NAMES`, `PACKAGE_PLATFORMS`, locale default. |
| `constants/symbols.ts` | `createToken`, `InjectionToken`, registry `TOKENS`. |
| `helpers/type-level.ts` | `Equal`, `IsAny`, `RequireAtLeastOne`, `UnionToIntersection`, dst. |

## 8. Penjelasan Setiap File

Dokumentasi lengkap tiap export ada di [`docs/api.md`](./docs/api.md).

## 9. Cara Install

```bash
pnpm install
```

Package sudah otomatis terhubung via workspace (`workspace:*`).

## 10. Cara Build

```bash
pnpm --filter @runezone/rune-types build
# atau dari folder package
pnpm build
```

## 11. Cara Lint

```bash
pnpm --filter @runezone/rune-types lint
```

## 12. Cara Test

```bash
pnpm --filter @runezone/rune-types test
pnpm --filter @runezone/rune-types test:coverage
```

## 13. Cara Publish

```bash
pnpm changeset add          # buat changeset di root
pnpm changeset version      # bump versi
pnpm changeset publish      # publish ke npm (butuh NPM_TOKEN)
```

## 14. Contoh Penggunaan

```ts
import { createToken, DEFAULT_PAGE_SIZE } from "@runezone/rune-types";
import type { EntityId, Page, Result, RuntimeName } from "@runezone/rune-types";

const userId: EntityId = "usr_01J..." as EntityId;
const runtime: RuntimeName = "node";

function findUser(id: EntityId): Result<{ name: string }, Error> {
  return { ok: true, value: { name: "Rune" } };
}

const page: Page<number> = {
  items: [1, 2, 3],
  meta: { page: 1, pageSize: DEFAULT_PAGE_SIZE, totalItems: 3, totalPages: 1,
          hasNextPage: false, hasPreviousPage: false },
};

const Database = createToken<{ connect(): Promise<void> }>("database");
```

## 15. Hasil Pengecekan

| Perintah | Hasil |
| --- | --- |
| `pnpm lint` | ✅ ESLint clean (0 error) |
| `pnpm typecheck` | ✅ tsc strict clean |
| `pnpm test` | ✅ seluruh test lulus |
| `pnpm build` | ✅ dist (esm + cjs + d.ts) |

## 16. Error & Cara Memperbaiki

| Error | Solusi |
| --- | --- |
| `Cannot find module '@runezone/tsconfig/base.json'` | Jalankan `pnpm install` di root |
| Import relatif tanpa ekstensi gagal di build | Gunakan `moduleResolution: bundler` (sudah di preset) |
| Perubahan tipe tidak tersebar | Selalu export via barrel `src/index.ts` |

## 17. Best Practice

- Jangan tambahkan runtime dependency ke package ini (pertahankan Layer 0).
- Tipe baru yang dipakai > 1 package harus ditaruh di sini.
- Gunakan `Brand` untuk ID dan nilai berdomain (jangan string polos).
- Jangan export tipe yang tidak terpakai — jaga API kecil dan stabil.

---

## Lisensi

MIT © 2026 RuneZone
