import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { LayoutGrid, List, SlidersHorizontal, ChevronDown } from "lucide-react"
import { allProducts, categoryMeta, getProductsByCategory } from "../data/products"
import { setMetaTag, setCanonical, injectJsonLd, removeJsonLd, SITE_URL } from "../lib/seo"
import ProductSidebar, { MobileFilterDrawer } from "../components/ProductSidebar"
import ProductCardDetailed from "../components/ProductCardDetailed"
import ProductCardGrid from "../components/ProductCardGrid"
import Breadcrumb from "../components/Breadcrumb"
import { company } from "../data/content"

// Sort options
const SORT_OPTIONS = [
  { value: "default",    label: "Best Selling"   },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
]

function extractPrice(priceStr = "") {
  const n = priceStr.replace(/[^\d]/g, "")
  return n ? parseInt(n, 10) : 0
}

export default function ProductList() {
  const { categorySlug } = useParams()

  const [view, setView]       = useState("grid")   // "grid" | "list"
  const [sort, setSort]       = useState("default")
  const [sortOpen, setSortOpen]   = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const activeCat  = categoryMeta.find((c) => c.slug === categorySlug)
  const rawProducts = categorySlug ? getProductsByCategory(categorySlug) : allProducts

  // Sort
  const products = useMemo(() => {
    const arr = [...rawProducts]
    if (sort === "price-asc")  arr.sort((a, b) => extractPrice(a.price) - extractPrice(b.price))
    if (sort === "price-desc") arr.sort((a, b) => extractPrice(b.price) - extractPrice(a.price))
    // default = best-seller first
    if (sort === "default") arr.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
    return arr
  }, [rawProducts, sort])

  // ── SEO ──
  useEffect(() => {
    const prevTitle = document.title
    const title = activeCat
      ? `${activeCat.name} | Industrial Machinery | Zohan Enterprises`
      : "All Industrial Wire Processing Machinery | Zohan Enterprises"
    const desc = activeCat
      ? `Browse ${products.length} ${activeCat.name} model${products.length !== 1 ? "s" : ""} at Zohan Enterprises, Noida. Best prices, factory support and pan-India delivery.`
      : `Browse ${allProducts.length} wire processing machines at Zohan Enterprises, Noida — crimping, stripping, soldering, twisting and more. Pan-India delivery with 100% pre-testing.`
    const canonicalUrl = activeCat
      ? `${SITE_URL}/products/${activeCat.slug}`
      : `${SITE_URL}/products`

    document.title = title
    setCanonical(canonicalUrl)
    setMetaTag("description", desc)
    setMetaTag("og:title", title, "property")
    setMetaTag("og:description", desc, "property")
    setMetaTag("og:url", canonicalUrl, "property")
    setMetaTag("og:type", "website", "property")
    setMetaTag("twitter:title", title)
    setMetaTag("twitter:description", desc)

    // BreadcrumbList + CollectionPage JSON-LD
    const breadcrumbItems = activeCat
      ? [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'All Products', item: `${SITE_URL}/products` },
          { '@type': 'ListItem', position: 3, name: activeCat.name, item: canonicalUrl },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'All Products', item: `${SITE_URL}/products` },
        ]

    injectJsonLd('product-list-schema', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${canonicalUrl}#page`,
          url: canonicalUrl,
          name: title,
          description: desc,
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        },
      ],
    })

    return () => {
      document.title = prevTitle
      removeJsonLd('product-list-schema')
    }
  }, [activeCat, products.length])

  const breadcrumbItems = activeCat
    ? [
        { label: "Home", to: "/" },
        { label: "All Products", to: "/products" },
        { label: activeCat.name },
      ]
    : [
        { label: "Home", to: "/" },
        { label: "All Products" },
      ]

  const currentSort = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0]

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0B1120] py-8 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">

          {/* ── Page heading ── */}
          <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white lg:text-3xl">
                  {activeCat ? activeCat.name : "All Products"}
                </h1>
                <p className="mt-1.5 text-sm text-[#64748B] dark:text-slate-400">
                  <span className="font-semibold text-[#0F172A] dark:text-white">{products.length}</span>{" "}
                  product{products.length !== 1 ? "s" : ""} listed
                  {activeCat && (
                    <> — <Link to="/products" className="text-[#0D5C3A] dark:text-emerald-400 hover:underline">View all categories</Link></>
                  )}
                </p>
              </div>

              {/* Controls: sort + view toggle + mobile filter */}
              <div className="flex items-center gap-2">
                {/* Mobile Filter button — hidden on xl+ where sidebar shows */}
                <button
                  onClick={() => setFilterOpen(true)}
                  className="xl:hidden flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-slate-200 shadow-sm hover:border-[#10B981]/60 hover:text-[#0D5C3A] transition-all"
                  aria-label="Open category filter"
                >
                  <SlidersHorizontal size={13} className="text-[#0D5C3A]" />
                  Filters
                  {categorySlug && (
                    <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0D5C3A] text-[9px] font-bold text-white">1</span>
                  )}
                </button>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                  >
                    <SlidersHorizontal size={13} className="text-slate-400" />
                    {currentSort.label}
                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full z-20 mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSort(opt.value); setSortOpen(false) }}
                          className={`flex w-full items-center px-4 py-2.5 text-sm font-semibold transition-colors ${
                            sort === opt.value
                              ? "bg-[#ECFDF5] text-[#0D5C3A] dark:bg-emerald-950/50 dark:text-emerald-300"
                              : "text-[#475569] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#0D5C3A] dark:hover:text-emerald-400"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View toggle */}
                <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`flex h-9 w-9 items-center justify-center transition-colors ${
                      view === "grid"
                        ? "bg-[#0D5C3A] text-white dark:bg-emerald-600"
                        : "bg-white dark:bg-slate-800 text-slate-400 hover:text-[#0D5C3A] dark:hover:text-emerald-400"
                    }`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`flex h-9 w-9 items-center justify-center border-l border-slate-200 dark:border-slate-700 transition-colors ${
                      view === "list"
                        ? "bg-[#0D5C3A] text-white dark:bg-emerald-600"
                        : "bg-white dark:bg-slate-800 text-slate-400 hover:text-[#0D5C3A] dark:hover:text-emerald-400"
                    }`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Category filter chips — horizontally scrollable, never causes page scroll ── */}
            <div className="mt-4 scroll-fade-x-wrap">
              <div className="scroll-fade-x flex gap-2 pb-1">
                {/* "All" chip */}
                <Link
                  to="/products"
                  className={`cat-chip shrink-0 ${!categorySlug ? "active" : ""}`}
                >
                  All
                  <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                    {allProducts.length}
                  </span>
                </Link>

                {categoryMeta.map((cat) => {
                  const count = allProducts.filter((p) => p.categorySlug === cat.slug).length
                  const label = cat.name.replace(" Machine", "").replace(" Machinery", "")
                  return (
                    <Link
                      key={cat.slug}
                      to={`/products/${cat.slug}`}
                      className={`cat-chip shrink-0 ${cat.slug === categorySlug ? "active" : ""}`}
                    >
                      {label}
                      <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                        {count}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile filter drawer */}
          <MobileFilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

          <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
            <ProductSidebar />

            <main className="min-w-0 flex-1">
              {products.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-12 text-center shadow-card">
                  <p className="text-sm text-slate-500 dark:text-slate-400">No products found in this category.</p>
                  <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-[#0D5C3A] dark:text-emerald-400 hover:underline">
                    View all products →
                  </Link>
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCardGrid key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {products.map((product, i) => (
                    <ProductCardDetailed key={product.id} product={product} index={i} />
                  ))}
                </div>
              )}

              {/* Bottom enquiry band */}
              <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-6 py-5 shadow-card sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
                    Looking for a custom specification or bulk order?
                  </p>
                  <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
                    Contact us directly for OEM pricing and technical datasheets.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/contact"
                    className="btn-lift flex items-center gap-2 rounded-full bg-[#0D5C3A] px-5 py-2.5 text-xs font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    Send Enquiry
                  </Link>
                  <a
                    href={`tel:${company.phone}`}
                    className="btn-lift flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-[#0F172A] dark:text-slate-100 hover:border-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 shadow-sm"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
