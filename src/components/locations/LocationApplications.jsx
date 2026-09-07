import { Check, Cpu, Zap, Activity, Wrench, Scissors, Flame, RotateCw } from "lucide-react"

const appIconMap = {
  "terminal-crimping": Zap,
  "wire-cutting-stripping": Scissors,
  "scrap-cable-stripping-recovery": RotateCw,
  "scrap-stripping": RotateCw,
  "pneumatic-wire-stripping": Wrench,
  "pneumatic-stripping": Wrench,
  "multi-core-cable-stripping": Cpu,
  "multi-core-stripping": Cpu,
  "wire-pcb-soldering": Flame,
  "soldering": Flame,
  "wire-stripping-twisting": RotateCw,
  "wire-twisting": RotateCw,
  "cable-tying-winding-testing": Activity,
  "cable-testing-tying": Activity,
}

export default function LocationApplications({ location, applications }) {
  if (!applications || applications.length === 0) return null

  return (
    <section className="bg-white dark:bg-[#0B1120] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 mb-2">
            Technical Operations
          </span>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl">
            Industrial Applications in {location.name}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Engineered wire processing operations supported by Zohan machinery across {location.name}'s manufacturing, panel building, and electrical assembly sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => {
            const Icon = appIconMap[app.id] || appIconMap[app.slug] || Cpu

            return (
              <div
                key={app.id || app.slug}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/70 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#10B981]/50 hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0D5C3A] dark:text-emerald-400 group-hover:bg-[#0D5C3A] group-hover:text-white transition-colors">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                    {app.name}
                  </h3>
                </div>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 min-h-[3.8em]">
                  {app.description}
                </p>

                <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-3.5 space-y-1.5">
                  {(app.benefits || []).slice(0, 3).map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <Check size={13} className="text-[#10B981] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
