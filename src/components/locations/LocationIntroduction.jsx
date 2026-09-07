import { CheckCircle2, Factory, Layers, Cpu } from "lucide-react"

export default function LocationIntroduction({ location, content }) {
  if (!location || !content) return null

  return (
    <section className="bg-white dark:bg-[#0B1120] py-14 lg:py-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Text */}
          <div className="lg:col-span-7">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 mb-3">
              Industrial Profile &middot; {location.name}
            </span>
            <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl leading-snug">
              Supplying Precision Industrial Machinery to Manufacturing Units Across {location.name}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {content.introParagraph1}
            </p>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {content.introParagraph2}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  Heavy-duty 1.5T to 6T crimping presses
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  Microprocessor programmable cutting &amp; stripping
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  High-recovery copper scrap cable granulators
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  100% pre-dispatch video testing proof
                </span>
              </div>
            </div>
          </div>

          {/* Right Highlights Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/80 p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D5C3A] text-white">
                  <Factory size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Industrial Supply Scope
                  </p>
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white">
                    {location.name}, {location.state}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <Layers size={16} className="text-[#0D5C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Key Estates Served:</span>{" "}
                    {location.keyClusters || `${location.name} Industrial Area and surrounding district clusters`}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Cpu size={16} className="text-[#0D5C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Primary Applications:</span>{" "}
                    {content.matchedApps.map((a) => a.name).join(", ")}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Factory size={16} className="text-[#0D5C3A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Supply Architecture:</span>{" "}
                    Central direct dispatch with factory warranty and technical consultation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
