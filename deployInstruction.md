# TRUE CONCEPT — Deployment Guide (Beginner-Friendly)

> This is a **step-by-step** guide for deploying your app to the internet so anyone can use it.
> Follow each step in order. If something is unclear, re-read it — don't skip.
> Total time: about 1 to 1.5 hours for a first-time deployment.

---

## What You'll Deploy

Everything goes to **Firebase** — one platform for everything:

| Part                    | What it is                                                  | Where it goes                                |
| ----------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| **1. Backend API**      | Firebase Functions (`functions/`) — 10 serverless functions | Firebase Functions (asia-south1, Mumbai)     |
| **2. Frontend Web App** | React app (`artifacts/true-concept`)                        | Firebase Hosting                             |
| **3. Android APK**      | Capacitor mobile app (`mobile/`)                            | Built on your PC, shared via link/Play Store |

After all three are done:

- Anyone can visit your website (e.g. `https://true-concept-353c9.web.app`)
- Anyone can install your APK on their Android phone
- Your phone app + web app talk to your serverless API automatically

### Why Firebase for Everything?

| Old Approach (Render + Vercel)        | New Approach (Firebase only)            |
| ------------------------------------- | --------------------------------------- |
| API on Render ($7/month for no-sleep) | Firebase Functions (free for 500 users) |
| Frontend on Vercel                    | Firebase Hosting (free, global CDN)     |
| Two dashboards to manage              | One dashboard (Firebase Console)        |
| API sleeps after 15 min on free tier  | No sleep — serverless scales to zero    |
| Two deployments, two commands         | One command: `firebase deploy`          |

---

## Before You Start — Checklist

You need:

- [ ] **Firebase CLI** installed on your PC
- [ ] **Firebase project** already set up (Project ID: `true-concept-353c9`) ✅ you have this
- [ ] **Node.js ≥ 20** installed
- [ ] **pnpm** installed (`npm install -g pnpm`)
- [ ] **Git** installed on your PC
- [ ] **GitHub account** → https://github.com (optional but recommended for backup)
- [ ] Your `functions/.env` file with `TRUE_CONCEPT_SERVICE_KEY` and `SESSION_SECRET` ✅ you have this
- [ ] About 1–1.5 hours of uninterrupted time

---

# PART 1 — Install Firebase CLI

The Firebase CLI is the tool that deploys your code to Firebase. You only need to install it once.

### Step 1.1 — Install the CLI

Open PowerShell and run:

```powershell
npm install -g firebase-tools
```

This installs the `firebase` command globally. Wait for it to finish (1–2 minutes).

### Step 1.2 — Log in to Firebase

```powershell
firebase login
```

A browser window opens. Log in with the **same Google account** that owns your Firebase project (`true-concept-353c9`). After you see "Success!", close the browser tab and go back to PowerShell.

### Step 1.3 — Verify the project is linked

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets
firebase projects:list
```

You should see `true-concept-353c9` in the list. The `.firebaserc` file in your project root already points to this project.

If you don't see it, run:

```powershell
firebase use true-concept-353c9
```

---

# PART 2 — Push Your Code to GitHub (Recommended)

GitHub is not required for Firebase deployment (unlike Render/Vercel), but it's **strongly recommended** as a backup of your code.

### Step 2.1 — Create a new GitHub repository

1. Go to https://github.com and log in
2. Click the **+** icon (top-right) → **New repository**
3. Repository name: `true-concept` (or any name you like)
4. Set to **Private** (you don't want students to see your source code)
5. **Do NOT** check "Add a README" (your project already has files)
6. Click **Create repository**
7. Copy the URL shown — looks like `https://github.com/YourUsername/true-concept.git`

### Step 2.2 — Make sure secrets are not committed

Your `.gitignore` already includes these patterns (we added them earlier):

```
*.env
*.env.local
```

Run this to verify nothing sensitive is staged:

```powershell
git status
```

If you see any `.env` file in the list, **stop** — it should not be tracked.

