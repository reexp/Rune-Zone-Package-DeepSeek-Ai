import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "packages",
      include: ["packages/**/tests/**/*.test.{ts,tsx}"],
      environment: "node",
      globals: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["packages/**/src/**"],
      },
    },
  },
  {
    test: {
      name: "tooling",
      include: ["tooling/**/tests/**/*.test.{ts,tsx}"],
      environment: "node",
      globals: true,
    },
  },
]);
