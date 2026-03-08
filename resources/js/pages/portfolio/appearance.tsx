import { Head, useForm } from '@inertiajs/react';
import { Check, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'Appearance', href: '/portfolio/appearance' },
];

// ── Font options ────────────────────────────────────────
const FONT_OPTIONS = [
    { value: 'Inter', label: 'Inter', category: 'sans-serif', preview: 'font-sans' },
    { value: 'Space Mono', label: 'Space Mono', category: 'monospace', preview: 'font-mono' },
    { value: 'Playfair Display', label: 'Playfair Display', category: 'serif', preview: 'font-serif' },
    { value: 'Space Grotesk', label: 'Space Grotesk', category: 'sans-serif', preview: 'font-sans' },
    { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'monospace', preview: 'font-mono' },
    { value: 'Instrument Serif', label: 'Instrument Serif', category: 'serif', preview: 'font-serif' },
    { value: 'DM Sans', label: 'DM Sans', category: 'sans-serif', preview: 'font-sans' },
    { value: 'IBM Plex Mono', label: 'IBM Plex Mono', category: 'monospace', preview: 'font-mono' },
    { value: 'Cormorant Garamond', label: 'Cormorant Garamond', category: 'serif', preview: 'font-serif' },
    { value: 'Geist', label: 'Geist', category: 'sans-serif', preview: 'font-sans' },
    { value: 'Syne', label: 'Syne', category: 'sans-serif', preview: 'font-sans' },
    { value: 'Outfit', label: 'Outfit', category: 'sans-serif', preview: 'font-sans' },
];

// ── Color scheme presets ────────────────────────────────
const COLOR_SCHEMES = [
    {
        value: 'brutalist',
        label: 'Brutalist',
        description: 'Pure black & white editorial',
        bg: '#fafafa',
        fg: '#141414',
        accent: '#d4a574',
    },
    {
        value: 'midnight',
        label: 'Midnight',
        description: 'Dark blue & warm gold',
        bg: '#0f172a',
        fg: '#f1f5f9',
        accent: '#f59e0b',
    },
    {
        value: 'forest',
        label: 'Forest',
        description: 'Deep green & cream',
        bg: '#1a2e1a',
        fg: '#e8e4d9',
        accent: '#6abf69',
    },
    {
        value: 'rose',
        label: 'Rosé',
        description: 'Warm pink & charcoal',
        bg: '#fdf2f8',
        fg: '#1c1917',
        accent: '#e11d48',
    },
    {
        value: 'ocean',
        label: 'Ocean',
        description: 'Teal & white',
        bg: '#f0fdfa',
        fg: '#134e4a',
        accent: '#14b8a6',
    },
    {
        value: 'amber',
        label: 'Amber',
        description: 'Warm amber & dark brown',
        bg: '#fffbeb',
        fg: '#292524',
        accent: '#d97706',
    },
    {
        value: 'nord',
        label: 'Nord',
        description: 'Polar night & frost',
        bg: '#2e3440',
        fg: '#eceff4',
        accent: '#88c0d0',
    },
    {
        value: 'mono',
        label: 'Mono',
        description: 'Pure grayscale, zero color',
        bg: '#ffffff',
        fg: '#000000',
        accent: '#666666',
    },
];

// ── Animation styles ────────────────────────────────────
const ANIMATION_STYLES = [
    {
        value: 'reveal',
        label: 'Reveal Up',
        description: 'Elements slide up and fade in with stagger',
    },
    {
        value: 'fade',
        label: 'Fade In',
        description: 'Simple opacity fade, no motion',
    },
    {
        value: 'slide',
        label: 'Slide In',
        description: 'Elements slide from alternating directions',
    },
    {
        value: 'scale',
        label: 'Scale Up',
        description: 'Elements grow from 95% with fade',
    },
    {
        value: 'clip',
        label: 'Clip Reveal',
        description: 'Content reveals via clip-path mask',
    },
    {
        value: 'none',
        label: 'No Animation',
        description: 'Everything appears instantly',
    },
];

