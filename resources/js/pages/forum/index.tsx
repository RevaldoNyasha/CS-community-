import { Head, Link, router } from '@inertiajs/react';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ForumCategory, ForumPost, PaginatedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Community Forum', href: '/forum' },
];

type Props = {
    posts: PaginatedData<ForumPost>;
    categories: ForumCategory[];
    filters: {
        category_id?: string;
        search?: string;
    };
};

export default function ForumIndex({ posts, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilter(key: string, value: string) {
        router.get('/forum', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilter('search', search);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Community Forum" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Community Forum</h1>
                        <p className="text-muted-foreground">Discuss topics with fellow students and find answers.</p>
                    </div>
                    <Button asChild>
                        <Link href="/forum/create">
                            <Plus className="mr-2 size-4" />
                            New Post
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search discussions..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    <select
                        value={filters.category_id ?? ''}
                        onChange={(e) => applyFilter('category_id', e.target.value)}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {posts.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                        No discussions found. Start a new one!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.data.map((post) => (
                            <div
                                key={post.id}
                                className="group flex flex-col rounded-xl border p-5 transition-colors hover:bg-accent/50"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">{post.user?.name}</span>
                                            <span>&middot;</span>
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            {post.forum_category && (
                                                <>
                                                    <span>&middot;</span>
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        {post.forum_category.name}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <Link href={`/forum/${post.id}`}>
                                            <h2 className="mt-2 text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                {post.title}
                                            </h2>
                                        </Link>
                                        <p className="mt-2 text-muted-foreground line-clamp-2">
                                            {post.body}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <MessageSquare className="size-4" />
                                        <span className="text-sm font-medium">{post.forum_comments_count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {posts.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {posts.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : link.url
                                          ? 'hover:bg-accent'
                                          : 'cursor-default text-muted-foreground'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
