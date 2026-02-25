import { Link, router } from '@inertiajs/react';
import { MoreVertical, ThumbsUp } from 'lucide-react';
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

/* Deterministic color for the squared avatar */
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

/* Get first two uppercase chars for the squared avatar */
function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

export default function PostCard({ post }: Props) {
    const [detailOpen, setDetailOpen] = useState(false);

    function handleLike(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/posts/${post.id}/like`, {}, { preserveScroll: true });
    }

    function handleCardClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDetailOpen(true);
    }

    const authorName = post.user?.name ?? 'Unknown';
    const style = avatarColor(authorName);
    const image = post.attachment_is_image && post.attachment_url ? post.attachment_url : null;

    return (
        <>
            <article className="bg-card border border-border rounded-lg overflow-hidden shadow-2xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer" onClick={handleCardClick}>
                <div className="p-6">
                    {/* ── Header ── */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {/* Circular monogram avatar */}
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 select-none shadow-md"
                                style={{ backgroundColor: style.bg, color: style.text }}
                            >
                                {initials(authorName)}
                            </div>
                            <div>
                                <Link href={`/posts/${post.id}`}>
                                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">
                                        {post.title}
                                    </h4>
                                </Link>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {authorName} · {timeAgo(post.created_at)}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDetailOpen(true)}
                            className="text-muted-foreground/50 hover:text-foreground transition-colors p-1"
                        >
                            <MoreVertical className="size-4" />
                        </button>
                    </div>

                    {/* ── Image ── */}
                    {image && (
                        <div className="mt-4" onClick={(e) => { e.stopPropagation(); }}>
                            <img src={image} alt={post.title} className="w-full rounded-md object-cover max-h-56" />
                        </div>
                    )}

                    {/* ── Body ── */}
                    {post.content && (
                        <div className="mt-4">
                            <p className="text-secondary-foreground leading-relaxed text-sm line-clamp-4">
                                {post.content}
                            </p>
                        </div>
                    )}

                    {/* ── Tags ── */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.slice(0, 1).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-2 py-0.5 text-primary text-[10px] font-bold uppercase tracking-wider"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                            {post.tags.slice(1).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-2 py-0.5 text-muted-foreground text-[10px] font-bold rounded uppercase tracking-wider"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* ── Footer ── */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center gap-6 text-muted-foreground">
                        <button
                            type="button"
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 hover:text-red-400 transition-colors text-[11px] font-bold uppercase tracking-wider ${post.is_liked ? 'text-red-400' : ''}`}
                        >
                            <ThumbsUp className={`size-[18px] ${post.is_liked ? 'fill-current' : ''}`} />
                            {post.likes_count ?? 0}
                        </button>
                        <Link
                            href={`/posts/${post.id}`}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors text-[11px] font-bold uppercase tracking-wider"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                            {(post.comments_count ?? 0) > 0 ? `${post.comments_count} Comments` : 'Comments'}
                        </Link>
                    </div>
                </div>
            </article>

            {/* ── Detail Modal ── */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="!p-0 !gap-0 bg-card border border-border sm:max-w-2xl max-h-[85vh] overflow-hidden rounded-lg">
                    <DialogTitle className="sr-only">{post.title}</DialogTitle>

                    <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 select-none shadow-md"
                            style={{ backgroundColor: style.bg, color: style.text }}
                        >
                            {initials(authorName)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{post.title}</p>
                            <p className="text-[11px] text-muted-foreground">{authorName} · {timeAgo(post.created_at)}</p>
                        </div>
                    </div>

                    {image && <img src={image} alt={post.title} className="w-full object-cover max-h-56" />}

                    <div className="p-5 overflow-y-auto">
                        <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap mb-4">
                            {post.content}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag) => (
                                    <span key={tag.id} className="px-2 py-0.5 text-muted-foreground text-[10px] font-bold rounded uppercase tracking-wider">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-5 pt-3 border-t border-border text-muted-foreground">
                            <button
                                type="button"
                                onClick={handleLike}
                                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-red-400 ${post.is_liked ? 'text-red-400' : ''}`}
                            >
                                <ThumbsUp className={`size-4 ${post.is_liked ? 'fill-current' : ''}`} />
                                {post.likes_count ?? 0} Likes
                            </button>
                            <Link
                                href={`/posts/${post.id}`}
                                className="ml-auto text-xs text-primary hover:text-primary/80 font-bold uppercase tracking-wider"
                            >
                                Open →
                            </Link>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
