import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Mail, Menu, Phone, Search, X, Moon, Sun, ArrowRight } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { company } from "../data/content"
import { categoryMeta, allProducts } from "../data/products"
import { searchLocations } from "../data/locations/engine"
import { searchArticles } from "../data/blog"
import { useTheme } from "../context/ThemeContext"
import logo from "../assets/logo.png"

// ─── Navigation links config ────────────────────────────────────────────────
const navLinks = [
  { label: "Home",     to: "/",         isRoute: true  },
  { label: "About Us", to: "/about",    isRoute: true  },
  { label: "Products", to: "/products", isRoute: true, hasDropdown: true },
  { label: "Blogs",    to: "/blog",     isRoute: true  },
  { label: "Contact",  to: "/contact",  isRoute: true  },
]

// Dropdown animation
const dropdownAnim = {
  initial:  { opacity: 0, y: 8, scale: 0.97 },
  animate:  { opacity: 1, y: 0, scale: 1 },
  exit:     { opacity: 0, y: 4, scale: 0.97 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
}

// Mobile drawer animation
const drawerAnim = {
  initial:  { opacity: 0, y: -8, scale: 0.98 },
  animate:  { opacity: 1, y: 0, scale: 1 },
  exit:     { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
}

// ─── Search logic ────────────────────────────────────────────────────────────
function useSearch(query) {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || q.length < 2) return []

    const productHits = allProducts
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.series && p.series.toLowerCase().includes(q))
      )
      .slice(0, 3)
      .map((p) => ({ type: "product", label: p.name, sub: p.category, img: p.image, slug: `/product/${p.slug}` }))

    const blogHits = searchArticles(q)
      .slice(0, 2)
      .map((art) => ({
        type: "blog",
        label: art.title,
        sub: `Guide · ${art.category}`,
        img: art.featuredImage,
        slug: `/blog/${art.slug}`,
      }))

    const catHits = categoryMeta
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 2)
      .map((c) => ({ type: "category", label: c.name, sub: "Browse category", img: c.image, slug: `/products/${c.slug}` }))

    const locHits = searchLocations(q)
      .slice(0, 2)
      .map((loc) => ({
        type: "location",
        label: `${loc.name}, ${loc.state}`,
        sub: `${loc.state} &middot; Industrial Machinery in ${loc.name}`,
        img: null,
        slug: `/industrial-machinery/${loc.slug}`,
      }))

    // Combine results
    const results = [...productHits, ...blogHits, ...catHits, ...locHits]
    return results.slice(0, 6)
  }, [query])
}

// ─── Search Dropdown ─────────────────────────────────────────────────────────
function SearchDropdown({ results, query, onSelect }) {
  if (!results.length && query.trim().length >= 2) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_20px_60px_-12px_rgba(15,23,42,0.18)] overflow-hidden">
        <p className="px-4 py-5 text-sm text-center text-slate-400">
          No results for "<span className="font-semibold text-[#0F172A] dark:text-slate-200">{query}</span>"
        </p>
      </div>
    )
  }
  if (!results.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_20px_60px_-12px_rgba(15,23,42,0.18)] overflow-hidden"
    >
      <p className="px-4 pt-3 pb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Results</p>
      {results.map((r, i) => (
        <Link
          key={r.slug + i}
          to={r.slug}
          onClick={onSelect}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors group"
        >
          {r.img && (
            <div className="h-9 w-9 shrink-0 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              <img src={r.img} alt="" className="h-full w-full object-contain" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-tight truncate group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400 transition-colors">
              {r.label}
            </p>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5 truncate">{r.sub}</p>
          </div>
          <ArrowRight size={13} className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400 transition-colors" />
        </Link>
      ))}
      <Link
        to={`/products?q=${encodeURIComponent(query)}`}
        onClick={onSelect}
        className="flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-800 px-4 py-3 text-xs font-bold text-[#0D5C3A] dark:text-emerald-400 hover:bg-[#ECFDF5] dark:hover:bg-emerald-950/30 transition-colors"
      >
        View all results for "{query}" <ArrowRight size={12} />
      </Link>
    </motion.div>
  )
}

