import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Award, MapPin, BadgeCheck, Headset,
  ShieldCheck, Truck, ChevronRight, ArrowRight,
  FileText
} from "lucide-react"
import { company } from "../data/content"

// ─── Flagship products for hero carousel ───────────────────────────────────
const HERO_PRODUCTS = [
  {
    slug: "ze-2t-semi-automatic-side-panel-crimping-machine",
    series: "ZE-2T Series",
    name: "Semi Automatic Side Panel Crimping Machine",
    tagline: "2-ton side-panel regreto crimping for wires up to 6.0 sqmm",
    img: "https://5.imimg.com/data5/SELLER/Default/2026/1/578502784/EU/VH/XU/118138804/2-ton-semi-automatic-regreto-wire-crimping-machine-500x500.jpeg",
    price: "₹60,000",
    badge: "Best Seller",
  },
  {
    slug: "ze-6mm-semi-automatic-wire-cutting-stripping-machine",
    series: "ZE-6mm Series",
    name: "Wire Cutting & Stripping Machine",
    tagline: "Precision wire cutting and insulation stripping for 0.1–6mm² wire",
    img: "https://5.imimg.com/data5/SELLER/Default/2026/6/614518552/RT/CI/WT/118138804/ze-6mm-semi-automatic-wire-cutting-stripping-machine-500x500.png",
    price: "₹85,000",
    badge: "Popular",
  },
  {
    slug: "ze-038-scrap-wire-stripping-machine",
    series: "ZE-038 Series",
    name: "Scrap Wire Stripping Machine",
    tagline: "Recover copper from scrap wire up to 38mm — compact and efficient",
    img: "https://5.imimg.com/data5/SELLER/Default/2026/5/607998252/BR/QZ/XF/118138804/ze-038-scrap-wire-machine-500x500.png",
    price: "₹55,000",
    badge: "New",
  },
]

// ─── Trust badges ─────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Award, label: "15+ Years" },
  { icon: Truck, label: "Pan India" },
  { icon: ShieldCheck, label: "Quality Tested" },
  { icon: Headset, label: "Expert Support" },
  { icon: BadgeCheck, label: "GST Verified" },
]

