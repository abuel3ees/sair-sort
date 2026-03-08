import { Head, useForm, router } from '@inertiajs/react';
import { FileText, Import, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';

import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'Profile', href: '/portfolio/profile' },
];

type Profile = {
    id?: number;
    name: string;
    tagline: string | null;
    bio: string | null;
    email: string | null;
    github: string | null;
    linkedin: string | null;
    location: string | null;
    status: string | null;
    cv_path: string | null;
};

export default function ProfileEdit({ profile }: { profile: Profile | null }) {
    const cvInputRef = useRef<HTMLInputElement>(null);
    const jsonInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        name: profile?.name ?? '',
        tagline: profile?.tagline ?? '',
        bio: profile?.bio ?? '',
        email: profile?.email ?? '',
        github: profile?.github ?? '',
        linkedin: profile?.linkedin ?? '',
        location: profile?.location ?? '',
        status: profile?.status ?? 'Open to work',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.put('/portfolio/profile');
    }

    function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('cv', file);
        router.post('/portfolio/cv/upload', fd as never, { forceFormData: true });
    }

    function handleDeleteCv() {
        if (confirm('Remove your CV?')) {
            router.delete('/portfolio/cv');
        }
    }

    function handleJsonImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('json_file', file);
        router.post('/portfolio/import', fd as never, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profile" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Profile</h1>
                        <p className="text-muted-foreground text-sm">
                            Your public-facing profile information.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                            onClick={() => jsonInputRef.current?.click()}
                        >
                            <Import className="h-4 w-4" />
                            Import JSON
                        </button>
                        <input ref={jsonInputRef} type="file" accept=".json" className="hidden" onChange={handleJsonImport} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>Name, tagline, and status shown on your portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                />
                                {form.errors.name && <p className="text-destructive text-sm">{form.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tagline">Tagline</Label>
                                <Input
                                    id="tagline"
                                    value={form.data.tagline}
                                    onChange={(e) => form.setData('tagline', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    placeholder="e.g. Open to work, Freelancing, Employed"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                            <CardDescription>Bio and location.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    rows={4}
                                    value={form.data.bio}
                                    onChange={(e) => form.setData('bio', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={form.data.location}
                                    onChange={(e) => form.setData('location', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Links</CardTitle>
                            <CardDescription>Contact and social information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub username</Label>
                                <Input
                                    id="github"
                                    value={form.data.github}
                                    onChange={(e) => form.setData('github', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn username</Label>
                                <Input
                                    id="linkedin"
                                    value={form.data.linkedin}
                                    onChange={(e) => form.setData('linkedin', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── CV Upload ─────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>CV / Resume</CardTitle>
                            <CardDescription>Upload a PDF to make it downloadable on your portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {profile?.cv_path ? (
                                <div className="flex items-center gap-3 p-3 border bg-muted/50">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm flex-1 font-mono">CV uploaded</span>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 border px-2 py-1 text-xs hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                        onClick={handleDeleteCv}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No CV uploaded yet.</p>
                            )}
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                                onClick={() => cvInputRef.current?.click()}
                            >
                                <Upload className="h-4 w-4" />
                                {profile?.cv_path ? 'Replace CV' : 'Upload CV'}
                            </button>
                            <input ref={cvInputRef} type="file" accept=".pdf" className="hidden" onChange={handleCvUpload} />
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Saving…' : 'Save Profile'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