### Step 2.3 — Push your code

```powershell
# In the project root
cd c:\Users\BSNL\Desktop\Web-App-Assets
git add .
git commit -m "Initial deployment commit"
git branch -M main
git remote add origin https://github.com/YourUsername/true-concept.git
git push -u origin main
```

If git asks for login, use your GitHub username and a **personal access token** (not your password). Create one at: https://github.com/settings/tokens

---

# PART 3 — Deploy Backend (Firebase Functions)

This deploys your 10 serverless API functions to Firebase. They handle all the `/api/*` endpoints.

### Step 3.1 — Build the functions

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets\functions
pnpm run build
```

You should see no errors. This compiles TypeScript into `functions/lib/`.

### Step 3.2 — Set environment variables for production

Firebase Functions needs your secrets. Set them using the Firebase CLI:

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets
```

**Option A — Using `.env` file (easiest):**

Your `functions/.env` file already has the variables. Firebase Functions automatically reads `.env` files in the functions directory during deployment. **No extra steps needed.**

**Option B — Using Firebase secrets (more secure, optional):**

```powershell
firebase functions:secrets:set SESSION_SECRET
# It will prompt you — enter: trueconcept-secret-2024

firebase functions:secrets:set TRUE_CONCEPT_SERVICE_KEY
# Paste the entire base64 string (one long line, no quotes)
```

> **For your first deployment, Option A is perfectly fine.** Use Option B later if you want extra security.

### Step 3.3 — Deploy the functions

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets
firebase deploy --only functions
```

**What happens:**

1. Firebase reads `firebase.json` and finds the `functions` config
2. It uploads your compiled code from `functions/lib/`
3. It deploys 10 functions to `asia-south1` (Mumbai, India)
4. This takes **3–8 minutes** the first time

**What to look for in the output:**

```
✔ functions: Finished running predeploy script.
✔ functions[auth(asia-south1)] Successful create operation.
✔ functions[subjects(asia-south1)] Successful create operation.
✔ functions[chapters(asia-south1)] Successful create operation.
... (10 total)

