# STEP 5 — Lock Struktur Project

> **KONTRAK PERMANEN.** Struktur di bawah ini TIDAK BOLEH diubah setelah
> disepakati. Perubahan struktur hanya boleh terjadi melalui proposal
> migrasi yang terdokumentasi (dengan versi mayor).

## 5.1 Package Registry (38 package)

| # | Folder | NPM Package | Layer |
| --- | --- | --- | --- |
| 01 | `pkg-types` | `@runezone/rune-types` | L0 |
| 02 | `pkg-utils` | `@runezone/rune-utils` | L1 |
| 03 | `pkg-errors` | `@runezone/rune-errors` | L1 |
| 04 | `pkg-env` | `@runezone/rune-env` | L2 |
| 05 | `pkg-logger` | `@runezone/rune-logger` | L2 |
| 06 | `pkg-config` | `@runezone/rune-config` | L2 |
| 07 | `pkg-validation` | `@runezone/rune-validation` | L2 |
| 08 | `pkg-i18n` | `@runezone/rune-i18n` | L2 |
| 09 | `pkg-events` | `@runezone/rune-events` | L2 |
| 10 | `pkg-hooks` | `@runezone/rune-hooks` | L3 |
| 11 | `pkg-http` | `@runezone/rune-http` | L3 |
| 12 | `pkg-security` | `@runezone/rune-security` | L3 |
| 13 | `pkg-db` | `@runezone/rune-db` | L3 |
| 14 | `pkg-cache` | `@runezone/rune-cache` | L3 |
| 15 | `pkg-queue` | `@runezone/rune-queue` | L3 |
| 16 | `pkg-jobs` | `@runezone/rune-jobs` | L3 |
| 17 | `pkg-search` | `@runezone/rune-search` | L3 |
| 18 | `pkg-storage` | `@runezone/rune-storage` | L3 |
| 19 | `pkg-files` | `@runezone/rune-files` | L3 |
| 20 | `pkg-media` | `@runezone/rune-media` | L3 |
| 21 | `pkg-upload` | `@runezone/rune-upload` | L3 |
| 22 | `pkg-mail` | `@runezone/rune-mail` | L3 |
| 23 | `pkg-session` | `@runezone/rune-session` | L3 |
| 24 | `pkg-users` | `@runezone/rune-users` | L3 |
| 25 | `pkg-permission` | `@runezone/rune-permission` | L3 |
| 26 | `pkg-auth` | `@runezone/rune-auth` | L4 |
| 27 | `pkg-webhooks` | `@runezone/rune-webhooks` | L4 |
| 28 | `pkg-rest` | `@runezone/rune-rest` | L4 |
| 29 | `pkg-router` | `@runezone/rune-router` | L4 |
| 30 | `pkg-api` | `@runezone/rune-api` | L4 |
| 31 | `pkg-schema` | `@runezone/rune-schema` | L3 |
| 32 | `pkg-fields` | `@runezone/rune-fields` | L3 |
| 33 | `pkg-content` | `@runezone/rune-content` | L4 |
| 34 | `pkg-plugin` | `@runezone/rune-plugin` | L3 |
| 35 | `pkg-generator` | `@runezone/rune-generator` | L4 |
| 36 | `pkg-cli` | `@runezone/rune-cli` | L4 |
| 37 | `pkg-core` | `@runezone/rune-core` | L4 |
| 38 | `pkg-ui` | `@runezone/rune-ui` | L4 |
| 39 | `pkg-components` | `@runezone/rune-components` | L4 |
| 40 | `pkg-sdk` | `@runezone/runepack` | L5 |

## 5.2 Naming Convention

- Folder: `pkg-<name>` (kebab-case).
- Package: `@runezone/rune-<name>`.
- Khusus umbrella: folder `pkg-sdk`, package `@runezone/runepack`.
- Export entry: `./src/index.ts` (source) → `dist/index.js` + `dist/index.cjs` + `dist/index.d.ts` (build).

## 5.3 Build Contract (per package)

| Artifact | Format | Tool |
| --- | --- | --- |
| `dist/index.js` | ESM (tree-shakable) | tsup |
| `dist/index.cjs` | CJS (interop) | tsup |
| `dist/index.d.ts` | Type declarations | tsup (dts) |
| `dist/*.d.cts` | Type declarations CJS | tsup |
| `package.json#exports` | subpath exports aman | manual |

## 5.4 Komitmen Struktur

1. Folder package di `packages/` tidak boleh dipindah/rename.
2. `src/` mengikuti standar folder (SECTION 4.2).
3. Entry public hanya via `src/index.ts` (barrel).
4. Setiap package berdiri sendiri (`independent`) — boleh dirilis terpisah.
5. Perubahan struktur hanya via RFC migrasi (minor violation = breaking change).
