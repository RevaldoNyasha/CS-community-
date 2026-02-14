import { Head, Link, router, useForm } from '@inertiajs/react';
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
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">Announcements</h1>
                    <p className="text-muted-foreground">Create and manage announcements visible to all users.</p>
                </div>

                <form onSubmit={handleSubmit} className="mc-container">
                    <h3 className="mb-3 font-semibold uppercase text-brutal-green font-mono">New Announcement</h3>
                    <div className="space-y-3">
                        <div>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full mc-slot px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brutal-green"
                                placeholder="Announcement title"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                        </div>
                        <div>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full mc-slot px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brutal-green min-h-[100px]"
                                placeholder="Announcement content..."
                            />
                            {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content}</p>}
                        </div>
                        <button type="submit" disabled={processing} className="mc-btn disabled:opacity-50">
                            Post Announcement
                        </button>
                    </div>
                </form>

                <div>
                    <h2 className="mb-3 text-lg font-semibold uppercase font-mono text-brutal-green">All Announcements</h2>
                    {announcements.data.length === 0 ? (
                        <div className="mc-container text-center text-muted-foreground">
                            No announcements yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {announcements.data.map((announcement) => (
                                <div key={announcement.id} className="mc-container">
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
                                            className="ml-4 mc-btn mc-btn-danger text-xs !py-0.5 !px-2"
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
                                className={`mc-btn !py-1 !px-3 text-sm ${
                                    link.active
                                        ? 'mc-btn-gold'
                                        : '!bg-card !border-brutal-border !text-foreground'
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
