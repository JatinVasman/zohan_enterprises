import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Home, Package, BookOpen, Phone, ArrowRight } from "lucide-react"
import { setTitle, setRobots, setCanonical, SITE_URL } from "../lib/seo"

const QUICK_LINKS = [
  { icon: Home,     label: "Homepage",        to: "/"        },
  { icon: Package,  label: "All Products",     to: "/products" },
  { icon: BookOpen, label: "Industrial Blogs", to: "/blog"    },
  { icon: Phone,    label: "Contact Us",       to: "/contact" },
]

export default function NotFound() {
  useEffect(() => {
    setTitle("Page Not Found (404) | Zohan Enterprises")
    setCanonical(`${SITE_URL}/404`)
    // 404 pages should not be indexed
    setRobots("noindex, follow")
    return () => {
      setRobots("index, follow")
    }
  }, [])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white dark:bg-[#0B1120] px-5 py-20 text-center transition-colors duration-200">
      {/* 404 display */}
      <div className="relative mb-6 select-none">
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[160px] font-black leading-none text-slate-100 dark:text-slate-800"
          aria-hidden
        >
          404
        </span>
        <span className="relative text-[72px] font-black leading-none text-[#0D5C3A] dark:text-emerald-400">
          404
        </span>
      </div>

      <h1 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-[#475569] dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
        Try one of these helpful links instead:
      </p>

      {/* Quick links */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/90 p-5 transition hover:border-[#10B981]/60 hover:shadow-md dark:hover:border-emerald-500/50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D5C3A]/10 dark:bg-emerald-900/30 text-[#0D5C3A] dark:text-emerald-400 transition group-hover:bg-[#0D5C3A]/20">
              <Icon size={20} />
            </span>
            <span className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400 transition-colors">
              {label}
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/"
        id="not-found-home-btn"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#0D5C3A] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#0a472c] active:scale-95"
      >
        Back to Homepage <ArrowRight size={15} />
      </Link>
    </div>
  )
}
