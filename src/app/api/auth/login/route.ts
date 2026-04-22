import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminUser, findUserByEmail, createUser } from "@/lib/store";
import { setSessionCookie } from "@/lib/session";
import { verifyPassword } from "@/lib/security";
import { createOtp, verifyOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";
import { sendSmsOtp, verifySmsOtp, normalizePhone, isValidIndianPhone } from "@/lib/twofactor";
import { enforceRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

/* ── Password login schema ── */
const passwordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  nextPath: z.string().optional(),
  step: z.undefined().or(z.literal("password")),
});

/* ── Email OTP schemas ── */
const sendOtpSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  step: z.literal("send_otp"),
});

const verifyOtpSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  otp: z.string().length(6, "OTP must be 6 digits."),
  step: z.literal("verify_otp"),
  nextPath: z.string().optional(),
});

/* ── SMS OTP schemas (2Factor.in) ── */
const sendSmsOtpSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number."),
  email: z.string().email("Enter a valid email address."),
  step: z.literal("send_sms_otp"),
});

const verifySmsOtpSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number."),
  email: z.string().email("Enter a valid email address."),
  otp: z.string().length(6, "OTP must be 6 digits."),
  sessionId: z.string().min(1, "Session expired. Please resend OTP."),
  step: z.literal("verify_sms_otp"),
  nextPath: z.string().optional(),
});

function resolveRedirect(input: string | undefined, role: "admin" | "user") {
  if (!input) return role === "admin" ? "/admin/dashboard" : "/dashboard";
  if (!input.startsWith("/") || input.startsWith("//")) {
    return role === "admin" ? "/admin/dashboard" : "/dashboard";
  }
  if (role !== "admin" && input.startsWith("/admin")) {
    return "/dashboard";
  }
  return input;
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getRequestIdentifier(request.headers.get("x-forwarded-for"));
    const body = await request.json();

    /* ═══════════════════════════════════════
       SMS OTP Step 1: Send SMS OTP via 2Factor.in
       ═══════════════════════════════════════ */
    if (body.step === "send_sms_otp") {
      const parsed = sendSmsOtpSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.issues[0]?.message ?? "Enter a valid phone number." },
          { status: 400 },
        );
      }

      const limit = await enforceRateLimit({
        bucket: "auth_sms_otp_send",
        identifier,
        limit: 5,
        windowMs: 60_000,
      });
      if (!limit.allowed) {
        return NextResponse.json(
          { message: "Too many OTP requests. Please wait a minute." },
          { status: 429 },
        );
      }

      const phone = parsed.data.phone;
      if (!isValidIndianPhone(phone)) {
        return NextResponse.json(
          { message: "Please enter a valid 10-digit Indian mobile number." },
          { status: 400 },
        );
      }

      const result = await sendSmsOtp(phone);
      if (!result.success) {
        return NextResponse.json({ message: result.message }, { status: 500 });
      }

      return NextResponse.json({
        message: "OTP sent to your phone number. Check your SMS.",
        step: "sms_otp_sent",
        sessionId: result.sessionId,
      });
    }

    /* ═══════════════════════════════════════
       SMS OTP Step 2: Verify SMS OTP via 2Factor.in
       ═══════════════════════════════════════ */
    if (body.step === "verify_sms_otp") {
      const parsed = verifySmsOtpSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.issues[0]?.message ?? "Enter a valid OTP." },
          { status: 400 },
        );
      }

      const limit = await enforceRateLimit({
        bucket: "auth_sms_otp_verify",
        identifier,
        limit: 10,
        windowMs: 60_000,
      });
      if (!limit.allowed) {
        return NextResponse.json(
          { message: "Too many verification attempts. Please wait." },
          { status: 429 },
        );
      }

      const result = await verifySmsOtp(parsed.data.sessionId, parsed.data.otp);
      if (!result.success) {
        return NextResponse.json({ message: result.message }, { status: 401 });
      }

      // OTP verified — find or create user by email
      const email = parsed.data.email.trim().toLowerCase();
      await ensureAdminUser();
      let user = await findUserByEmail(email);
      if (!user) {
        user = await createUser({
          name: email.split("@")[0] || "User",
          email,
          password: "",
          role: "user",
        });
      }

      await setSessionCookie({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const redirect = resolveRedirect(parsed.data.nextPath, user.role);
      return NextResponse.json({
        message: "Logged in successfully.",
        redirect,
        step: "verified",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    /* ═══════════════════════════════════════
       Email OTP Step 1: Send OTP
       ═══════════════════════════════════════ */
    if (body.step === "send_otp") {
      const parsed = sendOtpSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.issues[0]?.message ?? "Enter a valid email." },
          { status: 400 },
        );
      }

      const limit = await enforceRateLimit({
        bucket: "auth_otp_send",
        identifier,
        limit: 5,
        windowMs: 60_000,
      });
      if (!limit.allowed) {
        return NextResponse.json(
          { message: "Too many OTP requests. Please wait a minute." },
          { status: 429 },
        );
      }

      const email = parsed.data.email.trim().toLowerCase();
      const code = await createOtp(email);
      await sendOtpEmail(email, code);

      return NextResponse.json({
        message: "OTP sent to your email. Check your inbox.",
        step: "otp_sent",
      });
    }

    /* ═══════════════════════════════════════
       Email OTP Step 2: Verify OTP
       ═══════════════════════════════════════ */
    if (body.step === "verify_otp") {
      const parsed = verifyOtpSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.issues[0]?.message ?? "Enter a valid OTP." },
          { status: 400 },
        );
      }

      const limit = await enforceRateLimit({
        bucket: "auth_otp_verify",
        identifier,
        limit: 10,
        windowMs: 60_000,
      });
      if (!limit.allowed) {
        return NextResponse.json(
          { message: "Too many verification attempts. Please wait." },
          { status: 429 },
        );
      }

      const email = parsed.data.email.trim().toLowerCase();
      const valid = await verifyOtp(email, parsed.data.otp);
      if (!valid) {
        return NextResponse.json(
          { message: "Invalid or expired OTP. Please try again." },
          { status: 401 },
        );
      }

      await ensureAdminUser();
      let user = await findUserByEmail(email);
      if (!user) {
        user = await createUser({
          name: email.split("@")[0] || "User",
          email,
          password: "",
          role: "user",
        });
      }

      await setSessionCookie({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const redirect = resolveRedirect(parsed.data.nextPath, user.role);
      return NextResponse.json({
        message: "Logged in successfully.",
        redirect,
        step: "verified",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    /* ═══════════════════════════════════════
       Password Login (default)
       ═══════════════════════════════════════ */
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Please provide valid login details." },
        { status: 400 },
      );
    }

    const limit = await enforceRateLimit({
      bucket: "auth_login",
      identifier,
      limit: 10,
      windowMs: 60_000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Too many login attempts. Please wait a minute." },
        { status: 429 },
      );
    }

    await ensureAdminUser();
    const user = await findUserByEmail(parsed.data.email.trim().toLowerCase());
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const redirect = resolveRedirect(parsed.data.nextPath, user.role);
    return NextResponse.json({
      message: "Logged in successfully.",
      redirect,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to login right now. Please try again." },
      { status: 500 },
    );
  }
}
