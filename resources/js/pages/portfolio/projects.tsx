import { Head, router, useForm } from '@inertiajs/react';
import { FolderGit2, ImagePlus, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

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
    { title: 'Projects', href: '/portfolio/projects' },
];

type ProjectImageType = {
    id: number;
    file_path: string;
    original_name: string;
    mime_type: string;
    sort_order: number;
};

type Project = {
    id: number;
    title: string;
    description: string | null;
    long_description: string | null;
    tags: string[] | null;
    status: 'completed' | 'in-progress' | 'planned';
    github: string | null;
    demo: string | null;
    sort_order: number;
    images: ProjectImageType[];
};

const emptyProject = {
    title: '',
    description: '',
    long_description: '',
    tags: [] as string[],
    status: 'planned' as 'completed' | 'in-progress' | 'planned',
    github: '',
    demo: '',
    sort_order: 0,
};

function ProjectForm({
    initial,
    action,
    method,
    onDone,
}: {
    initial: typeof emptyProject;
    action: string;
    method: 'post' | 'put';
    onDone: () => void;
}) {
    const form = useForm({ ...initial });
    const [tagInput, setTagInput] = useState('');

    function addTag() {
        const tag = tagInput.trim();
        if (tag && !form.data.tags.includes(tag)) {
            form.setData('tags', [...form.data.tags, tag]);
        }
        setTagInput('');
    }

    function removeTag(tag: string) {
        form.setData('tags', form.data.tags.filter((t) => t !== tag));
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
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="e.g. Portfolio Website" />
                {form.errors.title && <p className="text-destructive text-sm">{form.errors.title}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Short description</Label>
                <Textarea id="description" rows={2} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} placeholder="One or two sentences about what this project does" />
                <p className="text-xs text-muted-foreground">Shown on the project card. Keep it brief.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="long_description">Detailed description</Label>
                <Textarea id="long_description" rows={4} value={form.data.long_description} onChange={(e) => form.setData('long_description', e.target.value)} placeholder="Go into more detail — what problem does it solve, what technologies did you use, what did you learn?" />
                <p className="text-xs text-muted-foreground">Shown when visitors expand the project. Optional but recommended.</p>
            </div>
            <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.data.status} onValueChange={(v) => form.setData('status', v as typeof form.data.status)}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                    <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                        placeholder="Add a tag and press Enter"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                    {form.data.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input id="github" value={form.data.github} onChange={(e) => form.setData('github', e.target.value)} placeholder="https://github.com/you/project" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="demo">Demo URL</Label>
                    <Input id="demo" value={form.data.demo} onChange={(e) => form.setData('demo', e.target.value)} placeholder="https://myproject.com" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="sort_order">Sort order</Label>
                <Input id="sort_order" type="number" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">Lower numbers appear first. Use 0, 1, 2… to control the order.</p>
            </div>
            <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Saving…' : 'Save'}
            </Button>
        </form>
    );
}

function ImageManager({ project }: { project: Project }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    function handleUpload(files: FileList | null) {
        if (!files || files.length === 0) return;
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('images[]', file));

        setUploading(true);
        router.post(`/portfolio/projects/${project.id}/images`, formData, {
            forceFormData: true,
            onFinish: () => setUploading(false),
        });
    }

    function handleDelete(imageId: number) {
        if (confirm('Remove this file?')) {
            router.delete(`/portfolio/projects/${project.id}/images/${imageId}`);
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Files & Images ({project.images?.length ?? 0})
                </Label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? (
                        <>
                            <Upload className="h-3 w-3 mr-1 animate-spin" />
                            Uploading…
                        </>
                    ) : (
                        <>
                            <ImagePlus className="h-3 w-3 mr-1" />
                            Add Files
                        </>
                    )}
                </Button>
                <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files)}
                />
            </div>

            {project.images && project.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {project.images.map((img) => (
                        <div key={img.id} className="relative group border overflow-hidden">
                            {img.mime_type.startsWith('image/') ? (
                                <img
                                    src={`/storage/${img.file_path}`}
                                    alt={img.original_name}
                                    className="w-full aspect-square object-cover"
                                />
                            ) : (
                                <div className="w-full aspect-square bg-muted flex items-center justify-center">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                        {img.original_name.split('.').pop()}
                                    </span>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => handleDelete(img.id)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] text-white truncate block">{img.original_name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProjectsPage({ projects }: { projects: Project[] }) {
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const editProject = editId !== null ? projects.find((p) => p.id === editId) : null;

    function startEdit(project: Project) {
        setEditId(project.id);
        setOpen(true);
    }

    function startCreate() {
        setEditId(null);
        setOpen(true);
    }

    function handleDelete(id: number) {
        if (confirm('Delete this project?')) {
            router.delete(`/portfolio/projects/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Projects</h1>
                        <p className="text-muted-foreground text-sm">
                            Your best work, front and center. Each project appears as a full-width slide on your portfolio with horizontal scrolling.
                        </p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={startCreate}>
                                <Plus className="h-4 w-4 mr-2" /> Add Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editProject ? 'Edit Project' : 'New Project'}</DialogTitle>
                            </DialogHeader>
                            <ProjectForm
                                key={editId ?? 'new'}
                                initial={
                                    editProject
                                        ? {
                                              title: editProject.title,
                                              description: editProject.description ?? '',
                                              long_description: editProject.long_description ?? '',
                                              tags: editProject.tags ?? [],
                                              status: editProject.status,
                                              github: editProject.github ?? '',
                                              demo: editProject.demo ?? '',
                                              sort_order: editProject.sort_order,
                                          }
                                        : emptyProject
                                }
                                action={editProject ? `/portfolio/projects/${editProject.id}` : '/portfolio/projects'}
                                method={editProject ? 'put' : 'post'}
                                onDone={() => setOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {projects.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FolderGit2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                            <p className="text-muted-foreground font-medium">No projects yet</p>
                            <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
                                Add your first project to showcase your work. Include a title, description, tags, and links to source code or live demos.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-base">{project.title}</CardTitle>
                                    <Badge variant="outline" className="mt-1">{project.status}</Badge>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => startEdit(project)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                {project.tags && project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {project.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                        ))}
                                    </div>
                                )}
                                <ImageManager project={project} />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {projects.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        <strong>Tip:</strong> Upload images or PDFs to each project using the "Add Files" button on the card. Images will be displayed as a gallery on your portfolio. You can also attach screenshots, mockups, or documents.
                    </p>
                )}
            </div>
        </AppLayout>
    );
}
