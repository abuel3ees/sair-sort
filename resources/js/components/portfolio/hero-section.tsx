"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

/**
 * Compute a font-size in vw that makes the text fit roughly one line.
 * Longer names get smaller; short names stay massive.
 */
function useAutoFitFont(text: string, minRem = 3, maxVw = 22) {
  return useMemo(() => {
    const charWidth = maxVw * 0.55
    const totalWidth = text.length * charWidth
    const targetVw = 90
    if (totalWidth > targetVw) {
      const scaled = Math.max(minRem, (targetVw / text.length) / 0.55)
      return `${scaled}vw`
    }
    return `clamp(${minRem}rem, ${maxVw}vw, 20rem)`
  }, [text, minRem, maxVw])
}

export function HeroSection() {
  const { data } = usePortfolio()
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [time, setTime] = useState("")
  const nameRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      requestAnimationFrame(() => setIsVisible(true))
    }
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })

    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(interval)
    }
  }, [])

  // ── Magnetic effect on name hover ──
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!nameRef.current) return
    const rect = nameRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 25
    const y = (e.clientY - rect.top - rect.height / 2) / 25
    nameRef.current.style.transform = `translate(${x}px, ${y}px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!nameRef.current) return
    nameRef.current.style.transform = "translate(0, 0)"
  }, [])

  const nameParts = data.profile.name.split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  const firstNameSize = useAutoFitFont(firstName)
  const lastNameSize = useAutoFitFont(lastName)

  return (
    <section className="relative min-h-screen flex flex-col bg-background overflow-hidden grain">
      {/* Scroll progress */}
      <div
        className="scroll-progress"
        style={{
          transform: `scaleX(${typeof window !== "undefined" ? scrollY / (document.body.scrollHeight - window.innerHeight || 1) : 0})`,
        }}
      />

      {/* Top navigation */}
      <header className="relative z-10 flex justify-between items-start p-6 md:p-10">
        <nav className="flex flex-col gap-1.5">
          {[
            { href: "#work", label: "Work" },
            { href: "#experience", label: "Experience" },
            { href: "#about", label: "About" },
            { href: "#contact", label: "Contact" },
          ].map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-mono hover-underline transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {link.label}
              {link.label === "Contact" && <span className="inline-block -rotate-45 ml-1">↗</span>}
            </a>
          ))}
        </nav>
        <div
          className={`text-right transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-sm font-mono text-muted-foreground tabular-nums">{time}</div>
          <div className="text-sm font-mono text-muted-foreground">
            {new Date().getFullYear()}
          </div>
        </div>
      </header>

      {/* Main name — massive typography, auto-fit */}
      <div
        className="flex-1 flex items-center px-6 md:px-10 relative z-10"
        style={{
          transform: `translateY(${scrollY * 0.35}px)`,
          opacity: Math.max(0, 1 - scrollY / 500),
        }}
      >
        <div
          ref={nameRef}
          className="w-full magnetic-target"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <h1 className="font-serif font-black tracking-[-0.04em] leading-[0.82] select-none">
            <span
              className={`block transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-24"
              }`}
              style={{ fontSize: firstNameSize }}
            >
              {firstName}
            </span>
            {lastName && (
              <span
                className={`block md:ml-[12%] transition-all duration-1000 delay-150 ease-out ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-24"
                }`}
                style={{ fontSize: lastNameSize }}
              >
                {lastName}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Bottom bar */}
      <footer className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 p-6 md:p-10">
        <p
          className={`max-w-sm text-base md:text-lg text-muted-foreground leading-relaxed transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {data.profile.tagline}
        </p>

        <div
          className={`flex flex-col items-start md:items-end gap-3 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-sm font-mono text-muted-foreground">{data.profile.location}</span>
          <span className="relative text-sm font-mono px-3 py-1 bg-foreground text-background pulse-ring">
            {data.profile.status}
          </span>
        </div>
      </footer>

      {/* Animated line */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-foreground origin-left transition-transform duration-1000 delay-300 ease-out ${
          isVisible ? "scale-x-100" : "scale-x-0"
        }`}
        style={{ width: "100%" }}
      />

      {/* Scroll hint */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: Math.max(0, 1 - scrollY / 150) }}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </span>
        <div className="w-px h-10 bg-foreground/30 overflow-hidden">
          <div className="w-full h-1/2 bg-foreground animate-bounce" />
        </div>
      </div>
    </section>
  )
}
