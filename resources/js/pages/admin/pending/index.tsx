import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Pending Approvals', href: '/admin/pending' },
];

type Props = {
    posts: PaginatedData<Post>;
};

export default function AdminPendingIndex({ posts }: Props) {
    function handleApprove(post: Post) {
        router.post(`/admin/posts/${post.id}/approve`);
    }

    function handleDelete(post: Post) {
        if (confirm(`Reject and delete "${post.title}"?`)) {
            router.delete(`/admin/posts/${post.id}`);
        }
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Approvals" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">Pending Approvals</h1>
                    <p className="text-muted-foreground">Review and approve user-submitted posts.</p>
                </div>

                {posts.data.length === 0 ? (
                    <div className="mc-container text-center text-muted-foreground">
                        No pending posts. All caught up!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.data.map((post) => (
                            <div key={post.id} className="mc-container">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-brutal-green px-2 py-0.5 text-xs font-medium text-black uppercase">
                                                {post.type}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                by {post.user?.name ?? 'Unknown'}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                                        <span className="mt-2 block text-xs text-muted-foreground">
                                            Submitted {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="ml-4 flex shrink-0 gap-2">
                                        <button
                                            onClick={() => handleApprove(post)}
                                            className="mc-btn text-xs !py-1"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post)}
                                            className="mc-btn mc-btn-danger text-xs !py-1"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
