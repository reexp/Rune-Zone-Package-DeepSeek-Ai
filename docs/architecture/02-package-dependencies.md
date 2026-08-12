# STEP 2 — Analisis Dependency Package

> Dependency antar package disusun **bottom-up** (layer rendah tidak pernah
> bergantung pada layer tinggi). Ini menjamin **tidak ada circular dependency**
> dan seluruh graph bersifat acyclic.

## 2.1 Aturan Dependency

1. Dependency hanya mengarah ke **layer yang lebih rendah**.
2. Package layer tinggi boleh `import` dari layer rendah, **tidak pernah sebaliknya**.
3. External dependencies diminimalkan dan diletakkan sebagai `peerDependencies`
   bila memungkinkan (mis. `react`, `next`, `zod`) agar tidak terjadi duplikasi.
4. Seluruh dependency internal menggunakan `workspace:*` dan dirilis ke npm
   dengan versi semver.

## 2.2 Layering

```
L5  Consumer / Umbrella     pkg-sdk
L4  Application Layer       pkg-api, pkg-rest, pkg-router, pkg-auth, pkg-webhooks,
                            pkg-cli, pkg-generator, pkg-core, pkg-content,
                            pkg-components, pkg-ui
L3  Domain Services         pkg-db, pkg-cache, pkg-queue, pkg-jobs, pkg-search,
                            pkg-storage, pkg-files, pkg-media, pkg-upload,
                            pkg-mail, pkg-session, pkg-users, pkg-permission,
                            pkg-hooks, pkg-http, pkg-security, pkg-plugin
L2  Common Support          pkg-env, pkg-logger, pkg-config, pkg-validation,
                            pkg-i18n, pkg-events
L1  Primitives              pkg-utils, pkg-errors
L0  Contracts               pkg-types
```

## 2.3 Tabel Dependency Internal

| Package | Depends On (internal) | External Utama |
| --- | --- | --- |
| pkg-types | — | — |
| pkg-utils | pkg-types | — |
| pkg-errors | pkg-types | — |
| pkg-env | pkg-types, pkg-utils, pkg-errors | zod |
| pkg-logger | pkg-types, pkg-utils | — |
| pkg-config | pkg-types, pkg-utils, pkg-errors | — |
| pkg-validation | pkg-types, pkg-errors | zod |
| pkg-i18n | pkg-types | — |
| pkg-events | pkg-types, pkg-utils | — |
| pkg-hooks | pkg-types, pkg-events, pkg-errors | — |
| pkg-http | pkg-types, pkg-utils, pkg-errors | — |
| pkg-security | pkg-types, pkg-utils, pkg-errors | @noble/hashes, @noble/ciphers |
| pkg-db | pkg-types, pkg-config, pkg-logger, pkg-errors | drizzle-orm, @prisma/client |
| pkg-cache | pkg-types, pkg-config, pkg-errors | — |
| pkg-queue | pkg-types, pkg-events, pkg-errors | — |
| pkg-jobs | pkg-types, pkg-queue, pkg-logger | — |
| pkg-search | pkg-types, pkg-db, pkg-logger | — |
| pkg-storage | pkg-types, pkg-config, pkg-errors | @supabase/storage-js |
| pkg-files | pkg-types, pkg-storage, pkg-utils, pkg-errors | — |
| pkg-media | pkg-types, pkg-files, pkg-utils | — |
| pkg-upload | pkg-types, pkg-files, pkg-media, pkg-validation | — |
| pkg-mail | pkg-types, pkg-config, pkg-errors | — |
| pkg-session | pkg-types, pkg-db, pkg-cache, pkg-security, pkg-errors | — |
| pkg-users | pkg-types, pkg-db, pkg-security, pkg-validation, pkg-errors | — |
| pkg-permission | pkg-types, pkg-db, pkg-errors | — |
| pkg-auth | pkg-types, pkg-session, pkg-users, pkg-permission, pkg-security, pkg-db | next-auth, @auth/core |
| pkg-webhooks | pkg-types, pkg-events, pkg-http, pkg-validation, pkg-errors | — |
| pkg-rest | pkg-types, pkg-http, pkg-validation, pkg-errors | next |
| pkg-router | pkg-types, pkg-rest, pkg-http | next |
| pkg-api | pkg-types, pkg-http, pkg-errors, pkg-validation | — |
| pkg-content | pkg-types, pkg-schema, pkg-fields, pkg-db, pkg-validation | — |
| pkg-plugin | pkg-types, pkg-hooks, pkg-events, pkg-errors | — |
| pkg-generator | pkg-types, pkg-schema, pkg-fields, pkg-utils | — |
| pkg-cli | pkg-types, pkg-generator, pkg-config, pkg-utils | — |
| pkg-core | pkg-types, pkg-config, pkg-plugin, pkg-hooks, pkg-events, pkg-logger | — |
| pkg-ui | pkg-types | react |
| pkg-components | pkg-types, pkg-content, pkg-ui | react |
| pkg-sdk | semua package di atas | — |

## 2.4 External Dependencies Bersama

| Package | Versi | Dipakai oleh |
| --- | --- | --- |
| zod | ^3.24 | pkg-env, pkg-validation, pkg-upload, pkg-users, pkg-rest, pkg-api |
| drizzle-orm | ^0.44 | pkg-db |
| @prisma/client | ^6 | pkg-db |
| next-auth | ^4.24 | pkg-auth |
| react | ^19 | pkg-ui, pkg-components, pkg-sdk |
| next | ^15 | pkg-rest, pkg-router, pkg-auth |
