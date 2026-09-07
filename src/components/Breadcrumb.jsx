import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function Breadcrumb({ items }) {
  return (
    <div className="border-b border-slate-200 bg-[#F8FAFC] dark:border-slate-800 dark:bg-slate-900/60 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-3.5 text-sm lg:px-10">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <span key={item.label} className="flex items-center gap-2">
              {i > 0 && <ChevronRight size={13} className="text-slate-400 dark:text-slate-500" />}
              {item.to && !isLast ? (
                <Link to={item.to} className="font-medium text-[#64748B] transition-colors hover:text-[#0D5C3A] dark:text-slate-400 dark:hover:text-emerald-400">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-[#0F172A] dark:text-slate-100" : "text-[#64748B] dark:text-slate-400"}>{item.label}</span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
