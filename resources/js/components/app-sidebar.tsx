import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Briefcase,
    Folder,
    GraduationCap,
    LayoutGrid,
    Megaphone,
    MessageSquare,
    Trophy,
    Video,
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
        title: 'Announcements',
        href: '/announcements',
        icon: Megaphone,
    },
    {
        title: 'Study Resources',
        icon: GraduationCap,
        items: [
            { title: 'All Resources', href: '/study-resources' },
            { title: 'Past Exams', href: '/study-resources?type=past_exam' },
            { title: 'Lecture Notes', href: '/study-resources?type=lecture_note' },
            { title: 'Modules', href: '/study-resources?type=module' },
        ],
    },
    {
        title: 'Tutorials',
        href: '/tutorials',
        icon: Video,
    },
    {
        title: 'Community Forum',
        href: '/forum',
        icon: MessageSquare,
    },
    {
        title: 'Career Guidance',
        href: '/career-guidance',
        icon: Briefcase,
    },
    {
        title: 'Achievements & Alumni',
        href: '/achievements',
        icon: Trophy,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
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
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
