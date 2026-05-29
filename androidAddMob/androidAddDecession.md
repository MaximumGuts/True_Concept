**Step 1**
This project is a React + Vite web app wrapped using Capacitor for Android APK generation.

I want to integrate Google AdMob ONLY for the Capacitor Android app version.

Tasks:

1. Install and configure a maintained Capacitor AdMob plugin for Android.
2. Sync Capacitor properly.
3. Configure AndroidManifest.xml correctly with:
   - internet permission
   - AdMob application ID placeholder
4. Ensure no web implementation is added.
5. Keep all changes isolated and production-safe.
6. Do not modify unrelated project files.
7. Add comments where necessary.

After implementation, explain:

- which files were modified
- where I should place my AdMob App ID
- how to test with test ads

**Step 2**
Create a centralized AdMob initialization system for this Capacitor Android app.

Requirements:

1. Create a dedicated ads folder structure.
2. Create an admob initialization utility.
3. Initialize AdMob only when running inside Capacitor Android environment.
4. Ensure initialization happens only once when app starts.
5. Add proper TypeScript safety.
6. Add error handling and logs for debugging.
7. Do not initialize AdMob in browser/web mode.

Also:

- explain where the initializer should be called
- explain how to verify initialization success

**Step 3**
Create a centralized rewarded ad manager for the Capacitor Android app using AdMob.

Requirements:

1. Create reusable rewarded ad utilities inside src/ads.
2. Support:
   - preload rewarded ad
   - show rewarded ad
   - reload next ad automatically
3. Ensure reward is granted ONLY after reward-earned callback.
4. Add proper loading states.
5. Add error handling for:
   - ad failed to load
   - ad closed early
   - no internet
6. Ensure ads only run in Capacitor Android environment.
7. Keep implementation clean and modular.

Do not integrate with UI yet.
Only create the reusable rewarded ad system.

**Step4**
Create a reusable unlock management system for rewarded ad access control.

Requirements:

1. Create unlockManager utility.
2. Store unlock expiry timestamps using localStorage.
3. Support these unlock types:
   - notes
   - lab
   - mcq
   - qna
4. Each unlock lasts for 1 hour.
5. Add reusable helper functions:
   - unlockFeature
   - isFeatureUnlocked
   - getRemainingUnlockTime
6. Use TypeScript properly.
7. Keep logic isolated from UI.

Do not implement any modal or page integration yet.

**Step 5**
Connect the rewarded ad manager with the unlock management system.

Requirements:

1. Create reusable functions for:
   - unlockNotesAccess
   - unlockLabAccess
   - unlockMCQAccess
   - unlockQnAAccess
2. When reward callback succeeds:
   - unlock corresponding feature for 1 hour
3. Ensure unlock is NOT granted if:
   - ad closed early
   - ad failed
4. Reload next rewarded ad automatically after completion.
5. Add proper TypeScript types and error handling.
6. Keep all logic inside ads/unlock utilities.
7. Do not integrate with pages yet.

**Step 6**
Create a reusable UnlockModal component for rewarded ad access.

Requirements:

1. Create a premium-looking modal component.
2. Props should support:
   - title
   - description
   - feature type
   - unlock handler
3. Add:
   - Watch Ad button
   - Cancel button
4. Add loading state while ad is loading/showing.
5. Prevent multiple clicks.
6. Use smooth animations and clean UI.
7. Mobile-first responsive design.
8. Do not use browser alert/popups.
9. Keep component reusable for all feature types.

Do not integrate with routes/pages yet.

**Step 7**
Integrate rewarded unlock flow into the Notes section.

Requirements:

1. Before showing notes content:
   - check if notes feature is unlocked
2. If locked:
   - show UnlockModal
3. If unlocked:
   - allow access normally
4. Use existing unlockManager and rewarded ad utilities.
5. Do not break existing notes functionality.
6. Keep implementation clean and minimal.
7. Add comments where needed.
8. Ensure routing behavior remains stable.

**Step 8**
Integrate rewarded unlock flow into the Virtual Lab section.

Requirements:

1. Before starting experiment interaction:
   - check lab unlock status
2. If locked:
   - show UnlockModal
3. If unlocked:
   - allow full interaction
4. Allow experiment browsing even when locked.
5. Do not break existing lab functionality.
6. Keep integration modular and clean.

**Step 9**
Integrate rewarded unlock flow into the MCQ section.

Requirements:

1. Check MCQ unlock status before quiz interaction.
2. If locked:
   - show UnlockModal
3. If unlocked:
   - allow quiz interaction normally
4. Keep existing quiz logic untouched as much as possible.
5. Maintain mobile responsiveness.

**Step 10**
Integrate rewarded unlock flow into the QnA section.

Requirements:

1. Check unlock before showing detailed answers or interactions.
2. If locked:
   - show UnlockModal
3. If unlocked:
   - allow access normally
4. Keep implementation modular.
5. Avoid unnecessary refactors.

**Step 11**
Create a very small adaptive banner ad component for Capacitor Android using AdMob.

Requirements:

1. Use adaptive banner ads.
2. Banner should be minimal height and non-intrusive.
3. Create reusable TinyBanner component.
4. Ensure banner works only in Capacitor Android environment.
5. Add proper cleanup when component unmounts.
6. Add error handling and loading states.
7. Do not overlap bottom gestures or safe area.
8. Keep implementation isolated and reusable.

Do not place banners on pages yet.

**Step 12**
Integrate TinyBanner component across the Capacitor Android app using AdMob.

Requirements:

1. Show TinyBanner on ALL screens/pages EXCEPT screens where the bottom navigation bar is present.
2. Detect navbar layout properly and avoid banner rendering on those pages.
3. Do not overlap:
   - content
   - Android gesture area
   - safe area
4. Add proper bottom spacing/padding wherever banner is shown.
5. Banner should remain very small and non-intrusive.
6. Use adaptive banner ads for better responsiveness.
7. Ensure banner ads only run inside Capacitor Android environment.
8. Avoid unnecessary banner reloads during route changes if possible.
9. Add proper cleanup when leaving screens.
10. Keep implementation modular and reusable.
11. Do not modify unrelated UI/layout structures unnecessarily.
12. Maintain smooth navigation and scrolling performance.

Also:

- explain which screens currently show banners
- explain which screens are excluded due to bottom navbar presence
- explain where future pages can be added to the exclusion list

**Step 13**

Add Capacitor app lifecycle handling for AdMob and unlock system.

Requirements:

1. Detect app resume/background events.
2. Reload rewarded ads if necessary.
3. Recheck unlock expiry on app resume.
4. Prevent stale ad states.
5. Keep implementation lightweight and modular.

**Step 14**
Improve the AdMob system with proper production and test mode separation.

Requirements:

1. Use test ad IDs during development.
2. Add centralized config for:
   - test IDs
   - production IDs
3. Ensure production ads are never used accidentally during development.
4. Add environment-safe configuration handling.
5. Keep implementation scalable and clean.

**Step 15**
Review the complete AdMob integration system for this Capacitor Android app.

Tasks:

1. Check for memory leaks.
2. Check for duplicated ad loads.
3. Verify reward callback safety.
4. Verify cleanup on component unmount.
5. Improve TypeScript safety.
6. Ensure all AdMob logic is isolated properly.
7. Ensure browser/web mode does not execute AdMob code.
8. Optimize for production stability.
9. Add concise comments where useful.

Do not redesign existing UI or architecture unnecessarily.
