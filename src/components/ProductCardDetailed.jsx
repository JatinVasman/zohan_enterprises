import { Link } from "react-router-dom"
import { Phone, MessageSquareText, ArrowRight } from "lucide-react"
import { company } from "../data/content"
import { whatsappEnquiryUrl } from "../data/products"

export default function ProductCardDetailed({ product }) {
  const { name, category, price, unit, image, shortDescription, specifications, slug, isBestSeller } = product

  return (
    <div className="card-lift group flex flex-col rounded-sm border border-slate-200 bg-white shadow-card hover:border-[#10B981] hover:shadow-card-hover sm:flex-row dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/60">
      {/* Accent strip */}
      <div className="h-[3px] w-full shrink-0 bg-[#0D5C3A] transition-colors duration-300 group-hover:bg-[#10B981] sm:h-auto sm:w-[3px] dark:bg-emerald-500" />

      {/* Image */}
      <Link
        to={`/product/${slug}`}
        className="flex h-52 w-full shrink-0 items-center justify-center overflow-hidden border-b border-slate-200 bg-[#F8FAFC] p-6 sm:h-auto sm:w-52 sm:border-b-0 sm:border-r dark:border-slate-800 dark:bg-slate-800/80"
        aria-label={`View ${name}`}
      >
        <img
          src={image}
          alt={`${name} – buy from Zohan Enterprises`}
          className="h-full max-h-36 w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#0D5C3A] dark:text-emerald-400">
                {category}
              </span>
              {isBestSeller && (
                <span className="rounded-sm border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-bold uppercase text-[#0D5C3A] dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Best Seller
                </span>
              )}
            </div>
            <Link to={`/product/${slug}`}>
              <h3 className="mt-1.5 text-base font-bold leading-snug text-[#0F172A] dark:text-white transition-colors hover:text-[#0D5C3A] dark:hover:text-emerald-400">
                {name}
              </h3>
            </Link>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Price</p>
            <p className="font-display text-xl font-bold leading-tight text-[#0F172A] dark:text-white">{price}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">/ {unit}</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
          {shortDescription}
        </p>

        {/* Specs mini-table */}
        {(specifications || []).length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-0 border-t border-slate-100 dark:border-slate-800 pt-4 sm:grid-cols-2">
            {(specifications || []).slice(0, 6).map((spec) => (
              <div key={spec.label} className="flex items-baseline gap-2 border-b border-slate-50 dark:border-slate-800/60 py-1.5">
                <span className="w-32 shrink-0 text-[11px] font-semibold text-[#64748B] dark:text-slate-400">{spec.label}</span>
                <span className="text-[12px] font-semibold text-[#0F172A] dark:text-slate-200">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to={`/enquiry/${slug}`}
            className="btn-lift flex items-center gap-2 rounded-sm bg-[#0D5C3A] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <MessageSquareText size={14} />
            Get Latest Price
          </Link>
          <a
            href={whatsappEnquiryUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lift flex items-center gap-2 rounded-sm border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#0F172A] shadow-sm hover:border-slate-300 hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            WhatsApp
          </a>
          <a
            href={`tel:${company.phone}`}
            className="btn-lift flex items-center gap-2 rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#0F172A] shadow-sm hover:border-slate-300 hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Phone size={13} />
            Call
          </a>
          <Link
            to={`/product/${slug}`}
            className="group/link ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#0D5C3A] dark:text-emerald-400 hover:underline"
          >
            Details <ArrowRight size={13} className="transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
