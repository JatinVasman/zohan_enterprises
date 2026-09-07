import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { X, SlidersHorizontal } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { categoryMeta, allProducts } from "../data/products"
import { company } from "../data/content"

// ─── Shared category list content ───────────────────────────────────────────
function CategoryList({ categorySlug, onSelect }) {
  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
      {/* All Products */}
      <li>
        <Link
          to="/products"
          onClick={onSelect}
          className={`flex items-center justify-between px-5 py-3 text-sm font-semibold transition-all duration-150 ${
            !categorySlug
              ? "border-l-[3px] border-[#0D5C3A] bg-[#ECFDF5] text-[#0D5C3A] dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#0D5C3A] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-400 pl-5"
          }`}
        >
          <span>All Products</span>
          <span className="ml-auto shrink-0 rounded-full bg-[#F1F5F9] dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-[#64748B] dark:text-slate-400">
            {allProducts.length}
          </span>
        </Link>
      </li>

      {/* Per category */}
      {categoryMeta.map((cat) => {
        const count = allProducts.filter((p) => p.categorySlug === cat.slug).length
        const isActive = categorySlug === cat.slug
        return (
          <li key={cat.slug}>
            <Link
              to={`/products/${cat.slug}`}
              onClick={onSelect}
              className={`group flex items-center gap-3 px-5 py-3 text-sm transition-all duration-150 ${
                isActive
                  ? "border-l-[3px] border-[#0D5C3A] bg-[#ECFDF5] font-semibold text-[#0D5C3A] dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0D5C3A] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400 pl-5"
              }`}
            >
              <img
                src={cat.image}
                alt=""
                aria-hidden
                className="h-7 w-7 shrink-0 object-contain opacity-80 transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
              <span
                className="flex-1 leading-snug text-[13px]"
                style={{ textWrap: "balance", wordBreak: "break-word", maxWidth: "9.5rem" }}
              >
                {cat.name}
              </span>
              <span className="ml-auto shrink-0 rounded-full bg-[#F1F5F9] dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-[#64748B] dark:text-slate-400">
                {count}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Contact CTA ─────────────────────────────────────────────────────────────
function ContactCTA() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-card">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
        Need Help?
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
        Not sure which machine fits your requirement? Talk to our technical team.
      </p>
      <a
        href={`tel:${company.phone}`}
        className="btn-lift mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0D5C3A] py-2.5 text-[11px] font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
      >
        Call Us Now
      </a>
      <a
        href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hello, I need help choosing the right wire processing machine.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-lift mt-2 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-[11px] font-bold text-[#0F172A] dark:text-slate-100 hover:border-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 shadow-sm"
      >
        WhatsApp
      </a>
    </div>
  )
}

// ─── Mobile Filter Drawer (bottom sheet) ─────────────────────────────────────
export function MobileFilterDrawer({ open, onClose }) {
  const { categorySlug } = useParams()

  // iOS-safe scroll lock
  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    const body = document.body
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.overflowY = "scroll"
    return () => {
      body.style.position = ""
      body.style.top = ""
      body.style.left = ""
      body.style.right = ""
      body.style.overflowY = ""
      window.scrollTo(0, scrollY)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-[#0F172A]/50 backdrop-blur-sm xl:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Bottom sheet */}
          <motion.div
            key="filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Filter by Category"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[61] flex flex-col rounded-t-3xl bg-white dark:bg-slate-900 shadow-[0_-12px_40px_-8px_rgba(15,23,42,0.22)] xl:hidden"
            style={{ maxHeight: "80dvh" }}
          >
            {/* Handle bar */}
            <div className="flex shrink-0 justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[#0D5C3A]" />
                <p className="text-sm font-bold text-[#0F172A] dark:text-white">
                  Filter by Category
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close filter"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#0D5C3A]"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable category list */}
            <div className="overflow-y-auto flex-1">
              <CategoryList categorySlug={categorySlug} onSelect={onClose} />
            </div>

            {/* Footer action */}
            <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 px-5 py-4">
              <button
                onClick={onClose}
                className="btn-lift w-full rounded-xl bg-[#0D5C3A] py-3 text-sm font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Main ProductSidebar (desktop only) ──────────────────────────────────────
export default function ProductSidebar() {
  const { categorySlug } = useParams()

  return (
    <aside
      className="hidden xl:block w-60 shrink-0"
      style={{
        position:  "sticky",
        top:       "calc(var(--nav-height, 72px) + 1.5rem)",
        maxHeight: "calc(100vh - var(--nav-height, 72px) - 3rem)",
        overflowY: "auto",
        scrollbarWidth: "thin",
        alignSelf: "start",
      }}
    >
      {/* Category list */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-card">
        <div className="bg-[#0F172A] dark:bg-[#080D1A] px-5 py-3.5">
          <p className="text-[11px] font-bold tracking-[0.15em] text-white uppercase">
            Product Categories
          </p>
        </div>
        <CategoryList categorySlug={categorySlug} onSelect={null} />
      </div>

      {/* Contact CTA */}
      <div className="mt-4">
        <ContactCTA />
      </div>
    </aside>
  )
}
