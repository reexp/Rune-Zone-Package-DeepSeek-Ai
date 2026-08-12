# STEP 6 — Roadmap Package

> Urutan implementasi ditentukan oleh **dependency graph** (STEP 3).
> Prinsip: *tidak ada package yang dikerjakan sebelum dependensinya siap.*

## 6.1 Fase Implementasi

| Fase | Package | Catatan |
| --- | --- | --- |
| F0 | **Foundation** | Root monorepo, tooling (tsconfig, eslint, prettier, vitest, changesets, husky) |
| F1 | pkg-types | Layer 0 — contract murni |
| F2 | pkg-utils, pkg-errors | Layer 1 — primitives |
| F3 | pkg-env, pkg-logger, pkg-config, pkg-validation, pkg-i18n, pkg-events | Layer 2 — common support |
| F4 | pkg-hooks, pkg-http, pkg-security | Layer 3a — cross-cutting |
| F5 | pkg-db, pkg-cache, pkg-queue, pkg-jobs, pkg-search | Layer 3b — data infra |
| F6 | pkg-storage, pkg-files, pkg-media, pkg-upload | Layer 3c — media |
| F7 | pkg-mail, pkg-session, pkg-users, pkg-permission | Layer 3d — domain services |
| F8 | pkg-schema, pkg-fields | Layer 3e — content modeling |
| F9 | pkg-auth, pkg-webhooks, pkg-rest, pkg-router | Layer 4a — API & auth |
| F10 | pkg-api, pkg-content, pkg-plugin, pkg-generator, pkg-cli, pkg-core | Layer 4b — application |
| F11 | pkg-ui, pkg-components | Layer 4c — React UI |
| F12 | pkg-sdk | Layer 5 — umbrella `@runezone/runepack` |

## 6.2 Workflow Per Package (Wajib)

Untuk SETIAP package, jalankan pipeline berikut secara berurutan:

1. **Tujuan** — jelaskan tujuan package.
2. **Dependency** — daftar dependensi internal & eksternal.
3. **Struktur folder** — ikuti standar (STEP 4.2).
4. **package.json** — config lengkap (exports, sideEffects, files).
5. **tsconfig.json** — extends preset tooling.
6. **tsup.config.ts** — ESM + CJS + dts.
7. **Source code** — implementasi lengkap, production-ready, strict TS, no any.
8. **Penjelasan setiap file** — dokumentasi di README/docs.
9. **Install** — `pnpm install` di root (workspace resolution).
10. **Build** — `pnpm --filter @runezone/rune-<name> build`.
11. **Lint** — `pnpm --filter @runezone/rune-<name> lint`.
12. **Test** — `pnpm --filter @runezone/rune-<name> test`.
13. **Typecheck** — `pnpm --filter @runezone/rune-<name> typecheck`.
14. **Publish** — `pnpm changeset` + `pnpm changeset version` + `pnpm changeset publish`.
15. **Contoh penggunaan** — file di `examples/`.
16. **Hasil pengecekan** — catat output lint/typecheck/test/build.
17. **Error jika ada + cara perbaiki** — dokumentasikan troubleshooting.

> **Aturan**: JANGAN lanjut ke package berikutnya sebelum package saat ini
> lulus seluruh pipeline (Definition of Done, STEP 1.5).

## 6.3 Rilis & Versioning

- Semua package `0.1.0` saat pertama kali siap.
- Perubahan perilaku = minor bump; breaking = major bump (Changesets).
- `@runezone/runepack` (pkg-sdk) di-bump bersamaan dengan dependensinya.
- Publikasi: `pnpm changeset publish` (butuh token npm `NPM_TOKEN`).
