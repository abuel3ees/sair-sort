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
    hero_subtitle: string | null;
    bio: string | null;
    email: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
    dribbble: string | null;
    website: string | null;
    location: string | null;
    status: string | null;
    contact_cta: string | null;
    footer_text: string | null;
    cv_path: string | null;
};

export default function ProfileEdit({ profile }: { profile: Profile | null }) {
    const cvInputRef = useRef<HTMLInputElement>(null);
    const jsonInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        name: profile?.name ?? '',
        tagline: profile?.tagline ?? '',
        hero_subtitle: profile?.hero_subtitle ?? '',
        bio: profile?.bio ?? '',
        email: profile?.email ?? '',
        github: profile?.github ?? '',
        linkedin: profile?.linkedin ?? '',
        twitter: profile?.twitter ?? '',
        dribbble: profile?.dribbble ?? '',
        website: profile?.website ?? '',
        location: profile?.location ?? '',
        status: profile?.status ?? 'Open to work',
        contact_cta: profile?.contact_cta ?? '',
        footer_text: profile?.footer_text ?? '',
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
                            Your public-facing profile information. This is what visitors see first — make it count.
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
                            <CardDescription>The big intro on your portfolio. Your name appears as a giant headline in the hero section.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="e.g. Jane Doe"
                                />
                                <p className="text-xs text-muted-foreground">This is the giant text in your hero section. Keep it short — first + last name works best.</p>
                                {form.errors.name && <p className="text-destructive text-sm">{form.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tagline">Tagline</Label>
                                <Input
                                    id="tagline"
                                    value={form.data.tagline}
                                    onChange={(e) => form.setData('tagline', e.target.value)}
                                    placeholder="e.g. Full-Stack Developer · Creative Thinker"
                                />
                                <p className="text-xs text-muted-foreground">A short line that appears beneath your name. Think of it as your elevator pitch.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                                <Input
                                    id="hero_subtitle"
                                    value={form.data.hero_subtitle}
                                    onChange={(e) => form.setData('hero_subtitle', e.target.value)}
                                    placeholder="e.g. Building beautiful web experiences"
                                />
                                <p className="text-xs text-muted-foreground">Optional extra text shown below your name in the hero. Leave blank if the tagline is enough.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    placeholder="e.g. Open to work, Freelancing, Employed"
                                />
                                <p className="text-xs text-muted-foreground">Shows as a small badge on your hero section. Great for recruiters.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                            <CardDescription>Tell visitors who you are. This appears in the education section of your portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    rows={4}
                                    value={form.data.bio}
                                    onChange={(e) => form.setData('bio', e.target.value)}
                                    placeholder="Write a few sentences about yourself, your background, and what you're passionate about..."
                                />
                                <p className="text-xs text-muted-foreground">A short paragraph about you. Write in first or third person — whatever feels natural.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={form.data.location}
                                    onChange={(e) => form.setData('location', e.target.value)}
                                    placeholder="e.g. San Francisco, CA"
                                />
                                <p className="text-xs text-muted-foreground">Shown on the hero section and contact area. City and country is enough.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Links</CardTitle>
                            <CardDescription>Social links and contact info. These appear as icons on your contact section. Only fill in the ones you want to show.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub username</Label>
                                <Input
                                    id="github"
                                    value={form.data.github}
                                    onChange={(e) => form.setData('github', e.target.value)}
                                    placeholder="e.g. janedoe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn username</Label>
                                <Input
                                    id="linkedin"
                                    value={form.data.linkedin}
                                    onChange={(e) => form.setData('linkedin', e.target.value)}
                                    placeholder="e.g. janedoe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter">X / Twitter username</Label>
                                <Input
                                    id="twitter"
                                    value={form.data.twitter}
                                    onChange={(e) => form.setData('twitter', e.target.value)}
                                    placeholder="e.g. janedoe (without @)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dribbble">Dribbble username</Label>
                                <Input
                                    id="dribbble"
                                    value={form.data.dribbble}
                                    onChange={(e) => form.setData('dribbble', e.target.value)}
                                    placeholder="e.g. janedoe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website URL</Label>
                                <Input
                                    id="website"
                                    value={form.data.website}
                                    onChange={(e) => form.setData('website', e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Leave any field blank to hide it from your portfolio. Just usernames — no full URLs needed for social platforms.</p>
                        </CardContent>
                    </Card>

                    {/* ── Contact Customization ──────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Section</CardTitle>
                            <CardDescription>Customize the big call-to-action at the bottom of your portfolio and the footer text.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_cta">CTA Text</Label>
                                <Input
                                    id="contact_cta"
                                    value={form.data.contact_cta}
                                    onChange={(e) => form.setData('contact_cta', e.target.value)}
                                    placeholder="e.g. Let's Talk"
                                />
                                <p className="text-xs text-muted-foreground">The big headline on the contact section. The first word appears on one line, the rest on the next. Keep it 2–3 words.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="footer_text">Footer Text</Label>
                                <Input
                                    id="footer_text"
                                    value={form.data.footer_text}
                                    onChange={(e) => form.setData('footer_text', e.target.value)}
                                    placeholder="e.g. Built with Sair"
                                />
                                <p className="text-xs text-muted-foreground">Small text at the very bottom of the page. Optional.</p>
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
