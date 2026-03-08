import { Head, Link } from '@inertiajs/react';
import { Briefcase, GraduationCap, Layers, Settings2, User } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    const visibleCount = portfolio.settings?.visibleSections?.length ?? 0;
    const totalCount = portfolio.settings?.sectionOrder?.length ?? 5;

    const cards = [
        {
            title: 'Profile',
            description: portfolio.profile ? `${portfolio.profile.name}` : 'Not configured yet',
            icon: User,
            href: '/portfolio/profile',
            count: portfolio.profile ? 1 : 0,
        },
        {
            title: 'Projects',
            description: `${portfolio.projects.length} project(s)`,
            icon: Layers,
            href: '/portfolio/projects',
            count: portfolio.projects.length,
        },
        {
            title: 'Experience',
            description: `${portfolio.experience.length} position(s)`,
            icon: Briefcase,
            href: '/portfolio/experience',
            count: portfolio.experience.length,
        },
        {
            title: 'Education',
            description: `${portfolio.education.length} entry/entries`,
            icon: GraduationCap,
            href: '/portfolio/education',
            count: portfolio.education.length,
        },
        {
            title: 'Sections',
            description: `${visibleCount}/${totalCount} sections visible`,
            icon: Settings2,
            href: '/portfolio/sections',
            count: visibleCount,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Portfolio Admin" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Portfolio</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage all sections of your public portfolio from here.
                        </p>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                    >
                        View live site ↗
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {cards.map((card) => (
                        <Link key={card.title} href={card.href}>
                            <Card className="hover:border-primary/40 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                    <card.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{card.count}</div>
                                    <CardDescription>{card.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
