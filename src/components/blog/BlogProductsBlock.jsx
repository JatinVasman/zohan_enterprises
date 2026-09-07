import { Link } from 'react-router-dom';
import { getProductBySlug } from '../../data/products';
import { ShoppingBag, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function BlogProductsBlock({ productSlugs = [], title = "Featured Industrial Machinery" }) {
  if (!productSlugs || productSlugs.length === 0) return null;

  const products = productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean);

  if (products.length === 0) return null;

  return (
    <section
      id="related-machinery-block"
      aria-label="Related Industrial Machinery"
      className="my-10 p-6 sm:p-8 bg-slate-50/80 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border border-slate-200 dark:border-amber-500/30 rounded-3xl shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            Genuine Zohan Engineering
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Standard-compliant industrial wire and cable processing equipment featured in this article.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D5C3A] dark:text-amber-400 hover:text-emerald-700 dark:hover:text-amber-300 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          View Full Catalog (83+ Machines)
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            id={`product-card-${product.slug}`}
            className="group flex flex-col justify-between bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all duration-300 hover:border-emerald-500/50 dark:hover:border-amber-500/50 hover:shadow-xl dark:hover:shadow-amber-500/5 hover:-translate-y-0.5"
          >
            <div>
              {/* Image */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-3.5">
                <img
                  src={product.images && product.images[0] ? product.images[0] : product.image}
                  alt={product.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-white/95 border border-emerald-200 dark:text-emerald-400 dark:bg-slate-950/80 dark:border-emerald-500/40 rounded-full backdrop-blur-md shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Title & Price */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-medium text-emerald-700 dark:text-amber-400/90 uppercase tracking-wide">
                  {product.category}
                </span>
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                  {product.price}
                </span>
              </div>
              <h4 className="text-base font-bold text-[#0F172A] dark:text-white group-hover:text-[#0D5C3A] dark:group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                <Link to={`/product/${product.slug}`}>
                  {product.title}
                </Link>
              </h4>

              {/* Key Spec Snippet */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/80 rounded-lg p-2 space-y-1 border border-slate-100 dark:border-slate-800/80">
                  {product.specs.slice(0, 2).map((spec, idx) => (
                    <div key={idx} className="flex justify-between gap-2">
                      <span className="text-slate-500">{spec.label}:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-300 text-right truncate">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
              <Link
                to={`/product/${product.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#0D5C3A] hover:bg-emerald-700 dark:text-slate-950 dark:bg-amber-400 dark:hover:bg-amber-300 rounded-xl transition-all shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                View Machine
              </Link>
              <Link
                to={`/contact?product=${encodeURIComponent(product.title)}`}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0F172A] dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Get Quote
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
