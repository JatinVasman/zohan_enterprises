import { motion } from "framer-motion"
import { Award, BadgeCheck, Headset, ShieldCheck, Star, Truck } from "lucide-react"
import { whyChooseUs } from "../data/content"
import { SectionHeading } from "./Categories"

const icons = [ShieldCheck, Truck, Headset, Award, BadgeCheck, Star]

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-[#F8FAFC] dark:bg-slate-900/50 py-20 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <SectionHeading
          eyebrow="Trust & Reliability"
          title="Why Manufacturers Choose Us"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="card-lift group flex flex-col rounded-sm border border-slate-200 bg-white p-7 shadow-card hover:border-[#10B981] hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/60"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0F172A] text-white transition-all duration-200 group-hover:bg-[#0D5C3A] group-hover:scale-105 dark:bg-slate-800 dark:group-hover:bg-emerald-600">
                  <Icon size={19} />
                </span>
                <h3 className="font-display mt-5 text-base font-bold text-[#0F172A] dark:text-white transition-colors group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">{item.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
