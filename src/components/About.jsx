import { motion } from "framer-motion"
import {
  Banknote,
  Building2,
  CalendarCheck,
  CheckCircle,
  FileBadge2,
  MapPin,
  Scale,
  Users,
} from "lucide-react"
import { aboutText, facts } from "../data/content"
import { offices } from "../data/offices"
import IndiaPresenceMap from "./IndiaPresenceMap"

const factIcons = [Building2, Users, CalendarCheck, Scale, Banknote, FileBadge2]

export default function About() {
  return (
    <section id="about-us" className="bg-white dark:bg-[#0B1120] py-20 transition-colors duration-200">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-2 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-sm border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-bold tracking-wide text-[#0D5C3A] uppercase transition-colors hover:border-[#10B981] dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Building2 size={14} /> Company Profile
          </span>
          <h2 className="font-display mt-5 text-2xl font-bold text-[#0F172A] dark:text-white lg:text-3xl">Zohan Enterprises</h2>
          <p className="mt-6 text-base leading-relaxed text-[#475569] dark:text-slate-300">{aboutText}</p>

          <a
            href="#contact-us"
            className="btn-lift mt-8 inline-flex items-center gap-2 rounded-sm bg-[#0D5C3A] px-6 py-3.5 text-sm font-semibold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            Get In Touch With Us
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold tracking-wide text-[#0F172A] dark:text-slate-200 uppercase">Registered Business Details</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {facts.map((f, i) => {
              const Icon = factIcons[i]
              return (
                <div
                  key={f.label}
                  className="card-lift group rounded-sm border border-slate-200 bg-[#F8FAFC] p-5 shadow-card hover:border-[#10B981] hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/60"
                >
                  <Icon size={18} className="text-[#0D5C3A] dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110" />
                  <dt className="mt-3 text-[11px] font-medium tracking-wide text-[#64748B] dark:text-slate-400 uppercase">{f.label}</dt>
                  <dd className="font-display mt-1 text-sm font-bold text-[#0F172A] dark:text-white">{f.value}</dd>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-5 lg:px-10">
        <div className="grid items-center gap-12 border-t border-slate-200 dark:border-slate-800 pt-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-sm border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-bold tracking-wide text-[#0D5C3A] uppercase transition-colors hover:border-[#10B981] dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <MapPin size={14} /> Our Presence
            </span>
            <h2 className="font-display mt-5 text-2xl font-bold text-[#0F172A] dark:text-white lg:text-3xl">Our Presence</h2>
            <p className="mt-5 text-base leading-relaxed text-[#475569] dark:text-slate-300">
              We proudly serve customers across India through our headquarters and regional
              sales offices.
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {offices.map((office) => (
                <li key={office.id} className="flex items-center gap-2.5 text-sm font-semibold text-[#0F172A] dark:text-slate-200">
                  <CheckCircle size={16} className="shrink-0 text-[#10B981]" />
                  {office.type} - {office.city}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <IndiaPresenceMap />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
