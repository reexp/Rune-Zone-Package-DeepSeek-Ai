# AGENTS.md — RuneZone Shared SDK

Repository memory untuk agent (dan kontributor). Bacalah sebelum mengerjakan apa pun.

## Struktur (PERMANEN — lihat docs/architecture/05-locked-structure.md)

- `packages/pkg-*` — 40 package shared (`@runezone/rune-*`, umbrella `@runezone/runepack`).
- `tooling/*` — config bersama (tsconfig, eslint, prettier, vitest).
- `scripts/` — orkestrasi monorepo.
- `docs/architecture/` — dokumen STEP 1–6 yang sudah di-lock.

## Aturan kerja

1. **Jangan ubah struktur folder package** yang sudah disepakati.
2. Package dikerjakan **bottom-up** sesuai dependency graph
   (`scripts/dependency-graph.json`, `docs/architecture/03-dependency-graph.md`).
3. Setiap package wajib lulus pipeline: `typecheck` → `lint` → `test` → `build`.
4. Package baru wajib: `package.json`, `tsconfig.json`, `tsup.config.ts`,
   `README.md`, `CHANGELOG.md`, `LICENSE`, `src/`, `tests/`, `examples/`, `docs/`.
5. Public API hanya via `src/index.ts` (barrel, named export, ESM-first).
6. **Dilarang**: `any`, TODO, placeholder, pseudo code, circular dependency.
7. Strict TypeScript (`tsconfig.base.json`), ESLint flat config di root.
8. Dependency internal memakai `workspace:*` di devDependencies/dependencies,
   dan versi semver saat rilis (Changesets).
9. Semua REST memakai **Next.js Route Handler** — dilarang Express/Hono/Fastify/Koa.
10. Commit convention: Conventional Commits. Jangan commit tanpa diminta.

## Perintah umum

```bash
pnpm install                  # instal seluruh workspace
pnpm build                    # build semua package
pnpm lint                     # lint semua package
pnpm typecheck                # typecheck semua package
pnpm test                     # jalankan seluruh unit test (Vitest)
pnpm check:deps               # validasi dependency graph (anti circular)
pnpm changeset                # buat changeset baru
```

## Tooling

- Package manager: **pnpm** (lihat `packageManager` di root).
- Node >= 20.9, TypeScript 5.8, React 19, Next.js 15 (App Router).
- Build: **tsup** (ESM + CJS + dts, tree-shaking).
- Test: **Vitest** (workspace config di `vitest.workspace.ts`).
