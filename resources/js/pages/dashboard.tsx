import { Head, Link } from '@inertiajs/react';
import { Bell, Clock, Minus, Plus, Square, X } from 'lucide-react';
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

export default function Dashboard({ recentPosts, announcements, pendingCount, popularTags, recentHackathons }: Props) {
    const [showPending, setShowPending] = useState(pendingCount > 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto bg-[#008080]">
                {/* Win95 Title Bar */}
                <div className="win95-titlebar px-2 py-[2px]">
                    <span className="text-[11px] mr-2"></span>
                    <h1 className="text-[12px] font-bold tracking-wider uppercase flex-1">
                        C:\COMMUNITY_LOG.TXT
                    </h1>
                    <div className="flex items-center gap-2">
                        <button type="button" className="relative win95-raised size-[16px] flex items-center justify-center bg-[#c0c0c0]">
                            <Bell className={`size-[10px] ${recentPosts.length > 0 ? 'text-[#c0392b] animate-[wiggle_1s_ease-in-out_3]' : 'text-black'}`} />
                            {recentPosts.length > 0 && (
                                <>
                                    <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center animate-pulse bg-[#c0392b] text-[7px] font-bold text-white border border-[#a02020]">
                                        {recentPosts.length}
                                    </span>
                                    <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-[#c0392b] animate-ping opacity-75" />
                                </>
                            )}
                        </button>
                        <Link href="/posts/create" className="mc-btn text-[11px] !py-0.5 !px-2">
                            <Plus className="size-3 mr-1" />
                            New Post
                        </Link>
                    </div>
                </div>

                <div className="flex flex-1 gap-0">
                    {/* Main feed */}
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                        {/* Pending banner */}
                        {showPending && pendingCount > 0 && (
                            <div className="win95-window">
                                <div className="win95-titlebar mb-[2px]">
                                    <span className="text-[11px] flex-1">⏳ Status</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowPending(false)}
                                        className="win95-raised size-[14px] flex items-center justify-center bg-[#c0c0c0]"
                                    >
                                        <X className="size-[8px] text-black" />
                                    </button>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-start gap-3">
                                        <Clock className="size-4 shrink-0 text-black mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-bold uppercase text-black text-xs">
                                                Post Submission Pending...
                                            </h3>
                                            <p className="text-[11px] text-[#333] mt-1">
                                                The moderators are currently reviewing your scroll{pendingCount > 1 ? 's' : ''}.
                                                Hang tight!
                                            </p>
                                            <div className="win95-sunken mt-2 h-4 bg-white">
                                                <div className="h-full bg-black" style={{ width: '60%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Post feed */}
                        {recentPosts.length === 0 ? (
                            <div className="win95-window p-4 text-center text-[#333] text-xs">
                                No posts yet. Be the first to craft one!
                            </div>
                        ) : (
                            recentPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div className="hidden lg:block w-72 xl:w-80 p-3 space-y-3 overflow-y-auto bg-[#c0c0c0] border-l-2 border-l-[#ffffff] shadow-[inset_1px_0_0_#808080]">
                        {/* Hackathons section */}
                        <div className="win95-window">
                            <div className="win95-titlebar mb-[2px]">
                                <span className="text-[11px]">⚔ Hackathons</span>
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
                                                className="win95-sunken bg-white p-2 flex items-center gap-3 cursor-pointer hover:brightness-95 active:brightness-90 block"
                                            >
                                                <div className="shrink-0 w-11 text-center bg-[#2d3748] border border-[#1a202c] overflow-hidden">
                                                    <div className="bg-[#374151] px-1.5 py-[2px] text-[8px] font-bold text-white/80 uppercase tracking-wider border-b border-[#1a202c]">
                                                        {month}
                                                    </div>
                                                    <div className="text-[18px] font-black leading-none text-white py-1">{day}</div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-bold uppercase text-black truncate">{hack.title}</p>
                                                    <p className="text-[10px] text-[#333] truncate">{hack.content}</p>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                            <div className="px-2 pb-2">
                                <Link
                                    href="/hackathons"
                                    className="mc-btn w-full text-center text-[11px] !py-1"
                                >
                                    See Quest Board
                                </Link>
                            </div>
                        </div>

                        {/* Server rules */}
                        <div className="win95-window">
                            <div className="win95-titlebar mb-[2px]">
                                <span className="text-[11px]">📋 Server Rules</span>
                            </div>
                            <div className="p-2">
                                <p className="text-[11px] text-[#333] leading-relaxed mb-2">
                                    Respect fellow developers and keep discussions technical.
                                    No griefing!
                                </p>
                                <div className="space-y-1 text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#008080] font-bold">✓</span>
                                        <span className="uppercase font-bold text-black">No Spam/Promo</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#008080] font-bold">✓</span>
                                        <span className="uppercase font-bold text-black">Post Snippets</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Popular tags */}
                        {popularTags.length > 0 && (
                            <div className="win95-window">
                                <div className="win95-titlebar mb-[2px]">
                                    <span className="text-[11px]">🏷️ Popular Tags</span>
                                </div>
                                <div className="p-2">
                                    <div className="flex flex-wrap gap-1.5">
                                        {popularTags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="win95-sunken bg-white inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-black"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
