"use client"

import { useEffect, useRef, useState } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

export function EducationSection() {
  const { data } = usePortfolio()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (data.education.length === 0) {
    return (
      <section id="about" className="bg-foreground text-background py-24 md:py-40">
        <div className="px-6 md:px-10 text-center">
          <span className="text-xs font-mono tracking-widest opacity-50 block mb-6">EDUCATION</span>
          <p className="text-xl opacity-50">No education entries yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="about" className="bg-foreground text-background py-24 md:py-40">
      <div className="px-6 md:px-10">
        {/* Education header */}
        <div
          className={`mb-20 md:mb-32 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-xs font-mono tracking-widest opacity-50 block mb-4">BACKGROUND</span>
          <h2 className="font-serif font-black tracking-[-0.03em] leading-[0.9]" style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}>
            Education
          </h2>
        </div>

        {/* Education entries */}
        <div className="space-y-20 md:space-y-32">
          {data.education.map((edu, index) => (
            <div
              key={edu.id}
              className={`grid md:grid-cols-2 gap-12 md:gap-20 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div>
                <span className="text-sm font-mono opacity-50 block mb-4">{edu.duration}</span>
                <h3 className="font-serif font-bold mb-2" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
                  {edu.institution}
                </h3>
                <p className="text-lg opacity-80">
                  {edu.degree} in {edu.field}
                </p>
                {edu.gpa && <GpaCounter gpa={edu.gpa} isVisible={isVisible} delay={400 + index * 150} />}
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest opacity-50 block mb-6">Highlights</span>
                <ul className="space-y-4">
                  {edu.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-4 transition-all duration-500 ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      }`}
                      style={{ transitionDelay: `${300 + index * 150 + i * 100}ms` }}
                    >
                      <span className="text-sm font-mono opacity-30 mt-1 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-lg">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bio section */}
        {data.profile.bio && (
          <div
            className={`mt-32 md:mt-48 border-t border-background/20 pt-16 md:pt-24 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid md:grid-cols-2 gap-12">
              <span className="text-xs font-mono uppercase tracking-widest opacity-50">About</span>
              <p className="text-xl md:text-2xl leading-relaxed opacity-90 whitespace-pre-line">{data.profile.bio}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/** Animated GPA counter that rolls up from 0 to the actual value */
function GpaCounter({ gpa, isVisible, delay }: { gpa: string; isVisible: boolean; delay: number }) {
  const [displayValue, setDisplayValue] = useState("0.00")
  const hasAnimated = useRef(false)

  // Extract numeric part (e.g. "3.82" from "3.82 / 4.00")
  const match = gpa.match(/(\d+\.?\d*)/)
  const target = match ? parseFloat(match[1]) : null

  useEffect(() => {
    if (!isVisible || hasAnimated.current || target === null) return
    hasAnimated.current = true

    const duration = 1200
    const startTime = performance.now() + delay

    const animate = (now: number) => {
      const elapsed = now - startTime
      if (elapsed < 0) {
        requestAnimationFrame(animate)
        return
      }
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased
      setDisplayValue(current.toFixed(2))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isVisible, target, delay])

  // If no parseable number, just show the raw string
  const display = target !== null ? gpa.replace(/(\d+\.?\d*)/, displayValue) : gpa

  return (
    <div className="mt-6 inline-block">
      <span className="text-xs font-mono opacity-50 block mb-1">GPA</span>
      <span className="font-serif font-black tabular-nums" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
        {display}
      </span>
    </div>
  )
}