// ── Element visibility groups ───────────────────────────
const VISIBILITY_GROUPS = [
    {
        label: 'Hero Section',
        items: [
            { key: 'hero_nav', label: 'Navigation Links', description: 'Top-left nav menu' },
            { key: 'hero_time', label: 'Clock & Year', description: 'Top-right live clock' },
            { key: 'hero_tagline', label: 'Tagline', description: 'Bottom-left description' },
            { key: 'hero_location', label: 'Location', description: 'Bottom-right city' },
            { key: 'hero_status', label: 'Status Badge', description: '"Open to work" pill' },
            { key: 'hero_scroll_hint', label: 'Scroll Hint', description: 'Bottom scroll indicator' },
            { key: 'hero_line', label: 'Animated Line', description: 'Bottom border animation' },
            { key: 'hero_grain', label: 'Grain Texture', description: 'Film grain overlay' },
            { key: 'hero_parallax', label: 'Parallax Effect', description: 'Name moves on scroll' },
        ],
    },
    {
        label: 'Projects Section',
        items: [
            { key: 'projects_progress_bar', label: 'Progress Bar', description: 'Top slide progress' },
            { key: 'projects_counter', label: 'Slide Counter', description: 'Big 01/05 number' },
            { key: 'projects_tags', label: 'Tags', description: 'Tech stack tags per project' },
            { key: 'projects_status_badge', label: 'Status Badge', description: 'Completed / In Progress label' },
            { key: 'projects_bg_number', label: 'Background Number', description: 'Giant watermark number' },
            { key: 'projects_keyboard_hint', label: 'Keyboard Hint', description: '"← → KEYS" label' },
        ],
    },
    {
        label: 'Experience Section',
        items: [
            { key: 'experience_count', label: 'Role Count', description: '"X roles across…" subtitle' },
            { key: 'experience_timeline_dot', label: 'Timeline Dot', description: 'Left-side dot indicator' },
            { key: 'experience_type_badge', label: 'Type Badge', description: 'Full-time / Internship pill' },
            { key: 'experience_technologies', label: 'Technologies', description: 'Tech stack tags per role' },
        ],
    },
    {
        label: 'Education Section',
        items: [
            { key: 'education_gpa', label: 'GPA Counter', description: 'Animated GPA number' },
            { key: 'education_highlights', label: 'Highlights', description: 'Bullet list per entry' },
            { key: 'education_bio', label: 'Bio / About', description: 'About section at bottom' },
        ],
    },
    {
        label: 'Contact Section',
        items: [
            { key: 'contact_email_scramble', label: 'Email (Scramble)', description: 'Email with hover effect' },
            { key: 'contact_socials', label: 'Social Links', description: 'GitHub, LinkedIn, Twitter…' },
            { key: 'contact_location', label: 'Location', description: 'City display' },
            { key: 'contact_footer', label: 'Footer', description: 'Copyright & dashboard link' },
        ],
    },
    {
        label: 'Global Effects',
        items: [
            { key: 'scroll_progress', label: 'Scroll Progress Bar', description: 'Top-of-page progress line' },
            { key: 'cursor_trail', label: 'Cursor Trail', description: 'Glowing dot follows mouse' },
            { key: 'back_to_top', label: 'Back to Top', description: 'Floating scroll-to-top button' },
            { key: 'smooth_scroll', label: 'Smooth Scroll', description: 'CSS smooth scrolling behavior' },
            { key: 'particles', label: 'Floating Particles', description: 'Canvas geometric shapes drifting' },
            { key: 'konami_code', label: 'Konami Code Easter Egg', description: '↑↑↓↓←→←→BA triggers confetti' },
            { key: 'staggered_text', label: 'Staggered Name Animation', description: 'Per-character hero name reveal' },
            { key: 'magnetic_buttons', label: 'Magnetic Buttons', description: 'Links follow cursor on hover' },
            { key: 'section_wipe', label: 'Section Wipe Reveal', description: 'Curtain reveal on scroll' },
            { key: 'text_reveal', label: 'Text Reveal on Scroll', description: 'Word-by-word bio animation' },
        ],
    },
];

type Props = {
    settings: {
        font_heading: string;
        font_body: string;
        color_scheme: string;
        animation_style: string;
        name_font_size: number;
        section_backgrounds: Record<string, string>;
        element_visibility: Record<string, boolean>;
    };
    profileName: string;
};

