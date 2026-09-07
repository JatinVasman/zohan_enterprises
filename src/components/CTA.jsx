import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { company } from "../data/content"
import ContactActions from "./ContactActions"

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-[#0F172A] dark:bg-[#080D1A] dark:border-y dark:border-slate-800 py-16 transition-colors duration-200">
      {/* Top blending gradient */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white dark:from-[#0B1120] to-transparent z-10" />
      {/* Bottom blending gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-[#0B1120] to-transparent z-10" />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 lg:flex-row lg:items-center lg:px-10"
      >
        <div>
          <span className="inline-block bg-emerald-500/20 text-emerald-400 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            Talk To Our Team
          </span>
          <h2 className="font-display mt-2 text-2xl font-bold text-white lg:text-[1.85rem]">
            Need Industrial Machinery For Your Business?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#CBD5E1]">
            Get expert consultation from our team on specifications, pricing and
            bulk-order terms.
          </p>
        </div>
        <ContactActions variant="dark" />
      </motion.div>
      <div className="relative mx-auto mt-8 flex max-w-7xl items-center gap-2 border-t border-white/10 px-5 pt-6 text-xs text-[#94A3B8] lg:px-10">
        <MapPin size={13} className="text-[#10B981]" /> {company.address}
      </div>
    </section>
  )
}
