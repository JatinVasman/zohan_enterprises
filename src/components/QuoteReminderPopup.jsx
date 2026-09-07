import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare, Sparkles } from "lucide-react"
import { company } from "../data/content"

export const REMINDER_POPUP_KEY = "ze_reminder_closed"
const SHOW_DELAY_MS = 5_000
const AUTO_MINIMIZE_MS = 15_000

function shouldShow() {
  try {
    if (sessionStorage.getItem(REMINDER_POPUP_KEY)) return false
    if (localStorage.getItem(REMINDER_POPUP_KEY)) return false
    return true
  } catch {
    return true
  }
}

function markClosed() {
  try {
    sessionStorage.setItem(REMINDER_POPUP_KEY, "1")
    localStorage.setItem(REMINDER_POPUP_KEY, "1")
  } catch {}
}

let userDismissedOrEngaged = false
export function markUserEngaged() {
  userDismissedOrEngaged = true
  markClosed()
}

// Check whether the route is an explicit machinery page
function isMachineryRoute(pathname) {
  if (!pathname) return false
  if (pathname.startsWith("/product/")) return true
  if (pathname.startsWith("/products")) return true
  if (pathname.startsWith("/industrial-machinery/") && pathname !== "/industrial-machinery/locations") {
    return true
  }
  return false
}

export default function QuoteReminderPopup() {
  // "hidden" | "card" | "mini"
  const [state, setState] = useState("hidden")
  const [isViewingMachinery, setIsViewingMachinery] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const minimizeTimer = useRef(null)
  const showTimer = useRef(null)

  // 1. Detect if the user is on a machinery page or viewing machinery
  useEffect(() => {
    // If the user already dismissed or engaged, do nothing
    if (userDismissedOrEngaged || !shouldShow()) {
      setIsViewingMachinery(false)
      setState("hidden")
      return
    }

    const pathname = location.pathname

    if (isMachineryRoute(pathname)) {
      setIsViewingMachinery(true)
      return
    }

    // On homepage, observe if the machinery catalog section is visible in viewport
    if (pathname === "/") {
      setIsViewingMachinery(false)

      const checkMachineryInView = () => {
        if (userDismissedOrEngaged || !shouldShow()) return
        const productsElem = document.getElementById("our-products")
        if (!productsElem) return

        const rect = productsElem.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > 0
        if (inView) {
          setIsViewingMachinery(true)
        }
      }

      checkMachineryInView()
      window.addEventListener("scroll", checkMachineryInView, { passive: true })
      return () => window.removeEventListener("scroll", checkMachineryInView)
    }

    // Non-machinery page (e.g. /about, /contact, /thank-you, /industrial-machinery/locations)
    setIsViewingMachinery(false)
    setState("hidden")
    clearTimeout(showTimer.current)
    clearTimeout(minimizeTimer.current)
  }, [location.pathname])

  // 2. Trigger the popup only when viewing machinery
  useEffect(() => {
    if (!isViewingMachinery || userDismissedOrEngaged || !shouldShow()) {
      return
    }

    clearTimeout(showTimer.current)
    showTimer.current = setTimeout(() => {
      if (!userDismissedOrEngaged && shouldShow()) {
        setState("card")
      }
    }, SHOW_DELAY_MS)

    return () => clearTimeout(showTimer.current)
  }, [isViewingMachinery])

  // 3. Auto-minimize timer when card is open
  useEffect(() => {
    if (state !== "card") return
    clearTimeout(minimizeTimer.current)
    minimizeTimer.current = setTimeout(() => {
      // If still open and not cut/dismissed, transition to mini
      if (!userDismissedOrEngaged) {
        setState("mini")
      }
    }, AUTO_MINIMIZE_MS)
    return () => clearTimeout(minimizeTimer.current)
  }, [state])

  // Reset minimize timer on user hover/touch interaction
  const keepAlive = useCallback(() => {
    if (state !== "card") return
    clearTimeout(minimizeTimer.current)
    minimizeTimer.current = setTimeout(() => {
      if (!userDismissedOrEngaged) {
        setState("mini")
      }
    }, AUTO_MINIMIZE_MS)
  }, [state])

  // User clicked X (cut) -> Dismiss permanently, do not popup or minimize again
  const dismiss = useCallback(() => {
    userDismissedOrEngaged = true
    markClosed()
    clearTimeout(minimizeTimer.current)
    clearTimeout(showTimer.current)
    setState("hidden")
  }, [])

  // User clicked Request a Quotation -> Navigate to enquiry page and dismiss popup permanently
  const handleQuote = useCallback(() => {
    userDismissedOrEngaged = true
    markClosed()
    clearTimeout(minimizeTimer.current)
    clearTimeout(showTimer.current)
    setState("hidden")
    navigate("/enquiry")
  }, [navigate])

  const restore = useCallback(() => {
    if (!userDismissedOrEngaged) {
      setState("card")
    }
  }, [])

  const waUrl = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
    "Hello, I need help choosing the right wire processing machine for my requirement."
  )}`

  // If dismissed or not viewing machinery, don't render anything
  if (userDismissedOrEngaged || (!isViewingMachinery && state !== "mini")) {
    return null
  }

  return (
    <>
      {/* ── Full assistance card — top-right, non-blocking ── */}
      <AnimatePresence>
        {state === "card" && (
          <motion.aside
            key="help-card"
            aria-label="Quick Help"
            className="fixed z-[9990] w-[320px]"
            style={{ top: 20, right: 20 }}
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={keepAlive}
            onTouchStart={keepAlive}
          >
            {/* Top accent */}
            <div className="h-[3px] rounded-t-xl bg-gradient-to-r from-[#10B981] via-[#0D5C3A] to-[#10B981]" />

            <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white shadow-[0_8px_36px_-8px_rgba(15,23,42,0.18),0_2px_8px_-2px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_8px_36px_-8px_rgba(0,0,0,0.6)]">
              {/* Header row */}
              <div className="flex items-center justify-between px-5 pt-4 pb-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.18em] text-[#0D5C3A] dark:text-emerald-400 uppercase">
                  <Sparkles size={11} className="text-amber-500" />
                  Quick Help
                </span>
                <button
                  onClick={dismiss}
                  aria-label="Close help card"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pb-5">
                <h2 className="text-sm font-bold leading-snug text-[#0F172A] dark:text-white">
                  Need help choosing the right machine?
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[#64748B] dark:text-slate-400">
                  Tell us your application and our experts will recommend the most suitable
                  wire processing machine.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleQuote}
                    className="btn-lift w-full rounded-lg bg-[#0D5C3A] py-2.5 text-xs font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700 cursor-pointer transition-colors"
                  >
                    Request a Quotation
                  </button>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dismiss}
                    className="btn-lift w-full rounded-lg border border-[#10B981] py-2.5 text-center text-xs font-semibold text-[#0D5C3A] shadow-sm hover:bg-[#10B981] hover:text-white dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Minimized floating button — bottom-right ── */}
      <AnimatePresence>
        {state === "mini" && isViewingMachinery && !userDismissedOrEngaged && (
          <motion.button
            key="help-mini"
            onClick={restore}
            aria-label="Reopen help card"
            className="btn-lift fixed z-[9990] flex items-center gap-2 rounded-full bg-[#0D5C3A] px-4 py-2.5 text-xs font-semibold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700 cursor-pointer"
            style={{ bottom: 24, right: 24 }}
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <MessageSquare size={13} />
            <span>Need Help?</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