export default function AppearancePage({ settings, profileName }: Props) {
    const form = useForm({
        font_heading: settings.font_heading,
        font_body: settings.font_body,
        color_scheme: settings.color_scheme,
        animation_style: settings.animation_style,
        name_font_size: settings.name_font_size,
        section_backgrounds: settings.section_backgrounds ?? {},
        element_visibility: settings.element_visibility ?? {},
    });

    // ── Auto-save with debounce ──────────────────────────
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initialRef = useRef(true);
    const savingRef = useRef(false);

    const save = useCallback(() => {
        if (savingRef.current) return;
        savingRef.current = true;
        form.put('/portfolio/appearance', {
            preserveScroll: true,
            onFinish: () => { savingRef.current = false; },
        });
    }, [form]);

    // Serialize objects so useEffect can detect changes
    const sectionBgKey = JSON.stringify(form.data.section_backgrounds);
    const visibilityKey = JSON.stringify(form.data.element_visibility);

    useEffect(() => {
        // Skip the very first render (mount)
        if (initialRef.current) {
            initialRef.current = false;
            return;
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(save, 600);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [
        form.data.font_heading,
        form.data.font_body,
        form.data.color_scheme,
        form.data.animation_style,
        form.data.name_font_size,
        sectionBgKey,
        visibilityKey,
        save,
    ]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Appearance</h1>
                    <p className="text-muted-foreground text-sm">
                        Customize fonts, colors, and animations for your portfolio.
                    </p>
                </div>

                <div className="space-y-8 max-w-4xl">
                    {/* ── Fonts ────────────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Typography</CardTitle>
                            <CardDescription>Choose fonts for headings and body text.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Heading font */}
                            <div className="space-y-3">
                                <Label>Heading Font</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {FONT_OPTIONS.map((font) => (
                                        <button
                                            key={font.value}
                                            type="button"
                                            onClick={() => form.setData('font_heading', font.value)}
                                            className={`relative flex flex-col items-start p-3 border text-left transition-colors ${
                                                form.data.font_heading === font.value
                                                    ? 'border-foreground bg-foreground/5'
                                                    : 'border-border hover:border-foreground/40'
                                            }`}
                                        >
                                            {form.data.font_heading === font.value && (
                                                <Check className="absolute top-2 right-2 h-3 w-3" />
                                            )}
                                            <span className={`text-base font-bold ${font.preview}`}>{font.label}</span>
                                            <span className="text-xs text-muted-foreground">{font.category}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Body font */}
                            <div className="space-y-3">
                                <Label>Body Font</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {FONT_OPTIONS.map((font) => (
                                        <button
                                            key={font.value}
                                            type="button"
                                            onClick={() => form.setData('font_body', font.value)}
                                            className={`relative flex flex-col items-start p-3 border text-left transition-colors ${
                                                form.data.font_body === font.value
                                                    ? 'border-foreground bg-foreground/5'
                                                    : 'border-border hover:border-foreground/40'
                                            }`}
                                        >
                                            {form.data.font_body === font.value && (
                                                <Check className="absolute top-2 right-2 h-3 w-3" />
                                            )}
                                            <span className={`text-sm ${font.preview}`}>The quick brown fox jumps</span>
                                            <span className="text-xs text-muted-foreground mt-1">{font.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="border p-6 bg-muted/30">
                                <p className="text-xs font-mono text-muted-foreground mb-3 tracking-widest uppercase">Preview</p>
                                <h3 className="text-2xl font-bold mb-2">{form.data.font_heading}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    The quick brown fox jumps over the lazy dog. This is how your portfolio body text will look with <strong>{form.data.font_body}</strong> as the body font.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Name Size ─────────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Name Size</CardTitle>
                            <CardDescription>Adjust the size of your name on the hero section. Use a smaller value for longer names.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Label className="shrink-0 w-16 tabular-nums font-mono text-sm">
                                    {form.data.name_font_size} vw
                                </Label>
                                <input
                                    type="range"
                                    min={3}
                                    max={25}
                                    step={0.5}
                                    value={form.data.name_font_size}
                                    onChange={(e) => form.setData('name_font_size', parseFloat(e.target.value))}
                                    className="w-full accent-foreground h-2 cursor-pointer"
                                />
                            </div>

                            {/* Live preview */}
                            <div className="border bg-muted/30 overflow-hidden relative" style={{ minHeight: 120 }}>
                                <p className="text-xs font-mono text-muted-foreground px-4 pt-3 tracking-widest uppercase">
                                    Preview
                                </p>
                                <div className="px-4 pb-4 pt-2">
                                    <span
                                        className="font-black tracking-[-0.04em] leading-[0.85] block"
                                        style={{ fontSize: `${form.data.name_font_size * 0.35}vw` }}
                                    >
                                        {profileName || 'Your Name'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Tip: For short names like "John" try 18–22 vw. For longer names like "Hamza Abu-Sair" try 8–12 vw.
                            </p>
                        </CardContent>
                    </Card>

                    {/* ── Color Schemes ────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Color Scheme</CardTitle>
                            <CardDescription>Pick a palette for your portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {COLOR_SCHEMES.map((scheme) => (
                                    <button
                                        key={scheme.value}
                                        type="button"
                                        onClick={() => form.setData('color_scheme', scheme.value)}
                                        className={`relative flex flex-col border p-3 text-left transition-colors ${
                                            form.data.color_scheme === scheme.value
                                                ? 'border-foreground ring-1 ring-foreground'
                                                : 'border-border hover:border-foreground/40'
                                        }`}
                                    >
                                        {form.data.color_scheme === scheme.value && (
                                            <Check className="absolute top-2 right-2 h-3 w-3" />
                                        )}
                                        {/* Color swatches */}
                                        <div className="flex gap-1 mb-2">
                                            <div className="w-6 h-6 border" style={{ backgroundColor: scheme.bg }} />
                                            <div className="w-6 h-6 border" style={{ backgroundColor: scheme.fg }} />
                                            <div className="w-6 h-6 border" style={{ backgroundColor: scheme.accent }} />
                                        </div>
                                        <span className="text-sm font-medium">{scheme.label}</span>
                                        <span className="text-xs text-muted-foreground">{scheme.description}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Animations ───────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Animations</CardTitle>
                            <CardDescription>Choose how content appears on your portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {ANIMATION_STYLES.map((anim) => (
                                    <button
                                        key={anim.value}
                                        type="button"
                                        onClick={() => form.setData('animation_style', anim.value)}
                                        className={`relative flex flex-col border p-4 text-left transition-colors ${
                                            form.data.animation_style === anim.value
                                                ? 'border-foreground bg-foreground/5'
                                                : 'border-border hover:border-foreground/40'
                                        }`}
                                    >
                                        {form.data.animation_style === anim.value && (
                                            <Check className="absolute top-2 right-2 h-3 w-3" />
                                        )}
                                        <span className="text-sm font-medium">{anim.label}</span>
                                        <span className="text-xs text-muted-foreground mt-1">{anim.description}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Section Backgrounds ──────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Backgrounds</CardTitle>
                            <CardDescription>Choose which sections use the default background and which are inverted (dark ↔ light).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {[
                                    { id: 'hero', label: 'Hero' },
                                    { id: 'projects', label: 'Projects' },
                                    { id: 'experience', label: 'Experience' },
                                    { id: 'education', label: 'Education' },
                                    { id: 'contact', label: 'Contact' },
                                ].map((section) => {
                                    const bg = form.data.section_backgrounds[section.id] ?? 'default';
                                    return (
                                        <div
                                            key={section.id}
                                            className="flex items-center justify-between border p-3"
                                        >
                                            <span className="text-sm font-medium">{section.label}</span>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        form.setData('section_backgrounds', {
                                                            ...form.data.section_backgrounds,
                                                            [section.id]: 'default',
                                                        })
                                                    }
                                                    className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono transition-colors ${
                                                        bg === 'default'
                                                            ? 'border-foreground bg-foreground/5'
                                                            : 'border-border hover:border-foreground/40'
                                                    }`}
                                                >
                                                    <div className="w-4 h-4 border bg-background" />
                                                    Default
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        form.setData('section_backgrounds', {
                                                            ...form.data.section_backgrounds,
                                                            [section.id]: 'inverted',
                                                        })
                                                    }
                                                    className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono transition-colors ${
                                                        bg === 'inverted'
                                                            ? 'border-foreground bg-foreground/5'
                                                            : 'border-border hover:border-foreground/40'
                                                    }`}
                                                >
                                                    <div className="w-4 h-4 border bg-foreground" />
                                                    Inverted
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Element Visibility ──────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Element Visibility</CardTitle>
                            <CardDescription>Toggle individual elements on or off across every section.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {VISIBILITY_GROUPS.map((group) => (
                                <div key={group.label}>
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">{group.label}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {group.items.map((item) => {
                                            const checked = form.data.element_visibility[item.key] ?? true;
                                            return (
                                                <label
                                                    key={item.key}
                                                    className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                                                        checked ? 'border-foreground/30 bg-foreground/5' : 'border-border opacity-60'
                                                    }`}
                                                >
                                                    <div>
                                                        <span className="text-sm font-medium">{item.label}</span>
                                                        {item.description && (
                                                            <span className="text-xs text-muted-foreground block">{item.description}</span>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={(e) =>
                                                            form.setData('element_visibility', {
                                                                ...form.data.element_visibility,
                                                                [item.key]: e.target.checked,
                                                            })
                                                        }
                                                        className="h-4 w-4 accent-foreground"
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Auto-save indicator */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground h-8">
                        {form.processing && (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saving…</span>
                            </>
                        )}
                        {form.recentlySuccessful && (
                            <>
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Saved</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
