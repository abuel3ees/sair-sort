"use client"

import { ArrowUpRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@."

/** Hook that scrambles text on hover, then resolves to the original */
function useTextScramble(text: string) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<number>(0)

  const scramble = useCallback(() => {
    let iteration = 0
    const maxIterations = text.length

    cancelAnimationFrame(frameRef.current)

    const animate = () => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < iteration) return text[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(""),
      )
      iteration += 0.5
      if (iteration <= maxIterations) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }
    animate()
  }, [text])

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    setDisplay(text)
  }, [text])

  return { display, scramble, reset }
}

export function ContactSection() {
  const { data } = usePortfolio()
  const { profile } = data
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const emailScramble = useTextScramble(profile.email)

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

  return (
    <section ref={sectionRef} id="contact" className="bg-background py-24 md:py-40 relative overflow-hidden grain">
      <div className="px-6 md:px-10 relative z-10">
        {/* Giant CTA */}
        <div
          className={`mb-20 md:mb-32 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <a href={`mailto:${profile.email}`} className="group block">
            <h2
              className="font-serif font-black tracking-[-0.03em] leading-[0.85] group-hover:italic transition-all duration-300"
              style={{ fontSize: "clamp(3rem, 12vw, 12rem)" }}
            >
              <span className="block">{"Let's"}</span>
              <span className="flex items-center gap-4 md:gap-8">
                Talk
                <ArrowUpRight
                  className="inline-block transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
                  style={{ width: "clamp(2rem, 8vw, 6rem)", height: "clamp(2rem, 8vw, 6rem)" }}
                />
              </span>
            </h2>
          </a>
        </div>

        {/* Contact details grid */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 border-t-2 border-foreground pt-12">
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-4">Email</span>
            <a
              href={`mailto:${profile.email}`}
              className="text-lg font-mono hover-underline inline-block"
              onMouseEnter={emailScramble.scramble}
              onMouseLeave={emailScramble.reset}
            >
              {emailScramble.display}
            </a>
          </div>

          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-4">Socials</span>
            <div className="space-y-2">
              {profile.github && (
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-lg hover-underline"
                >
                  GitHub <span className="inline-block -rotate-45 text-sm">↗</span>
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-lg hover-underline"
                >
                  LinkedIn <span className="inline-block -rotate-45 text-sm">↗</span>
                </a>
              )}
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-[400ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-4">Location</span>
            <p className="text-lg">{profile.location}</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 md:mt-48 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-foreground/20 pt-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span className="text-xs text-muted-foreground/30">·</span>
            <span className="text-xs font-mono text-muted-foreground/50">Built with Sair</span>
          </div>
          <div>
            <a href="/dashboard" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors hover-underline">
              Dashboard
            </a>
          </div>
        </footer>
      </div>
    </section>
  )
}
