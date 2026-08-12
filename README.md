# RuneZone Shared SDK

> Enterprise-grade **Shared SDK** untuk seluruh ekosistem RuneZone —
> CMS Backend, Admin Dashboard, Website Frontend, Landing Page, Mobile Apps,
> Cloudflare Workers, API SDK, CLI, Third Party Apps, dan future products.

Dibangun dengan **Next.js App Router**, **React**, **TypeScript** (strict),
**Auth.js**, **PostgreSQL**, **Drizzle ORM** / **Prisma** (adapter pattern),
**Zod**, **TanStack Query**, dan **pnpm workspace** — dengan kualitas setara
Strapi, Payload CMS, Directus, Laravel, NestJS, dan Next.js.

## Isi Repositori

| Area | Lokasi | Keterangan |
| --- | --- | --- |
| Package | `packages/pkg-*` | 40 shared package (`@runezone/rune-*`, umbrella `@runezone/runepack`) |
| Tooling | `tooling/*` | Config bersama: tsconfig, eslint, prettier, vitest |
| Scripts | `scripts/` | Orkestrasi monorepo (scaffold, validasi dependency graph) |
| Dokumen | `docs/architecture/` | STEP 1–6: analisis, dependency, graph, struktur, roadmap |

## Roadmap (STEP 1–14)

Lihat `docs/architecture/06-roadmap.md` dan `AGENTS.md`.

Ringkasnya:

1. Analisis kebutuhan seluruh SDK — ✅ selesai
2. Analisis dependency package — ✅ selesai
3. Dependency graph — ✅ selesai
4. Finalisasi struktur folder — ✅ selesai
5. Lock struktur project — ✅ selesai
6. Roadmap package — ✅ selesai
7. Package pertama: **`@runezone/rune-types`** (pkg-types) — sedang dikerjakan
8–14. Implementasi → testing → lint → typecheck → build → review → lanjut

## Persyaratan

- Node.js >= 20.9
- pnpm >= 9 (versi ter-pin: `pnpm@11.9.0`)

## Quick Start

```bash
pnpm install
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

## Perintah Umum

| Perintah | Fungsi |
| --- | --- |
| `pnpm build` | Build semua package (tsup: ESM + CJS + d.ts) |
| `pnpm dev` | Watch mode semua package |
| `pnpm lint` | ESLint (strict, `--max-warnings 0`) |
| `pnpm typecheck` | TypeScript strict (`--noEmit`) |
| `pnpm test` | Vitest (unit test semua package) |
| `pnpm test:coverage` | Test dengan coverage (v8) |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check |
| `pnpm check:deps` | Validasi dependency graph (anti circular) |
| `pnpm changeset` | Buat changeset untuk rilis |
| `pnpm publish:packages` | Publikasi via Changesets |

## Prinsip Arsitektur

- Clean Architecture, SOLID, DDD, Feature Based, Layered.
- Dependency Injection friendly, Composition over Inheritance.
- **Tanpa circular dependency** — divalidasi oleh `pnpm check:deps`.
- Strict TypeScript — **tanpa `any`**, tanpa dead code.
- ESM-first, tree-shaking friendly (`sideEffects: false`, barrel exports).
- Semua REST API memakai **Next.js Route Handler**.
  Dilarang: Express, Hono, Fastify, Koa.
- Setiap package independent dan layak publikasi ke npm.

## Lisensi

MIT — lihat file [LICENSE](./LICENSE).
