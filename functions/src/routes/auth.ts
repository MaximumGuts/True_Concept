import { onRequest } from "firebase-functions/v2/https";
import { db, firebaseAuth } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { getSubPath } from "../utils/router.js";
import { signToken, requireAuth, type AuthUser, type AuthError } from "../middleware/auth.js";

export const auth = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  const subPath = getSubPath(req, "/api/auth");

  try {
    // POST /api/auth/login — Admin login
    if (req.method === "POST" && subPath === "/login") {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: "Username and password required" });
        return;
      }

      const usersSnap = await db.collection("users").where("username", "==", username).get();
      if (usersSnap.empty) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const userDoc = usersSnap.docs[0];
      const user = userDoc.data();
      if (user.password !== password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const authUser: AuthUser = {
        id: userDoc.id,
        username: user.username,
        role: user.role as "admin" | "student",
        name: user.name,
      };
      const token = signToken(authUser);
      res.json({ user: authUser, token });
      return;
    }

    // POST /api/auth/phone-login — Student phone login
    // Body: { idToken, intent: "login" | "register", name?, classLevel?, medium?, board? }
    //   - intent="login": must already exist in DB. Returns 404 if not.
    //   - intent="register": account is created with the supplied profile fields.
    if (req.method === "POST" && subPath === "/phone-login") {
      const { idToken, intent, name, phone: formPhone, classLevel, medium, board } = req.body;

      if (!idToken) {
        res.status(400).json({ error: "Firebase ID token required" });
        return;
      }

      let decoded: { uid: string; phone_number?: string };
      try {
        decoded = await firebaseAuth.verifyIdToken(idToken);
      } catch (err) {
        const code = (err as { code?: string })?.code ?? "unknown";
        const message = (err as { message?: string })?.message ?? "Token verification failed";
        res.status(401).json({ error: "Invalid or expired token", code, detail: message });
        return;
      }

      const { uid, phone_number: phone } = decoded;
      const studentRef = db.collection("students").doc(uid);
      const studentSnap = await studentRef.get();

      // Login intent — must already be registered
      if (intent === "login" && !studentSnap.exists) {
        res.status(404).json({ error: "not_registered", message: "No account found for this phone number. Please register first." });
        return;
      }

      // Register intent — must NOT already exist (prevent accidental overwrite)
      if (intent === "register" && studentSnap.exists) {
        // Already registered — just log them in (graceful fallback)
        await studentRef.update({ lastLogin: new Date() });
      } else if (!studentSnap.exists) {
        // First-time signup — profile fields required
        if (!name || !classLevel || !medium || !board) {
          res.status(400).json({ error: "missing_profile", message: "Name, class, medium, and board are required for registration." });
          return;
        }
        // Use the OTP-verified phone if available; fall back to form phone
        await studentRef.set({
          phone: phone ?? formPhone ?? "",
          name,
          classLevel,
          medium,
          board,
          authMethod: "phone",
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        await studentRef.update({ lastLogin: new Date() });
      }

      const profile = studentSnap.exists ? studentSnap.data() : { name, classLevel, medium, board };
      const authUser: AuthUser = {
        id: uid,
        username: phone ?? uid,
        role: "student",
        name: profile!.name,
      };

      const token = signToken(authUser);
      res.json({ user: authUser, token, classLevel: profile!.classLevel ?? null, medium: profile!.medium ?? null });
      return;
    }

    // POST /api/auth/google-login — Student sign-in with Google
    // Body: { idToken, intent: "login" | "register", name?, classLevel?, medium?, board? }
    //   - intent="login": must already exist in DB. Returns 404 if not.
    //   - intent="register": account is created with the supplied profile fields.
    if (req.method === "POST" && subPath === "/google-login") {
      const { idToken, intent, name, phone, classLevel, medium, board } = req.body;

      if (!idToken) {
        res.status(400).json({ error: "Google ID token required" });
        return;
      }

      let decoded: { uid: string; email?: string; name?: string; picture?: string };
      try {
        decoded = await firebaseAuth.verifyIdToken(idToken);
      } catch (err) {
        const code = (err as { code?: string })?.code ?? "unknown";
        const message = (err as { message?: string })?.message ?? "Token verification failed";
        res.status(401).json({ error: "Invalid or expired token", code, detail: message });
        return;
      }

      const { uid, email, name: displayName } = decoded;
      const studentRef = db.collection("students").doc(uid);
      const studentSnap = await studentRef.get();

      // Login intent — must already be registered
      if (intent === "login" && !studentSnap.exists) {
        res.status(404).json({
          error: "not_registered",
          message: "No account found for this Google account. Please register first.",
          prefill: { name: displayName ?? "", email: email ?? "" },
        });
        return;
      }

      if (!studentSnap.exists) {
        // New student — registration with profile fields required
        if (!name || !phone || !classLevel || !medium || !board) {
          res.status(400).json({
            error: "missing_profile",
            message: "Name, phone, class, medium, and board are required for registration.",
            prefill: { name: displayName ?? "", email: email ?? "" },
          });
          return;
        }
        await studentRef.set({
          email: email ?? "",
          name: name ?? displayName ?? "",
          phone: phone ?? "",
          classLevel,
          medium,
          board,
          authMethod: "google",
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        await studentRef.update({ lastLogin: new Date() });
      }

      const profile = studentSnap.exists
        ? studentSnap.data()
        : { name: name ?? displayName ?? "", classLevel, medium, board };
      const authUser: AuthUser = {
        id: uid,
        username: email ?? uid,
        role: "student",
        name: profile!.name,
      };

      const token = signToken(authUser);
      res.json({ user: authUser, token, classLevel: profile!.classLevel ?? null, medium: profile!.medium ?? null });
      return;
    }

    // PATCH /api/auth/credentials — admin updates own username/password.
    // Body: { currentPassword, newUsername?, newPassword? }
    // Returns a freshly-signed token because the JWT embeds the username.
    if (req.method === "PATCH" && subPath === "/credentials") {
      const me = requireAuth(req);
      if (me.role !== "admin") {
        res.status(403).json({ error: "Only admins can change credentials here" });
        return;
      }
      const { currentPassword, newUsername, newPassword } = req.body ?? {};
      if (!currentPassword || (typeof currentPassword !== "string")) {
        res.status(400).json({ error: "currentPassword is required" });
        return;
      }
      const trimmedUsername = typeof newUsername === "string" ? newUsername.trim() : "";
      const hasNewUsername = trimmedUsername.length > 0 && trimmedUsername !== me.username;
      const hasNewPassword = typeof newPassword === "string" && newPassword.length > 0;
      if (!hasNewUsername && !hasNewPassword) {
        res.status(400).json({ error: "Provide a new username or new password" });
        return;
      }
      if (hasNewPassword && newPassword.length < 6) {
        res.status(400).json({ error: "New password must be at least 6 characters" });
        return;
      }

      const userRef = db.collection("users").doc(me.id);
      const userSnap = await userRef.get();
      if (!userSnap.exists) {
        res.status(404).json({ error: "Admin user not found" });
        return;
      }
      const stored = userSnap.data() ?? {};
      if (stored.password !== currentPassword) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      // Username uniqueness check — avoid clobbering another account.
      if (hasNewUsername) {
        const dupSnap = await db.collection("users").where("username", "==", trimmedUsername).get();
        const conflict = dupSnap.docs.find((d) => d.id !== me.id);
        if (conflict) {
          res.status(409).json({ error: "That username is already taken" });
          return;
        }
      }

      const updates: Record<string, unknown> = {};
      if (hasNewUsername) updates.username = trimmedUsername;
      if (hasNewPassword) updates.password = newPassword;
      await userRef.update(updates);

      const updatedUser: AuthUser = {
        id: me.id,
        username: hasNewUsername ? trimmedUsername : me.username,
        role: me.role,
        name: me.name,
      };
      const token = signToken(updatedUser);
      res.json({ user: updatedUser, token });
      return;
    }

    // POST /api/auth/logout
    if (req.method === "POST" && subPath === "/logout") {
      res.json({ ok: true });
      return;
    }

    // GET /api/auth/me
    if (req.method === "GET" && subPath === "/me") {
      const user = requireAuth(req);
      res.json(user);
      return;
    }

    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err as AuthError;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Auth error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
