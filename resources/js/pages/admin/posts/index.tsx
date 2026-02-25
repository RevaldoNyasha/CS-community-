import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Posts', href: '/admin/posts' },
];

const btnPrimary = 'px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:brightness-110 transition-all';
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
    posts: PaginatedData<Post>;
    filters: { type?: string; status?: string };
};

export default function AdminPostsIndex({ posts, filters }: Props) {
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
            title: 'Delete Post',
            description: `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
            confirmLabel: 'Delete',
            confirmVariant: 'danger',
            onConfirm: () => {
                closeDialog();
                router.delete(`/admin/posts/${post.id}`);
            },
        });
    }

    const filterBtn = (active: boolean) =>
        `px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
            active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
        }`;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Posts" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">All Posts</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage all posts across the platform.</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Link href="/admin/posts" className={filterBtn(!filters.type && !filters.status)}>All</Link>
                    <Link href="/admin/posts?type=resource" className={filterBtn(filters.type === 'resource')}>Resources</Link>
                    <Link href="/admin/posts?type=hackathon" className={filterBtn(filters.type === 'hackathon')}>Hackathons</Link>
                    <Link href="/admin/posts?type=announcement" className={filterBtn(filters.type === 'announcement')}>Announcements</Link>
                    <Link
                        href="/admin/posts?status=pending"
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                            filters.status === 'pending'
                                ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
                                : 'border-border text-muted-foreground hover:border-yellow-500/30 hover:text-yellow-400'
                        }`}
                    >
                        Pending
                    </Link>
                </div>

                <div className="overflow-x-auto bg-card border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-secondary/20">
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Title</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Author</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Type</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Date</th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground text-sm">
                                        No posts found.
                                    </td>
                                </tr>
                            ) : (
                                posts.data.map((post) => (
                                    <tr key={post.id} className="border-b border-border last:border-0 hover:bg-secondary/10 transition-colors">
                                        <td className="px-5 py-3 font-medium text-foreground">{post.title}</td>
                                        <td className="px-5 py-3 text-muted-foreground">{post.user?.name ?? 'Admin'}</td>
                                        <td className="px-5 py-3">
                                            <span className="border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase rounded">
                                                {post.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 text-[10px] font-medium uppercase rounded ${
                                                post.status === 'approved'
                                                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                                    : 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {post.status === 'pending' && (
                                                    <button onClick={() => handleApprove(post)} className={btnPrimary}>
                                                        Approve
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(post)} className={btnDanger}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

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
