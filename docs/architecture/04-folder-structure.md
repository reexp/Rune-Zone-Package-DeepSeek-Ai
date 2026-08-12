# STEP 4 — Finalisasi Struktur Folder

> Struktur ini **permanen**. JANGAN mengubahnya setelah disepakati.
> Setiap package mengikuti standar yang sama sehingga mudah dipindai,
> dipelihara, dan di-scale.

## 4.1 Monorepo Root

```
runezone-shared-sdk/
├── package.json                  # root: scripts orkestrasi
├── pnpm-workspace.yaml           # workspace: packages/*, tooling/*
├── tsconfig.base.json            # base compiler options (strict)
├── tsconfig.json                 # root solution tsconfig
├── eslint.config.mjs             # ESLint flat config (9.x)
├── .prettierrc.json
├── .prettierignore
├── .gitignore
├── .npmrc
├── .editorconfig
├── .changeset/                   # changesets (versioning)
├── .husky/                       # pre-commit, commit-msg
├── vitest.workspace.ts           # Vitest project (per-package)
├── docs/
│   ├── architecture/             # dokumen STEP 1-6 (locked)
│   └── guides/
├── tooling/
│   ├── tsconfig/                 # shared tsconfig presets
│   ├── eslint-config/            # shared eslint preset
│   ├── prettier-config/          # shared prettier preset
│   └── vitest-config/            # shared vitest helpers
├── scripts/                      # build, publish, lint, check-deps, scaffold
└── packages/
    └── pkg-*/                    # 38 shared packages
```

## 4.2 Standar Package (wajib)

```
packages/pkg-<name>/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
├── CHANGELOG.md
├── LICENSE
├── src/
│   ├── client/                   # kode khusus client/browser
│   ├── server/                   # kode khusus server (Node/Next)
│   ├── shared/                   # kode runtime-agnostic (dipakai keduanya)
│   ├── types/                    # type definitions public
│   ├── constants/                # konstanta public
│   ├── errors/                   # error classes khusus package
│   ├── helpers/                  # helper internal
│   ├── utils/                    # util internal (bukan public API)
│   ├── hooks/                    # React hooks (bila ada)
│   ├── validators/               # Zod schemas / validators
│   ├── adapters/                 # adapter pattern (ORM, storage, cache, dsb)
│   ├── services/                 # service classes (business logic)
│   ├── repositories/             # repository pattern (data access)
│   ├── models/                   # domain models
│   ├── dto/                      # data transfer objects
│   ├── schemas/                  # Zod schemas untuk validasi input
│   └── index.ts                  # public barrel export
├── tests/
│   └── *.test.ts                 # unit test (Vitest)
├── examples/
│   └── *.ts                      # contoh penggunaan
└── docs/
    └── api.md                    # API reference khusus package
```

## 4.3 Aturan Folder

| Folder | Tujuan | Boleh masuk public API? |
| --- | --- | --- |
| `src/index.ts` | Satu-satunya entry public | Ya (wajib) |
| `src/client` | Hanya di-import konsumen client | Tidak langsung |
| `src/server` | Hanya di-import konsumen server | Tidak langsung |
| `src/shared` | Dipakai client + server | Boleh via index |
| `src/types` | TypeScript types | Ya |
| `src/constants` | Konstanta | Ya |
| `src/errors` | Error classes | Ya |
| `src/helpers`, `src/utils` | Implementasi internal | Tidak |
| `src/hooks` | React hooks | Ya (untuk package UI) |
| `src/validators`, `src/schemas` | Zod schemas | Ya |
| `src/adapters` | Implementasi adapter | Ya (factory) |
| `src/services`, `src/repositories`, `src/models`, `src/dto` | Business logic | Selektif |

> Package yang tidak memerlukan folder tertentu tetap mencantumkan folder tsb
> pada dokumentasi struktur sebagai **bagian dari standar**, namun hanya
> diisi bila relevan — konsistensi struktur dijaga, konten proporsional.
