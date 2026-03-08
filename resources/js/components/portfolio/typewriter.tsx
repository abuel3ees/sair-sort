"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Typewriter effect — types out text character by character
 * with a blinking cursor at the end.
 */
export function Typewriter({
  text,
  speed = 60,
  startDelay = 800,
  className = "",
  enabled = true,
}: {
  text: string
  speed?: number
  startDelay?: number
  className?: string
  enabled?: boolean
}) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text)
  const [showCursor, setShowCursor] = useState(enabled)
  const indexRef = useRef(0)

  useEffect(() => {
    if (!enabled || !text) return

    indexRef.current = 0

    const startTimer = setTimeout(() => {
      setDisplayed("")
      setShowCursor(true)

      const interval = setInterval(() => {
        indexRef.current += 1
        setDisplayed(text.slice(0, indexRef.current))

        if (indexRef.current >= text.length) {
          clearInterval(interval)
          setTimeout(() => setShowCursor(false), 2000)
        }
      }, speed)

      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(startTimer)
  }, [text, speed, startDelay, enabled])

  if (!enabled) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          className="inline-block ml-0.5 -mb-0.5 w-0.5 bg-current animate-pulse"
          style={{ height: "1em" }}
          aria-hidden="true"
        />
      )}
    </span>
  )
}
