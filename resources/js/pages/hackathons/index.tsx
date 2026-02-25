import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Hackathons', href: '/hackathons' },
];

type Filters = { search: string; date_from: string; date_to: string };
type Props = { upcoming: Post[]; finished: Post[]; filters: Filters };

/* Accent colors for upcoming (green) and finished (red) hackathons */
const UPCOMING_ACCENT = [
    { color: 'green', dateBg: 'bg-green-600', shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.15)]', hover: 'group-hover:text-green-400', icon: 'text-green-500' },
    { color: 'emerald', dateBg: 'bg-emerald-600', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', hover: 'group-hover:text-emerald-400', icon: 'text-emerald-500' },
];

const FINISHED_ACCENT = [
    { color: 'red', dateBg: 'bg-red-600', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', hover: 'group-hover:text-red-400', icon: 'text-red-500' },
    { color: 'rose', dateBg: 'bg-rose-600', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', hover: 'group-hover:text-rose-400', icon: 'text-rose-500' },
];

function HackathonCard({ post, index, variant }: { post: Post; index: number; variant: 'upcoming' | 'finished' }) {
    const accent = variant === 'upcoming' 
        ? UPCOMING_ACCENT[index % UPCOMING_ACCENT.length]
        : FINISHED_ACCENT[index % FINISHED_ACCENT.length];
    const date = post.event_date ? new Date(post.event_date) : null;
    const dateLabel = date
        ? date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : null;

    return (
        <Link
            href={`/posts/${post.id}`}
            className="group relative bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/20 transition-all duration-300 shadow-lg"
        >
            <div className="p-8 flex-1">
                {/* Card top row */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px] text-neutral-400">trophy</span>
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate max-w-[120px]">
                            {post.user?.name ?? 'DEV-CRAFT'}
                        </span>
                    </div>
                    {dateLabel && (
                        <div className={`px-3 py-1.5 rounded-lg ${accent.dateBg} text-white text-[10px] font-black uppercase tracking-tighter ${accent.shadow} shrink-0`}>
                            {dateLabel}
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold text-foreground mb-4 ${accent.hover} transition-colors leading-tight line-clamp-2`}>
                    {post.title}
                </h3>

                {/* Body */}
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 font-light mb-6">
                    {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="px-2 py-1 text-[10px] bg-muted border border-border text-muted-foreground rounded"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Card footer */}
            <div className="px-8 py-5 border-t border-border flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-muted-foreground">emoji_events</span>
                    View Details
                </div>
            </div>
        </Link>
    );
}

export default function HackathonsIndex({ upcoming, finished, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    function applyFilters() {
        router.get('/hackathons', {
            search: search || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hackathons" />

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

                    {/* ── Hero Header ── */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <div>
                            <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-foreground leading-tight">
                                Hackathons Directory
                            </h1>
                            <p className="text-muted-foreground max-w-xl text-lg leading-relaxed font-light">
                                Developer competitions for the most innovative builders. Filter by stack, date, and events.
                            </p>
                        </div>
                        <Link
                            href="/posts/create"
                            className="btn-primary flex items-center gap-2 shrink-0 w-fit"
                        >
                            <Plus className="size-4" />
                            Share Hackathon
                        </Link>
                    </div>

                    {/* ── Glass Search Bar ── */}
                    <div className="rounded-2xl p-2 mb-16 shadow-2xl bg-secondary/10 backdrop-blur-xl border border-border">
                        <div className="flex flex-col lg:flex-row gap-2 items-center">
                            {/* Search input */}
                            <div className="relative flex-grow w-full">
                                <span className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-muted-foreground/60">search</span>
                                </span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    placeholder="Search by tech stack, name, or organizer..."
                                    className="w-full pl-14 pr-6 py-4 rounded-xl border-none bg-transparent focus:ring-1 focus:ring-white/20 outline-none text-foreground placeholder:text-muted-foreground/40 text-sm"
                                />
                            </div>

                            <div className="h-8 w-px bg-border/50 hidden lg:block mx-2" />

                            {/* Date filters + button */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto p-1">
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    title="From date"
                                    className="w-full lg:w-44 px-5 py-3.5 rounded-xl border-none bg-secondary/20 hover:bg-secondary/40 focus:bg-secondary/40 focus:ring-1 focus:ring-border outline-none text-sm text-muted-foreground"
                                />
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    title="To date"
                                    className="w-full lg:w-44 px-5 py-3.5 rounded-xl border-none bg-secondary/20 hover:bg-secondary/40 focus:bg-secondary/40 focus:ring-1 focus:ring-border outline-none text-sm text-muted-foreground"
                                />
                                <button
                                    type="button"
                                    onClick={applyFilters}
                                    className="btn-primary"
                                >
                                    Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Upcoming Section ── */}
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold tracking-[0.2em] rounded-full border border-green-500/20">
                                    UPCOMING
                                </span>
                                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                    Available Challenges ({upcoming.length})
                                </h2>
                            </div>
                            <div className="h-px flex-grow mx-8 bg-border" />
                        </div>

                        {upcoming.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border/60 bg-background">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl text-muted-foreground/40">emoji_events</span>
                                </div>
                                <p className="text-muted-foreground font-light tracking-wide">No upcoming hackathons at the moment. Stay tuned.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upcoming.map((post, i) => (
                                    <HackathonCard key={post.id} post={post} index={i} variant="upcoming" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Finished Section ── */}
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold tracking-[0.2em] rounded-full border border-red-500/20">
                                    FINISHED
                                </span>
                                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                    Past Events ({finished.length})
                                </h2>
                            </div>
                            <div className="h-px flex-grow mx-8 bg-border" />
                        </div>

                        {finished.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border/60 bg-background">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl text-muted-foreground/40">history_toggle_off</span>
                                </div>
                                <p className="text-muted-foreground font-light tracking-wide">Archived competitions will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {finished.map((post, i) => (
                                    <HackathonCard key={post.id} post={post} index={i} variant="finished" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <footer className="border-t border-border/40 pt-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <p className="text-muted-foreground/40 text-xs font-medium uppercase tracking-[0.3em]">
                                © {new Date().getFullYear()} DEV-CRAFT Community
                            </p>
                            <div className="flex gap-8">
                                {['Terms', 'Privacy', 'API'].map((item) => (
                                    <a key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-bold uppercase tracking-widest">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </AppLayout>
    );
}
