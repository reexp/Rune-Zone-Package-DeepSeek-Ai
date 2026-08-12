/**
 * check-circular-deps.mjs
 *
 * Validates the internal dependency graph of RuneZone Shared SDK:
 *   1. Ensures every declared package exists in the graph.
 *   2. Ensures the graph is acyclic (no circular dependency).
 *   3. Ensures every referenced edge is a known package.
 *
 * Usage: node scripts/check-circular-deps.mjs
 * Exit code: 0 on success, 1 on failure.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const graph = JSON.parse(readFileSync(join(root, "scripts", "dependency-graph.json"), "utf8"));

const packages = new Set(graph.packages);
const edges = graph.edges;

const errors = [];

// 1. All edges must reference known packages.
for (const [pkg, deps] of Object.entries(edges)) {
  if (!packages.has(pkg)) {
    errors.push(`Unknown package in edges: "${pkg}"`);
  }
  for (const dep of deps) {
    if (!packages.has(dep)) {
      errors.push(`Package "${pkg}" depends on unknown package "${dep}"`);
    }
  }
}

// 2. Every package must be declared.
for (const pkg of packages) {
  if (!(pkg in edges)) {
    errors.push(`Package "${pkg}" has no declared edges`);
  }
}

// 3. Acyclicity check (DFS with colors).
const WHITE = 0;
const GRAY = 1;
const BLACK = 2;
const color = new Map();
const stack = [];

for (const pkg of packages) {
  color.set(pkg, WHITE);
}

function visit(node) {
  color.set(node, GRAY);
  stack.push(node);
  for (const dep of edges[node] ?? []) {
    const c = color.get(dep);
    if (c === GRAY) {
      const cycleStart = stack.indexOf(dep);
      const cycle = [...stack.slice(cycleStart), dep].join(" -> ");
      errors.push(`Circular dependency detected: ${cycle}`);
    } else if (c === WHITE) {
      visit(dep);
    }
  }
  stack.pop();
  color.set(node, BLACK);
}

for (const pkg of packages) {
  if (color.get(pkg) === WHITE) {
    visit(pkg);
  }
}

if (errors.length > 0) {
  console.error("❌ Dependency graph validation failed:");
  for (const err of errors) {
    console.error(`   - ${err}`);
  }
  process.exit(1);
}

console.log(`✅ Dependency graph OK — ${packages.size} packages, no circular dependencies.`);
