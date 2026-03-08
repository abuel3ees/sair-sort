"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Reveals text word-by-word as the element scrolls into view.
 * Each word fades in and slides up with stagger.
 */
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate progress from 0 to 1 over 800ms
          const start = performance.now()
          const duration = 1200

          const tick = (now: number) => {
            const elapsed = now - start
            const p = Math.min(elapsed / duration, 1)
            // Ease out cubic
            setProgress(1 - Math.pow(1 - p, 3))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(/\s+/)
  const totalWords = words.length

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, i) => {
        const wordProgress = Math.max(0, Math.min(1, (progress * totalWords - i) * 1.5))
        return (
          <span
            key={i}
            className="inline-block mr-[0.3em] transition-none"
            style={{
              opacity: wordProgress,
              transform: `translateY(${(1 - wordProgress) * 12}px)`,
              filter: `blur(${(1 - wordProgress) * 3}px)`,
            }}
          >
            {word}
          </span>
        )
      })}
    </span>
  )
}
