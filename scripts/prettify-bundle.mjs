// Prettify a minified JS bundle from the Firebase backup so it's readable for
// hand-porting back to TypeScript source.
//
// Usage:   node scripts/prettify-bundle.mjs <bundle-name>
// Example: node scripts/prettify-bundle.mjs motion-DvSqCh3k.js
//
// Output goes to scripts/decoded/<bundle-name>.pretty.js
//
// Approach: find the latest backups/firebase-hosting-DATE/assets/<bundle-name>,
// run prettier on it (workspace dep), fall back to a tiny inserter, and emit
// a short index of named React components / exports.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: node scripts/prettify-bundle.mjs <bundle-filename>");
  process.exit(1);
}

const backupRoot = "backups";
const dirs = fs.readdirSync(backupRoot).filter((d) => d.startsWith("firebase-hosting-")).sort();
if (dirs.length === 0) {
  console.error(`No backups/firebase-hosting-* directories found.`);
  process.exit(1);
}
const latestBackup = path.join(backupRoot, dirs[dirs.length - 1]);
const inputPath = path.join(latestBackup, "assets", arg);
if (!fs.existsSync(inputPath)) {
  console.error(`Bundle not found: ${inputPath}`);
  process.exit(1);
}
const raw = fs.readFileSync(inputPath, "utf-8");
console.log(`Read ${arg}: ${raw.length.toLocaleString()} bytes`);

const outDir = path.join("scripts", "decoded");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, arg + ".pretty.js");

let pretty = raw;
try {
  // Use the workspace's prettier if installed
  execSync(`npx --no-install prettier --parser babel --print-width 120 --stdin-filepath ${arg} < "${inputPath}" > "${outPath}"`, {
    stdio: ["ignore", "ignore", "pipe"],
    shell: true,
  });
  pretty = fs.readFileSync(outPath, "utf-8");
  console.log(`✅ Formatted via prettier → ${outPath} (${pretty.length.toLocaleString()} bytes)`);
} catch (e) {
  console.warn("⚠️  prettier not available, using tiny built-in inserter");
  pretty = raw
    .replace(/;/g, ";\n")
    .replace(/\{/g, "{\n")
    .replace(/\}/g, "\n}\n")
    .replace(/,(?![^\(]*\))/g, ",\n");
  fs.writeFileSync(outPath, pretty);
  console.log(`✅ Inserted line breaks → ${outPath} (${pretty.length.toLocaleString()} bytes)`);
}

// Index named React components and exports
console.log(`\n=== Index of named identifiers ===`);
const fnNames = new Set();
for (const m of pretty.matchAll(/function\s+([A-Z][A-Za-z0-9]+)\s*\(/g)) fnNames.add(m[1]);
for (const m of pretty.matchAll(/const\s+([A-Z][A-Za-z0-9_]+)\s*=\s*\(/g)) fnNames.add(m[1]);
for (const fn of fnNames) console.log(`  fn  ${fn}`);

console.log(`\n=== Exports ===`);
for (const m of pretty.matchAll(/export\s*\{([^}]+)\}/g)) {
  console.log(`  ${m[1].trim()}`);
}
