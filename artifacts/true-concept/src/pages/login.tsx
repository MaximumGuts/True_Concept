import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs, type StudentClass, type StudentMedium } from "@/contexts/StudentPrefsContext";
import { recordSignup } from "@/ads/grace-period";

// ── types ─────────────────────────────────────────────────────────────────────

interface ProfileData {
  name: string;
  phone: string;                                    // 10 digits, formatted to +91 on submit
  classLevel: "Class IX" | "Class X";
  medium: "Assamese" | "English";
  board: "SEBA" | "CBSE";
}

type Step =
  // Top-level choice
  | { tag: "choose" }
  | { tag: "admin-form" }
  // Student: pick login or register
  | { tag: "student-intent" }
  // Login flow (existing students)
  | { tag: "login-method" }
  | { tag: "login-phone" }
  | { tag: "login-otp"; phone: string; confirmation: ConfirmationResult }
  // Registration flow (new students) — collect form FIRST so a failed signup
  // doesn't waste an SMS verification (each SMS costs ~₹0.83 in India).
  | { tag: "register-form" }
  | { tag: "register-method"; profile: ProfileData }
  | { tag: "register-phone"; profile: ProfileData }
  | { tag: "register-otp"; phone: string; confirmation: ConfirmationResult; profile: ProfileData };

// ── helpers ───────────────────────────────────────────────────────────────────

function formatIndianPhone(digits: string) {
  return `+91${digits.replace(/\D/g, "").slice(0, 10)}`;
}

// ── sub-components ────────────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-8 transition-colors"
    >
      <span className="text-lg">←</span> Back
    </button>
  );
}

