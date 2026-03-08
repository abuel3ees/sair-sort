"use client"

import { usePortfolio, useVisible } from "@/lib/portfolio-context"

/**
 * Dual-row infinite marquee ticker that scrolls tech tags
 * across the full viewport width in opposite directions.
 * Sits between sections as a visual divider.
 */
export function MarqueeTicker() {
  const { data } = usePortfolio()
  const show = useVisible("marquee_ticker")

  if (!show) return null

  // Collect all unique tech tags from projects + experience
  const tagSet = new Set<string>()
  for (const p of data.projects) {
    for (const t of p.tags) tagSet.add(t)
  }
  for (const e of data.experience) {
    for (const t of e.technologies) tagSet.add(t)
  }
  const tags = Array.from(tagSet)
  if (tags.length === 0) return null

  // Duplicate for seamless loop
  const row = [...tags, ...tags, ...tags, ...tags]

  return (
    <div className="relative overflow-hidden py-6 md:py-10 border-y-2 border-foreground select-none">
      {/* Row 1 — left to right */}
      <div className="marquee-track mb-3 md:mb-4" style={{ animationDuration: "40s" }}>
        {row.map((tag, i) => (
          <span
            key={`a-${i}`}
            className="inline-block px-4 md:px-6 text-xl md:text-3xl font-serif font-black tracking-tight whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity"
          >
            {tag}
            <span className="inline-block mx-4 md:mx-6 text-muted-foreground/30">✦</span>
          </span>
        ))}
      </div>
      {/* Row 2 — right to left (reversed) */}
      <div
        className="marquee-track"
        style={{ animationDuration: "50s", animationDirection: "reverse" }}
      >
        {row.map((tag, i) => (
          <span
            key={`b-${i}`}
            className="inline-block px-4 md:px-6 text-lg md:text-2xl font-mono tracking-widest uppercase whitespace-nowrap opacity-40 hover:opacity-70 transition-opacity"
          >
            {tag}
            <span className="inline-block mx-4 md:mx-6 text-muted-foreground/20">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
