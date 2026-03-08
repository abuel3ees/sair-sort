"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Wraps a section with a curtain-wipe reveal effect triggered on scroll.
 * A foreground overlay slides away to reveal content underneath.
 */
export function SectionWipe({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative overflow-hidden">
      {children}
      {/* Wipe curtain overlay */}
      <div
        className="absolute inset-0 bg-foreground z-40 origin-left pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          transform: revealed ? "scaleX(0)" : "scaleX(1)",
          transformOrigin: revealed ? "right" : "left",
        }}
      />
    </div>
  )
}
