import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, FeedItem, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Content Feed', href: '/admin/feed' },
];

const btnDanger = 'px-3 py-1.5 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold rounded-md hover:bg-red-500/20 transition-all';

type DialogState = {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
};

const defaultDialog: DialogState = {
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
};

type Props = {
    feedItems: PaginatedData<FeedItem>;
};

export default function AdminFeedIndex({ feedItems }: Props) {
    const [dialog, setDialog] = useState<DialogState>(defaultDialog);

    function closeDialog() {
        setDialog((d) => ({ ...d, open: false }));
    }

    function handleRemove(item: FeedItem) {
        setDialog({
            open: true,
            title: 'Remove Feed Item',
            description: `Remove "${item.title}" from the public feed? This hides it from the site.`,
            onConfirm: () => {
                closeDialog();
                router.delete(`/admin/feed/${item.slug}`);
            },
        });
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Content Feed" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Automated Content Feed</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        AI-curated items published by the automation pipeline. Remove anything low-quality or off-topic.
                    </p>
                </div>

                {feedItems.data.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
                        No feed items yet. The automation will populate this list.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {feedItems.data.map((item) => (
                            <div key={item.id} className="bg-card border border-border rounded-lg p-5 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase rounded">
                                                {item.category}
                                            </span>
                                            {item.difficulty && (
                                                <span className="border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase rounded">
                                                    {item.difficulty}
                                                </span>
                                            )}
                                            {item.status === 'removed' && (
                                                <span className="border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400 uppercase rounded">
                                                    Removed
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">from {item.source}</span>
                                            {item.author && <span className="text-xs text-muted-foreground/70">· {item.author}</span>}
                                            {item.reading_time_minutes && (
                                                <span className="text-xs text-muted-foreground/70">· {item.reading_time_minutes} min read</span>
                                            )}
                                        </div>
                                        <a
                                            href={item.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-foreground hover:text-primary hover:underline"
                                        >
                                            {item.title}
                                        </a>
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {item.tags.map((tag) => (
                                                    <span key={tag} className="text-[11px] text-muted-foreground/70">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <span className="mt-2 block text-xs text-muted-foreground/50">
                                            Published {item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}
                                        </span>
                                    </div>
                                    {item.status === 'published' && (
                                        <div className="ml-4 flex shrink-0 gap-2">
                                            <button onClick={() => handleRemove(item)} className={btnDanger}>
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {feedItems.last_page > 1 && (
                    <div className="flex justify-center gap-1.5">
                        {feedItems.links.map((link, i) => (
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
                confirmLabel="Remove"
                confirmVariant="danger"
                onConfirm={dialog.onConfirm}
                onCancel={closeDialog}
            />
        </AdminLayout>
    );
}
