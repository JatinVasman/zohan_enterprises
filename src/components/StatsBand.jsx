import { motion } from "framer-motion"
import { BadgeCheck, CalendarClock, Factory, ShieldCheck, Truck, Users } from "lucide-react"
import { stats } from "../data/content"
import CountUp from "./CountUp"

const statIcons = [CalendarClock, Factory, Users, Truck, ShieldCheck, BadgeCheck]

export default function StatsBand() {
  return (
    <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 dark:divide-slate-800 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          {stats.map((s, i) => {
            const Icon = statIcons[i]
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col items-center gap-1.5 px-4 py-7 text-center transition-colors hover:bg-[#F8FAF9] dark:hover:bg-slate-900/60"
              >
                <Icon size={20} className="text-[#0D5C3A] dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110" />
                <p className="font-display text-xl font-bold text-[#0F172A] dark:text-white">
                  <CountUp value={s.value} />
                </p>
                <p className="text-[11px] font-semibold tracking-wide text-[#64748B] dark:text-slate-400 uppercase">
                  {s.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
