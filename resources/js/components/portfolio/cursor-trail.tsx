"use client"

import { useEffect, useRef } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

/**
 * Cursor trail — a glowing dot that follows the mouse with a trailing effect.
 * Only renders on non-touch devices. Controlled by `cursor_trail` visibility toggle.
 */
export function CursorTrail() {
  const { data } = usePortfolio()
  const vis = data.settings.elementVisibility as Record<string, boolean>
  const groupOff = vis.effects_cursor === false
  const enabled = !groupOff && (vis.cursor_trail ?? true)
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const trailPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return
    // Don't render on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) return

    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      if (!dotRef.current || !trailRef.current) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }
      // Lerp trailing dot
      trailPosRef.current.x += (posRef.current.x - trailPosRef.current.x) * 0.15
      trailPosRef.current.y += (posRef.current.y - trailPosRef.current.y) * 0.15

      dotRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`
      trailRef.current.style.transform = `translate(${trailPosRef.current.x}px, ${trailPosRef.current.y}px)`

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [enabled])

  if (!enabled) return null
  if (typeof window !== "undefined" && "ontouchstart" in window) return null

  return (
    <>
      {/* Main dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-9999 pointer-events-none mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div className="w-2 h-2 -ml-1 -mt-1 rounded-full bg-white" />
      </div>
      {/* Trailing ring */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 z-9998 pointer-events-none mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div className="w-8 h-8 -ml-4 -mt-4 rounded-full border border-white/40" />
      </div>
    </>
  )
}
