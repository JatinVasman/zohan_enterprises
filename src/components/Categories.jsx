import { motion } from "framer-motion"
import {
  ArrowRight,
  Cable,
  Cog,
  Flame,
  FlaskConical,
  Gauge,
  Layers,
  Package,
  Plug,
  Recycle,
  RotateCw,
  Scissors,
  Settings,
  Syringe,
  TestTube,
  Wind,
  Wrench,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"
import { categoryMeta, allProducts } from "../data/products"

// Icon mapping (one per category, in order)
const CATEGORY_ICONS = [
  Cable,       // Terminal Crimping Machine
  Scissors,    // Wire Cutting Stripping Machine
  Recycle,     // Scrap Wire Stripping Machine
  Wind,        // Pneumatic Wire Stripping Machine
  RotateCw,    // Automatic Wire Cutting Stripping Twisting Machine
  Flame,       // Automatic & Semi Automatic Soldering
  Plug,        // Automatic Terminal Crimping Machine
  Layers,      // Wire Outer and Inner Stripping Machine Upto 10 Cores
  Package,     // Cable Tying And Wire Winding Machine
  Zap,         // Tape Dispenser
  Settings,    // Terminal Crimping Feed Applicator
  Scissors,    // Sleeve Cutting Machine
  RotateCw,    // Wire Twisting Machine
  Recycle,     // Plastic Crushing Machine
  Cog,         // Copper Granulator Machine
  Cable,       // Ribbon Wire Cutting Stripping Machine
  Plug,        // Connector Crimping Machine
  Layers,      // Coaxial Cable Stripping Machine
  Scissors,    // Automatic Cutting Peeling Stripping Machine
  Wind,        // Wire Pay Off Stand
  Gauge,       // Thimble Push Pull Tester
  Wrench,      // Bolt Tightening Machine
  TestTube,    // Cable Tester
  FlaskConical,// Testing Machine
  Zap,         // Machine Blade
]

// Show top 8 categories, first 2 as featured (wider tiles)
const FEATURED_COUNT = 2
const GRID_COUNT = 8

export default function Categories() {
  const displayed = categoryMeta.slice(0, GRID_COUNT)
  const featured  = displayed.slice(0, FEATURED_COUNT)
  const rest      = displayed.slice(FEATURED_COUNT)
  const total     = categoryMeta.length

  return (
    <section
      className="bg-[#F8FAFC] dark:bg-slate-900/50 py-20 transition-colors duration-200"
      id="categories"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Product Range"
            title="Browse by Category"
            desc={`${total} machine categories spanning crimping, cutting, stripping, soldering and terminal processing.`}
          />
          <Link
            to="/products"
            className="group flex items-center gap-2 text-sm font-semibold text-[#0D5C3A] dark:text-emerald-400 transition-colors hover:text-[#0a472c] dark:hover:text-emerald-300"
          >
            View All {total} Categories
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured 2 — wider tiles */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {featured.map((cat, i) => {
            const count = allProducts.filter((p) => p.categorySlug === cat.slug).length
            const Icon  = CATEGORY_ICONS[i]
            return (
              <FeaturedCategoryTile key={cat.slug} cat={cat} count={count} Icon={Icon} index={i} />
            )
          })}
        </div>

        {/* Remaining 6 — uniform 3-col (desktop) / 2-col (tablet) / 1-col (mobile) grid */}
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3">
          {rest.map((cat, i) => {
            const count = allProducts.filter((p) => p.categorySlug === cat.slug).length
            const Icon  = CATEGORY_ICONS[i + FEATURED_COUNT]
            return (
              <CategoryTile key={cat.slug} cat={cat} count={count} Icon={Icon} index={i + FEATURED_COUNT} />
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Featured (wide) category tile ─────────────────────────────────────────
function FeaturedCategoryTile({ cat, count, Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.42, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/products/${cat.slug}`}
        className="card-lift group flex rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-card hover:border-[#10B981]/60 hover:shadow-card-hover dark:hover:border-emerald-500/50 overflow-hidden"
      >
        {/* Image — takes the left portion on mobile-wide screens, full-width on small mobile */}
        <div className="flex h-44 w-2/5 shrink-0 items-center justify-center overflow-hidden bg-[#F0FDF4] dark:bg-emerald-950/20 p-5 sm:h-48">
          <img
            src={cat.image}
            alt={cat.name}
            className="h-full w-full object-contain transition-transform duration-350 group-hover:scale-[1.07]"
            style={{ objectPosition: "center" }}
            loading="lazy"
          />
        </div>

        {/* Text right side */}
        <div className="flex flex-1 flex-col justify-center px-5 py-5">
          {/* Accent icon */}
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] dark:bg-emerald-950/50 text-[#0D5C3A] dark:text-emerald-400 transition-all duration-200 group-hover:scale-105 group-hover:bg-[#A7F3D0]/50">
            <Icon size={18} />
          </span>

          <p className="mt-3 text-[15px] font-bold leading-snug text-[#0F172A] dark:text-white transition-colors group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400">
            {cat.name}
          </p>

          {/* Count pill */}
          <span className="mt-2 inline-flex w-fit items-center rounded-full bg-[#F1F5F9] dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-[#64748B] dark:text-slate-400">
            {count} model{count !== 1 ? "s" : ""}
          </span>

          <span className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[#0D5C3A] dark:text-emerald-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
            Browse →
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Regular category tile ──────────────────────────────────────────────────
function CategoryTile({ cat, count, Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/products/${cat.slug}`}
        className="card-lift group flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-card hover:border-[#10B981]/60 hover:shadow-card-hover dark:hover:border-emerald-500/50 overflow-hidden"
      >
        {/* Icon + arrow row */}
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] dark:bg-emerald-950/50 text-[#0D5C3A] dark:text-emerald-400 transition-all duration-200 group-hover:scale-105 group-hover:bg-[#A7F3D0]/50">
            <Icon size={16} />
          </span>
          <ArrowRight
            size={14}
            className="-translate-x-1 text-slate-300 dark:text-slate-700 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-[#0D5C3A] group-hover:opacity-100 dark:group-hover:text-emerald-400"
          />
        </div>

        {/* Product image */}
        <div className="mt-4 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-[#F8FAFC] dark:bg-slate-800/60 p-2">
          <img
            src={cat.image}
            alt={cat.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"
            style={{ objectPosition: "center" }}
            loading="lazy"
          />
        </div>

        {/* Category name */}
        <p className="mt-4 text-[13px] font-bold leading-snug text-[#0F172A] dark:text-white transition-colors group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400 min-h-[2.5rem]">
          {cat.name}
        </p>

        {/* Count pill */}
        <span className="mt-auto pt-2 inline-flex w-fit items-center rounded-full bg-[#F1F5F9] dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-[#64748B] dark:text-slate-400">
          {count} model{count !== 1 ? "s" : ""}
        </span>
      </Link>
    </motion.div>
  )
}

// ─── Re-export for use in Products.jsx ─────────────────────────────────────
export function SectionHeading({ eyebrow, title, desc }) {
  return (
    <div className="max-w-2xl">
      <span className="text-[11px] font-bold tracking-[0.2em] text-[#0D5C3A] dark:text-emerald-400 uppercase">
        {eyebrow}
      </span>
      <h2 className="font-display mt-2 text-2xl font-bold text-[#0F172A] dark:text-white lg:text-3xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
          {desc}
        </p>
      )}
    </div>
  )
}
