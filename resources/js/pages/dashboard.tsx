import { Head, Link, router } from '@inertiajs/react';
import { Clock, Plus, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import PostCard from '@/components/post-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Post, Tag } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

type Props = {
    recentPosts: Post[];
    announcements: Post[];
    pendingCount: number;
    popularTags: Tag[];
    recentHackathons: Post[];
    search?: string;
};

export default function Dashboard({ recentPosts, pendingCount, popularTags, recentHackathons, search: initialSearch = '' }: Props) {
    const [showPending, setShowPending] = useState(pendingCount > 0);
    const [searchValue, setSearchValue] = useState(initialSearch);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Keep local state in sync if Inertia navigates back with a different search prop
    useEffect(() => {
        setSearchValue(initialSearch);
    }, [initialSearch]);

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                dashboard.url(value.trim() ? { query: { search: value.trim() } } : undefined),
                {},
                { preserveState: true, preserveScroll: true, replace: true, only: ['recentPosts', 'search'] },
            );
        }, 300);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col overflow-x-hidden bg-background">

                {/* ── Top Header ── */}
                <header className="h-14 flex items-center justify-between px-6 lg:px-8 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]">search</span>
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search posts, topics, tags..."
                                className="w-full bg-card border border-border rounded-md pl-10 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-0 transition-colors"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => handleSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center ml-2">
                        <Link
                            href="/posts/create"
                            className="flex items-center gap-2 border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/70 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all active:scale-95"
                        >
                            <Plus className="size-3.5" />
                            New Post
                        </Link>
                    </div>
                </header>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
                    <div className="max-w-7xl">
                        {/* Feed header */}
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
                            {searchValue.trim() ? `Results for "${searchValue.trim()}"` : 'Community Feed'}
                        </h2>

                    <div className="flex gap-10 items-start">

                        {/* ── Feed ── */}
                        <div className="flex-1 min-w-0 space-y-6">
                            {/* Pending banner */}
                            {showPending && pendingCount > 0 && (
                                <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
                                    <Clock className="size-4 shrink-0 text-primary mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-foreground">Post Pending Review</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Your post{pendingCount > 1 ? 's are' : ' is'} under moderation. Hang tight!
                                        </p>
                                    </div>
                                    <button type="button" onClick={() => setShowPending(false)} className="text-muted-foreground hover:text-destructive transition-colors">
                                        <X className="size-4" />
                                    </button>
                                </div>
                            )}

                            {/* Posts */}
                            {recentPosts.length === 0 ? (
                                <div className="bg-card border border-border rounded-lg p-12 text-center space-y-2">
                                    <span className="material-symbols-outlined text-muted-foreground/40 text-4xl">search_off</span>
                                    <p className="text-sm text-muted-foreground">
                                        {searchValue.trim()
                                            ? `No posts matching "${searchValue.trim()}"`
                                            : 'No posts yet. Be the first to share one.'}
                                    </p>
                                    {searchValue.trim() && (
                                        <button
                                            type="button"
                                            onClick={() => handleSearch('')}
                                            className="text-xs text-primary hover:text-primary/80 font-bold uppercase tracking-wider transition-colors"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                recentPosts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))
                            )}
                        </div>

                        {/* ── Right Sidebar ── */}
                        <div className="w-80 space-y-5 flex-shrink-0 hidden lg:block">

                            {/* ── Hackathons ── */}
                            <section className="bg-card border border-border rounded-lg p-5">
                                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-muted-foreground rounded-full inline-block" />
                                    Upcoming Hackathons
                                </h3>
                                <div className="space-y-4">
                                    {recentHackathons.length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-2">No hackathons posted yet.</p>
                                    ) : (
                                        recentHackathons.map((hack) => {
                                            const date = hack.event_date ? new Date(hack.event_date) : new Date(hack.created_at);
                                            const month = date.toLocaleString('default', { month: 'short' });
                                            const day = date.getDate();
                                            return (
                                                <Link key={hack.id} href={`/posts/${hack.id}`} className="flex gap-4 group cursor-pointer">
                                                    <div className="w-12 h-12 flex-shrink-0 rounded bg-background flex flex-col items-center justify-center border border-border">
                                                        <span className="text-[9px] uppercase font-bold text-muted-foreground">{month}</span>
                                                        <span className="text-lg font-bold text-foreground leading-none">{day}</span>
                                                    </div>
                                                    <div className="overflow-hidden min-w-0">
                                                        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{hack.title}</h4>
                                                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{hack.content}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    )}
                                </div>
                                <Link
                                    href="/hackathons"
                                    className="w-full mt-5 py-2 flex items-center justify-center border border-border hover:bg-muted text-[10px] font-bold text-foreground rounded transition-colors uppercase tracking-widest"
                                >
                                    All Events
                                </Link>
                            </section>

                            {/* Guidelines */}
                            <section className="bg-card border border-border rounded-lg p-5">
                                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Guidelines</h3>
                                <div className="space-y-3">
                                    {['Post clean, formatted code blocks.', 'Be professional and constructive.', 'No spam or self-promotion.'].map((rule) => (
                                        <div key={rule} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[14px] text-muted-foreground/60 mt-0.5">check_circle_outline</span>
                                            <p className="text-[11px] text-secondary-foreground leading-tight">{rule}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Popular Tags */}
                            {popularTags.length > 0 && (
                                <section className="bg-card border border-border rounded-lg p-5">
                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Popular Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularTags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="px-2.5 py-1 bg-background border border-border hover:border-primary text-[10px] font-mono font-medium text-muted-foreground hover:text-primary rounded transition-all cursor-pointer"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
