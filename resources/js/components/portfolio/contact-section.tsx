"use client"

import { ArrowUpRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { MagneticWrap } from "@/components/portfolio/magnetic-wrap"
import { sectionBg } from "@/lib/section-bg"
import { usePortfolio, useVisible } from "@/lib/portfolio-context"

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
  const sectionStyle = sectionBg(data.settings, "contact")
  const { profile } = data
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const emailScramble = useTextScramble(profile.email)

  // Visibility toggles
  const showEmailScramble = useVisible("contact_email_scramble")
  const showSocials = useVisible("contact_socials")
  const showLocation = useVisible("contact_location")
  const showFooter = useVisible("contact_footer")
  const showMagnetic = useVisible("magnetic_buttons")

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
    <section ref={sectionRef} id="contact" className="bg-background py-24 md:py-40 relative overflow-hidden grain" style={sectionStyle}>
      <div className="px-6 md:px-10 relative z-10">
        {/* Giant CTA */}
        <div
          className={`mb-20 md:mb-32 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <MagneticWrap strength={showMagnetic ? 0.25 : 0}>
            <a href={`mailto:${profile.email}`} className="group block glow-on-hover">
              <h2
                className="font-serif font-black tracking-[-0.03em] leading-[0.85] group-hover:italic transition-all duration-300"
                style={{ fontSize: "clamp(3rem, 12vw, 12rem)" }}
              >
              {(profile.contactCta || "Let's Talk").split(/\s+/).map((word, i) => (
                <span key={i} className={i > 0 ? "flex items-center gap-4 md:gap-8" : "block"}>
                  {i > 0 ? (
                    <>
                      {word}
                      <ArrowUpRight
                        className="inline-block transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
                        style={{ width: "clamp(2rem, 8vw, 6rem)", height: "clamp(2rem, 8vw, 6rem)" }}
                      />
                    </>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </h2>
          </a>
          </MagneticWrap>
        </div>

        {/* Contact details grid */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 border-t-2 border-foreground pt-12">
          {showEmailScramble && (
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
          )}

          {showSocials && (
            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-4">Socials</span>
              <div className="space-y-2">
                {profile.github && (
                  <MagneticWrap strength={showMagnetic ? 0.35 : 0}>
                    <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="inline-block text-lg hover-underline">
                      GitHub <span className="inline-block -rotate-45 text-sm">↗</span>
                    </a>
                  </MagneticWrap>
                )}
                {profile.linkedin && (
                  <MagneticWrap strength={showMagnetic ? 0.35 : 0}>
                    <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-block text-lg hover-underline">
                      LinkedIn <span className="inline-block -rotate-45 text-sm">↗</span>
                    </a>
                  </MagneticWrap>
                )}
                {profile.twitter && (
                  <MagneticWrap strength={showMagnetic ? 0.35 : 0}>
                    <a href={`https://x.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="inline-block text-lg hover-underline">
                      X / Twitter <span className="inline-block -rotate-45 text-sm">↗</span>
                    </a>
                  </MagneticWrap>
                )}
                {profile.dribbble && (
                  <MagneticWrap strength={showMagnetic ? 0.35 : 0}>
                    <a href={`https://dribbble.com/${profile.dribbble}`} target="_blank" rel="noopener noreferrer" className="inline-block text-lg hover-underline">
                      Dribbble <span className="inline-block -rotate-45 text-sm">↗</span>
                    </a>
                  </MagneticWrap>
                )}
                {profile.website && (
                  <MagneticWrap strength={showMagnetic ? 0.35 : 0}>
                    <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="inline-block text-lg hover-underline">
                      Website <span className="inline-block -rotate-45 text-sm">↗</span>
                    </a>
                  </MagneticWrap>
                )}
              </div>
            </div>
          )}

          {showLocation && (
            <div
              className={`transition-all duration-700 delay-[400ms] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-4">Location</span>
              <p className="text-lg">{profile.location}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <footer className="mt-32 md:mt-48 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-foreground/20 pt-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground">
                © {new Date().getFullYear()} {profile.name}
              </span>
              <span className="text-xs text-muted-foreground/30">·</span>
              <span className="text-xs font-mono text-muted-foreground/50">{profile.footerText || "Built with Sair"}</span>
            </div>
            <div>
              <a href="/dashboard" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors hover-underline">
                Dashboard
              </a>
            </div>
          </footer>
        )}
      </div>
    </section>
  )
}
