/**
 * Batas-batas umum yang dipakai bersama oleh seluruh package.
 * Nilai di sini adalah default; package lain boleh meng-override via config.
 */

/** Jumlah item per halaman secara default. */
export const DEFAULT_PAGE_SIZE = 20;

/** Batas maksimum item per halaman. */
export const MAX_PAGE_SIZE = 100;

/** Batas maksimum item dalam satu operasi batch. */
export const MAX_BATCH_SIZE = 500;

/** Panjang maksimum ID entity. */
export const MAX_ID_LENGTH = 64;

/** Panjang maksimum string pada umumnya (kolom text). */
export const MAX_STRING_LENGTH = 65_535;

/** Panjang maksimum nama file. */
export const MAX_FILENAME_LENGTH = 255;

/** Ukuran maksimum upload default (100 MB). */
export const MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024;

/** Kedalaman maksimum saat merge/validasi config bersarang. */
export const MAX_CONFIG_DEPTH = 10;

/** Jumlah maksimum hook/plugin dalam satu pipeline. */
export const MAX_PIPELINE_LENGTH = 100;
