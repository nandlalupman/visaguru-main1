/**
 * 2Factor.in SMS OTP integration
 * API docs: https://2factor.in/
 *
 * Send OTP → returns session_id
 * Verify OTP → uses session_id + user-entered OTP
 */

const API_KEY = process.env.TWOFACTOR_API_KEY || "";
const BASE_URL = "https://2factor.in/API/V1";

export function isTwoFactorConfigured(): boolean {
  return API_KEY.length > 0;
}

/**
 * Normalize phone number to 10-digit Indian format
 * Strips +91, 91 prefix, spaces, dashes etc.
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Remove country code if present
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^[6-9]\d{9}$/.test(normalized);
}

export type TwoFactorResponse = {
  success: boolean;
  sessionId?: string;
  message: string;
};

/**
 * Send OTP to phone number via 2Factor.in
 * Returns session_id on success
 */
export async function sendSmsOtp(phone: string): Promise<TwoFactorResponse> {
  if (!isTwoFactorConfigured()) {
    console.log(`[2FACTOR] API key not configured. OTP not sent to ${phone}.`);
    return { success: false, message: "SMS service not configured." };
  }

  const normalizedPhone = normalizePhone(phone);
  if (!isValidIndianPhone(normalizedPhone)) {
    return { success: false, message: "Please enter a valid 10-digit Indian phone number." };
  }

  try {
    const url = `${BASE_URL}/${API_KEY}/SMS/${normalizedPhone}/AUTOGEN`;
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (data.Status === "Success") {
      return {
        success: true,
        sessionId: data.Details, // session_id returned by 2Factor
        message: "OTP sent to your phone number.",
      };
    }

    console.error("[2FACTOR] Send OTP failed:", data);
    return {
      success: false,
      message: data.Details || "Failed to send OTP. Please try again.",
    };
  } catch (error) {
    console.error("[2FACTOR] Send OTP error:", error);
    return { success: false, message: "SMS service temporarily unavailable." };
  }
}

/**
 * Verify OTP using 2Factor.in session_id
 */
export async function verifySmsOtp(
  sessionId: string,
  otpCode: string,
): Promise<TwoFactorResponse> {
  if (!isTwoFactorConfigured()) {
    return { success: false, message: "SMS service not configured." };
  }

  try {
    const url = `${BASE_URL}/${API_KEY}/SMS/VERIFY/${sessionId}/${otpCode}`;
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (data.Status === "Success" && data.Details === "OTP Matched") {
      return { success: true, message: "OTP verified successfully." };
    }

    return {
      success: false,
      message: data.Details === "OTP Expired"
        ? "OTP has expired. Please request a new one."
        : "Invalid OTP. Please check and try again.",
    };
  } catch (error) {
    console.error("[2FACTOR] Verify OTP error:", error);
    return { success: false, message: "Verification service temporarily unavailable." };
  }
}
