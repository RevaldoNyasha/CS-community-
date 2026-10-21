import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    ChevronDown,
    Clock,
    FileText,
    Inbox,
    ListFilter,
    Plus,
    Sparkles,
    Trophy,
    Users,
    X,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { tileGridClass } from '@/components/listing';
import { PostTile } from '@/components/post-tile';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { formatCount } from '@/lib/format-count';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { Post, SharedData } from '@/types';

// Must match DashboardController::TOPICS and ::SORTS.
const topics = [
    { value: 'ai', label: 'AI' },
    { value: 'development', label: 'Development' },
    { value: 'tools', label: 'Tools' },
    { value: 'tutorials', label: 'Tutorials' },
    { value: 'career', label: 'Career' },
    { value: 'showcase', label: 'Showcase' },
    { value: 'news', label: 'News' },
    { value: 'discussion', label: 'Discussion' },
] as const;

type Topic = (typeof topics)[number]['value'];

const sorts = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most liked' },
    { value: 'discussed', label: 'Most discussed' },
] as const;

type Sort = (typeof sorts)[number]['value'];

type Filters = {
    type: Post['type'] | null;
    tag: number | null;
    topic: Topic | null;
    sort: Sort;
};

type Stats = {
    posts: number;
    members: number;
    topics: number;
    trending: number;
};

type Props = {
    recentPosts: Post[];
    pendingCount: number;
    stats: Stats;
    search?: string;
    filters?: Partial<Filters>;
};

