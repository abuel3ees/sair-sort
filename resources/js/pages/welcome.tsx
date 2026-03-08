"use client"

import { Head } from "@inertiajs/react"
import { useMemo } from "react"

import { ContactSection } from "@/components/portfolio/contact-section"
import { EducationSection } from "@/components/portfolio/education-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { HeroSection } from "@/components/portfolio/hero-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
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

  const visibleSet = useMemo(() => new Set(visibleSections), [visibleSections])

  return (
    <>
      {sectionOrder.map((id: string) => {
        if (!visibleSet.has(id)) return null
        const Component = SECTION_COMPONENTS[id as SectionId]
        if (!Component) return null
        return <Component key={id} />
      })}
    </>
  )
}

function PortfolioContent() {
  const { data } = usePortfolio()

  return (
    <ThemeProvider settings={data.settings}>
      <Head title="Portfolio" />
      <main className="bg-background">
        <PortfolioSections />
      </main>
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
