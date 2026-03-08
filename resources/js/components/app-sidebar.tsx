import { Link } from '@inertiajs/react';
import { Briefcase, ExternalLink, FolderGit2, GraduationCap, LayoutGrid, Monitor, Moon, Palette, Settings2, Sun, User } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const contentNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/portfolio/profile',
        icon: User,
    },
    {
        title: 'Projects',
        href: '/portfolio/projects',
        icon: FolderGit2,
    },
    {
        title: 'Experience',
        href: '/portfolio/experience',
        icon: Briefcase,
    },
    {
        title: 'Education',
        href: '/portfolio/education',
        icon: GraduationCap,
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Sections',
        href: '/portfolio/sections',
        icon: Settings2,
    },
    {
        title: 'Appearance',
        href: '/portfolio/appearance',
        icon: Palette,
    },
];

function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';

    const modes = [
        { value: 'light' as const, icon: Sun, label: 'Light' },
        { value: 'dark' as const, icon: Moon, label: 'Dark' },
        { value: 'system' as const, icon: Monitor, label: 'System' },
    ];

    if (collapsed) {
        // Cycle through modes on click when collapsed
        const next = appearance === 'light' ? 'dark' : appearance === 'dark' ? 'system' : 'light';
        const CurrentIcon = modes.find((m) => m.value === appearance)?.icon ?? Monitor;
        return (
            <SidebarGroup className="group-data-[collapsible=icon]:p-0">
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip={{ children: `Theme: ${appearance}` }}
                                onClick={() => updateAppearance(next)}
                                className="text-neutral-600 dark:text-neutral-300"
                            >
                                <CurrentIcon className="h-5 w-5" />
                                <span className="capitalize">{appearance}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                    {modes.map(({ value, icon: Icon, label }) => (
                        <button
                            key={value}
                            onClick={() => updateAppearance(value)}
                            className={cn(
                                'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors',
                                appearance === value
                                    ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100',
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={contentNavItems} label="Your Content" />
                <NavMain items={settingsNavItems} label="Customize" />
            </SidebarContent>

            <SidebarFooter>
                {/* View Live Site */}
                <SidebarGroup className="group-data-[collapsible=icon]:p-0">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={{ children: 'View Live Site' }}
                                    className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                                >
                                    <a href="/" target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-5 w-5" />
                                        <span>View Live Site</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <ThemeToggle />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
