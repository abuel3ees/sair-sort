"use client"

import { useEffect } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

/**
 * Applies CSS smooth scrolling to the <html> element when enabled.
 * Controlled by `smooth_scroll` visibility toggle.
 */
export function SmoothScroll() {
  const { data } = usePortfolio()
  const vis = data.settings.elementVisibility as Record<string, boolean>
  const groupOff = vis.effects_scroll === false
  const enabled = !groupOff && (vis.smooth_scroll ?? true)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = ""
    }
  }, [enabled])

  return null
}
