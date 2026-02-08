import { Head, Link } from '@inertiajs/react';
import { Briefcase, GraduationCap, MessageSquare, Pin, Trophy, Video } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { Announcement, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Props = {
    announcements: Announcement[];
};

const quickLinks = [
    { title: 'Announcements', href: '/announcements', icon: Pin, description: 'Latest news and updates' },
    { title: 'Study Resources', href: '/study-resources', icon: GraduationCap, description: 'Past exams and lecture notes' },
    { title: 'Tutorials', href: '/tutorials', icon: Video, description: 'Curated learning resources' },
    { title: 'Community Forum', href: '/forum', icon: MessageSquare, description: 'Discuss with fellow students' },
    { title: 'Career Guidance', href: '/career-guidance', icon: Briefcase, description: 'Jobs and career advice' },
    { title: 'Achievements', href: '/achievements', icon: Trophy, description: 'Student success stories' },
];

export default function Dashboard({ announcements }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome to NUST CS Community</h1>
                    <p className="text-muted-foreground">Your hub for study resources, tutorials, discussions, and career guidance.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="group rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <link.icon className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{link.title}</h3>
                                    <p className="text-sm text-muted-foreground">{link.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-semibold">Announcements</h2>
                    {announcements.length === 0 ? (
                        <div className="rounded-xl border border-sidebar-border/70 p-6 text-center text-muted-foreground dark:border-sidebar-border">
                            No announcements yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                                >
                                    <div className="flex items-start gap-2">
                                        {announcement.is_pinned && (
                                            <Pin className="mt-0.5 size-4 shrink-0 text-primary" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold">{announcement.title}</h3>
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                {announcement.body}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{announcement.user?.name}</span>
                                                <span>&middot;</span>
                                                <span>
                                                    {announcement.published_at
                                                        ? new Date(announcement.published_at).toLocaleDateString()
                                                        : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
