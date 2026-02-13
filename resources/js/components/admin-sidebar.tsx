import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    FileText,
    LayoutGrid,
    Lightbulb,
    Megaphone,
    PenSquare,
    Settings,
    ShieldCheck,
    Trophy,
    Users,
} from 'lucide-react';
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
import type { NavGroup, NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: (NavItem | NavGroup)[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Resources',
        href: '/resources',
        icon: BookOpen,
    },
    {
        title: 'Hackathons',
        href: '/hackathons',
        icon: Trophy,
    },
    {
        title: 'Submit Post',
        href: '/posts/create',
        icon: PenSquare,
    },
    {
        title: 'Suggestions',
        href: '/suggestions',
        icon: Lightbulb,
    },
    {
        title: 'Admin Settings',
        icon: ShieldCheck,
        items: [
            {
                title: 'Admin Dashboard',
                href: '/admin',
            },
            {
                title: 'Users',
                href: '/admin/users',
            },
            {
                title: 'Posts',
                href: '/admin/posts',
            },
            {
                title: 'Pending Approvals',
                href: '/admin/pending',
            },
            {
                title: 'Suggestions',
                href: '/admin/suggestions',
            },
            {
                title: 'Announcements',
                href: '/admin/announcements',
            },
            {
                title: 'Settings',
                href: '/admin/settings',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [];

export function AdminSidebar() {
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
            </SidebarContent>

            <SidebarFooter>
                {footerNavItems.length > 0 && (
                    <NavFooter items={footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
