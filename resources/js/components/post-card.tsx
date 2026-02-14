import { Link, router } from '@inertiajs/react';
import { Heart, MessageSquare, Minus, Share2, Square, X } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { timeAgo } from '@/lib/time-ago';
import type { Post } from '@/types';

type Props = {
    post: Post;
};

export default function PostCard({ post }: Props) {
    const [dismissed, setDismissed] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);

    function handleLike(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/posts/${post.id}/like`, {}, { preserveScroll: true });
    }

    function handleShare(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.origin + `/posts/${post.id}`);
    }

    const roleLabel =
        post.type === 'resource'
            ? 'Redstone Engineer'
            : post.type === 'hackathon'
                ? 'Builder'
                : 'Admin';

    if (dismissed) return null;

    return (
        <>
            <article className="win95-outset bg-[#c0c0c0] win-shadow">
                {/* Win95 Title Bar - active (blue) for first post, inactive (gray) for rest */}
                <div className="bg-[#808080] flex justify-between items-center px-1 py-0.5">
                    <div className="flex items-center gap-1 text-white text-[11px] min-w-0">
                        <span className="text-[10px] shrink-0">&#128196;</span>
                        <span className="font-bold truncate">
                            {post.user?.name ?? 'Unknown'} - {roleLabel} &bull; {timeAgo(post.created_at)}
                        </span>
                    </div>
                    <div className="flex gap-[2px] shrink-0 ml-2">
                        <button
                            type="button"
                            onClick={() => setMinimized(!minimized)}
                            className="win95-outset bg-[#c0c0c0] w-4 h-4 flex items-center justify-center active:win95-inset"
                            title={minimized ? 'Restore' : 'Minimize'}
                        >
                            <Minus className="size-[8px] text-black" strokeWidth={3} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setDetailOpen(true)}
                            className="win95-outset bg-[#c0c0c0] w-4 h-4 flex items-center justify-center active:win95-inset"
                            title="View post"
                        >
                            <Square className="size-[7px] text-black" strokeWidth={3} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setDismissed(true)}
                            className="win95-outset bg-[#c0c0c0] w-4 h-4 flex items-center justify-center active:win95-inset"
                            title="Close"
                        >
                            <X className="size-[8px] text-black" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Window Content - collapsible */}
                {!minimized && (
                    <div className="p-3">
                        {/* Title */}
                        <Link href={`/posts/${post.id}`} className="block">
                            <h2 className="text-lg font-bold mb-2 uppercase text-black hover:underline">
                                {post.title}
                            </h2>
                        </Link>

                        {/* Content snippet in sunken white panel */}
                        <div className="win95-inset p-3 mb-3 min-h-[60px] text-[12px]">
                            <p className="text-[#1a1a1a] line-clamp-4 leading-relaxed">
                                {post.content}
                            </p>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="win95-outset bg-[#c0c0c0] px-2 py-0.5 text-[11px] font-bold text-black"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Footer: comments, likes, share */}
                        <div className="flex justify-between items-center border-t border-[#808080] pt-3">
                            <div className="flex gap-4">
                                <Link
                                    href={`/posts/${post.id}`}
                                    className="flex items-center gap-1 text-[11px] uppercase font-bold text-[#333] hover:text-black"
                                >
                                    <MessageSquare className="size-[14px]" />
                                    {post.comments_count ?? 0} Comments
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLike}
                                    className={`flex items-center gap-1 text-[11px] uppercase font-bold ${post.is_liked
                                        ? 'text-[#c0392b]'
                                        : 'text-[#c0392b] hover:text-[#a02020]'
                                        }`}
                                >
                                    <Heart className={`size-[14px] ${post.is_liked ? 'fill-current' : ''}`} />
                                    {post.likes_count ?? 0} Likes
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleShare}
                                className="mc-btn !py-1 !px-2 text-[11px] flex items-center gap-1"
                            >
                                <Share2 className="size-[14px]" />
                                SHARE
                            </button>
                        </div>
                    </div>
                )}
            </article>

            {/* Detail Modal */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="win95-window !p-0 !gap-0 !bg-[#c0c0c0] !border-0 sm:max-w-2xl max-h-[80vh] overflow-hidden">
                    <DialogTitle className="sr-only">{post.title}</DialogTitle>

                    {/* Modal Title Bar */}
                    <div className="win95-titlebar">
                        <span className="text-[11px] mr-2">&#128196;</span>
                        <span className="text-[12px] font-bold uppercase flex-1 truncate">
                            {post.title}
                        </span>
                        <button
                            type="button"
                            onClick={() => setDetailOpen(false)}
                            className="win95-raised size-[14px] flex items-center justify-center bg-[#c0c0c0]"
                        >
                            <X className="size-[8px] text-black" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4 overflow-y-auto max-h-[70vh]">
                        {/* Author info */}
                        <div className="win95-sunken bg-white p-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="win95-raised flex size-10 shrink-0 items-center justify-center bg-[#c0c0c0]">
                                    <span className="text-lg">&#128196;</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[13px] text-black">{post.user?.name ?? 'Unknown'}</p>
                                    <p className="text-[11px] text-[#333]">
                                        {roleLabel} &bull; Posted {timeAgo(post.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-[15px] font-black uppercase tracking-wide mb-3 text-black">
                            {post.title}
                        </h2>

                        {/* Full content */}
                        <div className="win95-sunken bg-white p-3 mb-3">
                            <p className="text-[12px] text-black font-medium leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </p>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="win95-outset bg-[#c0c0c0] inline-flex items-center px-2 py-0.5 text-[11px] font-bold text-black"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="win95-sunken bg-white flex items-center gap-4 p-2 text-[11px] mb-3">
                            <span className="flex items-center gap-1 text-black">
                                <MessageSquare className="size-3" />
                                <span className="font-bold uppercase">{post.comments_count ?? 0} Comments</span>
                            </span>
                            <button
                                type="button"
                                onClick={handleLike}
                                className={`flex items-center gap-1 ${post.is_liked ? 'text-[#c0392b]' : 'text-[#333] hover:text-[#c0392b]'
                                    }`}
                            >
                                <Heart className={`size-3 ${post.is_liked ? 'fill-current' : ''}`} />
                                <span className="font-bold uppercase">{post.likes_count ?? 0} Likes</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleShare}
                                className="flex items-center gap-1 text-[#333] hover:text-black ml-auto"
                            >
                                <Share2 className="size-3" />
                                <span className="font-bold uppercase">Share</span>
                            </button>
                        </div>

                        {/* View full page button */}
                        <div className="flex justify-end gap-2">
                            <Link href={`/posts/${post.id}`} className="mc-btn text-[11px] !py-1 !px-3">
                                Open Full Page
                            </Link>
                            <button
                                type="button"
                                onClick={() => setDetailOpen(false)}
                                className="mc-btn text-[11px] !py-1 !px-3"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
