"use client"

import { Head } from "@inertiajs/react"
import { useMemo } from "react"

import { BackToTop } from "@/components/portfolio/back-to-top"
import { ContactSection } from "@/components/portfolio/contact-section"
import { CursorTrail } from "@/components/portfolio/cursor-trail"
import { EducationSection } from "@/components/portfolio/education-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { FloatingParticles } from "@/components/portfolio/floating-particles"
import { HeroSection } from "@/components/portfolio/hero-section"
import { KonamiEasterEgg } from "@/components/portfolio/konami-easter-egg"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { SectionWipe } from "@/components/portfolio/section-wipe"
import { SmoothScroll } from "@/components/portfolio/smooth-scroll"
import { PortfolioProvider, usePortfolio } from "@/lib/portfolio-context"
import type { PortfolioData, SectionId } from "@/lib/portfolio-context"
import { ThemeProvider } from "@/lib/theme-provider"


type Props = {
  portfolio?: Partial<PortfolioData>
}

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  hero: HeroSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
  contact: ContactSection,
}

function PortfolioSections() {
  const { data } = usePortfolio()
  const { sectionOrder, visibleSections } = data.settings
  const showSectionWipe = (data.settings.elementVisibility as Record<string, boolean>)?.section_wipe !== false

  const visibleSet = useMemo(() => new Set(visibleSections), [visibleSections])

  return (
    <>
      {sectionOrder.map((id: string) => {
        if (!visibleSet.has(id)) return null
        const Component = SECTION_COMPONENTS[id as SectionId]
        if (!Component) return null
        return showSectionWipe ? (
          <SectionWipe key={id}>
            <Component />
          </SectionWipe>
        ) : (
          <Component key={id} />
        )
      })}
    </>
  )
}

function PortfolioContent() {
  const { data } = usePortfolio()

  return (
    <ThemeProvider settings={data.settings}>
      <Head title="Portfolio" />
      <SmoothScroll />
      <CursorTrail />
      <FloatingParticles />
      <KonamiEasterEgg />
      <main className="bg-background">
        <PortfolioSections />
      </main>
      <BackToTop />
    </ThemeProvider>
  )
}

export default function PortfolioPage({ portfolio }: Props) {
  return (
    <PortfolioProvider initialData={portfolio}>
      <PortfolioContent />
    </PortfolioProvider>
  )
}
