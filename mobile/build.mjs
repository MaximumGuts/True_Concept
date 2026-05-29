/**
 * TRUE CONCEPT — Mobile APK Build Script
 *
 * Usage:
 *   $env:API_URL="http://192.168.1.5:3000"; node build.mjs
 *   $env:API_URL="http://192.168.1.5:3000"; node build.mjs --release
 *
 * API_URL must be your PC's local IP (for testing) or deployed URL (production).
 * Find your IP: run  ipconfig  and look for IPv4 Address.
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname   = dirname(fileURLToPath(import.meta.url));
const ROOT        = resolve(__dirname, "..");
const MOBILE      = __dirname;
const ANDROID_DIR = resolve(MOBILE, "android");

const isRelease = process.argv.includes("--release");
const isWindows = process.platform === "win32";

const API_URL = process.env.API_URL;
if (!API_URL) {
  console.error("\n❌  API_URL is not set.\n");
  console.error("    Run this first (replace IP with your PC's IPv4 address):\n");
  console.error("    PowerShell:  $env:API_URL='http://192.168.x.x:3000'; node build.mjs");
  console.error("    Find your IP: run  ipconfig  and look for IPv4 Address\n");
  process.exit(1);
}

function run(cmd, cwd = ROOT, label = "", extraEnv = {}) {
  if (label) console.log(`\n▶ ${label}`);
  console.log(`  $ ${cmd}`);
  execSync(cmd, {
    cwd,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...extraEnv },
  });
}

function step(msg) {
  console.log(`\n${"─".repeat(60)}\n  ${msg}\n${"─".repeat(60)}`);
}

async function main() {
  console.log(`\n🚀 TRUE CONCEPT APK Builder — ${isRelease ? "RELEASE" : "DEBUG"}`);
  console.log(`   API URL: ${API_URL}\n`);

  // ── Step 1: Build the web app with the API URL baked in ────
  // Ads:
  //   debug build   (no --release) → TEST AdMob units (guaranteed fill)
  //   release build (--release)     → REAL AdMob units (revenue, Play Store)
  // This matters because real units on a new AdMob account get NO_FILL until
  // the app is verified via Play Store listing. See AdMob-Verification-Guide.md.
  step("1/3  Building web app");
  console.log(`  ➤ Ads: ${isRelease ? "REAL (production AdMob units)" : "TEST (Google's official test units)"}`);
  run(
    "pnpm --filter @workspace/true-concept build",
    ROOT,
    "pnpm build (true-concept)",
    {
      VITE_API_BASE_URL: API_URL,
      VITE_USE_REAL_ADS: isRelease ? "true" : "false",
    }
  );

  const webDist = resolve(ROOT, "artifacts/true-concept/dist/public");
  if (!existsSync(webDist)) {
    console.error(`\n❌ Web build output not found at: ${webDist}`);
    process.exit(1);
  }
  console.log("  ✓ Web build complete — API URL baked in");

  // ── Step 2: Capacitor sync ─────────────────────────────────
  step("2/3  Syncing Capacitor");
  run("npx cap sync android", MOBILE, "cap sync android");
  console.log("  ✓ Capacitor sync complete");

  // ── Step 3: Gradle build ───────────────────────────────────
  step("3/3  Building Android APK");

  const gradlew = isWindows
    ? resolve(ANDROID_DIR, "gradlew.bat")
    : resolve(ANDROID_DIR, "gradlew");

  if (!existsSync(gradlew)) {
    console.error(`\n❌ Gradle wrapper not found. Open the project in Android Studio first.`);
    process.exit(1);
  }

  const gradleTask = isRelease ? "assembleRelease" : "assembleDebug";
  // Use explicit relative path on both platforms. `gradlew.bat` (no prefix)
  // works only when spawned through cmd.exe (which has `.` on PATH); spawning
  // via PowerShell or a non-cmd shell needs the `.\` prefix to resolve.
  const gradleCmd  = isWindows ? `.\\gradlew.bat ${gradleTask}` : `./gradlew ${gradleTask}`;

  run(gradleCmd, ANDROID_DIR, `gradle ${gradleTask}`);

  // ── Output ─────────────────────────────────────────────────
  const variant = isRelease ? "release" : "debug";
  const apkName = isRelease ? "app-release.apk" : "app-debug.apk";
  const apkPath = resolve(ANDROID_DIR, `app/build/outputs/apk/${variant}/${apkName}`);

  if (existsSync(apkPath)) {
    console.log(`\n✅ APK built!\n   📦 ${apkPath}`);
    console.log(`\n   Install on device:`);
    console.log(`   adb install "${apkPath}"\n`);
  } else {
    console.error("\n❌ APK not found after build.");
    process.exit(1);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
