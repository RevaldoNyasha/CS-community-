import { Link, usePage } from '@inertiajs/react';
import {
    Compass,
    Folder,
    FolderGit2,
    House,
    Lightbulb,
    MessageCircle,
    Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { tagColor } from '@/lib/tag-color';
import { cn } from '@/lib/utils';
import { dashboard, home } from '@/routes';
import type { SharedData } from '@/types';

type NavLink = {
    title: string;
    href: string;
    icon: LucideIcon;
    isActive: (path: string, query: URLSearchParams) => boolean;
    badge?: number;
};

const onDashboard = (path: string) => path === '/dashboard';
const startsWith = (prefix: string) => (path: string) =>
    path === prefix || path.startsWith(`${prefix}/`);

function memberLinks(unread: number): NavLink[] {
    return [
        {
            title: 'Dashboard',
            href: dashboard().url,
            icon: House,
            isActive: (path, q) =>
                onDashboard(path) && q.get('sort') !== 'popular',
        },
        {
            title: 'Explore',
            href: '/dashboard?sort=popular',
            icon: Compass,
            isActive: (path, q) =>
                onDashboard(path) && q.get('sort') === 'popular',
        },
        {
            title: 'Hackathons',
            href: '/hackathons',
            icon: Trophy,
            isActive: startsWith('/hackathons'),
        },
        {
            title: 'Projects',
            href: '/projects',
            icon: FolderGit2,
            isActive: startsWith('/projects'),
        },
        {
            title: 'Resources',
            href: '/resources',
            icon: Folder,
            isActive: startsWith('/resources'),
        },
        {
            title: 'Ideas',
            href: '/suggestions',
            icon: Lightbulb,
            isActive: startsWith('/suggestions'),
        },
        {
            title: 'Messages',
            href: '/messages',
            icon: MessageCircle,
            isActive: startsWith('/messages'),
            badge: unread,
        },
    ];
}

const guestLinks: NavLink[] = memberLinks(0).filter((link) =>
    ['/resources', '/hackathons', '/projects'].includes(link.href),
);

export function SidebarLogo() {
    const { auth } = usePage<SharedData>().props;

    return (
        <Link
            href={auth.user ? dashboard() : home()}
            className="flex h-16 shrink-0 items-center gap-2.5 px-5"
        >
            <img
                src="/newIcons/navbarIcon.png"
                alt=""
                className="size-8 object-contain"
            />
            <span className="text-lg font-bold tracking-wide">DEV-CRAFT</span>
        </Link>
    );
}

export function SidebarSectionTitle({
    children,
    action,
}: {
    children: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between px-3 pt-6 pb-2.5">
            <h2 className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {children}
            </h2>
            {action}
        </div>
    );
}

export function SidebarLink({
    icon: Icon,
    title,
    href,
    active,
    badge,
}: {
    icon: LucideIcon;
    title: string;
    href: string;
    active: boolean;
    badge?: number;
}) {
    return (
        <Link
            href={href}
            prefetch
            aria-current={active ? 'page' : undefined}
            className={cn(
                'flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors',
                active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            )}
        >
            <Icon className="size-[19px] shrink-0" strokeWidth={1.75} />
            <span className="flex-1 truncate">{title}</span>
            {!!badge && badge > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                    {badge > 20 ? '20+' : badge}
                </span>
            )}
        </Link>
    );
}

function TagList() {
    const { auth, popularTags = [] } = usePage<SharedData>().props;
    const { url } = usePage();
    const [expanded, setExpanded] = useState(false);
    const activeTag = new URLSearchParams(url.split('?')[1] ?? '').get('tag');

    if (popularTags.length === 0) return null;

    const shown = expanded ? popularTags : popularTags.slice(0, 9);

    return (
        <>
            <SidebarSectionTitle
                action={
                    popularTags.length > 9 && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            {expanded ? 'Show less' : 'See all'}
                        </button>
                    )
                }
            >
                Tags
            </SidebarSectionTitle>
            <ul className="flex flex-col items-start gap-1.5 px-2">
                {shown.map((tag) => {
                    const active = activeTag === String(tag.id);
                    // The dashboard needs an account; guests search the resources instead.
                    const href = auth.user
                        ? `/dashboard?tag=${tag.id}`
                        : `/resources?search=${encodeURIComponent(tag.name)}`;

                    return (
                        <li key={tag.id}>
                            <Link
                                href={active ? dashboard().url : href}
                                preserveScroll
                                className={cn(
                                    'flex items-center gap-2 rounded-full px-3 py-1 text-[13px] transition-colors',
                                    active
                                        ? 'bg-foreground text-background'
                                        : 'bg-sidebar-accent/70 text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                                )}
                            >
                                <span
                                    className={cn(
                                        'size-2 rounded-full',
                                        tagColor(tag.name).dot,
                                    )}
                                />
                                #{tag.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

type Props = {
    /** Extra navigation shown under the main links (e.g. the admin sections). */
    section?: ReactNode;
};

// App sidebar: logo, the main sections, then either a page-specific section or the popular tags.
export function AppSidebarContent({ section }: Props) {
    const { auth, unreadMessages = 0 } = usePage<SharedData>().props;
    const { url } = usePage();
    const [path, search = ''] = url.split('?');
    const query = new URLSearchParams(search);
    const links = auth.user ? memberLinks(unreadMessages) : guestLinks;

    return (
        <nav aria-label="Main" className="px-3 pb-6">
            <div className="space-y-1">
                {links.map((link) => (
                    <SidebarLink
                        key={link.title}
                        icon={link.icon}
                        title={link.title}
                        href={link.href}
                        active={link.isActive(path, query)}
                        badge={link.badge}
                    />
                ))}
            </div>

            {section ?? <TagList />}
        </nav>
    );
}
