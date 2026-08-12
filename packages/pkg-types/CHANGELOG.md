# @runezone/rune-types

## 0.1.0 — 2026-08-12

### Added

- Core shared types: `base`, `id`, `result`, `pagination`, `timestamp`, `runtime`, `event`.
- Type-level helpers: `Equal`, `IsAny`, `IsNever`, `IsUnknown`, `UnionToIntersection`,
  `PickByValue`, `OmitByValue`, `RequireAtLeastOne`, `RequireOnlyOne`, dan lainnya.
- Constants: runtime names, package platforms, limits.
- DI tokens: `createToken`, `InjectionToken`, dan registry `TOKENS`.
- Unit tests (type-level + runtime) dan contoh penggunaan.
