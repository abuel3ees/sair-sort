import { useEffect } from 'react';

import type { SectionSettings } from '@/lib/portfolio-context';

// ── Color scheme definitions ────────────────────────────
// Each scheme provides the full set of CSS vars that Tailwind v4 maps
// via @theme inline { --color-background: var(--background); ... }
// So overriding --background, --foreground, etc. changes bg-background, text-foreground, etc.
type SchemeVars = Record<string, string>;

const COLOR_SCHEMES: Record<string, { light: SchemeVars; dark: SchemeVars }> = {
    brutalist: {
        light: {
            '--background': 'oklch(0.99 0 0)',
            '--foreground': 'oklch(0.08 0 0)',
            '--card': 'oklch(0.97 0 0)',
            '--card-foreground': 'oklch(0.08 0 0)',
            '--primary': 'oklch(0.08 0 0)',
            '--primary-foreground': 'oklch(0.99 0 0)',
            '--secondary': 'oklch(0.96 0 0)',
            '--secondary-foreground': 'oklch(0.08 0 0)',
            '--muted': 'oklch(0.94 0 0)',
            '--muted-foreground': 'oklch(0.45 0 0)',
            '--accent': 'oklch(0.85 0.05 20)',
            '--accent-foreground': 'oklch(0.08 0 0)',
            '--border': 'oklch(0.90 0 0)',
            '--input': 'oklch(0.96 0 0)',
            '--ring': 'oklch(0.08 0 0)',
        },
        dark: {
            '--background': 'oklch(0.08 0 0)',
            '--foreground': 'oklch(0.95 0 0)',
            '--card': 'oklch(0.12 0 0)',
            '--card-foreground': 'oklch(0.95 0 0)',
            '--primary': 'oklch(0.95 0 0)',
            '--primary-foreground': 'oklch(0.08 0 0)',
            '--secondary': 'oklch(0.18 0 0)',
            '--secondary-foreground': 'oklch(0.95 0 0)',
            '--muted': 'oklch(0.18 0 0)',
            '--muted-foreground': 'oklch(0.60 0 0)',
            '--accent': 'oklch(0.75 0.08 20)',
            '--accent-foreground': 'oklch(0.08 0 0)',
            '--border': 'oklch(0.22 0 0)',
            '--input': 'oklch(0.18 0 0)',
            '--ring': 'oklch(0.95 0 0)',
        },
    },
    midnight: {
        light: {
            '--background': 'oklch(0.97 0.01 250)',
            '--foreground': 'oklch(0.15 0.03 250)',
            '--card': 'oklch(0.95 0.01 250)',
            '--card-foreground': 'oklch(0.15 0.03 250)',
            '--primary': 'oklch(0.15 0.03 250)',
            '--primary-foreground': 'oklch(0.97 0 0)',
            '--secondary': 'oklch(0.93 0.01 250)',
            '--secondary-foreground': 'oklch(0.15 0.03 250)',
            '--muted': 'oklch(0.93 0.01 250)',
            '--muted-foreground': 'oklch(0.45 0.02 250)',
            '--accent': 'oklch(0.75 0.15 80)',
            '--accent-foreground': 'oklch(0.15 0 0)',
            '--border': 'oklch(0.88 0.01 250)',
            '--input': 'oklch(0.93 0.01 250)',
            '--ring': 'oklch(0.15 0.03 250)',
        },
        dark: {
            '--background': 'oklch(0.15 0.03 250)',
            '--foreground': 'oklch(0.95 0.01 250)',
            '--card': 'oklch(0.19 0.03 250)',
            '--card-foreground': 'oklch(0.95 0.01 250)',
            '--primary': 'oklch(0.95 0.01 250)',
            '--primary-foreground': 'oklch(0.15 0.03 250)',
            '--secondary': 'oklch(0.22 0.03 250)',
            '--secondary-foreground': 'oklch(0.95 0.01 250)',
            '--muted': 'oklch(0.22 0.03 250)',
            '--muted-foreground': 'oklch(0.60 0.02 250)',
            '--accent': 'oklch(0.75 0.15 80)',
            '--accent-foreground': 'oklch(0.15 0 0)',
            '--border': 'oklch(0.28 0.03 250)',
            '--input': 'oklch(0.22 0.03 250)',
            '--ring': 'oklch(0.95 0.01 250)',
        },
    },
    forest: {
        light: {
            '--background': 'oklch(0.97 0.01 140)',
            '--foreground': 'oklch(0.15 0.04 140)',
            '--card': 'oklch(0.95 0.01 140)',
            '--card-foreground': 'oklch(0.15 0.04 140)',
            '--primary': 'oklch(0.15 0.04 140)',
            '--primary-foreground': 'oklch(0.97 0 0)',
            '--secondary': 'oklch(0.93 0.01 140)',
            '--secondary-foreground': 'oklch(0.15 0.04 140)',
            '--muted': 'oklch(0.93 0.01 140)',
            '--muted-foreground': 'oklch(0.45 0.03 140)',
            '--accent': 'oklch(0.65 0.15 145)',
            '--accent-foreground': 'oklch(0.15 0 0)',
            '--border': 'oklch(0.88 0.02 140)',
            '--input': 'oklch(0.93 0.01 140)',
            '--ring': 'oklch(0.15 0.04 140)',
        },
        dark: {
            '--background': 'oklch(0.15 0.04 140)',
            '--foreground': 'oklch(0.92 0.02 90)',
            '--card': 'oklch(0.19 0.04 140)',
            '--card-foreground': 'oklch(0.92 0.02 90)',
            '--primary': 'oklch(0.92 0.02 90)',
            '--primary-foreground': 'oklch(0.15 0.04 140)',
            '--secondary': 'oklch(0.22 0.04 140)',
            '--secondary-foreground': 'oklch(0.92 0.02 90)',
            '--muted': 'oklch(0.22 0.04 140)',
            '--muted-foreground': 'oklch(0.55 0.03 140)',
            '--accent': 'oklch(0.65 0.15 145)',
            '--accent-foreground': 'oklch(0.15 0 0)',
            '--border': 'oklch(0.28 0.04 140)',
            '--input': 'oklch(0.22 0.04 140)',
            '--ring': 'oklch(0.92 0.02 90)',
        },
    },
    rose: {
        light: {
            '--background': 'oklch(0.98 0.01 350)',
            '--foreground': 'oklch(0.15 0.01 30)',
            '--card': 'oklch(0.96 0.01 350)',
            '--card-foreground': 'oklch(0.15 0.01 30)',
            '--primary': 'oklch(0.55 0.22 10)',
            '--primary-foreground': 'oklch(0.98 0 0)',
            '--secondary': 'oklch(0.94 0.01 350)',
            '--secondary-foreground': 'oklch(0.15 0.01 30)',
            '--muted': 'oklch(0.94 0.01 350)',
            '--muted-foreground': 'oklch(0.50 0.02 350)',
            '--accent': 'oklch(0.55 0.22 10)',
            '--accent-foreground': 'oklch(0.98 0 0)',
            '--border': 'oklch(0.90 0.02 350)',
            '--input': 'oklch(0.94 0.01 350)',
            '--ring': 'oklch(0.55 0.22 10)',
        },
        dark: {
            '--background': 'oklch(0.12 0.02 350)',
            '--foreground': 'oklch(0.95 0.01 350)',
            '--card': 'oklch(0.16 0.02 350)',
            '--card-foreground': 'oklch(0.95 0.01 350)',
            '--primary': 'oklch(0.60 0.20 10)',
            '--primary-foreground': 'oklch(0.98 0 0)',
            '--secondary': 'oklch(0.20 0.02 350)',
            '--secondary-foreground': 'oklch(0.95 0.01 350)',
            '--muted': 'oklch(0.20 0.02 350)',
            '--muted-foreground': 'oklch(0.60 0.02 350)',
            '--accent': 'oklch(0.60 0.20 10)',
            '--accent-foreground': 'oklch(0.98 0 0)',
            '--border': 'oklch(0.25 0.02 350)',
            '--input': 'oklch(0.20 0.02 350)',
            '--ring': 'oklch(0.60 0.20 10)',
        },
    },
    ocean: {
        light: {
            '--background': 'oklch(0.98 0.01 175)',
            '--foreground': 'oklch(0.20 0.05 175)',
            '--card': 'oklch(0.96 0.01 175)',
            '--card-foreground': 'oklch(0.20 0.05 175)',
            '--primary': 'oklch(0.20 0.05 175)',
            '--primary-foreground': 'oklch(0.98 0 0)',
            '--secondary': 'oklch(0.94 0.01 175)',
            '--secondary-foreground': 'oklch(0.20 0.05 175)',
            '--muted': 'oklch(0.94 0.01 175)',
            '--muted-foreground': 'oklch(0.45 0.04 175)',
            '--accent': 'oklch(0.65 0.14 175)',
            '--accent-foreground': 'oklch(0.15 0 0)',
            '--border': 'oklch(0.88 0.02 175)',
            '--input': 'oklch(0.94 0.01 175)',
            '--ring': 'oklch(0.20 0.05 175)',
        },
        dark: {
            '--background': 'oklch(0.15 0.04 175)',
            '--foreground': 'oklch(0.95 0.01 175)',
            '--card': 'oklch(0.19 0.04 175)',
            '--card-foreground': 'oklch(0.95 0.01 175)',
            '--primary': 'oklch(0.95 0.01 175)',
            '--primary-foreground': 'oklch(0.15 0.04 175)',
            '--secondary': 'oklch(0.22 0.04 175)',
            '--secondary-foreground': 'oklch(0.95 0.01 175)',
            '--muted': 'oklch(0.22 0.04 175)',
            '--muted-foreground': 'oklch(0.55 0.03 175)',
            '--accent': 'oklch(0.65 0.14 175)',
            '--accent-foreground': 'oklch(0.15 0 0)',
            '--border': 'oklch(0.28 0.04 175)',
            '--input': 'oklch(0.22 0.04 175)',
            '--ring': 'oklch(0.95 0.01 175)',
        },
    },
    amber: {
        light: {
            '--background': 'oklch(0.99 0.01 80)',
            '--foreground': 'oklch(0.18 0.02 40)',
            '--card': 'oklch(0.97 0.01 80)',
            '--card-foreground': 'oklch(0.18 0.02 40)',
            '--primary': 'oklch(0.18 0.02 40)',
            '--primary-foreground': 'oklch(0.99 0 0)',
            '--secondary': 'oklch(0.95 0.01 80)',
            '--secondary-foreground': 'oklch(0.18 0.02 40)',
            '--muted': 'oklch(0.95 0.01 80)',
            '--muted-foreground': 'oklch(0.50 0.03 60)',
            '--accent': 'oklch(0.70 0.15 70)',
            '--accent-foreground': 'oklch(0.15 0 0)',
            '--border': 'oklch(0.90 0.02 80)',
            '--input': 'oklch(0.95 0.01 80)',
            '--ring': 'oklch(0.18 0.02 40)',
        },
        dark: {
            '--background': 'oklch(0.14 0.02 40)',
            '--foreground': 'oklch(0.95 0.01 80)',
            '--card': 'oklch(0.18 0.02 40)',
            '--card-foreground': 'oklch(0.95 0.01 80)',
            '--primary': 'oklch(0.95 0.01 80)',
            '--primary-foreground': 'oklch(0.14 0.02 40)',
            '--secondary': 'oklch(0.22 0.02 40)',
            '--secondary-foreground': 'oklch(0.95 0.01 80)',
            '--muted': 'oklch(0.22 0.02 40)',
            '--muted-foreground': 'oklch(0.55 0.03 60)',
            '--accent': 'oklch(0.70 0.15 70)',
            '--accent-foreground': 'oklch(0.14 0 0)',
            '--border': 'oklch(0.28 0.02 40)',
            '--input': 'oklch(0.22 0.02 40)',
            '--ring': 'oklch(0.95 0.01 80)',
        },
    },
    nord: {
        light: {
            '--background': 'oklch(0.96 0.01 230)',
            '--foreground': 'oklch(0.25 0.03 240)',
            '--card': 'oklch(0.94 0.01 230)',
            '--card-foreground': 'oklch(0.25 0.03 240)',
            '--primary': 'oklch(0.25 0.03 240)',
            '--primary-foreground': 'oklch(0.96 0 0)',
            '--secondary': 'oklch(0.92 0.01 230)',
            '--secondary-foreground': 'oklch(0.25 0.03 240)',
            '--muted': 'oklch(0.92 0.01 230)',
            '--muted-foreground': 'oklch(0.50 0.02 230)',
            '--accent': 'oklch(0.75 0.08 210)',
            '--accent-foreground': 'oklch(0.20 0 0)',
            '--border': 'oklch(0.88 0.01 230)',
            '--input': 'oklch(0.92 0.01 230)',
            '--ring': 'oklch(0.25 0.03 240)',
        },
        dark: {
            '--background': 'oklch(0.22 0.03 240)',
            '--foreground': 'oklch(0.94 0.01 230)',
            '--card': 'oklch(0.26 0.03 240)',
            '--card-foreground': 'oklch(0.94 0.01 230)',
            '--primary': 'oklch(0.94 0.01 230)',
            '--primary-foreground': 'oklch(0.22 0.03 240)',
            '--secondary': 'oklch(0.28 0.03 240)',
            '--secondary-foreground': 'oklch(0.94 0.01 230)',
            '--muted': 'oklch(0.28 0.03 240)',
            '--muted-foreground': 'oklch(0.60 0.02 230)',
            '--accent': 'oklch(0.75 0.08 210)',
            '--accent-foreground': 'oklch(0.20 0 0)',
            '--border': 'oklch(0.32 0.03 240)',
            '--input': 'oklch(0.28 0.03 240)',
            '--ring': 'oklch(0.94 0.01 230)',
        },
    },
    mono: {
        light: {
            '--background': 'oklch(1 0 0)',
            '--foreground': 'oklch(0 0 0)',
            '--card': 'oklch(0.97 0 0)',
            '--card-foreground': 'oklch(0 0 0)',
            '--primary': 'oklch(0 0 0)',
            '--primary-foreground': 'oklch(1 0 0)',
            '--secondary': 'oklch(0.95 0 0)',
            '--secondary-foreground': 'oklch(0 0 0)',
            '--muted': 'oklch(0.95 0 0)',
            '--muted-foreground': 'oklch(0.40 0 0)',
            '--accent': 'oklch(0.45 0 0)',
            '--accent-foreground': 'oklch(1 0 0)',
            '--border': 'oklch(0.85 0 0)',
            '--input': 'oklch(0.95 0 0)',
            '--ring': 'oklch(0 0 0)',
        },
        dark: {
            '--background': 'oklch(0.05 0 0)',
            '--foreground': 'oklch(1 0 0)',
            '--card': 'oklch(0.10 0 0)',
            '--card-foreground': 'oklch(1 0 0)',
            '--primary': 'oklch(1 0 0)',
            '--primary-foreground': 'oklch(0 0 0)',
            '--secondary': 'oklch(0.15 0 0)',
            '--secondary-foreground': 'oklch(1 0 0)',
            '--muted': 'oklch(0.15 0 0)',
            '--muted-foreground': 'oklch(0.60 0 0)',
            '--accent': 'oklch(0.55 0 0)',
            '--accent-foreground': 'oklch(0 0 0)',
            '--border': 'oklch(0.20 0 0)',
            '--input': 'oklch(0.15 0 0)',
            '--ring': 'oklch(1 0 0)',
        },
    },
};

