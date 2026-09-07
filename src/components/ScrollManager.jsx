import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        return
      }
    }
    // Instant scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, hash])

  return null
}

