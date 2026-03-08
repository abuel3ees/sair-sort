import { Link } from '@inertiajs/react';
import { Briefcase, Eye, FolderGit2, GraduationCap, Layers, LayoutGrid, Palette, Settings2, User } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const portfolioNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/portfolio',
        icon: Layers,
    },
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

const footerNavItems: NavItem[] = [
    {
        title: 'View Live Site',
        href: '/',
        icon: Eye,
    },
];

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
                <NavMain items={portfolioNavItems} label="Portfolio" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
