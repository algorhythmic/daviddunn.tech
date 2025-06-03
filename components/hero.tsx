"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Database, BarChart3, Code } from "lucide-react"

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0)
  const roles = ["Data Engineer", "Real-time Analytics", "Full-Stack Development"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="hero"
      className="min-h-screen bg-neo-yellow-light dark:bg-slate-900 flex items-center justify-center pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white dark:bg-slate-800 border-8 border-black dark:border-neo-blue-500 p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform duration-300 w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black mb-6 text-black dark:text-white dark:neo-text-glow">
            DAVID DUNN
          </h1>
          <div className="h-16 md:h-20 mb-8 flex items-center justify-center">
            <h2 className="text-2xl md:text-4xl font-bold text-neo-blue-500 dark:text-neo-blue-400 transition-all duration-500 dark:neo-text-glow min-w-0 text-center">
              {roles[currentRole]}
            </h2>
          </div>
          <p className="text-lg md:text-xl font-bold text-black dark:text-white mb-8 max-w-3xl mx-auto">
            Welcome! Thanks for checking out my personal website.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center bg-neo-blue-500 dark:bg-neo-blue-600 border-4 border-black dark:border-neo-blue-400 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Database className="mr-2 text-white" size={24} />
              <span className="font-bold text-white">Big Data</span>
            </div>
            <div className="flex items-center bg-neo-pink-light dark:bg-orange-500 border-4 border-black dark:border-neo-blue-400 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <BarChart3 className="mr-2 text-white dark:text-white" size={24} />
              <span className="font-bold text-white dark:text-white">Analytics</span>
            </div>
            <div className="flex items-center bg-neo-green-light dark:bg-emerald-500 border-4 border-black dark:border-neo-blue-400 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Code className="mr-2 text-white" size={24} />
              <span className="font-bold text-white">Full-Stack</span>
            </div>
          </div>

          <button
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-neo-red-light dark:bg-red-500 hover:bg-red-600 text-white font-black px-8 py-4 border-4 border-black dark:border-neo-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 text-lg hover:translate-x-[4px] hover:translate-y-[4px] active:translate-x-[6px] active:translate-y-[6px]"
          >
            EXPLORE MY WORK
          </button>
        </div>

        <div className="mt-12 animate-bounce">
          <ChevronDown size={48} className="mx-auto text-black dark:text-neo-blue-400 dark:neo-text-glow" />
        </div>
      </div>
    </section>
  )
}