// ─── Main Header ─────────────────────────────────────────────────────────────
export default function Header() {
  const [scrolled,       setScrolled]       = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [productsOpen,   setProductsOpen]   = useState(false)
  const [searchFocused,  setSearchFocused]  = useState(false)
  const [searchQuery,    setSearchQuery]    = useState("")
  const [mobileQuery,    setMobileQuery]    = useState("")
  const { isDark, toggleTheme } = useTheme()
  const location  = useLocation()
  const navigate  = useNavigate()
  const searchRef = useRef(null)
  const searchWrapRef = useRef(null)

  const results       = useSearch(searchQuery)
  const mobileResults = useSearch(mobileQuery)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setProductsOpen(false)
    setSearchFocused(false)
    setSearchQuery("")
    setMobileQuery("")
  }, [location])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // iOS-safe scroll lock when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return
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
  }, [mobileOpen])

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Keyboard: Escape closes search
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === "Escape") { setSearchFocused(false); setSearchQuery("") }
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchFocused(false)
      setSearchQuery("")
    }
  }, [searchQuery, navigate])

  const handleSelect = useCallback(() => {
    setSearchFocused(false)
    setSearchQuery("")
    setMobileQuery("")
  }, [])

  const handleLogoClick = useCallback((e) => {
    e.preventDefault()
    setMobileOpen(false)
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      navigate("/")
    }
  }, [location.pathname, navigate])

  const pillBase = [
    "fixed top-4 left-4 right-4 z-50",
    "rounded-full",
    "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
  ].join(" ")

  const pillBg = scrolled
    ? "bg-white/95 dark:bg-slate-900/97 backdrop-blur-xl shadow-pill-nav border border-slate-200/70 dark:border-slate-800/70"
    : "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/40 dark:border-slate-800/40 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.07)]"

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/"
    return location.pathname.startsWith(to)
  }

  return (
    <>
      <header className={`${pillBase} ${pillBg}`}>
        <div className="flex items-center gap-2 px-3 py-2 lg:px-4">

          {/* ── Logo ── */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-95 mr-2 cursor-pointer"
          >
            <img
              src={logo}
              alt={`${company.name} logo`}
              className="h-11 w-11 sm:h-12 sm:w-12 object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="leading-tight">
              <p className="font-display text-base sm:text-[17px] font-extrabold text-[#0F172A] dark:text-white leading-tight tracking-tight">
                {company.name}
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#0D5C3A] font-bold dark:text-emerald-400 leading-tight uppercase tracking-wider">
                Industrial Machinery
              </p>
            </div>
          </a>

          {/* ── Desktop nav links (centre) ── */}
          <nav className="hidden lg:flex items-center gap-0.5 mx-auto">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <Link
                    to={link.to}
                    className={`relative flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      isActive(link.to)
                        ? "bg-[#ECFDF5] text-[#0D5C3A] dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "text-[#334155] dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-[#0D5C3A] dark:hover:text-emerald-400"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                    />
                  </Link>

                  <AnimatePresence>
                    {productsOpen && (
                      <motion.div
                        {...dropdownAnim}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[560px] grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white/98 dark:bg-slate-900/98 dark:border-slate-700 p-3 shadow-[0_20px_60px_-12px_rgba(15,23,42,0.18),0_8px_24px_-6px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                      >
                        <Link
                          to="/products"
                          className="col-span-2 mb-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-3 py-2 text-[11px] font-bold tracking-wider text-[#0F172A] dark:text-slate-200 uppercase transition-colors hover:text-[#0D5C3A] dark:hover:text-emerald-400"
                          onClick={() => setProductsOpen(false)}
                        >
                          <span>All Products</span>
                          <span className="text-[#0D5C3A] dark:text-emerald-400">→</span>
                        </Link>
                        {categoryMeta.slice(0, 8).map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/products/${cat.slug}`}
                            onClick={() => setProductsOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#475569] dark:text-slate-300 transition-all duration-150 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/60 hover:text-[#0D5C3A] dark:hover:text-emerald-400"
                          >
                            <img
                              src={cat.image}
                              alt=""
                              className="h-7 w-7 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
                            />
                            <span className="font-medium leading-tight text-[13px]">{cat.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-[#ECFDF5] text-[#0D5C3A] dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "text-[#334155] dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-[#0D5C3A] dark:hover:text-emerald-400"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* ── Desktop right actions ── */}
          <div className="hidden lg:flex items-center gap-1.5 ml-auto">

            {/* ── Always-visible Search bar ── */}
            <div ref={searchWrapRef} className="relative">
              <motion.div
                animate={{ width: searchFocused ? 260 : 160 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 overflow-hidden transition-colors duration-200 ${
                  searchFocused
                    ? "border-[#10B981]/50 bg-[#ECFDF5] dark:bg-emerald-950/40 dark:border-emerald-800/60"
                    : "border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                }`}
                onClick={() => { if (!searchFocused) { setSearchFocused(true); searchRef.current?.focus() } }}
              >
                <Search
                  size={13}
                  className={`shrink-0 transition-colors ${searchFocused ? "text-[#0D5C3A] dark:text-emerald-400" : "text-slate-400"}`}
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search machines…"
                  className="w-full bg-transparent text-[12px] text-[#0F172A] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSearchQuery(""); searchRef.current?.focus() }}
                    className="shrink-0 text-slate-400 hover:text-[#0D5C3A] dark:hover:text-emerald-400 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </motion.div>

              {/* Desktop search results dropdown */}
              <AnimatePresence>
                {searchFocused && (
                  <SearchDropdown
                    results={results}
                    query={searchQuery}
                    onSelect={handleSelect}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                isDark
                  ? "bg-slate-800 text-amber-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#0D5C3A]"
              }`}
            >
              <motion.span
                key={isDark ? "moon" : "sun"}
                initial={{ scale: 0.5, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </motion.span>
            </button>

            {/* Call Now */}
            <a
              href={`tel:${company.phone}`}
              className="btn-lift flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-[12px] font-semibold text-[#0F172A] dark:text-slate-200 shadow-sm hover:border-[#10B981]/60 hover:text-[#0D5C3A] dark:hover:border-emerald-600/60 dark:hover:text-emerald-400 transition-all"
            >
              <Phone size={12} className="text-[#10B981]" />
              Call Now
            </a>

            {/* Contact Us */}
            <Link
              to="/contact"
              className="btn-lift flex items-center gap-1.5 rounded-full bg-[#0D5C3A] dark:bg-emerald-600 px-4 py-1.5 text-[12px] font-bold text-white shadow-cta hover:bg-[#0a472c] dark:hover:bg-emerald-700 transition-all"
            >
              <Mail size={12} />
              Contact Us
            </Link>
          </div>

          {/* ── Mobile right ── */}
          <div className="flex items-center gap-1.5 ml-auto lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                isDark
                  ? "bg-slate-800 text-amber-400"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                mobileOpen
                  ? "bg-[#ECFDF5] text-[#0D5C3A] dark:bg-emerald-950/50 dark:text-emerald-400"
                  : "bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-slate-200"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ scale: 0.7, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.7, rotate: 20, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              {...drawerAnim}
              className="lg:hidden mt-2 mx-2 mb-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl shadow-[0_16px_48px_-8px_rgba(15,23,42,0.18)] overflow-hidden"
            >
              {/* Mobile search with live results */}
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className={`flex items-center gap-2.5 rounded-full border px-3.5 py-2 transition-colors ${
                  mobileQuery
                    ? "border-[#10B981]/40 bg-[#ECFDF5] dark:bg-emerald-950/40 dark:border-emerald-800/50"
                    : "border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800"
                }`}>
                  <Search size={14} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    value={mobileQuery}
                    onChange={(e) => setMobileQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && mobileQuery.trim()) {
                        navigate(`/products?q=${encodeURIComponent(mobileQuery.trim())}`)
                        setMobileOpen(false)
                      }
                    }}
                    placeholder="Search machines…"
                    className="w-full bg-transparent text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  {mobileQuery && (
                    <button onClick={() => setMobileQuery("")} className="shrink-0 text-slate-400">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Mobile inline results */}
                {mobileQuery.trim().length >= 2 && (
                  <div className="mt-2 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {mobileResults.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-center text-slate-400">No results for "{mobileQuery}"</p>
                    ) : (
                      <>
                        {mobileResults.map((r, i) => (
                          <Link
                            key={r.slug + i}
                            to={r.slug}
                            onClick={handleSelect}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800 last:border-b-0 transition-colors"
                          >
                            {r.img && (
                              <div className="h-8 w-8 shrink-0 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                <img src={r.img} alt="" className="h-full w-full object-contain" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">{r.label}</p>
                              <p className="text-[10px] text-slate-400 truncate">{r.sub}</p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          to={`/products?q=${encodeURIComponent(mobileQuery)}`}
                          onClick={handleSelect}
                          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#0D5C3A] dark:text-emerald-400 border-t border-slate-100 dark:border-slate-800 hover:bg-[#ECFDF5] dark:hover:bg-emerald-950/30 transition-colors"
                        >
                          See all results <ArrowRight size={11} />
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Nav items */}
              <nav className="px-3 py-3 flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-4 py-2.5 rounded-xl text-[15px] font-semibold transition-all ${
                      isActive(link.to)
                        ? "bg-[#ECFDF5] text-[#0D5C3A] dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "text-[#0F172A] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#0D5C3A] dark:hover:text-emerald-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile action buttons */}
              <div className="px-4 pb-4 pt-1 flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-sm font-bold text-[#0F172A] dark:text-slate-100"
                >
                  <Phone size={14} className="text-[#10B981]" />
                  {company.phone}
                </a>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#0D5C3A] dark:bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-cta"
                >
                  <Mail size={14} />
                  Contact Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
