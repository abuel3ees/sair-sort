"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

/**
 * Konami code easter egg — ↑↑↓↓←→←→BA triggers confetti rain.
 * Pieces rain down then fade out after a few seconds.
 */
export function KonamiEasterEgg() {
  const { data } = usePortfolio()
  const vis = data.settings.elementVisibility as Record<string, boolean>
  const groupOff = vis.effects_easter_eggs === false
  const enabled = !groupOff && (vis.konami_code ?? true)
  const [triggered, setTriggered] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    if (!enabled) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[indexRef.current]) {
        indexRef.current++
        if (indexRef.current === KONAMI.length) {
          indexRef.current = 0
          setTriggered(true)
          setTimeout(() => setTriggered(false), 5000)
        }
      } else {
        indexRef.current = 0
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [enabled])

  if (!triggered) return null

  return (
    <div className="fixed inset-0 z-9999 pointer-events-none overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-bounce">
        <span className="text-6xl md:text-9xl font-black font-serif" style={{ WebkitTextStroke: "2px currentColor", color: "transparent" }}>
          🎉
        </span>
      </div>
    </div>
  )
}

function ConfettiPiece({ index }: { index: number }) {
  const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd", "#01a3a4", "#f368e0"]
  const color = colors[index % colors.length]
  // Use index-based seeded pseudo-random instead of Math.random for purity
  const seed = useMemo(() => {
    const s = Math.sin(index * 9301 + 49297) % 233280
    return Math.abs(s / 233280)
  }, [index])
  const left = seed * 100
  const delay = ((index * 7) % 20) / 10
  const duration = 2 + ((index * 13) % 30) / 10
  const size = 6 + ((index * 17) % 10)
  const rotation = (index * 47) % 360

  return (
    <div
      className="absolute top-0"
      style={{
        left: `${left}%`,
        width: size,
        height: size * 0.4,
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`,
        animation: `confetti-fall ${duration}s ${delay}s ease-in forwards`,
      }}
    />
  )
}
