import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Lightbulb,
    PenSquare,
    ShieldCheck,
    Trophy,
} from 'lucide-react';
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
        href: dashboard().url,
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
        title: 'Projects',
        href: '/projects',
        icon: FolderGit2,
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



const guestNavItems: NavItem[] = [
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
        title: 'Projects',
        href: '/projects',
        icon: FolderGit2,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    let items: (NavItem | NavGroup)[];
    if (!auth.user) {
        items = guestNavItems;
    } else if (auth.isAdmin) {
        items = [...mainNavItems, adminNavGroup];
    } else {
        items = mainNavItems;
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className="text-foreground">
            <SidebarHeader className="border-b border-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent hover:text-current">
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

            <SidebarFooter className="border-t border-border">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
