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
import { MarqueeTicker } from "@/components/portfolio/marquee-ticker"
import { ParallaxStrip } from "@/components/portfolio/parallax-strip"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { SectionWipe } from "@/components/portfolio/section-wipe"
import { SmoothScroll } from "@/components/portfolio/smooth-scroll"
import { SpotlightCursor } from "@/components/portfolio/spotlight-cursor"
import type { PortfolioData, SectionId } from "@/lib/portfolio-context"
import { PortfolioProvider, usePortfolio } from "@/lib/portfolio-context"
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
  const vis = data.settings.elementVisibility as Record<string, boolean>
  const showSectionWipe = vis.effects_scroll !== false && vis.section_wipe !== false

  const visibleSet = useMemo(() => new Set(visibleSections), [visibleSections])

  const sections = sectionOrder
    .filter((id: string) => visibleSet.has(id))
    .map((id: string) => ({ id, Component: SECTION_COMPONENTS[id as SectionId] }))
    .filter(({ Component }) => Boolean(Component))

  return (
    <>
      {sections.map(({ id, Component }, i) => {
        const section = showSectionWipe ? (
          <SectionWipe key={id}>
            <Component />
          </SectionWipe>
        ) : (
          <Component key={id} />
        )

        // Insert marquee ticker after the first section
        if (i === 0) {
          return (
            <div key={id}>
              {section}
              <MarqueeTicker />
            </div>
          )
        }

        // Insert parallax strip before the last section
        if (i === sections.length - 1) {
          return (
            <div key={id}>
              <ParallaxStrip />
              {section}
            </div>
          )
        }

        return section
      })}
    </>
  )
}

function PortfolioContent() {
  const { data } = usePortfolio()
  const pageTitle = data.settings.siteTitle || data.profile.name || "Portfolio"

  return (
    <ThemeProvider settings={data.settings}>
      <Head title={pageTitle}>
        {data.settings.faviconUrl && (
          <link rel="icon" href={data.settings.faviconUrl} />
        )}
      </Head>
      <SmoothScroll />
      <CursorTrail />
      <FloatingParticles />
      <KonamiEasterEgg />
      <SpotlightCursor />
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
