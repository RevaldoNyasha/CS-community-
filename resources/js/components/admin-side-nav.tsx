import { usePage } from '@inertiajs/react';
import {
    Clock,
    FileText,
    LayoutDashboard,
    Lightbulb,
    Megaphone,
    Settings,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SidebarLink, SidebarSectionTitle } from '@/components/app-sidebar';

const sections: { title: string; href: string; icon: LucideIcon }[] = [
    { title: 'Overview', href: '/admin', icon: LayoutDashboard },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Posts', href: '/admin/posts', icon: FileText },
    { title: 'Pending approvals', href: '/admin/pending', icon: Clock },
    { title: 'Suggestions', href: '/admin/suggestions', icon: Lightbulb },
    { title: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
];

// Admin sections, shown in the app sidebar under the main links.
export function AdminSideNav() {
    const path = usePage().url.split('?')[0];

    // Overview matches exactly; other sections also stay active on their sub-pages (e.g. /admin/users/5).
    const isActive = (href: string) =>
        href === '/admin'
            ? path === '/admin'
            : path === href || path.startsWith(`${href}/`);

    return (
        <div>
            <SidebarSectionTitle>Admin</SidebarSectionTitle>
            <div className="space-y-1">
                {sections.map((section) => (
                    <SidebarLink
                        key={section.href}
                        icon={section.icon}
                        title={section.title}
                        href={section.href}
                        active={isActive(section.href)}
                    />
                ))}
            </div>
        </div>
    );
}
