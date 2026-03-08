"use client"

import { useCallback, useRef, useState } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&"

/**
 * A heading that scrambles its text when it enters the viewport.
 * Uses IntersectionObserver to trigger once, then resolves to original text.
 */
export function ScrambleHeading({
  text,
  as: Tag = "h2",
  className = "",
  style,
}: {
  text: string
  as?: "h1" | "h2" | "h3" | "h4" | "span"
  className?: string
  style?: React.CSSProperties
}) {
  const [display, setDisplay] = useState(text)
  const hasPlayed = useRef(false)
  const frameRef = useRef(0)

  const scramble = useCallback(() => {
    if (hasPlayed.current) return
    hasPlayed.current = true
    let iteration = 0
    const maxIterations = text.length

    const animate = () => {
      const result = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (i < iteration) return text[i]
          return CHARS[Math.floor(((i * 7 + iteration * 13) % CHARS.length))]
        })
        .join("")
      setDisplay(result)
      iteration += 0.4
      if (iteration <= maxIterations) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(text)
      }
    }
    animate()
  }, [text])

  const elRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            scramble()
            observer.disconnect()
          }
        },
        { threshold: 0.3 },
      )
      observer.observe(node)
    },
    [scramble],
  )

  return (
    <Tag ref={elRef} className={className} style={style}>
      {display}
    </Tag>
  )
}
