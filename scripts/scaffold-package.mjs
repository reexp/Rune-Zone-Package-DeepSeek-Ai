/**
 * scaffold-package.mjs
 *
 * Scaffolds a new package following the locked structure (docs/architecture/05-locked-structure.md).
 *
 * Usage:
 *   node scripts/scaffold-package.mjs pkg-config
 *   node scripts/scaffold-package.mjs pkg-config --name rune-config --description "..."
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const folderArg = args[0];
if (!folderArg) {
  fail("Usage: node scripts/scaffold-package.mjs pkg-<name> [--name rune-<name>] [--description ...]");
}
if (!/^pkg-[a-z0-9-]+$/.test(folderArg)) {
  fail('Folder name must match "pkg-<name>" (kebab-case).');
}

const folder = folderArg;
const nameIdx = args.indexOf("--name");
const name = nameIdx !== -1 ? args[nameIdx + 1] : `rune-${folder.replace(/^pkg-/, "")}`;
const descIdx = args.indexOf("--description");
const description =
  descIdx !== -1 ? args[descIdx + 1] : `RuneZone shared package — ${name}.`;

const pkgDir = join(root, "packages", folder);
if (existsSync(pkgDir)) {
  fail(`Folder already exists: packages/${folder}`);
}

const dirs = [
  "src/client",
  "src/server",
  "src/shared",
  "src/types",
  "src/constants",
  "src/errors",
  "src/helpers",
  "src/utils",
  "src/hooks",
  "src/validators",
  "src/adapters",
  "src/services",
  "src/repositories",
  "src/models",
  "src/dto",
  "src/schemas",
  "tests",
  "examples",
  "docs",
];

for (const dir of dirs) {
  mkdirSync(join(pkgDir, dir), { recursive: true });
}

const packageJson = {
  name: `@runezone/${name}`,
  version: "0.1.0",
  description,
  license: "MIT",
  type: "module",
  sideEffects: false,
  files: ["dist"],
  main: "./dist/index.cjs",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      require: "./dist/index.cjs",
    },
  },
  scripts: {
    build: "tsup",
    dev: "tsup --watch",
    lint: "eslint src tests examples --max-warnings 0",
    typecheck: "tsc --noEmit",
    test: "vitest run",
    "test:coverage": "vitest run --coverage",
    clean: "rimraf dist coverage",
  },
  peerDependencies: {},
  devDependencies: {
    "@runezone/tsconfig": "workspace:*",
    "@types/node": "^22.15.0",
    rimraf: "^6.0.1",
    tsup: "^8.5.0",
    typescript: "^5.8.3",
    vitest: "^3.1.0",
  },
  publishConfig: {
    access: "public",
  },
};

const tsconfig = {
  extends: "@runezone/tsconfig/base.json",
  compilerOptions: {
    baseUrl: ".",
    paths: {},
  },
  include: ["src", "tests", "examples", "tsup.config.ts"],
};

const tsupConfig = `import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  external: ["react", "react-dom", "next"],
});
`;

writeFileSync(join(pkgDir, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
writeFileSync(join(pkgDir, "tsconfig.json"), `${JSON.stringify(tsconfig, null, 2)}\n`);
writeFileSync(join(pkgDir, "tsup.config.ts"), tsupConfig);
writeFileSync(join(pkgDir, "LICENSE"), "MIT License — see repository root LICENSE.\n");

console.log(`✅ Scaffolded package @runezone/${name} at packages/${folder}`);
