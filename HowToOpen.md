Open three separate terminal windows and run these commands:

Terminal 1 - API Server (port 3000):

cd artifacts/api-server
node --env-file=.env --enable-source-maps dist/index.mjs

Terminal 2 - Frontend (port 5173) AT ROOT IN POWERSHELL:

$env:PORT = "5173"
pnpm --filter @workspace/true-concept run dev

Terminal 3 - (Optional) Firebase Emulator:

firebase emulators:start --only firestore --project demo-trueconcept
Since you're using the real Firebase project (true-concept-353c9), you only need Terminals 1 and 2. The API server will automatically connect to your real Firebase database using credentials from your .env file.

Then open your browser to:

http://localhost:5173
Login credentials:

Admin: admin / admin123
Student: Phone login with +91 9999999999 and OTP 123456
What was done

1. Web app → PWA (artifacts/true-concept/)
   File Change
   package.json Added vite-plugin-pwa
   vite.config.ts Added VitePWA() plugin with service worker + offline caching
   index.html Added manifest link, theme-color, apple-mobile-web-app meta tags, PWA icons
   public/manifest.json Full web app manifest (name, icons, shortcuts, display: standalone)
   public/icons/icon.svg Brand SVG icon (coral gradient, "TC") used as icon source
   The service worker caches: all JS/CSS/HTML assets (offline), Google Fonts (1 year), API responses (24h, network-first).

2. mobile/ folder (new at root)

mobile/
├── capacitor.config.ts ← App ID: com.trueconcept.app, webDir → dist/public
├── package.json ← @capacitor/core, @capacitor/android, @capacitor/cli
├── build.mjs ← Full build pipeline (web → sync → APK)
├── generate-icons.mjs ← Generates all PNG sizes from icon.svg
├── node_modules/ ← Capacitor installed ✓
└── android/ ← Complete Android project
├── MainActivity.java, AndroidManifest.xml, build.gradle, styles, colors...
└── gradle/wrapper/ ← Gradle 8.5 config
To build the APK — 3 steps
Step 1 — One-time setup (needs Gradle globally installed or Android Studio):

cd mobile
npm run generate:icons # makes PNG icons from the SVG
cd android && gradle wrapper # downloads gradle-wrapper.jar
cd ..
Step 2 — Build debug APK:

cd mobile
node build.mjs

# → android/app/build/outputs/apk/debug/app-debug.apk

Step 3 — Install on phone:

adb install android/app/build/outputs/apk/debug/app-debug.apk
How changes stay in sync
Since the APK bundles the web build from artifacts/true-concept/dist/public/, the workflow is simply:

Edit web code → node build.mjs → new APK
build.mjs does all three steps automatically: pnpm build → cap sync → gradle assembleDebug.

**Android Work**

First we have to build the web app using following command
cd "c:\Users\ASUS\Desktop\Web-App-Assets"
pnpm --filter @workspace/true-concept build

cd "c:\Users\ASUS\Desktop\Web-App-Assets\mobile"
npx cap sync android
After that open the project in Android Studio:

npx cap open android
Android Studio will open the mobile/android folder. Once it loads:
