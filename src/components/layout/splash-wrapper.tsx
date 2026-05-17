"use client"

import { useState, useEffect } from "react"
import { Splash } from "@/components/ui/splash"

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {showSplash && <Splash duration={3000} />}
      <div className={showSplash ? "invisible" : ""}>{children}</div>
    </>
  )
}
