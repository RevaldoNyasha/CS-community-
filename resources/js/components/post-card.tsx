import { Link, router } from '@inertiajs/react';
import { Heart, MessageSquare, Share2, Square, User as UserIcon, X } from 'lucide-react';
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
            <div className="post-card">
                {/* Win95 Title Bar */}
                <div className="win95-titlebar mb-[2px]">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[11px]">📄</span>
                        <span className="truncate text-[11px]">
                            {post.user?.name ?? 'Unknown'} - {roleLabel} • {timeAgo(post.created_at)}
                        </span>
                    </div>
                    <div className="flex items-center gap-[2px] ml-2">
                        <button
                            type="button"
                            onClick={() => setDetailOpen(true)}
                            className="win95-raised size-[14px] flex items-center justify-center bg-[#c0c0c0]"
                            title="View post"
                        >
                            <Square className="size-[7px] text-black" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setDismissed(true)}
                            className="win95-raised size-[14px] flex items-center justify-center bg-[#c0c0c0]"
                            title="Dismiss"
                        >
                            <X className="size-[8px] text-black" />
                        </button>
                    </div>
                </div>

                {/* Window Content */}
                <div className="p-3">
                    {/* Title */}
                    <Link href={`/posts/${post.id}`} className="block">
                        <h3 className="text-[14px] font-black uppercase tracking-wide mb-2 text-black hover:underline">
                            {post.title}
                        </h3>
                    </Link>

                    {/* Content snippet in sunken white panel */}
                    <div className="win95-sunken bg-white p-2 mb-3">
                        <p className="text-[12px] text-[#1a1a1a] font-semibold line-clamp-3 leading-relaxed">
                            {post.content}
                        </p>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="win95-sunken inline-flex items-center bg-white px-2 py-0.5 text-[11px] font-bold text-[#000080]"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer: comments, likes, share — on the gray card surface */}
                    <div className="flex items-center gap-4 pt-1 text-[11px] border-t border-[#808080]">
                        <Link
                            href={`/posts/${post.id}`}
                            className="flex items-center gap-1 text-black hover:underline"
                        >
                            <MessageSquare className="size-3" />
                            <span className="font-bold uppercase">
                                {post.comments_count ?? 0} Comments
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleLike}
                            className={`flex items-center gap-1 ${post.is_liked
                                ? 'text-[#c0392b]'
                                : 'text-[#333] hover:text-[#c0392b]'
                                }`}
                        >
                            <Heart className={`size-3 ${post.is_liked ? 'fill-current' : ''}`} />
                            <span className="font-bold uppercase">
                                {post.likes_count ?? 0} Likes
                            </span>
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
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="win95-window !p-0 !gap-0 !bg-[#c0c0c0] !border-0 sm:max-w-2xl max-h-[80vh] overflow-hidden">
                    <DialogTitle className="sr-only">{post.title}</DialogTitle>

                    {/* Modal Title Bar */}
                    <div className="win95-titlebar">
                        <span className="text-[11px] mr-2">📄</span>
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
                                    <UserIcon className="size-5 text-black" />
                                </div>
                                <div>
                                    <p className="font-bold text-[13px] text-black">{post.user?.name ?? 'Unknown'}</p>
                                    <p className="text-[11px] text-[#333]">
                                        {roleLabel} • Posted {timeAgo(post.created_at)}
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
                                        className="win95-sunken inline-flex items-center bg-white px-2 py-0.5 text-[11px] font-bold text-black"
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
