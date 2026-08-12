# API Reference — @runezone/rune-types

## types/base

| Export | Keterangan |
| --- | --- |
| `Brand<T, B>` | Branded type `T` dengan brand string `B`. |
| `Primitive` | `string \| number \| boolean \| bigint \| symbol \| null \| undefined`. |
| `Dict<T>` | `Record<string, T>`. |
| `UnknownRecord` | `Record<string, unknown>`. |
| `Maybe<T>` | `T \| null \| undefined`. |
| `Nullable<T>` | `T \| null`. |
| `Undefinable<T>` | `T \| undefined`. |
| `MaybePromise<T>` / `Awaitable<T>` | `T \| Promise<T>`. |
| `AsyncFn` / `Fn` | Signature fungsi asinkron/sinkron generik. |
| `ValueOf<T>` | Union seluruh value `T`. |
| `PartialBy<T, K>` / `RequiredBy<T, K>` | Sebagian key dijadikan opsional/wajib. |
| `DeepPartial<T>` / `DeepReadonly<T>` | Rekursif opsional/readonly. |
| `NonEmptyArray<T>` | Array minimal 1 elemen. |
| `KeyOf<T>` | `keyof T & string`. |
| `ArrayElement<T>` | Elemen array/tuple. |
| `UnwrapPromise<T>` | Membuka `Promise`. |
| `Class<T>` / `Constructor<T>` | Tipe constructor. |
| `JSONPrimitive` / `JSONValue` | Nilai JSON-safe. |
| `ISO8601String`, `UUID`, `NonEmptyString` | Branded string. |

## types/id

| Export | Keterangan |
| --- | --- |
| `EntityId` | Branded `string` untuk ID entity. |
| `IdPrefix` | Branded `string` untuk prefix ID (`usr_`, `post_`, dst.). |
| `IdGeneratorName` | `"nanoid" \| "cuid" \| "ulid" \| "uuid"`. |

## types/result

| Export | Keterangan |
| --- | --- |
| `Ok<T>` | `{ ok: true; value: T }`. |
| `Err<E>` | `{ ok: false; error: E }`. |
| `Result<T, E = unknown>` | `Ok<T> \| Err<E>`. |

## types/pagination

| Export | Keterangan |
| --- | --- |
| `OrderDirection` | `"asc" \| "desc"`. |
| `OrderBy<T>` | `{ field; direction }`. |
| `PageParams` / `PageMeta` / `Page<T>` | Pagination berbasis page. |
| `CursorPageParams` / `CursorPageMeta` / `CursorPage<T>` | Pagination berbasis cursor. |

## types/timestamp

| Export | Keterangan |
| --- | --- |
| `UnixSeconds` | Branded `number` (detik). |
| `UnixMillis` | Branded `number` (milidetik). |
| `DurationMillis` | Branded `number` (durasi). |

## types/runtime

| Export | Keterangan |
| --- | --- |
| `RuntimeName` | `"node" \| "edge" \| "browser" \| "worker" \| "unknown"`. |
| `PackagePlatform` | `"node" \| "edge" \| "browser" \| "universal"`. |

## types/event

| Export | Keterangan |
| --- | --- |
| `EventHandler<TData>` | Handler event. |
| `EventMetadata` | `traceId`, `actorId`, `createdAt`, `extra`. |
| `EventPayload<TName, TData>` | Payload yang lewat event bus. |
| `EventDefinition<TName, TData>` | Definisi event terdaftar. |

## constants/limits

`DEFAULT_PAGE_SIZE` (20), `MAX_PAGE_SIZE` (100), `MAX_BATCH_SIZE` (500),
`MAX_ID_LENGTH` (64), `MAX_STRING_LENGTH` (65535), `MAX_FILENAME_LENGTH` (255),
`MAX_UPLOAD_SIZE_BYTES` (100 MB), `MAX_CONFIG_DEPTH` (10), `MAX_PIPELINE_LENGTH` (100).

## constants/runtime

| Export | Nilai |
| --- | --- |
| `RUNTIME_NAMES` | `["node","edge","browser","worker","unknown"]` |
| `PACKAGE_PLATFORMS` | `["node","edge","browser","universal"]` |
| `DEFAULT_LOCALE` | `"en"` |
| `DEFAULT_TIMEZONE` | `"UTC"` |

## constants/symbols

| Export | Keterangan |
| --- | --- |
| `DI_SYMBOL_PREFIX` | `"runezone:di:"`. |
| `InjectionToken<T>` | Interface token bertipe. |
| `createToken<T>(name)` | Membuat token unik (Symbol.for). |
| `TOKENS` | Registry token inti: Config, Logger, Database, Cache, Storage, Queue, EventBus, AuthService, SessionStore. |

## helpers/type-level

`IsAny`, `IsNever`, `IsUnknown`, `Equal`, `Not`, `And`, `Or`, `Xor`, `If`,
`KeysOfUnion`, `UnionToIntersection`, `Entries`, `Keys`, `Values`,
`ExcludeKeys`, `PickByValue`, `OmitByValue`, `RequireAtLeastOne`,
`RequireOnlyOne`, `FunctionKeys`, `DataKeys`.
