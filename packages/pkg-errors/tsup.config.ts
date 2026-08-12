import { defineConfig } from "tsup";

/**
 * Build config untuk @runezone/rune-errors.
 *
 * - ESM + CJS dual format
 * - Declarations (.d.ts) via tsc
 * - Sourcemaps
 * - Tree-shaking friendly (sideEffects: false di package.json)
 */
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  splitting: false,
  target: "es2022",
  outDir: "dist",
  tsconfig: "./tsconfig.json",
});
