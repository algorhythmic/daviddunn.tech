"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { Dashboard } from "@/components/dashboard"
import { Portfolio } from "@/components/portfolio"
import { PhotoGallery } from "@/components/photo-gallery"
import { About } from "@/components/about"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ThemeProvider } from "@/contexts/theme-context"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-neo-yellow-light flex items-center justify-center">
        <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-16 h-16 border-8 border-black border-t-neo-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-3xl font-black text-black mb-4">LOADING...</h2>
          <p className="font-bold text-black">Preparing your data experience</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-neo-yellow-light dark:bg-gray-900">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Navigation />
            <main>
              <Hero />
              <Dashboard />
              <Portfolio />
              <PhotoGallery />
              <About />
            </main>
          </>
        )}
      </div>
    </ThemeProvider>
  )
}
