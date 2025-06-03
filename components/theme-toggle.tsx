"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="relative px-4 py-2 font-black border-2 border-black dark:border-neo-blue-500 bg-white dark:bg-slate-800 text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        aria-label="Theme toggle"
      >
        <div className="relative w-5 h-5">
          <Sun size={20} />
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative px-4 py-2 font-black border-2 border-black dark:border-neo-blue-500 bg-white dark:bg-slate-800 text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px]"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
          }`}
          size={20}
        />
        <Moon
          className={`absolute inset-0 transition-all duration-300 text-neo-blue-500 ${
            theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
          size={20}
        />
      </div>
    </button>
  )
}
