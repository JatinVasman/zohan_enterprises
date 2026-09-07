import { Car, Zap, Tv, Radio, Sun, Recycle, Network, Wrench } from "lucide-react"

const industryIconMap = {
  "automotive-harness": Car,
  "electrical-switchgear": Zap,
  "electronics-appliances": Tv,
  "cable-manufacturing": Radio,
  "solar-renewable": Sun,
  "scrap-copper-recycling": Recycle,
  "telecom-networking": Network,
  "general-msme-manufacturing": Wrench,
  "msme-engineering": Wrench,
}

export default function LocationIndustries({ location, primaryIndustry }) {
  if (!location) return null

  const PrimaryIcon = industryIconMap[location.industrialProfile] || Wrench

  return (
    <section className="bg-[#F8FAF9] dark:bg-[#0B1120] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 mb-2">
            Target Sectors
          </span>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl">
            Industries We Serve in {location.name}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Zohan Enterprises machinery powers essential wire processing, crimping, and assembly operations for key manufacturing sectors across {location.state}.
          </p>
        </div>

        {/* Highlighted Primary Industry Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0D5C3A] text-white shadow-md">
              <PrimaryIcon size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0D5C3A] dark:text-emerald-400">
                  Primary Sector in {location.name}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#0F172A] dark:text-white mt-1">
                {primaryIndustry?.name || "Manufacturing & Wire Harness"}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {primaryIndustry?.description ||
                  `Manufacturing enterprises in ${location.name} utilize Zohan machinery for high-precision wire processing and harness assembly.`}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Industry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5">
            <div className="flex items-center gap-3 mb-2.5">
              <Zap size={18} className="text-[#0D5C3A] dark:text-emerald-400" />
              <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Electrical Control Panels</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Thick-cable peeling and heavy terminal lug crimping for distribution boards, switchgear panels, and transformers in {location.name}.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5">
            <div className="flex items-center gap-3 mb-2.5">
              <Tv size={18} className="text-[#0D5C3A] dark:text-emerald-400" />
              <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Consumer Electronics &amp; Appliances</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Fine-gauge wire stripping, multi-core cable peeling, and precision automated wire soldering for appliances and electronic devices.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5">
            <div className="flex items-center gap-3 mb-2.5">
              <Recycle size={18} className="text-[#0D5C3A] dark:text-emerald-400" />
              <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Copper Wire Scrap Recycling</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              High-yield motorized scrap wire stripping and copper granulation machines recovering pure copper from industrial scrap cables in {location.name}.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
