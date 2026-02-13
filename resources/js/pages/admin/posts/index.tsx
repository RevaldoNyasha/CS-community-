import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Posts', href: '/admin/posts' },
];

type Props = {
    posts: PaginatedData<Post>;
    filters: { type?: string; status?: string };
};

export default function AdminPostsIndex({ posts, filters }: Props) {
    function handleApprove(post: Post) {
        router.post(`/admin/posts/${post.id}/approve`);
    }

    function handleDelete(post: Post) {
        if (confirm(`Delete "${post.title}"?`)) {
            router.delete(`/admin/posts/${post.id}`);
        }
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Posts" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">All Posts</h1>
                    <p className="text-muted-foreground">Manage all posts across the platform.</p>
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/admin/posts"
                        className={`rounded-lg border px-3 py-1 text-sm ${!filters.type && !filters.status ? 'border-primary bg-primary text-primary-foreground' : 'border-sidebar-border/70 hover:bg-accent'}`}
                    >
                        All
                    </Link>
                    <Link
                        href="/admin/posts?type=resource"
                        className={`rounded-lg border px-3 py-1 text-sm ${filters.type === 'resource' ? 'border-primary bg-primary text-primary-foreground' : 'border-sidebar-border/70 hover:bg-accent'}`}
                    >
                        Resources
                    </Link>
                    <Link
                        href="/admin/posts?type=hackathon"
                        className={`rounded-lg border px-3 py-1 text-sm ${filters.type === 'hackathon' ? 'border-primary bg-primary text-primary-foreground' : 'border-sidebar-border/70 hover:bg-accent'}`}
                    >
                        Hackathons
                    </Link>
                    <Link
                        href="/admin/posts?type=announcement"
                        className={`rounded-lg border px-3 py-1 text-sm ${filters.type === 'announcement' ? 'border-primary bg-primary text-primary-foreground' : 'border-sidebar-border/70 hover:bg-accent'}`}
                    >
                        Announcements
                    </Link>
                    <Link
                        href="/admin/posts?status=pending"
                        className={`rounded-lg border px-3 py-1 text-sm ${filters.status === 'pending' ? 'border-yellow-500 bg-yellow-100 text-yellow-800' : 'border-sidebar-border/70 hover:bg-accent'}`}
                    >
                        Pending
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <th className="px-4 py-3 text-left font-medium">Title</th>
                                <th className="px-4 py-3 text-left font-medium">Author</th>
                                <th className="px-4 py-3 text-left font-medium">Type</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No posts found.
                                    </td>
                                </tr>
                            ) : (
                                posts.data.map((post) => (
                                    <tr key={post.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                        <td className="px-4 py-3 font-medium">{post.title}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{post.user?.name ?? 'Admin'}</td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                                                {post.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                post.status === 'approved'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {post.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleApprove(post)}
                                                        className="text-xs text-green-600 hover:underline"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(post)}
                                                    className="text-xs text-destructive hover:underline"
                                                >
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
                    <div className="flex justify-center gap-2">
                        {posts.links.map((link, i) => (
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
