/**
 * Factory Vitest config untuk package RuneZone.
 *
 * Penggunaan di tiap package (vitest.config.ts):
 *
 *   import { definePackageConfig } from "@runezone/vitest-config";
 *   export default definePackageConfig({ name: "pkg-config" });
 */
export function definePackageConfig({ name, environment = "node", globals = true } = {}) {
  return {
    test: {
      name,
      environment,
      globals,
      include: ["tests/**/*.test.{ts,tsx}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["src/**"],
        exclude: ["src/**/*.d.ts"],
      },
    },
  };
}
