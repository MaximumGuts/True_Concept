/**
 * Generates all required PNG icon sizes from the SVG source icon.
 * Run: node generate-icons.mjs
 * Requires: npm install (sharp must be installed)
 */

import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SVG_SRC   = resolve(__dirname, "../artifacts/true-concept/public/icons/icon.svg");
const OUT_DIR   = resolve(__dirname, "../artifacts/true-concept/public/icons");
const ANDROID_DIR = resolve(__dirname, "android/app/src/main/res");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Android adaptive icon sizes (mipmap densities)
const androidSizes = [
  { density: "mipmap-mdpi",    size: 48  },
  { density: "mipmap-hdpi",    size: 72  },
  { density: "mipmap-xhdpi",   size: 96  },
  { density: "mipmap-xxhdpi",  size: 144 },
  { density: "mipmap-xxxhdpi", size: 192 },
];

const svgBuffer = readFileSync(SVG_SRC);

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });

  // Web PWA icons
  console.log("Generating web PWA icons...");
  for (const size of sizes) {
    const out = resolve(OUT_DIR, `icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(out);
    console.log(`  ✓ icon-${size}.png`);
  }

  // Android launcher icons
  console.log("\nGenerating Android launcher icons...");
  for (const { density, size } of androidSizes) {
    const dir = resolve(ANDROID_DIR, density);
    mkdirSync(dir, { recursive: true });
    const out = resolve(dir, "ic_launcher.png");
    const outRound = resolve(dir, "ic_launcher_round.png");
    await sharp(svgBuffer).resize(size, size).png().toFile(out);
    await sharp(svgBuffer).resize(size, size).png().toFile(outRound);
    console.log(`  ✓ ${density}/ic_launcher.png (${size}px)`);
  }

  // Splash screen (1080×1920)
  const splashDir = resolve(ANDROID_DIR, "drawable");
  mkdirSync(splashDir, { recursive: true });
  await sharp(svgBuffer)
    .resize(432, 432)    // centered logo on splash
    .extend({ top: 744, bottom: 744, left: 324, right: 324, background: { r: 12, g: 9, b: 32, alpha: 1 } })
    .png()
    .toFile(resolve(splashDir, "splash.png"));
  console.log("  ✓ drawable/splash.png (1080×1920)");

  console.log("\n✅ All icons generated successfully.");
}

run().catch((err) => { console.error(err); process.exit(1); });
