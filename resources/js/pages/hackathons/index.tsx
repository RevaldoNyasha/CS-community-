import { Head, Link } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Hackathons', href: '/hackathons' },
];

type Props = {
    posts: PaginatedData<Post>;
};

export default function HackathonsIndex({ posts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hackathons" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Hackathons</h1>
                        <p className="text-muted-foreground">Discover hackathon events and competitions.</p>
                    </div>
                    <Link
                        href="/posts/create"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Share Hackathon
                    </Link>
                </div>

                {posts.data.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 p-8 text-center text-muted-foreground dark:border-sidebar-border">
                        No hackathons posted yet. Know about one? Share it!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.data.map((post) => (
                            <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="block rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-accent dark:border-sidebar-border"
                            >
                                <h3 className="font-semibold">{post.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{post.user?.name}</span>
                                    <span>&middot;</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    {post.comments_count !== undefined && (
                                        <>
                                            <span>&middot;</span>
                                            <MessageSquare className="size-3" />
                                            <span>{post.comments_count}</span>
                                        </>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

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
        </AppLayout>
    );
}
