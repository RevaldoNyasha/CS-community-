import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Announcements', href: '/admin/announcements' },
];

const inputClass = 'w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-colors';
const btnDanger = 'px-3 py-1 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold rounded-md hover:bg-red-500/20 transition-all';

type DialogState = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmVariant: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
};

const defaultDialog: DialogState = {
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'danger',
    onConfirm: () => {},
};

type Props = {
    announcements: PaginatedData<Post>;
};

export default function AdminAnnouncementsIndex({ announcements }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        content: '',
    });
    const [dialog, setDialog] = useState<DialogState>(defaultDialog);

    function closeDialog() {
        setDialog((d) => ({ ...d, open: false }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/announcements', {
            onSuccess: () => reset(),
        });
    }

    function handleDelete(announcement: Post) {
        setDialog({
            open: true,
            title: 'Delete Announcement',
            description: `Are you sure you want to delete "${announcement.title}"? This action cannot be undone.`,
            confirmLabel: 'Delete',
            confirmVariant: 'danger',
            onConfirm: () => {
                closeDialog();
                router.delete(`/admin/announcements/${announcement.slug}`);
            },
        });
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Announcements</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Create and manage announcements visible to all users.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-5 shadow-sm">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">New Announcement</h3>
                    <div className="space-y-3">
                        <div>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={inputClass}
                                placeholder="Announcement title"
                            />
                            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
                        </div>
                        <div>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className={`${inputClass} min-h-25 resize-none`}
                                placeholder="Announcement content..."
                            />
                            {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-md hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            Post Announcement
                        </button>
                    </div>
                </form>

                <div>
                    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">All Announcements</h2>
                    {announcements.data.length === 0 ? (
                        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
                            No announcements yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {announcements.data.map((announcement) => (
                                <div key={announcement.id} className="bg-card border border-border rounded-lg p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                                            <span className="mt-2 block text-xs text-muted-foreground/50">
                                                {new Date(announcement.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(announcement)}
                                            className={`ml-4 shrink-0 ${btnDanger}`}
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
                    <div className="flex justify-center gap-1.5">
                        {announcements.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                                    link.active
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog
                open={dialog.open}
                title={dialog.title}
                description={dialog.description}
                confirmLabel={dialog.confirmLabel}
                confirmVariant={dialog.confirmVariant}
                onConfirm={dialog.onConfirm}
                onCancel={closeDialog}
            />
        </AdminLayout>
    );
}
