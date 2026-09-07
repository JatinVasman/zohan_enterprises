import { Resend } from "resend"

const COMPANY_EMAIL = "info@zohanenterprise.com"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" })
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    console.error("[enquiry] Missing RESEND_API_KEY or RESEND_FROM_EMAIL env vars")
    return res.status(500).json({ ok: false, error: "Server configuration error." })
  }

  const {
    name,
    phone,
    email,
    company,
    message,
    productName,
    productPrice,
    productCategory,
    pageUrl,
  } = req.body || {}

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: "Name and phone are required." })
  }

  const subject =
    productName && productName !== "General Enquiry"
      ? `Product Enquiry: ${productName} — ${name}`
      : `General Enquiry from ${name}`

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: `Zohan Enterprises <${fromEmail}>`,
    to: [COMPANY_EMAIL],
    reply_to: email || undefined,
    subject,
    html: buildHtml({ name, phone, email, company, message, productName, productPrice, productCategory, pageUrl }),
  })

  if (error) {
    console.error("[enquiry] Resend error:", error.message)
    return res.status(400).json({ ok: false, error: "Failed to send. Please try again or call us directly." })
  }

  return res.status(200).json({ ok: true })
}

function row(label, value) {
  if (!value) return ""
  return `
    <tr>
      <td style="padding:8px 12px;font-size:12px;font-weight:600;color:#64748b;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 12px;font-size:13px;color:#0f172a;vertical-align:top;">${value}</td>
    </tr>`
}

function buildHtml({ name, phone, email, company, message, productName, productPrice, productCategory, pageUrl }) {
  const isProductEnquiry = productName && productName !== "General Enquiry"

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:24px 32px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.15em;color:#10b981;text-transform:uppercase;">New Enquiry</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#ffffff;">Zohan Enterprises</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">

            ${isProductEnquiry ? `
            <!-- Product block -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:0.12em;color:#0d5c3a;text-transform:uppercase;">${productCategory || "Product"}</p>
                  <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a;">${productName}</p>
                  ${productPrice ? `<p style="margin:6px 0 0;font-size:13px;color:#475569;">Indicative price: <strong>${productPrice}</strong></p>` : ""}
                </td>
              </tr>
            </table>` : ""}

            <!-- Contact details -->
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;">Contact Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;margin-bottom:24px;">
              <tbody>
                ${row("Name", name)}
                ${row("Phone", `<a href="tel:${phone}" style="color:#0d5c3a;text-decoration:none;">+91 ${phone}</a>`)}
                ${email ? row("Email", `<a href="mailto:${email}" style="color:#0d5c3a;text-decoration:none;">${email}</a>`) : ""}
                ${row("Company", company)}
              </tbody>
            </table>

            ${message ? `
            <!-- Message -->
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;">Message / Requirement</p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:16px 20px;font-size:13px;color:#334155;line-height:1.65;margin-bottom:24px;">${message.replace(/\n/g, "<br>")}</div>` : ""}

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                ${phone ? `<td style="padding-right:10px;"><a href="tel:${phone}" style="display:inline-block;background:#0d5c3a;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 20px;border-radius:4px;">Call Now</a></td>` : ""}
                ${email ? `<td><a href="mailto:${email}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 20px;border-radius:4px;">Reply by Email</a></td>` : ""}
              </tr>
            </table>

            ${pageUrl ? `<p style="margin:20px 0 0;font-size:11px;color:#94a3b8;">Source page: <a href="${pageUrl}" style="color:#94a3b8;">${pageUrl}</a></p>` : ""}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#94a3b8;">Zohan Enterprises · A-279, Sector 69, Noida, UP 201301 · info@zohanenterprise.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
