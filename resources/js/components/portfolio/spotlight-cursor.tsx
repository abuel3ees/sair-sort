"use client"

import { useCallback, useEffect, useRef } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

/**
 * Spotlight cursor — a radial gradient mask that follows the mouse,
 * creating a "flashlight" reveal effect over a dark overlay.
 * Only visible on hover over the main element.
 */
export function SpotlightCursor() {
  const { data } = usePortfolio()
  const vis = data.settings.elementVisibility as Record<string, boolean>
  const groupOff = vis.effects_cursor === false
  const enabled = !groupOff && (vis.spotlight_cursor !== false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)

  const handleMove = useCallback((e: MouseEvent) => {
    if (!overlayRef.current || !activeRef.current) return
    overlayRef.current.style.setProperty("--spot-x", `${e.clientX}px`)
    overlayRef.current.style.setProperty("--spot-y", `${e.clientY}px`)
  }, [])

  const handleEnter = useCallback(() => {
    activeRef.current = true
    if (overlayRef.current) overlayRef.current.style.opacity = "1"
  }, [])

  const handleLeave = useCallback(() => {
    activeRef.current = false
    if (overlayRef.current) overlayRef.current.style.opacity = "0"
  }, [])

  useEffect(() => {
    if (!enabled) return
    const main = document.querySelector("main")
    if (!main) return

    main.addEventListener("mousemove", handleMove)
    main.addEventListener("mouseenter", handleEnter)
    main.addEventListener("mouseleave", handleLeave)

    return () => {
      main.removeEventListener("mousemove", handleMove)
      main.removeEventListener("mouseenter", handleEnter)
      main.removeEventListener("mouseleave", handleLeave)
    }
  }, [enabled, handleMove, handleEnter, handleLeave])

  if (!enabled) return null

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-9998 transition-opacity duration-500"
      style={{
        opacity: 0,
        background:
          "radial-gradient(circle 180px at var(--spot-x, 50%) var(--spot-y, 50%), transparent 0%, oklch(0 0 0 / 0.45) 100%)",
      }}
      aria-hidden="true"
    />
  )
}
