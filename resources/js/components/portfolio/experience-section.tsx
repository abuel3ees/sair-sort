"use client"

import { useEffect, useRef, useState } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

export function ExperienceSection() {
  const { data } = usePortfolio()
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.2 },
    )

    const items = document.querySelectorAll("[data-exp-animate]")
    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  if (data.experience.length === 0) {
    return (
      <section id="experience" className="bg-background py-24 md:py-40">
        <div className="px-6 md:px-10 text-center">
          <span className="text-xs font-mono tracking-widest text-muted-foreground block mb-6">EXPERIENCE</span>
          <p className="text-xl text-muted-foreground">No experience added yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="experience" className="bg-background py-24 md:py-40">
      <div className="px-6 md:px-10">
        {/* Header - split layout */}
        <div
          id="exp-header"
          data-exp-animate
          className={`grid md:grid-cols-2 gap-8 md:gap-16 mb-20 md:mb-32 transition-all duration-700 ${
            visibleItems.has("exp-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif font-black tracking-[-0.03em] leading-[0.9]" style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}>
            Experience
          </h2>
          <div className="flex flex-col justify-end">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md">
              {data.experience.length} role{data.experience.length !== 1 ? "s" : ""} across product, engineering, and design.
            </p>
          </div>
        </div>

        {/* Experience items - editorial list */}
        <div className="space-y-0">
          {data.experience.map((exp, index) => {
            const isHovered = hoveredId === exp.id
            return (
              <article
                key={exp.id}
                id={`exp-${exp.id}`}
                data-exp-animate
                className={`border-t-2 border-foreground transition-all duration-500 ${
                  visibleItems.has(`exp-${exp.id}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredId(exp.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`py-10 md:py-16 transition-all duration-300 ${isHovered ? "md:pl-4" : "md:pl-0"}`}>
                  <div className="grid md:grid-cols-12 gap-6 md:gap-8">
                    {/* Left: Company & Date */}
                    <div className="md:col-span-4 relative">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-7.25 top-1 hidden md:block transition-all duration-300 ${
                          isHovered ? "scale-150" : "scale-100"
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 border-2 border-foreground transition-colors duration-300 ${isHovered ? "bg-foreground" : "bg-background"}`} />
                      </div>
                      <span className="text-sm font-mono text-muted-foreground block mb-2">{exp.duration}</span>
                      <h3 className="font-serif font-bold tracking-tight" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>
                        {exp.company}
                      </h3>
                    </div>

                    {/* Right: Role & Description */}
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg md:text-xl font-medium">{exp.role}</span>
                        <span
                          className={`text-xs font-mono px-2 py-1 transition-colors duration-300 ${
                            isHovered
                              ? "bg-foreground text-background"
                              : exp.type === "internship"
                                ? "border border-foreground"
                                : "bg-foreground text-background"
                          }`}
                        >
                          {exp.type}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono px-3 py-1 border border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background transition-colors cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
          <div className="border-t-2 border-foreground" />
        </div>
      </div>
    </section>
  )
}