function Logo() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-2xl anim-pulse-glow"
          style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
        >
          TC
        </div>
        <h1 className="font-black text-3xl text-white tracking-tight">TRUE CONCEPT</h1>
        <p className="font-semibold italic text-sm" style={{
          background: "linear-gradient(135deg, #fbbf24, #fcd34d)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Concepts. Clarity. Confidence.
        </p>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl p-8 shadow-2xl backdrop-blur-sm ${className}`}
      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      {children}
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  prefix,
  autoFocus,
  maxLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  autoFocus?: boolean;
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white/80 text-sm font-semibold">{label}</label>
      <div className="flex rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
        {prefix && (
          <span className="flex items-center px-4 text-white/60 font-semibold text-sm border-r" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-white/30 font-semibold text-base outline-none"
        />
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  loading,
  disabled,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 rounded-2xl font-black text-white text-base transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      style={style ?? { background: "linear-gradient(135deg, #da6b45, #b85535)" }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="text-sm font-semibold text-red-300 bg-red-500/10 rounded-2xl px-4 py-3 text-center">
      {msg}
    </div>
  );
}

// ── screen: choose ─────────────────────────────────────────────────────────────

function ChooseScreen({ onStudent, onAdmin }: { onStudent: () => void; onAdmin: () => void }) {
  return (
    <>
      <Logo />
      <p className="text-white/70 font-semibold text-center mb-6 text-sm tracking-wide">Who are you logging in as?</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onStudent}
          className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all hover:scale-[1.04] active:scale-100 shadow-2xl"
          style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
            style={{ background: "radial-gradient(circle, white, transparent)" }} />
          <div className="text-5xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform origin-bottom-left">🎓</div>
          <h2 className="font-black text-xl text-white mb-1 tracking-tight">Student</h2>
          <p className="text-orange-100/90 text-xs font-semibold">Login with mobile OTP</p>
        </button>

        <button
          onClick={onAdmin}
          className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all hover:scale-[1.04] active:scale-100 shadow-2xl"
          style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
            style={{ background: "radial-gradient(circle, white, transparent)" }} />
          <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform origin-bottom-left">🔑</div>
          <h2 className="font-black text-xl text-amber-950 mb-1 tracking-tight">Admin</h2>
          <p className="text-amber-900/80 text-xs font-semibold">Login with password</p>
        </button>
      </div>
    </>
  );
}

// ── screen: student intent (Login or Register) ────────────────────────────────

function IntentScreen({
  onBack,
  onLogin,
  onRegister,
}: {
  onBack: () => void;
  onLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <>
      <BackButton onClick={onBack} />
      <Logo />
      <Card>
        <h2 className="text-white font-black text-xl mb-1">Welcome, student!</h2>
        <p className="text-white/50 text-sm font-semibold mb-6">First time here? Register your account. Already registered? Log in.</p>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={onRegister}
            data-testid="button-register"
            className="w-full py-4 rounded-2xl font-black text-white text-base shadow-lg hover:scale-[1.02] active:scale-100 transition-transform"
            style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
          >
            🆕 Create New Account
          </button>
          <button
            onClick={onLogin}
            data-testid="button-login-existing"
            className="w-full py-4 rounded-2xl font-black text-base shadow-lg hover:scale-[1.02] active:scale-100 transition-transform"
            style={{ background: "rgba(255,255,255,0.10)", color: "white", border: "1px solid rgba(255,255,255,0.20)" }}
          >
            🔓 Log In to Existing Account
          </button>
        </div>
      </Card>
    </>
  );
}

// ── screen: registration form (collected BEFORE OTP/Google to save SMS costs) ─

function RegisterFormScreen({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: (profile: ProfileData) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classLevel, setClassLevel] = useState<"Class IX" | "Class X">("Class IX");
  const [medium, setMedium] = useState<"Assamese" | "English">("Assamese");
  const [board, setBoard] = useState<"SEBA" | "CBSE">("SEBA");
  const [error, setError] = useState("");

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length === 10;

  const handleContinue = () => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!phoneValid) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    onNext({
      name: name.trim(),
      phone: `+91${phoneDigits}`,
      classLevel,
      medium,
      board,
    });
  };

  function SegmentedPicker<T extends string>({
    label, options, value, onChange,
  }: {
    label: string; options: readonly T[]; value: T; onChange: (v: T) => void;
  }) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-white/80 text-sm font-semibold">{label}</label>
        <div className="flex rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className="flex-1 py-3 text-sm font-black transition-all"
              style={
                value === opt
                  ? { background: "linear-gradient(135deg, #da6b45, #b85535)", color: "white" }
                  : { color: "rgba(255,255,255,0.45)" }
              }
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <BackButton onClick={onBack} />
      <Logo />
      <Card>
        <h2 className="text-white font-black text-xl mb-1">Create your account</h2>
        <p className="text-white/50 text-sm font-semibold mb-6">Tell us about yourself — we'll verify your phone or Google after.</p>
        <div className="flex flex-col gap-4">
          <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" autoFocus />
          <InputField
            label="Mobile Number"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="98XXXXXXXX"
            prefix="+91"
            maxLength={10}
          />
          <SegmentedPicker
            label="Class"
            options={["Class IX", "Class X"] as const}
            value={classLevel}
            onChange={(v) => setClassLevel(v as "Class IX" | "Class X")}
          />
          <SegmentedPicker
            label="Medium"
            options={["Assamese", "English"] as const}
            value={medium}
            onChange={(v) => setMedium(v as "Assamese" | "English")}
          />
          <SegmentedPicker
            label="Board"
            options={["SEBA", "CBSE"] as const}
            value={board}
            onChange={(v) => setBoard(v as "SEBA" | "CBSE")}
          />
          <PrimaryButton onClick={handleContinue} disabled={!name.trim() || !phoneValid}>
            Continue → Choose Verification
          </PrimaryButton>
          <ErrorBox msg={error} />
        </div>
      </Card>
    </>
  );
}

// ── screen: choose verification method during REGISTER ────────────────────────

function RegisterMethodScreen({
  profile,
  onBack,
  onPhone,
  onGoogleSuccess,
}: {
  profile: ProfileData;
  onBack: () => void;
  onPhone: () => void;
  onGoogleSuccess: (idToken: string, user: any, token: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Server creates the account using the profile + verified Google ID token
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, intent: "register", ...profile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Server error");
      onGoogleSuccess(idToken, data.user, data.token);
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/popup-closed-by-user") setError("Sign-in cancelled.");
      else if (code === "auth/popup-blocked") setError("Pop-up blocked. Please allow pop-ups and try again.");
      else setError(err?.message ?? "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton onClick={onBack} />
      <Logo />
      <Card>
        <h2 className="text-white font-black text-xl mb-1">Verify your account</h2>
        <p className="text-white/50 text-sm font-semibold mb-6">Hi <span className="text-white">{profile.name}</span>! Choose how to verify.</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogle}
            disabled={loading}
            data-testid="button-register-google"
            className="w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 shadow-lg"
            style={{ background: "white", color: "#3c4043", border: "1px solid rgba(0,0,0,0.1)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in…" : "Sign up with Google"}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          <button
            onClick={onPhone}
            disabled={loading}
            data-testid="button-register-phone"
            className="w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 shadow-lg text-white"
            style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
          >
            📱 Verify with Phone OTP
          </button>

          <ErrorBox msg={error} />
        </div>
      </Card>
    </>
  );
}

// ── screen: choose login method (Google vs Phone) ─────────────────────────────

function MethodScreen({
  onBack,
  onPhone,
  onGoogleLoginSuccess,
  onNotRegistered,
}: {
  onBack: () => void;
  onPhone: () => void;
  onGoogleLoginSuccess: (user: any, token: string, classLevel?: string | null, medium?: string | null) => void;
  onNotRegistered: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // intent:"login" — server will reject if not registered
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, intent: "login" }),
      });
      const data = await res.json();

      if (res.status === 404 && data.error === "not_registered") {
        setError("No account found for this Google account. Please register first.");
        setTimeout(onNotRegistered, 1500);
        return;
      }
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Server error");

      onGoogleLoginSuccess(data.user, data.token, data.classLevel, data.medium);
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/popup-closed-by-user") setError("Sign-in cancelled.");
      else if (code === "auth/popup-blocked") setError("Pop-up blocked. Please allow pop-ups and try again.");
      else setError(err?.message ?? "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton onClick={onBack} />
      <Logo />
      <Card>
        <h2 className="text-white font-black text-xl mb-1">Sign in to learn</h2>
        <p className="text-white/50 text-sm font-semibold mb-6">Choose how you want to continue</p>

        <div className="flex flex-col gap-3">
          {/* Google Sign-In */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            data-testid="button-google-signin"
            className="w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 shadow-lg"
            style={{ background: "white", color: "#3c4043", border: "1px solid rgba(0,0,0,0.1)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Phone OTP fallback */}
          <button
            onClick={onPhone}
            disabled={loading}
            data-testid="button-phone-signin"
            className="w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 shadow-lg text-white"
            style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}
          >
            📱 Login with Phone OTP
          </button>

          <ErrorBox msg={error} />
        </div>
      </Card>
    </>
  );
}

// ── screen: phone entry ────────────────────────────────────────────────────────

function PhoneScreen({
  onBack,
  onNext,
  prefillPhone,
}: {
  onBack: () => void;
  onNext: (phone: string, confirmation: ConfirmationResult) => void;
  prefillPhone?: string;        // strip "+91" prefix before passing
}) {
  // If we got a prefill from the register form, use those 10 digits.
  const [phone, setPhone] = useState(() =>
    (prefillPhone ?? "").replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  // Initialise the invisible reCAPTCHA verifier once the container div is in the DOM.
  // Doing this at mount (not lazily on click) guarantees the element exists.
  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    recaptchaRef.current = verifier;
    return () => {
      // Clear BEFORE the container is removed from the DOM to avoid the
      // "Cannot read properties of null (reading 'style')" crash in recaptcha__en.js.
      try { verifier.clear(); } catch {}
      recaptchaRef.current = null;
    };
  }, []);

  const handleSend = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      }
      const formattedPhone = formatIndianPhone(digits);
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaRef.current);
      // Clear BEFORE calling onNext so reCAPTCHA doesn't try to update a
      // container that React is about to unmount.
      try { recaptchaRef.current.clear(); } catch {}
      recaptchaRef.current = null;
      onNext(formattedPhone, confirmation);
    } catch (err: any) {
      try { recaptchaRef.current?.clear(); } catch {}
      recaptchaRef.current = null;
      const code = err?.code ?? "";
      if (code === "auth/invalid-phone-number") setError("Invalid phone number. Use a valid Indian number.");
      else if (code === "auth/too-many-requests") setError("Too many attempts. Please try again later.");
      else if (code === "auth/quota-exceeded") setError("SMS quota exceeded. Please contact the administrator.");
      else setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton onClick={onBack} />
      <Logo />
      <Card>
        <h2 className="text-white font-black text-xl mb-1">Enter Mobile Number</h2>
        <p className="text-white/50 text-sm font-semibold mb-6">We'll send a one-time password via SMS</p>

        <div className="flex flex-col gap-4">
          <InputField
            label="Mobile Number"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="98XXXXXXXX"
            prefix="+91"
            autoFocus
            maxLength={10}
          />

          <div id="recaptcha-container" />

          <PrimaryButton onClick={handleSend} loading={loading} disabled={phone.replace(/\D/g, "").length !== 10}>
            Send OTP →
          </PrimaryButton>

          <ErrorBox msg={error} />
        </div>
      </Card>
    </>
  );
}

// ── screen: OTP verification ───────────────────────────────────────────────────

function OtpScreen({
  phone,
  confirmation,
  onBack,
  onVerified,
}: {
  phone: string;
  confirmation: ConfirmationResult;
  onBack: () => void;
  onVerified: (uid: string, idToken: string) => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const credential = await confirmation.confirm(otp);
      const idToken = await credential.user.getIdToken();
      onVerified(credential.user.uid, idToken);
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/invalid-verification-code") setError("Incorrect OTP. Please try again.");
      else if (code === "auth/code-expired") setError("OTP expired. Go back and resend.");
      else setError(err?.message ?? "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton onClick={onBack} />
      <Logo />
      <Card>
        <h2 className="text-white font-black text-xl mb-1">Enter OTP</h2>
        <p className="text-white/50 text-sm font-semibold mb-6">
          Sent to <span className="text-white/80">{phone}</span>
        </p>

        <div className="flex flex-col gap-4">
          <InputField
            label="One-Time Password"
            type="number"
            value={otp}
            onChange={(v) => setOtp(v.slice(0, 6))}
            placeholder="• • • • • •"
            autoFocus
            maxLength={6}
          />

          <PrimaryButton onClick={handleVerify} loading={loading} disabled={otp.length !== 6}>
            Verify & Continue →
          </PrimaryButton>

          <ErrorBox msg={error} />
        </div>
      </Card>
    </>
  );
}

// ── (legacy ProfileScreen removed — registration is now collected up-front
//     in RegisterFormScreen so we never spend an SMS on incomplete signups.)

// ── screen: admin login ────────────────────────────────────────────────────────

function AdminScreen({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: (user: any, token: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      onDone(data.user, data.token);
    } catch (err: any) {
      setError(err?.message ?? "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton onClick={onBack} />
      <Logo />
      <Card>
        <h2 className="text-white font-black text-xl mb-1">Admin Login</h2>
        <p className="text-white/50 text-sm font-semibold mb-6">Enter your admin credentials</p>

        <div className="flex flex-col gap-4">
          <InputField label="Username" value={username} onChange={setUsername} placeholder="admin" autoFocus />
          <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

          <PrimaryButton
            onClick={handleLogin}
            loading={loading}
            disabled={!username.trim() || !password}
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
          >
            Login →
          </PrimaryButton>

          <ErrorBox msg={error} />
        </div>
      </Card>
    </>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { setPrefs } = useStudentPrefs();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>({ tag: "choose" });

  const handleDone = (user: any, token: string, classLevel?: string | null, medium?: string | null) => {
    queryClient.clear();
    login(token, user);
    if (user.role === "student" && classLevel && medium) {
      setPrefs({ class: classLevel as StudentClass, medium: medium as StudentMedium });
    }
    // Record sign-up timestamp for the 24-hour rewarded-ads grace period.
    // recordSignup() is idempotent — only writes the key once, so calling it on
    // every login is harmless (login after that first call is a no-op). New
    // student → 24h of zero ad gates. Returning student → no effect.
    if (user.role === "student") recordSignup();
    setLocation(user.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-hero">
      {/* Background blobs — coral + honey + teal accent */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #da6b45, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }} />
      {/* Floating decorative emojis */}
      <div className="absolute top-12 right-12 text-3xl opacity-30 hidden md:block anim-float pointer-events-none">📚</div>
      <div className="absolute bottom-16 left-12 text-3xl opacity-30 hidden md:block anim-float pointer-events-none" style={{ animationDelay: "1.2s" }}>✨</div>

      <div className="w-full max-w-md relative">
        {/* Top-level: Student or Admin */}
        {step.tag === "choose" && (
          <ChooseScreen
            onStudent={() => setStep({ tag: "student-intent" })}
            onAdmin={() => setStep({ tag: "admin-form" })}
          />
        )}

        {/* Student: Login or Register */}
        {step.tag === "student-intent" && (
          <IntentScreen
            onBack={() => setStep({ tag: "choose" })}
            onLogin={() => setStep({ tag: "login-method" })}
            onRegister={() => setStep({ tag: "register-form" })}
          />
        )}

        {/* ── LOGIN flow (existing students) ──────────────────────────── */}
        {step.tag === "login-method" && (
          <MethodScreen
            onBack={() => setStep({ tag: "student-intent" })}
            onPhone={() => setStep({ tag: "login-phone" })}
            onGoogleLoginSuccess={handleDone}
            onNotRegistered={() => setStep({ tag: "register-form" })}
          />
        )}

        {step.tag === "login-phone" && (
          <PhoneScreen
            onBack={() => setStep({ tag: "login-method" })}
            onNext={(phone, confirmation) => setStep({ tag: "login-otp", phone, confirmation })}
          />
        )}

        {step.tag === "login-otp" && (
          <OtpScreen
            phone={step.phone}
            confirmation={step.confirmation}
            onBack={() => setStep({ tag: "login-phone" })}
            onVerified={(_uid, idToken) => {
              fetch("/api/auth/phone-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken, intent: "login" }),
              })
                .then((r) => r.json().then((d) => ({ ok: r.ok, status: r.status, data: d })))
                .then(({ ok, status, data }) => {
                  if (status === 404 && data.error === "not_registered") {
                    alert("No account found for this phone number. Please register first.");
                    setStep({ tag: "register-form" });
                    return;
                  }
                  if (!ok) throw new Error(data.message ?? data.error ?? "Login failed");
                  handleDone(data.user, data.token, data.classLevel, data.medium);
                })
                .catch((err) => alert(err?.message ?? "Something went wrong"));
            }}
          />
        )}

        {/* ── REGISTER flow (new students) — form FIRST, then verify ── */}
        {step.tag === "register-form" && (
          <RegisterFormScreen
            onBack={() => setStep({ tag: "student-intent" })}
            onNext={(profile) => setStep({ tag: "register-method", profile })}
          />
        )}

        {step.tag === "register-method" && (
          <RegisterMethodScreen
            profile={step.profile}
            onBack={() => setStep({ tag: "register-form" })}
            onPhone={() => setStep({ tag: "register-phone", profile: step.profile })}
            onGoogleSuccess={(_idToken, user, token) => handleDone(user, token, step.profile.classLevel, step.profile.medium)}
          />
        )}

        {step.tag === "register-phone" && (
          <PhoneScreen
            onBack={() => setStep({ tag: "register-method", profile: step.profile })}
            onNext={(phone, confirmation) =>
              setStep({ tag: "register-otp", phone, confirmation, profile: step.profile })
            }
            prefillPhone={step.profile.phone}
          />
        )}

        {step.tag === "register-otp" && (
          <OtpScreen
            phone={step.phone}
            confirmation={step.confirmation}
            onBack={() => setStep({ tag: "register-phone", profile: step.profile })}
            onVerified={(_uid, idToken) => {
              fetch("/api/auth/phone-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  idToken,
                  intent: "register",
                  ...(step as { profile: ProfileData }).profile,
                }),
              })
                .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
                .then(({ ok, data }) => {
                  if (!ok) throw new Error(data.message ?? data.error ?? "Registration failed");
                  handleDone(data.user, data.token, data.classLevel, data.medium);
                })
                .catch((err) => alert(err?.message ?? "Something went wrong"));
            }}
          />
        )}

        {/* Admin */}
        {step.tag === "admin-form" && (
          <AdminScreen
            onBack={() => setStep({ tag: "choose" })}
            onDone={handleDone}
          />
        )}
      </div>
    </div>
  );
}
