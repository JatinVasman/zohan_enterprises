import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { User, Phone, Mail, Building2, MessageSquare, Send, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"
import { getProductBySlug } from "../data/products"
import { submitEnquiry } from "../lib/submitEnquiry"
import { markUserEngaged } from "../components/QuoteReminderPopup"
import { company } from "../data/content"
import { setMetaTag, setCanonical, SITE_URL } from "../lib/seo"
import Breadcrumb from "../components/Breadcrumb"

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#0F172A] dark:text-slate-200 uppercase">
        {Icon && <Icon size={12} className="text-slate-400" />}
        {label}
      </span>
      {children}
      {error && <span className="text-xs font-medium text-red-600 dark:text-red-400">{error}</span>}
    </label>
  )
}

function inputCls(error) {
  return `w-full rounded-xl border ${
    error
      ? "border-red-400 bg-red-50 dark:bg-red-950/30 focus:ring-2 focus:ring-red-300/40"
      : "border-slate-200 bg-[#F8FAFC] focus:border-[#0D5C3A] focus:bg-white focus:ring-2 focus:ring-[#0D5C3A]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-800"
  } px-4 py-3 text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-200`
}

// ── Main Enquiry Page ─────────────────────────────────────────────────────────
export default function EnquiryPage() {
  const { productSlug } = useParams()
  const navigate = useNavigate()
  const firstInputRef = useRef(null)

  // Look up product (null for general enquiry)
  const product = productSlug ? getProductBySlug(productSlug) : null

  const [fields, setFields] = useState({ name: "", phone: "", email: "", company: "", message: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    markUserEngaged()
    setTimeout(() => firstInputRef.current?.focus(), 80)
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [productSlug])

  // SEO
  useEffect(() => {
    const prevTitle = document.title
    const title = product
      ? `Get Latest Price — ${product.name} | Zohan Enterprises`
      : "Request a Quote | Zohan Enterprises"
    const desc = product
      ? `Request the latest price and availability for ${product.name} from Zohan Enterprises, Noida. Fast response within 2–4 hours.`
      : "Contact Zohan Enterprises for wire processing machinery quotes. Our technical team will recommend the right machine for your needs."
    document.title = title
    setCanonical(product ? `${SITE_URL}/enquiry/${product.slug}` : `${SITE_URL}/enquiry`)
    setMetaTag("description", desc)
    setMetaTag("robots", "noindex, nofollow") // enquiry pages need not be indexed
    return () => { document.title = prevTitle }
  }, [product])

  function validate() {
    const e = {}
    if (!fields.name.trim()) e.name = "Name is required"
    if (!/^\d{10}$/.test(fields.phone.trim())) e.phone = "Enter a valid 10-digit phone number"
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = "Enter a valid email address"
    return e
  }

  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    setSubmitError("")

    const enquiry = {
      ...fields,
      productName:     product?.name     || "General Enquiry",
      productSlug:     product?.slug     || "",
      productCategory: product?.category || "",
      productPrice:    product?.price    || "",
      pageUrl:         window.location.href,
    }

    const result = await submitEnquiry(enquiry)

    if (result.ok) {
      navigate("/thank-you", { state: { product, enquiry } })
    } else {
      setSubmitting(false)
      setSubmitError(result.error)
    }
  }

  const topSpecs = (product?.specifications || []).slice(0, 4)
  const breadcrumbItems = product
    ? [
        { label: "Home", to: "/" },
        { label: "Products", to: "/products" },
        { label: product.name, to: `/product/${product.slug}` },
        { label: "Get Latest Price" },
      ]
    : [
        { label: "Home", to: "/" },
        { label: "Request a Quote" },
      ]

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0B1120] py-8 transition-colors duration-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#0D5C3A] dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          {/* Page heading */}
          <div className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#0D5C3A] dark:text-emerald-400 uppercase mb-1">
              Request a Quote
            </p>
            <h1 className="font-display text-2xl font-extrabold text-[#0F172A] dark:text-white sm:text-3xl">
              {product ? `Get Latest Price` : "General Enquiry"}
            </h1>
            <p className="mt-1.5 text-sm text-[#64748B] dark:text-slate-400">
              Fill in the form below and our team will respond within{" "}
              <span className="font-semibold text-[#0F172A] dark:text-white">2–4 business hours</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">

            {/* ── Product info panel ── */}
            {product ? (
              <aside className="flex flex-col gap-5">
                {/* Product card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-card">
                  {/* Image */}
                  <div className="flex h-52 items-center justify-center bg-[#F8FAFC] dark:bg-slate-800/60 p-6 border-b border-slate-100 dark:border-slate-800">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                      : <div className="text-sm text-slate-400">No image</div>
                    }
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-[10px] font-bold tracking-widest text-[#0D5C3A] dark:text-emerald-400 uppercase">
                      {product.category}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-snug text-[#0F172A] dark:text-white">
                      {product.name}
                    </p>

                    <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                      <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">Indicative Price</p>
                      <p className="font-display text-xl font-bold text-[#0F172A] dark:text-white">{product.price}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">/ {product.unit} · GST extra</p>
                    </div>

                    {topSpecs.length > 0 && (
                      <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <p className="mb-3 text-[10px] font-bold tracking-wide text-slate-400 uppercase">Key Specs</p>
                        <ul className="space-y-2">
                          {topSpecs.map((s) => (
                            <li key={s.label} className="flex justify-between gap-2 text-[12px]">
                              <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
                              <span className="font-semibold text-[#0F172A] dark:text-slate-200 text-right">{s.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      to={`/product/${product.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C3A] dark:text-emerald-400 hover:underline"
                    >
                      ← View full product details
                    </Link>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-card">
                  <p className="text-[11px] font-bold tracking-wider text-[#0F172A] dark:text-white uppercase mb-3">
                    Why Zohan Enterprises?
                  </p>
                  {[
                    "Response within 2–4 hours",
                    "100% pre-tested machines",
                    "Pan-India delivery & support",
                    "Factory-direct pricing",
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 py-1.5">
                      <CheckCircle2 size={14} className="shrink-0 text-[#0D5C3A] dark:text-emerald-400" />
                      <span className="text-xs text-[#475569] dark:text-slate-300">{t}</span>
                    </div>
                  ))}
                </div>

                {/* Direct contact */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-card">
                  <p className="text-[11px] font-bold tracking-wider text-[#0F172A] dark:text-white uppercase mb-3">
                    Prefer to talk?
                  </p>
                  <a
                    href={`tel:${company.phone}`}
                    className="btn-lift flex items-center justify-center gap-2 rounded-xl bg-[#0D5C3A] py-2.5 text-sm font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700 mb-2"
                  >
                    <Phone size={14} /> Call Us Now
                  </a>
                  <a
                    href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`Hello, I need the latest price for ${product.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-lift flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-sm font-bold text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                  >
                    WhatsApp
                  </a>
                </div>
              </aside>
            ) : (
              /* General enquiry — no product */
              <aside className="flex flex-col gap-5">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-card flex flex-col items-center text-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D5C3A] to-[#0F172A] shadow-lg">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A] dark:text-white">General Enquiry</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#64748B] dark:text-slate-400">
                      Tell us your requirement and we'll recommend the right machine for your production line.
                    </p>
                  </div>
                  <div className="w-full rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] dark:border-emerald-800/60 dark:bg-emerald-950/40 p-3 text-xs text-[#0D5C3A] dark:text-emerald-300">
                    We respond within <strong>2–4 hours</strong> on business days
                  </div>
                </div>
              </aside>
            )}

            {/* ── Enquiry Form ── */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-card overflow-hidden">
              {/* Form header */}
              <div className="bg-[#0F172A] dark:bg-[#080D1A] px-6 py-4 border-b border-slate-800">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#10B981] uppercase">Get Latest Price</p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  {product ? product.name : "Zohan Enterprises — General Enquiry"}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-6 sm:p-8">
                <p className="text-sm text-[#64748B] dark:text-slate-400">
                  All fields marked <span className="text-red-500">*</span> are required. We'll get back within 2–4 hours.
                </p>

                {/* Name */}
                <Field label="Your Name *" icon={User} error={errors.name}>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kumar"
                    autoComplete="name"
                    className={inputCls(errors.name)}
                  />
                </Field>

                {/* Phone */}
                <Field label="Phone Number *" icon={Phone} error={errors.phone}>
                  <div className={`flex items-center rounded-xl border transition-all duration-200 ${
                    errors.phone
                      ? "border-red-400 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-300/40"
                      : "border-slate-200 bg-[#F8FAFC] focus-within:border-[#0D5C3A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0D5C3A]/15 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-emerald-500"
                  }`}>
                    <span className="shrink-0 border-r border-slate-200 dark:border-slate-700 px-3 py-3 text-sm font-medium text-[#64748B] dark:text-slate-400">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={fields.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      maxLength={10}
                      autoComplete="tel"
                      className="w-full bg-transparent px-3 py-3 text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </Field>

                {/* Email */}
                <Field label="Email Address" icon={Mail} error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={fields.email}
                    onChange={handleChange}
                    placeholder="e.g. rajesh@company.com"
                    autoComplete="email"
                    className={inputCls(errors.email)}
                  />
                </Field>

                {/* Company */}
                <Field label="Company / Business Name" icon={Building2}>
                  <input
                    type="text"
                    name="company"
                    value={fields.company}
                    onChange={handleChange}
                    placeholder="e.g. ABC Wire Industries"
                    autoComplete="organization"
                    className={inputCls()}
                  />
                </Field>

                {/* Message */}
                <Field label="Requirement / Message" icon={MessageSquare}>
                  <textarea
                    name="message"
                    value={fields.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your quantity, application or specific requirement..."
                    className={inputCls()}
                  />
                </Field>

                {submitError && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/60 dark:bg-red-950/40">
                    <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
                    <div>
                      <p className="text-xs font-semibold text-red-700 dark:text-red-400">{submitError}</p>
                      <p className="mt-0.5 text-[11px] text-red-600 dark:text-red-300">
                        Your details have been saved locally. You can also call us at{" "}
                        <a href={`tel:${company.phone}`} className="font-bold underline">{company.phone}</a>.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-lift flex items-center justify-center gap-2 rounded-xl bg-[#0D5C3A] px-6 py-3.5 text-sm font-bold tracking-wide text-white uppercase shadow-cta hover:bg-[#0a472c] disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  {submitting
                    ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    : <Send size={14} />
                  }
                  {submitting ? "Submitting…" : "Submit Enquiry"}
                </button>

                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Your details are stored securely and shared only with Zohan Enterprises.
                </p>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
