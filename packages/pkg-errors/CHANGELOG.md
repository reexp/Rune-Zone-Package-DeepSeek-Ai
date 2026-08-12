# Changelog — @runezone/rune-errors

Semua perubahan menonjol pada package ini akan dicatat di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-08-12

### Added

- Kelas dasar `RuneError` dengan `code`, `status`, `details`, `cause` (ES2022), dan `toJSON()` aman untuk respons API.
- 14 kelas error bertipe: `InternalError`, `ConfigurationError`, `ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`, `RateLimitError`, `TimeoutError`, `NetworkError`, `StorageError`, `DatabaseError`, `UnsupportedError`, `CancelledError`.
- `ValidationError.fieldErrors` dan `RateLimitError.retryAfter` (tersimpan di `details`, diekspos via getter).
- Konstanta `ERROR_CODES`, `STANDARD_ERROR_CODES`, `DEFAULT_STATUS_BY_CODE`.
- Helper `normalizeError`, `getErrorMessage`, `serializeError`, `deserializeError`, `toHttpStatus`, `codeToHttpStatus`.
- Type guard `isRuneError`, `isError`, `isErrorCode`, `isStandardErrorCode`, `isSerializedError`, `isFieldErrors`.
- Registry `ERROR_CLASS_BY_NAME` untuk deserialisasi, `ERROR_CODE_BY_CLASS` untuk introspeksi.
- Build dual ESM + CJS dengan deklarasi tipe; `sideEffects: false` untuk tree-shaking.
- Unit test lengkap (Vitest) untuk seluruh API publik.
