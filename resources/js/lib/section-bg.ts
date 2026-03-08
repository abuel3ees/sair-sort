import type { SectionSettings } from "@/lib/portfolio-context"

/**
 * Each section has a "native" look (how it was originally coded).
 * When the user picks the opposite, we locally swap --foreground / --background
 * CSS vars so every inner Tailwind class automatically adapts.
 */
const NATIVE_MODE: Record<string, "default" | "inverted"> = {
  hero: "default",
  projects: "inverted",
  experience: "default",
  education: "inverted",
  contact: "default",
}

export function sectionBg(
  settings: SectionSettings,
  sectionId: string,
): React.CSSProperties | undefined {
  const wanted = settings.sectionBackgrounds?.[sectionId] ?? NATIVE_MODE[sectionId] ?? "default"
  const native = NATIVE_MODE[sectionId] ?? "default"

  // If the user wants the same as native → no override needed
  if (wanted === native) return undefined

  // Otherwise swap the foreground and background CSS vars locally on this element.
  // We read the current computed values and swap them.
  // Using oklch vars directly isn't viable, so we use a simpler trick:
  // set CSS variables that Tailwind references.
  return {
    "--background": "var(--foreground-orig)",
    "--foreground": "var(--background-orig)",
  } as React.CSSProperties
}

/**
 * CSS that must be injected once (in ThemeProvider or a global style) to
 * capture the original --background and --foreground values before any
 * section-level swap.
 *
 * Add to :root or the portfolio wrapper:
 *   --foreground-orig: var(--foreground);
 *   --background-orig: var(--background);
 */
export const SECTION_BG_ROOT_VARS = {
  "--foreground-orig": "var(--foreground)",
  "--background-orig": "var(--background)",
} as React.CSSProperties
