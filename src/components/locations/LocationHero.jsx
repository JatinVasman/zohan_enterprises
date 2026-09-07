import { motion } from "framer-motion"
import { ShieldCheck, Truck, Video, MessageSquareText, Phone, ArrowDown, Sparkles, Building2 } from "lucide-react"
import { Link } from "react-router-dom"
import { company } from "../../data/content"

export default function LocationHero({ location, content }) {

  return (
    <section className="relative overflow-hidden bg-[#0F172A] dark:bg-[#080D1A] py-16 sm:py-20 lg:py-24 text-white transition-colors duration-200">
      {/* Background Gradients & Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading, Subtitle, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400">
                <Building2 size={13} />
                {location.name}, {location.state}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-800 border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                {location.region}
              </span>
            </div>

            {/* H1 Title */}
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-[1.15]">
              Industrial Machinery &amp; Equipment in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                {location.name}
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300 max-w-3xl">
              {content.heroSubtitle}
            </p>

            {/* Key Value Guarantee Chips */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-slate-200">
                <Truck size={16} className="text-emerald-400 shrink-0" />
                <span>Pan-India Transit to {location.state}</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-slate-200">
                <Video size={16} className="text-emerald-400 shrink-0" />
                <span>100% Video Testing Before Dispatch</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-slate-200">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>GST &amp; IEC Registered Supplier</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/enquiry"
                className="btn-lift inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
              >
                <MessageSquareText size={16} className="text-slate-950" />
                Get a Quote for {location.name}
              </Link>

              <a
                href="#relevant-machinery"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <span>Explore Machinery</span>
                <ArrowDown size={14} className="text-emerald-400" />
              </a>

              <a
                href={`tel:${company.phone}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors ml-1"
              >
                <Phone size={14} className="text-emerald-400" />
                <span>Call Sales: {company.phone}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Local Summary Quick Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm shadow-2xl">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                Location Industrial Focus
              </p>
              <h3 className="mt-2 text-lg font-bold text-white">
                {content.industry.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {content.industry.tagline}
              </p>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Key Industrial Clusters
                </p>
                <p className="mt-1 text-xs text-slate-200 leading-snug">
                  {location.keyClusters || `${location.name} Industrial Area, MIDC / GIDC / SIDCUL Corridor`}
                </p>
              </div>

              <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-300">
                <span>Direct Supply Model</span>
                <span className="font-semibold text-emerald-400">Factory Direct</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                <span>Technical Guidance</span>
                <span className="font-semibold text-slate-200">Video &amp; On-Call</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
