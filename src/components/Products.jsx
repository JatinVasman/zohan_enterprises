import { motion } from "framer-motion"
import { ArrowRight, MessageSquareText, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { featuredProducts } from "../data/products"
import { company } from "../data/content"
import { SectionHeading } from "./Categories"

export default function Products() {
  // Show all 12 best sellers (4×3 grid on desktop)
  const displayed = featuredProducts.slice(0, 12)

  return (
    <section
      id="our-products"
      className="bg-white dark:bg-[#0B1120] py-20 transition-colors duration-200"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <SectionHeading
            eyebrow="Featured Products"
            title="Best-Selling Machinery"
            desc="Our most popular wire processing machines — trusted by manufacturers across India. View the full catalogue for all 100+ models."
          />
          <Link
            to="/products"
            className="group flex items-center gap-2 text-sm font-semibold text-[#0D5C3A] dark:text-emerald-400 transition-colors hover:text-[#0a472c] dark:hover:text-emerald-300"
          >
            View All Products
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-col × 3-row grid on desktop */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {displayed.map((p, i) => (
            <BestSellerCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {/* View all CTA banner */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/90 px-6 py-5 shadow-sm">
          <div>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">
              Browse all 100+ products across 20+ machine categories
            </p>
            <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
              Full specifications and pricing on the product listing page.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="btn-lift flex items-center gap-2 rounded-full bg-[#0D5C3A] px-5 py-2.5 text-xs font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              View Full Catalogue <ArrowRight size={13} />
            </Link>
            <a
              href={`tel:${company.phone}`}
              className="btn-lift flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-[#0F172A] dark:text-slate-100 hover:border-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 shadow-sm"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Unified Best Seller Card ─────────────────────────────────────────────
function BestSellerCard({ product, index }) {
  const { id, name, category, price, image, slug } = product

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.42, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="card-lift group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-card hover:border-[#10B981]/60 hover:shadow-card-hover dark:hover:border-emerald-500/50 overflow-hidden"
    >
      {/* Image area */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#F8FAFC] dark:bg-slate-800/60 p-6">
        {/* Best Seller badge — corner tag, not overlay number */}
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#0D5C3A] dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Star size={9} className="fill-[#10B981] text-[#10B981]" />
          Best Seller
        </span>

        <Link to={`/product/${slug}`} aria-label={`View ${name}`} className="flex h-full w-full items-center justify-center">
          <img
            src={image}
            alt={`${name} — buy from Zohan Enterprises, Noida`}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"
            style={{ objectPosition: "center" }}
            loading={index < 4 ? "eager" : "lazy"}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400">
          {category}
        </span>
        <Link to={`/product/${slug}`}>
          <h3 className="mt-1.5 text-[13px] font-bold leading-snug text-[#0F172A] dark:text-white transition-colors hover:text-[#0D5C3A] dark:hover:text-emerald-400 min-h-[2.8em]">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Indicative Price
          </p>
          <p className="font-display text-base font-bold text-[#0F172A] dark:text-white">
            {price}
          </p>
        </div>

        {/* Full-width CTA */}
        <Link
          to={`/enquiry/${slug}`}
          className="btn-lift mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D5C3A] py-2.5 text-[11px] font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
        >
          <MessageSquareText size={12} />
          Get Latest Price
        </Link>
      </div>
    </motion.div>
  )
}
