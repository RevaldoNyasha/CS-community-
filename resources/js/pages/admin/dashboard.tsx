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
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">
                        Operator Dashboard
                    </h1>
                    <p className="text-muted-foreground">System overview and management.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="mc-container text-center transition-all hover:brightness-110"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <card.icon className="size-8 text-brutal-green" />
                                <span className="text-sm text-muted-foreground uppercase">{card.title}</span>
                                <p className="text-4xl font-bold text-brutal-green font-mono">{card.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-semibold uppercase font-mono text-brutal-green">Activity Feed</h2>
                    {recentPosts.length === 0 ? (
                        <div className="mc-container text-center text-muted-foreground">
                            No posts yet.
                        </div>
                    ) : (
                        <div className="mc-container !p-0">
                            {recentPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className={`flex items-center justify-between p-3 mc-slot !border-x-0 ${index === 0 ? '!border-t-0' : ''} ${index === recentPosts.length - 1 ? '!border-b-0' : ''}`}
                                >
                                    <div>
                                        <span className="font-medium">{post.title}</span>
                                        <span className="ml-2 text-xs text-muted-foreground">by {post.user?.name ?? 'Admin'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-brutal-green px-2 py-0.5 text-xs font-medium text-black uppercase font-mono">
                                            {post.type}
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs font-medium uppercase font-mono ${
                                            post.status === 'approved'
                                                ? 'bg-brutal-green/20 text-brutal-green border-2 border-brutal-green'
                                                : 'bg-brutal-yellow/20 text-brutal-yellow border-2 border-brutal-yellow'
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
