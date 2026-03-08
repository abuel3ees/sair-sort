import { Head, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'Sections', href: '/portfolio/sections' },
];

const SECTION_META: Record<string, { label: string; description: string }> = {
    hero: { label: 'Hero', description: 'Main banner with your name, tagline, and navigation' },
    projects: { label: 'Projects', description: 'Showcase of your work with horizontal scroll' },
    experience: { label: 'Experience', description: 'Professional experience timeline' },
    education: { label: 'Education', description: 'Academic background and achievements' },
    contact: { label: 'Contact', description: 'Contact information and call-to-action footer' },
};

type Props = {
    sectionOrder: string[];
    visibleSections: string[];
};

export default function SectionsPage({ sectionOrder: initialOrder, visibleSections: initialVisible }: Props) {
    const [order, setOrder] = useState<string[]>(initialOrder);
    const [visible, setVisible] = useState<Set<string>>(new Set(initialVisible));
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    const toggleVisibility = useCallback((id: string) => {
        setVisible((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
        setDirty(true);
    }, []);

    const moveUp = useCallback((index: number) => {
        if (index <= 0) return;
        setOrder((prev) => {
            const next = [...prev];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            return next;
        });
        setDirty(true);
    }, []);

    const moveDown = useCallback((index: number) => {
        setOrder((prev) => {
            if (index >= prev.length - 1) return prev;
            const next = [...prev];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            return next;
        });
        setDirty(true);
    }, []);

    const save = useCallback(() => {
        setSaving(true);
        router.put(
            '/portfolio/sections',
            {
                section_order: order,
                visible_sections: order.filter((id) => visible.has(id)),
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSaving(false);
                    setDirty(false);
                },
            },
        );
    }, [order, visible]);

    const reset = useCallback(() => {
        setOrder(initialOrder);
        setVisible(new Set(initialVisible));
        setDirty(false);
    }, [initialOrder, initialVisible]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sections — Portfolio" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Sections</h1>
                        <p className="text-muted-foreground text-sm">
                            Toggle visibility and reorder sections on your public portfolio.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {dirty && (
                            <Button variant="outline" onClick={reset} size="sm">
                                Reset
                            </Button>
                        )}
                        <Button onClick={save} disabled={!dirty || saving} size="sm">
                            {saving ? 'Saving…' : 'Save changes'}
                        </Button>
                    </div>
                </div>

                {/* Preview bar */}
                <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    <Eye className="h-3.5 w-3.5 shrink-0" />
                    <span>Preview order:</span>
                    {order.map((id) => (
                        <span
                            key={id}
                            className={`rounded px-1.5 py-0.5 font-medium ${
                                visible.has(id)
                                    ? 'bg-primary/10 text-primary'
                                    : 'line-through opacity-40'
                            }`}
                        >
                            {SECTION_META[id]?.label ?? id}
                        </span>
                    ))}
                </div>

                {/* Section cards */}
                <div className="flex flex-col gap-3">
                    {order.map((id, index) => {
                        const meta = SECTION_META[id];
                        const isVisible = visible.has(id);
                        if (!meta) return null;

                        return (
                            <Card
                                key={id}
                                className={`transition-all ${
                                    isVisible ? 'border-border' : 'border-dashed opacity-50'
                                }`}
                            >
                                <div className="flex items-center gap-4 px-6 py-4">
                                    {/* Drag handle (visual) */}
                                    <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground/40" />

                                    {/* Order controls */}
                                    <div className="flex flex-col gap-0.5">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => moveDown(index)}
                                            disabled={index === order.length - 1}
                                        >
                                            <ArrowDown className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{meta.label}</span>
                                            {!isVisible && (
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <EyeOff className="h-3 w-3" /> Hidden
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{meta.description}</p>
                                    </div>

                                    {/* Toggle */}
                                    <Switch checked={isVisible} onCheckedChange={() => toggleVisibility(id)} />
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Help text */}
                <p className="text-xs text-muted-foreground">
                    Use the arrows to reorder sections. Toggle the switch to show or hide a section on your
                    public portfolio. Changes are saved when you click &ldquo;Save changes&rdquo;.
                </p>
            </div>
        </AppLayout>
    );
}
