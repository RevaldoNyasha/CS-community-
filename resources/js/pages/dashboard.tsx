import { Head, Link } from '@inertiajs/react';
import { Clock, Menu, Plus, X } from 'lucide-react';
import { useState } from 'react';
import PostCard from '@/components/post-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Post, Tag } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Props = {
    recentPosts: Post[];
    announcements: Post[];
    pendingCount: number;
    popularTags: Tag[];
    recentHackathons: Post[];
};

export default function Dashboard({ recentPosts, pendingCount, popularTags, recentHackathons }: Props) {
    const [showPending, setShowPending] = useState(pendingCount > 0);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto bg-[#008080]">
                {/* Win95 Toolbar Header */}
                <header className="win95-outset bg-[#c0c0c0] sticky top-0 z-40 p-1 flex justify-between items-center h-10">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="win95-inset px-2 py-0.5 flex items-center gap-1 bg-white">
                            <span className="text-[11px] font-bold whitespace-nowrap">C:\COMMUNITY_LOG.TXT</span>
                        </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="mc-btn !py-0.5 !px-2 flex items-center gap-1 text-[11px] lg:hidden"
                        >
                            <Menu className="size-[14px]" />
                        </button>
                        <Link
                            href="/posts/create"
                            className="mc-btn !py-0.5 !px-2 flex items-center gap-1 text-[11px] whitespace-nowrap"
                        >
                            <Plus className="size-[14px]" />
                            POST
                        </Link>
                    </div>
                </header>

                <div className="flex flex-1 gap-0">
                    {/* Main feed */}
                    <main className="flex-1 p-3 pb-14 space-y-4 overflow-y-auto">
                        {/* Pending banner */}
                        {showPending && pendingCount > 0 && (
                            <article className="win95-outset bg-[#c0c0c0] win-shadow">
                                <div className="bg-[#808080] flex justify-between items-center px-1 py-0.5">
                                    <div className="flex items-center gap-1 text-white text-[11px]">
                                        <span className="text-[10px]">&#9203;</span>
                                        <span className="font-bold">Status</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPending(false)}
                                        className="win95-outset bg-[#c0c0c0] w-4 h-4 flex items-center justify-center"
                                    >
                                        <X className="size-[8px] text-black" strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-start gap-3">
                                        <Clock className="size-4 shrink-0 text-black mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-bold uppercase text-black text-[11px]">
                                                Post Submission Pending...
                                            </h3>
                                            <p className="text-[11px] text-[#333] mt-1">
                                                The moderators are currently reviewing your scroll{pendingCount > 1 ? 's' : ''}.
                                                Hang tight!
                                            </p>
                                            <div className="win95-sunken mt-2 h-4 bg-white">
                                                <div className="h-full bg-[#808080]" style={{ width: '60%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        )}

                        {/* Post feed */}
                        {recentPosts.length === 0 ? (
                            <div className="win95-outset bg-[#c0c0c0] win-shadow p-4 text-center text-[#333] text-[11px]">
                                No posts yet. Be the first to craft one!
                            </div>
                        ) : (
                            recentPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        )}
                    </main>

                    {/* Right sidebar - desktop only */}
                    <aside className="hidden lg:block w-72 xl:w-80 p-3 space-y-3 overflow-y-auto bg-[#c0c0c0] border-l-2 border-l-[#ffffff] shadow-[inset_1px_0_0_#808080]">
                        {/* Hackathons section */}
                        <section className="win95-outset bg-[#c0c0c0] win-shadow">
                            <div className="bg-[#808080] flex justify-between items-center px-1 py-0.5">
                                <div className="flex items-center gap-1 text-white text-[11px] font-bold uppercase">
                                    <span className="text-[10px]">&#9889;</span> Hackathons
                                </div>
                            </div>
                            <div className="p-2 space-y-2">
                                {recentHackathons.length === 0 ? (
                                    <p className="text-[10px] text-[#333] text-center py-2">No hackathons posted yet.</p>
                                ) : (
                                    recentHackathons.map((hack) => {
                                        const date = hack.event_date ? new Date(hack.event_date) : new Date(hack.created_at);
                                        const month = date.toLocaleString('default', { month: 'short' });
                                        const day = date.getDate();
                                        return (
                                            <Link
                                                key={hack.id}
                                                href={`/posts/${hack.id}`}
                                                className="win95-inset p-2 flex gap-3 bg-white block"
                                            >
                                                <div className="bg-[#404040] text-white flex flex-col items-center justify-center w-12 h-12 border border-black shrink-0">
                                                    <span className="text-[10px] uppercase font-bold leading-none">{month}</span>
                                                    <span className="text-xl font-bold leading-none">{day}</span>
                                                </div>
                                                <div className="overflow-hidden min-w-0">
                                                    <h3 className="text-[11px] font-bold truncate uppercase">{hack.title}</h3>
                                                    <p className="text-[10px] text-[#666] truncate">{hack.content}</p>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                                <Link
                                    href="/hackathons"
                                    className="mc-btn w-full text-center text-[11px] !py-1"
                                >
                                    See Quest Board
                                </Link>
                            </div>
                        </section>

                        {/* Server Rules */}
                        <section className="win95-outset bg-[#c0c0c0] win-shadow">
                            <div className="bg-[#808080] flex justify-between items-center px-1 py-0.5">
                                <div className="flex items-center gap-1 text-white text-[11px] font-bold uppercase">
                                    <span className="text-[10px]">&#128203;</span> Server Rules
                                </div>
                            </div>
                            <div className="p-3 text-[11px]">
                                <p className="mb-3 text-[#333] leading-tight">
                                    Respect fellow developers and keep discussions technical. No griefing!
                                </p>
                                <ul className="space-y-1">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-700 font-bold">&#10003;</span>
                                        <span className="uppercase text-[11px] font-bold">No Spam/Promo</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-700 font-bold">&#10003;</span>
                                        <span className="uppercase text-[11px] font-bold">Post Snippets</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Popular Tags */}
                        {popularTags.length > 0 && (
                            <section className="win95-outset bg-[#c0c0c0] win-shadow">
                                <div className="bg-[#808080] flex justify-between items-center px-1 py-0.5">
                                    <div className="flex items-center gap-1 text-white text-[11px] font-bold uppercase">
                                        <span className="text-[10px]">&#127991;</span> Popular Tags
                                    </div>
                                </div>
                                <div className="p-3 flex flex-wrap gap-2">
                                    {popularTags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="win95-outset bg-white px-2 py-0.5 text-[11px] font-bold"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>

                {/* Sidebar Overlay - mobile only */}
                <div
                    className={`fixed inset-0 z-50 transition-opacity duration-200 lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />

                    {/* Sidebar Content */}
                    <div className="relative flex flex-col h-full p-4 overflow-y-auto">
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="mc-btn !p-2"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="space-y-4 max-w-sm mx-auto w-full">
                            {/* Hackathons section */}
                            <section className="win95-outset bg-[#c0c0c0] win-shadow">
                                <div className="bg-[#808080] flex justify-between items-center px-1 py-0.5">
                                    <div className="flex items-center gap-1 text-white text-[11px] font-bold uppercase">
                                        <span className="text-[10px]">&#9889;</span> Hackathons
                                    </div>
                                </div>
                                <div className="p-2 space-y-2">
                                    {recentHackathons.length === 0 ? (
                                        <p className="text-[10px] text-[#333] text-center py-2">No hackathons posted yet.</p>
                                    ) : (
                                        recentHackathons.map((hack) => {
                                            const date = hack.event_date ? new Date(hack.event_date) : new Date(hack.created_at);
                                            const month = date.toLocaleString('default', { month: 'short' });
                                            const day = date.getDate();
                                            return (
                                                <Link
                                                    key={hack.id}
                                                    href={`/posts/${hack.id}`}
                                                    className="win95-inset p-2 flex gap-3 bg-white block"
                                                >
                                                    <div className="bg-[#404040] text-white flex flex-col items-center justify-center w-12 h-12 border border-black shrink-0">
                                                        <span className="text-[10px] uppercase font-bold leading-none">{month}</span>
                                                        <span className="text-xl font-bold leading-none">{day}</span>
                                                    </div>
                                                    <div className="overflow-hidden min-w-0">
                                                        <h3 className="text-[11px] font-bold truncate uppercase">{hack.title}</h3>
                                                        <p className="text-[10px] text-[#666] truncate">{hack.content}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    )}
                                    <Link
                                        href="/hackathons"
                                        className="mc-btn w-full text-center text-[11px] !py-1"
                                    >
                                        See Quest Board
                                    </Link>
                                </div>
                            </section>

                            {/* Server Rules */}
                            <section className="win95-outset bg-[#c0c0c0] win-shadow">
                                <div className="bg-[#808080] flex justify-between items-center px-1 py-0.5">
                                    <div className="flex items-center gap-1 text-white text-[11px] font-bold uppercase">
                                        <span className="text-[10px]">&#128203;</span> Server Rules
                                    </div>
                                </div>
                                <div className="p-3 text-[11px]">
                                    <p className="mb-3 text-[#333] leading-tight">
                                        Respect fellow developers and keep discussions technical. No griefing!
                                    </p>
                                    <ul className="space-y-1">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-700 font-bold">&#10003;</span>
                                            <span className="uppercase text-[11px] font-bold">No Spam/Promo</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-700 font-bold">&#10003;</span>
                                            <span className="uppercase text-[11px] font-bold">Post Snippets</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Popular Tags */}
                            {popularTags.length > 0 && (
                                <section className="win95-outset bg-[#c0c0c0] win-shadow">
                                    <div className="bg-[#808080] flex justify-between items-center px-1 py-0.5">
                                        <div className="flex items-center gap-1 text-white text-[11px] font-bold uppercase">
                                            <span className="text-[10px]">&#127991;</span> Popular Tags
                                        </div>
                                    </div>
                                    <div className="p-3 flex flex-wrap gap-2">
                                        {popularTags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="win95-outset bg-white px-2 py-0.5 text-[11px] font-bold"
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
        </AppLayout>
    );
}
