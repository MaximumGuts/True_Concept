/**
 * Read-only backup of the currently-live Firebase Hosting bundle.
 *
 * Downloads every file referenced from the live `index.html` plus everything
 * in the service-worker precache manifest, into `backups/firebase-<DATE>/`.
 *
 * No auth required — Firebase Hosting serves these publicly. Pure HTTPS GETs.
 *
 * Usage:
 *   node scripts/backup-firebase-hosting.mjs
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const BASE = "https://true-concept-353c9.web.app";
const STAMP = new Date().toISOString().slice(0, 10);
const OUT = path.join("backups", `firebase-hosting-${STAMP}`);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "backup-script/1.0" } }, (res) => {
        // Follow simple redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve(fetchUrl(new URL(res.headers.location, url).toString()));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks) }),
        );
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

const saved = new Set();
const failed = [];

async function save(relPath) {
  const clean = relPath.replace(/^\/+/, "").replace(/\?.*$/, "").replace(/#.*$/, "");
  if (!clean || saved.has(clean)) return false;
  if (clean.startsWith("http") || clean.startsWith("//")) return false;

  const url = `${BASE}/${clean}`;
  const r = await fetchUrl(url);
  if (r.status !== 200) {
    failed.push({ path: clean, status: r.status });
    return false;
  }
  const outPath = path.join(OUT, clean);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, r.body);
  saved.add(clean);
  process.stdout.write(`  OK  ${clean.padEnd(60)} ${r.body.length.toString().padStart(8)} B\n`);
  return true;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  console.log(`\n📦 Backing up Firebase Hosting bundle from:\n   ${BASE}\n   → ${OUT}\n`);

  // 1) Top-level
  const TOP = [
    "index.html",
    "sw.js",
    "manifest.webmanifest",
    "favicon.ico",
    "robots.txt",
    "registerSW.js",
  ];
  console.log("== Top-level files ==");
  for (const f of TOP) await save(f);

  // 2) Parse index.html for direct <script>/<link>/<img> refs
  console.log("\n== Refs found in index.html ==");
  let html = "";
  try {
    html = fs.readFileSync(path.join(OUT, "index.html"), "utf-8");
  } catch {
    console.error("  ❌ index.html not downloaded — abort.");
    process.exit(1);
  }
  const htmlRefs = new Set();
  for (const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) htmlRefs.add(m[1]);
  for (const ref of htmlRefs) await save(ref);

  // 3) Parse sw.js precache manifest (Workbox generates this)
  console.log("\n== Refs found in sw.js (precache manifest) ==");
  let sw = "";
  try {
    sw = fs.readFileSync(path.join(OUT, "sw.js"), "utf-8");
  } catch {
    console.log("  (sw.js not present, skipping precache parse)");
  }
  const swRefs = new Set();
  // Workbox precache entries: {"revision":"...","url":"/assets/foo.js"}
  for (const m of sw.matchAll(/"url"\s*:\s*"([^"]+)"/g)) swRefs.add(m[1]);
  // workbox helper bundle reference (importScripts)
  for (const m of sw.matchAll(/(workbox-[\w-]+\.js)/g)) swRefs.add(`/${m[1]}`);
  for (const ref of swRefs) await save(ref);

  // 4) Recursive pass: parse downloaded JS chunks for references to other chunks
  console.log("\n== Recursive chunk discovery ==");
  let added = true;
  let passes = 0;
  while (added && passes < 4) {
    added = false;
    passes++;
    const jsFiles = Array.from(saved).filter((p) => p.endsWith(".js"));
    for (const jsPath of jsFiles) {
      const jsContent = fs.readFileSync(path.join(OUT, jsPath), "utf-8");
      // Vite dynamic-import chunk references: "/assets/foo-HASH.js"
      const chunkRefs = new Set();
      for (const m of jsContent.matchAll(/["'`](\/?assets\/[A-Za-z0-9_\-.]+\.[a-z0-9]+)["'`]/g))
        chunkRefs.add(m[1]);
      for (const ref of chunkRefs) {
        const prev = saved.size;
        await save(ref);
        if (saved.size > prev) added = true;
      }
    }
    console.log(`  pass ${passes}: ${saved.size} total files`);
  }

  // 5) Try to also fetch source maps for every JS file (best-effort)
  console.log("\n== Best-effort source-map fetch ==");
  const jsForMaps = Array.from(saved).filter((p) => p.endsWith(".js"));
  for (const jsPath of jsForMaps) {
    await save(jsPath + ".map");
  }

  console.log("\n=================================");
  console.log(`✅ Saved ${saved.size} files to ${OUT}`);
  if (failed.length) {
    console.log(`⚠️  ${failed.length} URLs returned non-200 (likely 404, normal):`);
    for (const f of failed.slice(0, 20)) console.log(`   ${f.status}  ${f.path}`);
    if (failed.length > 20) console.log(`   ... and ${failed.length - 20} more`);
  }
})();
