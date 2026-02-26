import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Pending Approvals', href: '/admin/pending' },
];

const btnPrimary = 'px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:brightness-110 transition-all';
const btnDanger = 'px-3 py-1.5 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold rounded-md hover:bg-red-500/20 transition-all';

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
    posts: PaginatedData<Post>;
};

export default function AdminPendingIndex({ posts }: Props) {
    const [dialog, setDialog] = useState<DialogState>(defaultDialog);

    function closeDialog() {
        setDialog((d) => ({ ...d, open: false }));
    }

    function handleApprove(post: Post) {
        setDialog({
            open: true,
            title: 'Approve Post',
            description: `Approve "${post.title}"? It will become visible to all users.`,
            confirmLabel: 'Approve',
            confirmVariant: 'primary',
            onConfirm: () => {
                closeDialog();
                router.post(`/admin/posts/${post.id}/approve`);
            },
        });
    }

    function handleDelete(post: Post) {
        setDialog({
            open: true,
            title: 'Reject Post',
            description: `Reject and delete "${post.title}"? This action cannot be undone.`,
            confirmLabel: 'Reject',
            confirmVariant: 'danger',
            onConfirm: () => {
                closeDialog();
                router.delete(`/admin/posts/${post.id}`);
            },
        });
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Approvals" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Pending Approvals</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Review and approve user-submitted posts.</p>
                </div>

                {posts.data.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
                        No pending posts. All caught up.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.data.map((post) => (
                            <div key={post.id} className="bg-card border border-border rounded-lg p-5 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase rounded">
                                                {post.type}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                by {post.user?.name ?? 'Unknown'}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-foreground">{post.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                                        <span className="mt-2 block text-xs text-muted-foreground/50">
                                            Submitted {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="ml-4 flex shrink-0 gap-2">
                                        <button onClick={() => handleApprove(post)} className={btnPrimary}>
                                            Approve
                                        </button>
                                        <button onClick={() => handleDelete(post)} className={btnDanger}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {posts.last_page > 1 && (
                    <div className="flex justify-center gap-1.5">
                        {posts.links.map((link, i) => (
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
