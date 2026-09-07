import { Link } from "react-router-dom"
import { MapPin, ArrowRight, Compass } from "lucide-react"

export default function LocationNearby({ location, nearbyLocations }) {
  if (!nearbyLocations || nearbyLocations.length === 0) return null

  return (
    <section className="bg-white dark:bg-[#0B1120] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 mb-2">
              <Compass size={14} />
              <span>Regional Industrial Network</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl">
              Nearby Industrial Hubs Around {location.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Explore industrial machinery supply across adjacent manufacturing centers in {location.state} and neighboring regions.
            </p>
          </div>

          <Link
            to="/industrial-machinery/locations"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0D5C3A] dark:text-emerald-400 hover:underline shrink-0"
          >
            <span>All India Location Directory</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nearbyLocations.map((nearby) => (
            <Link
              key={nearby.slug}
              to={`/industrial-machinery/${nearby.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#10B981]/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-2">
                  <span className="font-semibold text-[#0D5C3A] dark:text-emerald-400">{nearby.state}</span>
                  <span className="text-[10px] text-slate-400">{nearby.region}</span>
                </div>
                <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400 transition-colors">
                  {nearby.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {nearby.keyClusters || `Industrial machinery & equipment in ${nearby.name}`}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#0D5C3A] dark:text-emerald-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span>View Machinery</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
