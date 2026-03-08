"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Elastic SVG scroll indicator — a morphing blob that stretches
 * as the user scrolls, replacing the simple bouncing line.
 */
export function ElasticScrollIndicator({
  className = "",
}: {
  className?: string
}) {
  const [stretch, setStretch] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const rafRef = useRef(0)

  useEffect(() => {
    let lastScroll = 0

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = Math.abs(y - lastScroll)
        lastScroll = y
        // Stretch based on scroll velocity, clamp to 0-20
        setStretch(Math.min(delta * 0.8, 20))
        setOpacity(Math.max(0, 1 - y / 200))
        // Ease back to 0
        setTimeout(() => setStretch(0), 150)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className={`flex flex-col items-center gap-2 ${className}`}
      style={{ opacity }}
    >
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
        Scroll
      </span>
      <svg
        width="24"
        height="60"
        viewBox="0 0 24 60"
        fill="none"
        className="transition-transform duration-200"
        style={{ transform: `scaleY(${1 + stretch * 0.02})` }}
      >
        {/* Morphing blob path */}
        <path
          d={`M12 0 C12 0 12 ${20 + stretch} 12 ${30 + stretch} C12 ${40 + stretch} 6 ${45 + stretch} 12 ${55 + stretch} C18 ${45 + stretch} 12 ${40 + stretch} 12 ${30 + stretch}`}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-foreground/40"
        />
        {/* Animated dot traveling down */}
        <circle r="2.5" fill="currentColor" className="text-foreground animate-bounce">
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={`M12,0 L12,${50 + stretch}`}
          />
        </circle>
      </svg>
    </div>
  )
}
