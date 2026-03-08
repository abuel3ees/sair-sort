"use client"

import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

/**
 * Floating back-to-top button that appears after scrolling down.
 * Controlled by `back_to_top` visibility toggle.
 */
export function BackToTop() {
  const { data } = usePortfolio()
  const vis = data.settings.elementVisibility as Record<string, boolean>
  const groupOff = vis.effects_scroll === false
  const enabled = !groupOff && (vis.back_to_top ?? true)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const handleScroll = () => setShow(window.scrollY > 600)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [enabled])

  if (!enabled) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center bg-foreground text-background border-2 border-foreground transition-all duration-500 hover:scale-110 active:scale-95 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
