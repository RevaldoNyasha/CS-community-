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
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-background">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Admin Dashboard</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">System overview and management.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">{card.title}</p>
                                    <p className="text-3xl font-light text-foreground group-hover:text-primary transition-colors">{card.value}</p>
                                </div>
                                <card.icon className="size-4 text-muted-foreground/40 mt-0.5" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div>
                    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Activity Feed</h2>
                    {recentPosts.length === 0 ? (
                        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
                            No posts yet.
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-lg overflow-hidden">
                            {recentPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className={`flex items-center justify-between px-5 py-3 text-sm ${index !== recentPosts.length - 1 ? 'border-b border-border' : ''}`}
                                >
                                    <div>
                                        <span className="font-medium text-foreground">{post.title}</span>
                                        <span className="ml-2 text-xs text-muted-foreground">by {post.user?.name ?? 'Admin'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase rounded">
                                            {post.type}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-medium uppercase rounded ${
                                            post.status === 'approved'
                                                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                                : 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
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
