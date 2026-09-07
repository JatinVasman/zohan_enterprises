const STORAGE_KEY = "ze_enquiries"

/**
 * Submit an enquiry.
 *
 * Always writes to localStorage first as a backup.
 * Then POSTs to /api/enquiry (Vercel serverless → Resend).
 *
 * @param {Object} data  — all visible form fields + hidden product/page fields
 * @returns {{ ok: boolean, error?: string }}
 */
export async function submitEnquiry(data) {
  // ── 1. localStorage backup (always, before any network call) ──────────────
  const record = { ...data, submittedAt: new Date().toISOString() }
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    existing.unshift(record)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch {
    // localStorage unavailable — continue anyway
  }

  // ── 2. Email via /api/enquiry serverless function ─────────────────────────
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name:            data.name            || "",
        phone:           data.phone           || "",
        email:           data.email           || "",
        company:         data.company         || "",
        message:         data.message         || "",
        productName:     data.productName     || "",
        productPrice:    data.productPrice    || "",
        productCategory: data.productCategory || "",
        productSlug:     data.productSlug     || "",
        pageUrl:         data.pageUrl         || window.location.href,
      }),
    })

    const json = await res.json()
    if (json.ok) return { ok: true }

    return { ok: false, error: json.error || "Submission failed. Please try again or call us directly." }
  } catch {
    return {
      ok: false,
      error: "Network error. Your enquiry has been saved locally — please call us or try again shortly.",
    }
  }
}
