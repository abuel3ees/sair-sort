"use client"

import { ArrowLeft, ArrowRight, ArrowUpRight, Github, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { usePortfolio } from "@/lib/portfolio-context"

import type { Project } from "@/lib/portfolio-context"

export function ProjectsSection() {
  const { data } = usePortfolio()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollToProject = useCallback(
    (index: number) => {
      if (!scrollRef.current || data.projects.length === 0) return
      const clampedIndex = Math.max(0, Math.min(index, data.projects.length - 1))
      setActiveIndex(clampedIndex)
      const projectWidth = scrollRef.current.scrollWidth / data.projects.length
      scrollRef.current.scrollTo({
        left: clampedIndex * projectWidth,
        behavior: "smooth",
      })
    },
    [data.projects.length],
  )

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || data.projects.length === 0) return
    const projectWidth = scrollRef.current.scrollWidth / data.projects.length
    const newIndex = Math.round(scrollRef.current.scrollLeft / projectWidth)
    if (newIndex !== activeIndex) setActiveIndex(newIndex)
  }, [activeIndex, data.projects.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isInView) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") scrollToProject(activeIndex + 1)
      else if (e.key === "ArrowLeft") scrollToProject(activeIndex - 1)
      else if (e.key === "Enter") {
        const project = data.projects[activeIndex]
        if (project) setSelectedProject(project)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isInView, activeIndex, scrollToProject, data.projects])

  // Empty state
  if (data.projects.length === 0) {
    return (
      <section id="work" className="bg-foreground text-background min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6">
          <span className="text-xs font-mono tracking-widest opacity-50 block mb-6">SELECTED WORK</span>
          <h2
            className="font-serif font-black tracking-[-0.03em] leading-[0.9] mb-6"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
          >
            Coming Soon
          </h2>
          <p className="text-lg opacity-50 max-w-md mx-auto">
            Projects are being curated. Check back soon.
          </p>
          <div className="mt-12 w-24 h-px bg-background/20 mx-auto" />
        </div>
      </section>
    )
  }

  const progress = (activeIndex + 1) / data.projects.length

  return (
    <>
      <section
        ref={containerRef}
        id="work"
        className="bg-foreground text-background min-h-screen relative overflow-hidden"
      >
        {/* Section progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-background/10 z-30">
          <div
            className="h-full bg-background/60 transition-all duration-500 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Fixed header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 md:p-10 flex justify-between items-start pointer-events-none">
          <div
            className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <span className="text-xs font-mono tracking-widest opacity-50 block mb-1">SELECTED</span>
            <span className="text-xs font-mono tracking-widest">WORK</span>
          </div>

          <div
            className={`font-mono text-sm transition-all duration-700 delay-300 ${isInView ? "opacity-100" : "opacity-0"}`}
          >
            <span className="text-6xl md:text-8xl font-serif font-black tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="opacity-30 mx-2">/</span>
            <span className="opacity-30">{String(data.projects.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute bottom-10 left-6 md:left-10 z-20 flex items-center gap-4">
          <button
            onClick={() => scrollToProject(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="w-12 h-12 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous project"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollToProject(activeIndex + 1)}
            disabled={activeIndex === data.projects.length - 1}
            className="w-12 h-12 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Next project"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-mono tracking-widest opacity-30 ml-2 hidden md:inline">
            ← → KEYS
          </span>
        </div>

        {/* Project index dots */}
        <div className="absolute bottom-10 right-6 md:right-10 z-20 flex gap-2">
          {data.projects.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToProject(index)}
              className={`h-2 transition-all duration-300 ${
                index === activeIndex ? "bg-background w-8" : "bg-background/30 w-2 hover:bg-background/50"
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory h-screen scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {data.projects.map((project, index) => (
            <ProjectSlide
              key={project.id}
              project={project}
              index={index}
              isActive={index === activeIndex}
              onViewDetails={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </section>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  )
}

function ProjectSlide({
  project,
  index,
  isActive,
  onViewDetails,
}: {
  project: Project
  index: number
  isActive: boolean
  onViewDetails: () => void
}) {
  return (
    <article className="shrink-0 w-screen h-screen snap-center flex flex-col justify-center px-6 md:px-20 lg:px-32 relative">
      {/* Large background number */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-black text-background/3 pointer-events-none transition-all duration-700 select-none ${
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        style={{ fontSize: "clamp(20rem, 50vw, 50rem)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl">
        {/* Tags row */}
        <div
          className={`flex flex-wrap gap-3 mb-6 transition-all duration-500 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono tracking-widest uppercase border border-background/30 px-3 py-1 hover:bg-background/10 transition-colors"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[10px] font-mono tracking-widest opacity-40">+{project.tags.length - 4}</span>
          )}
          <span
            className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 ${
              project.status === "completed"
                ? "bg-background text-foreground"
                : project.status === "in-progress"
                  ? "border border-background/50 text-background/80"
                  : "border border-background/30 opacity-50"
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-serif font-black tracking-[-0.04em] leading-[0.85] mb-8 transition-all duration-700 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
        >
          {project.title}
        </h2>

        {/* Description */}
        <p
          className={`text-lg md:text-xl leading-relaxed max-w-2xl mb-10 transition-all duration-500 delay-200 ${
            isActive ? "opacity-70 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {project.description}
        </p>

        {/* Actions */}
        <div
          className={`flex items-center gap-6 transition-all duration-500 delay-300 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={onViewDetails}
            className="group inline-flex items-center gap-3 text-sm font-mono uppercase tracking-widest hover:gap-5 transition-all"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono opacity-50 hover:opacity-100 transition-opacity"
            >
              <Github className="w-4 h-4" />
              <span>Code</span>
            </a>
          )}

          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono opacity-50 hover:opacity-100 transition-opacity"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Decorative line */}
      <div
        className={`absolute bottom-32 left-6 md:left-20 lg:left-32 h-px bg-background/20 transition-all duration-1000 ${
          isActive ? "w-32 md:w-48" : "w-0"
        }`}
      />
    </article>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, 400)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true))
    })

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleEsc)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEsc)
    }
  }, [handleClose])

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-background transition-opacity duration-400 ${isVisible ? "opacity-95" : "opacity-0"}`}
        onClick={handleClose}
      />

      <div
        className={`absolute inset-0 md:inset-6 lg:inset-12 bg-background border-2 border-foreground overflow-auto transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <button
          onClick={handleClose}
          className="fixed top-4 right-4 md:top-8 md:right-8 z-10 p-3 bg-foreground text-background hover:bg-foreground/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="min-h-full p-6 md:p-12 lg:p-20">
          {/* Project image placeholder */}
          <div className="aspect-video w-full img-placeholder mb-12 md:mb-16 flex items-center justify-center border border-foreground/10">
            <span className="text-sm font-mono text-muted-foreground/40 uppercase tracking-widest">
              {project.title}
            </span>
          </div>

          <header className="mb-12 md:mb-20">
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono px-2 py-1 border border-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <h1
              className="font-serif font-black tracking-[-0.03em] leading-[0.9] mb-6"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              {project.title}
            </h1>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-mono px-3 py-1 ${
                  project.status === "completed" ? "bg-foreground text-background" : "border border-foreground"
                }`}
              >
                {project.status.replace("-", " ")}
              </span>
            </div>
          </header>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Overview</h2>
              <div className="text-lg md:text-xl leading-relaxed whitespace-pre-line">{project.longDescription}</div>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm font-mono px-4 py-2 border border-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background hover:bg-foreground/80 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="font-mono text-sm">Source</span>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    <span className="font-mono text-sm">Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
