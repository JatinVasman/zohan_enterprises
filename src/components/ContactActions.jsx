import { Mail, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { company } from "../data/content"
import { IconWhatsApp } from "./SocialIcons"

export default function ContactActions({ variant = "light" }) {
  const isDark = variant === "dark"
  const waLink = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
    "Hi, I would like to enquire about your wire processing machines."
  )}`

  if (isDark) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {/* WhatsApp — tertiary text link style */}
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 text-sm font-semibold text-[#25D366] hover:underline underline-offset-2 px-2 py-1"
        >
          <IconWhatsApp size={16} /> WhatsApp
        </a>

        {/* Call Now — secondary outlined */}
        <a
          href={`tel:${company.phone}`}
          className="btn-lift flex items-center gap-2 rounded-sm border border-white/30 text-white hover:bg-white/10 px-6 py-3.5 text-sm font-semibold transition-colors"
        >
          <Phone size={15} className="text-[#10B981]" /> Call Now
        </a>

        {/* Send Enquiry — primary solid emerald */}
        <Link
          to="/contact"
          className="btn-lift flex items-center gap-2 rounded-sm bg-[#0D5C3A] px-8 py-4 text-sm font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
        >
          <Mail size={15} /> Send Enquiry
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`tel:${company.phone}`}
        className="btn-lift flex items-center gap-2 rounded-sm border border-slate-200 bg-white text-[#0F172A] shadow-sm hover:border-slate-300 hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 px-6 py-3.5 text-sm font-semibold"
      >
        <Phone size={15} className="text-[#0D5C3A] dark:text-emerald-400" /> Call Now
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer noopener"
        className="btn-lift flex items-center gap-2 rounded-sm border border-slate-200 bg-white text-[#0F172A] shadow-sm hover:border-slate-300 hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 px-6 py-3.5 text-sm font-semibold"
      >
        <IconWhatsApp size={16} /> WhatsApp
      </a>
      <Link
        to="/contact"
        className="btn-lift flex items-center gap-2 rounded-sm bg-[#0D5C3A] px-6 py-3.5 text-sm font-semibold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
      >
        <Mail size={15} /> Send Enquiry
      </Link>
    </div>
  )
}
