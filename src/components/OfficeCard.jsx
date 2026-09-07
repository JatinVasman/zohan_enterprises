import { Mail, MapPin, Navigation, Phone, ShieldCheck } from "lucide-react"
import { IconWhatsApp } from "./SocialIcons"
import Avatar from "./Avatar"

export default function OfficeCard({ office, index = 0 }) {
  const waLink = `https://wa.me/${office.whatsapp}?text=${encodeURIComponent(
    `Hi, I would like to enquire about your wire processing machines (${office.city} office).`
  )}`
  const address = office.addressLines.join(" ")
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <div id={`office-${office.id}`} className="card-lift flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-card hover:border-[#10B981] hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/60">
      {/* Rep + badge row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={office.representative} photo={office.photo} seed={index} />
          <div>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">{office.representative}</p>
            <p className="text-xs text-[#64748B] dark:text-slate-400">{office.representativeRole}</p>
          </div>
        </div>
        <span className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-[11px] font-bold tracking-wide text-[#0D5C3A] uppercase dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300 shrink-0">
          {office.type}
        </span>
      </div>

      {/* City heading */}
      <div className="mt-5 flex items-center gap-2">
        <MapPin size={16} className="text-[#10B981]" />
        <h3 className="font-display text-lg font-bold text-[#0F172A] dark:text-white">{office.city}</h3>
      </div>
      <p className="mt-1 text-sm font-semibold text-[#475569] dark:text-slate-300">{office.company}</p>

      {/* Address — flex-1 pushes actions to bottom regardless of line count */}
      <div className="mt-3 flex-1">
        <p className="text-sm leading-relaxed text-[#475569] dark:text-slate-300">
          {office.addressLines.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </p>
      </div>

      {/* GSTIN */}
      {office.gstin && (
        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#64748B] dark:text-slate-400">
          <ShieldCheck size={14} className="text-[#0D5C3A] dark:text-emerald-400" /> GSTIN: {office.gstin}
        </p>
      )}

      {/* Action buttons pinned to bottom via mt-auto */}
      <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
        {/* Row 1: Call + WhatsApp */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`tel:${office.phone}`}
            className="btn-lift flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-[#0F172A] hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Phone size={14} className="text-[#0D5C3A] dark:text-emerald-400" /> Call
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-lift flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-[#F0FDF4] px-3 py-2.5 text-xs font-bold text-[#0F172A] hover:border-[#86EFAC] hover:bg-[#DCFCE7] dark:border-slate-700 dark:bg-emerald-950/30 dark:text-slate-100 dark:hover:bg-emerald-950/50"
          >
            <IconWhatsApp size={15} /> WhatsApp
          </a>
        </div>

        {/* Row 2: Email ghost + Directions solid */}
        <div className="grid grid-cols-2 gap-2.5 items-center">
          <a
            href={`mailto:${office.email}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#0D5C3A] dark:text-emerald-400 hover:text-[#0a472c] dark:hover:text-emerald-300 transition-colors"
          >
            <Mail size={14} /> Email
          </a>
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-lift flex items-center justify-center gap-1.5 rounded-lg bg-[#0D5C3A] px-3 py-2.5 text-xs font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <Navigation size={14} /> Directions
          </a>
        </div>
      </div>
    </div>
  )
}
