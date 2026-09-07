import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Check saved localStorage preference
    const saved = localStorage.getItem("theme")
    if (saved === "dark" || saved === "light") {
      return saved
    }
    // 2. Default to light mode
    return "light"
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
      root.setAttribute("data-theme", "dark")
      root.style.colorScheme = "dark"
    } else {
      root.classList.remove("dark")
      root.setAttribute("data-theme", "light")
      root.style.colorScheme = "light"
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
