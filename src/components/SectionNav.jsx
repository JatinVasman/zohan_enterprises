import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * SectionNav — ChatGPT-style floating right-rail section navigator.
 * Props:
 *   sections: Array<{ id: string, label: string }>
 *   navHeight: number  (px offset of sticky header, default 80)
 */
export default function SectionNav({ sections, navHeight = 80 }) {
  const [active, setActive] = useState(sections[0]?.id ?? "")
  const [hovered, setHovered] = useState(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)

    if (!els.length) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (!visible.length) return
        // Pick the entry whose top is closest to the top of the viewport
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        )
        setActive(topmost.target.id)
      },
      {
        rootMargin: `-${navHeight}px 0px -45% 0px`,
        threshold: 0,
      }
    )

    els.forEach((el) => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [sections, navHeight])

  function handleClick(id) {
    setActive(id)
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight - 8
    window.scrollTo({ top: y, behavior: "smooth" })
  }

  return (
    <nav
      aria-label="Page section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 md:flex lg:right-6"
    >
      {sections.map((section) => {
        const isActive = active === section.id
        const isHovered = hovered === section.id

        return (
          <div
            key={section.id}
            className="relative flex items-center justify-end"
            onMouseEnter={() => setHovered(section.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip — flies in from the right side to the left */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[#0F172A]/90 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm dark:bg-slate-800/90"
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Indicator button */}
            <button
              onClick={() => handleClick(section.id)}
              aria-label={`Go to ${section.label}`}
              className="group relative flex items-center justify-end focus:outline-none"
              style={{ minWidth: 32, height: 20 }}
            >
              <motion.span
                animate={{
                  width: isActive ? 28 : isHovered ? 18 : 14,
                  height: isActive ? 4 : 2,
                  opacity: isActive ? 1 : isHovered ? 0.7 : 0.35,
                  backgroundColor: isActive ? "#10B981" : isHovered ? "#10B981" : "#94A3B8",
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: "block",
                  borderRadius: 9999,
                  boxShadow: isActive
                    ? "0 0 8px 2px rgba(16,185,129,0.35)"
                    : "none",
                }}
              />
              {/* Larger invisible hit area */}
              <span
                className="absolute inset-0 -m-2"
                style={{ display: "block" }}
              />
            </button>
          </div>
        )
      })}
    </nav>
  )
}
