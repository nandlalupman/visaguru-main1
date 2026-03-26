const DEFAULT_SITE_URL = "https://visaguru.live";

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(raw);
    return trimTrailingSlash(parsed.toString());
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function assertProductionConfig() {
  if (process.env.NODE_ENV !== "production") return;

  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.AUTH_SECRET) missing.push("AUTH_SECRET");
  if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");

  if (missing.length > 0) {
    console.warn(
      `Missing required production environment variables: ${missing.join(", ")}`,
    );
  }
}
