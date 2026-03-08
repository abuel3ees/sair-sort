import { Head, router, useForm } from '@inertiajs/react';
import { Briefcase, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import type { FormEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'Experience', href: '/portfolio/experience' },
];

type Experience = {
    id: number;
    company: string;
    role: string;
    duration: string;
    description: string | null;
    type: 'full-time' | 'part-time' | 'internship' | 'contract';
    technologies: string[] | null;
    sort_order: number;
};

const emptyExperience = {
    company: '',
    role: '',
    duration: '',
    description: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'internship' | 'contract',
    technologies: [] as string[],
    sort_order: 0,
};

function ExperienceForm({
    initial,
    action,
    method,
    onDone,
}: {
    initial: typeof emptyExperience;
    action: string;
    method: 'post' | 'put';
    onDone: () => void;
}) {
    const form = useForm({ ...initial });
    const [techInput, setTechInput] = useState('');

    function addTech() {
        const tech = techInput.trim();
        if (tech && !form.data.technologies.includes(tech)) {
            form.setData('technologies', [...form.data.technologies, tech]);
        }
        setTechInput('');
    }

    function removeTech(tech: string) {
        form.setData('technologies', form.data.technologies.filter((t) => t !== tech));
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
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} placeholder="e.g. Google" />
                    {form.errors.company && <p className="text-destructive text-sm">{form.errors.company}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={form.data.role} onChange={(e) => form.setData('role', e.target.value)} placeholder="e.g. Software Engineer" />
                    {form.errors.role && <p className="text-destructive text-sm">{form.errors.role}</p>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" value={form.data.duration} onChange={(e) => form.setData('duration', e.target.value)} placeholder="e.g. 2023 — Present" />
                </div>
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.data.type} onValueChange={(v) => form.setData('type', v as typeof form.data.type)}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={3} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} placeholder="What did you work on? What impact did you make?" />
                <p className="text-xs text-muted-foreground">A brief summary of your responsibilities and achievements.</p>
            </div>
            <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                    <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                        placeholder="Add a technology and press Enter"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTech}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                    {form.data.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="gap-1">
                            {tech}
                            <button type="button" onClick={() => removeTech(tech)} className="ml-1 hover:text-destructive">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="sort_order">Sort order</Label>
                <Input id="sort_order" type="number" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">Lower numbers appear first. Use 0 for your most recent role.</p>
            </div>
            <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Saving…' : 'Save'}
            </Button>
        </form>
    );
}

export default function ExperiencePage({ experiences }: { experiences: Experience[] }) {
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const editExp = editId !== null ? experiences.find((e) => e.id === editId) : null;

    function startEdit(exp: Experience) {
        setEditId(exp.id);
        setOpen(true);
    }

    function startCreate() {
        setEditId(null);
        setOpen(true);
    }

    function handleDelete(id: number) {
        if (confirm('Delete this experience entry?')) {
            router.delete(`/portfolio/experience/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Experience" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Experience</h1>
                        <p className="text-muted-foreground text-sm">
                            Your professional history. Each entry appears as a timeline item on your portfolio.
                        </p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={startCreate}>
                                <Plus className="h-4 w-4 mr-2" /> Add Experience
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editExp ? 'Edit Experience' : 'New Experience'}</DialogTitle>
                            </DialogHeader>
                            <ExperienceForm
                                key={editId ?? 'new'}
                                initial={
                                    editExp
                                        ? {
                                              company: editExp.company,
                                              role: editExp.role,
                                              duration: editExp.duration,
                                              description: editExp.description ?? '',
                                              type: editExp.type,
                                              technologies: editExp.technologies ?? [],
                                              sort_order: editExp.sort_order,
                                          }
                                        : emptyExperience
                                }
                                action={editExp ? `/portfolio/experience/${editExp.id}` : '/portfolio/experience'}
                                method={editExp ? 'put' : 'post'}
                                onDone={() => setOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {experiences.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                            <p className="text-muted-foreground font-medium">No experience yet</p>
                            <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
                                Add your work experience — jobs, internships, freelance work, or anything relevant. Each entry shows as a timeline item.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <Card key={exp.id}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-base">{exp.role}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{exp.company} · {exp.duration}</p>
                                    <Badge variant="outline" className="mt-1">{exp.type}</Badge>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => startEdit(exp)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">{exp.description}</p>
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {exp.technologies.map((tech) => (
                                            <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {experiences.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        <strong>Tip:</strong> Add technologies you used at each role — they appear as tags on your portfolio and help visitors understand your tech stack at a glance.
                    </p>
                )}
            </div>
        </AppLayout>
    );
}
