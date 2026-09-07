import { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2, MessageSquareText, Phone, ShieldCheck,
  Play, X, ChevronLeft, ChevronRight, ZoomIn, ExternalLink,
  Star, ArrowRight, ChevronDown, ChevronUp,
} from "lucide-react"
import { getProductBySlug, allProducts, whatsappEnquiryUrl } from "../data/products"
import { productVideos } from "../data/productVideos"
import { getYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from "../lib/youtube"
import { company } from "../data/content"
import { setMetaTag, injectJsonLd, removeJsonLd, setCanonical, SITE_URL } from "../lib/seo"
import Breadcrumb from "../components/Breadcrumb"

// ─── Gallery normaliser ─────────────────────────────────────────────────────
function buildGallery(product) {
  const items = []
  const seen  = new Set()
  for (const item of product.gallery || []) {
    const src = typeof item === "string" ? item : item.src
    if (src && !seen.has(src)) { seen.add(src); items.push({ type: "image", src }) }
  }
  if (product.image && !seen.has(product.image)) items.unshift({ type: "image", src: product.image })
  const videoUrl = productVideos[product.slug] || ""
  if (videoUrl && getYouTubeId(videoUrl)) items.push({ type: "youtube", url: videoUrl, title: `${product.name} — Demo Video` })
  return items
}

// ─── Video Modal ─────────────────────────────────────────────────────────────
function VideoModal({ url, title, onClose }) {
  const embedUrl = getYouTubeEmbedUrl(url)
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", h)
    document.body.style.overflow = "hidden"
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = "" }
  }, [onClose])
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute -top-11 right-0 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20">
            <X size={16} /> Close
          </button>
          <div className="relative aspect-video w-full bg-black shadow-2xl rounded-2xl overflow-hidden">
            <iframe src={embedUrl} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
          </div>
          {title && <p className="mt-3 text-center text-sm font-semibold text-white/60">{title}</p>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  const hasMultiple   = images.length > 1
  function prev(e) { e?.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length) }
  function next(e) { e?.stopPropagation(); setIdx((i) => (i + 1) % images.length) }
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next() }
    window.addEventListener("keydown", h)
    document.body.style.overflow = "hidden"
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = "" }
  }, [])
  const item = images[idx]
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95" onClick={onClose}>
      <button onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Close"><X size={20} /></button>
      {hasMultiple && <button onClick={prev} className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Previous"><ChevronLeft size={28} /></button>}
      <motion.img key={idx} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
        src={item.src} alt={`Product view ${idx + 1}`} className="max-h-[90vh] max-w-[88vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
      {hasMultiple && <button onClick={next} className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Next"><ChevronRight size={28} /></button>}
      {hasMultiple && <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-white/80">{idx + 1} / {images.length}</span>}
    </motion.div>
  )
}

// ─── Gallery Panel ───────────────────────────────────────────────────────────
function GalleryPanel({ gallery, productName }) {
  const [activeIdx,   setActiveIdx]   = useState(0)
  const [videoOpen,   setVideoOpen]   = useState(false)
  const [lightboxOpen,setLightboxOpen]= useState(false)
  const thumbsRef = useRef(null)
  const activeItem  = gallery[activeIdx] ?? gallery[0]
  const hasMultiple = gallery.length > 1
  const imageItems  = gallery.filter((g) => g.type === "image")

  function prev() { setActiveIdx((i) => (i - 1 + gallery.length) % gallery.length) }
  function next() { setActiveIdx((i) => (i + 1) % gallery.length) }

  useEffect(() => {
    if (!hasMultiple) return
    const h = (e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [hasMultiple])

  useEffect(() => {
    if (!thumbsRef.current || activeIdx === 0) return
    const btn = thumbsRef.current.children[activeIdx]
    if (!btn) return
    const container = thumbsRef.current
    const btnLeft = btn.offsetLeft
    const btnWidth = btn.offsetWidth
    const containerWidth = container.clientWidth
    container.scrollTo({
      left: btnLeft - containerWidth / 2 + btnWidth / 2,
      behavior: "smooth",
    })
  }, [activeIdx])

  const lightboxImages   = imageItems
  const lightboxStartIdx = activeItem?.type === "image" ? imageItems.findIndex((g) => g.src === activeItem.src) : 0

  return (
    <div className="flex flex-col gap-3">
      {/* Main viewer */}
      <div className="group relative flex h-[320px] items-center justify-center overflow-hidden rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 lg:h-[400px]">
        {activeItem?.type === "image" ? (
          <>
            <motion.img
              key={activeItem.src}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
              src={activeItem.src}
              alt={`${productName}, product image — Zohan Enterprises`}
              className="h-full w-full object-contain p-6"
              style={{ objectPosition: "center" }}
            />
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Open full screen"
            >
              <ZoomIn size={13} /> Enlarge
            </button>
          </>
        ) : (
          <div className="relative flex h-full w-full cursor-pointer items-center justify-center" onClick={() => setVideoOpen(true)}>
            {getYouTubeThumbnail(activeItem?.url) ? (
              <img src={getYouTubeThumbnail(activeItem.url)} alt={activeItem.title} className="h-full w-full object-cover rounded-2xl" />
            ) : (
              <div className="h-full w-full bg-[#0F172A] rounded-2xl" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 rounded-2xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0D5C3A] shadow-xl transition hover:bg-[#0a472c]">
                <Play size={28} className="ml-1 text-white" fill="white" />
              </div>
            </div>
            <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white">Watch Demo</span>
          </div>
        )}

        {/* Arrow nav */}
        {hasMultiple && (
          <>
            <button onClick={prev} className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md transition hover:bg-white dark:hover:bg-slate-800 dark:text-white" aria-label="Previous image"><ChevronLeft size={20} /></button>
            <button onClick={next} className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md transition hover:bg-white dark:hover:bg-slate-800 dark:text-white" aria-label="Next image"><ChevronRight size={20} /></button>
          </>
        )}
        {hasMultiple && (
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-0.5 text-[11px] font-semibold text-white">
            {activeIdx + 1} / {gallery.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
          {gallery.map((item, i) => {
            const isActive = i === activeIdx
            const thumbSrc = item.type === "youtube" ? getYouTubeThumbnail(item.url) : item.src
            return (
              <button
                key={i}
                onClick={() => { setActiveIdx(i); if (item.type === "youtube") setVideoOpen(true) }}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${isActive ? "border-[#0D5C3A] dark:border-emerald-500 shadow-sm" : "border-slate-200 dark:border-slate-700 hover:border-slate-400"}`}
                aria-label={item.type === "youtube" ? "Play demo video" : `View image ${i + 1}`}
              >
                {thumbSrc ? (
                  <img src={thumbSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800"><Play size={16} className="text-slate-400" /></div>
                )}
                {item.type === "youtube" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45"><Play size={14} className="text-white" fill="white" /></div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {videoOpen && activeItem?.type === "youtube" && (
          <VideoModal url={activeItem.url} title={activeItem.title} onClose={() => setVideoOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {lightboxOpen && imageItems.length > 0 && (
          <Lightbox images={lightboxImages} startIdx={Math.max(0, lightboxStartIdx)} onClose={() => setLightboxOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Trust badges ─────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  "GST Registered Supplier",
  "Factory Tested",
  "Pan India Delivery",
  "After-Sales Support",
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-[#0F172A] dark:text-white transition-colors hover:text-[#0D5C3A] dark:hover:text-emerald-400"
        aria-expanded={open}
      >
        {question}
        {open ? <ChevronUp size={16} className="shrink-0 text-[#0D5C3A] dark:text-emerald-400" /> : <ChevronDown size={16} className="shrink-0 text-slate-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed text-[#475569] dark:text-slate-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Related Products Carousel ─────────────────────────────────────────────
function RelatedCarousel({ products, categoryName, categorySlug }) {
  const scrollRef = useRef(null)
  function scrollBy(dir) {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" })
  }
  if (!products.length) return null
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-[#0F172A] dark:text-white">
          More in {categoryName}
        </h2>
        <div className="flex items-center gap-3">
          {/* Desktop arrows */}
          <div className="hidden items-center gap-1.5 lg:flex">
            <button onClick={() => scrollBy(-1)} aria-label="Scroll left" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#10B981]/60 hover:text-[#0D5C3A] dark:hover:border-emerald-600/60 dark:hover:text-emerald-400 transition-all shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Scroll right" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-[#10B981]/60 hover:text-[#0D5C3A] dark:hover:border-emerald-600/60 dark:hover:text-emerald-400 transition-all shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
          <Link to={`/products/${categorySlug}`} className="group flex items-center gap-1.5 text-sm font-semibold text-[#0D5C3A] dark:text-emerald-400 hover:underline transition-colors">
            View all <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="relative">
        {/* Fade mask at right edge */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8FAF9] dark:from-[#0B1120] to-transparent z-10" />
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
        >
          {products.map((p) => (
            <div key={p.id} className="shrink-0 w-52" style={{ scrollSnapAlign: "start" }}>
              <RelatedCard product={p} />
            </div>
          ))}
          {/* Peek card placeholder to hint scrollability */}
          <div className="w-8 shrink-0" aria-hidden />
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="card-lift group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-card hover:border-[#10B981]/60 hover:shadow-card-hover dark:hover:border-emerald-500/50 overflow-hidden h-full"
    >
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#F8FAFC] dark:bg-slate-800/60 p-4">
        <img
          src={product.image}
          alt={`${product.name}, front view`}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"
          style={{ objectPosition: "center" }}
          loading="lazy"
        />
      </div>
      <div className="p-3.5">
        <p className="line-clamp-2 text-[12px] font-bold leading-snug text-[#0F172A] dark:text-white transition-colors group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400">
          {product.name}
        </p>
        <p className="mt-1 text-[12px] font-bold text-[#0D5C3A] dark:text-emerald-400">{product.price}</p>
      </div>
    </Link>
  )
}

// ─── Main Product Detail Page ─────────────────────────────────────────────────
export default function ProductDetail() {
  const { productSlug } = useParams()
  const product         = getProductBySlug(productSlug)

  // Scroll to top on product page load or switch
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [productSlug])

  // ── SEO ──
  useEffect(() => {
    if (!product) return
    const prevTitle = document.title
    const canonicalUrl = `${SITE_URL}/product/${product.slug}`
    const title = `${product.name} | ${product.category} | Zohan Enterprises`
    const desc  = `Buy ${product.name} at ${product.price} from Zohan Enterprises, Noida. ${product.shortDescription}`

    document.title = title
    setCanonical(canonicalUrl)
    setMetaTag("description", desc)
    setMetaTag("og:title",       title,          "property")
    setMetaTag("og:description", desc,           "property")
    setMetaTag("og:type",        "product",      "property")
    setMetaTag("og:image",       product.image,  "property")
    setMetaTag("og:url",         canonicalUrl,   "property")
    setMetaTag("twitter:card",   "summary_large_image")
    setMetaTag("twitter:title",  title)
    setMetaTag("twitter:description", desc)

    // ── Product JSON-LD (with SKU from model number) ──
    const priceNum = product.price.replace(/[^\d]/g, "")
    const modelMatch = product.name.match(/\bZE[-\w]+\b/i)
    const sku = modelMatch ? modelMatch[0] : product.slug

    injectJsonLd("product-schema", {
      "@context": "https://schema.org",
      "@type":    "Product",
      name:       product.name,
      sku,
      image: [
        product.image,
        ...(product.gallery || []).map((g) => (typeof g === "string" ? g : g.src)).filter(Boolean),
      ],
      description: product.description || product.shortDescription,
      brand: {
        "@type": "Brand",
        name:    "Zohan Enterprises",
        url:     SITE_URL,
      },
      offers: {
        "@type":        "Offer",
        priceCurrency:  "INR",
        price:          priceNum || "0",
        availability:   "https://schema.org/InStock",
        url:            canonicalUrl,
        seller: {
          "@type":   "Organization",
          name:      "Zohan Enterprises",
          address:   company.address,
          url:       SITE_URL,
        },
      },
    })

    // ── BreadcrumbList JSON-LD ──
    injectJsonLd("breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type":    "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: product.category, item: `${SITE_URL}/products/${product.categorySlug}` },
        { "@type": "ListItem", position: 3, name: product.name, item: canonicalUrl },
      ],
    })

    return () => {
      document.title = prevTitle
      removeJsonLd("product-schema")
      removeJsonLd("breadcrumb-schema")
      removeJsonLd("product-faq-schema")
    }
  }, [product])

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center lg:px-10">
        <p className="text-lg font-semibold text-[#0F172A] dark:text-white">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-sm text-[#0D5C3A] dark:text-emerald-400 hover:underline">← Back to all products</Link>
      </div>
    )
  }

  const gallery = buildGallery(product)
  const related = allProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 6)

  // Generate FAQs (3 generic + context-specific)
  const faqs = [
    {
      question: `What is the price of ${product.name}?`,
      answer:   `The indicative price of ${product.name} is ${product.price} per ${product.unit || "piece"}. Prices are subject to change and GST is applicable extra. Contact Zohan Enterprises for a confirmed quote.`,
    },
    {
      question: "Do you offer pan-India delivery?",
      answer:   "Yes. Zohan Enterprises delivers across all 28+ states in India via reputed logistics partners. Delivery timelines and freight charges depend on location and order size.",
    },
    {
      question: "Is after-sales technical support available?",
      answer:   "Yes. Our dedicated technical team provides installation guidance, operator training and after-sales support via phone and WhatsApp for all machines supplied.",
    },
    {
      question: `Can I get a GST invoice for ${product.name}?`,
      answer:   `Absolutely. Zohan Enterprises is a GST-registered trader (GST No. ${company.gstNo}). All purchases include a proper GST invoice for input tax credit.`,
    },
  ]

  // ── Inject FAQPage JSON-LD ──
  injectJsonLd("product-faq-schema", {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type":  "Question",
      name:     f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text:    f.answer,
      },
    })),
  })

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: product.category, to: `/products/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      {/* pb-24 on mobile to clear sticky action bar */}
      <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0B1120] py-8 pb-24 lg:pb-12 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">

          {/* ── Main 2-col layout: Gallery left, sticky panel right ── */}
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">

            {/* ── Left: Gallery ── */}
            <div>
              {/* Product image gallery */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-card">
                <GalleryPanel gallery={gallery} productName={product.name} />
              </div>

              {/* ── Content sections below gallery ── */}

              {/* Overview */}
              <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-7 shadow-card">
                <h2 className="font-display text-lg font-bold text-[#0F172A] dark:text-white">
                  Overview
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                  {product.description || product.shortDescription}
                </p>
              </div>

              {/* Key Specifications */}
              {(product.specifications || []).length > 0 && (
                <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-card">
                  <div className="border-b border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/60 px-7 py-4">
                    <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                      Key Specifications
                    </h2>
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr
                          key={spec.label}
                          className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60 ${i % 2 === 0 ? "bg-white dark:bg-slate-900/90" : "bg-[#F8FAFC] dark:bg-slate-800/30"}`}
                        >
                          <td className="w-48 px-7 py-3 font-medium text-[#64748B] dark:text-slate-400">{spec.label}</td>
                          <td className="px-7 py-3 font-semibold text-[#0F172A] dark:text-slate-200">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="border-t border-slate-100 dark:border-slate-800 px-7 py-3 text-[11px] text-slate-400">
                    * Specifications are indicative. Contact us for confirmed technical datasheet.
                  </p>
                </div>
              )}

              {/* Features */}
              {(product.features || []).length > 0 && (
                <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-7 shadow-card">
                  <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white mb-4">
                    Features
                  </h2>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-[#475569] dark:text-slate-300">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#10B981]" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FAQs */}
              <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-7 py-5 shadow-card">
                <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white mb-2">
                  Frequently Asked Questions
                </h2>
                {faqs.map((faq) => (
                  <FAQ key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>

              {/* GST notice */}
              <div className="mt-5 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-5 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/40">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#0D5C3A] dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-bold text-[#0F172A] dark:text-white">GST Registered Trader</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-300">
                      Zohan Enterprises is a verified GST and IEC-registered trader. All invoices include full GST details for input tax credit.
                    </p>
                    <p className="mt-2 text-[11px] font-semibold text-[#0D5C3A] dark:text-emerald-400">
                      GST No. {company.gstNo} &middot; IEC: {company.iec}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Sticky action panel ── */}
            <div
              className="hidden lg:block"
              style={{
                position:  "sticky",
                top:       "calc(var(--nav-height, 72px) + 1.5rem)",
                alignSelf: "start",
              }}
            >
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08),0_1px_8px_-2px_rgba(13,92,58,0.05)]">

                {/* Category + name + badge */}
                <div className="border-b border-slate-100 dark:border-slate-800 p-6 pb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400">
                      {product.category}
                    </span>
                    {product.isBestSeller && (
                      <span className="flex items-center gap-1 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#0D5C3A] dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <Star size={9} className="fill-[#10B981] text-[#10B981]" /> Best Seller
                      </span>
                    )}
                  </div>
                  <h1 className="font-display mt-2 text-xl font-bold leading-snug text-[#0F172A] dark:text-white">
                    {product.name}
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300 line-clamp-3">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Price block */}
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Indicative Price</p>
                  <p className="font-display mt-1 text-3xl font-bold text-[#0F172A] dark:text-white">{product.price}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    per {product.unit || "piece"} &middot; GST extra &middot; subject to change
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2.5 p-6 pt-5">
                  <Link
                    to={`/enquiry/${product.slug}`}
                    className="btn-lift flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D5C3A] py-3 text-sm font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    <MessageSquareText size={16} /> Get Latest Price
                  </Link>
                  <a
                    href={whatsappEnquiryUrl(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-lift flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 text-sm font-bold text-[#0F172A] dark:text-slate-100 hover:border-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 shadow-sm"
                  >
                    <ExternalLink size={14} className="text-[#25D366]" /> WhatsApp Enquiry
                  </a>
                  <a
                    href={`tel:${company.phone}`}
                    className="btn-lift flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 text-sm font-bold text-[#0F172A] dark:text-slate-100 hover:border-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 shadow-sm"
                  >
                    <Phone size={14} className="text-[#0D5C3A] dark:text-emerald-400" /> {company.phone}
                  </a>
                </div>

                {/* Trust badges */}
                <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    {TRUST_BADGES.map((t) => (
                      <span key={t} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#334155] dark:text-slate-300">
                        <CheckCircle2 size={12} className="shrink-0 text-[#10B981]" /> {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-500">
                    Price is indicative. Confirmed quote within 2–4 hrs on enquiry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related Products Carousel (Section 7) ── */}
          <RelatedCarousel
            products={related}
            categoryName={product.category}
            categorySlug={product.categorySlug}
          />
        </div>
      </div>

      {/* ── Mobile Sticky Action Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 flex gap-2.5 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)] lg:hidden">
        <Link
          to={`/enquiry/${product.slug}`}
          className="btn-lift flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0D5C3A] py-3 text-[12px] font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600"
        >
          <MessageSquareText size={14} /> Get Latest Price
        </Link>
        <a
          href={whatsappEnquiryUrl(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lift flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-[12px] font-bold text-[#0F172A] dark:text-slate-100 shadow-sm"
        >
          WhatsApp
        </a>
        <a
          href={`tel:${company.phone}`}
          className="btn-lift flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-3 text-[#0D5C3A] dark:text-emerald-400 shadow-sm"
          aria-label={`Call ${company.phone}`}
        >
          <Phone size={16} />
        </a>
      </div>
    </>
  )
}
