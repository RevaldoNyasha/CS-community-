import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    Lightbulb,
    PenSquare,
    ShieldCheck,
    Trophy,
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
import type { NavGroup, NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
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
];

const adminNavGroup: NavGroup = {
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
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const items: (NavItem | NavGroup)[] = auth.isAdmin
        ? [...mainNavItems, adminNavGroup]
        : mainNavItems;

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
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
