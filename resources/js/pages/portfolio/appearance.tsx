import { Head, useForm } from '@inertiajs/react';
import { Check } from 'lucide-react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
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

type Props = {
    settings: {
        font_heading: string;
        font_body: string;
        color_scheme: string;
        animation_style: string;
        name_font_size: number;
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
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.put('/portfolio/appearance');
    }

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

                <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
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

                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Saving…' : 'Save Appearance'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
