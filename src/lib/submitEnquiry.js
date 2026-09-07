const STORAGE_KEY = "ze_enquiries"
const W3F_ENDPOINT = "https://api.web3forms.com/submit"

/**
 * Submit an enquiry.
 *
 * Always writes to localStorage first as a backup.
 * Then attempts Web3Forms submission if the access key is configured.
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

  // ── 2. Web3Forms submission ───────────────────────────────────────────────
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  if (!accessKey) {
    // Key not configured — treat as success for development / demo
    return { ok: true, fallback: true }
  }

  try {
    const res = await fetch(W3F_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        // Visible fields
        name:    data.name    || "",
        phone:   data.phone   || "",
        email:   data.email   || "",
        company: data.company || "",
        message: data.message || "",
        // Hidden / contextual fields
        productName:     data.productName     || "",
        productPrice:    data.productPrice    || "",
        productCategory: data.productCategory || "",
        productSlug:     data.productSlug     || "",
        pageUrl:         data.pageUrl         || window.location.href,
        // Web3Forms config
        subject:         buildSubject(data),
        from_name:       "Zohan Enterprises Website",
      }),
    })

    const json = await res.json()
    if (json.success) return { ok: true }

    return { ok: false, error: json.message || "Submission failed. Please try again or call us directly." }
  } catch (err) {
    return {
      ok: false,
      error: "Network error. Your enquiry has been saved locally — please call us or try again shortly.",
    }
  }
}

function buildSubject(data) {
  if (data.productName) return `Product Enquiry: ${data.productName} — ${data.name || "Website Visitor"}`
  return `General Enquiry from ${data.name || "Website Visitor"}`
}
