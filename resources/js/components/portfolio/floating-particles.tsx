"use client"

import { useEffect, useRef } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

/**
 * Floating particles — subtle geometric shapes drifting in the background.
 * Controlled by `particles` visibility toggle (default OFF).
 */
export function FloatingParticles() {
  const { data } = usePortfolio()
  const enabled = data.settings.elementVisibility?.particles ?? false
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId = 0
    const particles: Particle[] = []
    const PARTICLE_COUNT = 35

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Create particles with deterministic starting positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const seed = Math.sin(i * 9301 + 49297) % 233280
      const r = Math.abs(seed / 233280)
      particles.push({
        x: r * (canvas.width || 1),
        y: ((i * 137) % 100) / 100 * (canvas.height || 1),
        size: 2 + (i % 5),
        speedX: (r - 0.5) * 0.3,
        speedY: -0.15 - (i % 10) * 0.02,
        opacity: 0.06 + (i % 8) * 0.01,
        shape: i % 3, // 0=square, 1=circle, 2=line
      })
    }

    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const style = getComputedStyle(document.documentElement)
      const fg = style.getPropertyValue("--foreground").trim() || "oklch(0.08 0 0)"

      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY

        // Wrap around
        if (p.y < -20) p.y = canvas.height + 20
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = `oklch(from ${fg} l c h / ${p.opacity})`
        ctx.strokeStyle = ctx.fillStyle

        if (p.shape === 0) {
          ctx.fillRect(p.x, p.y, p.size, p.size)
        } else if (p.shape === 1) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.size * 2, p.y - p.size)
          ctx.stroke()
        }
        ctx.restore()
      }

      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: "difference" }}
    />
  )
}

type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  shape: number
}
