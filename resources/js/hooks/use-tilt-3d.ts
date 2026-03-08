"use client"

import { useCallback, useRef } from "react"

/**
 * Hook that applies a 3D perspective tilt effect to an element based on mouse position.
 * Returns ref + mouse handlers to attach to the target element.
 */
export function useTilt3D(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      ref.current.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`
    },
    [intensity],
  )

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)"
  }, [])

  return { ref, handleMouseMove, handleMouseLeave }
}
