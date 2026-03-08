"use client"

import React, { createContext, useContext } from "react"

// ── Types ──────────────────────────────────────────────
export type Profile = {
  name: string
  tagline: string
  bio: string
  email: string
  github: string
  linkedin: string
  location: string
  status: string
  hasCv: boolean
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

export type SectionSettings = {
  sectionOrder: string[]
  visibleSections: string[]
  fontHeading: string
  fontBody: string
  colorScheme: string
  animationStyle: string
  nameFontSize: number
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
    bio: "A passionate developer building cool things.",
    email: "hello@example.com",
    github: "yourusername",
    linkedin: "yourusername",
    location: "San Francisco, CA",
    status: "Open to work",
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
