import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import type { FormEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'Education', href: '/portfolio/education' },
];

type Education = {
    id: number;
    institution: string;
    degree: string;
    field: string;
    duration: string;
    gpa: string | null;
    highlights: string[] | null;
    sort_order: number;
};

const emptyEducation = {
    institution: '',
    degree: '',
    field: '',
    duration: '',
    gpa: '',
    highlights: [] as string[],
    sort_order: 0,
};

function EducationForm({
    initial,
    action,
    method,
    onDone,
}: {
    initial: typeof emptyEducation;
    action: string;
    method: 'post' | 'put';
    onDone: () => void;
}) {
    const form = useForm({ ...initial });
    const [highlightInput, setHighlightInput] = useState('');

    function addHighlight() {
        const h = highlightInput.trim();
        if (h && !form.data.highlights.includes(h)) {
            form.setData('highlights', [...form.data.highlights, h]);
        }
        setHighlightInput('');
    }

    function removeHighlight(item: string) {
        form.setData('highlights', form.data.highlights.filter((h) => h !== item));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (method === 'post') {
            form.post(action, { onSuccess: onDone });
        } else {
            form.put(action, { onSuccess: onDone });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" value={form.data.institution} onChange={(e) => form.setData('institution', e.target.value)} />
                {form.errors.institution && <p className="text-destructive text-sm">{form.errors.institution}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input id="degree" value={form.data.degree} onChange={(e) => form.setData('degree', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="field">Field of study</Label>
                    <Input id="field" value={form.data.field} onChange={(e) => form.setData('field', e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" value={form.data.duration} onChange={(e) => form.setData('duration', e.target.value)} placeholder="e.g. 2020 — 2024" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (optional)</Label>
                    <Input id="gpa" value={form.data.gpa} onChange={(e) => form.setData('gpa', e.target.value)} placeholder="e.g. 3.9/4.0" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Highlights</Label>
                <div className="flex gap-2">
                    <Input
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                        placeholder="Add a highlight and press Enter"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addHighlight}>Add</Button>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                    {form.data.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-1.5 rounded">
                            <span className="flex-1">{h}</span>
                            <button type="button" onClick={() => removeHighlight(h)} className="hover:text-destructive">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="sort_order">Sort order</Label>
                <Input id="sort_order" type="number" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
            </div>
            <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Saving…' : 'Save'}
            </Button>
        </form>
    );
}

export default function EducationPage({ educations }: { educations: Education[] }) {
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const editEdu = editId !== null ? educations.find((e) => e.id === editId) : null;

    function startEdit(edu: Education) {
        setEditId(edu.id);
        setOpen(true);
    }

    function startCreate() {
        setEditId(null);
        setOpen(true);
    }

    function handleDelete(id: number) {
        if (confirm('Delete this education entry?')) {
            router.delete(`/portfolio/education/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Education" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Education</h1>
                        <p className="text-muted-foreground text-sm">{educations.length} entry/entries</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={startCreate}>
                                <Plus className="h-4 w-4 mr-2" /> Add Education
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editEdu ? 'Edit Education' : 'New Education'}</DialogTitle>
                            </DialogHeader>
                            <EducationForm
                                key={editId ?? 'new'}
                                initial={
                                    editEdu
                                        ? {
                                              institution: editEdu.institution,
                                              degree: editEdu.degree,
                                              field: editEdu.field,
                                              duration: editEdu.duration,
                                              gpa: editEdu.gpa ?? '',
                                              highlights: editEdu.highlights ?? [],
                                              sort_order: editEdu.sort_order,
                                          }
                                        : emptyEducation
                                }
                                action={editEdu ? `/portfolio/education/${editEdu.id}` : '/portfolio/education'}
                                method={editEdu ? 'put' : 'post'}
                                onDone={() => setOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {educations.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No education entries yet. Click "Add Education" to create one.
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-4">
                    {educations.map((edu) => (
                        <Card key={edu.id}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-base">{edu.institution}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {edu.degree} in {edu.field} · {edu.duration}
                                    </p>
                                    {edu.gpa && <Badge variant="outline" className="mt-1">GPA: {edu.gpa}</Badge>}
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => startEdit(edu)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(edu.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            {edu.highlights && edu.highlights.length > 0 && (
                                <CardContent>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        {edu.highlights.map((h, i) => (
                                            <li key={i}>{h}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
