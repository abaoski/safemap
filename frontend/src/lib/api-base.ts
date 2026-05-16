export function normalizeApiBaseUrl(value: string | undefined, fallback = "/api"): string {
  const raw = (value ?? "").trim()
  if (!raw) return fallback.replace(/\/$/, "")

  if (raw.startsWith("/")) {
    return raw.replace(/\/$/, "")
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw.replace(/\/$/, "")
  }

  // If the user entered only host/domain, default to HTTPS for production safety.
  return `https://${raw}`.replace(/\/$/, "")
}
