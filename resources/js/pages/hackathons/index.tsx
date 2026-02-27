import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AuthPromptModal from '@/components/auth-prompt-modal';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Post, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Hackathons', href: '/hackathons' },
];

type Filters = { search: string; date_from: string; date_to: string };
type Props = { upcoming: Post[]; finished: Post[]; filters: Filters };

/* Accent colors for upcoming (green) and finished (red) hackathons */
const UPCOMING_ACCENT = [
    { dateBg: 'bg-green-600', icon: 'text-green-500' },
    { dateBg: 'bg-emerald-600', icon: 'text-emerald-500' },
];

const FINISHED_ACCENT = [
    { dateBg: 'bg-red-600', icon: 'text-red-500' },
    { dateBg: 'bg-rose-600', icon: 'text-rose-500' },
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
            href={`/posts/${post.slug}`}
            className="relative bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:ring-2 hover:ring-foreground/20 transition-all duration-200"
        >
            <div className="p-5 md:p-8 flex-1">
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
                        <div className={`px-3 py-1.5 rounded-lg ${accent.dateBg} text-white text-[10px] font-black uppercase tracking-tighter shrink-0`}>
                            {dateLabel}
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-4 leading-tight line-clamp-2">
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
            <div className="px-5 md:px-8 py-4 md:py-5 border-t border-border flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-muted-foreground">emoji_events</span>
                    View Details
                </div>
            </div>
        </Link>
    );
}

export default function HackathonsIndex({ upcoming, finished, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [authModalOpen, setAuthModalOpen] = useState(false);

    function applyFilters() {
        router.get('/hackathons', {
            search: search || undefined,
        }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hackathons" />

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">

                    {/* ── Compact Header ── */}
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-xl font-bold text-foreground">Hackathons</h1>
                        {auth.user ? (
                            <Link href="/posts/create" className="bg-primary text-primary-foreground size-8 flex items-center justify-center rounded-md shrink-0 hover:opacity-90 transition-opacity">
                                <Plus className="size-4" />
                            </Link>
                        ) : (
                            <button type="button" onClick={() => setAuthModalOpen(true)} className="bg-primary text-primary-foreground size-8 flex items-center justify-center rounded-md shrink-0 hover:opacity-90 transition-opacity">
                                <Plus className="size-4" />
                            </button>
                        )}
                    </div>

                    {/* ── Compact Search + Filters ── */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <div className="relative flex-1 min-w-45">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[18px] text-muted-foreground/50">search</span>
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Search hackathons..."
                                className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-ring"
                            />
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
                            <div className="h-px grow mx-8 bg-border" />
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
                            <div className="h-px grow mx-8 bg-border" />
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
                                {['Developed by Cyber Squad (NUST)'].map((item) => (
                                    <a key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-bold uppercase tracking-widest">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            <AuthPromptModal
                open={authModalOpen}
                message="Please login to share a hackathon."
                onCancel={() => setAuthModalOpen(false)}
            />
        </AppLayout>
    );
}
