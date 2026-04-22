"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useRef, useEffect } from "react";
import { Eye, EyeOff, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AuthMethod = "password" | "otp" | "sms_otp";

export function AuthForm({
  mode,
  nextPath,
}: {
  mode: "login" | "signup";
  nextPath?: string;
}) {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("sms_otp");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpStep, setOtpStep] = useState<"input" | "code">("input");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20";

  useEffect(() => {
    if (otpStep === "code") inputRefs.current[0]?.focus();
  }, [otpStep]);

  /* ── OTP Helpers ── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  /* ── Password Login / Signup ── */
  const handlePasswordSubmit = () => {
    setError(null);
    startTransition(async () => {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup"
            ? { name: name.trim(), email: email.trim(), password, nextPath }
            : { email: email.trim(), password, nextPath },
        ),
      });
      const result = (await response.json()) as { redirect?: string; message?: string };
      if (!response.ok) {
        setError(result.message ?? "Something went wrong.");
        return;
      }
      router.push(result.redirect ?? "/dashboard");
      router.refresh();
    });
  };

  /* ── Email OTP Send ── */
  const sendEmailOtp = () => {
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), step: "send_otp" }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(result.message ?? "Failed to send OTP.");
        return;
      }
      setInfo(result.message ?? "OTP sent!");
      setOtpStep("code");
      setOtp(["", "", "", "", "", ""]);
    });
  };

  /* ── Email OTP Verify ── */
  const verifyEmailOtp = () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the full 6-digit code."); return; }
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: code, step: "verify_otp", nextPath }),
      });
      const result = (await response.json()) as { message?: string; redirect?: string };
      if (!response.ok) {
        setError(result.message ?? "Invalid OTP.");
        return;
      }
      router.push(result.redirect ?? "/dashboard");
      router.refresh();
    });
  };

  /* ── SMS OTP Send (2Factor.in) ── */
  const sendSmsOtp = () => {
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), email: email.trim(), step: "send_sms_otp" }),
      });
      const result = (await response.json()) as { message?: string; sessionId?: string; step?: string };
      if (!response.ok) {
        setError(result.message ?? "Failed to send OTP.");
        return;
      }
      setInfo(result.message ?? "OTP sent to your phone!");
      setSessionId(result.sessionId ?? null);
      setOtpStep("code");
      setOtp(["", "", "", "", "", ""]);
    });
  };

  /* ── SMS OTP Verify (2Factor.in) ── */
  const verifySmsOtpCode = () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the full 6-digit code."); return; }
    if (!sessionId) { setError("Session expired. Please resend OTP."); return; }
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          email: email.trim(),
          otp: code,
          sessionId,
          step: "verify_sms_otp",
          nextPath,
        }),
      });
      const result = (await response.json()) as { message?: string; redirect?: string };
      if (!response.ok) {
        setError(result.message ?? "Invalid OTP.");
        return;
      }
      router.push(result.redirect ?? "/dashboard");
      router.refresh();
    });
  };

  const methodTabClass = (method: AuthMethod) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
      authMethod === method
        ? "bg-white text-[var(--color-navy)] shadow-sm"
        : "text-[var(--color-muted)] hover:text-[var(--color-navy)]"
    }`;

  return (
    <div className="space-y-4">
      {/* Method Toggle (only on login) */}
      {mode === "login" && (
        <div className="flex rounded-xl bg-[var(--color-surface)] p-1">
          <button
            type="button"
            onClick={() => { setAuthMethod("sms_otp"); setError(null); setInfo(null); setOtpStep("input"); }}
            className={methodTabClass("sms_otp")}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Phone size={14} /> Phone OTP
            </span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod("otp"); setError(null); setInfo(null); setOtpStep("input"); }}
            className={methodTabClass("otp")}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Mail size={14} /> Email OTP
            </span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod("password"); setError(null); setInfo(null); }}
            className={methodTabClass("password")}
          >
            Password
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ═══ PASSWORD MODE ═══ */}
        {(authMethod === "password" || mode === "signup") && (
          <motion.form
            key="password-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}
          >
            {mode === "signup" && (
              <label className="block text-sm font-medium text-[var(--color-navy)]">
                Full Name
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} placeholder="Your full name" />
              </label>
            )}

            <label className="block text-sm font-medium text-[var(--color-navy)]">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
            </label>

            <label className="block text-sm font-medium text-[var(--color-navy)]">
              Password
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={`${inputClass} pr-10`}
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition hover:text-[var(--color-navy)]"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-[var(--color-red)]"
                >{error}</motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isPending}
              className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-navy)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)] disabled:opacity-70"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending
                ? mode === "signup" ? "Creating Account..." : "Signing In..."
                : mode === "signup" ? "Create Account" : "Log In"
              }
            </button>

            <p className="text-center text-sm text-[var(--color-muted)]">
              {mode === "signup" ? (
                <>Already have an account?{" "}<a href="/login" className="font-semibold text-[var(--color-gold)] hover:underline">Log in</a></>
              ) : (
                <>No account yet?{" "}<a href="/signup" className="font-semibold text-[var(--color-gold)] hover:underline">Sign up free</a></>
              )}
            </p>
          </motion.form>
        )}

        {/* ═══ SMS OTP MODE (2Factor.in) ═══ */}
        {authMethod === "sms_otp" && mode === "login" && otpStep === "input" && (
          <motion.form
            key="sms-otp-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); sendSmsOtp(); }}
          >
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700">Enter your phone number and email to receive a 6-digit OTP via SMS.</p>
            </div>

            <label className="block text-sm font-medium text-[var(--color-navy)]">
              Phone Number
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)]">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  required
                  className={`${inputClass} pl-14`}
                  placeholder="9876543210"
                  autoFocus
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-[var(--color-navy)]">
              Email Address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
            </label>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-[var(--color-red)]"
                >{error}</motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isPending}
              className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-navy)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)] disabled:opacity-70"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Sending OTP..." : "Send OTP via SMS"}
            </button>

            <p className="text-center text-sm text-[var(--color-muted)]">
              No account yet?{" "}<a href="/signup" className="font-semibold text-[var(--color-gold)] hover:underline">Sign up free</a>
            </p>
          </motion.form>
        )}

        {authMethod === "sms_otp" && mode === "login" && otpStep === "code" && (
          <motion.form
            key="sms-otp-code"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); verifySmsOtpCode(); }}
          >
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-emerald-700">OTP sent to +91 {phone}</p>
                <p className="text-xs text-emerald-600">Check your SMS. Expires in 5 minutes.</p>
              </div>
            </div>

            <label className="block text-sm font-medium text-[var(--color-navy)]">Enter 6-Digit Code</label>
            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="h-12 w-12 rounded-xl border-2 border-[var(--color-border)] bg-white text-center text-lg font-semibold outline-none transition-all focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                />
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-[var(--color-red)]"
                >{error}</motion.p>
              )}
              {info && !error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-600"
                >{info}</motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isPending}
              className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-navy)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)] disabled:opacity-70"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Verifying..." : "Verify & Login"}
            </button>

            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => { setOtpStep("input"); setError(null); setInfo(null); setSessionId(null); }}
                className="text-[var(--color-muted)] hover:text-[var(--color-navy)] transition"
              >← Change details</button>
              <button type="button" disabled={isPending} onClick={sendSmsOtp}
                className="font-semibold text-[var(--color-gold)] hover:underline disabled:opacity-50"
              >Resend OTP</button>
            </div>
          </motion.form>
        )}

        {/* ═══ EMAIL OTP MODE ═══ */}
        {authMethod === "otp" && mode === "login" && otpStep === "input" && (
          <motion.form
            key="otp-email"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); sendEmailOtp(); }}
          >
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700">Enter your email to receive a 6-digit login code. No password needed.</p>
            </div>

            <label className="block text-sm font-medium text-[var(--color-navy)]">
              Email Address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" autoFocus />
            </label>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-[var(--color-red)]"
                >{error}</motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isPending}
              className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-navy)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)] disabled:opacity-70"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Sending OTP..." : "Send Login Code"}
            </button>
          </motion.form>
        )}

        {authMethod === "otp" && mode === "login" && otpStep === "code" && (
          <motion.form
            key="otp-code"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); verifyEmailOtp(); }}
          >
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-emerald-700">Code sent to {email}</p>
                <p className="text-xs text-emerald-600">Check your inbox. Expires in 5 minutes.</p>
              </div>
            </div>

            <label className="block text-sm font-medium text-[var(--color-navy)]">Enter 6-Digit Code</label>
            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="h-12 w-12 rounded-xl border-2 border-[var(--color-border)] bg-white text-center text-lg font-semibold outline-none transition-all focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                />
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-[var(--color-red)]"
                >{error}</motion.p>
              )}
              {info && !error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-600"
                >{info}</motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isPending}
              className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-navy)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)] disabled:opacity-70"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Verifying..." : "Verify & Login"}
            </button>

            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => { setOtpStep("input"); setError(null); setInfo(null); }}
                className="text-[var(--color-muted)] hover:text-[var(--color-navy)] transition"
              >← Change email</button>
              <button type="button" disabled={isPending} onClick={sendEmailOtp}
                className="font-semibold text-[var(--color-gold)] hover:underline disabled:opacity-50"
              >Resend Code</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
