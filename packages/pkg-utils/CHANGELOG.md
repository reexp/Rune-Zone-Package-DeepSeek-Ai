# @runezone/rune-utils

## 0.1.1 — 2026-08-12

### Fixed

- **utils/date** — `formatDate` kini tidak lagi menggabungkan `dateStyle` dengan opsi
  komponen (`year`/`month`/`day`/...). Sebelumnya memicu `TypeError: Invalid option`.
- **utils/object** — `omit` tidak lagi memakai `delete` dinamis (kepatuhan ESLint
  `no-dynamic-delete`); hasil akhir setara.
- **tests/array** — ekspektasi `sortBy` multi-selector `desc` diperbaiki agar konsisten
  dengan semantik "desc diterapkan ke semua selector".

## 0.1.0 — 2026-08-12

### Added

- **helpers/guards** — 20 type guards runtime (`isString`, `isPlainObject`, `isEmpty`, ...).
- **constants/alphabet** — alfabet untuk generator ID (hex, base32, url-safe, dst.).
- **utils/object** — `deepMerge` (proteksi `__proto__`), `get`/`set` nested path immutable,
  `pick`/`omit`, `mapValues`/`mapKeys`, `deepClone`, `deepFreeze`, `isEqual`, `entries`.
- **utils/string** — case converter (`camelCase`, `kebabCase`, `snakeCase`, `pascalCase`,
  `constantCase`, `titleCase`), `slugify`, `truncate`, `mask`, `interpolate`, `stripHtml`,
  `escapeRegExp`, `isSlug`, dan lainnya.
- **utils/number** — `clamp`, `round`, `randomInt`, `sum`, `average`, `percentage`,
  `formatNumber`, `parseNumber`, dan lainnya.
- **utils/date** — `addDays`, `differenceInDays`, `formatDate`, `formatRelativeTime`,
  `startOfDay`/`endOfDay`, `isSameDay`, `isLeapYear`, dan lainnya (murni immutable).
- **utils/array** — `chunk`, `unique`, `sortBy`, `groupBy`, `shuffle`, `range`, `zip`,
  `partition`, dan lainnya.
- **utils/async** — `sleep`, `timeout`, `retry` (backoff), `debounce`, `throttle`,
  `pLimit`, `mapWithConcurrency`.
- **utils/function** — `identity`, `noop`, `constant`, `memoize`, `once`, `pipe`, `compose`.
- **utils/url** — `buildQuery`, `parseQuery`, `withQuery`, `joinUrl`, `parseUrl`.
- **utils/id** — `generateId`, `generateNanoId`, `generateUuid` (v4), `createIdGenerator`,
  `generateToken` — berbasis `globalThis.crypto`.
- Unit test lengkap (Vitest) dan contoh penggunaan.

### Notes

- Zero dependency runtime selain `@runezone/rune-types`.
- Berjalan di Node ≥ 20, Cloudflare Workers, Edge Runtime, dan browser modern.
