import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X, Send, Phone, Mail, Building2, User, MessageSquare, AlertCircle } from "lucide-react"
import { useQuoteModal } from "../context/QuoteModalContext"
import { submitEnquiry } from "../lib/submitEnquiry"
import { markUserEngaged } from "./QuoteReminderPopup"
import { company } from "../data/content"

export default function QuoteModal() {
  const { product, closeModal } = useQuoteModal()
  const navigate = useNavigate()
  const firstInputRef = useRef(null)

  const [fields, setFields] = useState({ name: "", phone: "", email: "", company: "", message: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Reset form when product changes (new modal open)
  useEffect(() => {
    if (product) {
      markUserEngaged()
      setFields({ name: "", phone: "", email: "", company: "", message: "" })
      setErrors({})
      setSubmitting(false)
      setSubmitError("")
      setTimeout(() => firstInputRef.current?.focus(), 80)
    }
  }, [product])

  // Close on Escape + browser back button
  useEffect(() => {
    if (!product) return
    const handleKeydown = (e) => e.key === "Escape" && closeModal()
    const handlePopState = () => closeModal()
    window.addEventListener("keydown", handleKeydown)
    window.addEventListener("popstate", handlePopState)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [product, closeModal])

  // iOS-safe scroll lock: save scroll position, fix body, restore on close
  useEffect(() => {
    if (!product) return
    const scrollY = window.scrollY
    const body = document.body
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.overflowY = "scroll" // prevents layout shift
    return () => {
      body.style.position = ""
      body.style.top = ""
      body.style.left = ""
      body.style.right = ""
      body.style.overflowY = ""
      window.scrollTo(0, scrollY)
    }
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
      closeModal()
      navigate("/thank-you", { state: { product, enquiry } })
    } else {
      setSubmitting(false)
      setSubmitError(result.error)
    }
  }

  const topSpecs = (product?.specifications || []).slice(0, 4)

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Request a Quote"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[50%] z-50 mx-auto max-w-3xl -translate-y-1/2 overflow-hidden rounded-sm bg-white shadow-modal sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full dark:border dark:border-slate-800 dark:bg-slate-900"
            style={{ maxHeight: "92dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#0F172A] px-6 py-4 dark:bg-[#080D1A] dark:border-slate-800">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#10B981] uppercase">Request a Quote</p>
                <p className="mt-0.5 text-sm font-bold text-white">Zohan Enterprises</p>
              </div>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(92dvh - 57px)" }}>
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">

                {/* ── Product panel ── */}
                <div className="border-b border-slate-200 bg-[#F8FAFC] p-6 md:border-b-0 md:border-r dark:border-slate-800 dark:bg-slate-800/80">
                  {product?.name && !product?.isGeneral ? (
                    <>
                      {/* Image */}
                      <div className="flex h-36 items-center justify-center rounded-sm border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        {product.image
                          ? <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                          : <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
                        }
                      </div>

                      {/* Product info */}
                      <p className="mt-4 text-[10px] font-bold tracking-wide text-[#0D5C3A] dark:text-emerald-400 uppercase">{product.category}</p>
                      <p className="mt-1 text-sm font-bold leading-snug text-[#0F172A] dark:text-white">{product.name}</p>
                      <div className="mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                        <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">Indicative Price</p>
                        <p className="font-display text-lg font-bold text-[#0F172A] dark:text-white">{product.price}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">/ {product.unit} · GST extra</p>
                      </div>

                      {/* Key specs */}
                      {topSpecs.length > 0 && (
                        <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                          <p className="mb-2 text-[10px] font-bold tracking-wide text-[#64748B] dark:text-slate-400 uppercase">Key Specs</p>
                          <ul className="space-y-1.5">
                            {topSpecs.map((s) => (
                              <li key={s.label} className="flex justify-between gap-2 text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
                                <span className="font-semibold text-[#0F172A] dark:text-slate-200 text-right">{s.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    /* General enquiry — no specific product */
                    <div className="flex flex-col items-center text-center gap-4 pt-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D5C3A] to-[#0F172A] shadow-lg">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 13v4M10 15h4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A] dark:text-white">General Enquiry</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#64748B] dark:text-slate-400">
                          Tell us what you need and our team will recommend the right machine for your production line.
                        </p>
                      </div>
                      <div className="mt-2 w-full rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] dark:border-emerald-800/60 dark:bg-emerald-950/40 p-3 text-xs text-[#0D5C3A] dark:text-emerald-300">
                        We respond within <strong>2–4 hours</strong> on business days
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Form panel ── */}
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-6">
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white">Fill in your details and we'll get back within 2–4 hours.</p>

                  {/* Name */}
                  <Field label="Your Name *" icon={User} error={errors.name}>
                    <input
                      ref={firstInputRef}
                      type="text"
                      name="name"
                      value={fields.name}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Kumar"
                      className={inputCls(errors.name)}
                    />
                  </Field>

                  {/* Phone */}
                  <Field label="Phone Number *" icon={Phone} error={errors.phone}>
                    <div className={`flex items-center rounded-sm border transition-all duration-200 ${errors.phone ? "border-red-400 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-300/40" : "border-slate-200 bg-[#F8FAFC] focus-within:border-[#0D5C3A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0D5C3A]/15 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-emerald-500"}`}>
                      <span className="shrink-0 border-r border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm font-medium text-[#64748B] dark:text-slate-400">+91</span>
                      <input
                        type="tel"
                        name="phone"
                        value={fields.phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength={10}
                        className="w-full bg-transparent px-3 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none"
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
                      className={inputCls()}
                    />
                  </Field>

                  {/* Message */}
                  <Field label="Requirement / Message" icon={MessageSquare}>
                    <textarea
                      name="message"
                      value={fields.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe your quantity, application or specific requirement..."
                      className={inputCls()}
                    />
                  </Field>

                  {submitError && (
                    <div className="flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/60 dark:bg-red-950/40">
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
                    className="btn-lift flex items-center justify-center gap-2 rounded-sm bg-[#0D5C3A] px-6 py-3 text-sm font-bold tracking-wide text-white uppercase shadow-cta hover:bg-[#0a472c] disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    {submitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Send size={14} />
                    )}
                    {submitting ? "Submitting…" : "Submit Enquiry"}
                  </button>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Your details are stored locally and shared only with Zohan Enterprises.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-[#0F172A] dark:text-slate-200 uppercase">
        {Icon && <Icon size={12} className="text-slate-400" />}
        {label}
      </span>
      {children}
      {error && <span className="text-xs font-medium text-red-600 dark:text-red-400">{error}</span>}
    </label>
  )
}

function inputCls(error) {
  return `w-full rounded-sm border ${error ? "border-red-400 bg-red-50 dark:bg-red-950/30 focus:ring-2 focus:ring-red-300/40" : "border-slate-200 bg-[#F8FAFC] focus:border-[#0D5C3A] focus:bg-white focus:ring-2 focus:ring-[#0D5C3A]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-800"} px-3.5 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-200`
}
