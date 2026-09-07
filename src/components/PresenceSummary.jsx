import { motion } from "framer-motion"
import { ArrowRight, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { offices } from "../data/offices"
import Avatar from "./Avatar"
import { SectionHeading } from "./Categories"

export default function PresenceSummary() {
  return (
    <section id="presence" className="bg-[#F8FAFC] dark:bg-slate-900/50 py-20 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <SectionHeading
          eyebrow="Nationwide Reach"
          title="Our Presence Across India"
          desc="Supporting customers through our headquarters and regional sales offices across India."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((office, i) => (
            <motion.div
              key={office.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="card-lift group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-card min-h-[260px] hover:border-[#10B981] hover:border-b-4 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/60 transition-all duration-200"
            >
              <Avatar name={office.representative} photo={office.photo} seed={i} size={56} />
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#10B981]" />
                  <h3 className="font-display text-lg font-bold text-[#0F172A] dark:text-white">{office.city}</h3>
                </div>
                <span className="whitespace-nowrap rounded-sm border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-bold tracking-wide text-[#0D5C3A] uppercase dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">{office.type}</span>
              </div>
              <p className="mt-2 text-sm text-[#64748B] dark:text-slate-400">{office.representative}</p>

              <div className="mt-auto w-full pt-5">
                <Link
                  to={`/contact#office-${office.id}`}
                  className="btn-lift flex w-full items-center justify-center gap-2 rounded-lg bg-[#0D5C3A] px-5 py-3 text-xs font-bold tracking-wide text-white uppercase shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  View Contact Details <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