✔ Deploy complete!
```

### Step 3.4 — Test the API

After deployment, Firebase shows you the function URLs. Test the health endpoint:

```powershell
# Replace with your actual project ID if different
curl https://asia-south1-true-concept-353c9.cloudfunctions.net/health
```

Or open this URL in your browser:

```
https://asia-south1-true-concept-353c9.cloudfunctions.net/health
```

You should see: `{"status":"ok"}`

If you see this — **the backend is deployed!** 🎉

---

# PART 4 — Deploy Frontend (Firebase Hosting)

Firebase Hosting serves your React app and also routes `/api/*` requests to your functions (via the rewrites in `firebase.json`).

### Step 4.1 — Build the frontend

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets
pnpm --filter @workspace/true-concept build
```

This builds the React app into `artifacts/true-concept/dist/public/`.

> **Note:** You do NOT need to set `VITE_API_BASE_URL` for the web deployment. Firebase Hosting rewrites handle the `/api/*` routing automatically. The frontend calls `/api/subjects` and Firebase Hosting forwards it to the `subjects` function.

### Step 4.2 — Deploy hosting

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets
firebase deploy --only hosting
```

**What happens:**

1. Firebase uploads all files from `artifacts/true-concept/dist/public/`
2. The rewrite rules in `firebase.json` are applied
3. Your site gets a free URL with SSL (HTTPS)

**What to look for:**

```
✔ hosting: Finished running predeploy script.
✔ hosting: File upload complete.
✔ Deploy complete!

Hosting URL: https://true-concept-353c9.web.app
```

### Step 4.3 — Test the frontend

Open your browser and go to:

```
https://true-concept-353c9.web.app
```

You should see the TRUE CONCEPT login page. Try:

1. Admin login (username + password)
2. If admin login works, click Subjects — you should see your data

**If this works — the website is deployed!** 🎉

### Pro Tip — Deploy Everything at Once

Instead of deploying functions and hosting separately, you can do both in one command:

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets

# Build everything first
cd functions && pnpm run build && cd ..
pnpm --filter @workspace/true-concept build

# Deploy everything
firebase deploy
```

---

# PART 5 — Configure Firebase for Production

### Step 5.1 — Add your domain to Firebase Auth

Your Firebase project needs to know about your live URL so phone OTP login works.

1. Go to https://console.firebase.google.com
2. Select your project (`true-concept-353c9`)
3. Click **Build** (left sidebar) → **Authentication**
4. Click the **Settings** tab → **Authorized domains**
5. Click **Add domain**
6. Enter: `true-concept-353c9.web.app`
7. Click **Add**
8. Also add: `true-concept-353c9.firebaseapp.com`

Without this step, phone OTP login won't work on your live site.

### Step 5.2 — Verify Phone Sign-in is enabled

1. Still in Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Phone** → make sure it's **Enabled**
3. If you have test phone numbers (like your own with OTP `123456`), they should still be listed

---

# PART 6 — Build the Android APK (Production)

The APK is a file that you install on Android phones. For production, it needs to point to your live Firebase Hosting URL.

### Step 6.1 — Build the APK

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets
$env:API_URL = "https://true-concept-353c9.web.app"
node mobile/build.mjs
```

This does three things automatically:

1. Builds the React app with the Firebase Hosting URL baked in
2. Syncs the built files into the Android project
3. Compiles the APK using Gradle

The first time takes **5–15 minutes** (Gradle downloads dependencies). After that, 1–2 minutes.

### Step 6.2 — Find your APK

After the build completes:

```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

Copy this file. Send it to your phone via WhatsApp / Google Drive / USB cable.

### Step 6.3 — Install on Android phone

1. On the phone, open the APK file
2. Android will warn "Install unknown apps" → tap **Settings** → enable for the app you used to download (Chrome, Files, etc.)
3. Tap **Install**
4. Open the app — it should connect to your live API and let you log in

### Why the APK points to Firebase Hosting (not Functions directly)

The APK calls `https://true-concept-353c9.web.app/api/subjects`, etc. Firebase Hosting rewrites forward `/api/*` to your functions. This gives you:

- A single URL for everything
- HTTPS by default
- All API paths stay as `/api/*` (no function URLs needed)

---

# PART 7 — Build a Signed Release APK (For Distribution)

The "debug" APK works but is marked as a debug build. For sharing publicly or uploading to Google Play Store, you need a **signed release APK**.

### Step 7.1 — Generate a signing key (one-time)

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets\mobile\android\app
keytool -genkey -v -keystore true-concept.keystore -alias trueconcept -keyalg RSA -keysize 2048 -validity 10000
```

It will ask for:

- A password (write it down — you'll need it forever)
- Your name, organization, etc. (any answers are fine)

This creates `true-concept.keystore`. **Back this file up safely.** If you lose it, you can never publish updates to your app.

### Step 7.2 — Configure Gradle to use the key

Create file `mobile/android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=trueconcept
storeFile=app/true-concept.keystore
```

Add this to `mobile/.gitignore` so the password file isn't committed:

```
android/key.properties
android/app/*.keystore
```

### Step 7.3 — Edit `mobile/android/app/build.gradle`

Find the `android { ... }` block and add inside it:

```gradle
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

### Step 7.4 — Build the release APK

```powershell
$env:API_URL = "https://true-concept-353c9.web.app"
cd c:\Users\BSNL\Desktop\Web-App-Assets

# Build the web app first
$env:VITE_API_BASE_URL = $env:API_URL
pnpm --filter @workspace/true-concept build

# Sync to Android
cd mobile
npx cap sync android

# Build release APK
cd android
.\gradlew.bat assembleRelease
```

Output: `mobile/android/app/build/outputs/apk/release/app-release.apk`

This is the file you upload to the Google Play Store or share publicly.

---

# PART 8 — Publish to Google Play Store (Optional)

This step costs **$25 (one-time fee)** and is only needed if you want your app listed in the Play Store.

### Step 8.1 — Create a Play Console account

1. Go to https://play.google.com/console
2. Pay the one-time $25 registration fee
3. Fill in your developer profile (name, address, etc.)

### Step 8.2 — Create your app

1. Click **Create app**
2. Fill in:
   - App name: `TRUE CONCEPT`
   - Default language: English (India)
   - App or game: App
   - Free or paid: Free
3. Accept the declarations → **Create app**

### Step 8.3 — Upload your release bundle

> **Note:** Play Store now requires **AAB (Android App Bundle)** instead of APK. To build one, replace `assembleRelease` with `bundleRelease` in Step 7.4. The output will be at `app/build/outputs/bundle/release/app-release.aab`.

1. In your app dashboard, go to **Production** (left sidebar)
2. Click **Create new release**
3. Upload your `.aab` file
4. Add release notes (e.g., "First release")
5. Save → **Review release**

### Step 8.4 — Fill in Store listing

You'll need:

- App icon (512×512 PNG) — you can use `artifacts/true-concept/public/icons/icon-512.png`
- Feature graphic (1024×500 PNG) — design one in Canva
- Phone screenshots (at least 2)
- Short description (80 chars): `NCERT Class IX–X Science learning with virtual lab`
- Full description (4000 chars max)
- Privacy policy URL (you must create one — use https://app-privacy-policy-generator.firebaseapp.com)
- Category: Education
- Email contact

### Step 8.5 — Submit for review

After everything is filled in, hit **Send for review**. Google takes **3–7 days** to review. You'll get an email when it's live.

---

# PART 9 — Updating Your Live App

## How to Update (Simple Workflow)

```powershell
# 1. Edit code locally, test it
cd c:\Users\BSNL\Desktop\Web-App-Assets
pnpm --filter @workspace/true-concept dev    # test frontend
# or: firebase emulators:start --only functions  # test backend

# 2. Build everything
cd functions && pnpm run build && cd ..
pnpm --filter @workspace/true-concept build

# 3. Deploy everything in one command
firebase deploy

# That's it. Live in 3-5 minutes.
```

## What Needs Manual Action

| What changed                                 | What to do                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Frontend code (React components, pages, CSS) | `pnpm --filter @workspace/true-concept build` then `firebase deploy --only hosting`              |
| Backend code (functions, routes, middleware) | `cd functions && pnpm run build && cd ..` then `firebase deploy --only functions`                |
| Both frontend + backend                      | Build both, then `firebase deploy`                                                               |
| Environment variables in `functions/.env`    | Edit the file, then `firebase deploy --only functions`                                           |
| Android APK                                  | Rebuild: `$env:API_URL="https://true-concept-353c9.web.app"; node mobile/build.mjs` and re-share |
| Firebase Auth settings                       | Edit in Firebase Console (no deploy needed)                                                      |

## How to Roll Back if Something Breaks

**Firebase Hosting:**

1. Go to Firebase Console → Hosting
2. You'll see a list of all past deploys with timestamps
3. Click the `⋯` next to the working version → **Rollback**
4. Takes 5 seconds

**Firebase Functions:**
Re-deploy the old code. If you use GitHub, you can `git checkout` the old commit and deploy again.

## Updating the APK

The APK does **not** auto-update. You have to rebuild and redistribute it:

```powershell
$env:API_URL = "https://true-concept-353c9.web.app"
node mobile/build.mjs
```

Then send the new APK to users. To make it install smoothly over the old version (without uninstalling), increment `versionCode` in `mobile/android/app/build.gradle` before building.

For Play Store: upload the new AAB to a new release → users get the update automatically.

---

# DEMO BUILD (Local Network — No Internet Deployment)

Use this when you want to **demo the app to someone in the same room** without deploying to Firebase. Both your phone and the demo phone must be on the **same WiFi network**.

### Step 1 — Find your PC's IP address

```powershell
ipconfig
```

Look for `IPv4 Address` under your WiFi adapter — something like `192.168.1.5`.

### Step 2 — Start the Firebase emulator

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets
firebase emulators:start --only functions
```

Keep this terminal open — the emulator must stay running during the demo. It runs on port `5001`.

### Step 3 — Rebuild the APK with your local IP baked in

Open a **second** PowerShell window:

```powershell
cd c:\Users\BSNL\Desktop\Web-App-Assets
$env:API_URL = "http://192.168.1.5:5001"
node mobile/build.mjs
```

> Replace `192.168.1.5` with YOUR actual IP from Step 1.

### Step 4 — Install and demo

Send the APK to the demo phone via WhatsApp/Bluetooth. Install. Open. Make sure both devices stay on the same WiFi for the entire demo.

---

# Common Problems & Fixes

### "Build failed" during `firebase deploy`

**Cause:** Functions didn't compile properly.

**Fix:** Run `cd functions && pnpm run build` first and check for TypeScript errors. Fix them, then try deploying again.

### "Network error" on the live site

**Cause:** Frontend can't reach the API functions.

**Check:**

1. Did `firebase deploy --only functions` succeed? (Check Firebase Console → Functions — all 10 should be listed)
2. Did `firebase deploy --only hosting` succeed? (Check Firebase Console → Hosting — latest deploy should be "Current")
3. Are the rewrites in `firebase.json` correct? (`/api/subjects/**` → `subjects` function, etc.)

### Phone OTP doesn't send on live site

**Cause:** Firebase Hosting domain not added to Firebase Auth authorized domains.

**Fix:** Go to Firebase Console → Authentication → Settings → Authorized domains → Add `true-concept-353c9.web.app`

### Cold start — first API call takes 3-5 seconds

**Cause:** Normal behavior for serverless functions. Each function starts up on the first request after being idle.

**This is expected.** After the first request, subsequent calls are fast (~200ms). For 500 students, this is barely noticeable since someone is almost always using the app.

### APK installs but shows white screen

**Cause:** `VITE_API_BASE_URL` (or `API_URL`) was empty or wrong when you built.

**Fix:**

```powershell
$env:API_URL = "https://true-concept-353c9.web.app"
node mobile/build.mjs
```

### "Cannot install app — app not signed correctly"

**Cause:** Mixing debug and release versions.

**Fix:** Uninstall any existing version first, then install the new one.

### "Permission denied" when running `firebase deploy`

**Cause:** Not logged in or wrong Google account.

**Fix:**

```powershell
firebase login --reauth
```

Log in with the Google account that owns the Firebase project.

---

# Quick Reference — All URLs

After deployment, you'll have:

| What                    | URL                                                                      |
| ----------------------- | ------------------------------------------------------------------------ |
| **Live website**        | `https://true-concept-353c9.web.app`                                     |
| **Same site (alt URL)** | `https://true-concept-353c9.firebaseapp.com`                             |
| **API health check**    | `https://true-concept-353c9.web.app/api/healthz`                         |
| **Firebase Console**    | https://console.firebase.google.com/project/true-concept-353c9           |
| **Functions dashboard** | https://console.firebase.google.com/project/true-concept-353c9/functions |
| **Hosting dashboard**   | https://console.firebase.google.com/project/true-concept-353c9/hosting   |
| **GitHub repo**         | `https://github.com/YourUsername/true-concept`                           |

---

# Cost Estimate — 500 Active Users

## Firebase Pricing Breakdown

Firebase has two plans:

- **Spark (Free)** — generous free tier, no credit card needed
- **Blaze (Pay-as-you-go)** — free tier included + pay for what you use above it

### Will the Free Tier (Spark) Be Enough?

Let's estimate what 500 daily active students generate:

| Resource                           | Free Tier Limit            | Your ~500 Users                                                                             | Enough? |
| ---------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------- | ------- |
| **Firestore Reads**                | 50,000/day                 | ~15,000–25,000/day (30–50 reads per student session: subjects, chapters, content, progress) | ✅ Yes  |
| **Firestore Writes**               | 20,000/day                 | ~2,500–5,000/day (MCQ scores, progress marks, ~5–10 writes per session)                     | ✅ Yes  |
| **Firebase Auth**                  | 10,000 verifications/month | ~500 logins/month (students log in once and stay logged in for 7 days)                      | ✅ Yes  |
| **Firebase Functions Invocations** | 2,000,000/month            | ~450,000/month (30 API calls × 500 users × 30 days)                                         | ✅ Yes  |
| **Functions Compute (GB-s)**       | 400,000 GB-seconds/month   | ~45,000 GB-s (each call ~1s at 256MB)                                                       | ✅ Yes  |
| **Hosting Storage**                | 10 GB                      | ~50 MB (your React app)                                                                     | ✅ Yes  |
| **Hosting Bandwidth**              | 360 MB/day                 | ~150 MB/day (500 users × ~300KB first load)                                                 | ✅ Yes  |

### Verdict: **100% Free for 500 Users** ✅

The Spark (free) plan comfortably handles 500 daily active users. You don't even need a credit card.

### When Would You Need to Pay?

| Scenario                              | Action                                    | Estimated Cost                     |
| ------------------------------------- | ----------------------------------------- | ---------------------------------- |
| 500 users                             | Spark (free) plan                         | **$0/month**                       |
| 1,000–2,000 users                     | Upgrade to Blaze (still mostly free tier) | **$0–$5/month**                    |
| 5,000+ users                          | Blaze plan, exceeding free tiers          | **$10–$25/month**                  |
| 10,000+ users                         | Blaze plan, significant usage             | **$25–$75/month**                  |
| Custom domain (e.g. `trueconcept.in`) | Buy from Google Domains, Namecheap, etc.  | **₹500–₹1000/year** (~$8–$12/year) |
| Google Play Store listing             | One-time registration fee                 | **$25 one-time**                   |

### Monthly Cost Summary for 500 Users

| Service                    | Cost                        |
| -------------------------- | --------------------------- |
| Firebase Functions (API)   | **₹0** (free)               |
| Firebase Hosting (website) | **₹0** (free)               |
| Firebase Auth (OTP login)  | **₹0** (free)               |
| Firestore (database)       | **₹0** (free)               |
| GitHub (code backup)       | **₹0** (free, private repo) |
| Google Play Store          | **₹2,100 one-time** ($25)   |
| Custom domain (optional)   | **₹500–₹1000/year**         |

### **Total Monthly Cost: ₹0 (FREE)** 🎉

You only pay ₹2,100 once if you want Play Store listing, and optionally ₹500–₹1000/year for a custom domain.

> **Compare with the old approach:**
>
> - Render.com Starter plan = $7/month (₹580/month) = ₹7,000/year just for the API server
> - Firebase Functions = ₹0/year for the same thing

---

# Final Checklist Before Going Live

Before sharing your app with real students:

- [ ] `firebase deploy` completed successfully (both functions + hosting)
- [ ] Website loads at `https://true-concept-353c9.web.app`
- [ ] Health check works: visit `/api/healthz` → shows `{"status":"ok"}`
- [ ] Firebase Hosting domain added to Firebase Auth authorized domains
- [ ] Tested admin login on the live URL
- [ ] Tested student phone OTP login on the live URL
- [ ] Created at least one subject + chapter + experiment as admin
- [ ] APK installed on a real phone and works against the live Firebase URL
- [ ] Verified `.env` files are NOT in your GitHub repo (`git ls-files | findstr .env` should return nothing)
- [ ] WhatsApp channel link updated in `WhatsAppPopup.tsx` (if you have one)

---

_Built your first deployment? Congratulations — you're now a full-stack developer with zero hosting costs._

_Going Forward — Standard Workflow_

#Every time you change function code:#

cd functions
pnpm run build # bundles + writes clean package.json + npm installs lib/
cd ..
firebase deploy --only functions --project true-concept-353c9.
