import { Link } from "react-router-dom"
import { ArrowRight, Sparkles } from "lucide-react"
import ProductCardGrid from "../ProductCardGrid"

export default function LocationMachinery({ location, products }) {
  if (!products || products.length === 0) return null

  return (
    <section id="relevant-machinery" className="bg-[#F8FAF9] dark:bg-[#0B1120] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 mb-2">
              <Sparkles size={13} className="text-amber-500" />
              <span>Verified Zohan Machinery</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl">
              Recommended Industrial Machinery for {location.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              High-performance wire harness, crimping, stripping, and scrap recovery machines calibrated for manufacturing workshops and factories in {location.name}.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0D5C3A] dark:text-emerald-400 hover:underline shrink-0"
          >
            <span>View Full Machine Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCardGrid key={product.id || product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
