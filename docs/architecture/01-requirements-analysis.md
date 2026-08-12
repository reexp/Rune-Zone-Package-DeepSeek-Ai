# STEP 1 — Analisis Kebutuhan Seluruh SDK

> Dokumen ini mengunci **kebutuhan fungsional dan non-fungsional** RuneZone Shared SDK.
> Setiap package harus dapat dipetakan kembali ke kebutuhan di bawah ini.

## 1. Tujuan Produk

**RuneZone Shared SDK** adalah kumpulan *shared packages* yang menjadi pondasi
seluruh ekosistem RuneZone:

| Konsumen | Contoh Penggunaan |
| --- | --- |
| CMS Backend | Next.js Route Handlers, server actions, jobs |
| Admin Dashboard | React components, hooks, API SDK client |
| Website Frontend | Headless data fetch, auth session, components |
| Landing Page | Marketing SDK, session, i18n |
| Mobile Apps | REST/API SDK client (fetch-based), auth tokens |
| Cloudflare Workers | Edge-safe utils, validation, events, storage R2 |
| API SDK | `@runezone/runepack` client API |
| CLI | `@runezone/rune-cli`, generator, scaffolding |
| Third Party Apps | Public API SDK + webhooks |
| Future Products | Modular extension via plugin system |

## 2. Kebutuhan Fungsional (F)

| ID | Kebutuhan | Package Utama |
| --- | --- | --- |
| F-01 | Type-safe core types & branding | pkg-types |
| F-02 | Pure utilities (object, array, string, promise) | pkg-utils |
| F-03 | Error hierarchy + error codes + cause chain | pkg-errors |
| F-04 | Env loading + runtime validation (Zod) | pkg-env |
| F-05 | Structured logging, JSON, level, child loggers | pkg-logger |
| F-06 | Configuration loading, merge, freeze, hot-reload | pkg-config |
| F-07 | Zod-based validation + error mapping | pkg-validation |
| F-08 | i18n: interpolation, pluralization, locale fallback | pkg-i18n |
| F-09 | Typed event bus, event payloads, wildcard | pkg-events |
| F-10 | Hook system + middleware pipeline | pkg-hooks |
| F-11 | HTTP client (fetch), status codes, Next.js route helpers | pkg-http |
| F-12 | Crypto: hash, HMAC, JWT, rate-limit primitives | pkg-security |
| F-13 | DB adapter (Drizzle + Prisma), repository base | pkg-db |
| F-14 | Cache adapters (memory / redis), TTL, invalidation | pkg-cache |
| F-15 | Content modeling: schema, fields, content types | pkg-schema, pkg-fields, pkg-content |
| F-16 | Storage (Supabase / R2), files, media, upload | pkg-storage, pkg-files, pkg-media, pkg-upload |
| F-17 | Mailer adapter, queue, jobs, search | pkg-mail, pkg-queue, pkg-jobs, pkg-search |
| F-18 | Session, users, RBAC permission, Auth.js integration | pkg-session, pkg-users, pkg-permission, pkg-auth |
| F-19 | REST helpers, router, API SDK | pkg-rest, pkg-router, pkg-api |
| F-20 | Plugin system, webhooks, generator, CLI | pkg-plugin, pkg-webhooks, pkg-generator, pkg-cli |
| F-21 | Core container (DI-friendly), UI primitives, components | pkg-core, pkg-ui, pkg-components |
| F-22 | Umbrella export `@runezone/runepack` | pkg-sdk |

## 3. Kebutuhan Non-Fungsional (N)

| ID | Kebutuhan | Target |
| --- | --- | --- |
| N-01 | Type-safe | Strict TypeScript, `no any`, typed exports |
| N-02 | Tree-shakable | ESM-first, named exports, barrel exports, `sideEffects: false` |
| N-03 | Modular & reusable | Setiap package independent, composable |
| N-04 | Scalable | Struktur folder permanen, feature-based |
| N-05 | Maintainable | ESLint + Prettier clean, JSDoc, unit test per package |
| N-06 | Production-ready | Build tersedia: `dist/index.js` (ESM), `dist/index.cjs`, `dist/index.d.ts` |
| N-07 | Edge-ready | Tidak ada dependency Node-only di shared layer (kecuali pilihan adapter) |
| N-08 | No circular dependency | Dependency graph acyclic (diverifikasi tooling) |
| N-09 | Dependency Injection friendly | Provider/registry pattern di pkg-core, constructor injection |
| N-10 | Versioning | Changesets, semantic versioning, CHANGELOG per package |

## 4. Batasan Teknis (Constraint)

- **Runtime**: Node.js ≥ 20, Cloudflare Workers, Edge Runtime, Browser.
- **Stack**: Next.js App Router (Route Handlers, server actions, middleware).
- **DILARANG**: Express, Hono, Fastify, Koa — semua REST memakai Next.js Route Handler.
- **ORM**: Drizzle **atau** Prisma (adapter pattern), PostgreSQL / Supabase PostgreSQL.
- **Auth**: Auth.js (NextAuth.js) — Credentials, OAuth (Google/GitHub/Microsoft/Discord), Magic Link, JWT, Session DB, RBAC, refresh token.
- **Package manager**: pnpm workspace.
- **Namespace**: seluruh package `@runezone/*`.

## 5. Kriteria Selesai (Definition of Done)

1. Package lulus `typecheck`, `lint`, `test`, `build`.
2. Package memiliki public API yang terdokumentasi di README.
3. Package memiliki unit test (Vitest + Testing Library bila React).
4. Tidak ada `any`, TODO, placeholder, atau pseudo code.
5. Seluruh export tree-shakable (ESM + named export + barrel).
6. Struktur folder mengikuti standar permanen (STEP 5).
