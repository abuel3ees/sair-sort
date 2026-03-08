"use client"

/**
 * Renders each character with a staggered animation delay.
 * Used for the hero section name.
 */
export function StaggeredText({
  text,
  isVisible,
  className = "",
  delayBase = 0,
  delayPer = 30,
}: {
  text: string
  isVisible: boolean
  className?: string
  delayBase?: number
  delayPer?: number
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-700 ease-out"
          style={{
            transitionDelay: `${delayBase + i * delayPer}ms`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) rotateX(0)" : "translateY(40px) rotateX(-40deg)",
            transformOrigin: "bottom center",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}