function Hero({ stats }: { stats: Stats }) {
    const items: {
        icon: LucideIcon;
        value: number;
        label: string;
        className: string;
    }[] = [
        {
            icon: FileText,
            value: stats.posts,
            label: 'Posts',
            className: 'text-blue-400',
        },
        {
            icon: Users,
            value: stats.members,
            label: 'Members',
            className: 'text-blue-400',
        },
        {
            icon: Trophy,
            value: stats.topics,
            label: 'Topics',
            className: 'text-amber-400',
        },
        {
            icon: Zap,
            value: stats.trending,
            label: 'Trending',
            className: 'text-violet-400',
        },
    ];

    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {/* Banner art. On wide screens the whole picture shows at full height on the right,
                fading into the background; on smaller ones it covers the banner. */}
            <img
                src="/bannerbg.jpg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full object-cover object-center xl:left-auto xl:w-auto xl:max-w-none"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10 xl:from-[#0b0b0d] xl:from-35% xl:via-[#0b0b0d]/60 xl:via-55% xl:to-transparent"
            />

            <div className="relative flex flex-col gap-8 p-6 sm:p-7 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-blue-200/80 uppercase">
                        Welcome to DEV-CRAFT
                    </p>
                    <h1 className="mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-[34px]">
                        Discover. <span className="text-[#3b82ff]">Learn.</span>{' '}
                        Build. <span className="text-violet-400">Share.</span>
                    </h1>
                    <p className="mt-1 text-[15px] text-blue-100/80">
                        A community for developers, creators and AI enthusiasts.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/posts/create"
                            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(26,102,255,0.8)] transition-colors hover:bg-primary/90"
                        >
                            <Plus className="size-[18px]" />
                            Create new post
                        </Link>
                        <Link
                            href="/dashboard?sort=popular"
                            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                        >
                            <Sparkles className="size-4" />
                            Explore trending
                        </Link>
                    </div>
                </div>

                <dl className="grid grid-cols-2 gap-y-5 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-5 backdrop-blur-md sm:grid-cols-4 xl:min-w-[420px]">
                    {items.map((item, i) => (
                        <div
                            key={item.label}
                            className={cn(
                                'flex flex-col items-center px-5 text-center',
                                i > 0 && 'sm:border-l sm:border-white/10',
                                i % 2 === 1 && 'border-l border-white/10',
                            )}
                        >
                            <item.icon
                                className={cn('size-5', item.className)}
                                strokeWidth={1.75}
                            />
                            <dd className="mt-2 text-2xl font-bold">
                                {formatCount(item.value)}
                            </dd>
                            <dt className="text-xs text-blue-100/70">
                                {item.label}
                            </dt>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}

function Chip({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: string;
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors',
                active
                    ? 'bg-foreground text-background'
                    : 'border border-border bg-card text-foreground hover:border-foreground/30 hover:bg-secondary',
            )}
        >
            {children}
        </button>
    );
}

function EmptyState({
    icon: Icon,
    title,
    message,
    action,
}: {
    icon: LucideIcon;
    title: string;
    message: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 text-center">
            <Icon
                className="size-16 text-muted-foreground/40"
                strokeWidth={1}
            />
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            {action}
        </div>
    );
}

export default function Dashboard({
    recentPosts,
    pendingCount,
    stats,
    search = '',
    filters: initialFilters = {},
}: Props) {
    const { auth, popularTags = [] } = usePage<SharedData>().props;

    const [showPending, setShowPending] = useState(pendingCount > 0);
    // Reference time for the "Just listed" badge, read once so renders stay pure
    const [now] = useState(() => Date.now());

    const serverFilters: Filters = {
        type: initialFilters.type ?? null,
        tag: initialFilters.tag ?? null,
        topic: initialFilters.topic ?? null,
        sort: initialFilters.sort ?? 'latest',
    };
    const [filters, setFilters] = useState<Filters>(serverFilters);

    // Keep local state in sync if Inertia navigates with different filter props
    const serverKey = JSON.stringify(serverFilters);
    const [syncedKey, setSyncedKey] = useState(serverKey);
    if (serverKey !== syncedKey) {
        setSyncedKey(serverKey);
        setFilters(serverFilters);
    }

    const updateFilters = (patch: Partial<Filters>) => {
        const next = { ...filters, ...patch };
        setFilters(next);

        const query: Record<string, string | number> = {};
        if (search) query.search = search;
        if (next.type) query.type = next.type;
        if (next.tag) query.tag = next.tag;
        if (next.topic) query.topic = next.topic;
        if (next.sort !== 'latest') query.sort = next.sort;

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

    const clearAll = () =>
        router.get(dashboard.url(), {}, { preserveScroll: true });

    const activeTag = popularTags.find((t) => t.id === filters.tag);
    const isFiltered = !!(
        search ||
        filters.type ||
        filters.tag ||
        filters.topic
    );
    const sortLabel = sorts.find((s) => s.value === filters.sort)!.label;

    const heading = search
        ? `Results for "${search}"`
        : activeTag
          ? `#${activeTag.name}`
          : filters.sort === 'popular'
            ? 'Trending now'
            : "Today's picks";

    const subheading =
        filters.sort === 'popular'
            ? 'The most liked posts in the community'
            : 'Selected posts, tutorials and ideas from the community';

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-[1400px] space-y-8">
                {showPending && pendingCount > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                        <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold">
                                Post pending review
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                You have {pendingCount} post
                                {pendingCount > 1 ? 's' : ''} under moderation.
                                Hang tight!
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

                <Hero stats={stats} />

                <section>
                    <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="truncate text-2xl font-bold tracking-tight">
                                {heading}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {subheading}
                            </p>
                        </div>
                        {isFiltered ? (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                            >
                                Clear filters
                                <X className="size-4" />
                            </button>
                        ) : (
                            <Link
                                href="/dashboard?sort=popular"
                                className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                            >
                                View all
                                <ArrowRight className="size-4" />
                            </Link>
                        )}
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <div className="-mx-1 flex min-w-0 flex-1 [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1">
                            <Chip
                                active={!filters.topic}
                                onClick={() => updateFilters({ topic: null })}
                            >
                                All
                            </Chip>
                            {topics.map((topic) => (
                                <Chip
                                    key={topic.value}
                                    active={filters.topic === topic.value}
                                    onClick={() =>
                                        updateFilters({
                                            topic:
                                                filters.topic === topic.value
                                                    ? null
                                                    : topic.value,
                                        })
                                    }
                                >
                                    {topic.label}
                                </Chip>
                            ))}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-secondary"
                                >
                                    <ListFilter className="size-4 text-muted-foreground" />
                                    <span className="hidden sm:inline">
                                        {sortLabel}
                                    </span>
                                    <ChevronDown className="size-4 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                {sorts.map((sort) => (
                                    <DropdownMenuItem
                                        key={sort.value}
                                        onSelect={() =>
                                            updateFilters({
                                                sort: sort.value,
                                            })
                                        }
                                        className="cursor-pointer justify-between"
                                    >
                                        {sort.label}
                                        {filters.sort === sort.value && (
                                            <Check className="size-4 text-primary" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="mt-5">
                        {recentPosts.length === 0 ? (
                            <EmptyState
                                icon={Inbox}
                                title={
                                    isFiltered
                                        ? 'No matching posts'
                                        : 'No posts yet'
                                }
                                message={
                                    isFiltered
                                        ? 'Try a different search, topic or tag.'
                                        : 'To get started, share your first post with the community.'
                                }
                                action={
                                    isFiltered ? (
                                        <button
                                            type="button"
                                            onClick={clearAll}
                                            className="mt-6 rounded-full bg-secondary px-5 py-2 text-sm font-semibold transition-colors hover:bg-secondary/70"
                                        >
                                            Clear filters
                                        </button>
                                    ) : (
                                        <Link
                                            href="/posts/create"
                                            className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                        >
                                            Create new post
                                        </Link>
                                    )
                                }
                            />
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
                </section>
            </div>
        </AppLayout>
    );
}
