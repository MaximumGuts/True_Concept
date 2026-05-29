# TRUE CONCEPT — Mobile APK

Capacitor-based Android APK wrapper for the TRUE CONCEPT PWA.

## How it works

```
artifacts/true-concept/  ← Web source (edit here)
        ↓  pnpm build
artifacts/true-concept/dist/public/  ← Built web output
        ↓  npx cap sync
mobile/android/app/src/main/assets/public/  ← Copied into APK
        ↓  gradle assembleDebug
mobile/android/app/build/outputs/apk/debug/app-debug.apk  ← Final APK
```

Any change to the web source automatically appears in the next APK build.

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | nodejs.org |
| Java JDK | 17+ | adoptium.net |
| Android SDK | API 34 | Android Studio |
| pnpm | 8+ | `npm i -g pnpm` |

Set `ANDROID_HOME` env var to your Android SDK path.

---

## One-time setup

```bash
# 1. Install Capacitor dependencies
cd mobile
npm install

# 2. Generate all icon sizes (PNG) from the SVG source
npm run generate:icons

# 3. Download the Gradle wrapper JAR (needs Gradle installed globally)
cd android
gradle wrapper --gradle-version 8.5
cd ..
```

> **No Gradle installed?**
> Download `gradle-wrapper.jar` from:
> https://github.com/gradle/gradle/blob/v8.5.0/gradle/wrapper/gradle-wrapper.jar
> Place it at: `mobile/android/gradle/wrapper/gradle-wrapper.jar`

---

## Building the APK

### Debug APK (for testing)
```bash
cd mobile
node build.mjs
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for distribution)
```bash
cd mobile
node build.mjs --release
```

### Install on connected device
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Development workflow

```bash
# After any change to the web app:
node build.mjs        # builds web + syncs cap + builds APK

# Or step by step:
npm run build:web     # build web only
npm run sync          # cap sync only
```

---

## APK → Play Store

1. Create a signing keystore:
   ```bash
   keytool -genkey -v -keystore release.keystore -alias trueconcept \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Add to `android/app/build.gradle` under `buildTypes.release`:
   ```gradle
   signingConfig signingConfigs.release
   ```
3. Run `node build.mjs --release`
4. Upload `app-release.apk` to Play Console.

---

## Project structure

```
mobile/
├── capacitor.config.ts    ← App ID, webDir, plugins
├── package.json           ← Capacitor packages
├── build.mjs              ← Full build pipeline
├── generate-icons.mjs     ← PNG icon generator
└── android/
    ├── app/
    │   ├── build.gradle
    │   └── src/main/
    │       ├── AndroidManifest.xml
    │       ├── assets/            ← Web files (auto-copied by cap sync)
    │       ├── java/com/trueconcept/app/MainActivity.java
    │       └── res/               ← Icons, strings, styles
    ├── build.gradle
    ├── settings.gradle
    └── variables.gradle
```
