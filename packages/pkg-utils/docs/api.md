# API Reference — @runezone/rune-utils

## helpers/guards

| Export | Keterangan |
| --- | --- |
| `isString(value)` | Type guard: `string`. |
| `isNumber(value)` | Type guard: `number` (termasuk NaN). |
| `isFiniteNumber(value)` | Type guard: `number` finite (bukan NaN/Infinity). |
| `isBoolean(value)` | Type guard: `boolean`. |
| `isFunction(value)` | Type guard: `function`. |
| `isSymbol(value)` | Type guard: `symbol`. |
| `isBigInt(value)` | Type guard: `bigint`. |
| `isUndefined(value)` | Type guard: `undefined`. |
| `isNull(value)` | Type guard: `null`. |
| `isNil(value)` | Type guard: `null \| undefined`. |
| `isArray(value)` | Type guard: array. |
| `isDate(value)` | Type guard: `Date` valid. |
| `isRegExp(value)` | Type guard: `RegExp`. |
| `isObject(value)` | Type guard: object non-null non-array. |
| `isPlainObject(value)` | Type guard: plain object. |
| `isPromise(value)` | Type guard: thenable. |
| `isMap(value)` | Type guard: `Map`. |
| `isSet(value)` | Type guard: `Set`. |
| `isEmpty(value)` | True jika kosong (nil/string/array/Map/Set/object). |
| `hasOwn(object, key)` | True jika properti sendiri ada. |

## constants/alphabet

| Export | Nilai |
| --- | --- |
| `ALPHABET_NUMERIC` | `0-9` |
| `ALPHABET_ALPHA_LOWER` | `a-z` |
| `ALPHABET_ALPHA_UPPER` | `A-Z` |
| `ALPHABET_ALPHA` | `a-zA-Z` |
| `ALPHABET_ALPHANUMERIC` | `a-zA-Z0-9` |
| `ALPHABET_ALPHANUMERIC_LOWER` | `a-z0-9` |
| `ALPHABET_BASE32` | RFC 4648 |
| `ALPHABET_HEX` | `0-9a-f` |
| `ALPHABET_URL_SAFE` | `a-zA-Z0-9_-` |

## utils/object

| Export | Keterangan |
| --- | --- |
| `deepMerge<T>(...objects)` | Merge dalam secara immutable (proteksi `__proto__`). |
| `pick(object, keys)` | Ambil subset key. |
| `omit(object, keys)` | Buang subset key. |
| `pickBy(object, predicate)` | Ambil key yang memenuhi predikat. |
| `omitBy(object, predicate)` | Buang key yang memenuhi predikat. |
| `mapValues(object, fn)` | Transform nilai. |
| `mapKeys(object, fn)` | Transform kunci. |
| `deepClone(value)` | Clone dalam (structuredClone bila tersedia). |
| `parsePath(path)` | Parse dot/array path → `Array<string \| number>`. |
| `get(object, path, fallback?)` | Baca nilai nested path. |
| `set(object, path, value)` | Tulis nilai nested (immutable). |
| `isEqual(a, b)` | Perbandingan dalam (deep equal). |
| `entries(object)` | `Array<[key, value]>` bertipe. |
| `fromEntries(entries)` | Kebalikan `entries`. |
| `deepFreeze(object)` | Freeze rekursif. |

## utils/string

| Export | Keterangan |
| --- | --- |
| `capitalize(value)` | Kapital huruf pertama. |
| `uncapitalize(value)` | Huruf pertama jadi kecil. |
| `toWords(value)` | Pecah string jadi kata. |
| `camelCase(value)` | `hello-world` → `helloWorld`. |
| `pascalCase(value)` | `hello-world` → `HelloWorld`. |
| `snakeCase(value)` | `hello-world` → `hello_world`. |
| `kebabCase(value)` | `hello world` → `hello-world`. |
| `constantCase(value)` | `hello-world` → `HELLO_WORLD`. |
| `titleCase(value)` | Kapital tiap kata. |
| `slugify(value, options?)` | Slug URL (ascii fold, trim, separator). |
| `truncate(value, options?)` | Potong string + suffix. |
| `mask(value, keepFirst?, keepLast?, maskChar?)` | Menyembunyikan tengah string. |
| `escapeRegExp(value)` | Escape karakter regex. |
| `interpolate(value, data)` | Template `{key.path}`. |
| `stripHtml(value)` | Hapus tag HTML. |
| `collapseWhitespace(value)` | Rapatkan whitespace berlebih. |
| `isBlank(value)` | True jika whitespace kosong. |
| `isNotBlank(value)` | Negasi `isBlank`. |
| `takeWords(value, count)` | Ambil N kata pertama. |
| `uniqueChars(value)` | Karakter unik sesuai urutan. |
| `reverse(value)` | Balik string. |
| `isSlug(value)` | Validasi format slug. |

## utils/number

| Export | Keterangan |
| --- | --- |
| `clamp(value, min, max)` | Batasi rentang. |
| `round(value, precision?)` | Pembulatan presisi. |
| `toNumber(value, fallback?)` | Konversi aman ke number. |
| `randomInt(min, max)` | Bilangan bulat acak inklusif. |
| `randomFloat(min, max)` | Bilangan pecahan acak. |
| `isBetween(value, min, max)` | Cek rentang inklusif. |
| `sum(numbers)` | Penjumlahan. |
| `average(numbers)` | Rata-rata. |
| `min(numbers)` / `max(numbers)` | Nilai ekstrem. |
| `formatNumber(value, options?)` | Format `Intl.NumberFormat`. |
| `parseNumber(value, fallback?)` | Parse string → number. |
| `percentage(part, total, precision?)` | Persentase. |
| `isNonNegative(value)` | Type guard: number ≥ 0. |

