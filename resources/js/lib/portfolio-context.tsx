"use client"

import React, { createContext, useContext } from "react"

// ── Types ──────────────────────────────────────────────
export type Profile = {
  name: string
  tagline: string
  heroSubtitle: string
  bio: string
  email: string
  github: string
  linkedin: string
  twitter: string
  dribbble: string
  website: string
  location: string
  status: string
  contactCta: string
  footerText: string
  hasCv: boolean
}

export type ProjectImage = {
  id: string
  url: string
  originalName: string
  mimeType: string
}

export type Project = {
  id: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  status: "completed" | "in-progress" | "planned"
  github?: string
  demo?: string
  images?: ProjectImage[]
}

export type Experience = {
  id: string
  company: string
  role: string
  duration: string
  description: string
  type: "full-time" | "part-time" | "internship" | "contract"
  technologies: string[]
}

export type Education = {
  id: string
  institution: string
  degree: string
  field: string
  duration: string
  gpa?: string
  highlights: string[]
}

export type ElementVisibility = Record<string, boolean>

export type SectionSettings = {
  sectionOrder: string[]
  visibleSections: string[]
  fontHeading: string
  fontBody: string
  colorScheme: string
  animationStyle: string
  nameFontSize: number
  siteTitle: string
  faviconUrl: string | null
  sectionBackgrounds: Record<string, "default" | "inverted">
  elementVisibility: ElementVisibility
}

export const ALL_SECTIONS = ["hero", "projects", "experience", "education", "contact"] as const
export type SectionId = (typeof ALL_SECTIONS)[number]

export type PortfolioData = {
  profile: Profile
  projects: Project[]
  experience: Experience[]
  education: Education[]
  settings: SectionSettings
}

type PortfolioContextValue = {
  data: PortfolioData
}

// ── Default data (used as fallback when no backend data is provided) ──
const defaultData: PortfolioData = {
  profile: {
    name: "Your Name",
    tagline: "Software Engineer & Creative Developer",
    heroSubtitle: "",
    bio: "A passionate developer building cool things.",
    email: "hello@example.com",
    github: "yourusername",
    linkedin: "yourusername",
    twitter: "",
    dribbble: "",
    website: "",
    location: "San Francisco, CA",
    status: "Open to work",
    contactCta: "Let's Talk",
    footerText: "Built with Sair",
    hasCv: false,
  },
  projects: [],
  experience: [],
  education: [],
  settings: {
    sectionOrder: [...ALL_SECTIONS],
    visibleSections: [...ALL_SECTIONS],
    fontHeading: "Inter",
    fontBody: "Inter",
    colorScheme: "brutalist",
    animationStyle: "reveal",
    nameFontSize: 14,
    siteTitle: "",
    faviconUrl: null,
    sectionBackgrounds: {
      hero: "default",
      projects: "inverted",
      experience: "default",
      education: "inverted",
      contact: "default",
    },
    elementVisibility: {},
  },
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined)

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: React.ReactNode
  initialData?: Partial<PortfolioData>
}) {
  const data: PortfolioData = {
    ...defaultData,
    ...initialData,
    profile: { ...defaultData.profile, ...(initialData?.profile ?? {}) },
    settings: { ...defaultData.settings, ...(initialData?.settings ?? {}) },
  }

  return <PortfolioContext.Provider value={{ data }}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error("usePortfolio must be used within a PortfolioProvider")
  return ctx
}

/**
 * Maps individual effect keys to their parent group toggle.
 * When the group toggle is off, all children are off regardless of their own value.
 */
const EFFECT_GROUPS: Record<string, string> = {
  cursor_trail: "effects_cursor",
  spotlight_cursor: "effects_cursor",
  magnetic_buttons: "effects_cursor",
  smooth_scroll: "effects_scroll",
  scroll_progress: "effects_scroll",
  section_wipe: "effects_scroll",
  text_reveal: "effects_scroll",
  staggered_text: "effects_scroll",
  back_to_top: "effects_scroll",
  particles: "effects_visual",
  marquee_ticker: "effects_visual",
  parallax_strip: "effects_visual",
  glitch_text: "effects_visual",
  typewriter_subtitle: "effects_visual",
  scramble_headings: "effects_visual",
  konami_code: "effects_easter_eggs",
  page_transition: "effects_scroll",
}

/** Check if an element is visible (defaults to true when key is missing) */
export function useVisible(key: string): boolean {
  const { data } = usePortfolio()
  const vis = data.settings.elementVisibility

  // If this key belongs to a group, check the group toggle first
  const groupKey = EFFECT_GROUPS[key]
  if (groupKey) {
    const groupVal = vis[groupKey]
    if (groupVal !== undefined && !groupVal) return false
  }

  const val = vis[key]
  return val === undefined ? true : Boolean(val)
}
