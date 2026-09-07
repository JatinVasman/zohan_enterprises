import { motion } from "framer-motion"
import { MessageSquareText, Phone, Truck, ShieldCheck, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { company } from "../../data/content"

export default function LocationCTA({ location }) {

  const whatsappUrl = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
    `Hello Zohan Enterprises, I am enquiring about industrial machinery supply and pricing for our facility in ${location?.name || "India"}.`
  )}`

  return (
    <section className="relative overflow-hidden bg-[#0F172A] dark:bg-[#080D1A] py-16 lg:py-20 text-white transition-colors duration-200">
      {/* Glow effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
        <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-8 sm:p-12 lg:p-14 backdrop-blur-sm">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full mb-3">
                Pan-India Direct Dispatch
              </span>
              <h2 className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl leading-tight">
                Request a Custom Machinery Quotation for {location?.name}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Connect directly with Zohan Enterprises for technical datasheets, live video demonstration recordings, and competitive factory-direct pricing for your workshop in {location?.name}, {location?.state}.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>100% Tested Pre-Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={16} className="text-emerald-400" />
                  <span>Insured Crated Transit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">GST:</span>
                  <span>{company.gstNo}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3.5">
              <Link
                to="/enquiry"
                className="btn-lift flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-colors"
              >
                <MessageSquareText size={16} />
                <span>Get Instant Quotation</span>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3.5 px-6 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <span>WhatsApp Technical Desk</span>
                <ArrowRight size={14} className="text-emerald-400" />
              </a>

              <p className="text-center text-[11px] text-slate-400 mt-1">
                Direct phone assistance:{" "}
                <a href={`tel:${company.phone}`} className="text-emerald-400 hover:underline">
                  {company.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