// ─── Animation variants ───────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const heroImageAnim = {
  initial: { opacity: 0, scale: 1.04 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const [activeIdx, setActiveIdx] = useState(0)
  const current = HERO_PRODUCTS[activeIdx]

  // Auto-rotate every 5s
  const advance = useCallback(
    () => setActiveIdx((i) => (i + 1) % HERO_PRODUCTS.length),
    []
  )
  useEffect(() => {
    const id = setInterval(advance, 5000)
    return () => clearInterval(id)
  }, [advance])

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white dark:bg-[#0B1120] transition-colors duration-200"
    >
      {/* ── Ambient background shapes ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Soft radial gradient blob behind the product */}
        <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-br from-emerald-50 via-transparent to-transparent opacity-80 dark:from-emerald-950/30 dark:opacity-40" />
        <div className="absolute right-24 bottom-0 h-72 w-72 rounded-full bg-gradient-radial from-emerald-100/60 to-transparent dark:from-emerald-900/20" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#0F172A 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

          {/* ── Left column ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Eyebrow */}
            <motion.span
              variants={fadeIn}
              className="inline-flex items-center gap-2 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-[#0D5C3A] uppercase dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <MapPin size={11} className="text-[#10B981]" />
              Manufacturer-Authorised Trader · Noida, India
            </motion.span>

            {/* H1 */}
            <motion.h1
              variants={fadeIn}
              className="font-display mt-5 text-4xl font-bold leading-[1.12] text-[#0F172A] dark:text-white lg:text-[3.25rem]"
            >
              Industrial Wire Cutting Stripping{" "}
              <span className="text-[#0D5C3A] dark:text-emerald-400">
                Crimping &amp; Soldering Machinery
              </span>
            </motion.h1>

            {/* Sub-description */}
            <motion.p
              variants={fadeIn}
              className="mt-5 max-w-lg text-[17px] leading-relaxed text-[#475569] dark:text-slate-300"
            >
              {company.name} is a GST-registered trader and importer of precision
              wire harness processing machinery — supplying manufacturers across India since{" "}
              {company.founded}.
            </motion.p>

            {/* CTA buttons — solid primary + ghost secondary */}
            <motion.div variants={fadeIn} className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/enquiry"
                className="btn-lift inline-flex items-center gap-2 rounded-full bg-[#0D5C3A] px-7 py-3.5 text-sm font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                Request a Quotation
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/products"
                className="btn-lift inline-flex items-center gap-2 rounded-full border-2 border-[#0D5C3A] bg-transparent px-7 py-3.5 text-sm font-bold text-[#0D5C3A] hover:bg-[#ECFDF5] dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition-colors"
              >
                <FileText size={15} />
                View Catalogue
              </Link>
            </motion.div>

            {/* Trust badge strip with dividers */}
            <motion.div variants={fadeIn} className="mt-9">
              <div className="flex flex-wrap items-center gap-x-0 gap-y-3">
                {TRUST_BADGES.map(({ icon: Icon, label }, i) => (
                  <span key={label} className="flex items-center">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#334155] dark:text-slate-200 transition-colors hover:text-[#0D5C3A] dark:hover:text-emerald-400 px-3 first:pl-0">
                      <Icon size={13} className="text-[#10B981] shrink-0" />
                      {label}
                    </span>
                    {i < TRUST_BADGES.length - 1 && (
                      <span className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" aria-hidden />
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right column — Hero product carousel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-[#F8FAFC] to-[#F0FDF4] shadow-[0_20px_60px_-12px_rgba(15,23,42,0.1),0_4px_16px_-4px_rgba(13,92,58,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20">

              {/* Card header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <span className="text-[11px] font-bold tracking-widest text-[#0F172A] dark:text-slate-200 uppercase">
                    Featured Machine
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.series}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#0D5C3A] dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    {current.badge}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Product image — crossfade carousel */}
              <div className="relative flex h-72 items-center justify-center overflow-hidden bg-white dark:bg-slate-800/60 p-8 lg:h-80">
                {/* Ambient glow behind product */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-48 w-48 rounded-full bg-emerald-50 blur-3xl dark:bg-emerald-900/20" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.slug}
                    src={current.img}
                    alt={`${current.name} — ${current.series} by Zohan Enterprises`}
                    width={320}
                    height={320}
                    loading="eager"
                    fetchPriority="high"
                    {...heroImageAnim}
                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
                    style={{ maxHeight: "100%", objectPosition: "center" }}
                  />
                </AnimatePresence>
              </div>

              {/* Product info + CTA */}
              <div className="px-5 py-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.slug + "-info"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-[#0D5C3A] dark:text-emerald-400 uppercase">
                          {current.series}
                        </p>
                        <p className="mt-0.5 text-[15px] font-bold text-[#0F172A] dark:text-white leading-snug">
                          {current.name}
                        </p>
                        <p className="mt-1 text-[12px] text-[#64748B] dark:text-slate-400 leading-snug">
                          {current.tagline}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">from</p>
                        <p className="font-display text-lg font-bold text-[#0D5C3A] dark:text-emerald-400">
                          {current.price}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/product/${current.slug}`}
                      className="btn-lift mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] dark:bg-slate-100 py-2.5 text-[12px] font-bold text-white dark:text-slate-900 hover:bg-[#0D5C3A] dark:hover:bg-emerald-200 transition-colors group"
                    >
                      View Details
                      <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel dots + nav */}
              <div className="flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-800 px-5 py-3">
                {HERO_PRODUCTS.map((p, i) => (
                  <button
                    key={p.slug}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`View ${p.name}`}
                    className={`rounded-full transition-all duration-300 ${i === activeIdx
                      ? "w-6 h-2 bg-[#0D5C3A] dark:bg-emerald-400"
                      : "w-2 h-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail nav links — small row OUTSIDE main card */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {HERO_PRODUCTS.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => setActiveIdx(i)}
                  className={`group rounded-xl border p-2.5 text-left transition-all duration-200 ${i === activeIdx
                    ? "border-[#10B981]/60 bg-[#ECFDF5] dark:border-emerald-700/60 dark:bg-emerald-950/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-[#10B981]/40 dark:hover:border-emerald-700/40"
                    }`}
                >
                  <p className={`text-[10px] font-bold leading-snug transition-colors ${i === activeIdx
                    ? "text-[#0D5C3A] dark:text-emerald-400"
                    : "text-[#475569] dark:text-slate-400 group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400"
                    }`}>
                    {p.series}
                  </p>
                  <p className={`mt-0.5 text-[10px] font-semibold leading-snug transition-colors ${i === activeIdx
                    ? "text-[#0D5C3A] dark:text-emerald-300"
                    : "text-[#94A3B8] dark:text-slate-500"
                    }`}>
                    {p.price}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
