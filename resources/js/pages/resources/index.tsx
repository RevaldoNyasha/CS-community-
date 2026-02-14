import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Download, FileText, MessageSquare, Search } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Resources', href: '/resources' },
];

type Filters = {
    search: string;
    date_from: string;
    date_to: string;
    has_pdf: boolean;
};

type Props = {
    posts: PaginatedData<Post>;
    filters: Filters;
};

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
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setHasPdf(false);
        router.get('/resources', {}, { preserveState: true, preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resources" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 bg-[#008080]">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase text-white">Resources</h1>
                        <p className="text-[12px] text-white/80">Browse shared study resources and materials.</p>
                    </div>
                    <Link href="/posts/create" className="mc-btn">
                        Share Resource
                    </Link>
                </div>

                {/* Search & Filters Bar */}
                <div className="win95-window">
                    <div className="win95-titlebar mb-[2px]">
                        <Search className="size-3 mr-1.5" />
                        <span className="text-[11px] font-bold uppercase">Search & Filter</span>
                    </div>
                    <div className="p-3 flex flex-wrap items-end gap-3">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[10px] font-bold uppercase text-[#333] mb-1">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Search resources..."
                                className="win95-sunken bg-white w-full px-2 py-1 text-[12px] text-black outline-none"
                            />
                        </div>
                        {/* Date From */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-[#333] mb-1">From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="win95-sunken bg-white px-2 py-1 text-[12px] text-black outline-none"
                            />
                        </div>
                        {/* Date To */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-[#333] mb-1">To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="win95-sunken bg-white px-2 py-1 text-[12px] text-black outline-none"
                            />
                        </div>
                        {/* PDF Filter */}
                        <div className="flex items-center gap-1.5 pb-[3px]">
                            <input
                                type="checkbox"
                                id="has_pdf"
                                checked={hasPdf}
                                onChange={(e) => setHasPdf(e.target.checked)}
                                className="size-3.5 accent-[#000080]"
                            />
                            <label htmlFor="has_pdf" className="text-[10px] font-bold uppercase text-[#333] cursor-pointer flex items-center gap-1">
                                <FileText className="size-3 text-[#c0392b]" />
                                PDF Only
                            </label>
                        </div>
                        {/* Buttons */}
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

                {/* Cards Grid */}
                {posts.data.length === 0 ? (
                    <div className="win95-window p-4 text-center text-[#333] text-xs">
                        No resources found. Try adjusting your search or filters.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {posts.data.map((post) => (
                            <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="block win95-window group cursor-pointer hover:brightness-95 active:brightness-90"
                            >
                                <div className="win95-titlebar mb-[2px]">
                                    <BookOpen className="size-3 mr-1.5 shrink-0" />
                                    <span className="text-[10px] truncate flex-1">{post.user?.name}</span>
                                    {post.file_path && post.file_path.endsWith('.pdf') && (
                                        <span className="flex items-center gap-0.5 text-[9px] bg-white/20 px-1 py-0.5 rounded-sm ml-1 shrink-0">
                                            <Download className="size-2.5" />
                                            PDF
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
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        {post.comments_count !== undefined && (
                                            <>
                                                <span>&middot;</span>
                                                <span className="flex items-center gap-0.5">
                                                    <MessageSquare className="size-2.5" />
                                                    {post.comments_count}
                                                </span>
                                            </>
                                        )}
                                        {post.file_path && post.file_path.endsWith('.pdf') && (
                                            <>
                                                <span>&middot;</span>
                                                <span className="flex items-center gap-0.5 text-[#c0392b] font-bold">
                                                    <FileText className="size-2.5" />
                                                    PDF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {posts.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`mc-btn !py-1 !px-3 text-sm ${link.active ? 'bg-[#000080] !text-white' : ''
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
