import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, Lightbulb, Megaphone, PenSquare, Trophy } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Props = {
    recentPosts: Post[];
    announcements: Post[];
    pendingCount: number;
};

const quickLinks = [
    { title: 'Resources', href: '/resources', icon: BookOpen, description: 'Browse shared resources' },
    { title: 'Hackathons', href: '/hackathons', icon: Trophy, description: 'Discover hackathon events' },
    { title: 'Submit Post', href: '/posts/create', icon: PenSquare, description: 'Share a resource or hackathon' },
    { title: 'Suggestions', href: '/suggestions', icon: Lightbulb, description: 'Submit feedback to admins' },
];

export default function Dashboard({ recentPosts, announcements, pendingCount }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome to CS Community</h1>
                    <p className="text-muted-foreground">Your hub for resources, hackathons, and collaboration.</p>
                </div>

                {pendingCount > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">
                        <Clock className="size-5 shrink-0" />
                        <span>
                            You have <strong>{pendingCount}</strong> post{pendingCount > 1 ? 's' : ''} pending approval.
                        </span>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="group rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <link.icon className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{link.title}</h3>
                                    <p className="text-sm text-muted-foreground">{link.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {announcements.length > 0 && (
                    <div>
                        <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
                            <Megaphone className="size-5" />
                            Announcements
                        </h2>
                        <div className="space-y-3">
                            {announcements.map((post) => (
                                <div
                                    key={post.id}
                                    className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                                >
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                    <span className="mt-2 block text-xs text-muted-foreground">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="mb-3 text-lg font-semibold">Recent Posts</h2>
                    {recentPosts.length === 0 ? (
                        <div className="rounded-xl border border-sidebar-border/70 p-6 text-center text-muted-foreground dark:border-sidebar-border">
                            No posts yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/posts/${post.id}`}
                                    className="block rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                                            {post.type}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{post.user?.name}</span>
                                        <span>&middot;</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        {post.comments_count !== undefined && (
                                            <>
                                                <span>&middot;</span>
                                                <span>{post.comments_count} comments</span>
                                            </>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
