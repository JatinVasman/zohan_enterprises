import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, Send } from "lucide-react"
import { submitEnquiry } from "../lib/submitEnquiry"
import { company } from "../data/content"

export default function EnquiryForm({ className = "" }) {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  function validate(fields) {
    const e = {}
    if (!fields.name.trim()) e.name = "Name is required"
    if (!/^\d{10}$/.test(fields.phone.trim())) e.phone = "Enter a valid 10-digit phone number"
    if (!fields.requirement.trim()) e.requirement = "Please describe your requirement"
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = "Enter a valid email address"
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const fields = {
      name:        form.name.value.trim(),
      phone:       form.phone.value.trim(),
      email:       form.email.value.trim(),
      requirement: form.requirement.value.trim(),
    }

    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setErrors({})
    setSubmitting(true)
    setSubmitError("")

    const result = await submitEnquiry({
      name:    fields.name,
      phone:   fields.phone,
      email:   fields.email,
      message: fields.requirement,
      pageUrl: window.location.href,
    })

    if (result.ok) {
      navigate("/thank-you")
    } else {
      setSubmitting(false)
      setSubmitError(result.error)
    }
  }

  const inputCls = (err) =>
    `w-full rounded-sm border ${err ? "border-red-400 bg-red-50 dark:bg-red-950/30 focus:ring-2 focus:ring-red-300/40" : "border-slate-200 bg-[#F8FAFC] focus:border-[#0D5C3A] focus:bg-white focus:ring-2 focus:ring-[#0D5C3A]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-800"} px-3.5 py-3 text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-200`

  return (
    <form onSubmit={handleSubmit} noValidate className={`rounded-sm border border-slate-200 bg-white p-6 shadow-card lg:p-8 dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <div className="flex flex-col gap-5">

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wide text-[#0F172A] dark:text-slate-200 uppercase">Describe Your Requirement *</span>
          <textarea
            name="requirement"
            rows={4}
            placeholder="I would like to enquire about..."
            className={inputCls(errors.requirement)}
          />
          {errors.requirement && <span className="text-xs font-medium text-red-600 dark:text-red-400">{errors.requirement}</span>}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wide text-[#0F172A] dark:text-slate-200 uppercase">Phone Number *</span>
          <div className={`flex items-center rounded-sm border transition-all duration-200 ${errors.phone ? "border-red-400 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-300/40" : "border-slate-200 bg-[#F8FAFC] focus-within:border-[#0D5C3A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0D5C3A]/15 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-emerald-500"}`}>
            <span className="border-r border-slate-200 dark:border-slate-700 px-3.5 py-3 text-sm font-medium text-[#64748B] dark:text-slate-400">+91</span>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit number"
              maxLength={10}
              className="w-full bg-transparent px-3.5 py-3 text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.phone && <span className="text-xs font-medium text-red-600 dark:text-red-400">{errors.phone}</span>}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wide text-[#0F172A] dark:text-slate-200 uppercase">Your Name *</span>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className={inputCls(errors.name)}
          />
          {errors.name && <span className="text-xs font-medium text-red-600 dark:text-red-400">{errors.name}</span>}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wide text-[#0F172A] dark:text-slate-200 uppercase">Email Address</span>
          <input
            type="email"
            name="email"
            placeholder="e.g. name@company.com"
            className={inputCls(errors.email)}
          />
          {errors.email && <span className="text-xs font-medium text-red-600 dark:text-red-400">{errors.email}</span>}
        </label>

        {submitError && (
          <div className="flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/60 dark:bg-red-950/40">
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">{submitError}</p>
              <p className="mt-0.5 text-[11px] text-red-600 dark:text-red-300">
                Your details are saved locally. You can also call{" "}
                <a href={`tel:${company.phone}`} className="font-bold underline">{company.phone}</a>.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-lift flex items-center justify-center gap-2 rounded-sm bg-[#0D5C3A] px-6 py-3.5 text-sm font-bold tracking-wide text-white uppercase shadow-cta hover:bg-[#0a472c] disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-700"
        >
          {submitting
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            : <Send size={15} />
          }
          {submitting ? "Submitting…" : "Submit Enquiry"}
        </button>
      </div>
    </form>
  )
}
