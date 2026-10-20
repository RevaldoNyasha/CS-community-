import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    FolderGit2,
    Inbox,
    Megaphone,
    Plus,
    Search,
    Trophy,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { tileGridClass } from '@/components/listing';
import { PostTile } from '@/components/post-tile';
import { SidebarRow } from '@/components/sidebar-row';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { Post, SharedData, Tag } from '@/types';

const categories: { value: Post['type']; label: string; icon: LucideIcon }[] = [
    { value: 'resource', label: 'Resources', icon: BookOpen },
    { value: 'hackathon', label: 'Hackathons', icon: Trophy },
    { value: 'project', label: 'Projects', icon: FolderGit2 },
    { value: 'announcement', label: 'Announcements', icon: Megaphone },
];

type Filters = {
    search: string;
    type: Post['type'] | null;
    tag: number | null;
};

type Props = {
    recentPosts: Post[];
    announcements: Post[];
    pendingCount: number;
    popularTags: Tag[];
    recentHackathons: Post[];
    search?: string;
    filters?: { type: Post['type'] | null; tag: number | null };
};

export default function Dashboard({
    recentPosts,
    pendingCount,
    popularTags,
    search: initialSearch = '',
    filters: initialFilters = { type: null, tag: null },
}: Props) {
    const { auth } = usePage<SharedData>().props;

    const [showPending, setShowPending] = useState(pendingCount > 0);
    // Reference time for the "Just listed" badge, read once so renders stay pure
    const [now] = useState(() => Date.now());
    const [filters, setFilters] = useState<Filters>({
        search: initialSearch,
        ...initialFilters,
    });
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Keep local state in sync if Inertia navigates back with different filter props
    const serverKey = `${initialSearch}|${initialFilters.type}|${initialFilters.tag}`;
    const [syncedKey, setSyncedKey] = useState(serverKey);
    if (serverKey !== syncedKey) {
        setSyncedKey(serverKey);
        setFilters({ search: initialSearch, ...initialFilters });
    }

    const visit = (next: Filters) => {
        const query: Record<string, string | number> = {};
        if (next.search.trim()) query.search = next.search.trim();
        if (next.type) query.type = next.type;
        if (next.tag) query.tag = next.tag;

        router.get(
            dashboard.url({ query }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['recentPosts', 'search', 'filters'],
            },
        );
    };

    const updateFilters = (patch: Partial<Filters>, debounce = false) => {
        const next = { ...filters, ...patch };
        setFilters(next);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (debounce) {
            debounceRef.current = setTimeout(() => visit(next), 300);
        } else {
            visit(next);
        }
    };

    const searchTerm = filters.search.trim();
    const isFiltered = !!(searchTerm || filters.type || filters.tag);
    const activeCategory = categories.find((c) => c.value === filters.type);

    const sidebar = (
        <div>
            <h1 className="px-2 pt-1 pb-3 text-2xl font-bold">Dashboard</h1>

            {/* Search */}
            <div className="relative mx-2 mb-3">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                        updateFilters({ search: e.target.value }, true)
                    }
                    placeholder="Search posts"
                    className="w-full rounded-full border-0 bg-secondary py-2.5 pr-9 pl-10 text-[15px] text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
                {filters.search && (
                    <button
                        type="button"
                        onClick={() => updateFilters({ search: '' })}
                        aria-label="Clear search"
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X className="size-3.5" />
                    </button>
                )}
            </div>

            {pendingCount > 0 && (
                <SidebarRow
                    icon={Clock}
                    label="Pending review"
                    onClick={() => setShowPending(true)}
                    trailing={
                        <span className="text-sm text-muted-foreground">
                            {pendingCount}
                        </span>
                    }
                />
            )}

            <Link
                href="/posts/create"
                className="mx-2 mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary/15 py-2 text-[15px] font-semibold text-primary transition-colors hover:bg-primary/25"
            >
                <Plus className="size-4" />
                Create new post
            </Link>

            {popularTags.length > 0 && (
                <>
                    <hr className="mx-2 my-4 border-border" />
                    <div className="flex items-center justify-between px-2 pb-3">
                        <h2 className="text-[17px] font-semibold">
                            Popular tags
                        </h2>
                        {filters.tag && (
                            <button
                                type="button"
                                onClick={() => updateFilters({ tag: null })}
                                className="text-sm font-medium text-primary hover:text-primary/80"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 px-2 pb-4">
                        {popularTags.map((tag) => {
                            const selected = filters.tag === tag.id;

                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() =>
                                        updateFilters({
                                            tag: selected ? null : tag.id,
                                        })
                                    }
                                    className={cn(
                                        'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                                        selected
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-foreground hover:bg-secondary/70',
                                    )}
                                >
                                    #{tag.name}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );

    const heading = searchTerm
        ? `Results for "${searchTerm}"`
        : activeCategory
          ? activeCategory.label
          : "Today's picks";

    return (
        <AppLayout sidebar={sidebar}>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl">
                {showPending && pendingCount > 0 && (
                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
                        <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold">
                                Post pending review
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Your post{pendingCount > 1 ? 's are' : ' is'}{' '}
                                under moderation. Hang tight!
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPending(false)}
                            aria-label="Dismiss"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                <h2 className="mb-4 text-xl font-semibold">{heading}</h2>

                {recentPosts.length === 0 ? (
                    <div className="flex min-h-112 flex-col items-center justify-center rounded-lg border border-border bg-card text-center">
                        <Inbox
                            className="size-20 text-muted-foreground/40"
                            strokeWidth={1}
                        />
                        <h3 className="mt-6 text-lg font-semibold">
                            {isFiltered ? 'No matching posts' : 'No posts yet'}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isFiltered
                                ? 'Try a different search, category or tag.'
                                : 'To get started, share your first post with the community.'}
                        </p>
                        {isFiltered ? (
                            <button
                                type="button"
                                onClick={() =>
                                    updateFilters({
                                        search: '',
                                        type: null,
                                        tag: null,
                                    })
                                }
                                className="mt-6 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary/70"
                            >
                                Clear filters
                            </button>
                        ) : (
                            <Link
                                href="/posts/create"
                                className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Create new post
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className={tileGridClass}>
                        {recentPosts.map((post) => (
                            <PostTile
                                key={post.id}
                                post={post}
                                viewerId={auth.user?.id}
                                now={now}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
