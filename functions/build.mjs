import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { build as esbuild } from "esbuild";
import { readFile, rm, writeFile } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const fnDir = path.dirname(fileURLToPath(import.meta.url));

async function buildAll() {
  const libDir = path.resolve(fnDir, "lib");
  await rm(libDir, { recursive: true, force: true });

  // 1. Bundle TypeScript with workspace deps inlined
  await esbuild({
    entryPoints: [path.resolve(fnDir, "src/index.ts")],
    platform: "node",
    target: "node22",
    bundle: true,
    format: "esm",
    outfile: path.resolve(libDir, "index.js"),
    logLevel: "info",
    sourcemap: "linked",
    // Real npm packages stay external — installed by `npm install` on Cloud Build.
    // Workspace packages (@workspace/*) and our own code get bundled inline.
    external: [
      "firebase-admin",
      "firebase-admin/*",
      "firebase-functions",
      "firebase-functions/*",
      "cors",
      "jsonwebtoken",
      "*.node",
    ],
    // Make CommonJS-only packages work in our ESM output
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);`,
    },
  });

  // 2. Write a clean package.json into lib/ — no workspace:* refs.
  //    Firebase will deploy from lib/ and `npm install` only sees real npm deps.
  const srcPkg = JSON.parse(await readFile(path.resolve(fnDir, "package.json"), "utf8"));
  const cleanPkg = {
    name: srcPkg.name,
    version: srcPkg.version,
    description: srcPkg.description,
    main: "index.js",
    type: "module",
    engines: srcPkg.engines,
    // Only include real npm dependencies (workspace deps are bundled into index.js)
    dependencies: Object.fromEntries(
      Object.entries(srcPkg.dependencies ?? {}).filter(([, v]) => !String(v).startsWith("workspace:"))
    ),
    private: true,
  };
  await writeFile(
    path.resolve(libDir, "package.json"),
    JSON.stringify(cleanPkg, null, 2) + "\n",
    "utf8"
  );
  console.log("[build] wrote clean lib/package.json");

  // 3. Install runtime deps inside lib/ so Firebase can inspect function exports
  //    BEFORE upload. (Firebase needs firebase-functions SDK accessible locally.)
  console.log("[build] installing runtime dependencies in lib/...");
  execSync("npm install --omit=dev --no-package-lock --silent", {
    cwd: libDir,
    stdio: "inherit",
  });
  console.log("[build] lib/ is ready for deploy");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
