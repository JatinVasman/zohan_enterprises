import { ChevronRight, Home, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export default function LocationBreadcrumb({ location }) {
  if (!location) return null

  return (
    <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-[#F8FAFC] dark:border-slate-800 dark:bg-slate-900/60 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-3.5 text-xs sm:text-sm lg:px-10 overflow-x-auto whitespace-nowrap scrollbar-none">
        <Link
          to="/"
          className="flex items-center gap-1.5 font-medium text-[#64748B] hover:text-[#0D5C3A] dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <Home size={14} className="shrink-0" />
          <span>Home</span>
        </Link>

        <ChevronRight size={13} className="text-slate-400 shrink-0" />

        <Link
          to="/industrial-machinery/locations"
          className="font-medium text-[#64748B] hover:text-[#0D5C3A] dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          Industrial Machinery Across India
        </Link>

        <ChevronRight size={13} className="text-slate-400 shrink-0" />

        <span className="flex items-center gap-1 font-semibold text-[#0F172A] dark:text-slate-100">
          <MapPin size={13} className="text-[#10B981] shrink-0" />
          {location.name}, {location.state}
        </span>
      </div>
    </nav>
  )
}
