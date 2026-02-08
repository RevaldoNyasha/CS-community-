import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Megaphone, Pin, Plus, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Announcement, BreadcrumbItem, PaginatedData, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Announcements', href: '/announcements' },
];

type Props = {
    announcements: PaginatedData<Announcement>;
};

export default function AnnouncementIndex({ announcements }: Props) {
    const { auth } = usePage<SharedData>().props;

    const deleteAnnouncement = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            router.delete(`/announcements/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Megaphone className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
                            <p className="text-muted-foreground">Stay updated with the latest news from NUST CS.</p>
                        </div>
                    </div>
                    {auth.user.is_admin && (
                        <Button asChild>
                            <Link href="/announcements/create">
                                <Plus className="mr-2 size-4" />
                                New Announcement
                            </Link>
                        </Button>
                    )}
                </div>

                {announcements.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                        No announcements yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.data.map((announcement) => (
                            <div
                                key={announcement.id}
                                className={`rounded-xl border p-6 transition-colors shadow-sm ${
                                    announcement.is_pinned ? 'bg-primary/5 border-primary/20' : 'bg-card'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {announcement.is_pinned && (
                                                <span className="flex items-center gap-1 font-bold text-primary uppercase text-[10px] tracking-wider">
                                                    <Pin className="size-3 fill-current" />
                                                    Pinned
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="size-3" />
                                                {new Date(announcement.created_at).toLocaleDateString()}
                                            </span>
                                            <span>&middot;</span>
                                            <span className="flex items-center gap-1">
                                                <User className="size-3" />
                                                {announcement.user?.name}
                                            </span>
                                        </div>
                                        <h2 className="mt-2 text-xl font-bold">{announcement.title}</h2>
                                        <p className="mt-4 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                            {announcement.body}
                                        </p>
                                    </div>
                                    {auth.user.is_admin && (
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/announcements/${announcement.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => deleteAnnouncement(announcement.id)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {announcements.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {announcements.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : link.url
                                          ? 'hover:bg-accent'
                                          : 'cursor-default text-muted-foreground'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