// ── Animation class mapping ─────────────────────────────
export const ANIMATION_CLASSES: Record<string, string> = {
    reveal: 'reveal-up',
    fade: 'fade-in',
    slide: 'slide-in-left',
    scale: 'scale-in',
    clip: 'clip-reveal',
    none: '',
};

// ── Font URL builder (Bunny Fonts) ──────────────────────
function buildFontUrl(fonts: string[]): string {
    const unique = [...new Set(fonts)].filter(Boolean);
    const params = unique
        .map((f) => `family=${f.replace(/ /g, '+')}:400,500,600,700,800,900`)
        .join('&');
    return `https://fonts.bunny.net/css?${params}&display=swap`;
}

// Keys we set on :root that need cleanup on unmount
const ALL_COLOR_KEYS = [
    '--background', '--foreground', '--card', '--card-foreground',
    '--primary', '--primary-foreground', '--secondary', '--secondary-foreground',
    '--muted', '--muted-foreground', '--accent', '--accent-foreground',
    '--border', '--input', '--ring',
];

type ThemeProviderProps = {
    settings: SectionSettings;
    children: React.ReactNode;
};

export function ThemeProvider({ settings, children }: ThemeProviderProps) {
    const { fontHeading, fontBody, colorScheme, animationStyle } = settings;

    // ── Fonts ──────────────────────────────────────────
    // Load the chosen fonts from Bunny CDN, then override Tailwind's
    // --font-sans and --font-serif so every component picks them up.
    // Also set --font-heading for the hero section's inline style.
    useEffect(() => {
        // Inject / update the font stylesheet
        const existingLink = document.getElementById('sair-dynamic-fonts');
        const newUrl = buildFontUrl([fontHeading, fontBody]);

        if (existingLink instanceof HTMLLinkElement) {
            existingLink.href = newUrl;
        } else {
            const link = document.createElement('link');
            link.id = 'sair-dynamic-fonts';
            link.rel = 'stylesheet';
            link.href = newUrl;
            document.head.appendChild(link);
        }

        const root = document.documentElement;

        // --font-heading: used by hero h1 via inline style
        root.style.setProperty('--font-heading', `'${fontHeading}', serif`);
        // --font-body: convenience alias
        root.style.setProperty('--font-body', `'${fontBody}', sans-serif`);
        // Override Tailwind's font stacks so font-sans / font-serif classes work
        root.style.setProperty('--font-sans', `'${fontBody}', system-ui, sans-serif`);
        root.style.setProperty('--font-serif', `'${fontHeading}', serif`);

        return () => {
            root.style.removeProperty('--font-heading');
            root.style.removeProperty('--font-body');
            root.style.removeProperty('--font-sans');
            root.style.removeProperty('--font-serif');
        };
    }, [fontHeading, fontBody]);

    // ── Colors ─────────────────────────────────────────
    // Override the CSS custom properties that Tailwind's @theme inline maps
    // e.g. --background → --color-background → bg-background
    useEffect(() => {
        const scheme = COLOR_SCHEMES[colorScheme] ?? COLOR_SCHEMES.brutalist;
        const root = document.documentElement;

        const applyVars = () => {
            const isDark = root.classList.contains('dark');
            const vars = isDark ? scheme.dark : scheme.light;
            Object.entries(vars).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
            // Capture originals so section-level swaps can reference them
            root.style.setProperty('--foreground-orig', vars['--foreground']);
            root.style.setProperty('--background-orig', vars['--background']);
        };

        applyVars();

        // Re-apply when dark/light mode toggles
        const observer = new MutationObserver(applyVars);
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
            ALL_COLOR_KEYS.forEach((key) => root.style.removeProperty(key));
            root.style.removeProperty('--foreground-orig');
            root.style.removeProperty('--background-orig');
        };
    }, [colorScheme]);

    // ── Animations ─────────────────────────────────────
    useEffect(() => {
        document.documentElement.dataset.animation = animationStyle;
        return () => {
            delete document.documentElement.dataset.animation;
        };
    }, [animationStyle]);

    return <>{children}</>;
}
