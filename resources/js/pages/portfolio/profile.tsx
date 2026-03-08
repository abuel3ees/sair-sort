import { Head, useForm } from '@inertiajs/react';
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
};

export default function ProfileEdit({ profile }: { profile: Profile | null }) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profile" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-muted-foreground text-sm">
                        Your public-facing profile information.
                    </p>
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

                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Saving…' : 'Save Profile'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
