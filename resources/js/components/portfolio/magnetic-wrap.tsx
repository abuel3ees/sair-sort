"use client"

import { useCallback, useRef } from "react"

/**
 * Wraps children in a div with a magnetic hover effect —
 * the element subtly follows the cursor within its bounds.
 */
export function MagneticWrap({
  children,
  className = "",
  strength = 0.35,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * strength
      const y = (e.clientY - rect.top - rect.height / 2) * strength
      ref.current.style.transform = `translate(${x}px, ${y}px)`
    },
    [strength],
  )

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0, 0)"
  }, [])

  return (
    <div
      ref={ref}
      className={`magnetic-target ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