## utils/date

| Export | Keterangan |
| --- | --- |
| `isValidDate(value)` | Type guard: `Date` valid. |
| `toDate(value)` | Konversi string/number/Date → Date. |
| `copyDate(date)` | Salin Date. |
| `startOfDay` / `endOfDay` | Batas hari. |
| `startOfMonth` / `endOfMonth` | Batas bulan. |
| `addDays` / `addMonths` / `addYears` / `addHours` / `addMinutes` / `addSeconds` | Operasi penambahan (immutable). |
| `differenceInMilliseconds` / `Seconds` / `Minutes` / `Hours` / `Days` | Selisih dua tanggal. |
| `isSameDay(a, b)` / `isSameMonth(a, b)` | Perbandingan komponen. |
| `isBefore(a, b)` / `isAfter(a, b)` | Perbandingan waktu. |
| `isBetweenDates(date, start, end)` | Cek rentang. |
| `formatDate(value, locale?, options?)` | Format via `Intl.DateTimeFormat` (default locale `id-ID`). |
| `formatRelativeTime(date, base?, locale?)` | `Intl.RelativeTimeFormat`. |
| `isLeapYear(year)` | Cek tahun kabisat. |
| `daysInMonth(year, month)` | Jumlah hari bulan. |

## utils/array

| Export | Keterangan |
| --- | --- |
| `chunk(array, size)` | Pecah array jadi blok. |
| `unique(array)` | Hapus duplikat. |
| `uniqueBy(array, keyFn)` | Hapus duplikat by key. |
| `compact(array)` | Buang falsy (`null`, `undefined`, ...). |
| `difference(a, b)` | Elemen a yang tidak ada di b. |
| `intersection(a, b)` | Irisan. |
| `union(a, b)` | Gabungan unik. |
| `shuffle(array)` | Acak urutan (baru). |
| `sortBy(array, keyFn?, order?)` | Sort stabil. |
| `groupBy(array, keyFn)` | Grouping. |
| `flatten(array)` | Ratakan satu tingkat. |
| `first(array)` / `last(array)` | Elemen ujung. |
| `range(start, end?, step?)` | Deret angka. |
| `toArray(value)` | Normalisasi `T \| T[]` → `T[]`. |
| `partition(array, predicate)` | Pisah dua bagian. |
| `zip(a, b)` | Gabungkan berpasangan. |
| `rotate(array, count)` | Rotasi. |
| `take(array, count)` / `takeLast(array, count)` | Ambil elemen dari ujung. |

## utils/async

| Export | Keterangan |
| --- | --- |
| `sleep(ms)` | Tunggu milidetik. |
| `timeout(promise, ms, message?)` | Batasi waktu promise. |
| `retry(fn, options?)` | Ulangi saat gagal (backoff). |
| `debounce(fn, wait)` | Debounce + `cancel()` / `flush()`. |
| `throttle(fn, wait)` | Throttle + `cancel()` / `flush()`. |
| `pLimit(concurrency)` | Pembatas konkurensi. |
| `mapWithConcurrency(items, concurrency, fn)` | Map dengan limit. |
| `isPromiseLike(value)` | Type guard: thenable. |
| `toPromise(value)` | Normalisasi ke `Promise`. |

## utils/function

| Export | Keterangan |
| --- | --- |
| `identity(value)` | Kembalikan nilai apa adanya. |
| `noop()` | Fungsi kosong. |
| `constant(value)` | Fungsi pengembali konstanta. |
| `memoize(fn)` | Cache hasil per argumen. |
| `once(fn)` | Jalankan sekali. |
| `pipe(value, ...fns)` | Pipeline kiri-ke-kanan. |
| `compose(...fns)` | Komposisi kanan-ke-kiri. |

## utils/id

| Export | Keterangan |
| --- | --- |
| `generateId(size, alphabet)` | ID acak berbasis `crypto.getRandomValues`. |
| `generateNanoId(size?)` | ID gaya nanoid (21 char default). |
| `generateUuid()` | UUID v4. |
| `createIdGenerator(size, alphabet)` | Factory generator ID. |
| `generateToken(bytes?)` | Token acak hex (64 char default). |

## utils/url

| Export | Keterangan |
| --- | --- |
| `buildQuery(params)` | Objek → query string. |
| `parseQuery(value)` | Query string → objek (duplikat → array). |
| `withQuery(url, params)` | Gabung query ke URL. |
| `isAbsoluteUrl(value)` | Deteksi URL absolut. |
| `isValidHttpUrl(value)` | Validasi http(s) URL. |
| `joinUrl(...parts)` | Gabung segmen URL. |
| `parseUrl(value)` | Parse → `URL` atau `null`. |
| `getPathname(value)` / `getOrigin(value)` | Ekstrak bagian URL. |

## types

| Export | Keterangan |
| --- | --- |
| `MaybePromise<T>` | `T \| Promise<T>`. |
| `AsyncFunction` | Signature async generik. |
| `Predicate<T>` | `(value: T) => boolean`. |
| `Comparator<T>` | `(a, b) => number`. |
| `AnyRecord` | `Record<string, unknown>`. |
| `JsonPrimitive` / `JsonValue` | Nilai JSON-safe. |
| `PathLike` | Dot path atau array path. |
| `SortOrder` | `"asc" \| "desc"`. |
