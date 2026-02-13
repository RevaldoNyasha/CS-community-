import { Head, Link } from '@inertiajs/react';
import { Clock, FileText, Lightbulb, Users } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
];

type Props = {
    stats: {
        totalUsers: number;
        totalPosts: number;
        pendingPosts: number;
        totalSuggestions: number;
    };
    recentPosts: Post[];
};

export default function AdminDashboard({ stats, recentPosts }: Props) {
    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, href: '/admin/users' },
        { title: 'Total Posts', value: stats.totalPosts, icon: FileText, href: '/admin/posts' },
        { title: 'Pending Approvals', value: stats.pendingPosts, icon: Clock, href: '/admin/pending' },
        { title: 'Suggestions', value: stats.totalSuggestions, icon: Lightbulb, href: '/admin/suggestions' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">System overview and management.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{card.title}</span>
                                <card.icon className="size-4 text-muted-foreground" />
                            </div>
                            <p className="mt-2 text-3xl font-bold">{card.value}</p>
                        </Link>
                    ))}
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-semibold">Recent Posts</h2>
                    {recentPosts.length === 0 ? (
                        <div className="rounded-xl border border-sidebar-border/70 p-6 text-center text-muted-foreground dark:border-sidebar-border">
                            No posts yet.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex items-center justify-between rounded-xl border border-sidebar-border/70 p-3 dark:border-sidebar-border"
                                >
                                    <div>
                                        <span className="font-medium">{post.title}</span>
                                        <span className="ml-2 text-xs text-muted-foreground">by {post.user?.name ?? 'Admin'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                                            {post.type}
                                        </span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            post.status === 'approved'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {post.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
