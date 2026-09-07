import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export default function ThemeToggle({ variant = "default", className = "" }) {
  const { theme, toggleTheme, isDark } = useTheme()

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        className={`btn-lift relative flex h-7 w-7 items-center justify-center rounded-sm border transition-colors ${
          isDark
            ? "border-slate-700 bg-slate-800 text-amber-400 hover:border-amber-400/50 hover:bg-slate-700"
            : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400 hover:bg-slate-200"
        } ${className}`}
      >
        <motion.span
          key={theme}
          initial={{ scale: 0.5, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotate: 30, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
        </motion.span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`btn-lift group relative flex items-center gap-2 rounded-sm border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 ${
        isDark
          ? "border-slate-700 bg-slate-800/90 text-slate-200 hover:border-amber-400/50 hover:bg-slate-800 hover:text-amber-300"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-500/50 hover:bg-slate-50 hover:text-[#0D5C3A]"
      } ${className}`}
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        <motion.span
          key={theme}
          initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun size={14} className="text-amber-400 transition-transform duration-200 group-hover:rotate-45" />
          ) : (
            <Moon size={14} className="text-[#0D5C3A] transition-transform duration-200 group-hover:-rotate-12" />
          )}
        </motion.span>
      </div>
      <span className="hidden sm:inline-block">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  )
}
