import { motion } from "framer-motion"
import { socialLinks } from "../data/socials"
import { socialIconMap } from "./SocialIcons"

export default function SocialFollow() {
  return (
    <section id="social" className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] py-12 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-10">
          <div className="max-w-lg text-center sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D5C3A] dark:text-emerald-400">
              Stay Connected
            </p>
            <h2 className="font-display mt-2 text-lg font-bold text-[#0F172A] dark:text-white">
              Follow Our Latest Updates
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B] dark:text-slate-400">
              Follow us for machine demonstrations, new product launches and company updates.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {socialLinks.map(({ id, url, ariaLabel, label }, i) => {
              const Icon = socialIconMap[id]
              return (
                <motion.a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                  title={label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="card-lift group flex h-11 w-11 items-center justify-center rounded-sm border border-slate-200 bg-[#F8FAFC] text-[#0F172A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A7F3D0] hover:bg-[#ECFDF5] hover:text-[#0D5C3A] hover:shadow-card dark:border-slate-800 dark:bg-slate-800 dark:hover:border-emerald-500/60 dark:hover:bg-slate-700"
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    <Icon size={20} />
                  </span>
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
