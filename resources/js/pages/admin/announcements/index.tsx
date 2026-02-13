import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Announcements', href: '/admin/announcements' },
];

type Props = {
    announcements: PaginatedData<Post>;
};

export default function AdminAnnouncementsIndex({ announcements }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        content: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/announcements', {
            onSuccess: () => reset(),
        });
    }

    function handleDelete(announcement: Post) {
        if (confirm(`Delete "${announcement.title}"?`)) {
            router.delete(`/admin/announcements/${announcement.id}`);
        }
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
                    <p className="text-muted-foreground">Create and manage announcements visible to all users.</p>
                </div>

                <form onSubmit={handleSubmit} className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h3 className="mb-3 font-semibold">New Announcement</h3>
                    <div className="space-y-3">
                        <div>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Announcement title"
                            />
                            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <div>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                                placeholder="Announcement content..."
                            />
                            {errors.content && <p className="mt-1 text-sm text-destructive">{errors.content}</p>}
                        </div>
                        <Button type="submit" disabled={processing}>
                            Post Announcement
                        </Button>
                    </div>
                </form>

                <div>
                    <h2 className="mb-3 text-lg font-semibold">All Announcements</h2>
                    {announcements.data.length === 0 ? (
                        <div className="rounded-xl border border-sidebar-border/70 p-6 text-center text-muted-foreground dark:border-sidebar-border">
                            No announcements yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {announcements.data.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{announcement.title}</h3>
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                                            <span className="mt-2 block text-xs text-muted-foreground">
                                                {new Date(announcement.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(announcement)}
                                            className="ml-4 text-xs text-destructive hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {announcements.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {announcements.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded-lg border px-3 py-1 text-sm ${
                                    link.active
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-sidebar-border/70 hover:bg-accent'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
