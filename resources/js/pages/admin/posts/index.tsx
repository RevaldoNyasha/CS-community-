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
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">All Posts</h1>
                    <p className="text-muted-foreground">Manage all posts across the platform.</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Link
                        href="/admin/posts"
                        className={`mc-btn !py-1 !px-3 text-sm ${!filters.type && !filters.status ? 'mc-btn-gold' : '!bg-card !border-brutal-border !text-foreground'}`}
                    >
                        All
                    </Link>
                    <Link
                        href="/admin/posts?type=resource"
                        className={`mc-btn !py-1 !px-3 text-sm ${filters.type === 'resource' ? 'mc-btn-gold' : '!bg-card !border-brutal-border !text-foreground'}`}
                    >
                        Resources
                    </Link>
                    <Link
                        href="/admin/posts?type=hackathon"
                        className={`mc-btn !py-1 !px-3 text-sm ${filters.type === 'hackathon' ? 'mc-btn-gold' : '!bg-card !border-brutal-border !text-foreground'}`}
                    >
                        Hackathons
                    </Link>
                    <Link
                        href="/admin/posts?type=announcement"
                        className={`mc-btn !py-1 !px-3 text-sm ${filters.type === 'announcement' ? 'mc-btn-gold' : '!bg-card !border-brutal-border !text-foreground'}`}
                    >
                        Announcements
                    </Link>
                    <Link
                        href="/admin/posts?status=pending"
                        className={`mc-btn !py-1 !px-3 text-sm ${filters.status === 'pending' ? '!bg-brutal-yellow/20 !border-brutal-yellow !text-brutal-yellow' : '!bg-card !border-brutal-border !text-foreground'}`}
                    >
                        Pending
                    </Link>
                </div>

                <div className="overflow-x-auto mc-container !p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-3 border-brutal-border bg-muted/30">
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Title</th>
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Author</th>
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Type</th>
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Status</th>
                                <th className="px-4 py-3 text-left font-medium uppercase text-brutal-green font-mono">Date</th>
                                <th className="px-4 py-3 text-right font-medium uppercase text-brutal-green font-mono">Actions</th>
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
                                    <tr key={post.id} className="border-b-2 border-brutal-border last:border-0">
                                        <td className="px-4 py-3 font-medium">{post.title}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{post.user?.name ?? 'Admin'}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-brutal-green px-2 py-0.5 text-xs font-medium text-black uppercase font-mono">
                                                {post.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 text-xs font-medium uppercase font-mono ${
                                                post.status === 'approved'
                                                    ? 'bg-brutal-green/20 text-brutal-green border-2 border-brutal-green'
                                                    : 'bg-brutal-yellow/20 text-brutal-yellow border-2 border-brutal-yellow'
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
                                                        className="mc-btn !py-0.5 !px-2 text-xs"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(post)}
                                                    className="mc-btn mc-btn-danger !py-0.5 !px-2 text-xs"
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
