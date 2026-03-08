import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Briefcase, CheckCircle2, Circle, ExternalLink, FolderGit2, GraduationCap, Palette, Settings2, User } from 'lucide-react';

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Portfolio', href: '/portfolio' },
];

type PortfolioData = {
    profile: Record<string, string> | null;
    projects: unknown[];
    experience: unknown[];
    education: unknown[];
    settings: {
        sectionOrder: string[];
        visibleSections: string[];
    };
};

export default function PortfolioIndex({ portfolio }: { portfolio: PortfolioData }) {
    const hasProfile = !!portfolio.profile?.name;
    const projectCount = portfolio.projects.length;
    const experienceCount = portfolio.experience.length;
    const educationCount = portfolio.education.length;

    const steps = [
        {
            title: 'Set up your profile',
            description: 'Add your name, tagline, bio, and social links. This is the foundation of your portfolio — the first thing visitors see.',
            icon: User,
            href: '/portfolio/profile',
            done: hasProfile,
            detail: hasProfile ? `Showing as "${portfolio.profile!.name}"` : 'Not set up yet',
        },
        {
            title: 'Add your projects',
            description: 'Showcase your best work. Add titles, descriptions, tags, links, and images for each project.',
            icon: FolderGit2,
            href: '/portfolio/projects',
            done: projectCount > 0,
            detail: projectCount > 0 ? `${projectCount} project${projectCount !== 1 ? 's' : ''} added` : 'No projects yet',
        },
        {
            title: 'Add your experience',
            description: 'List your professional experience — roles, companies, and technologies you\'ve worked with.',
            icon: Briefcase,
            href: '/portfolio/experience',
            done: experienceCount > 0,
            detail: experienceCount > 0 ? `${experienceCount} position${experienceCount !== 1 ? 's' : ''} added` : 'No experience added',
        },
        {
            title: 'Add your education',
            description: 'Include your academic background, degrees, and any notable achievements.',
            icon: GraduationCap,
            href: '/portfolio/education',
            done: educationCount > 0,
            detail: educationCount > 0 ? `${educationCount} entr${educationCount !== 1 ? 'ies' : 'y'} added` : 'No education added',
        },
        {
            title: 'Organize your sections',
            description: 'Choose which sections appear on your portfolio and in what order. You can hide sections you\'re not ready to show.',
            icon: Settings2,
            href: '/portfolio/sections',
            done: true, // Always "done" since defaults exist
            detail: `${portfolio.settings?.visibleSections?.length ?? 0} of ${portfolio.settings?.sectionOrder?.length ?? 5} sections visible`,
        },
        {
            title: 'Customize the look',
            description: 'Pick fonts, colors, animations, and tweak every visual detail. Make it feel like yours.',
            icon: Palette,
            href: '/portfolio/appearance',
            done: true, // Always "done" since defaults exist
            detail: 'Fonts, colors, animations & more',
        },
    ];

    const completedCount = steps.filter((s) => s.done).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Portfolio Overview" />
            <div className="flex flex-col gap-8 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">Your Portfolio</h1>
                        <p className="text-muted-foreground text-sm max-w-lg">
                            This is your portfolio control center. Follow the steps below to build and customize your site. Everything saves automatically — changes appear on your live site in real time.
                        </p>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors shrink-0"
                    >
                        <ExternalLink className="h-4 w-4" />
                        View Live Site
                    </a>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Setup progress</span>
                        <span className="font-mono font-medium">{completedCount}/{steps.length} complete</span>
                    </div>
                    <div className="h-2 w-full bg-muted overflow-hidden">
                        <div
                            className="h-full bg-foreground transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                    {steps.map((step, i) => (
                        <Link key={step.title} href={step.href}>
                            <Card className={`group hover:border-foreground/30 transition-all cursor-pointer ${!step.done ? 'border-dashed' : ''}`}>
                                <CardContent className="flex items-center gap-5 p-5">
                                    {/* Step number & status */}
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className="text-xs font-mono text-muted-foreground w-5">{String(i + 1).padStart(2, '0')}</span>
                                        {step.done ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground/40" />
                                        )}
                                    </div>

                                    {/* Icon */}
                                    <div className="flex h-10 w-10 items-center justify-center border bg-muted/30 shrink-0">
                                        <step.icon className="h-5 w-5 text-muted-foreground" />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-sm font-semibold">{step.title}</CardTitle>
                                        </div>
                                        <CardDescription className="mt-0.5 text-xs">{step.description}</CardDescription>
                                        <p className="text-xs text-muted-foreground/70 mt-1 font-mono">{step.detail}</p>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Help text */}
                <div className="border-t pt-6 space-y-2">
                    <p className="text-xs text-muted-foreground">
                        <strong>Tip:</strong> You don't need to complete everything at once. Fill in what you have now and come back later to add more.
                        Your portfolio is already live — hidden sections won't appear until you enable them.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
