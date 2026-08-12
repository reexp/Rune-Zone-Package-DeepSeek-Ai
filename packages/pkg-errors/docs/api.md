# API Reference — @runezone/rune-errors

## Kelas Error

### `RuneError`
Kelas dasar semua error RuneZone.

```ts
new RuneError(message: string, options?: RuneErrorOptions): RuneError
```

`RuneErrorOptions`:

| Properti | Tipe | Default | Keterangan |
| --- | --- | --- | --- |
| `code` | `ErrorCode` | `"UNKNOWN"` | Kode error standar/kustom. |
| `status` | `number` | — | Kode status HTTP yang disarankan. |
| `details` | `UnknownRecord` | — | Metadata yang aman diekspos. |
| `cause` | `unknown` | — | Penyebab asli (`Error.cause`, ES2022). |
| `name` | `string` | `"RuneError"` | Nama error. |

Properti instance: `message`, `name`, `code`, `status?`, `details?`, `cause?`, `isRuneError`.

`toJSON(): SerializedError` — bentuk aman untuk JSON (tanpa `stack`/`cause`).

### Kelas turunan

Semua kelas di bawah menerima `(message?, options?)` dengan `options` bertipe `RuneErrorBaseOptions` (`Omit<RuneErrorOptions, "code" | "name">`).

| Kelas | `code` | `status` default | Catatan |
| --- | --- | --- | --- |
| `InternalError` | `INTERNAL` | 500 | Fallback untuk error tak terduga. |
| `ConfigurationError` | `CONFIGURATION` | 500 | Env/schema config salah. |
| `ValidationError` | `VALIDATION` | 400 | `fieldErrors?` di opsi; getter `fieldErrors`. |
| `AuthenticationError` | `AUTHENTICATION` | 401 | Token/kredensial tidak valid. |
| `AuthorizationError` | `AUTHORIZATION` | 403 | Otorisasi ditolak. |
| `NotFoundError` | `NOT_FOUND` | 404 | Resource tidak ditemukan. |
| `ConflictError` | `CONFLICT` | 409 | Konflik data. |
| `RateLimitError` | `RATE_LIMIT` | 429 | `retryAfter?` di opsi; getter `retryAfter`. |
| `TimeoutError` | `TIMEOUT` | 504 | Operasi melewati batas waktu. |
| `NetworkError` | `NETWORK` | 502 | Kegagalan jaringan. |
| `StorageError` | `STORAGE` | 500 | Kegagalan storage. |
| `DatabaseError` | `DATABASE` | 500 | Kegagalan database. |
| `UnsupportedError` | `UNSUPPORTED` | 501 | Fitur belum didukung. |
| `CancelledError` | `CANCELLED` | 499 | Operasi dibatalkan. |

## Helper

### `normalizeError(error, fallbackMessage?, options?) → RuneError`
Mengubah nilai apa pun (RuneError, Error, string, primitif, object) menjadi `RuneError`.
- `RuneError` dikembalikan apa adanya.
- `Error` native dibungkus dengan `cause` aslinya, `code` default `INTERNAL`.

### `getErrorMessage(error, fallback?) → string`
Mengekstrak pesan error yang aman dari nilai apa pun.

### `serializeError(error, options?) → SerializedError`
Serialisasi aman untuk JSON/logging/API. Opsi: `includeStack?` (default `true`), `maxDepth?` (default `5`, untuk `cause`).

### `deserializeError(serialized, options?) → RuneError`
Merekonstruksi kelas error asli berdasarkan field `name`. `maxDepth?` default `5`. Melempar `TypeError` bila input tidak valid.

### `toHttpStatus(error, fallback?) → number`
Prioritas: `error.status` → pemetaan `code` → `fallback` (default 500).

### `codeToHttpStatus(code, fallback?) → number`
Memetakan `ErrorCode` standar ke status HTTP.

## Type Guard

| Fungsi | Keterangan |
| --- | --- |
| `isRuneError(v)` | `RuneError` / turunan (termasuk brand fallback). |
| `isError(v)` | Error native / RuneError. |
| `isErrorCode(v)` | String non-kosong. |
| `isStandardErrorCode(v)` | Kode standar RuneZone. |
| `isSerializedError(v)` | Bentuk `SerializedError` valid. |
| `isFieldErrors(v)` | Bentuk `FieldErrors` valid. |

## Konstanta

| Konstanta | Tipe | Keterangan |
| --- | --- | --- |
| `ERROR_CODES` | `Record<StandardErrorCode, StandardErrorCode>` | Kode standar (key = value). |
| `STANDARD_ERROR_CODES` | `readonly StandardErrorCode[]` | Daftar kode standar. |
| `DEFAULT_STATUS_BY_CODE` | `Readonly<Record<StandardErrorCode, number>>` | Pemetaan code → status HTTP. |
| `ERROR_CLASS_BY_NAME` | `Readonly<Record<string, ErrorClass>>` | Registry kelas untuk `deserializeError`. |
| `ERROR_CODE_BY_CLASS` | `Readonly<Record<string, ErrorCode>>` | Kode default per kelas. |

## Tipe

- `StandardErrorCode` — union kode standar.
- `ErrorCode` — `StandardErrorCode \| (string & {})` (kode kustom tetap autocomplete).
- `RuneErrorOptions`, `RuneErrorBaseOptions`
- `ValidationErrorOptions`, `RateLimitErrorOptions`
- `SerializedError`, `SerializeErrorOptions`
- `FieldErrors` — `Record<string, readonly string[] | undefined>`
- `ErrorClass` — konstruktor generik untuk registry.
