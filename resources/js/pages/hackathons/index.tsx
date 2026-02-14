import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, MessageSquare, Search, Trophy } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Hackathons', href: '/hackathons' },
];

type Filters = {
    search: string;
    date_from: string;
    date_to: string;
};

type Props = {
    upcoming: Post[];
    finished: Post[];
    filters: Filters;
};

function HackathonCard({ post, variant }: { post: Post; variant: 'upcoming' | 'finished' }) {
    const isFinished = variant === 'finished';

    return (
        <Link
            href={`/posts/${post.id}`}
            className="block win95-window group cursor-pointer hover:brightness-95 active:brightness-90"
        >
            <div className="win95-titlebar mb-[2px]">
                <Trophy className="size-3 mr-1.5 shrink-0" />
                <span className="text-[10px] truncate flex-1">{post.user?.name}</span>
                {post.event_date && (
                    <span className="flex items-center gap-0.5 text-[9px] bg-white/20 px-1 py-0.5 rounded-sm ml-1 shrink-0">
                        <Calendar className="size-2.5" />
                        {new Date(post.event_date).toLocaleDateString()}
                    </span>
                )}
            </div>
            <div className="p-3">
                <h3 className="text-[13px] font-black uppercase text-[#000080] mb-2 line-clamp-2 group-hover:underline">
                    {post.title}
                </h3>
                <div className="win95-sunken bg-white p-2 mb-2">
                    <p className="text-[11px] text-[#1a1a1a] font-semibold line-clamp-3 leading-relaxed">
                        {post.content}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#333]">
                    {post.event_date ? (
                        <span className={`flex items-center gap-0.5 font-bold ${isFinished ? 'text-[#999]' : 'text-[#008000]'}`}>
                            <Clock className="size-2.5" />
                            {isFinished ? 'Ended' : 'Upcoming'}
                        </span>
                    ) : (
                        <span className="text-[10px]">{new Date(post.created_at).toLocaleDateString()}</span>
                    )}
                    {post.comments_count !== undefined && (
                        <>
                            <span>&middot;</span>
                            <span className="flex items-center gap-0.5">
                                <MessageSquare className="size-2.5" />
                                {post.comments_count}
                            </span>
                        </>
                    )}
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

    function clearFilters() {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        router.get('/hackathons', {}, { preserveState: true, preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hackathons" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 bg-[#008080]">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase text-white">⚔ Hackathons</h1>
                        <p className="text-[12px] text-white/80">Discover hackathon events and competitions.</p>
                    </div>
                    <Link href="/posts/create" className="mc-btn">
                        Share Hackathon
                    </Link>
                </div>

                {/* Search & Filters Bar */}
                <div className="win95-window">
                    <div className="win95-titlebar mb-[2px]">
                        <Search className="size-3 mr-1.5" />
                        <span className="text-[11px] font-bold uppercase">Search & Filter</span>
                    </div>
                    <div className="p-3 flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[10px] font-bold uppercase text-[#333] mb-1">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Search hackathons..."
                                className="win95-sunken bg-white w-full px-2 py-1 text-[12px] text-black outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-[#333] mb-1">From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="win95-sunken bg-white px-2 py-1 text-[12px] text-black outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-[#333] mb-1">To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="win95-sunken bg-white px-2 py-1 text-[12px] text-black outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={applyFilters} className="mc-btn text-[11px] !py-1 !px-3">
                                Apply
                            </button>
                            <button type="button" onClick={clearFilters} className="mc-btn text-[11px] !py-1 !px-3 !bg-[#c0c0c0] !text-black">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upcoming Hackathons */}
                <div>
                    <div className="win95-window mb-1">
                        <div className="win95-titlebar" style={{ background: 'linear-gradient(90deg, #1a7a3a, #2ecc71)' }}>
                            <span className="text-[11px] mr-1.5">🟢</span>
                            <span className="text-[12px] font-bold uppercase">Upcoming Hackathons ({upcoming.length})</span>
                        </div>
                    </div>
                    {upcoming.length === 0 ? (
                        <div className="win95-window p-4 text-center text-[#333] text-xs">
                            No upcoming hackathons at the moment. Stay tuned!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {upcoming.map((post) => (
                                <HackathonCard key={post.id} post={post} variant="upcoming" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Finished Hackathons */}
                <div>
                    <div className="win95-window mb-1">
                        <div className="win95-titlebar" style={{ background: 'linear-gradient(90deg, #808080, #a0a0a0)' }}>
                            <span className="text-[11px] mr-1.5">⏹</span>
                            <span className="text-[12px] font-bold uppercase">Finished Hackathons ({finished.length})</span>
                        </div>
                    </div>
                    {finished.length === 0 ? (
                        <div className="win95-window p-4 text-center text-[#333] text-xs">
                            No finished hackathons yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {finished.map((post) => (
                                <HackathonCard key={post.id} post={post} variant="finished" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
