import { Head, Link, router } from '@inertiajs/react';
import { Download, FileText, MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Resources', href: '/resources' },
];

type Filters = { search: string; date_from: string; date_to: string; has_pdf: boolean };
type Props = { posts: PaginatedData<Post>; filters: Filters };

/* Sky-blue category icon mapping */
const RESOURCE_ICONS: Record<string, string> = {
    pdf: 'picture_as_pdf',
    image: 'image',
    default: 'auto_stories',
};

/* Sky-blue accent colors for resources */
const RESOURCE_ACCENT = [
    { color: 'sky', dateBg: 'bg-sky-600', shadow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', hover: 'group-hover:text-sky-400', icon: 'text-sky-500' },
    { color: 'blue', dateBg: 'bg-blue-600', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', hover: 'group-hover:text-blue-400', icon: 'text-blue-500' },
];

/* Avatar colors for user initials */
const AVATAR_COLORS = [
    { bg: '#00b4d8', text: '#ffffff' }, // cyan
    { bg: '#39ff14', text: '#0a0a0a' }, // neon green (dark text for contrast)
    { bg: '#7c3aed', text: '#ffffff' }, // purple
    { bg: '#f59e0b', text: '#0a0a0a' }, // amber
    { bg: '#ef4444', text: '#ffffff' }, // red
    { bg: '#10b981', text: '#ffffff' }, // emerald
    { bg: '#3b82f6', text: '#ffffff' }, // blue
    { bg: '#ec4899', text: '#ffffff' }, // pink
];

function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

function ResourceCard({ post, index }: { post: Post; index: number }) {
    const hasPdf = post.file_path?.endsWith('.pdf');
    const hasImage = post.attachment_is_image && post.attachment_url;
    const icon = hasPdf ? RESOURCE_ICONS.pdf : hasImage ? RESOURCE_ICONS.image : RESOURCE_ICONS.default;
    const accent = RESOURCE_ACCENT[index % RESOURCE_ACCENT.length];
    const dateLabel = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    
    const authorName = post.user?.name ?? 'Shared';
    const avatarStyle = avatarColor(authorName);

    return (
        <Link
            href={`/posts/${post.id}`}
            className="group relative bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-[#334155] transition-all duration-300 shadow-lg"
        >
            {/* Image preview */}
            {hasImage && (
                <div className="h-36 overflow-hidden border-b border-border">
                    <img src={post.attachment_url!} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
            )}

            <div className="p-8 flex-1">
                {/* Card top row */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0"
                            style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
                        >
                            {initials(authorName)}
                        </div>
                        <div className="flex items-center">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-none">
                                {authorName}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasPdf && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-sky-400 uppercase tracking-wider leading-none">
                                <Download className="size-2.5" /> PDF
                            </span>
                        )}
                        <div className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground shrink-0 leading-none">
                            {dateLabel}
                        </div>
                    </div>
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
                                className="px-2 py-1 text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 rounded"
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
                    View Details
                </div>
                {post.comments_count !== undefined && (
                    <span className="flex items-center gap-1">
                        <MessageSquare className="size-3" />
                        {post.comments_count}
                    </span>
                )}
            </div>
        </Link>
    );
}

export default function ResourcesIndex({ posts, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [hasPdf, setHasPdf] = useState(filters.has_pdf ?? false);

    function applyFilters() {
        router.get('/resources', {
            search: search || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            has_pdf: hasPdf ? '1' : undefined,
        }, { preserveState: true, preserveScroll: true });
    }

    function clearFilters() {
        setSearch(''); setDateFrom(''); setDateTo(''); setHasPdf(false);
        router.get('/resources', {}, { preserveState: true, preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resources" />

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

                    {/* ── Hero Header ── */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <div>
                            <h1 className="text-5xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-500 leading-tight">
                                Resources Library
                            </h1>
                            <p className="text-muted-foreground max-w-xl text-lg leading-relaxed font-light">
                                Community-shared study materials, guides, and references. Filter by type, date, and topics.
                            </p>
                        </div>
                        <Link
                            href="/posts/create"
                            className="btn-primary flex items-center gap-2 shrink-0 w-fit"
                        >
                            <Plus className="size-4" />
                            Share Resource
                        </Link>
                    </div>

                    {/* ── Glass Search Bar ── */}
                    <div className="rounded-2xl p-2 mb-16 shadow-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]">
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
                                    placeholder="Search by title, topic, or author..."
                                    className="w-full pl-14 pr-6 py-4 rounded-xl border-none bg-transparent focus:ring-1 focus:ring-white/20 outline-none text-foreground placeholder:text-muted-foreground/40 text-sm"
                                />
                            </div>

                            <div className="h-8 w-px bg-border/50 hidden lg:block mx-2" />

                            {/* Date filters + PDF filter + button */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto p-1">
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    title="From date"
                                    className="w-full lg:w-44 px-5 py-3.5 rounded-xl border-none bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none text-sm text-muted-foreground [color-scheme:dark]"
                                />
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    title="To date"
                                    className="w-full lg:w-44 px-5 py-3.5 rounded-xl border-none bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none text-sm text-muted-foreground [color-scheme:dark]"
                                />
                                <label className="flex items-center gap-2 px-4 py-3.5 rounded-xl border-none bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none text-sm text-muted-foreground cursor-pointer [color-scheme:dark]">
                                    <input 
                                        type="checkbox" 
                                        checked={hasPdf} 
                                        onChange={(e) => setHasPdf(e.target.checked)} 
                                        className="accent-sky-500 size-4" 
                                    />
                                    <FileText className="size-4" /> PDF
                                </label>
                                <button
                                    type="button"
                                    onClick={applyFilters}
                                    className="btn-primary"
                                >
                                    Filter
                                </button>
                                {(search || dateFrom || dateTo || hasPdf) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-5 py-3.5 rounded-xl border-none bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none text-sm text-muted-foreground font-medium [color-scheme:dark]"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Resources Section ── */}
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-xs font-bold tracking-[0.2em] rounded-full border border-sky-500/20">
                                    RESOURCES
                                </span>
                                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                    Available Materials ({posts.total ?? posts.data.length})
                                </h2>
                            </div>
                            <div className="h-px flex-grow mx-8 bg-neutral-900" />
                        </div>

                        {posts.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border/60 bg-background">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl text-muted-foreground/40">folder_open</span>
                                </div>
                                <p className="text-muted-foreground font-light tracking-wide">No resources found. Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.data.map((post, i) => (
                                    <ResourceCard key={post.id} post={post} index={i} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Pagination ── */}
                    {posts.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {posts.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all
                                        ${link.active
                                            ? 'bg-[#14b8a6] text-white border-[#14b8a6] shadow-[0_0_12px_rgba(20,184,166,0.3)]'
                                            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-[#334155]'}
                                        ${!link.url ? 'pointer-events-none opacity-30' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Footer ── */}
                    <footer className="mt-16 border-t border-border/40 pt-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <p className="text-muted-foreground/40 text-xs font-medium uppercase tracking-[0.3em]">
                                © {new Date().getFullYear()} DEV-CRAFT Community
                            </p>
                            <div className="flex gap-8">
                                {['Terms', 'Privacy', 'API'].map((item) => (
                                    <a key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-bold uppercase tracking-widest">{item}</a>
                                ))}
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </AppLayout>
    );
}
