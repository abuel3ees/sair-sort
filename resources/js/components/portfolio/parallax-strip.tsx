"use client"

import { useEffect, useRef, useState } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

/**
 * Horizontal strip of parallax-scrolling tilted image placeholders.
 * Sits between sections as a dramatic visual divider.
 * Controlled by `parallax_strip` visibility toggle.
 */
export function ParallaxStrip() {
  const { data } = usePortfolio()
  const vis = data.settings.elementVisibility as Record<string, boolean>
  const groupOff = vis.effects_visual === false
  const enabled = !groupOff && (vis.parallax_strip !== false)

  const stripRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const onScroll = () => {
      if (!stripRef.current) return
      const rect = stripRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      // Progress: 0 when element enters bottom, 1 when exits top
      const progress = 1 - (rect.bottom / (viewH + rect.height))
      setOffset(progress * 120)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [enabled])

  if (!enabled) return null

  // Generate placeholder items from project titles
  const items = data.projects.length > 0
    ? data.projects.map((p) => p.title)
    : ["Project One", "Project Two", "Project Three", "Project Four", "Project Five"]

  // Double for seamless feel
  const doubled = [...items, ...items, ...items]

  return (
    <div
      ref={stripRef}
      className="relative overflow-hidden py-12 md:py-20 -rotate-2"
    >
      <div
        className="flex gap-6 md:gap-10"
        style={{ transform: `translateX(${-offset}px)`, transition: "transform 0.1s linear" }}
      >
        {doubled.map((title, i) => (
          <div
            key={i}
            className="shrink-0 w-64 md:w-80 aspect-4/3 border-2 border-foreground/20 img-placeholder flex items-center justify-center relative group"
            style={{ transform: `rotate(${((i % 5) - 2) * 1.5}deg)` }}
          >
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/40 group-hover:text-muted-foreground/80 transition-colors text-center px-4">
              {title}
            </span>
            {/* Number overlay */}
            <span className="absolute top-3 left-3 text-[10px] font-mono text-muted-foreground/20">
              {String((i % items.length) + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
