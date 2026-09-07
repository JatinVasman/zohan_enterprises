/**
 * ProductCardGrid — unified grid-view card
 * Used by: Best Sellers, ProductList grid view, Related Products carousel
 * Maintains consistent: 4:3 image ratio, 16px radius, same hover shadow/lift,
 * same padding, same corner badge style.
 */
import { Link } from "react-router-dom"
import { MessageSquareText, Star } from "lucide-react"

export default function ProductCardGrid({ product, className = "", lazyLoad = true }) {
  const { name, category, price, image, slug, isBestSeller } = product

  return (
    <div
      className={`card-lift group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-card hover:border-[#10B981]/60 hover:shadow-card-hover dark:hover:border-emerald-500/50 overflow-hidden ${className}`}
    >
      {/* Image */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#F8FAFC] dark:bg-slate-800/60 p-5">
        {isBestSeller && (
          <span className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#0D5C3A] dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Star size={9} className="fill-[#10B981] text-[#10B981]" />
            Best Seller
          </span>
        )}
        <Link to={`/product/${slug}`} aria-label={`View ${name}`} className="flex h-full w-full items-center justify-center">
          <img
            src={image}
            alt={`${name} — Zohan Enterprises, Noida`}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"
            style={{ objectPosition: "center" }}
            loading={lazyLoad ? "lazy" : "eager"}
          />
        </Link>
      </div>

      {/* Body */}
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
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Indicative Price</p>
          <p className="font-display text-base font-bold text-[#0F172A] dark:text-white">{price}</p>
        </div>

        {/* CTA — full width */}
        <Link
          to={`/enquiry/${slug}`}
          className="btn-lift mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D5C3A] py-2.5 text-[11px] font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
        >
          <MessageSquareText size={12} />
          Get Latest Price
        </Link>
      </div>
    </div>
  )
}
