import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LocationFAQ({ location, faqs }) {
  const [openIndex, setOpenIndex] = useState(0)

  if (!faqs || faqs.length === 0) return null

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i)
  }

  return (
    <section className="bg-[#F8FAF9] dark:bg-[#0B1120] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-4xl px-5 lg:px-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 mb-2">
            <HelpCircle size={13} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl">
            Machinery Enquiries for {location.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Answers to common questions regarding industrial machinery ordering, logistics, pre-dispatch testing, and technical support for businesses in {location.name}, {location.state}.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i

            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#10B981]/50 bg-white dark:bg-slate-900 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors cursor-pointer"
                >
                  <span className="font-display text-sm sm:text-base font-bold text-[#0F172A] dark:text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 bg-emerald-100 dark:bg-emerald-950 text-[#0D5C3A] dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="border-t border-slate-100 dark:border-slate-800 px-5 pb-5 pt-3">
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
