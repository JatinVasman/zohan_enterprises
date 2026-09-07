import { useEffect, useRef, useState } from "react"

// Parse a stat string like "15+", "2,400+", "28+ States", "100%", "Verified"
// Returns { num: 15, suffix: "+" } or null if no leading number found.
function parse(raw) {
  const m = raw.match(/^([\d,]+)(.*)$/)
  if (!m) return null
  return {
    num: parseInt(m[1].replace(/,/g, ""), 10),
    suffix: m[2], // e.g. "+", "+ States", "%"
    // preserve original comma-formatting flag
    useComma: m[1].includes(","),
  }
}

function formatNum(n, useComma) {
  if (!useComma) return String(n)
  // add comma every 3 digits
  return n.toLocaleString("en-IN")
}

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export default function CountUp({ value, className = "" }) {
  const parsed = parse(value)
  const [count, setCount] = useState(parsed ? 0 : null)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    if (!parsed || prefersReduced) {
      // No animation — show final value immediately
      if (parsed) setCount(parsed.num)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          observer.disconnect()
          animateTo(parsed.num, 2000, setCount)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, []) // run once on mount

  if (!parsed) {
    // Non-numeric value — render as-is
    return <span ref={ref} className={className}>{value}</span>
  }

  return (
    <span ref={ref} className={className}>
      {formatNum(count ?? 0, parsed.useComma)}
      {parsed.suffix}
    </span>
  )
}

function animateTo(target, duration, setter) {
  const start = performance.now()

  function tick(now) {
    const elapsed = now - start
    const t = Math.min(elapsed / duration, 1)
    // Cubic ease-out: slows near the end
    const eased = 1 - Math.pow(1 - t, 3)
    setter(Math.round(eased * target))
    if (t < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}
